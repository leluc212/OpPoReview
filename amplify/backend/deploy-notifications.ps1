# Simple PowerShell script to create Notifications System
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Creating Notifications System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$REGION = "ap-southeast-1"
$TABLE_NAME = "Notifications"
$LAMBDA_NAME = "notifications-handler"
$LAMBDA_ROLE_NAME = "notifications-lambda-role"
$API_NAME = "notifications-api"

# Step 1: Create DynamoDB Table
Write-Host "`n[1/6] Creating DynamoDB Table..." -ForegroundColor Yellow
aws dynamodb create-table --table-name $TABLE_NAME --attribute-definitions AttributeName=notificationId,AttributeType=S AttributeName=recipientId,AttributeType=S AttributeName=recipientRole,AttributeType=S --key-schema AttributeName=notificationId,KeyType=HASH --global-secondary-indexes IndexName=RecipientIndex,KeySchema=[{AttributeName=recipientId,KeyType=HASH},{AttributeName=recipientRole,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region $REGION 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Table created" -ForegroundColor Green
    aws dynamodb wait table-exists --table-name $TABLE_NAME --region $REGION
} else {
    Write-Host "✓ Table already exists" -ForegroundColor Green
}

# Step 2: Create IAM Role
Write-Host "`n[2/6] Creating IAM Role..." -ForegroundColor Yellow
aws iam create-role --role-name $LAMBDA_ROLE_NAME --assume-role-policy-document '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"lambda.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}' --region $REGION 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Role created" -ForegroundColor Green
} else {
    Write-Host "✓ Role already exists" -ForegroundColor Green
}

# Step 3: Attach policies
Write-Host "`n[3/6] Attaching policies..." -ForegroundColor Yellow
aws iam attach-role-policy --role-name $LAMBDA_ROLE_NAME --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" --region $REGION 2>$null

$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
$POLICY_ARN = "arn:aws:iam::${ACCOUNT_ID}:policy/notifications-dynamodb-policy"

aws iam create-policy --policy-name "notifications-dynamodb-policy" --policy-document "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"dynamodb:PutItem\",\"dynamodb:GetItem\",\"dynamodb:UpdateItem\",\"dynamodb:DeleteItem\",\"dynamodb:Query\",\"dynamodb:Scan\"],\"Resource\":[\"arn:aws:dynamodb:${REGION}:*:table/${TABLE_NAME}\",\"arn:aws:dynamodb:${REGION}:*:table/${TABLE_NAME}/index/*\"]}]}" --region $REGION 2>$null

aws iam attach-role-policy --role-name $LAMBDA_ROLE_NAME --policy-arn $POLICY_ARN --region $REGION 2>$null
Write-Host "✓ Policies attached" -ForegroundColor Green

# Step 4: Create Lambda package
Write-Host "`n[4/6] Creating Lambda package..." -ForegroundColor Yellow
if (Test-Path "notifications-lambda.zip") { Remove-Item "notifications-lambda.zip" }
Compress-Archive -Path "notifications-lambda.py" -DestinationPath "notifications-lambda.zip" -Force
Write-Host "✓ Package created" -ForegroundColor Green

# Step 5: Create Lambda function
Write-Host "`n[5/6] Creating Lambda function..." -ForegroundColor Yellow
Write-Host "  Waiting 10 seconds for IAM..." -ForegroundColor Gray
Start-Sleep -Seconds 10

$ROLE_ARN = aws iam get-role --role-name $LAMBDA_ROLE_NAME --query 'Role.Arn' --output text

aws lambda create-function --function-name $LAMBDA_NAME --runtime python3.11 --role $ROLE_ARN --handler notifications-lambda.lambda_handler --zip-file fileb://notifications-lambda.zip --timeout 30 --memory-size 256 --environment "Variables={TABLE_NAME=$TABLE_NAME}" --region $REGION 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Lambda created" -ForegroundColor Green
} else {
    Write-Host "  Updating existing Lambda..." -ForegroundColor Gray
    aws lambda update-function-code --function-name $LAMBDA_NAME --zip-file fileb://notifications-lambda.zip --region $REGION
    Write-Host "✓ Lambda updated" -ForegroundColor Green
}

# Step 6: Create API Gateway
Write-Host "`n[6/6] Creating API Gateway..." -ForegroundColor Yellow

$EXISTING_API = aws apigatewayv2 get-apis --region $REGION --query "Items[?Name=='$API_NAME'].ApiId" --output text

if ($EXISTING_API) {
    $API_ID = $EXISTING_API
    Write-Host "✓ API exists: $API_ID" -ForegroundColor Green
} else {
    $API_ID = aws apigatewayv2 create-api --name $API_NAME --protocol-type HTTP --cors-configuration "AllowOrigins=*,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,AllowHeaders=Content-Type,Authorization" --region $REGION --query 'ApiId' --output text
    Write-Host "✓ API created: $API_ID" -ForegroundColor Green
}

$LAMBDA_ARN = aws lambda get-function --function-name $LAMBDA_NAME --region $REGION --query 'Configuration.FunctionArn' --output text

$EXISTING_INTEGRATION = aws apigatewayv2 get-integrations --api-id $API_ID --region $REGION --query 'Items[0].IntegrationId' --output text

if ($EXISTING_INTEGRATION -and $EXISTING_INTEGRATION -ne "None") {
    $INTEGRATION_ID = $EXISTING_INTEGRATION
} else {
    $INTEGRATION_ID = aws apigatewayv2 create-integration --api-id $API_ID --integration-type AWS_PROXY --integration-uri $LAMBDA_ARN --payload-format-version 2.0 --region $REGION --query 'IntegrationId' --output text
}

# Create routes
$routes = @("GET /notifications", "GET /notifications/user/{userId}", "GET /notifications/unread/{userId}", "GET /notifications/{notificationId}", "POST /notifications", "PUT /notifications/{notificationId}", "PUT /notifications/mark-all-read/{userId}", "DELETE /notifications/{notificationId}", "OPTIONS /notifications", "OPTIONS /notifications/{proxy+}")

foreach ($route in $routes) {
    aws apigatewayv2 create-route --api-id $API_ID --route-key $route --target "integrations/$INTEGRATION_ID" --region $REGION 2>$null
}

aws apigatewayv2 create-stage --api-id $API_ID --stage-name '$default' --auto-deploy --region $REGION 2>$null

# Add Lambda permission
aws lambda remove-permission --function-name $LAMBDA_NAME --statement-id "apigateway-invoke-notifications" --region $REGION 2>$null
aws lambda add-permission --function-name $LAMBDA_NAME --statement-id "apigateway-invoke-notifications" --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*" --region $REGION 2>$null

Write-Host "✓ API configured" -ForegroundColor Green

$API_ENDPOINT = "https://${API_ID}.execute-api.${REGION}.amazonaws.com"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✓ SUCCESS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nAPI Endpoint:" -ForegroundColor Yellow
Write-Host "$API_ENDPOINT" -ForegroundColor White
Write-Host "`nAdd to .env file:" -ForegroundColor Yellow
Write-Host "VITE_NOTIFICATIONS_API=$API_ENDPOINT" -ForegroundColor White
Write-Host "`n========================================" -ForegroundColor Cyan
