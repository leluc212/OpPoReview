# Automatic timestamp debugging script
$ErrorActionPreference = "Continue"

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  AUTO DEBUG: Notification Timestamp Issue" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$API_ENDPOINT = "https://rvvvqxqhq3.execute-api.ap-southeast-1.amazonaws.com/prod"

# Step 1: Get latest notification
Write-Host "📥 Step 1: Fetching latest notification from database..." -ForegroundColor Yellow
$uri = $API_ENDPOINT + "/notifications?recipientId=admin&recipientRole=admin"
$response = Invoke-RestMethod -Uri $uri -Method Get

$notifications = $response | Sort-Object -Property createdAt -Descending
$latest = $notifications[0]

Write-Host "✅ Found latest notification:" -ForegroundColor Green
Write-Host "   ID: $($latest.notificationId)" -ForegroundColor White
Write-Host "   Title: $($latest.title)" -ForegroundColor White
Write-Host "   CreatedAt: $($latest.createdAt)" -ForegroundColor White
Write-Host ""

# Step 2: Calculate age
$createdAt = [DateTime]::Parse($latest.createdAt)
$now = [DateTime]::UtcNow
$ageMinutes = [Math]::Floor(($now - $createdAt).TotalMinutes)
$ageHours = [Math]::Floor($ageMinutes / 60)

Write-Host "⏰ Step 2: Timestamp analysis:" -ForegroundColor Yellow
Write-Host "   Created (UTC): $($createdAt.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor White
Write-Host "   Now (UTC): $($now.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor White
$ageText = "$ageMinutes minutes, $ageHours hours"
Write-Host "   Age: $ageText" -ForegroundColor White
Write-Host ""

# Step 3: Determine what UI should show
if ($ageMinutes -lt 1) {
    $expectedDisplay = "Just now"
} elseif ($ageMinutes -lt 60) {
    $expectedDisplay = "$ageMinutes minutes ago"
} else {
    $expectedDisplay = "$ageHours hours ago"
}

Write-Host "📱 Step 3: Expected UI display:" -ForegroundColor Yellow
Write-Host "   Should show: $expectedDisplay" -ForegroundColor White
Write-Host ""

# Step 4: Diagnosis
Write-Host "🔍 Step 4: Diagnosis:" -ForegroundColor Yellow
if ($ageHours -ge 6) {
    Write-Host "   ❌ PROBLEM FOUND: Notification is $ageHours hours old!" -ForegroundColor Red
    Write-Host "   ❌ This means Lambda is NOT creating new timestamps!" -ForegroundColor Red
    Write-Host ""
    Write-Host "   🔧 SOLUTION: Lambda server clock is wrong OR" -ForegroundColor Yellow
    Write-Host "              Lambda code is not being executed" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Timestamp is correct (less than 6 hours old)" -ForegroundColor Green
    Write-Host "   ✅ UI should show: $expectedDisplay" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  NEXT STEPS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($ageHours -ge 6) {
    Write-Host "1️⃣  Check Lambda CloudWatch logs:" -ForegroundColor Yellow
    Write-Host "   .\view-lambda-logs.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "2️⃣  Look for this in logs:" -ForegroundColor Yellow
    Write-Host "   ⏰ TIMESTAMP DEBUG:" -ForegroundColor White
    Write-Host "   Server time (ISO): ..." -ForegroundColor White
    Write-Host ""
    Write-Host "3️⃣  If timestamp in logs is OLD:" -ForegroundColor Yellow
    Write-Host "   → Lambda server clock is wrong (AWS issue)" -ForegroundColor White
    Write-Host "   → Contact AWS support or recreate Lambda" -ForegroundColor White
    Write-Host ""
    Write-Host "4️⃣  If timestamp in logs is NEW:" -ForegroundColor Yellow
    Write-Host "   → Database is not saving correctly" -ForegroundColor White
    Write-Host "   → Check DynamoDB table" -ForegroundColor White
} else {
    Write-Host "✅ Timestamp is correct!" -ForegroundColor Green
    Write-Host "   If UI still shows '7 giờ trước', you are looking at OLD notification" -ForegroundColor Yellow
    Write-Host "   Find notification with ID: $($latest.notificationId)" -ForegroundColor Yellow
}

Write-Host ""
