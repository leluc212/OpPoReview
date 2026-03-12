# Test Lambda function directly
Write-Host "=== Testing Lambda Function ===" -ForegroundColor Cyan

$payload = @{
    requestContext = @{
        http = @{
            method = "GET"
            path = "/quick-jobs/active"
        }
    }
    rawPath = "/quick-jobs/active"
} | ConvertTo-Json -Depth 10

Write-Host "`nPayload:" -ForegroundColor Yellow
Write-Host $payload

$payload | Out-File -FilePath "test-payload.json" -Encoding utf8

Write-Host "`nInvoking Lambda..." -ForegroundColor Yellow
aws lambda invoke `
    --function-name quick-job-handler `
    --payload file://test-payload.json `
    response.json

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Lambda invoked successfully" -ForegroundColor Green
    Write-Host "`nResponse:" -ForegroundColor Yellow
    Get-Content response.json
} else {
    Write-Host "`n❌ Lambda invocation failed" -ForegroundColor Red
}

Remove-Item -Path "test-payload.json" -ErrorAction SilentlyContinue
Remove-Item -Path "response.json" -ErrorAction SilentlyContinue

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
