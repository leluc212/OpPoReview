# Deploy Application API - Simple version without Cognito

Write-Host "Deploying Application API..." -ForegroundColor Cyan

$REGION = "us-east-1"
$LAMBDA_NAME = "ApplicationLambda"
$API_NAME = "ApplicationAPI"

# Step 1: Check if IAM role exists
Write-Host "`nStep 1: Checking IAM Role..." -ForegroundColor Yellow
$ROLE_NAME = "ApplicationLambdaRole"
$roleCheck = aws iam get-role --role-name $ROLE_NAME 2>$null

if ($roleCheck) {
    $ROLE_ARN = ($roleCheck | ConvertFrom-Json).Role.Arn
    Write-Host "Using existing role: $ROLE_ARN" -ForegroundColor Green
} else {
    Write-Host "Role not found. Creating..." -ForegroundColor Yellow
    
    # Create trust policy file
    @'
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
'@ | Out-File -FilePath trust-policy-temp.json -Encoding utf8
    
    $roleResult = aws iam create-role --role-name $ROLE_NAME --assume-role-policy-document file://trust-policy-temp.json | ConvertFrom-Json
    $ROLE_ARN = $roleResult.Role.Arn
    Write-Host "Role created: $ROLE_ARN" -ForegroundColor Green
    
    # Attach basic execution policy
    aws iam attach-role-policy --role-name $ROLE_NAME --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    
    # Create DynamoDB policy
    @"
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
        "arn:aws:dynamodb:us-east-1:*:table/Applications",
        "arn:aws:dynamodb:us-east-1:*:table/Applications/index/*",
        "arn:aws:dynamodb:us-east-1:*:table/PostStandardJob",
        "arn:aws:dynamodb:us-east-1:*:table/PostQuickJob"
      ]
    }
  ]
}
"@ | Out-File -FilePath dynamo-policy-temp.json -Encoding utf8
    
    aws iam put-role-policy --role-name $ROLE_NAME --policy-name DynamoDBAccess --policy-document file://dynamo-policy-temp.json
    
    Write-Host "Waiting 10 seconds for role to propagate..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    Remove-Item trust-policy-temp.json -ErrorAction SilentlyContinue
    Remove-Item dynamo-policy-temp.json -ErrorAction SilentlyContinue
}

# Step 2: Package Lambda
Write-Host "`nStep 2: Packaging Lambda..." -ForegroundColor Yellow
if (Test-Path application-lambda.zip) {
    Remove-Item application-lambda.zip
}
Compress-Archive -Path amplify/backend/application-lambda.py -DestinationPath application-lambda.zip
Write-Host "Lambda packaged" -ForegroundColor Green

# Step 3: Deploy Lambda
Write-Host "`nStep 3: Deploying Lambda..." -ForegroundColor Yellow
$lambdaCheck = aws lambda get-function --function-name $LAMBDA_NAME --region $REGION 2>$null

if ($lambdaCheck) {
    Write-Host "Updating existing Lambda..." -ForegroundColor Yellow
    aws lambda update-function-code --function-name $LAMBDA_NAME --zip-file fileb://application-lambda.zip --region $REGION
    Write-Host "Lambda updated" -ForegroundColor Green
} else {
    Write-Host "Creating new Lambda..." -ForegroundColor Yellow
    aws lambda create-function --function-name $LAMBDA_NAME --runtime python3.9 --role $ROLE_ARN --handler application-lambda.lambda_handler --zip-file fileb://application-lambda.zip --timeout 30 --memory-size 256 --region $REGION
    Write-Host "Lambda created" -ForegroundColor Green
}

# Step 4: Create API Gateway
Write-Host "`nStep 4: Creating API Gateway..." -ForegroundColor Yellow
$apis = aws apigatewayv2 get-apis --region $REGION | ConvertFrom-Json
$existingApi = $apis.Items | Where-Object { $_.Name -eq $API_NAME }

if ($existingApi) {
    $API_ID = $existingApi.ApiId
    Write-Host "Using existing API: $API_ID" -ForegroundColor Green
} else {
    $apiResult = aws apigatewayv2 create-api --name $API_NAME --protocol-type HTTP --cors-configuration "AllowOrigins=*,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,AllowHeaders=*" --region $REGION | ConvertFrom-Json
    $API_ID = $apiResult.ApiId
    Write-Host "API created: $API_ID" -ForegroundColor Green
}

# Step 5: Create Integration
Write-Host "`nStep 5: Creating Integration..." -ForegroundColor Yellow
$LAMBDA_ARN = (aws lambda get-function --function-name $LAMBDA_NAME --region $REGION | ConvertFrom-Json).Configuration.FunctionArn

$integrations = aws apigatewayv2 get-integrations --api-id $API_ID --region $REGION | ConvertFrom-Json
$existingIntegration = $integrations.Items | Where-Object { $_.IntegrationUri -eq $LAMBDA_ARN }

if ($existingIntegration) {
    $INTEGRATION_ID = $existingIntegration.IntegrationId
    Write-Host "Using existing integration: $INTEGRATION_ID" -ForegroundColor Green
} else {
    $integrationResult = aws apigatewayv2 create-integration --api-id $API_ID --integration-type AWS_PROXY --integration-uri $LAMBDA_ARN --payload-format-version 2.0 --region $REGION | ConvertFrom-Json
    $INTEGRATION_ID = $integrationResult.IntegrationId
    Write-Host "Integration created: $INTEGRATION_ID" -ForegroundColor Green
    
    # Grant permission
    $sourceArn = "arn:aws:execute-api:us-east-1:*:${API_ID}/*/*"
    aws lambda add-permission --function-name $LAMBDA_NAME --statement-id apigateway-invoke-app --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn $sourceArn --region $REGION 2>$null
    Write-Host "Lambda permission granted" -ForegroundColor Green
}

# Step 6: Create Routes
Write-Host "`nStep 6: Creating Routes..." -ForegroundColor Yellow

$routes = @(
    "POST /applications",
    "GET /applications/candidate/{candidateId}",
    "GET /applications/job/{jobId}",
    "PUT /applications/{applicationId}/status",
    "OPTIONS /applications"
)

foreach ($routeKey in $routes) {
    Write-Host "  Creating: $routeKey" -ForegroundColor Gray
    
    $existingRoutes = aws apigatewayv2 get-routes --api-id $API_ID --region $REGION | ConvertFrom-Json
    $existingRoute = $existingRoutes.Items | Where-Object { $_.RouteKey -eq $routeKey }
    
    if ($existingRoute) {
        Write-Host "    Already exists" -ForegroundColor Gray
    } else {
        aws apigatewayv2 create-route --api-id $API_ID --route-key $routeKey --target "integrations/$INTEGRATION_ID" --region $REGION | Out-Null
        Write-Host "    Created" -ForegroundColor Green
    }
}

# Step 7: Create Stage
Write-Host "`nStep 7: Creating Stage..." -ForegroundColor Yellow
$stages = aws apigatewayv2 get-stages --api-id $API_ID --region $REGION | ConvertFrom-Json
$defaultStage = $stages.Items | Where-Object { $_.StageName -eq '$default' }

if ($defaultStage) {
    Write-Host "Stage exists" -ForegroundColor Green
} else {
    aws apigatewayv2 create-stage --api-id $API_ID --stage-name '$default' --auto-deploy --region $REGION
    Write-Host "Stage created" -ForegroundColor Green
}

# Cleanup
Remove-Item application-lambda.zip -ErrorAction SilentlyContinue

# Final output
$API_ENDPOINT = "https://${API_ID}.execute-api.us-east-1.amazonaws.com"

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "Application API Deployed Successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "`nAPI Endpoint: $API_ENDPOINT" -ForegroundColor Cyan
Write-Host "`nUpdate this in src/services/applicationService.js:" -ForegroundColor Yellow
Write-Host "const API_ENDPOINT = '$API_ENDPOINT';" -ForegroundColor White
Write-Host "`nTest with: test-application-api.html" -ForegroundColor Yellow
