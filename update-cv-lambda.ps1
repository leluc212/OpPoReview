# Update CV Upload Lambda Function
$FunctionName = "CVUploadFunction"
$ZipFile = "cv-upload-lambda.zip"

Write-Host "Updating CV Upload Lambda Function..." -ForegroundColor Cyan

# Create zip file
Write-Host "Creating deployment package..." -ForegroundColor Yellow
if (Test-Path $ZipFile) {
    Remove-Item $ZipFile
}

Compress-Archive -Path "amplify/backend/cv-upload-lambda.py" -DestinationPath $ZipFile

# Update Lambda function
Write-Host "Uploading to Lambda..." -ForegroundColor Yellow
aws lambda update-function-code `
    --function-name $FunctionName `
    --zip-file fileb://$ZipFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "Lambda function updated successfully!" -ForegroundColor Green
    
    # Wait for update to complete
    Write-Host "Waiting for update to complete..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    
    # Get function info
    Write-Host ""
    Write-Host "Function info:" -ForegroundColor Cyan
    aws lambda get-function --function-name $FunctionName --query 'Configuration.[FunctionName,Runtime,LastModified]' --output table
    
} else {
    Write-Host "Failed to update Lambda function" -ForegroundColor Red
}

# Cleanup
Remove-Item $ZipFile -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- Changed presigned URL from 'attachment' to 'inline'" -ForegroundColor White
Write-Host "- CV will now open in browser instead of downloading" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test CV viewing in the application" -ForegroundColor White
Write-Host "2. Click 'Xem CV' should open PDF in new tab" -ForegroundColor White
Write-Host "3. Click 'Tai xuong CV' should download file" -ForegroundColor White
