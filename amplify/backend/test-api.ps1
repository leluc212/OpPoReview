# Test API Gateway endpoints
$API_URL = "https://xyp4wkszi7.execute-api.ap-southeast-1.amazonaws.com/prod"

Write-Host "Testing API Gateway..." -ForegroundColor Cyan
Write-Host ""

# Test 1: GET profile (should return 404 for non-existent user)
Write-Host "Test 1: GET /profile/test-user-123" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/profile/test-user-123" -Method GET -ContentType "application/json" -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response: $responseBody" -ForegroundColor White
}

Write-Host ""
Write-Host "Test 2: OPTIONS /profile (CORS preflight)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/profile" -Method OPTIONS -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "CORS Headers:" -ForegroundColor White
    $response.Headers.GetEnumerator() | Where-Object { $_.Key -like "*Access-Control*" } | ForEach-Object {
        Write-Host "  $($_.Key): $($_.Value)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
