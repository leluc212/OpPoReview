# Update Employer Profiles Data
# This script fetches latest data from DynamoDB and updates the public folder

Write-Host "Updating Employer Profiles Data..." -ForegroundColor Cyan
Write-Host ""

# Run the Node.js script to fetch data
Write-Host "Fetching data from DynamoDB..." -ForegroundColor Yellow
node get-employer-profiles.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Copying data to public folder..." -ForegroundColor Yellow
    Copy-Item employer-profiles-data.json public/ -Force
    
    Write-Host ""
    Write-Host "Data updated successfully!" -ForegroundColor Green
    Write-Host "File location: public/employer-profiles-data.json" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Failed to fetch data from DynamoDB" -ForegroundColor Red
    exit 1
}
