# Delete notifications with wrong recipientId

$API_ENDPOINT = "https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com"

# IDs of notifications with wrong recipientId (employer ID instead of 'admin')
$wrongNotificationIds = @(
    "NOTIF-20260521-4d64b439",
    "NOTIF-20260521-e7f7f7bf"
)

Write-Host "Deleting wrong notifications..." -ForegroundColor Yellow

foreach ($notifId in $wrongNotificationIds) {
    Write-Host "`nDeleting: $notifId" -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "$API_ENDPOINT/notifications/$notifId" `
            -Method Delete `
            -ContentType "application/json"
        
        Write-Host "✅ Deleted successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n✅ Done! Now test by purchasing a package from Employer account." -ForegroundColor Green
