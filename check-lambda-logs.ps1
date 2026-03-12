# Check Lambda logs for CORS issues
Write-Host "=== Checking Lambda Logs ===" -ForegroundColor Cyan

$functionName = "quick-job-handler"

Write-Host "`nFetching recent logs..." -ForegroundColor Yellow
Write-Host "(This will show the last 50 log events)" -ForegroundColor Gray

aws logs tail "/aws/lambda/$functionName" --since 5m --format short

Write-Host "`n=== Log Check Complete ===" -ForegroundColor Cyan
