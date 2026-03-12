# Test Lambda directly (bypass API Gateway)
Write-Host "Testing Lambda function directly..." -ForegroundColor Cyan

$FUNCTION_NAME = "EmployerProfileAPI"
$REGION = "ap-southeast-1"

# Create test event
$testEvent = @{
    httpMethod = "GET"
    path = "/profile/test-user-123"
    pathParameters = @{
        userId = "test-user-123"
    }
    headers = @{
        Authorization = "Bearer eyJraWQiOiJ0ZXN0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.test"
    }
    body = $null
} | ConvertTo-Json -Depth 10

Write-Host "Test event:" -ForegroundColor Yellow
Write-Host $testEvent
Write-Host ""

# Invoke Lambda
Write-Host "Invoking Lambda..." -ForegroundColor Yellow

# Save payload to file first
$testEvent | Out-File -FilePath "test-payload.json" -Encoding utf8

$result = aws lambda invoke `
    --function-name $FUNCTION_NAME `
    --payload file://test-payload.json `
    --region $REGION `
    response.json

Write-Host ""
if (Test-Path response.json) {
    Write-Host "Response:" -ForegroundColor Green
    Get-Content response.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
    Remove-Item response.json -ErrorAction SilentlyContinue
} else {
    Write-Host "No response file created" -ForegroundColor Red
}

# Cleanup
Remove-Item test-payload.json -ErrorAction SilentlyContinue
