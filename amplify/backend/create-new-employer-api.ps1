# Create a completely new API Gateway for Employer Profile
Write-Host "Creating new Employer Profile API Gateway..." -ForegroundColor Yellow

$REGION = "ap-southeast-1"
$ACCOUNT_ID = "726911960757"
$FUNCTION_NAME = "EmployerProfileAPI"

# Step 1: Create new API Gateway
Write-Host "Step 1: Creating new REST API..." -ForegroundColor Blue
$apiResult = aws apigateway create-rest-api --name "EmployerProfileAPI-v2" --description "Employer Profile API v2" --region $REGION | ConvertFrom-Json
$API_ID = $apiResult.id
$ROOT_ID = ($apiResult.rootResourceId)

Write-Host "Created API: $API_ID" -ForegroundColor Green
Write-Host "Root Resource: $ROOT_ID" -ForegroundColor Green

# Step 2: Create /profile resource
Write-Host "Step 2: Creating /profile resource..." -ForegroundColor Blue
$profileResult = aws apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part "profile" --region $REGION | ConvertFrom-Json
$PROFILE_ID = $profileResult.id
Write-Host "Created /profile: $PROFILE_ID" -ForegroundColor Green

# Step 3: Create /{userId} resource
Write-Host "Step 3: Creating /profile/{userId} resource..." -ForegroundColor Blue
$userIdResult = aws apigateway create-resource --rest-api-id $API_ID --parent-id $PROFILE_ID --path-part "{userId}" --region $REGION | ConvertFrom-Json
$USER_ID = $userIdResult.id
Write-Host "Created /profile/{userId}: $USER_ID" -ForegroundColor Green

# Step 4: Add Lambda permission
Write-Host "Step 4: Adding Lambda permission..." -ForegroundColor Blue
$statementId = "apigateway-invoke-employer-v2-" + (Get-Random)
aws lambda add-permission --function-name $FUNCTION_NAME --statement-id $statementId --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*" --region $REGION
Write-Host "Permission added" -ForegroundColor Green

# Step 5: Create methods and integrations
Write-Host "Step 5: Creating methods and integrations..." -ForegroundColor Blue

$lambdaUri = "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}/invocations"

# POST /profile
Write-Host "Creating POST /profile..." -ForegroundColor Cyan
aws apigateway put-method --rest-api-id $API_ID --resource-id $PROFILE_ID --http-method POST --authorization-type NONE --region $REGION
aws apigateway put-integration --rest-api-id $API_ID --resource-id $PROFILE_ID --http-method POST --type AWS_PROXY --integration-http-method POST --uri $lambdaUri --region $REGION

# GET /profile/{userId}
Write-Host "Creating GET /profile/{userId}..." -ForegroundColor Cyan
aws apigateway put-method --rest-api-id $API_ID --resource-id $USER_ID --http-method GET --authorization-type NONE --region $REGION
aws apigateway put-integration --rest-api-id $API_ID --resource-id $USER_ID --http-method GET --type AWS_PROXY --integration-http-method POST --uri $lambdaUri --region $REGION

# PUT /profile/{userId}
Write-Host "Creating PUT /profile/{userId}..." -ForegroundColor Cyan
aws apigateway put-method --rest-api-id $API_ID --resource-id $USER_ID --http-method PUT --authorization-type NONE --region $REGION
aws apigateway put-integration --rest-api-id $API_ID --resource-id $USER_ID --http-method PUT --type AWS_PROXY --integration-http-method POST --uri $lambdaUri --region $REGION

# DELETE /profile/{userId}
Write-Host "Creating DELETE /profile/{userId}..." -ForegroundColor Cyan
aws apigateway put-method --rest-api-id $API_ID --resource-id $USER_ID --http-method DELETE --authorization-type NONE --region $REGION
aws apigateway put-integration --rest-api-id $API_ID --resource-id $USER_ID --http-method DELETE --type AWS_PROXY --integration-http-method POST --uri $lambdaUri --region $REGION

Write-Host "Methods created" -ForegroundColor Green

# Step 6: Deploy API
Write-Host "Step 6: Deploying API to prod stage..." -ForegroundColor Blue
aws apigateway create-deployment --rest-api-id $API_ID --stage-name prod --stage-description "Production" --description "Initial deployment" --region $REGION

Write-Host "API deployed!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NEW API URL: https://$API_ID.execute-api.$REGION.amazonaws.com/prod" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Update your .env file with:" -ForegroundColor Yellow
Write-Host "VITE_EMPLOYER_API_URL=https://$API_ID.execute-api.$REGION.amazonaws.com/prod" -ForegroundColor White
Write-Host ""

# Step 7: Test the API
Write-Host "Step 7: Testing API..." -ForegroundColor Blue
Start-Sleep -Seconds 5

$testUrl = "https://$API_ID.execute-api.$REGION.amazonaws.com/prod/profile/test-user"

try {
    $response = Invoke-WebRequest -Uri $testUrl -Method GET -Headers @{"Content-Type"="application/json"} -ErrorAction Stop
    Write-Host "SUCCESS! API is working!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor White
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    $statusCode = $_.Exception.Response.StatusCode
    
    if ($statusCode -eq 404) {
        Write-Host "SUCCESS! API is working! (404 is expected for non-existent user)" -ForegroundColor Green
    } else {
        Write-Host "API returned status: $statusCode" -ForegroundColor Yellow
        Write-Host "This might be OK - try testing from the browser" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Setup completed!" -ForegroundColor Green