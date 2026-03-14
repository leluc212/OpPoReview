# Script to update candidate data from DynamoDB
Write-Host "Updating candidate data from DynamoDB..." -ForegroundColor Cyan

# Run the Node.js script to fetch data
Write-Host "`nFetching data from DynamoDB..." -ForegroundColor Yellow
node get-candidate-profiles.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nCopying data to src/data folder..." -ForegroundColor Yellow
    
    # Create data folder if it doesn't exist
    if (!(Test-Path "src/data")) {
        New-Item -ItemType Directory -Path "src/data" -Force | Out-Null
    }
    
    Copy-Item candidate-profiles-data.json src/data/candidate-profiles-data.json -Force
    
    if ($?) {
        Write-Host "`n✓ Data updated successfully!" -ForegroundColor Green
        Write-Host "The page will auto-reload with new data." -ForegroundColor Cyan
    } else {
        Write-Host "`n✗ Failed to copy file!" -ForegroundColor Red
    }
} else {
    Write-Host "`n✗ Failed to fetch data from DynamoDB!" -ForegroundColor Red
}
