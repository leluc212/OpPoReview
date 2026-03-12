# Simple PowerShell script to deploy API Gateway + Lambda
# Run: .\amplify\backend\deploy-api-simple.ps1

$REGION = "ap-southeast-1"
$ACCOUNT_ID = "726911960757"
$ROLE_NAME = "CandidateProfileLambdaRole"
$FUNCTION_NAME = "CandidateProfileAPI"
$TABLE_NAME = "CandidateProfiles"

Write-Host "Deploying API Infrastructure" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create IAM Role
Write-Host "Step 1: Creating IAM Role..." -ForegroundColor Yellow
$roleCheck = aws iam get-role --role-name $ROLE_NAME 2>&1
if ($LASTEXITCODE -ne 0) {
    aws iam create-role --role-name $ROLE_NAME --assume-role-policy-document file://amplify/backend/lambda-trust-policy.json
    Write-Host "Role created" -ForegroundColor Green
} else {
    Write-Host "Role already exists" -ForegroundColor Green
}

# Step 2: Attach Policies
Write-Host ""
Write-Host "Step 2: Attaching Policies..." -ForegroundColor Yellow
aws iam attach-role-policy --role-name $ROLE_NAME --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam put-role-policy --role-name $ROLE_NAME --policy-name DynamoDBAccess --policy-document file://amplify/backend/dynamodb-policy.json
Write-Host "Policies attached" -ForegroundColor Green

# Wait for IAM
Write-Host "Waiting for IAM propagation..." -ForegroundColor White
Start-Sleep -Seconds 10

# Step 3: Package Lambda
Write-Host ""
Write-Host "Step 3: Packaging Lambda..." -ForegroundColor Yellow

if (!(Test-Path "amplify/backend/node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor White
    Push-Location amplify/backend
    npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
    Pop-Location
}

if (Test-Path "amplify/backend/candidate-profile-lambda.zip") {
    Remove-Item "amplify/backend/candidate-profile-lambda.zip"
}

Push-Location amplify/backend
Compress-Archive -Path api-candidate-profile.cjs,candidate-profile.cjs,node_modules,package.json -DestinationPath candidate-profile-lambda.zip -Force
Pop-Location
Write-Host "Package created" -ForegroundColor Green

# Step 4: Deploy Lambda
Write-Host ""
Write-Host "Step 4: Deploying Lambda..." -ForegroundColor Yellow

$functionCheck = aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating function..." -ForegroundColor White
    aws lambda create-function `
        --function-name $FUNCTION_NAME `
        --runtime nodejs18.x `
        --role "arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}" `
        --handler api-candidate-profile.handler `
        --zip-file fileb://amplify/backend/candidate-profile-lambda.zip `
        --timeout 30 `
        --memory-size 256 `
        --environment "Variables={CANDIDATE_PROFILE_TABLE=$TABLE_NAME}" `
        --region $REGION
} else {
    Write-Host "Updating function..." -ForegroundColor White
    aws lambda update-function-code `
        --function-name $FUNCTION_NAME `
        --zip-file fileb://amplify/backend/candidate-profile-lambda.zip `
        --region $REGION
}
Write-Host "Lambda deployed" -ForegroundColor Green

Write-Host ""
Write-Host "============================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Lambda Function: $FUNCTION_NAME" -ForegroundColor White
Write-Host "Region: $REGION" -ForegroundColor White
Write-Host ""
Write-Host "Next: Create API Gateway manually in AWS Console" -ForegroundColor Yellow
Write-Host "Or run the full deployment script" -ForegroundColor Yellow
