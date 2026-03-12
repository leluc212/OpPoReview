# PowerShell script to deploy complete API Gateway + Lambda + DynamoDB
# Run: .\amplify\backend\deploy-complete-api.ps1

$ErrorActionPreference = "Stop"
$REGION = "ap-southeast-1"
$ACCOUNT_ID = "726911960757"
$ROLE_NAME = "CandidateProfileLambdaRole"
$FUNCTION_NAME = "CandidateProfileAPI"
$API_NAME = "CandidateProfileAPI"
$TABLE_NAME = "CandidateProfiles"

Write-Host "🚀 Deploying Complete API Infrastructure" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create IAM Role
Write-Host "📝 Step 1: Creating IAM Role..." -ForegroundColor Yellow
try {
    $roleExists = aws iam get-role --role-name $ROLE_NAME 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Role already exists" -ForegroundColor Green
    }
} catch {
    Write-Host "   Creating new role..." -ForegroundColor White
    aws iam create-role `
        --role-name $ROLE_NAME `
        --assume-role-policy-document file://amplify/backend/lambda-trust-policy.json `
        --region $REGION
    
    Write-Host "   ✅ Role created" -ForegroundColor Green
}

# Step 2: Attach Policies
Write-Host ""
Write-Host "📝 Step 2: Attaching Policies..." -ForegroundColor Yellow

# Basic Lambda execution
aws iam attach-role-policy `
    --role-name $ROLE_NAME `
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# DynamoDB access
aws iam put-role-policy `
    --role-name $ROLE_NAME `
    --policy-name DynamoDBAccess `
    --policy-document file://amplify/backend/dynamodb-policy.json

Write-Host "   ✅ Policies attached" -ForegroundColor Green

# Wait for role to propagate
Write-Host "   ⏳ Waiting for IAM role to propagate (10 seconds)..." -ForegroundColor White
Start-Sleep -Seconds 10

# Step 3: Package Lambda
Write-Host ""
Write-Host "📦 Step 3: Packaging Lambda Function..." -ForegroundColor Yellow

# Check if node_modules exists
if (!(Test-Path "amplify/backend/node_modules")) {
    Write-Host "   Installing dependencies..." -ForegroundColor White
    Push-Location amplify/backend
    npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb --save
    Pop-Location
}

# Create zip file
Write-Host "   Creating deployment package..." -ForegroundColor White
if (Test-Path "amplify/backend/candidate-profile-lambda.zip") {
    Remove-Item "amplify/backend/candidate-profile-lambda.zip"
}

Push-Location amplify/backend
Compress-Archive -Path api-candidate-profile.cjs,candidate-profile.cjs,node_modules -DestinationPath candidate-profile-lambda.zip -Force
Pop-Location

Write-Host "   ✅ Package created" -ForegroundColor Green

# Step 4: Deploy Lambda
Write-Host ""
Write-Host "🔧 Step 4: Deploying Lambda Function..." -ForegroundColor Yellow

try {
    $functionExists = aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   Updating existing function..." -ForegroundColor White
        aws lambda update-function-code `
            --function-name $FUNCTION_NAME `
            --zip-file fileb://amplify/backend/candidate-profile-lambda.zip `
            --region $REGION
        
        Write-Host "   ✅ Function updated" -ForegroundColor Green
    }
} catch {
    Write-Host "   Creating new function..." -ForegroundColor White
    aws lambda create-function `
        --function-name $FUNCTION_NAME `
        --runtime nodejs18.x `
        --role "arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}" `
        --handler api-candidate-profile.handler `
        --zip-file fileb://amplify/backend/candidate-profile-lambda.zip `
        --timeout 30 `
        --memory-size 256 `
        --environment "Variables={CANDIDATE_PROFILE_TABLE=$TABLE_NAME,AWS_REGION=$REGION}" `
        --region $REGION
    
    Write-Host "   ✅ Function created" -ForegroundColor Green
}

# Step 5: Create API Gateway
Write-Host ""
Write-Host "🌐 Step 5: Creating API Gateway..." -ForegroundColor Yellow

# Check if API exists
$apis = aws apigateway get-rest-apis --region $REGION | ConvertFrom-Json
$existingApi = $apis.items | Where-Object { $_.name -eq $API_NAME }

if ($existingApi) {
    $API_ID = $existingApi.id
    Write-Host "   ✅ API already exists: $API_ID" -ForegroundColor Green
} else {
    Write-Host "   Creating new API..." -ForegroundColor White
    $apiResult = aws apigateway create-rest-api `
        --name $API_NAME `
        --description "API for managing candidate profiles" `
        --endpoint-configuration types=REGIONAL `
        --region $REGION | ConvertFrom-Json
    
    $API_ID = $apiResult.id
    Write-Host "   ✅ API created: $API_ID" -ForegroundColor Green
}

# Get root resource
$resources = aws apigateway get-resources --rest-api-id $API_ID --region $REGION | ConvertFrom-Json
$ROOT_ID = ($resources.items | Where-Object { $_.path -eq "/" }).id

Write-Host "   Root Resource ID: $ROOT_ID" -ForegroundColor White

# Step 6: Create Resources
Write-Host ""
Write-Host "📁 Step 6: Creating API Resources..." -ForegroundColor Yellow

# Create /profile resource
$profileResource = $resources.items | Where-Object { $_.path -eq "/profile" }
if (!$profileResource) {
    Write-Host "   Creating /profile resource..." -ForegroundColor White
    $profileResult = aws apigateway create-resource `
        --rest-api-id $API_ID `
        --parent-id $ROOT_ID `
        --path-part profile `
        --region $REGION | ConvertFrom-Json
    $PROFILE_ID = $profileResult.id
} else {
    $PROFILE_ID = $profileResource.id
}

Write-Host "   ✅ /profile resource: $PROFILE_ID" -ForegroundColor Green

# Create /{userId} resource
$userIdResource = $resources.items | Where-Object { $_.path -eq "/profile/{userId}" }
if (!$userIdResource) {
    Write-Host "   Creating /profile/{userId} resource..." -ForegroundColor White
    $userIdResult = aws apigateway create-resource `
        --rest-api-id $API_ID `
        --parent-id $PROFILE_ID `
        --path-part "{userId}" `
        --region $REGION | ConvertFrom-Json
    $USER_ID_RESOURCE_ID = $userIdResult.id
} else {
    $USER_ID_RESOURCE_ID = $userIdResource.id
}

Write-Host "   ✅ /profile/{userId} resource: $USER_ID_RESOURCE_ID" -ForegroundColor Green

# Step 7: Grant Lambda Permission
Write-Host ""
Write-Host "🔐 Step 7: Granting Lambda Permission..." -ForegroundColor Yellow

try {
    aws lambda add-permission `
        --function-name $FUNCTION_NAME `
        --statement-id apigateway-invoke-$(Get-Random) `
        --action lambda:InvokeFunction `
        --principal apigateway.amazonaws.com `
        --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*" `
        --region $REGION 2>$null
    
    Write-Host "   ✅ Permission granted" -ForegroundColor Green
} catch {
    Write-Host "   ℹ️  Permission may already exist" -ForegroundColor White
}

# Step 8: Deploy API
Write-Host ""
Write-Host "🚀 Step 8: Deploying API..." -ForegroundColor Yellow

aws apigateway create-deployment `
    --rest-api-id $API_ID `
    --stage-name prod `
    --stage-description "Production stage" `
    --description "Deployment at $(Get-Date)" `
    --region $REGION

Write-Host "   ✅ API deployed" -ForegroundColor Green

# Step 9: Display Results
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 API Information:" -ForegroundColor Yellow
Write-Host "   API ID: $API_ID" -ForegroundColor White
Write-Host "   Region: $REGION" -ForegroundColor White
Write-Host ""
Write-Host "🔗 API Endpoint:" -ForegroundColor Yellow
$API_URL = "https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod"
Write-Host "   $API_URL" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Create .env file with:" -ForegroundColor White
Write-Host "      VITE_API_URL=$API_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "   2. Test API:" -ForegroundColor White
Write-Host "      curl $API_URL/profile/test-user-123" -ForegroundColor Cyan
Write-Host ""
Write-Host "   3. View in AWS Console:" -ForegroundColor White
Write-Host "      https://console.aws.amazon.com/apigateway/home?region=$REGION#/apis/$API_ID" -ForegroundColor Cyan
Write-Host ""

# Save API URL to file
$API_URL | Out-File -FilePath ".env.production" -Encoding UTF8
Write-Host "✅ API URL saved to .env.production" -ForegroundColor Green
