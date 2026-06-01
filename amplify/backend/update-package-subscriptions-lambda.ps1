# PowerShell script to update Package Subscriptions Lambda function
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Updating Package Subscriptions Lambda Function" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$REGION = "ap-southeast-1"
$LAMBDA_NAME = "package-subscriptions-handler"

Write-Host "`n[1/2] Creating Lambda package..." -ForegroundColor Yellow
if (Test-Path "package-subscriptions-lambda.zip") { 
    Remove-Item "package-subscriptions-lambda.zip" -Force
}
Compress-Archive -Path "package-subscriptions-lambda.py" -DestinationPath "package-subscriptions-lambda.zip" -Force
Write-Host "Package created" -ForegroundColor Green

Write-Host "`n[2/2] Updating Lambda function code..." -ForegroundColor Yellow
aws lambda update-function-code --function-name $LAMBDA_NAME --zip-file fileb://package-subscriptions-lambda.zip --region $REGION 2>&1 | Out-Null
Write-Host "Lambda code updated" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "UPDATE COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
