# PowerShell script to update Notifications Lambda function
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Updating Notifications Lambda Function" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$REGION = "ap-southeast-1"
$LAMBDA_NAME = "notifications-handler"

Write-Host "`n[1/2] Creating Lambda package..." -ForegroundColor Yellow
if (Test-Path "notifications-lambda.zip") { 
    Remove-Item "notifications-lambda.zip" -Force
}
Compress-Archive -Path "notifications-lambda.py" -DestinationPath "notifications-lambda.zip" -Force
Write-Host "Package created" -ForegroundColor Green

Write-Host "`n[2/2] Updating Lambda function code..." -ForegroundColor Yellow
aws lambda update-function-code --function-name $LAMBDA_NAME --zip-file fileb://notifications-lambda.zip --region $REGION 2>&1 | Out-Null
Write-Host "Lambda code updated" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "UPDATE COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nTest by purchasing a package as employer" -ForegroundColor Yellow
Write-Host "Check browser console for logs" -ForegroundColor Yellow
