# Check all notifications in DynamoDB
Write-Host "`nChecking Notifications in DynamoDB..." -ForegroundColor Cyan

$result = aws dynamodb scan --table-name Notifications --region ap-southeast-1 2>&1 | ConvertFrom-Json

if ($result.Items) {
    Write-Host "`nTotal: $($result.Count) notifications" -ForegroundColor Green
    
    Write-Host "`nAll notifications:" -ForegroundColor Yellow
    $result.Items | ForEach-Object {
        $id = $_.notificationId.S
        $title = $_.title.S
        $recipient = $_.recipientId.S
        $role = $_.recipientRole.S
        $created = $_.createdAt.S
        $type = $_.type.S
        
        Write-Host "`n  ID: $id" -ForegroundColor White
        Write-Host "  Type: $type" -ForegroundColor Cyan
        Write-Host "  Title: $title" -ForegroundColor Cyan
        Write-Host "  Recipient: $recipient ($role)" -ForegroundColor Gray
        Write-Host "  Created: $created" -ForegroundColor Gray
    }
} else {
    Write-Host "No notifications found" -ForegroundColor Yellow
}

Write-Host ""
