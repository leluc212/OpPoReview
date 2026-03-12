# PowerShell script to create Quick Job API Gateway and Lambda
# This creates the complete API infrastructure for PostQuickJob table

Write-Host "Creating Quick Job API Infrastructure..." -ForegroundColor Cyan
Write-Host ""

# Configuration
$LAMBDA_NAME = "quick-job-handler"
$API_NAME = "QuickJobAPI"
$REGION = "ap-southeast-1"
$TABLE_NAME = "PostQuickJob"

# Step 1: Create IAM role for Lambda
Write-Host "Step 1: Creating IAM role for Lambda..." -ForegroundColor Yellow

$TRUST_POLICY = @'
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
'@

$TRUST_POLICY | Out-File -FilePath trust-policy-quick-job.json -Encoding utf8

aws iam create-role `
    --role-name ${LAMBDA_NAME}-role `
    --assume-role-policy-document file://trust-policy-quick-job.json `
    --region $REGION

# Attach basic Lambda execution policy
aws iam attach-role-policy `
    --role-name ${LAMBDA_NAME}-role `
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole `
    --region $REGION

# Step 2: Create DynamoDB policy for Lambda
Write-Host "Step 2: Creating DynamoDB access policy..." -ForegroundColor Yellow

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

$DYNAMODB_POLICY | Out-File -FilePath dynamodb-policy-quick-job.json -Encoding utf8

aws iam put-role-policy `
    --role-name ${LAMBDA_NAME}-role `
    --policy-name DynamoDBQuickJobAccess `
    --policy-document file://dynamodb-policy-quick-job.json `
    --region $REGION

Write-Host "Waiting 10 seconds for IAM role to propagate..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Step 3: Get IAM role ARN
Write-Host "Step 3: Getting IAM role ARN..." -ForegroundColor Yellow
$ROLE_ARN = aws iam get-role --role-name ${LAMBDA_NAME}-role --query 'Role.Arn' --output text --region $REGION
Write-Host "Role ARN: $ROLE_ARN" -ForegroundColor Green

# Step 4: Package Lambda function
Write-Host "Step 4: Packaging Lambda function..." -ForegroundColor Yellow

# Copy Lambda code to temp directory
$TEMP_DIR = "temp-quick-job-lambda"
New-Item -ItemType Directory -Force -Path $TEMP_DIR | Out-Null
Copy-Item "amplify/backend/quick-job-lambda.py" -Destination "$TEMP_DIR/lambda_function.py"

# Create ZIP file
Compress-Archive -Path "$TEMP_DIR/*" -DestinationPath "quick-job-lambda.zip" -Force
Remove-Item -Recurse -Force $TEMP_DIR

Write-Host "Lambda package created: quick-job-lambda.zip" -ForegroundColor Green

# Step 5: Create Lambda function
Write-Host "Step 5: Creating Lambda function..." -ForegroundColor Yellow

aws lambda create-function `
    --function-name $LAMBDA_NAME `
    --runtime python3.11 `
    --role $ROLE_ARN `
    --handler lambda_function.lambda_handler `
    --zip-file fileb://quick-job-lambda.zip `
    --timeout 30 `
    --memory-size 256 `
    --environment "Variables={TABLE_NAME=$TABLE_NAME}" `
    --region $REGION

if ($LASTEXITCODE -eq 0) {
    Write-Host "Lambda function created successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to create Lambda function" -ForegroundColor Red
    exit 1
}

# Step 6: Create API Gateway
Write-Host "Step 6: Creating API Gateway..." -ForegroundColor Yellow

$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text

$API_ID = aws apigatewayv2 create-api `
    --name $API_NAME `
    --protocol-type HTTP `
    --target "arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${LAMBDA_NAME}" `
    --region $REGION `
    --query 'ApiId' `
    --output text

Write-Host "API Gateway created: $API_ID" -ForegroundColor Green

# Step 7: Add Lambda permission for API Gateway
Write-Host "Step 7: Adding Lambda permission..." -ForegroundColor Yellow

aws lambda add-permission `
    --function-name $LAMBDA_NAME `
    --statement-id apigateway-quick-job `
    --action lambda:InvokeFunction `
    --principal apigateway.amazonaws.com `
    --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/*" `
    --region $REGION

Write-Host "Lambda permission added" -ForegroundColor Green

# Step 8: Create routes
Write-Host "Step 8: Creating API routes..." -ForegroundColor Yellow

# Get integration ID
$INTEGRATION_ID = aws apigatewayv2 get-integrations `
    --api-id $API_ID `
    --region $REGION `
    --query 'Items[0].IntegrationId' `
    --output text

# Create routes
$routes = @(
    @{Method="POST"; Path="/quick-jobs"},
    @{Method="GET"; Path="/quick-jobs/employer/{employerId}"},
    @{Method="GET"; Path="/quick-jobs/active"},
    @{Method="GET"; Path="/quick-jobs/{idJob}"},
    @{Method="PUT"; Path="/quick-jobs/{idJob}"},
    @{Method="DELETE"; Path="/quick-jobs/{idJob}"},
    @{Method="POST"; Path="/quick-jobs/{idJob}/views"},
    @{Method="OPTIONS"; Path="/{proxy+}"}
)

foreach ($route in $routes) {
    aws apigatewayv2 create-route `
        --api-id $API_ID `
        --route-key "$($route.Method) $($route.Path)" `
        --target "integrations/$INTEGRATION_ID" `
        --region $REGION
    Write-Host "  Created route: $($route.Method) $($route.Path)" -ForegroundColor Green
}

# Step 9: Enable CORS
Write-Host "Step 9: Enabling CORS..." -ForegroundColor Yellow

aws apigatewayv2 update-api `
    --api-id $API_ID `
    --cors-configuration "AllowOrigins=*,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,AllowHeaders=Content-Type,Authorization" `
    --region $REGION

Write-Host "CORS enabled" -ForegroundColor Green

# Step 10: Get API endpoint
Write-Host ""
Write-Host "Quick Job API Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "API Details:" -ForegroundColor Cyan
Write-Host "  API ID: $API_ID" -ForegroundColor White
Write-Host "  Lambda: $LAMBDA_NAME" -ForegroundColor White
Write-Host "  Table: $TABLE_NAME" -ForegroundColor White
Write-Host ""

$API_ENDPOINT = aws apigatewayv2 get-api --api-id $API_ID --region $REGION --query 'ApiEndpoint' --output text
Write-Host "API Endpoint:" -ForegroundColor Cyan
Write-Host "  $API_ENDPOINT" -ForegroundColor Yellow
Write-Host ""
Write-Host "Update this URL in src/services/quickJobService.js:" -ForegroundColor Cyan
Write-Host "  const API_BASE_URL = '$API_ENDPOINT';" -ForegroundColor Yellow
Write-Host ""
Write-Host "Test endpoints:" -ForegroundColor Cyan
Write-Host "  POST   $API_ENDPOINT/quick-jobs" -ForegroundColor White
Write-Host "  GET    $API_ENDPOINT/quick-jobs/active" -ForegroundColor White
Write-Host "  GET    $API_ENDPOINT/quick-jobs/employer/{employerId}" -ForegroundColor White
Write-Host ""

# Save configuration
$CONFIG = @"
{
  "apiId": "$API_ID",
  "apiEndpoint": "$API_ENDPOINT",
  "lambdaName": "$LAMBDA_NAME",
  "tableName": "$TABLE_NAME",
  "region": "$REGION"
}
"@

$CONFIG | Out-File -FilePath "quick-job-api-config.json" -Encoding utf8
Write-Host "Configuration saved to quick-job-api-config.json" -ForegroundColor Green
