# Update job status from 'pending' to 'active' in PostQuickJob table

Write-Host "Scanning PostQuickJob table for pending jobs..." -ForegroundColor Cyan

# Scan table for pending jobs
$scanResult = aws dynamodb scan --table-name PostQuickJob --filter-expression "#status = :pending" --expression-attribute-names "{\`"#status\`":\`"status\`"}" --expression-attribute-values "{\`":pending\`":{\`"S\`":\`"pending\`"}}" --region ap-southeast-1

$scanData = $scanResult | ConvertFrom-Json

if ($scanData.Items.Count -eq 0) {
    Write-Host "No pending jobs found." -ForegroundColor Green
    exit 0
}

Write-Host "Found $($scanData.Items.Count) pending job(s):" -ForegroundColor Yellow

foreach ($item in $scanData.Items) {
    $jobID = $item.jobID.S
    $title = $item.title.S
    
    Write-Host "  - Job ID: $jobID" -ForegroundColor White
    Write-Host "    Title: $title" -ForegroundColor Gray
}

Write-Host ""
$confirm = Read-Host "Update these jobs to 'active' status? (y/n)"

if ($confirm -ne 'y') {
    Write-Host "Operation cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "Updating jobs to 'active' status..." -ForegroundColor Cyan

$successCount = 0
$errorCount = 0

foreach ($item in $scanData.Items) {
    $jobID = $item.jobID.S
    $title = $item.title.S
    
    try {
        $timestamp = Get-Date -Format 'o'
        
        # Build the command as a string
        $key = "{\`"jobID\`":{\`"S\`":\`"$jobID\`"}}"
        $updateExpr = "SET #status = :active, updatedAt = :updatedAt"
        $attrNames = "{\`"#status\`":\`"status\`"}"
        $attrValues = "{\`":active\`":{\`"S\`":\`"active\`"},\`":updatedAt\`":{\`"S\`":\`"$timestamp\`"}}"
        
        aws dynamodb update-item --table-name PostQuickJob --key $key --update-expression $updateExpr --expression-attribute-names $attrNames --expression-attribute-values $attrValues --region ap-southeast-1 | Out-Null
        
        Write-Host "  Updated: $jobID - $title" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "  Failed to update: $jobID - $title" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "Update Summary:" -ForegroundColor Cyan
Write-Host "  Successfully updated: $successCount job(s)" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "  Failed: $errorCount job(s)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Done! Jobs should now appear in candidate job listings." -ForegroundColor Green
