# Deploy Multiple CV Backend
Write-Host "Deploying Multiple CV Backend..." -ForegroundColor Cyan
Write-Host ""

$REGION = "ap-southeast-1"
$FUNCTION_NAME = "CVUploadFunction"
$LAMBDA_FILE = "cv-upload-lambda-v2.py"

# Navigate to backend directory
Push-Location amplify/backend

try {
    Write-Host "Step 1: Creating deployment package..." -ForegroundColor Yellow
    
    # Check if Lambda file exists
    if (-not (Test-Path $LAMBDA_FILE)) {
        Write-Host "Error: $LAMBDA_FILE not found" -ForegroundColor Red
        exit 1
    }
    
    # Create zip file
    if (Test-Path "cv-upload-v2.zip") {
        Remove-Item "cv-upload-v2.zip" -Force
    }
    
    Compress-Archive -Path $LAMBDA_FILE -DestinationPath "cv-upload-v2.zip" -Force
    Write-Host "  Deployment package created" -ForegroundColor Green
    Write-Host ""
    
    # Step 2: Update Lambda function
    Write-Host "Step 2: Updating Lambda function..." -ForegroundColor Yellow
    
    $updateResult = aws lambda update-function-code `
        --function-name $FUNCTION_NAME `
        --zip-file fileb://cv-upload-v2.zip `
        --region $REGION | ConvertFrom-Json
    
    if ($updateResult.FunctionName) {
        Write-Host "  Lambda function updated" -ForegroundColor Green
        Write-Host "  Function: $($updateResult.FunctionName)" -ForegroundColor Gray
        Write-Host "  Version: $($updateResult.Version)" -ForegroundColor Gray
    } else {
        Write-Host "  Failed to update Lambda function" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "Step 3: Waiting for update to complete..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    Write-Host ""
    Write-Host "Lambda function updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "New features:" -ForegroundColor Cyan
    Write-Host "  - Upload up to 3 CVs per user" -ForegroundColor White
    Write-Host "  - GET /cv/{userId} returns array of CVs" -ForegroundColor White
    Write-Host "  - DELETE /cv/{userId}/{cvId} deletes specific CV" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Update frontend service to use new API format" -ForegroundColor White
    Write-Host "  2. Test CV upload/delete functionality" -ForegroundColor White
    
} catch {
    Write-Host "Error deploying Lambda function" -ForegroundColor Red
    Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}
