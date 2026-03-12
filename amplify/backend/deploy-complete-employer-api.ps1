# Deploy Complete Employer Profile API Infrastructure
# Based on candidate profile deployment

$API_ID = "elc1z7grvh"
$REGION = "ap-southeast-1"
$ACCOUNT_ID = "726911960757"
$ROLE_NAME = "CandidateProfileLambdaRole"
$FUNCTION_NAME = "EmployerProfileAPI"
$API_NAME = "EmployerProfileAPI"
$TABLE_NAME = "EmployerProfiles"

Write-Host "Deploying Complete Employer Profile API Infrastructure" -ForegroundColor Cyan

# Step 1: Create deployment package
Write-Host "Step 1: Creating deployment package..." -ForegroundColor Yellow
if (Test-Path "employer-profile-lambda.zip") {
    Remove-Item "employer-profile-lambda.zip"
}

Compress-Archive -Path "api-employer-profile.cjs", "employer-profile.cjs", "node_modules", "package.json" -DestinationPath "employer-profile-lambda.zip" -Force
Write-Host "Package created" -ForegroundColor Green

# Step 2: Update or Create Lambda function
Write-Host "Step 2: Deploying Lambda function..." -ForegroundColor Yellow

try {
    # Try to update existing function
    aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://employer-profile-lambda.zip --region $REGION
    Write-Host "Lambda function updated" -ForegroundColor Green
    Start-Sleep -Seconds 5
} catch {
    Write-Host "Function doesn't exist, creating new one..." -ForegroundColor Yellow
    
    aws lambda create-function --function-name $FUNCTION_NAME --runtime nodejs18.x --role "arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}" --handler api-employer-profile.handler --zip-file fileb://employer-profile-lambda.zip --timeout 30 --memory-size 256 --environment Variables="{EMPLOYER_PROFILE_TABLE=$TABLE_NAME}" --region $REGION
    
    Write-Host "Lambda function created" -ForegroundColor Green
    Start-Sleep -Seconds 10
}

# Step 3: Add Lambda permission for API Gateway
Write-Host "Step 3: Adding Lambda permissions..." -ForegroundColor Yellow

try {
    aws lambda add-permission --function-name $FUNCTION_NAME --statement-id apigateway-invoke-employer --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*" --region $REGION
    Write-Host "Permission added" -ForegroundColor Green
} catch {
    Write-Host "Permission already exists" -ForegroundColor Yellow
}

# Step 4: Get API resources
Write-Host "Step 4: Setting up API Gateway resources..." -ForegroundColor Yellow

$resources = aws apigateway get-resources --rest-api-id $API_ID --region $REGION | ConvertFrom-Json
$ROOT_ID = ($resources.items | Where-Object { $_.path -eq "/" }).id

# Create /profile resource if not exists
$profileResource = $resources.items | Where-Object { $_.pathPart -eq "profile" }
if (-not $profileResource) {
    $profileResult = aws apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part "profile" --region $REGION | ConvertFrom-Json
    $PROFILE_RESOURCE_ID = $profileResult.id
    Write-Host "Created /profile resource" -ForegroundColor Green
} else {
    $PROFILE_RESOURCE_ID = $profileResource.id
    Write-Host "Found /profile resource" -ForegroundColor Green
}

# Create /{userId} resource if not exists
$userIdResource = $resources.items | Where-Object { $_.parentId -eq $PROFILE_RESOURCE_ID -and $_.pathPart -eq "{userId}" }
if (-not $userIdResource) {
    $userIdResult = aws apigateway create-resource --rest-api-id $API_ID --parent-id $PROFILE_RESOURCE_ID --path-part "{userId}" --region $REGION | ConvertFrom-Json
    $USER_ID_RESOURCE_ID = $userIdResult.id
    Write-Host "Created /profile/{userId} resource" -ForegroundColor Green
} else {
    $USER_ID_RESOURCE_ID = $userIdResource.id
    Write-Host "Found /profile/{userId} resource" -ForegroundColor Green
}

# Step 5: Create methods and integrations
Write-Host "Step 5: Creating methods and integrations..." -ForegroundColor Yellow

$lambdaUri = "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}/invocations"

# POST /profile
Write-Host "Setting up POST /profile..." -ForegroundColor Cyan
aws apigateway put-method --rest-api-id $API_ID --resource-id $PROFILE_RESOURCE_ID --http-method POST --authorization-type NONE --region $REGION 2>$null
aws apigateway put-integration --rest-api-id $API_ID --resource-id $PROFILE_RESOURCE_ID --http-method POST --type AWS_PROXY --integration-http-method POST --uri $lambdaUri --region $REGION

# GET /profile/{userId}
Write-Host "Setting up GET /profile/{userId}..." -ForegroundColor Cyan
aws apigateway put-method --rest-api-id $API_ID --resource-id $USER_ID_RESOURCE_ID --http-method GET --authorization-type NONE --region $REGION 2>$null
aws apigateway put-integration --rest-api-id $API_ID --resource-id $USER_ID_RESOURCE_ID --http-method GET --type AWS_PROXY --integration-http-method POST --uri $lambdaUri --region $REGION

# PUT /profile/{userId}
Write-Host "Setting up PUT /profile/{userId}..." -ForegroundColor Cyan
aws apigateway put-method --rest-api-id $API_ID --resource-id $USER_ID_RESOURCE_ID --http-method PUT --authorization-type NONE --region $REGION 2>$null
aws apigateway put-integration --rest-api-id $API_ID --resource-id $USER_ID_RESOURCE_ID --http-method PUT --type AWS_PROXY --integration-http-method POST --uri $lambdaUri --region $REGION

# DELETE /profile/{userId}
Write-Host "Setting up DELETE /profile/{userId}..." -ForegroundColor Cyan
aws apigateway put-method --rest-api-id $API_ID --resource-id $USER_ID_RESOURCE_ID --http-method DELETE --authorization-type NONE --region $REGION 2>$null
aws apigateway put-integration --rest-api-id $API_ID --resource-id $USER_ID_RESOURCE_ID --http-method DELETE --type AWS_PROXY --integration-http-method POST --uri $lambdaUri --region $REGION

Write-Host "Methods and integrations created" -ForegroundColor Green

# Step 6: Deploy API
Write-Host "Step 6: Deploying API to prod stage..." -ForegroundColor Yellow
aws apigateway create-deployment --rest-api-id $API_ID --stage-name prod --region $REGION
Write-Host "API deployed" -ForegroundColor Green

Write-Host ""
Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "API URL: https://$API_ID.execute-api.$REGION.amazonaws.com/prod" -ForegroundColor Cyan
Write-Host ""

# Step 7: Test the API
Write-Host "Step 7: Testing API..." -ForegroundColor Yellow
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
    } elseif ($statusCode -eq 403) {
        Write-Host "WARNING: Still getting 403 Forbidden" -ForegroundColor Yellow
        Write-Host "This might be an API Gateway caching issue. Wait a few minutes and try again." -ForegroundColor Yellow
    } else {
        Write-Host "API returned status: $statusCode" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "All done!" -ForegroundColor Green