# Quick test script for Admin API endpoints
# Run this after deploying the Lambda function

Write-Host "🧪 Testing Admin API Endpoints" -ForegroundColor Cyan
Write-Host ""

$API_URL = "https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod"

Write-Host "⚠️ Note: You need a valid admin token to test these endpoints" -ForegroundColor Yellow
Write-Host ""
Write-Host "To get your token:" -ForegroundColor Cyan
Write-Host "  1. Login to the app as admin" -ForegroundColor White
Write-Host "  2. Open browser DevTools → Console" -ForegroundColor White
Write-Host "  3. Run: localStorage.getItem('CognitoIdentityServiceProvider.xxx.idToken')" -ForegroundColor White
Write-Host ""

$token = Read-Host "Enter your admin token (or press Enter to skip)"

if ($token) {
    Write-Host ""
    Write-Host "Testing GET /admin/employers..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest `
            -Uri "$API_URL/admin/employers" `
            -Method GET `
            -Headers @{
                "Authorization" = "Bearer $token"
                "Content-Type" = "application/json"
            }
        
        Write-Host "✅ Success! Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host ""
        Write-Host "Response:" -ForegroundColor Cyan
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
    }
    catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Skipped - no token provided" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "API Endpoints available:" -ForegroundColor Cyan
Write-Host "  GET  $API_URL/admin/employers" -ForegroundColor White
Write-Host "  POST $API_URL/admin/employers/{userId}/approve" -ForegroundColor White
Write-Host "  POST $API_URL/admin/employers/{userId}/reject" -ForegroundColor White
Write-Host "  POST $API_URL/admin/employers/{userId}/verify" -ForegroundColor White
