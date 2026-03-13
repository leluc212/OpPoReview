# Test Application API directly
Write-Host "=== Testing Application API ===" -ForegroundColor Cyan

$apiEndpoint = "https://zbkgla009i.execute-api.us-east-1.amazonaws.com"

Write-Host "`n1. Testing OPTIONS (CORS preflight)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$apiEndpoint/applications" -Method OPTIONS -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Headers:" -ForegroundColor Green
    $response.Headers | Format-Table
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "`n2. Testing POST without auth (should fail)..." -ForegroundColor Yellow
try {
    $body = @{
        jobId = "TEST-JOB-123"
        cvUrl = "https://test.s3.amazonaws.com/cv.pdf"
        cvFilename = "test.pdf"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$apiEndpoint/applications" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Status: $statusCode (Expected 401 Unauthorized)" -ForegroundColor Yellow
    if ($statusCode -eq 401) {
        Write-Host "✅ Correct - Auth is required" -ForegroundColor Green
    }
}

Write-Host "`n3. Checking API Gateway configuration..." -ForegroundColor Yellow
$apiId = "zbkgla009i"
aws apigateway get-rest-api --rest-api-id $apiId --region us-east-1 --query '{name:name,id:id,createdDate:createdDate}' --output json

Write-Host "`n4. Checking API Gateway resources..." -ForegroundColor Yellow
aws apigateway get-resources --rest-api-id $apiId --region us-east-1 --query 'items[*].{path:path,methods:resourceMethods}' --output json

Write-Host "`n5. Checking authorizer configuration..." -ForegroundColor Yellow
aws apigateway get-authorizers --rest-api-id $apiId --region us-east-1 --output json

Write-Host "`n=== Done ===" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Open test-application-submit.html in browser" -ForegroundColor White
Write-Host "2. Login to your app and copy JWT token from browser console" -ForegroundColor White
Write-Host "3. Paste token into the test page and submit" -ForegroundColor White
