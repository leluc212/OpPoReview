# Deploy CV Upload Lambda and API Gateway
$region = "ap-southeast-1"
$functionName = "CVUploadFunction"
$roleName = "CVUploadLambdaRole"
$apiName = "CVUploadAPI"
$bucketName = "opporeview-cv-storage"

Write-Host "=== Creating CV Upload API ===" -ForegroundColor Cyan

# Step 1: Create IAM role for Lambda
Write-Host "`n1. Creating IAM role..." -ForegroundColor Yellow

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

$trustPolicy | Out-File -FilePath "trust-policy.json" -Encoding utf8

aws iam create-role `
    --role-name $roleName `
    --assume-role-policy-document file://trust-policy.json `
    --description "Role for CV Upload Lambda function"

Remove-Item "trust-policy.json"

# Attach policies
Write-Host "Attaching policies..." -ForegroundColor Yellow
aws iam attach-role-policy `
    --role-name $roleName `
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

# Create inline policy for S3 and DynamoDB access
$inlinePolicy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::$bucketName/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:${region}:*:table/CandidateProfiles"
    }
  ]
}
"@

$inlinePolicy | Out-File -FilePath "inline-policy.json" -Encoding utf8

aws iam put-role-policy `
    --role-name $roleName `
    --policy-name "CVUploadPolicy" `
    --policy-document file://inline-policy.json

Remove-Item "inline-policy.json"

Write-Host "Waiting for role to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Step 2: Package Lambda function
Write-Host "`n2. Packaging Lambda function..." -ForegroundColor Yellow

if (Test-Path "amplify/backend/cv-upload-lambda.zip") {
    Remove-Item "amplify/backend/cv-upload-lambda.zip"
}

Compress-Archive -Path "amplify/backend/cv-upload-lambda.py" -DestinationPath "amplify/backend/cv-upload-lambda.zip"

# Step 3: Create Lambda function
Write-Host "`n3. Creating Lambda function..." -ForegroundColor Yellow

$accountId = aws sts get-caller-identity --query Account --output text
$roleArn = "arn:aws:iam::${accountId}:role/$roleName"

aws lambda create-function `
    --function-name $functionName `
    --runtime python3.11 `
    --role $roleArn `
    --handler cv-upload-lambda.lambda_handler `
    --zip-file fileb://amplify/backend/cv-upload-lambda.zip `
    --timeout 30 `
    --memory-size 512 `
    --region $region `
    --description "CV Upload to S3 with DynamoDB metadata"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Lambda function may already exist, updating..." -ForegroundColor Yellow
    aws lambda update-function-code `
        --function-name $functionName `
        --zip-file fileb://amplify/backend/cv-upload-lambda.zip `
        --region $region
}

# Step 4: Create API Gateway
Write-Host "`n4. Creating API Gateway..." -ForegroundColor Yellow

$apiId = aws apigatewayv2 create-api `
    --name $apiName `
    --protocol-type HTTP `
    --cors-configuration "AllowOrigins=https://leluc213.github.io,http://localhost:5173,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,AllowHeaders=Content-Type,Authorization" `
    --region $region `
    --query 'ApiId' `
    --output text

Write-Host "API ID: $apiId" -ForegroundColor Green

# Step 5: Create Lambda integration
Write-Host "`n5. Creating Lambda integration..." -ForegroundColor Yellow

$integrationId = aws apigatewayv2 create-integration `
    --api-id $apiId `
    --integration-type AWS_PROXY `
    --integration-uri "arn:aws:lambda:${region}:${accountId}:function:$functionName" `
    --payload-format-version 2.0 `
    --region $region `
    --query 'IntegrationId' `
    --output text

Write-Host "Integration ID: $integrationId" -ForegroundColor Green

# Step 6: Create routes
Write-Host "`n6. Creating routes..." -ForegroundColor Yellow

# POST /cv/upload
aws apigatewayv2 create-route `
    --api-id $apiId `
    --route-key "POST /cv/upload" `
    --target "integrations/$integrationId" `
    --region $region

# GET /cv/{userId}
aws apigatewayv2 create-route `
    --api-id $apiId `
    --route-key "GET /cv/{userId}" `
    --target "integrations/$integrationId" `
    --region $region

# DELETE /cv/{userId}
aws apigatewayv2 create-route `
    --api-id $apiId `
    --route-key "DELETE /cv/{userId}" `
    --target "integrations/$integrationId" `
    --region $region

# OPTIONS for CORS
aws apigatewayv2 create-route `
    --api-id $apiId `
    --route-key "OPTIONS /cv/upload" `
    --target "integrations/$integrationId" `
    --region $region

aws apigatewayv2 create-route `
    --api-id $apiId `
    --route-key "OPTIONS /cv/{userId}" `
    --target "integrations/$integrationId" `
    --region $region

# Step 7: Create stage and deploy
Write-Host "`n7. Creating stage and deploying..." -ForegroundColor Yellow

aws apigatewayv2 create-stage `
    --api-id $apiId `
    --stage-name prod `
    --auto-deploy `
    --region $region

# Step 8: Add Lambda permission for API Gateway
Write-Host "`n8. Adding Lambda permission..." -ForegroundColor Yellow

aws lambda add-permission `
    --function-name $functionName `
    --statement-id "apigateway-invoke" `
    --action lambda:InvokeFunction `
    --principal apigateway.amazonaws.com `
    --source-arn "arn:aws:execute-api:${region}:${accountId}:${apiId}/*/*" `
    --region $region

# Get API endpoint
$apiEndpoint = "https://${apiId}.execute-api.${region}.amazonaws.com/prod"

Write-Host "`n=== CV Upload API Created Successfully ===" -ForegroundColor Green
Write-Host "API Endpoint: $apiEndpoint" -ForegroundColor Yellow
Write-Host "`nEndpoints:" -ForegroundColor Cyan
Write-Host "  POST   $apiEndpoint/cv/upload" -ForegroundColor White
Write-Host "  GET    $apiEndpoint/cv/{userId}" -ForegroundColor White
Write-Host "  DELETE $apiEndpoint/cv/{userId}" -ForegroundColor White
Write-Host "`nSave this endpoint to your frontend configuration!" -ForegroundColor Yellow
