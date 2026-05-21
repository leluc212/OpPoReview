# Test Notification API and DynamoDB
$ErrorActionPreference = "Continue"

Write-Host "`n========================================"  -ForegroundColor Cyan
Write-Host "TEST NOTIFICATION SYSTEM" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$API = "https://iuo7ofruu6.execute-api.ap-southeast-1.amazonaws.com"

# Test 1: Create notification
Write-Host "[1/3] Creating test notification..." -ForegroundColor Yellow

$body = @{
    type = "package_purchase_request"
    title = "Test notification"
    titleEn = "Test notification"
    message = "Test message from PowerShell"
    messageEn = "Test message from PowerShell"
    recipientId = "admin"
    recipientRole = "admin"
    senderId = "test-ps"
    senderName = "Test PS"
    data = @{ test = "data" }
    icon = "package"
    color = "#3b82f6"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API/notifications" -Method POST -Body $body -ContentType "application/json; charset=utf-8"
    
    if ($response.success) {
        Write-Host "SUCCESS: Notification created" -ForegroundColor Green
        Write-Host "ID: $($response.data.notificationId)" -ForegroundColor White
    } else {
        Write-Host "FAILED: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Test 2: Get notifications
Write-Host "`n[2/3] Getting admin notifications..." -ForegroundColor Yellow

try {
    $notifications = Invoke-RestMethod -Uri "$API/notifications?recipientId=admin&recipientRole=admin" -Method GET
    Write-Host "Found $($notifications.Count) notifications" -ForegroundColor Green
    
    if ($notifications.Count -gt 0) {
        $notifications | Select-Object -First 3 | ForEach-Object {
            Write-Host "  - $($_.title)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Test 3: Check DynamoDB
Write-Host "`n[3/3] Checking DynamoDB..." -ForegroundColor Yellow

try {
    $result = aws dynamodb scan --table-name Notifications --region ap-southeast-1 --max-items 3 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $items = ($result | ConvertFrom-Json).Items
        Write-Host "Found $($items.Count) items in DynamoDB" -ForegroundColor Green
        
        if ($items.Count -eq 0) {
            Write-Host "WARNING: No items in DynamoDB!" -ForegroundColor Yellow
            Write-Host "Notifications are NOT being saved to database" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Could not access DynamoDB" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST COMPLETE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
