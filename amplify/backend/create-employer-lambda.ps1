# Create Employer Profile Lambda function
Write-Host "Creating Employer Profile Lambda function..." -ForegroundColor Yellow

$FUNCTION_NAME = "EmployerProfileAPI"
$REGION = "ap-southeast-1"
$ROLE_NAME = "EmployerProfileLambdaRole"

try {
    # Check if role exists
    Write-Host "Checking if IAM role exists..." -ForegroundColor Blue
    try {
        aws iam get-role --role-name $ROLE_NAME --region $REGION
        Write-Host "IAM role already exists: $ROLE_NAME" -ForegroundColor Green
    }
    catch {
        Write-Host "Creating IAM role..." -ForegroundColor Blue
        
        # Create trust policy
        $trustPolicy = @{
            Version = "2012-10-17"
            Statement = @(
                @{
                    Effect = "Allow"
                    Principal = @{
                        Service = "lambda.amazonaws.com"
                    }
                    Action = "sts:AssumeRole"
                }
            )
        } | ConvertTo-Json -Depth 10
        
        $trustPolicy | Out-File -FilePath "trust-policy.json" -Encoding UTF8
        
        # Create role
        aws iam create-role --role-name $ROLE_NAME --assume-role-policy-document file://trust-policy.json --region $REGION
        
        # Attach basic execution policy
        aws iam attach-role-policy --role-name $ROLE_NAME --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" --region $REGION
        
        # Attach DynamoDB policy
        aws iam attach-role-policy --role-name $ROLE_NAME --policy-arn "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess" --region $REGION
        
        Write-Host "IAM role created: $ROLE_NAME" -ForegroundColor Green
        
        # Clean up
        Remove-Item "trust-policy.json" -ErrorAction SilentlyContinue
    }
    
    # Get role ARN
    $roleInfo = aws iam get-role --role-name $ROLE_NAME --region $REGION --output json | ConvertFrom-Json
    $ROLE_ARN = $roleInfo.Role.Arn
    Write-Host "Role ARN: $ROLE_ARN" -ForegroundColor Cyan
    
    # Create deployment package
    Write-Host "Creating deployment package..." -ForegroundColor Blue
    
    # Remove old zip if exists
    if (Test-Path "employer-profile-lambda.zip") {
        Remove-Item "employer-profile-lambda.zip"
    }
    
    # Create zip with files
    Compress-Archive -Path "api-employer-profile.cjs", "employer-profile.cjs", "package.json" -DestinationPath "employer-profile-lambda.zip" -Force
    
    Write-Host "Deployment package created: employer-profile-lambda.zip" -ForegroundColor Green
    
    # Check if function exists
    Write-Host "Checking if Lambda function exists..." -ForegroundColor Blue
    try {
        aws lambda get-function --function-name $FUNCTION_NAME --region $REGION
        Write-Host "Function exists, updating code..." -ForegroundColor Yellow
        
        # Update existing function
        aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://employer-profile-lambda.zip --region $REGION
        
        Write-Host "Lambda function updated successfully!" -ForegroundColor Green
    }
    catch {
        Write-Host "Creating new Lambda function..." -ForegroundColor Blue
        
        # Wait for role to be ready
        Write-Host "Waiting for IAM role to be ready..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        # Create Lambda function
        aws lambda create-function --function-name $FUNCTION_NAME --runtime nodejs18.x --role $ROLE_ARN --handler api-employer-profile.handler --zip-file fileb://employer-profile-lambda.zip --timeout 30 --memory-size 256 --environment Variables="{EMPLOYER_PROFILE_TABLE=EmployerProfiles}" --region $REGION
        
        Write-Host "Lambda function created successfully!" -ForegroundColor Green
    }
    
    # Test the function
    Write-Host "Testing Lambda function..." -ForegroundColor Blue
    Start-Sleep -Seconds 5
    
    # Create test event
    $testEvent = @{
        httpMethod = "GET"
        pathParameters = @{
            userId = "test-user"
        }
        headers = @{}
        body = $null
    } | ConvertTo-Json -Depth 10
    
    $testEvent | Out-File -FilePath "test-event.json" -Encoding UTF8
    
    try {
        $result = aws lambda invoke --function-name $FUNCTION_NAME --payload file://test-event.json --region $REGION response.json
        $response = Get-Content "response.json" | ConvertFrom-Json
        
        Write-Host "Lambda test result:" -ForegroundColor Cyan
        Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor White
        
        # Clean up test files
        Remove-Item "test-event.json" -ErrorAction SilentlyContinue
        Remove-Item "response.json" -ErrorAction SilentlyContinue
        
    } catch {
        Write-Host "Lambda test failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Employer Profile Lambda function setup completed!" -ForegroundColor Green