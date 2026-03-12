# Create Employer Profile Lambda function - Simple version
Write-Host "Creating Employer Profile Lambda function..." -ForegroundColor Yellow

$FUNCTION_NAME = "EmployerProfileAPI"
$REGION = "ap-southeast-1"

# Use the same role as CandidateProfileAPI
$ROLE_ARN = "arn:aws:iam::726911960757:role/CandidateProfileLambdaRole"

try {
    # Create deployment package
    Write-Host "Creating deployment package..." -ForegroundColor Blue
    
    # Remove old zip if exists
    if (Test-Path "employer-profile-lambda.zip") {
        Remove-Item "employer-profile-lambda.zip"
    }
    
    # Create zip with files
    Compress-Archive -Path "api-employer-profile.cjs", "employer-profile.cjs", "package.json" -DestinationPath "employer-profile-lambda.zip" -Force
    
    Write-Host "Deployment package created: employer-profile-lambda.zip" -ForegroundColor Green
    
    # Create Lambda function
    Write-Host "Creating Lambda function..." -ForegroundColor Blue
    
    aws lambda create-function --function-name $FUNCTION_NAME --runtime nodejs18.x --role $ROLE_ARN --handler api-employer-profile.handler --zip-file fileb://employer-profile-lambda.zip --timeout 30 --memory-size 256 --environment Variables="{EMPLOYER_PROFILE_TABLE=EmployerProfiles}" --region $REGION
    
    Write-Host "Lambda function created successfully!" -ForegroundColor Green
    
    # Wait a moment for function to be ready
    Write-Host "Waiting for function to be ready..." -ForegroundColor Blue
    Start-Sleep -Seconds 10
    
    # Test the function with a simple invoke
    Write-Host "Testing Lambda function..." -ForegroundColor Blue
    
    $testPayload = '{"httpMethod":"GET","pathParameters":{"userId":"test-user"},"headers":{}}'
    
    aws lambda invoke --function-name $FUNCTION_NAME --payload $testPayload --region $REGION response.json
    
    if (Test-Path "response.json") {
        $response = Get-Content "response.json" -Raw
        Write-Host "Lambda response:" -ForegroundColor Cyan
        Write-Host $response -ForegroundColor White
        Remove-Item "response.json"
    }
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    
    # If function already exists, try to update it
    Write-Host "Function might already exist, trying to update..." -ForegroundColor Yellow
    try {
        aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://employer-profile-lambda.zip --region $REGION
        Write-Host "Lambda function updated successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Update also failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Employer Profile Lambda setup completed!" -ForegroundColor Green