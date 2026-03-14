# Update Employer Profile Lambda with Admin Routes
Write-Host "Updating Employer Profile Lambda with Admin Routes" -ForegroundColor Cyan
Write-Host ""

$REGION = "ap-southeast-1"
$FUNCTION_NAME = "EmployerProfileAPI"

# Navigate to backend directory
Push-Location amplify/backend

try {
    # Check if required files exist
    if (-not (Test-Path "api-employer-profile-admin.cjs")) {
        Write-Host "Error: api-employer-profile-admin.cjs not found" -ForegroundColor Red
        exit 1
    }
    
    if (-not (Test-Path "employer-profile.cjs")) {
        Write-Host "Error: employer-profile.cjs not found" -ForegroundColor Red
        exit 1
    }
    
    # Check if jsonwebtoken is in package
    Write-Host "Step 1: Preparing deployment package..." -ForegroundColor Yellow
    
    # Create temporary directory
    $tempDir = "temp-lambda-package"
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $tempDir | Out-Null
    
    # Copy Lambda files
    Copy-Item "api-employer-profile-admin.cjs" "$tempDir/index.cjs"
    Copy-Item "employer-profile.cjs" "$tempDir/employer-profile.cjs"
    
    # Create package.json for jsonwebtoken
    $packageJson = @{
        name = "employer-profile-api"
        version = "1.0.0"
        dependencies = @{
            jsonwebtoken = "^9.0.2"
        }
    } | ConvertTo-Json
    
    Set-Content -Path "$tempDir/package.json" -Value $packageJson
    
    Write-Host "   Installing dependencies..." -ForegroundColor Gray
    Push-Location $tempDir
    npm install --production 2>&1 | Out-Null
    Pop-Location
    
    # Create zip file
    Write-Host "   Creating zip file..." -ForegroundColor Gray
    
    if (Test-Path "employer-admin-lambda.zip") {
        Remove-Item "employer-admin-lambda.zip" -Force
    }
    
    # Zip everything in temp directory
    Push-Location $tempDir
    Compress-Archive -Path * -DestinationPath "../employer-admin-lambda.zip" -Force
    Pop-Location
    
    # Clean up temp directory
    Remove-Item $tempDir -Recurse -Force
    
    Write-Host "   Deployment package created" -ForegroundColor Green
    Write-Host ""
    
    # Step 2: Update Lambda function code
    Write-Host "Step 2: Updating Lambda function code..." -ForegroundColor Yellow
    
    $updateResult = aws lambda update-function-code `
        --function-name $FUNCTION_NAME `
        --zip-file fileb://employer-admin-lambda.zip `
        --region $REGION | ConvertFrom-Json
    
    if ($updateResult.FunctionName) {
        Write-Host "   Lambda function code updated" -ForegroundColor Green
        Write-Host "   Function: $($updateResult.FunctionName)" -ForegroundColor Gray
        Write-Host "   Version: $($updateResult.Version)" -ForegroundColor Gray
        Write-Host "   Handler: $($updateResult.Handler)" -ForegroundColor Gray
    } else {
        Write-Host "   Failed to update Lambda function" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    
    # Step 3: Update handler if needed
    Write-Host "Step 3: Updating Lambda handler..." -ForegroundColor Yellow
    
    aws lambda update-function-configuration `
        --function-name $FUNCTION_NAME `
        --handler "index.handler" `
        --region $REGION | Out-Null
    
    Write-Host "   Handler updated to index.handler" -ForegroundColor Green
    Write-Host ""
    
    # Step 4: Wait for update to complete
    Write-Host "Step 4: Waiting for update to complete..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    Write-Host ""
    Write-Host "Lambda function updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Admin routes available:" -ForegroundColor Cyan
    Write-Host "   GET  /admin/employers - List all employers" -ForegroundColor White
    Write-Host "   POST /admin/employers/{userId}/approve - Approve employer" -ForegroundColor White
    Write-Host "   POST /admin/employers/{userId}/reject - Reject employer" -ForegroundColor White
    Write-Host "   POST /admin/employers/{userId}/verify - Update verification" -ForegroundColor White
    Write-Host ""
    Write-Host "Test the admin page now!" -ForegroundColor Yellow
    
} catch {
    Write-Host "Error updating Lambda function" -ForegroundColor Red
    Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}
