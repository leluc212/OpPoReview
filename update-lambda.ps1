$REGION = "ap-southeast-1"
$FUNCTION_NAME = "EmployerProfileAPI"

Write-Host "Updating Employer Profile Lambda Function" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Creating deployment package..." -ForegroundColor Yellow

Push-Location amplify/backend

try {
    # Check if required files exist
    if (-not (Test-Path "api-employer-profile.cjs")) {
        Write-Host "Error: api-employer-profile.cjs not found" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    if (-not (Test-Path "employer-profile.cjs")) {
        Write-Host "Error: employer-profile.cjs not found" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    # Install dependencies
    if (Test-Path "package.json") {
        Write-Host "   Installing dependencies..." -ForegroundColor Gray
        npm install --production 2>&1 | Out-Null
    }
    
    # Remove old zip
    if (Test-Path "employer-profile-lambda-updated.zip") {
        Remove-Item "employer-profile-lambda-updated.zip" -Force
    }
    
    # Create new zip
    Write-Host "   Creating zip file..." -ForegroundColor Gray
    if (Test-Path "node_modules") {
        Compress-Archive -Path "api-employer-profile.cjs", "employer-profile.cjs", "package.json", "node_modules" -DestinationPath "employer-profile-lambda-updated.zip" -Force
    } else {
        Compress-Archive -Path "api-employer-profile.cjs", "employer-profile.cjs", "package.json" -DestinationPath "employer-profile-lambda-updated.zip" -Force
    }
    
    Write-Host "   Deployment package created" -ForegroundColor Green
    Write-Host ""
    
    # Update Lambda function
    Write-Host "Step 2: Updating Lambda function code..." -ForegroundColor Yellow
    
    $updateResult = aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://employer-profile-lambda-updated.zip --region $REGION 2>&1 | ConvertFrom-Json
    
    if ($updateResult.FunctionName) {
        Write-Host "   Lambda function code updated" -ForegroundColor Green
        Write-Host "   Function: $($updateResult.FunctionName)" -ForegroundColor Gray
        Write-Host "   Version: $($updateResult.Version)" -ForegroundColor Gray
        Write-Host "   Last Modified: $($updateResult.LastModified)" -ForegroundColor Gray
    } else {
        Write-Host "   Failed to update Lambda function" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Write-Host ""
    Write-Host "Step 3: Waiting for update to complete..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    $functionInfo = aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>&1 | ConvertFrom-Json
    
    if ($functionInfo.Configuration.State -eq "Active") {
        Write-Host "   Function is active and ready" -ForegroundColor Green
    } else {
        Write-Host "   Function state: $($functionInfo.Configuration.State)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Lambda function updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Test API: Open test-employer-api.html in browser" -ForegroundColor White
    Write-Host "2. Test in app: Login as employer and update profile" -ForegroundColor White
    
} catch {
    Write-Host "Error updating Lambda function" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} finally {
    Pop-Location
}
