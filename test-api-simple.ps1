$API_URL = "https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod"

Write-Host "Testing Employer Profile API" -ForegroundColor Cyan
Write-Host ""

# Test 1: CORS Preflight
Write-Host "Test 1: CORS Preflight (OPTIONS /profile)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/profile" -Method OPTIONS -Headers @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type,Authorization"
    } -UseBas