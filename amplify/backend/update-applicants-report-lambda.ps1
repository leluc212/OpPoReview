# PowerShell script to update Applicants Report Lambda function
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Updating Applicants Report Lambda Function" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$REGION = "ap-southeast-1"
$LAMBDA_NAME = "applicants-report-handler"

# Allow overriding function name via command line argument
if ($args[0]) {
    $LAMBDA_NAME = $args[0]
}

Write-Host "Target Function Name: $LAMBDA_NAME" -ForegroundColor Yellow

Write-Host "`n[1/2] Creating Lambda package..." -ForegroundColor Yellow
if (Test-Path "applicants-report-lambda.zip") { 
    Remove-Item "applicants-report-lambda.zip" -Force
}
Compress-Archive -Path "applicants-report-lambda.py" -DestinationPath "applicants-report-lambda.zip" -Force
Write-Host "Package created" -ForegroundColor Green

Write-Host "`n[2/2] Updating Lambda function code..." -ForegroundColor Yellow
aws lambda update-function-code --function-name $LAMBDA_NAME --zip-file fileb://applicants-report-lambda.zip --region $REGION
if ($LASTEXITCODE -eq 0) {
    Write-Host "Lambda code updated successfully" -ForegroundColor Green
} else {
    Write-Host "Failed to update Lambda code. If the function name is different, run: .\update-applicants-report-lambda.ps1 <actual-function-name>" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "UPDATE COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
