# Deploy Package Subscriptions API
$FUNCTION_NAME = "PackageSubscriptionsFunction"
$TABLE_NAME = "PackageSubscriptions"
$REGION = "ap-southeast-1"
$API_NAME = "PackageSubscriptionsAPI"

Write-Host "Deploying Package Subscriptions API..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Create Lambda deployment package
Write-Host "Step 1: Creating Lambda deployment package..." -ForegroundColor Yellow
if (Test-Path "package-subscriptions-lambda.zip") {
    Remove-Item "package-subscriptions-lambda.zip"
}
Compress-Archive -Path "package-subscriptions-lambda.py" -DestinationPath "package-subscriptions-lambda.zip"
Write-Host "Success: Deployment package created" -ForegroundColor Green
Write-Host ""

# Step 2: Get or create IAM role
Write-Host "Step 2: Setting up IAM role..." -ForegroundColor Yellow
$ROLE_NAME = "PackageSubscriptionsLambdaRole"
$roleArn = aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text 2>$null

if (-not $roleArn) {
    Write-Host "Creating IAM role..." -ForegroundColor Yellow
    
    # Create trust policy file
    @"
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
"@ | Out-File -FilePath "lambda-trust-policy-temp.json" -Encoding utf8
    
    aws iam create-role --role-name $ROLE_NAME --assume-role-policy-document file://lambda-trust-policy-temp.json
    
    # Attach basic execution policy
    aws iam attach-role-policy --role-name $ROLE_NAME --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    
    # Create DynamoDB policy file
    $accountId = aws sts get-caller-identity --query 'Account' --output text
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
        "dynamodb:DeleteItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:${REGION}:${accountId}:table/${TABLE_NAME}",
        "arn:aws:dynamodb:${REGION}:${accountId}:table/${TABLE_NAME}/index/*"
      ]
    }
  ]
}
"@ | Out-File -FilePath "dynamodb-policy-temp.json" -Encoding utf8
    
    aws iam put-role-policy --role-name $ROLE_NAME --policy-name "DynamoDBAccess" --policy-document file://dynamodb-policy-temp.json
    
    Remove-Item "lambda-trust-policy-temp.json" -ErrorAction SilentlyContinue
    Remove-Item "dynamodb-policy-temp.json" -ErrorAction SilentlyContinue
    
    Write-Host "Waiting for IAM role to propagate..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    $roleArn = aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text
}

Write-Host "Success: IAM role ready" -ForegroundColor Green
Write-Host "Role ARN: $roleArn" -ForegroundColor White
Write-Host ""

# Step 3: Create or update Lambda function
Write-Host "Step 3: Deploying Lambda function..." -ForegroundColor Yellow
$functionExists = aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>$null

if ($functionExists) {
    Write-Host "Updating existing function..." -ForegroundColor Yellow
    aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://package-subscriptions-lambda.zip --region $REGION | Out-Null
} else {
    Write-Host "Creating new function..." -ForegroundColor Yellow
    aws lambda create-function --function-name $FUNCTION_NAME --runtime python3.11 --role $roleArn --handler package-subscriptions-lambda.lambda_handler --zip-file fileb://package-subscriptions-lambda.zip --timeout 30 --memory-size 256 --region $REGION | Out-Null
    Start-Sleep -Seconds 5
}

Write-Host "Success: Lambda function deployed" -ForegroundColor Green
Write-Host ""

# Step 4: Create API Gateway
Write-Host "Step 4: Setting up API Gateway..." -ForegroundColor Yellow

# Check if API exists
$apiId = aws apigatewayv2 get-apis --region $REGION --query "Items[?Name=='$API_NAME'].ApiId" --output text

if (-not $apiId) {
    Write-Host "Creating new API..." -ForegroundColor Yellow
    $apiId = aws apigatewayv2 create-api --name $API_NAME --protocol-type HTTP --cors-configuration "AllowOrigins=*,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,AllowHeaders=*" --region $REGION --query 'ApiId' --output text
    Write-Host "Success: API created: $apiId" -ForegroundColor Green
} else {
    Write-Host "Success: Using existing API: $apiId" -ForegroundColor Green
}

# Get Lambda ARN
$lambdaArn = aws lambda get-function --function-name $FUNCTION_NAME --region $REGION --query 'Configuration.FunctionArn' --output text

if (-not $lambdaArn) {
    Write-Host "Error: Lambda function not found" -ForegroundColor Red
    exit 1
}

Write-Host "Lambda ARN: $lambdaArn" -ForegroundColor White

# Delete existing integrations and routes
Write-Host "Cleaning up existing routes and integrations..." -ForegroundColor Yellow
$existingIntegrations = aws apigatewayv2 get-integrations --api-id $apiId --region $REGION --query 'Items[].IntegrationId' --output text
if ($existingIntegrations) {
    foreach ($intId in $existingIntegrations -split '\s+') {
        aws apigatewayv2 delete-integration --api-id $apiId --integration-id $intId --region $REGION 2>$null
    }
}

$existingRoutes = aws apigatewayv2 get-routes --api-id $apiId --region $REGION --query 'Items[].RouteId' --output text
if ($existingRoutes) {
    foreach ($routeId in $existingRoutes -split '\s+') {
        aws apigatewayv2 delete-route --api-id $apiId --route-id $routeId --region $REGION 2>$null
    }
}

# Create integration
Write-Host "Creating API integration..." -ForegroundColor Yellow
$integrationId = aws apigatewayv2 create-integration --api-id $apiId --integration-type AWS_PROXY --integration-uri $lambdaArn --payload-format-version 2.0 --region $REGION --query 'IntegrationId' --output text

Write-Host "Success: Integration created: $integrationId" -ForegroundColor Green

# Create routes
Write-Host "Creating API routes..." -ForegroundColor Yellow

$routes = @(
    "GET /subscriptions",
    "GET /subscriptions/employer/{employerId}",
    "POST /subscriptions",
    "PUT /subscriptions/{subscriptionId}",
    "DELETE /subscriptions/{subscriptionId}"
)

foreach ($routeKey in $routes) {
    aws apigatewayv2 create-route --api-id $apiId --route-key $routeKey --target "integrations/$integrationId" --region $REGION | Out-Null
    Write-Host "  Created route: $routeKey" -ForegroundColor White
}

# Create or update default stage
Write-Host "Creating API stage..." -ForegroundColor Yellow
$stageExists = aws apigatewayv2 get-stage --api-id $apiId --stage-name '$default' --region $REGION 2>$null
if (-not $stageExists) {
    aws apigatewayv2 create-stage --api-id $apiId --stage-name '$default' --auto-deploy --region $REGION | Out-Null
}

# Grant API Gateway permission to invoke Lambda
Write-Host "Granting API Gateway permissions..." -ForegroundColor Yellow
$accountId = aws sts get-caller-identity --query 'Account' --output text
$sourceArn = "arn:aws:execute-api:${REGION}:${accountId}:${apiId}/*/*"

aws lambda add-permission --function-name $FUNCTION_NAME --statement-id "apigateway-invoke-$(Get-Random)" --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn $sourceArn --region $REGION 2>$null

Write-Host "Success: API Gateway configured" -ForegroundColor Green
Write-Host ""

# Get API endpoint
$apiEndpoint = "https://${apiId}.execute-api.${REGION}.amazonaws.com"

Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "API Endpoint: $apiEndpoint" -ForegroundColor Cyan
Write-Host ""
Write-Host "Available endpoints:" -ForegroundColor Yellow
Write-Host "  GET    ${apiEndpoint}/subscriptions" -ForegroundColor White
Write-Host "  GET    ${apiEndpoint}/subscriptions/employer/{employerId}" -ForegroundColor White
Write-Host "  POST   ${apiEndpoint}/subscriptions" -ForegroundColor White
Write-Host "  PUT    ${apiEndpoint}/subscriptions/{subscriptionId}" -ForegroundColor White
Write-Host "  DELETE ${apiEndpoint}/subscriptions/{subscriptionId}" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the API using test-package-subscriptions-api.ps1" -ForegroundColor White
Write-Host "2. Update your frontend to use this endpoint" -ForegroundColor White
