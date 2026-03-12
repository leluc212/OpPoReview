# Rebuild Employer Profile API from scratch
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Rebuilding Employer Profile API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$API_NAME = "EmployerProfileAPI"
$LAMBDA_NAME = "EmployerProfileAPI"
$TABLE_NAME = "EmployerProfiles"
$REGION = "ap-southeast-1"

# Step 1: Delete old API Gateway
Write-Host "`n1. Cleaning up old API Gateway..." -ForegroundColor Yellow
$oldApis = aws apigateway get-rest-apis --query "items[?name=='$API_NAME'].id" --output text
if ($oldApis) {
    foreach ($apiId in $oldApis -split "`t") {
        Write-Host "   Deleting API: $apiId" -ForegroundColor Gray
        aws apigateway delete-rest-api --rest-api-id $apiId 2>&1 | Out-Null
    }
    Write-Host "   Old APIs deleted" -ForegroundColor Green
} else {
    Write-Host "   No old APIs found" -ForegroundColor Gray
}

# Step 2: Update Lambda code
Write-Host "`n2. Updating Lambda function..." -ForegroundColor Yellow
if (Test-Path "employer-profile-lambda.zip") {
    aws lambda update-function-code `
        --function-name $LAMBDA_NAME `
        --zip-file fileb://employer-profile-lambda.zip `
        --output json | Out-Null
    Write-Host "   Lambda code updated" -ForegroundColor Green
    Start-Sleep -Seconds 3
} else {
    Write-Host "   ERROR: employer-profile-lambda.zip not found" -ForegroundColor Red
    exit 1
}

# Step 3: Create new REST API
Write-Host "`n3. Creating new REST API..." -ForegroundColor Yellow
$apiResult = aws apigateway create-rest-api `
    --name $API_NAME `
    --description "Employer profile API" `
    --endpoint-configuration types=REGIONAL `
    --output json | ConvertFrom-Json

$API_ID = $apiResult.id
$ROOT_ID = $apiResult.rootResourceId
Write-Host "   API created: $API_ID" -ForegroundColor Green

# Step 4: Get Lambda ARN
$lambdaArn = aws lambda get-function `
    --function-name $LAMBDA_NAME `
    --query 'Configuration.FunctionArn' `
    --output text

$accountId = aws sts get-caller-identity --query Account --output text

# Step 5: Create /profile resource
Write-Host "`n4. Creating resources..." -ForegroundColor Yellow
$profileResource = aws apigateway create-resource `
    --rest-api-id $API_ID `
    --parent-id $ROOT_ID `
    --path-part "profile" `
    --output json | ConvertFrom-Json

$PROFILE_ID = $profileResource.id
Write-Host "   /profile created: $PROFILE_ID" -ForegroundColor Green

# Step 6: Create /profile/{userId} resource
$userIdResource = aws apigateway create-resource `
    --rest-api-id $API_ID `
    --parent-id $PROFILE_ID `
    --path-part "{userId}" `
    --output json | ConvertFrom-Json

$USERID_ID = $userIdResource.id
Write-Host "   /profile/{userId} created: $USERID_ID" -ForegroundColor Green

# Step 7: Create methods and integrations
Write-Host "`n5. Creating methods and integrations..." -ForegroundColor Yellow

# POST /profile
Write-Host "   POST /profile" -ForegroundColor Gray
aws apigateway put-method `
    --rest-api-id $API_ID `
    --resource-id $PROFILE_ID `
    --http-method POST `
    --authorization-type NONE `
    --output json | Out-Null

aws apigateway put-integration `
    --rest-api-id $API_ID `
    --resource-id $PROFILE_ID `
    --http-method POST `
    --type AWS_PROXY `
    --integration-http-method POST `
    --uri "arn:aws:apigateway:$REGION`:lambda:path/2015-03-31/functions/$lambdaArn/invocations" `
    --output json | Out-Null

# GET /profile/{userId}
Write-Host "   GET /profile/{userId}" -ForegroundColor Gray
aws apigateway put-method `
    --rest-api-id $API_ID `
    --resource-id $USERID_ID `
    --http-method GET `
    --authorization-type NONE `
    --request-parameters '{"method.request.path.userId":true}' `
    --output json | Out-Null

aws apigateway put-integration `
    --rest-api-id $API_ID `
    --resource-id $USERID_ID `
    --http-method GET `
    --type AWS_PROXY `
    --integration-http-method POST `
    --uri "arn:aws:apigateway:$REGION`:lambda:path/2015-03-31/functions/$lambdaArn/invocations" `
    --output json | Out-Null

# PUT /profile/{userId}
Write-Host "   PUT /profile/{userId}" -ForegroundColor Gray
aws apigateway put-method `
    --rest-api-id $API_ID `
    --resource-id $USERID_ID `
    --http-method PUT `
    --authorization-type NONE `
    --request-parameters '{"method.request.path.userId":true}' `
    --output json | Out-Null

aws apigateway put-integration `
    --rest-api-id $API_ID `
    --resource-id $USERID_ID `
    --http-method PUT `
    --type AWS_PROXY `
    --integration-http-method POST `
    --uri "arn:aws:apigateway:$REGION`:lambda:path/2015-03-31/functions/$lambdaArn/invocations" `
    --output json | Out-Null

# DELETE /profile/{userId}
Write-Host "   DELETE /profile/{userId}" -ForegroundColor Gray
aws apigateway put-method `
    --rest-api-id $API_ID `
    --resource-id $USERID_ID `
    --http-method DELETE `
    --authorization-type NONE `
    --request-parameters '{"method.request.path.userId":true}' `
    --output json | Out-Null

aws apigateway put-integration `
    --rest-api-id $API_ID `
    --resource-id $USERID_ID `
    --http-method DELETE `
    --type AWS_PROXY `
    --integration-http-method POST `
    --uri "arn:aws:apigateway:$REGION`:lambda:path/2015-03-31/functions/$lambdaArn/invocations" `
    --output json | Out-Null

Write-Host "   Methods created" -ForegroundColor Green

# Step 8: Enable CORS
Write-Host "`n6. Enabling CORS..." -ForegroundColor Yellow

foreach ($resourceId in @($PROFILE_ID, $USERID_ID)) {
    # OPTIONS method
    aws apigateway put-method `
        --rest-api-id $API_ID `
        --resource-id $resourceId `
        --http-method OPTIONS `
        --authorization-type NONE `
        --output json | Out-Null
    
    # Mock integration
    aws apigateway put-integration `
        --rest-api-id $API_ID `
        --resource-id $resourceId `
        --http-method OPTIONS `
        --type MOCK `
        --request-templates '{\"application/json\":\"{\\\"statusCode\\\": 200}\"}' `
        --output json | Out-Null
    
    # Method response
    aws apigateway put-method-response `
        --rest-api-id $API_ID `
        --resource-id $resourceId `
        --http-method OPTIONS `
        --status-code 200 `
        --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":false,\"method.response.header.Access-Control-Allow-Methods\":false,\"method.response.header.Access-Control-Allow-Origin\":false}' `
        --output json | Out-Null
    
    # Integration response
    aws apigateway put-integration-response `
        --rest-api-id $API_ID `
        --resource-id $resourceId `
        --http-method OPTIONS `
        --status-code 200 `
        --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":\"'"'"'Content-Type,Authorization'"'"'\",\"method.response.header.Access-Control-Allow-Methods\":\"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'\",\"method.response.header.Access-Control-Allow-Origin\":\"'"'"'*'"'"'\"}' `
        --output json | Out-Null
}

Write-Host "   CORS enabled" -ForegroundColor Green

# Step 9: Grant Lambda permission
Write-Host "`n7. Granting Lambda permissions..." -ForegroundColor Yellow
aws lambda remove-permission `
    --function-name $LAMBDA_NAME `
    --statement-id apigateway-$API_ID `
    2>&1 | Out-Null

aws lambda add-permission `
    --function-name $LAMBDA_NAME `
    --statement-id apigateway-$API_ID `
    --action lambda:InvokeFunction `
    --principal apigateway.amazonaws.com `
    --source-arn "arn:aws:execute-api:$REGION`:$accountId`:$API_ID/*/*" `
    --output json | Out-Null

Write-Host "   Permissions granted" -ForegroundColor Green

# Step 10: Deploy API
Write-Host "`n8. Deploying API..." -ForegroundColor Yellow
$deployment = aws apigateway create-deployment `
    --rest-api-id $API_ID `
    --stage-name prod `
    --stage-description "Production deployment" `
    --output json | ConvertFrom-Json

Write-Host "   Deployment created: $($deployment.id)" -ForegroundColor Green

# Step 11: Update .env file
Write-Host "`n9. Updating .env file..." -ForegroundColor Yellow
$apiUrl = "https://$API_ID.execute-api.$REGION.amazonaws.com/prod"

$envPath = "../../.env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    if ($envContent -match 'VITE_EMPLOYER_API_URL=.*') {
        $envContent = $envContent -replace 'VITE_EMPLOYER_API_URL=.*', "VITE_EMPLOYER_API_URL=$apiUrl"
    } else {
        $envContent += "`nVITE_EMPLOYER_API_URL=$apiUrl"
    }
    [System.IO.File]::WriteAllText((Resolve-Path $envPath), $envContent, [System.Text.Encoding]::UTF8)
    Write-Host "   .env updated" -ForegroundColor Green
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "API Rebuild Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "API ID: $API_ID" -ForegroundColor White
Write-Host "API URL: $apiUrl" -ForegroundColor White
Write-Host "Lambda: $LAMBDA_NAME" -ForegroundColor White
Write-Host "Table: $TABLE_NAME" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
