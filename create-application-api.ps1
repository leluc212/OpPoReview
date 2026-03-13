# Script to create Applications API with Lambda and DynamoDB

Write-Host "🚀 Creating Applications API..." -ForegroundColor Cyan

# Variables
$REGION = "us-east-1"
$LAMBDA_NAME = "ApplicationLambda"
$TABLE_NAME = "Applications"
$API_NAME = "ApplicationAPI"
$ROLE_NAME = "ApplicationLambdaRole"

# Step 1: Create DynamoDB Table
Write-Host "`n📊 Step 1: Creating DynamoDB Table..." -ForegroundColor Yellow
$tableExists = aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION 2>$null
if ($tableExists) {
    Write-Host "✅ Table $TABLE_NAME already exists" -ForegroundColor Green
} else {
    aws dynamodb create-table `
        --table-name $TABLE_NAME `
        --attribute-definitions `
            AttributeName=applicationId,AttributeType=S `
            AttributeName=candidateId,AttributeType=S `
            AttributeName=jobId,AttributeType=S `
            AttributeName=appliedAt,AttributeType=S `
        --key-schema `
            AttributeName=applicationId,KeyType=HASH `
        --global-secondary-indexes `
            '[{"IndexName":"CandidateIndex","KeySchema":[{"AttributeName":"candidateId","KeyType":"HASH"},{"AttributeName":"appliedAt","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"},"ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":5}},{"IndexName":"JobIndex","KeySchema":[{"AttributeName":"jobId","KeyType":"HASH"},{"AttributeName":"appliedAt","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"},"ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":5}}]' `
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 `
        --region $REGION
    
    Write-Host "⏳ Waiting for table to be active..." -ForegroundColor Yellow
    aws dynamodb wait table-exists --table-name $TABLE_NAME --region $REGION
    Write-Host "✅ Table created successfully" -ForegroundColor Green
}

# Step 2: Create IAM Role for Lambda
Write-Host "`n🔐 Step 2: Creating IAM Role..." -ForegroundColor Yellow
$roleExists = aws iam get-role --role-name $ROLE_NAME 2>$null
if ($roleExists) {
    Write-Host "✅ Role $ROLE_NAME already exists" -ForegroundColor Green
    $ROLE_ARN = ($roleExists | ConvertFrom-Json).Role.Arn
} else {
    $trustPolicy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
"@
    
    $trustPolicy | Out-File -FilePath trust-policy.json -Encoding utf8
    
    $roleResult = aws iam create-role `
        --role-name $ROLE_NAME `
        --assume-role-policy-document file://trust-policy.json `
        --region $REGION | ConvertFrom-Json
    
    $ROLE_ARN = $roleResult.Role.Arn
    Write-Host "✅ Role created: $ROLE_ARN" -ForegroundColor Green
    
    # Attach policies
    aws iam attach-role-policy `
        --role-name $ROLE_NAME `
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    
    # Create and attach DynamoDB policy
    $dynamoPolicy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:${REGION}:*:table/${TABLE_NAME}",
        "arn:aws:dynamodb:${REGION}:*:table/${TABLE_NAME}/index/*",
        "arn:aws:dynamodb:${REGION}:*:table/PostStandardJob",
        "arn:aws:dynamodb:${REGION}:*:table/PostQuickJob"
      ]
    }
  ]
}
"@
    
    $dynamoPolicy | Out-File -FilePath dynamo-policy.json -Encoding utf8
    
    aws iam put-role-policy `
        --role-name $ROLE_NAME `
        --policy-name DynamoDBAccess `
        --policy-document file://dynamo-policy.json
    
    Write-Host "⏳ Waiting for role to propagate..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

# Step 3: Package and Deploy Lambda
Write-Host "`n📦 Step 3: Packaging Lambda..." -ForegroundColor Yellow
if (Test-Path application-lambda.zip) {
    Remove-Item application-lambda.zip
}

Compress-Archive -Path amplify/backend/application-lambda.py -DestinationPath application-lambda.zip
Write-Host "✅ Lambda packaged" -ForegroundColor Green

# Step 4: Create or Update Lambda Function
Write-Host "`n🔧 Step 4: Deploying Lambda..." -ForegroundColor Yellow
$lambdaExists = aws lambda get-function --function-name $LAMBDA_NAME --region $REGION 2>$null
if ($lambdaExists) {
    Write-Host "📝 Updating existing Lambda..." -ForegroundColor Yellow
    aws lambda update-function-code `
        --function-name $LAMBDA_NAME `
        --zip-file fileb://application-lambda.zip `
        --region $REGION
} else {
    Write-Host "🆕 Creating new Lambda..." -ForegroundColor Yellow
    aws lambda create-function `
        --function-name $LAMBDA_NAME `
        --runtime python3.9 `
        --role $ROLE_ARN `
        --handler application-lambda.lambda_handler `
        --zip-file fileb://application-lambda.zip `
        --timeout 30 `
        --memory-size 256 `
        --region $REGION
}

Write-Host "✅ Lambda deployed successfully" -ForegroundColor Green

# Step 5: Get User Pool ID and create authorizer
Write-Host "`n🔍 Step 5: Getting Cognito User Pool..." -ForegroundColor Yellow
$userPools = aws cognito-idp list-user-pools --max-results 10 --region $REGION | ConvertFrom-Json
$userPool = $userPools.UserPools | Where-Object { $_.Name -like "*amplify*" -or $_.Name -like "*kfc*" } | Select-Object -First 1

if ($userPool) {
    $USER_POOL_ID = $userPool.Id
    Write-Host "✅ Found User Pool: $USER_POOL_ID" -ForegroundColor Green
} else {
    Write-Host "❌ No User Pool found" -ForegroundColor Red
    exit 1
}

# Step 6: Create API Gateway
Write-Host "`n🌐 Step 6: Creating API Gateway..." -ForegroundColor Yellow
$apis = aws apigatewayv2 get-apis --region $REGION | ConvertFrom-Json
$existingApi = $apis.Items | Where-Object { $_.Name -eq $API_NAME }

if ($existingApi) {
    $API_ID = $existingApi.ApiId
    Write-Host "✅ Using existing API: $API_ID" -ForegroundColor Green
} else {
    $apiResult = aws apigatewayv2 create-api `
        --name $API_NAME `
        --protocol-type HTTP `
        --cors-configuration "AllowOrigins=*,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,AllowHeaders=Content-Type,Authorization" `
        --region $REGION | ConvertFrom-Json
    
    $API_ID = $apiResult.ApiId
    Write-Host "✅ API created: $API_ID" -ForegroundColor Green
}

# Step 7: Create Authorizer
Write-Host "`n🔐 Step 7: Creating Authorizer..." -ForegroundColor Yellow
$authorizers = aws apigatewayv2 get-authorizers --api-id $API_ID --region $REGION | ConvertFrom-Json
$existingAuth = $authorizers.Items | Where-Object { $_.Name -eq "CognitoAuthorizer" }

if ($existingAuth) {
    $AUTHORIZER_ID = $existingAuth.AuthorizerId
    Write-Host "✅ Using existing authorizer: $AUTHORIZER_ID" -ForegroundColor Green
} else {
    $authResult = aws apigatewayv2 create-authorizer `
        --api-id $API_ID `
        --authorizer-type JWT `
        --identity-source '$request.header.Authorization' `
        --name CognitoAuthorizer `
        --jwt-configuration "Audience=,Issuer=https://cognito-idp.$REGION.amazonaws.com/$USER_POOL_ID" `
        --region $REGION | ConvertFrom-Json
    
    $AUTHORIZER_ID = $authResult.AuthorizerId
    Write-Host "✅ Authorizer created: $AUTHORIZER_ID" -ForegroundColor Green
}

# Step 8: Create Lambda Integration
Write-Host "`n🔗 Step 8: Creating Lambda Integration..." -ForegroundColor Yellow
$integrations = aws apigatewayv2 get-integrations --api-id $API_ID --region $REGION | ConvertFrom-Json
$existingIntegration = $integrations.Items | Where-Object { $_.IntegrationUri -like "*$LAMBDA_NAME*" }

if ($existingIntegration) {
    $INTEGRATION_ID = $existingIntegration.IntegrationId
    Write-Host "✅ Using existing integration: $INTEGRATION_ID" -ForegroundColor Green
} else {
    $LAMBDA_ARN = (aws lambda get-function --function-name $LAMBDA_NAME --region $REGION | ConvertFrom-Json).Configuration.FunctionArn
    
    $integrationResult = aws apigatewayv2 create-integration `
        --api-id $API_ID `
        --integration-type AWS_PROXY `
        --integration-uri $LAMBDA_ARN `
        --payload-format-version 2.0 `
        --region $REGION | ConvertFrom-Json
    
    $INTEGRATION_ID = $integrationResult.IntegrationId
    Write-Host "✅ Integration created: $INTEGRATION_ID" -ForegroundColor Green
    
    # Grant API Gateway permission to invoke Lambda
    aws lambda add-permission `
        --function-name $LAMBDA_NAME `
        --statement-id apigateway-invoke `
        --action lambda:InvokeFunction `
        --principal apigateway.amazonaws.com `
        --source-arn "arn:aws:execute-api:${REGION}:*:${API_ID}/*/*" `
        --region $REGION 2>$null
}

# Step 9: Create Routes
Write-Host "`n🛣️ Step 9: Creating Routes..." -ForegroundColor Yellow

$routes = @(
    @{Method="POST"; Path="/applications"; Auth=$true},
    @{Method="GET"; Path="/applications/candidate/{candidateId}"; Auth=$true},
    @{Method="GET"; Path="/applications/job/{jobId}"; Auth=$true},
    @{Method="PUT"; Path="/applications/{applicationId}/status"; Auth=$true},
    @{Method="OPTIONS"; Path="/applications"; Auth=$false},
    @{Method="OPTIONS"; Path="/applications/candidate/{candidateId}"; Auth=$false},
    @{Method="OPTIONS"; Path="/applications/job/{jobId}"; Auth=$false},
    @{Method="OPTIONS"; Path="/applications/{applicationId}/status"; Auth=$false}
)

foreach ($route in $routes) {
    $routeKey = "$($route.Method) $($route.Path)"
    Write-Host "Creating route: $routeKey" -ForegroundColor Gray
    
    $existingRoutes = aws apigatewayv2 get-routes --api-id $API_ID --region $REGION | ConvertFrom-Json
    $existingRoute = $existingRoutes.Items | Where-Object { $_.RouteKey -eq $routeKey }
    
    if ($existingRoute) {
        Write-Host "  ✓ Route already exists" -ForegroundColor Gray
    } else {
        if ($route.Auth) {
            aws apigatewayv2 create-route `
                --api-id $API_ID `
                --route-key $routeKey `
                --target "integrations/$INTEGRATION_ID" `
                --authorizer-id $AUTHORIZER_ID `
                --authorization-type JWT `
                --region $REGION | Out-Null
        } else {
            aws apigatewayv2 create-route `
                --api-id $API_ID `
                --route-key $routeKey `
                --target "integrations/$INTEGRATION_ID" `
                --region $REGION | Out-Null
        }
        Write-Host "  ✓ Route created" -ForegroundColor Gray
    }
}

# Step 10: Create/Update Stage
Write-Host "`n🎭 Step 10: Creating Stage..." -ForegroundColor Yellow
$stages = aws apigatewayv2 get-stages --api-id $API_ID --region $REGION | ConvertFrom-Json
$existingStage = $stages.Items | Where-Object { $_.StageName -eq '$default' }

if ($existingStage) {
    Write-Host "✅ Stage already exists" -ForegroundColor Green
} else {
    aws apigatewayv2 create-stage `
        --api-id $API_ID `
        --stage-name '$default' `
        --auto-deploy `
        --region $REGION
    Write-Host "✅ Stage created" -ForegroundColor Green
}

# Get API endpoint
$API_ENDPOINT = "https://$API_ID.execute-api.$REGION.amazonaws.com"

Write-Host "`n✅ ============================================" -ForegroundColor Green
Write-Host "✅ Applications API Setup Complete!" -ForegroundColor Green
Write-Host "✅ ============================================" -ForegroundColor Green
Write-Host "`nAPI Endpoint: $API_ENDPOINT" -ForegroundColor Cyan
Write-Host "`nAvailable Endpoints:" -ForegroundColor Yellow
Write-Host "  POST   $API_ENDPOINT/applications" -ForegroundColor White
Write-Host "  GET    $API_ENDPOINT/applications/candidate/{candidateId}" -ForegroundColor White
Write-Host "  GET    $API_ENDPOINT/applications/job/{jobId}" -ForegroundColor White
Write-Host "  PUT    $API_ENDPOINT/applications/{applicationId}/status" -ForegroundColor White
Write-Host "`n📝 Save this endpoint to your frontend config!" -ForegroundColor Yellow

# Cleanup
Remove-Item trust-policy.json -ErrorAction SilentlyContinue
Remove-Item dynamo-policy.json -ErrorAction SilentlyContinue
Remove-Item application-lambda.zip -ErrorAction SilentlyContinue
