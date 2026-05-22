# View Lambda CloudWatch logs
$REGION = "ap-southeast-1"
$LAMBDA_NAME = "notifications-handler"
$LOG_GROUP = "/aws/lambda/$LAMBDA_NAME"

Write-Host "📋 Fetching latest Lambda logs..." -ForegroundColor Cyan
Write-Host "Log Group: $LOG_GROUP" -ForegroundColor Gray
Write-Host ""

# Get latest log stream
$latestStream = aws logs describe-log-streams `
    --log-group-name $LOG_GROUP `
    --region $REGION `
    --order-by LastEventTime `
    --descending `
    --max-items 1 `
    --query 'logStreams[0].logStreamName' `
    --output text

if ($latestStream) {
    Write-Host "Latest log stream: $latestStream" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 Log entries (last 50):" -ForegroundColor Cyan
    Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray
    
    aws logs get-log-events `
        --log-group-name $LOG_GROUP `
        --log-stream-name $latestStream `
        --region $REGION `
        --limit 50 `
        --query 'events[*].message' `
        --output text
        
    Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray
} else {
    Write-Host "❌ No log streams found" -ForegroundColor Red
}

Write-Host ""
Write-Host "💡 To tail logs in real-time, run:" -ForegroundColor Yellow
Write-Host "   aws logs tail $LOG_GROUP --follow --region $REGION" -ForegroundColor White
