# Check CandidateProfiles table data
Write-Host "Checking CandidateProfiles table..." -ForegroundColor Cyan

# Scan table to see all items
Write-Host "`nScanning all items in CandidateProfiles table:" -ForegroundColor Yellow
aws dynamodb scan `
    --table-name CandidateProfiles `
    --region ap-southeast-1 `
    --output json | ConvertFrom-Json | ConvertTo-Json -Depth 10

Write-Host "`nDone!" -ForegroundColor Green
