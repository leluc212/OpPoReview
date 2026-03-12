$REGION = "ap-southeast-1"
$ACCOUNT_ID = "726911960757"
$ROLE_NAME = "CandidateProfileLambdaRole"
$FUNCTION_NAME = "EmployerProfileAPI"
$TABLE_NAME = "EmployerProfiles"

Write-Host "Deploying Employer Profile API" -ForegroundColor Cyan

# Step 1: Package
Write-Host "Step 1: Creating package..." -ForegroundColor Yellow
if (Test-Path "employer-profile-lambda.zip") {
    Remove-Item "employer-profile-lambda.zip" -Force
}
Compress-Archive -Path "api-employer-profile.cjs", "employer-profile.cjs", "node_modules", "package.json" -DestinationPath "employer-profile-lambda.zip" -Force
Write-Host "OK" -ForegroundColor Green

# Step 2: Update Lambda
Write-Host "Step 2: Updating Lambda..." -ForegroundColor Yellow
aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://employer-profile-lambda.zip --region $REGION 2>&1 | Out-Null
Write-Host "OK" -ForegroundColor Green
Start-Sleep -Seconds 5

# Step 3: Create API
Write-Host "Step 3: Creating API Gateway..." -ForegroundColor Yellow
$apiJson = aws apigateway create-rest-api --name "EmployerProfileAPI" --description "Employer profile API" --endpoint-configuration types=REGIONAL --region $REGION
$API_ID = ($apiJson | ConvertFrom-Json).id
$ROOT_ID = ($apiJson | ConvertFrom-Json).rootResourceId
Write-Host "OK - API ID: $API_ID" -ForegroundColor Green

# Step 4: Create resources
Write-Host "Step 4: Creating resources..." -ForegroundColor Yellow
$profileJson = aws apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part "profile" --region $REGION
$PROFILE_ID = ($profileJson | ConvertFrom-Json).id

$userIdJson = aws apigateway create-resource --rest-api-id $API_ID --parent-id $PROFILE_ID --path-part "{userId}" --region $REGION
$USER_ID = ($userIdJson | ConvertFrom-Json).id
Write-Host "OK" -ForegroundColor Green

# Step 5: Lambda permission
Write-Host "Step 5: Adding Lambda permission..." -ForegroundColor Yellow
$sourceArn = "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*"
aws lambda add-permission --function-name $FUNCTION_NAME --statement-id "apigateway-$API_ID" --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn $sourceArn --region $REGION 2>&1 | Out-Null
Write-Host "OK" -ForegroundColor Green

# Step 6: Methods
Write-Host "Step 6: Creating methods..." -ForegroundColor Yellow
$lambdaUri = "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}/invocations"

aws apigateway put-method --rest-api-id $API_ID --resource-id $PROFILE_ID --http-method POST --authorization-type NONE --region $REGION 2>&1 | Out-Null
aws apigateway put-integration --rest-api-id $API_ID --resource-id $PROFILE_ID --http-method POST --type AWS_PROXY --integration-http-method POST --uri $lambdaUri --region $REGION 2>&1 | Out-Null

aws apigateway put-method --rest-api-id $API_ID --resource-id $USER_ID --http-method GET --authorization-type NONE --region $REGION 2>&1 | Out-Null
aws apigateway put-integration --rest-api-id $API_ID --resource-id $USER_ID --http-method GET --type AWS_PROXY --integration-http-method POST --uri $lambdaUri --region $REGION 2>&1 | Out-Null

aws apigateway put-method --rest-api-id $API_ID --resource-id $USER_ID --http-method PUT --authorization-type NONE --region $REGION 2>&1 | Out-Null
aws apigateway put-integration --rest-api-id $API_ID --resource-id $USER_ID --http-method PUT --type AWS_PROXY --integration-http-method POST --uri $lambdaUri --region $REGION 2>&1 | Out-Null

aws apigateway put-method --rest-api-id $API_ID --resource-id $USER_ID --http-method DELETE --authorization-type NONE --region $REGION 2>&1 | Out-Null
aws apigateway put-integration --rest-api-id $API_ID --resource-id $USER_ID --http-method DELETE --type AWS_PROXY --integration-http-method POST --uri $lambdaUri --region $REGION 2>&1 | Out-Null

Write-Host "OK" -ForegroundColor Green

# Step 7: Deploy
Write-Host "Step 7: Deploying..." -ForegroundColor Yellow
aws apigateway create-deployment --rest-api-id $API_ID --stage-name prod --region $REGION 2>&1 | Out-Null
Write-Host "OK" -ForegroundColor Green

Write-Host ""
Write-Host "SUCCESS" -ForegroundColor Green
Write-Host "API ID: $API_ID" -ForegroundColor Cyan
$url = "https://$API_ID.execute-api.$REGION.amazonaws.com/prod"
Write-Host "URL: $url" -ForegroundColor Cyan
Write-Host ""
Write-Host "Update .env:" -ForegroundColor Yellow
Write-Host "VITE_EMPLOYER_API_URL=$url" -ForegroundColor White
