# Create API Gateway for Candidate Profile API
# Run: .\amplify\backend\create-api-gateway.ps1

$REGION = "ap-southeast-1"
$ACCOUNT_ID = "726911960757"
$FUNCTION_NAME = "CandidateProfileAPI"
$API_NAME = "CandidateProfileAPI"

Write-Host "Creating API Gateway" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create REST API
Write-Host "Step 1: Creating REST API..." -ForegroundColor Yellow
$apiResult = aws apigateway create-rest-api --name $API_NAME --description "API for managing candidate profiles" --endpoint-configuration types=REGIONAL --region $REGION | ConvertFrom-Json
$API_ID = $apiResult.id
Write-Host "✅ API created: $API_ID" -ForegroundColor Green

# Step 2: Get root resource
Write-Host ""
Write-Host "Step 2: Getting root resource..." -ForegroundColor Yellow
$resources = aws apigateway get-resources --rest-api-id $API_ID --region $REGION | ConvertFrom-Json
$ROOT_ID = $resources.items[0].id
Write-Host "✅ Root ID: $ROOT_ID" -ForegroundColor Green

# Step 3: Create /profile resource
Write-Host ""
Write-Host "Step 3: Creating /profile resource..." -ForegroundColor Yellow
$profileResult = aws apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part profile --region $REGION | ConvertFrom-Json
$PROFILE_ID = $profileResult.id
Write-Host "✅ Profile resource: $PROFILE_ID" -ForegroundColor Green

# Step 4: Create /{userId} resource
Write-Host ""
Write-Host "Step 4: Creating /{userId} resource..." -ForegroundColor Yellow
$userIdResult = aws apigateway create-resource --rest-api-id $API_ID --parent-id $PROFILE_ID --path-part "{userId}" --region $REGION | ConvertFrom-Json
$USER_ID_ID = $userIdResult.id
Write-Host "✅ UserId resource: $USER_ID_ID" -ForegroundColor Green

# Step 5: Create POST /profile method
Write-Host ""
Write-Host "Step 5: Creating POST /profile..." -ForegroundColor Yellow
aws apigateway put-method --rest-api-id $API_ID --resource-id $PROFILE_ID --http-method POST --authorization-type NONE --region $REGION | Out-Null
aws apigateway put-integration --rest-api-id $API_ID --resource-id $PROFILE_ID --http-method POST --type AWS_PROXY --integration-http-method POST --uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}/invocations" --region $REGION | Out-Null
Write-Host "✅ POST /profile created" -ForegroundColor Green

# Step 6: Create GET /profile/{userId} method
Write-Host ""
Write-Host "Step 6: Creating GET /profile/{userId}..." -ForegroundColor Yellow
aws apigateway put-method --rest-api-id $API_ID --resource-id $USER_ID_ID --http-method GET --authorization-type NONE --region $REGION | Out-Null
aws apigateway put-integration --rest-api-id $API_ID --resource-id $USER_ID_ID --http-method GET --type AWS_PROXY --integration-http-method POST --uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}/invocations" --region $REGION | Out-Null
Write-Host "✅ GET /profile/{userId} created" -ForegroundColor Green

# Step 7: Create PUT /profile/{userId} method
Write-Host ""
Write-Host "Step 7: Creating PUT /profile/{userId}..." -ForegroundColor Yellow
aws apigateway put-method --rest-api-id $API_ID --resource-id $USER_ID_ID --http-method PUT --authorization-type NONE --region $REGION | Out-Null
aws apigateway put-integration --rest-api-id $API_ID --resource-id $USER_ID_ID --http-method PUT --type AWS_PROXY --integration-http-method POST --uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}/invocations" --region $REGION | Out-Null
Write-Host "✅ PUT /profile/{userId} created" -ForegroundColor Green

# Step 8: Create DELETE /profile/{userId} method
Write-Host ""
Write-Host "Step 8: Creating DELETE /profile/{userId}..." -ForegroundColor Yellow
aws apigateway put-method --rest-api-id $API_ID --resource-id $USER_ID_ID --http-method DELETE --authorization-type NONE --region $REGION | Out-Null
aws apigateway put-integration --rest-api-id $API_ID --resource-id $USER_ID_ID --http-method DELETE --type AWS_PROXY --integration-http-method POST --uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}/invocations" --region $REGION | Out-Null
Write-Host "✅ DELETE /profile/{userId} created" -ForegroundColor Green

# Step 9: Grant Lambda permission
Write-Host ""
Write-Host "Step 9: Granting Lambda permission..." -ForegroundColor Yellow
aws lambda add-permission --function-name $FUNCTION_NAME --statement-id apigateway-invoke --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*" --region $REGION | Out-Null
Write-Host "✅ Permission granted" -ForegroundColor Green

# Step 10: Deploy API
Write-Host ""
Write-Host "Step 10: Deploying API..." -ForegroundColor Yellow
aws apigateway create-deployment --rest-api-id $API_ID --stage-name prod --stage-description "Production" --description "Initial deployment" --region $REGION | Out-Null
Write-Host "✅ API deployed" -ForegroundColor Green

# Display results
$API_URL = "https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod"

Write-Host ""
Write-Host "====================" -ForegroundColor Cyan
Write-Host "✅ Success!" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API ID: $API_ID" -ForegroundColor White
Write-Host "API URL: $API_URL" -ForegroundColor Green
Write-Host ""
Write-Host "Endpoints:" -ForegroundColor Yellow
Write-Host "  POST   $API_URL/profile" -ForegroundColor White
Write-Host "  GET    $API_URL/profile/{userId}" -ForegroundColor White
Write-Host "  PUT    $API_URL/profile/{userId}" -ForegroundColor White
Write-Host "  DELETE $API_URL/profile/{userId}" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create .env file:" -ForegroundColor White
Write-Host "   VITE_API_URL=$API_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Test API:" -ForegroundColor White
Write-Host "   curl $API_URL/profile/test-user-123" -ForegroundColor Cyan
Write-Host ""

# Save to .env
"VITE_API_URL=$API_URL" | Out-File -FilePath "../../.env" -Encoding UTF8
Write-Host "✅ .env file created" -ForegroundColor Green
