# Update Employer Profile Lambda Function
Write-Host "Updating Employer Profile Lambda Function" -ForegroundColor Cyan
Write-Host ""

$REGION = "ap-southeast-1"
$FUNCTION_NAME = "EmployerProfileAPI"

# Step 1: Create deployment package
Write-Host "Step 1: Creating deployment package..." -ForegroundColor Yellow

# Navigate to backend directory
Push-Location amplify/backend

try {
    # Check if required files exist
    if (-not (Test-Path "api-employer-profile.cjs")) {
        Write-Host "Error: api-employer-profile.cjs not found" -ForegroundColor Red
        exit 1
    }
    
    if (-not (Test-Path "employer-profile.cjs")) {
        Write-Host "Error: employer-profile.cjs not found" -ForegroundColor Red
        exit 1
    }
    
    # Create zip file
    Write-Host "   Creating zip file..." -ForegroundColor Gray
    
    # Remove old zip if exists
    if (Test-Path "employer-profile-lambda-updated.zip") {
        Remove-Item "employer-profile-lambda-updated.zip" -Force
    }
    
    # Create new zip with necessary files
    Compress-Archive -Path "api-employer-profile.cjs", "employer-profile.cjs" -DestinationPath "employer-profile-lambda-updated.zip" -Force
    
    Write-Host "   Deployment package created" -ForegroundColor Green
    Write-Host ""
    
    # Step 2: Update Lambda function code
    Write-Host "Step 2: Updating Lambda function code..." -ForegroundColor Yellow
    
    $updateResult = aws lambda update-function-code `
        --function-name $FUNCTION_NAME `
        --zip-file fileb://employer-profile-lambda-updated.zip `
        --region $REGION 2>&1 | ConvertFrom-Json
    
    if ($updateResult.FunctionName) {
        Write-Host "   Lambda function code updated" -ForegroundColor Green
        Write-Host "   Function: $($updateResult.FunctionName)" -ForegroundColor Gray
        Write-Host "   Version: $($updateResult.Version)" -ForegroundColor Gray
    } else {
        Write-Host "   Failed to update Lambda function" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    
    # Step 3: Wait for update to complete
    Write-Host "Step 3: Waiting for update to complete..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    
    Write-Host ""
    Write-Host "Lambda function updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Refresh your browser and test the Employer Profile page" -ForegroundColor White
    Write-Host "   2. Try saving profile data" -ForegroundColor White
    
} catch {
    Write-Host "Error updating Lambda function" -ForegroundColor Red
    Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}
