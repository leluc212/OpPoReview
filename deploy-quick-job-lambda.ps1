# Deploy updated Quick Job Lambda with CORS fix
Write-Host "=== Deploying Quick Job Lambda ===" -ForegroundColor Cyan

$lambdaName = "quick-job-handler"
$zipFile = "quick-job-lambda.zip"

Write-Host "`n1. Creating deployment package..." -ForegroundColor Yellow
Set-Location "amplify/backend"

# Remove old zip if exists
if (Test-Path $zipFile) {
    Remove-Item $zipFile
}

# Create new zip
Compress-Archive -Path "quick-job-lambda.py" -DestinationPath $zipFile -Force

if (Test-Path $zipFile) {
    Write-Host "✅ Deployment package created: $zipFile" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create deployment package" -ForegroundColor Red
    Set-Location "../.."
    exit 1
}

Write-Host "`n2. Updating Lambda function..." -ForegroundColor Yellow
aws lambda update-function-code `
    --function-name $lambdaName `
    --zip-file "fileb://$zipFile" `
    --output json | ConvertFrom-Json | Select-Object FunctionName, LastModified, CodeSize, State | Format-Table

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Lambda function updated" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to update Lambda function" -ForegroundColor Red
    Set-Location "../.."
    exit 1
}

Write-Host "`n3. Waiting for Lambda to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "`n4. Testing Lambda function..." -ForegroundColor Yellow
$testPayload = @{
    requestContext = @{
        http = @{
            method = "OPTIONS"
            path = "/quick-jobs"
        }
    }
    rawPath = "/quick-jobs"
} | ConvertTo-Json -Depth 10

$testPayload | Out-File -FilePath "test-payload.json" -Encoding utf8

aws lambda invoke `
    --function-name $lambdaName `
    --payload file://test-payload.json `
    --output json `
    response.json

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Lambda invoked successfully" -ForegroundColor Green
    Write-Host "`nResponse:" -ForegroundColor Yellow
    Get-Content response.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
} else {
    Write-Host "❌ Failed to invoke Lambda" -ForegroundColor Red
}

# Cleanup
Remove-Item -Path "test-payload.json" -ErrorAction SilentlyContinue
Remove-Item -Path "response.json" -ErrorAction SilentlyContinue

Set-Location "../.."

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Cyan
Write-Host "Lambda function updated with enhanced CORS headers" -ForegroundColor Green
Write-Host "`nCORS Headers now include:" -ForegroundColor Yellow
Write-Host "  - Access-Control-Allow-Origin: *" -ForegroundColor White
Write-Host "  - Access-Control-Allow-Headers: Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token" -ForegroundColor White
Write-Host "  - Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS" -ForegroundColor White
Write-Host "  - Access-Control-Max-Age: 3600" -ForegroundColor White
