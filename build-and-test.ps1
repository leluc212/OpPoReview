# Build and prepare for testing
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "BUILD AND TEST PREPARATION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Check environment variables
Write-Host "[1/3] Checking environment variables..." -ForegroundColor Yellow

$envContent = Get-Content .env -Raw
if ($envContent -match 'VITE_NOTIFICATIONS_API=(.+)') {
    $notifApi = $matches[1].Trim()
    Write-Host "✅ VITE_NOTIFICATIONS_API: $notifApi" -ForegroundColor Green
} else {
    Write-Host "❌ VITE_NOTIFICATIONS_API not found in .env!" -ForegroundColor Red
    exit 1
}

if ($envContent -match 'VITE_PACKAGE_SUBSCRIPTIONS_API=(.+)') {
    $subApi = $matches[1].Trim()
    Write-Host "✅ VITE_PACKAGE_SUBSCRIPTIONS_API: $subApi" -ForegroundColor Green
} else {
    Write-Host "⚠️  VITE_PACKAGE_SUBSCRIPTIONS_API not found" -ForegroundColor Yellow
}

# Step 2: Build the app
Write-Host "`n[2/3] Building the app..." -ForegroundColor Yellow
Write-Host "This may take a minute..." -ForegroundColor Gray

npm run build 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host "Run 'npm run build' manually to see errors" -ForegroundColor Yellow
    exit 1
}

# Step 3: Instructions
Write-Host "`n[3/3] Next steps..." -ForegroundColor Yellow

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ READY TO TEST!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "To test the notification system:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start dev server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Open browser:" -ForegroundColor White
Write-Host "   http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Open DevTools (F12) and go to Console tab" -ForegroundColor White
Write-Host ""
Write-Host "4. Login as Employer and go to:" -ForegroundColor White
Write-Host "   /employer/subscription" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Select a package and click purchase" -ForegroundColor White
Write-Host ""
Write-Host "6. Watch console logs for:" -ForegroundColor White
Write-Host "   🚀 Starting purchase process..." -ForegroundColor Gray
Write-Host "   📤 Creating notification for admin..." -ForegroundColor Gray
Write-Host "   ✅ Notification sent to admin successfully!" -ForegroundColor Green
Write-Host "   ✅ Notification saved to DynamoDB!" -ForegroundColor Green
Write-Host ""
Write-Host "7. Verify notification in DynamoDB:" -ForegroundColor White
Write-Host "   .\check-notifications.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "8. Login as Admin and check:" -ForegroundColor White
Write-Host "   /admin/notifications" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================`n" -ForegroundColor Cyan
