# Delete all applications for testing
# WARNING: This will delete ALL your applications!

Write-Host "🗑️  Deleting all applications for testing..." -ForegroundColor Yellow

# Get your user ID (replace with your actual Cognito user ID)
$userId = Read-Host "Enter your Cognito User ID (sub)"

if ([string]::IsNullOrWhiteSpace($userId)) {
    Write-Host "❌ User ID is required!" -ForegroundColor Red
    exit 1
}

Write-Host "📥 Fetching applications for user: $userId" -ForegroundColor Cyan

# Query applications by candidateId using CandidateIndex
$applications = aws dynamodb query `
    --table-name StandardApplications `
    --index-name CandidateIndex `
    --key-condition-expression "candidateId = :uid" `
    --expression-attribute-values "{`":uid`":{`"S`":`"$userId`"}}" `
    --region ap-southeast-1 `
    --output json | ConvertFrom-Json

if ($applications.Items.Count -eq 0) {
    Write-Host "✅ No applications found for this user" -ForegroundColor Green
    exit 0
}

Write-Host "Found $($applications.Items.Count) applications:" -ForegroundColor Yellow

foreach ($item in $applications.Items) {
    $appId = $item.applicationId.S
    $jobId = $item.jobId.S
    $jobTitle = $item.jobTitle.S
    $status = $item.status.S
    
    Write-Host "  - $appId | Job: $jobTitle ($jobId) | Status: $status" -ForegroundColor Gray
}

$confirm = Read-Host "`nAre you sure you want to delete ALL these applications? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "❌ Cancelled" -ForegroundColor Red
    exit 0
}

Write-Host "`n🗑️  Deleting applications..." -ForegroundColor Yellow

foreach ($item in $applications.Items) {
    $appId = $item.applicationId.S
    
    Write-Host "  Deleting $appId..." -ForegroundColor Gray
    
    aws dynamodb delete-item `
        --table-name StandardApplications `
        --key "{`"applicationId`":{`"S`":`"$appId`"}}" `
        --region ap-southeast-1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✅ Deleted" -ForegroundColor Green
    } else {
        Write-Host "    ❌ Failed" -ForegroundColor Red
    }
}

Write-Host "`n✅ Done! All applications deleted." -ForegroundColor Green
Write-Host "You can now test applying to jobs again." -ForegroundColor Cyan
