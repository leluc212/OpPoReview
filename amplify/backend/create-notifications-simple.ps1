# PowerShell script to create Notifications Lambda and API Gateway
# Run this script from the amplify/backend directory

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Creating Notifications System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Variables
$REGION = "ap-southeast-1"
$TABLE_NAME = "Notifications"
$LAMBDA_NAME = "notifications-handler"
$LAMBDA_ROLE_NAME = "notifications-lambda-role"
$API_NAME = "notifications-api"

# Step 1: Create DynamoDB Table
Write-Host "`n[1/6] Creating DynamoDB Table: $TABLE_NAME..." -ForegroundColor Yellow

$tableExists = $false
try {
    aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION 2>$null | Out-Null
    $tableExists = $true
    Write-Host "✓ Table already exists" -ForegroundColor Green
} catch {
    Write-Host "  Creating new table..." -ForegroundColor Gray
}

if (-not $tableExists) {
    # Create GSI config file
    @'
[
  {
    "IndexName": "RecipientIndex",
    "KeySchema": [
      {"AttributeName": "recipientId", "KeyType": "HASH"},
      {"AttributeName": "recipientRole", "KeyType": "RANGE"}
    ],
    "Projection": {"ProjectionType": "ALL"},
    "ProvisionedThroughput": {
      "ReadCapacityUnits": 5,
      "WriteCapacityUnits": 5
    }
  }
]
'@ | Out-File -FilePath "gsi-config.json" -Encoding utf8 -NoNewline
    
    aws dynamodb create-table `
        --table-name $TABLE_NAME `
        --attribute-definitions `
            AttributeName=notificationId,AttributeType=S `
            AttributeName=recipientId,AttributeType=S `
            AttributeName=recipientRole,AttributeType=S `
        --key-schema `
            AttributeName=notificationId,KeyType=HASH `
        --global-secondary-indexes file://gsi-config.json `
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 `
        --region $REGION
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Table created successfully" -ForegroundColor Green
        Write-Host "  Waiting for table to be active..." -ForegroundColor Gray
        aws dynamodb wait table-exists --table-name $TABLE_NAME --region $REGION
    }
    
    Remove-Item "gsi-config.json" -ErrorAction SilentlyContinue
}

# Step 2: Create IAM Role for Lambda
Write-Host "`n[2/6] Creating IAM Role: $LAMBDA_ROLE_NAME..." -ForegroundColor Yellow

$roleExists = $false
try {
    aws iam get-role --role-name $LAMBDA_ROLE_NAME 2>$null | Out-Null
    $roleExists = $true
    Write-Host "✓ Role already exists" -ForegroundColor Green
} catch {
    Write-Host "  Creating new role..." -ForegroundColor Gray
}

if (-not $roleExists) {
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
'@ | Out-File -FilePath "trust-policy.json" -Encoding utf8 -NoNewline

    aws iam create-role `
        --role-name $LAMBDA_ROLE_NAME `
        --assume-role-policy-document file://trust-policy.json `
        --region $REGION
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Role created successfully" -ForegroundColor Green
    }
}

# Step 3: Attach policies to role
Write-Host "`n[3/6] Attaching policies to role..." -ForegroundColor Yellow

# Attach basic Lambda execution policy
aws iam attach-role-policy `
    --role-name $LAMBDA_ROLE_NAME `
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" `
    --region $REGION 2>$null

# Get account ID
$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text

# Create and attach DynamoDB policy
$policyExists = $false
$POLICY_ARN = "arn:aws:iam::${ACCOUNT_ID}:policy/notifications-dynamodb-policy"

try {
    aws iam get-policy --policy-arn $POLICY_ARN 2>$null | Out-Null
    $policyExists = $true
    Write-Host "✓ DynamoDB policy already exists" -ForegroundColor Green
} catch {
    Write-Host "  Creating DynamoDB policy..." -ForegroundColor Gray
}

if (-not $policyExists) {
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
"@ | Out-File -FilePath "dynamodb-policy.json" -Encoding utf8 -NoNewline

    aws iam create-policy `
        --policy-name "notifications-dynamodb-policy" `
        --policy-document file://dynamodb-policy.json `
        --region $REGION
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ DynamoDB policy created" -ForegroundColor Green
    }
}

aws iam attach-role-policy `
    --role-name $LAMBDA_ROLE_NAME `
    --policy-arn $POLICY_ARN `
    --region $REGION 2>$null

Write-Host "✓ Policies attached successfully" -ForegroundColor Green

# Step 4: Create Lambda deployment package
Write-Host "`n[4/6] Creating Lambda deployment package..." -ForegroundColor Yellow

if (Test-Path "notifications-lambda.zip") {
    Remove-Item "notifications-lambda.zip"
}

Compress-Archive -Path "notifications-lambda.py" -DestinationPath "notifications-lambda.zip" -Force
Write-Host "✓ Deployment package created" -ForegroundColor Green

# Step 5: Create or Update Lambda function
Write-Host "`n[5/6] Creating Lambda function: $LAMBDA_NAME..." -ForegroundColor Yellow

Write-Host "  Waiting 10 seconds for IAM role to propagate..." -ForegroundColor Gray
Start-Sleep -Seconds 10

$ROLE_ARN = aws iam get-role --role-name $LAMBDA_ROLE_NAME --query 'Role.Arn' --output text

$lambdaExists = $false
try {
    aws lambda get-function --function-name $LAMBDA_NAME --region $REGION 2>$null | Out-Null
    $lambdaExists = $true
} catch {}

if ($lambdaExists) {
    Write-Host "  Function exists, updating code..." -ForegroundColor Gray
    
    aws lambda update-function-code `
        --function-name $LAMBDA_NAME `
        --zip-file fileb://notifications-lambda.zip `
        --region $REGION
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Lambda function updated" -ForegroundColor Green
    }
} else {
    aws lambda create-function `
        --function-name $LAMBDA_NAME `
        --runtime python3.11 `
        --role $ROLE_ARN `
        --handler notifications-lambda.lambda_handler `
        --zip-file fileb://notifications-lambda.zip `
        --timeout 30 `
        --memory-size 256 `
        --environment "Variables={TABLE_NAME=$TABLE_NAME}" `
        --region $REGION
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Lambda function created" -ForegroundColor Green
    }
}

# Step 6: Create HTTP API Gateway
Write-Host "`n[6/6] Creating API Gateway: $API_NAME..." -ForegroundColor Yellow

# Check if API exists
$EXISTING_API = aws apigatewayv2 get-apis --region $REGION --query "Items[?Name=='$API_NAME'].ApiId" --output text

if ($EXISTING_API) {
    $API_ID = $EXISTING_API
    Write-Host "✓ API already exists: $API_ID" -ForegroundColor Green
} else {
    $API_ID = aws apigatewayv2 create-api `
        --name $API_NAME `
        --protocol-type HTTP `
        --cors-configuration "AllowOrigins=*,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,AllowHeaders=Content-Type,Authorization" `
        --region $REGION `
        --query 'ApiId' `
        --output text
    
    Write-Host "✓ API created: $API_ID" -ForegroundColor Green
}

# Create integration
$LAMBDA_ARN = aws lambda get-function --function-name $LAMBDA_NAME --region $REGION --query 'Configuration.FunctionArn' --output text

# Check if integration exists
$EXISTING_INTEGRATION = aws apigatewayv2 get-integrations --api-id $API_ID --region $REGION --query 'Items[0].IntegrationId' --output text

if ($EXISTING_INTEGRATION -and $EXISTING_INTEGRATION -ne "None") {
    $INTEGRATION_ID = $EXISTING_INTEGRATION
    Write-Host "✓ Integration already exists: $INTEGRATION_ID" -ForegroundColor Green
} else {
    $INTEGRATION_ID = aws apigatewayv2 create-integration `
        --api-id $API_ID `
        --integration-type AWS_PROXY `
        --integration-uri $LAMBDA_ARN `
        --payload-format-version 2.0 `
        --region $REGION `
        --query 'IntegrationId' `
        --output text
    
    Write-Host "✓ Integration created: $INTEGRATION_ID" -ForegroundColor Green
}

# Create routes
$ROUTES = @(
    "GET /notifications",
    "GET /notifications/user/{userId}",
    "GET /notifications/unread/{userId}",
    "GET /notifications/{notificationId}",
    "POST /notifications",
    "PUT /notifications/{notificationId}",
    "PUT /notifications/mark-all-read/{userId}",
    "DELETE /notifications/{notificationId}",
    "OPTIONS /notifications",
    "OPTIONS /notifications/{proxy+}"
)

foreach ($ROUTE in $ROUTES) {
    try {
        aws apigatewayv2 create-route `
            --api-id $API_ID `
            --route-key $ROUTE `
            --target "integrations/$INTEGRATION_ID" `
            --region $REGION 2>$null | Out-Null
        Write-Host "  ✓ Route created: $ROUTE" -ForegroundColor Gray
    } catch {
        Write-Host "  - Route already exists: $ROUTE" -ForegroundColor Gray
    }
}

# Create stage
try {
    aws apigatewayv2 create-stage `
        --api-id $API_ID `
        --stage-name '$default' `
        --auto-deploy `
        --region $REGION 2>$null | Out-Null
    Write-Host "✓ Stage created" -ForegroundColor Green
} catch {
    Write-Host "✓ Stage already exists" -ForegroundColor Green
}

# Add Lambda permission
$STATEMENT_ID = "apigateway-invoke-notifications"
try {
    aws lambda remove-permission `
        --function-name $LAMBDA_NAME `
        --statement-id $STATEMENT_ID `
        --region $REGION 2>$null | Out-Null
} catch {}

aws lambda add-permission `
    --function-name $LAMBDA_NAME `
    --statement-id $STATEMENT_ID `
    --action lambda:InvokeFunction `
    --principal apigateway.amazonaws.com `
    --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*" `
    --region $REGION 2>$null | Out-Null

Write-Host "✓ Lambda permission added" -ForegroundColor Green

# Get API endpoint
$API_ENDPOINT = "https://${API_ID}.execute-api.${REGION}.amazonaws.com"

# Cleanup
Remove-Item "trust-policy.json" -ErrorAction SilentlyContinue
Remove-Item "dynamodb-policy.json" -ErrorAction SilentlyContinue

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✓ Notifications System Created!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nAPI Endpoint: $API_ENDPOINT" -ForegroundColor Yellow
Write-Host "`nAdd this to your .env file:" -ForegroundColor Yellow
Write-Host "VITE_NOTIFICATIONS_API=$API_ENDPOINT" -ForegroundColor White
Write-Host "`nTest the API:" -ForegroundColor Yellow
Write-Host "curl $API_ENDPOINT/notifications" -ForegroundColor White
Write-Host "`n========================================" -ForegroundColor Cyan
