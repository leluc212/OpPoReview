# Test Lambda function directly
Write-Host "Testing CandidateProfileAPI Lambda function..." -ForegroundColor Cyan

# Test GET profile
$testEvent = @{
    httpMethod = "GET"
    path = "/profile/296aa58c-30a1-70cc-44ed-b829e33a8245"
    pathParameters = @{
        userId = "296aa58c-30a1-70cc-44ed-b829e33a8245"
    }
    headers = @{}
} | ConvertTo-Json -Compress

Write-Host "`nTest Event:" -ForegroundColor Yellow
Write-Host $testEvent

Write-Host "`nInvoking Lambda..." -ForegroundColor Yellow
aws lambda invoke `
    --function-name CandidateProfileAPI `
    --region ap-southeast-1 `
    --payload $testEvent `
    --cli-binary-format raw-in-base64-out `
    response.json

Write-Host "`nResponse:" -ForegroundColor Green
Get-Content response.json | ConvertFrom-Json | ConvertTo-Json -Depth 10

Write-Host "`nDone!" -ForegroundColor Green
