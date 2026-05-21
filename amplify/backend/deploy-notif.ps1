# Deploy Notifications System
$ErrorActionPreference = "Continue"

Write-Host "`n========== Creating Notifications System ==========" -ForegroundColor Cyan

$REGION = "ap-southeast-1"
$TABLE_NAME = "Notifications"
$LAMBDA_NAME = "notifications-handler"
$LAMBDA_ROLE_NAME = "notifications-lambda-role"
$API_NAME = "notifications-api"

# 1. Create DynamoDB Table
Write-Host "`n[1/6] DynamoDB Table..." -ForegroundColor Yellow
aws dynamodb create-table `
    --table-name $TABLE_NAME `
    --attribute-definitions `
        AttributeName=notificationId,AttributeType=S `
        AttributeName=recipientId,AttributeType=S `
        AttributeName=recipientRole,AttributeType=S `
    --key-schema AttributeName=notificationId,KeyType=HASH `
    --global-secondary-indexes file://gsi-schema.json `
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 `
    --region $REGION 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Created. Waiting..." -ForegroundColor Green
    aws dynamodb wait table-exists --table-name $TABLE_NAME --region $REGION
} else {
    Write-Host "Already exists" -ForegroundColor Green
}

# 2. Create IAM Role
Write-Host "`n[2/6] IAM Role..." -ForegroundColor Yellow
aws iam create-role `
    --role-name $LAMBDA_ROLE_NAME `
    --assume-role-policy-document file://trust-policy.json `
    --region $REGION 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Created" -ForegroundColor Green
} else {
    Write-Host "Already exists" -ForegroundColor Green
}

# 3. Attach Policies
Write-Host "`n[3/6] Policies..." -ForegroundColor Yellow
aws iam attach-role-policy `
    --role-name $LAMBDA_ROLE_NAME `
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" 2>$null

$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
$POLICY_ARN = "arn:aws:iam::${ACCOUNT_ID}:policy/notifications-dynamodb-policy"

aws iam create-policy `
    --policy-name "notifications-dynamodb-policy" `
    --policy-document file://dynamodb-policy.json 2>$null

aws iam attach-role-policy `
    --role-name $LAMBDA_ROLE_NAME `
    --policy-arn $POLICY_ARN 2>$null

Write-Host "Attached" -ForegroundColor Green

# 4. Create Lambda Package
Write-Host "`n[4/6] Lambda Package..." -ForegroundColor Yellow
if (Test-Path "notifications-lambda.zip") { Remove-Item "notifications-lambda.zip" }
Compress-Archive -Path "notifications-lambda.py" -DestinationPath "notifications-lambda.zip" -Force
Write-Host "Created" -ForegroundColor Green

# 5. Create Lambda
Write-Host "`n[5/6] Lambda Function..." -ForegroundColor Yellow
Write-Host "Waiting 10s for IAM..." -ForegroundColor Gray
Start-Sleep -Seconds 10

$ROLE_ARN = aws iam get-role --role-name $LAMBDA_ROLE_NAME --query 'Role.Arn' --output text

aws lambda create-function `
    --function-name $LAMBDA_NAME `
    --runtime python3.11 `
    --role $ROLE_ARN `
    --handler notifications-lambda.lambda_handler `
    --zip-file fileb://notifications-lambda.zip `
    --timeout 30 `
    --memory-size 256 `
    --environment "Variables={TABLE_NAME=$TABLE_NAME}" `
    --region $REGION 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Created" -ForegroundColor Green
} else {
    Write-Host "Updating..." -ForegroundColor Gray
    aws lambda update-function-code `
        --function-name $LAMBDA_NAME `
        --zip-file fileb://notifications-lambda.zip `
        --region $REGION
    Write-Host "Updated" -ForegroundColor Green
}

# 6. Create API Gateway
Write-Host "`n[6/6] API Gateway..." -ForegroundColor Yellow

$EXISTING_API = aws apigatewayv2 get-apis --region $REGION --query "Items[?Name=='$API_NAME'].ApiId" --output text

if ($EXISTING_API) {
    $API_ID = $EXISTING_API
    Write-Host "Exists: $API_ID" -ForegroundColor Green
} else {
    $API_ID = aws apigatewayv2 create-api `
        --name $API_NAME `
        --protocol-type HTTP `
        --cors-configuration "AllowOrigins=*,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,AllowHeaders=Content-Type,Authorization" `
        --region $REGION `
        --query 'ApiId' `
        --output text
    Write-Host "Created: $API_ID" -ForegroundColor Green
}

$LAMBDA_ARN = aws lambda get-function --function-name $LAMBDA_NAME --region $REGION --query 'Configuration.FunctionArn' --output text

$EXISTING_INT = aws apigatewayv2 get-integrations --api-id $API_ID --region $REGION --query 'Items[0].IntegrationId' --output text

if ($EXISTING_INT -and $EXISTING_INT -ne "None") {
    $INTEGRATION_ID = $EXISTING_INT
} else {
    $INTEGRATION_ID = aws apigatewayv2 create-integration `
        --api-id $API_ID `
        --integration-type AWS_PROXY `
        --integration-uri $LAMBDA_ARN `
        --payload-format-version 2.0 `
        --region $REGION `
        --query 'IntegrationId' `
        --output text
}

# Create routes
@("GET /notifications", "GET /notifications/user/{userId}", "GET /notifications/unread/{userId}", "GET /notifications/{notificationId}", "POST /notifications", "PUT /notifications/{notificationId}", "PUT /notifications/mark-all-read/{userId}", "DELETE /notifications/{notificationId}", "OPTIONS /notifications", "OPTIONS /notifications/{proxy+}") | ForEach-Object {
    aws apigatewayv2 create-route --api-id $API_ID --route-key $_ --target "integrations/$INTEGRATION_ID" --region $REGION 2>$null
}

aws apigatewayv2 create-stage --api-id $API_ID --stage-name '$default' --auto-deploy --region $REGION 2>$null

# Lambda permission
aws lambda remove-permission --function-name $LAMBDA_NAME --statement-id "apigw-notif" --region $REGION 2>$null
aws lambda add-permission `
    --function-name $LAMBDA_NAME `
    --statement-id "apigw-notif" `
    --action lambda:InvokeFunction `
    --principal apigatewayamazonaws.com `
    --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*" `
    --region $REGION 2>$null

Write-Host "Configured" -ForegroundColor Green

$API_ENDPOINT = "https://${API_ID}.execute-api.${REGION}.amazonaws.com"

Write-Host "`n========== SUCCESS! ==========" -ForegroundColor Cyan
Write-Host "`nAPI Endpoint:" -ForegroundColor Yellow
Write-Host "$API_ENDPOINT" -ForegroundColor White
Write-Host "`nAdd to .env:" -ForegroundColor Yellow
Write-Host "VITE_NOTIFICATIONS_API=$API_ENDPOINT" -ForegroundColor White
Write-Host "`n==============================" -ForegroundColor Cyan
