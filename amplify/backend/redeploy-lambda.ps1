# Redeploy Lambda function with proper permissions
$FUNCTION_NAME = "CandidateProfileAPI"
$REGION = "ap-southeast-1"
$TABLE_NAME = "CandidateProfiles"

Write-Host "Redeploying Lambda function..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Package Lambda function
Write-Host "Step 1: Packaging Lambda function..." -ForegroundColor Yellow
if (Test-Path "candidate-profile-lambda.zip") {
    Remove-Item "candidate-profile-lambda.zip" -Force
}

# Create package with dependencies
npm install --production 2>$null

# Create zip file
Compress-Archive -Path "api-candidate-profile.cjs", "candidate-profile.cjs", "node_modules" -DestinationPath "candidate-profile-lambda.zip" -Force

Write-Host "✅ Lambda package created" -ForegroundColor Green
Write-Host ""

# Step 2: Update Lambda function code
Write-Host "Step 2: Updating Lambda function code..." -ForegroundColor Yellow
try {
    aws lambda update-function-code `
        --function-name $FUNCTION_NAME `
        --zip-file fileb://candidate-profile-lambda.zip `
        --region $REGION | Out-Null
    
    Write-Host "✅ Lambda code updated" -ForegroundColor Green
} catch {
    Write-Host "❌ Error updating Lambda code: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Function may not exist. Creating new function..." -ForegroundColor Yellow
    
    # Get IAM role ARN
    $roleName = "CandidateProfileLambdaRole"
    $roleArn = (aws iam get-role --role-name $roleName --region $REGION 2>$null | ConvertFrom-Json).Role.Arn
    
    if (-not $roleArn) {
        Write-Host "❌ IAM role not found. Please run deploy-complete-api.ps1 first" -ForegroundColor Red
        exit 1
    }
    
    # Create function
    aws lambda create-function `
        --function-name $FUNCTION_NAME `
        --runtime nodejs18.x `
        --role $roleArn `
        --handler api-candidate-profile.handler `
        --zip-file fileb://candidate-profile-lambda.zip `
        --timeout 30 `
        --memory-size 512 `
        --environment "Variables={CANDIDATE_PROFILE_TABLE=$TABLE_NAME,AWS_REGION=$REGION}" `
        --region $REGION | Out-Null
    
    Write-Host "✅ Lambda function created" -ForegroundColor Green
}

Write-Host ""

# Step 3: Update environment variables
Write-Host "Step 3: Updating environment variables..." -ForegroundColor Yellow
aws lambda update-function-configuration `
    --function-name $FUNCTION_NAME `
    --environment "Variables={CANDIDATE_PROFILE_TABLE=$TABLE_NAME,AWS_REGION=$REGION}" `
    --region $REGION | Out-Null

Write-Host "✅ Environment variables updated" -ForegroundColor Green
Write-Host ""

# Step 4: Wait for function to be ready
Write-Host "Step 4: Waiting for function to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host "✅ Function ready" -ForegroundColor Green
Write-Host ""

# Step 5: Test Lambda function
Write-Host "Step 5: Testing Lambda function..." -ForegroundColor Yellow
$testEvent = @{
    httpMethod = "GET"
    path = "/profile/test-user-123"
    pathParameters = @{
        userId = "test-user-123"
    }
    requestContext = @{}
} | ConvertTo-Json -Depth 10

$testEvent | Out-File -FilePath "test-event.json" -Encoding UTF8

try {
    $result = aws lambda invoke `
        --function-name $FUNCTION_NAME `
        --payload file://test-event.json `
        --region $REGION `
        response.json
    
    $response = Get-Content response.json | ConvertFrom-Json
    Write-Host "Response:" -ForegroundColor White
    Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor Cyan
    
    if ($response.statusCode -eq 404 -or $response.statusCode -eq 200) {
        Write-Host "✅ Lambda function working correctly" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Unexpected response code: $($response.statusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error testing Lambda: $($_.Exception.Message)" -ForegroundColor Red
}

# Cleanup
Remove-Item "test-event.json" -ErrorAction SilentlyContinue
Remove-Item "response.json" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Lambda redeployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run fix-cors.ps1 to configure CORS" -ForegroundColor White
Write-Host "2. Test API using test-api.ps1" -ForegroundColor White
