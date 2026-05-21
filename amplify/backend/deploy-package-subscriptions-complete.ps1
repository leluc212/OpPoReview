# PowerShell script to create complete Package Subscriptions API
# This creates DynamoDB table, Lambda function, and API Gateway

Write-Host "=== Creating Package Subscriptions Infrastructure ===" -ForegroundColor Cyan

$TABLE_NAME = "PackageSubscriptions"
$LAMBDA_NAME = "package-subscriptions-handler"
$API_NAME = "PackageSubscriptionsAPI"
$REGION = "ap-southeast-1"

# Step 1: Create DynamoDB Table
Write-Host "`n1. Creating DynamoDB table: $TABLE_NAME..." -ForegroundColor Yellow

aws dynamodb create-table `
    --table-name $TABLE_NAME `
    --attribute-definitions `
        AttributeName=subscriptionId,AttributeType=S `
        AttributeName=employerId,AttributeType=S `
        AttributeName=status,AttributeType=S `
    --key-schema `
        AttributeName=subscriptionId,KeyType=HASH `
    --global-secondary-indexes `
        "IndexName=EmployerIndex,KeySchema=[{AttributeName=employerId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" `
        "IndexName=StatusIndex,KeySchema=[{AttributeName=status,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" `
    --provisioned-throughput `
        ReadCapacityUnits=5,WriteCapacityUnits=5 `
    --region $REGION

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Table created successfully" -ForegroundColor Green
    
    # Wait for table to be active
    Write-Host "Waiting for table to be active..." -ForegroundColor Yellow
    aws dynamodb wait table-exists --table-name $TABLE_NAME --region $REGION
    Write-Host "✅ Table is active" -ForegroundColor Green
} else {
    Write-Host "⚠️ Table might already exist or error occurred" -ForegroundColor Yellow
}

# Step 2: Create IAM Role for Lambda
Write-Host "`n2. Creating IAM role for Lambda..." -ForegroundColor Yellow

$ROLE_NAME = "package-subscriptions-lambda-role"

# Create trust policy
$TRUST_POLICY = @"
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

$TRUST_POLICY | Out-File -FilePath "trust-policy-subscriptions.json" -Encoding utf8

aws iam create-role `
    --role-name $ROLE_NAME `
    --assume-role-policy-document file://trust-policy-subscriptions.json

# Attach basic Lambda execution policy
aws iam attach-role-policy `
    --role-name $ROLE_NAME `
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

# Create and attach DynamoDB policy
$DYNAMODB_POLICY = @"
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
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:${REGION}:*:table/${TABLE_NAME}",
        "arn:aws:dynamodb:${REGION}:*:table/${TABLE_NAME}/index/*"
      ]
    }
  ]
}
"@

$DYNAMODB_POLICY | Out-File -FilePath "dynamodb-policy-subscriptions.json" -Encoding utf8

aws iam put-role-policy `
    --role-name $ROLE_NAME `
    --policy-name "DynamoDBAccessPolicy" `
    --policy-document file://dynamodb-policy-subscriptions.json

Write-Host "✅ IAM role created" -ForegroundColor Green

# Get role ARN
$ROLE_ARN = aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text
Write-Host "Role ARN: $ROLE_ARN" -ForegroundColor Cyan

# Wait for role to propagate
Write-Host "Waiting for IAM role to propagate..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Step 3: Create Lambda deployment package
Write-Host "`n3. Creating Lambda deployment package..." -ForegroundColor Yellow

Compress-Archive -Path "package-subscriptions-lambda.py" -DestinationPath "package-subscriptions-lambda.zip" -Force

Write-Host "✅ Lambda package created" -ForegroundColor Green

# Step 4: Create Lambda function
Write-Host "`n4. Creating Lambda function..." -ForegroundColor Yellow

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

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Lambda function created" -ForegroundColor Green
} else {
    Write-Host "⚠️ Lambda might already exist, updating code..." -ForegroundColor Yellow
    aws lambda update-function-code `
        --function-name $LAMBDA_NAME `
        --zip-file fileb://package-subscriptions-lambda.zip `
        --region $REGION
}

# Step 5: Create HTTP API Gateway
Write-Host "`n5. Creating HTTP API Gateway..." -ForegroundColor Yellow

$API_ID = aws apigatewayv2 create-api `
    --name $API_NAME `
    --protocol-type HTTP `
    --cors-configuration "AllowOrigins=*,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,AllowHeaders=Content-Type,Authorization" `
    --region $REGION `
    --query 'ApiId' `
    --output text

Write-Host "✅ API created with ID: $API_ID" -ForegroundColor Green

# Step 6: Create Lambda integration
Write-Host "`n6. Creating Lambda integration..." -ForegroundColor Yellow

$LAMBDA_ARN = aws lambda get-function --function-name $LAMBDA_NAME --query 'Configuration.FunctionArn' --output text

$INTEGRATION_ID = aws apigatewayv2 create-integration `
    --api-id $API_ID `
    --integration-type AWS_PROXY `
    --integration-uri $LAMBDA_ARN `
    --payload-format-version 2.0 `
    --region $REGION `
    --query 'IntegrationId' `
    --output text

Write-Host "✅ Integration created with ID: $INTEGRATION_ID" -ForegroundColor Green

# Step 7: Create routes
Write-Host "`n7. Creating API routes..." -ForegroundColor Yellow

# POST /subscriptions
aws apigatewayv2 create-route `
    --api-id $API_ID `
    --route-key "POST /subscriptions" `
    --target "integrations/$INTEGRATION_ID" `
    --region $REGION

# GET /subscriptions
aws apigatewayv2 create-route `
    --api-id $API_ID `
    --route-key "GET /subscriptions" `
    --target "integrations/$INTEGRATION_ID" `
    --region $REGION

# GET /subscriptions/{subscriptionId}
aws apigatewayv2 create-route `
    --api-id $API_ID `
    --route-key "GET /subscriptions/{subscriptionId}" `
    --target "integrations/$INTEGRATION_ID" `
    --region $REGION

# GET /subscriptions/employer/{employerId}
aws apigatewayv2 create-route `
    --api-id $API_ID `
    --route-key "GET /subscriptions/employer/{employerId}" `
    --target "integrations/$INTEGRATION_ID" `
    --region $REGION

# PUT /subscriptions/{subscriptionId}
aws apigatewayv2 create-route `
    --api-id $API_ID `
    --route-key "PUT /subscriptions/{subscriptionId}" `
    --target "integrations/$INTEGRATION_ID" `
    --region $REGION

# DELETE /subscriptions/{subscriptionId}
aws apigatewayv2 create-route `
    --api-id $API_ID `
    --route-key "DELETE /subscriptions/{subscriptionId}" `
    --target "integrations/$INTEGRATION_ID" `
    --region $REGION

Write-Host "✅ Routes created" -ForegroundColor Green

# Step 8: Create default stage
Write-Host "`n8. Creating default stage..." -ForegroundColor Yellow

aws apigatewayv2 create-stage `
    --api-id $API_ID `
    --stage-name '$default' `
    --auto-deploy `
    --region $REGION

Write-Host "✅ Stage created" -ForegroundColor Green

# Step 9: Grant API Gateway permission to invoke Lambda
Write-Host "`n9. Granting API Gateway permission..." -ForegroundColor Yellow

$ACCOUNT_ID = aws sts get-caller-identity --query 'Account' --output text

aws lambda add-permission `
    --function-name $LAMBDA_NAME `
    --statement-id "apigateway-invoke" `
    --action lambda:InvokeFunction `
    --principal apigateway.amazonaws.com `
    --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/*" `
    --region $REGION

Write-Host "✅ Permission granted" -ForegroundColor Green

# Step 10: Get API endpoint
$API_ENDPOINT = "https://${API_ID}.execute-api.${REGION}.amazonaws.com"

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Green
Write-Host "API Endpoint: $API_ENDPOINT" -ForegroundColor Cyan
Write-Host "Table Name: $TABLE_NAME" -ForegroundColor Cyan
Write-Host "Lambda Function: $LAMBDA_NAME" -ForegroundColor Cyan

# Save configuration
$CONFIG = @{
    apiId = $API_ID
    apiEndpoint = $API_ENDPOINT
    lambdaName = $LAMBDA_NAME
    tableName = $TABLE_NAME
    region = $REGION
} | ConvertTo-Json

$CONFIG | Out-File -FilePath "package-subscriptions-config.json" -Encoding utf8

Write-Host "`n✅ Configuration saved to package-subscriptions-config.json" -ForegroundColor Green

Write-Host "`nAdd this to your .env file:" -ForegroundColor Yellow
Write-Host "VITE_PACKAGE_SUBSCRIPTIONS_API=$API_ENDPOINT" -ForegroundColor Cyan
