# Delete old quick jobs with fee attribute
Write-Host "=== Deleting Old Quick Jobs ===" -ForegroundColor Cyan

$jobIds = @("QJOB-20260313-KOTSI", "QJOB-20260313-LPJT5")

foreach ($jobId in $jobIds) {
    Write-Host "`nDeleting job: $jobId" -ForegroundColor Yellow
    
    # Create JSON file for key
    $keyJson = "{`"jobID`": {`"S`": `"$jobId`"}}"
    $keyJson | Out-File -FilePath "temp-key.json" -Encoding utf8 -NoNewline
    
    aws dynamodb delete-item `
        --table-name PostQuickJob `
        --key file://temp-key.json
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deleted: $jobId" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to delete: $jobId" -ForegroundColor Red
    }
    
    Remove-Item -Path "temp-key.json" -ErrorAction SilentlyContinue
}

Write-Host "`n=== Deletion Complete ===" -ForegroundColor Cyan
Write-Host "Now you can create new jobs with workDate attribute" -ForegroundColor Green
