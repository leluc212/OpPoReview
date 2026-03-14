# Script to create Candidate Profile API Gateway
Write-Host "Creating Candidate Profile API..." -ForegroundColor Cyan

$REGION = "ap-southeast-1"
$LAMBDA_NAME = "candidate-profile-api-handler"
$API_NAME = "CandidateProfileAPI"
$STAGE_NAME = "prod"

# Step 1: Create Lambda function
Write-Host ""
Write-Host "1. Creating Lambda function..." -ForegroundColor Yellow

# Zip the Lambda code
Compress-Archive -Path "candidate-api-lambda.py" -DestinationPath "candidate-api-lambda.zip" -Force

# Create Lambda function
aws lambda create-function `
    --function-name $LAMBDA_NAME `
    --runtime python3.9 `
    --role arn:aws:iam::726911960757:role/LabRole `
    --handler candidate-api-lambda.lambda_handler `
    --zip-file fileb://candidate-api-lambda.zip `
    --region $REGION `
    --timeout 30 `
    --memory-size 256

if ($LASTEXITCODE -ne 0) {
    Write-Host "Lambda function might already exist, updating code..." -ForegroundColor Yellow
    aws lambda update-function-code `
        --function-name $LAMBDA_NAME `
        --zip-file fileb://candidate-api-lambda.zip `
        --region $REGION
}

# Step 2: Create API Gateway
Write-Host ""
Write-Host "2. Creating API Gateway..." -ForegroundColor Yellow

$apiId = aws apigatewayv2 create-api `
    --name $API_NAME `
    --protocol-type HTTP `
    --region $REGION `
    --query 'ApiId' `
    --output text

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create API Gateway!" -ForegroundColor Red
    exit 1
}

Write-Host "API ID: $apiId" -ForegroundColor Green

# Step 3: Create Lambda integration
Write-Host ""
Write-Host "3. Creating Lambda integration..." -ForegroundColor Yellow

$lambdaArn = "arn:aws:lambda:${REGION}:726911960757:function:${LAMBDA_NAME}"

$integrationId = aws apigatewayv2 create-integration `
    --api-id $apiId `
    --integration-type AWS_PROXY `
    --integration-uri $lambdaArn `
    --payload-format-version 2.0 `
    --region $REGION `
    --query 'IntegrationId' `
    --output text

Write-Host "Integration ID: $integrationId" -ForegroundColor Green

# Step 4: Create routes
Write-Host ""
Write-Host "4. Creating routes..." -ForegroundColor Yellow

# GET /candidates
aws apigatewayv2 create-route `
    --api-id $apiId `
    --route-key "GET /candidates" `
    --target "integrations/$integrationId" `
    --region $REGION

# OPTIONS /candidates (for CORS)
aws apigatewayv2 create-route `
    --api-id $apiId `
    --route-key "OPTIONS /candidates" `
    --target "integrations/$integrationId" `
    --region $REGION

# Step 5: Grant API Gateway permission to invoke Lambda
Write-Host ""
Write-Host "5. Granting API Gateway permissions..." -ForegroundColor Yellow

$sourceArn = "arn:aws:execute-api:${REGION}:726911960757:${apiId}/*/*"

aws lambda add-permission `
    --function-name $LAMBDA_NAME `
    --statement-id apigateway-invoke `
    --action lambda:InvokeFunction `
    --principal apigateway.amazonaws.com `
    --source-arn $sourceArn `
    --region $REGION 2>$null

# Step 6: Create deployment
Write-Host ""
Write-Host "6. Creating deployment..." -ForegroundColor Yellow

aws apigatewayv2 create-stage `
    --api-id $apiId `
    --stage-name $STAGE_NAME `
    --auto-deploy `
    --region $REGION

# Get API endpoint
$apiEndpoint = "https://${apiId}.execute-api.${REGION}.amazonaws.com/${STAGE_NAME}"

Write-Host ""
Write-Host "API Created Successfully!" -ForegroundColor Green
Write-Host "API Endpoint: $apiEndpoint" -ForegroundColor Cyan
Write-Host "Test URL: ${apiEndpoint}/candidates" -ForegroundColor Cyan

# Save config
$config = @{
    apiId = $apiId
    apiEndpoint = $apiEndpoint
    lambdaName = $LAMBDA_NAME
    region = $REGION
} | ConvertTo-Json

$config | Out-File "candidate-api-config.json" -Encoding UTF8

Write-Host ""
Write-Host "Configuration saved to candidate-api-config.json" -ForegroundColor Green
Write-Host ""
Write-Host "Add this to your .env file:" -ForegroundColor Yellow
Write-Host "VITE_CANDIDATE_API_URL=$apiEndpoint" -ForegroundColor White

# Cleanup
Remove-Item "candidate-api-lambda.zip" -Force

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
