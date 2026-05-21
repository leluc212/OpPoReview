# Simple script to create Lambda function for Package Subscriptions

Write-Host "=== Creating Package Subscriptions Lambda ===" -ForegroundColor Cyan

$LAMBDA_NAME = "package-subscriptions-handler"
$TABLE_NAME = "PackageSubscriptions"
$REGION = "ap-southeast-1"

# Step 1: Create Lambda package
Write-Host "`n1. Creating Lambda package..." -ForegroundColor Yellow
Compress-Archive -Path "package-subscriptions-lambda.py" -DestinationPath "package-subscriptions-lambda.zip" -Force
Write-Host "✅ Package created" -ForegroundColor Green

# Step 2: Get or create IAM role
Write-Host "`n2. Setting up IAM role..." -ForegroundColor Yellow

$ROLE_NAME = "lambda-dynamodb-role"
$ROLE_ARN = aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "Role not found, using quick-job-handler-role instead..." -ForegroundColor Yellow
    $ROLE_ARN = aws iam get-role --role-name "quick-job-handler-role" --query 'Role.Arn' --output text
}

Write-Host "Using role: $ROLE_ARN" -ForegroundColor Cyan

# Step 3: Create or update Lambda
Write-Host "`n3. Creating/updating Lambda function..." -ForegroundColor Yellow

$LAMBDA_EXISTS = aws lambda get-function --function-name $LAMBDA_NAME 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Lambda exists, updating code..." -ForegroundColor Yellow
    aws lambda update-function-code `
        --function-name $LAMBDA_NAME `
        --zip-file fileb://package-subscriptions-lambda.zip `
        --region $REGION
    
    Write-Host "Updating environment..." -ForegroundColor Yellow
    aws lambda update-function-configuration `
        --function-name $LAMBDA_NAME `
        --environment "Variables={TABLE_NAME=$TABLE_NAME}" `
        --region $REGION
} else {
    Write-Host "Creating new Lambda..." -ForegroundColor Yellow
    aws lambda create-function `
        --function-name $LAMBDA_NAME `
        --runtime python3.11 `
        --role $ROLE_ARN `
        --handler package-subscriptions-lambda.lambda_handler `
        --zip-file fileb://package-subscriptions-lambda.zip `
        --timeout 30 `
        --memory-size 256 `
        --environment "Variables={TABLE_NAME=$TABLE_NAME}" `
        --region $REGION
}

Write-Host "`n✅ Lambda function ready!" -ForegroundColor Green

# Step 4: Get API info
Write-Host "`n4. Getting API information..." -ForegroundColor Yellow

$API_ID = "p0nd7frlhg"  # From previous deployment
$API_ENDPOINT = "https://${API_ID}.execute-api.${REGION}.amazonaws.com"

Write-Host "API Endpoint: $API_ENDPOINT" -ForegroundColor Cyan

# Step 5: Create integration
Write-Host "`n5. Setting up API integration..." -ForegroundColor Yellow

$LAMBDA_ARN = aws lambda get-function --function-name $LAMBDA_NAME --query 'Configuration.FunctionArn' --output text

# Delete old integration if exists
$OLD_INTEGRATIONS = aws apigatewayv2 get-integrations --api-id $API_ID --query 'Items[].IntegrationId' --output text

if ($OLD_INTEGRATIONS) {
    Write-Host "Cleaning up old integrations..." -ForegroundColor Yellow
    foreach ($INT_ID in $OLD_INTEGRATIONS -split '\s+') {
        if ($INT_ID) {
            aws apigatewayv2 delete-integration --api-id $API_ID --integration-id $INT_ID --region $REGION 2>$null
        }
    }
}

# Create new integration
$INTEGRATION_ID = aws apigatewayv2 create-integration `
    --api-id $API_ID `
    --integration-type AWS_PROXY `
    --integration-uri $LAMBDA_ARN `
    --payload-format-version 2.0 `
    --region $REGION `
    --query 'IntegrationId' `
    --output text

Write-Host "Integration ID: $INTEGRATION_ID" -ForegroundColor Cyan

# Step 6: Delete old routes
Write-Host "`n6. Cleaning up old routes..." -ForegroundColor Yellow
$OLD_ROUTES = aws apigatewayv2 get-routes --api-id $API_ID --query 'Items[].RouteId' --output text

if ($OLD_ROUTES) {
    foreach ($ROUTE_ID in $OLD_ROUTES -split '\s+') {
        if ($ROUTE_ID) {
            aws apigatewayv2 delete-route --api-id $API_ID --route-id $ROUTE_ID --region $REGION 2>$null
        }
    }
}

# Step 7: Create routes
Write-Host "`n7. Creating API routes..." -ForegroundColor Yellow

aws apigatewayv2 create-route --api-id $API_ID --route-key "POST /subscriptions" --target "integrations/$INTEGRATION_ID" --region $REGION | Out-Null
aws apigatewayv2 create-route --api-id $API_ID --route-key "GET /subscriptions" --target "integrations/$INTEGRATION_ID" --region $REGION | Out-Null
aws apigatewayv2 create-route --api-id $API_ID --route-key "GET /subscriptions/{subscriptionId}" --target "integrations/$INTEGRATION_ID" --region $REGION | Out-Null
aws apigatewayv2 create-route --api-id $API_ID --route-key "GET /subscriptions/employer/{employerId}" --target "integrations/$INTEGRATION_ID" --region $REGION | Out-Null
aws apigatewayv2 create-route --api-id $API_ID --route-key "PUT /subscriptions/{subscriptionId}" --target "integrations/$INTEGRATION_ID" --region $REGION | Out-Null
aws apigatewayv2 create-route --api-id $API_ID --route-key "DELETE /subscriptions/{subscriptionId}" --target "integrations/$INTEGRATION_ID" --region $REGION | Out-Null

Write-Host "✅ Routes created" -ForegroundColor Green

# Step 8: Grant permission
Write-Host "`n8. Granting API Gateway permission..." -ForegroundColor Yellow

$ACCOUNT_ID = aws sts get-caller-identity --query 'Account' --output text

aws lambda remove-permission --function-name $LAMBDA_NAME --statement-id "apigateway-invoke-subscriptions" --region $REGION 2>$null

aws lambda add-permission `
    --function-name $LAMBDA_NAME `
    --statement-id "apigateway-invoke-subscriptions" `
    --action lambda:InvokeFunction `
    --principal apigateway.amazonaws.com `
    --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/*" `
    --region $REGION | Out-Null

Write-Host "✅ Permission granted" -ForegroundColor Green

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green
Write-Host "API Endpoint: $API_ENDPOINT" -ForegroundColor Cyan
Write-Host "`nAdd to .env file:" -ForegroundColor Yellow
Write-Host "VITE_PACKAGE_SUBSCRIPTIONS_API=$API_ENDPOINT" -ForegroundColor White
