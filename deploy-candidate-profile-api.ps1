# Deploy Candidate Profile API
Write-Host "Deploying Candidate Profile API..." -ForegroundColor Cyan

# Deploy to prod stage
Write-Host "`nDeploying to prod stage..." -ForegroundColor Yellow
aws apigateway create-deployment `
    --rest-api-id xyp4wkszi7 `
    --stage-name prod `
    --region ap-southeast-1

Write-Host "`nAPI deployed successfully!" -ForegroundColor Green
Write-Host "API URL: https://xyp4wkszi7.execute-api.ap-southeast-1.amazonaws.com/prod" -ForegroundColor Cyan

Write-Host "`nTesting GET /profile/{userId}..." -ForegroundColor Yellow
$testUrl = "https://xyp4wkszi7.execute-api.ap-southeast-1.amazonaws.com/prod/profile/296aa58c-30a1-70cc-44ed-b829e33a8245"
Write-Host "Test URL: $testUrl" -ForegroundColor White

Write-Host "`nDone!" -ForegroundColor Green
