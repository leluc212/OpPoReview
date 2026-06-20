# Backfill candidate notifications from existing applications
$ErrorActionPreference = "Continue"
$REGION = "ap-southeast-1"
$APP_TABLE = "StandardApplications"
$NOTIF_TABLE = "Notifications"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BACKFILL CANDIDATE NOTIFICATIONS" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Scan applications - only get fields we need
Write-Host "`n[1/3] Scanning applications..." -ForegroundColor Yellow

$tempFile = Join-Path $env:TEMP "scan_apps.json"

# Only project the fields we need to avoid huge cvUrl values
aws dynamodb scan `
    --table-name $APP_TABLE `
    --region $REGION `
    --projection-expression "candidateId, #s, jobTitle, employerName, jobId, jobType, createdAt, appliedAt, acceptedAt, rejectedAt, completedAt, updatedAt, employerId" `
    --expression-attribute-names '{\"#s\": \"status\"}' `
    --output json > $tempFile 2>$null

# Read with .NET to handle UTF-8 properly
$bytes = [System.IO.File]::ReadAllBytes($tempFile)
$rawJson = [System.Text.Encoding]::UTF8.GetString($bytes)
Remove-Item $tempFile -Force -ErrorAction SilentlyContinue

# PowerShell 5.1 ConvertFrom-Json has depth limit issues with large JSON
# Parse manually using .NET
Add-Type -AssemblyName System.Web.Extensions -ErrorAction SilentlyContinue
try {
    $serializer = New-Object System.Web.Script.Serialization.JavaScriptSerializer
    $serializer.MaxJsonLength = 100MB
    $parsed = $serializer.DeserializeObject($rawJson)
    $allItems = $parsed["Items"]
} catch {
    # Fallback: try ConvertFrom-Json
    try {
        $data = $rawJson | ConvertFrom-Json
        $allItems = @($data.Items)
    } catch {
        Write-Host "  ERROR: Cannot parse JSON. Trying alternative approach..." -ForegroundColor Red
        # Last resort: paginate with smaller page size
        $allItems = @()
        $pageToken = $null
        
        for ($page = 0; $page -lt 100; $page++) {
            $scanCmd = "aws dynamodb scan --table-name $APP_TABLE --region $REGION --max-items 10 --projection-expression `"candidateId, #s, jobTitle, employerName, jobId, jobType, createdAt, appliedAt, acceptedAt, rejectedAt, completedAt, updatedAt, employerId`" --expression-attribute-names '{`\`"#s`\`": `\`"status`\`"}' --output json"
            if ($pageToken) {
                $scanCmd += " --starting-token $pageToken"
            }
            
            $pageResult = Invoke-Expression $scanCmd 2>$null
            $pageData = $pageResult | ConvertFrom-Json
            
            if ($pageData.Items) {
                $allItems += $pageData.Items
            }
            
            $pageToken = $pageData.NextToken
            if (-not $pageToken) { break }
        }
    }
}

$itemCount = if ($allItems) { $allItems.Count } else { 0 }
Write-Host "  Found $itemCount applications" -ForegroundColor Green

if ($itemCount -eq 0) {
    Write-Host "  No applications found. Exiting." -ForegroundColor Yellow
    exit 0
}

# Step 2: Create notifications
Write-Host "`n[2/3] Creating notifications..." -ForegroundColor Yellow

$created = 0
$skipped = 0
$putFile = Join-Path $env:TEMP "notif_put.json"

foreach ($app in $allItems) {
    # Handle both hashtable (JavaScriptSerializer) and PSObject (ConvertFrom-Json) formats
    if ($app -is [System.Collections.IDictionary]) {
        $candidateId = $app["candidateId"]["S"]
        $status = if ($app["status"]) { $app["status"]["S"] } else { "pending" }
        $jobTitle = if ($app["jobTitle"]) { $app["jobTitle"]["S"] } else { "Job" }
        $companyName = if ($app["employerName"]) { $app["employerName"]["S"] } else { "Employer" }
        $jobId = if ($app["jobId"]) { $app["jobId"]["S"] } else { "" }
        $jobType = if ($app["jobType"]) { $app["jobType"]["S"] } else { "standard" }
        $createdAt = if ($app["createdAt"]) { $app["createdAt"]["S"] } elseif ($app["appliedAt"]) { $app["appliedAt"]["S"] } else { "2026-01-01T00:00:00Z" }
        $employerId = if ($app["employerId"]) { $app["employerId"]["S"] } else { "employer" }
        $acceptedAt = if ($app["acceptedAt"]) { $app["acceptedAt"]["S"] } elseif ($app["updatedAt"]) { $app["updatedAt"]["S"] } else { $createdAt }
        $rejectedAt = if ($app["rejectedAt"]) { $app["rejectedAt"]["S"] } elseif ($app["updatedAt"]) { $app["updatedAt"]["S"] } else { $createdAt }
        $completedAt = if ($app["completedAt"]) { $app["completedAt"]["S"] } elseif ($app["updatedAt"]) { $app["updatedAt"]["S"] } else { $createdAt }
    } else {
        $candidateId = $app.candidateId.S
        $status = if ($app.status.S) { $app.status.S } else { "pending" }
        $jobTitle = if ($app.jobTitle.S) { $app.jobTitle.S } else { "Job" }
        $companyName = if ($app.employerName.S) { $app.employerName.S } else { "Employer" }
        $jobId = if ($app.jobId.S) { $app.jobId.S } else { "" }
        $jobType = if ($app.jobType.S) { $app.jobType.S } else { "standard" }
        $createdAt = if ($app.createdAt.S) { $app.createdAt.S } elseif ($app.appliedAt.S) { $app.appliedAt.S } else { "2026-01-01T00:00:00Z" }
        $employerId = if ($app.employerId.S) { $app.employerId.S } else { "employer" }
        $acceptedAt = if ($app.acceptedAt.S) { $app.acceptedAt.S } elseif ($app.updatedAt.S) { $app.updatedAt.S } else { $createdAt }
        $rejectedAt = if ($app.rejectedAt.S) { $app.rejectedAt.S } elseif ($app.updatedAt.S) { $app.updatedAt.S } else { $createdAt }
        $completedAt = if ($app.completedAt.S) { $app.completedAt.S } elseif ($app.updatedAt.S) { $app.updatedAt.S } else { $createdAt }
    }
    
    if (-not $candidateId -or $candidateId -eq "anonymous") {
        $skipped++
        continue
    }

    $isQuickJob = ($jobType -eq "quick")
    $isQuickJobStr = if ($isQuickJob) { "true" } else { "false" }
    $actionUrl = if ($isQuickJob) { "/candidate/jobs?tab=shift" } else { "/candidate/jobs?tab=standard" }
    
    # Sanitize strings for JSON (escape quotes and backslashes)
    $safeJobTitle = ($jobTitle -replace '\\', '\\\\' -replace '"', '\"' -replace "`r", '' -replace "`n", ' ').Trim()
    $safeCompanyName = ($companyName -replace '\\', '\\\\' -replace '"', '\"' -replace "`r", '' -replace "`n", ' ').Trim()
    
    # 1. Application Submitted notification
    $notifId = "NOTIF-$(Get-Date -Format 'yyyyMMdd')-$((New-Guid).ToString().Substring(0,8))"
    
    $jsonContent = "{`"notificationId`":{`"S`":`"$notifId`"},`"type`":{`"S`":`"system`"},`"title`":{`"S`":`"Ung tuyen thanh cong`"},`"titleEn`":{`"S`":`"Application submitted`"},`"message`":{`"S`":`"Ban da ung tuyen vao vi tri $safeJobTitle tai $safeCompanyName.`"},`"messageEn`":{`"S`":`"You applied for $safeJobTitle at $safeCompanyName.`"},`"recipientId`":{`"S`":`"$candidateId`"},`"recipientRole`":{`"S`":`"candidate`"},`"senderId`":{`"S`":`"system`"},`"senderName`":{`"S`":`"Op Po`"},`"data`":{`"M`":{`"jobId`":{`"S`":`"$jobId`"},`"jobTitle`":{`"S`":`"$safeJobTitle`"},`"companyName`":{`"S`":`"$safeCompanyName`"},`"isQuickJob`":{`"BOOL`":$isQuickJobStr}}},`"icon`":{`"S`":`"briefcase`"},`"color`":{`"S`":`"#3b82f6`"},`"actionUrl`":{`"S`":`"$actionUrl`"},`"actionText`":{`"S`":`"Xem viec`"},`"actionTextEn`":{`"S`":`"View jobs`"},`"read`":{`"BOOL`":true},`"deleted`":{`"BOOL`":false},`"createdAt`":{`"S`":`"$createdAt`"}}"
    
    [System.IO.File]::WriteAllText($putFile, $jsonContent, [System.Text.Encoding]::UTF8)
    aws dynamodb put-item --table-name $NOTIF_TABLE --item "file://$putFile" --region $REGION 2>$null
    $created++

    # 2. Status notification
    $notifId2 = "NOTIF-$(Get-Date -Format 'yyyyMMdd')-$((New-Guid).ToString().Substring(0,8))"
    
    if ($status -eq "accepted") {
        $jsonContent2 = "{`"notificationId`":{`"S`":`"$notifId2`"},`"type`":{`"S`":`"success`"},`"title`":{`"S`":`"CV da duoc chap nhan`"},`"titleEn`":{`"S`":`"CV accepted`"},`"message`":{`"S`":`"CV cua ban da duoc $safeCompanyName chap nhan cho vi tri $safeJobTitle.`"},`"messageEn`":{`"S`":`"Your CV was accepted by $safeCompanyName for $safeJobTitle.`"},`"recipientId`":{`"S`":`"$candidateId`"},`"recipientRole`":{`"S`":`"candidate`"},`"senderId`":{`"S`":`"$employerId`"},`"senderName`":{`"S`":`"$safeCompanyName`"},`"data`":{`"M`":{`"jobId`":{`"S`":`"$jobId`"},`"jobTitle`":{`"S`":`"$safeJobTitle`"},`"companyName`":{`"S`":`"$safeCompanyName`"},`"isQuickJob`":{`"BOOL`":$isQuickJobStr}}},`"icon`":{`"S`":`"check-circle`"},`"color`":{`"S`":`"#10b981`"},`"actionUrl`":{`"S`":`"$actionUrl`"},`"actionText`":{`"S`":`"Xem viec`"},`"actionTextEn`":{`"S`":`"View jobs`"},`"read`":{`"BOOL`":true},`"deleted`":{`"BOOL`":false},`"createdAt`":{`"S`":`"$acceptedAt`"}}"
        
        [System.IO.File]::WriteAllText($putFile, $jsonContent2, [System.Text.Encoding]::UTF8)
        aws dynamodb put-item --table-name $NOTIF_TABLE --item "file://$putFile" --region $REGION 2>$null
        $created++
    }
    elseif ($status -eq "rejected") {
        $jsonContent2 = "{`"notificationId`":{`"S`":`"$notifId2`"},`"type`":{`"S`":`"system`"},`"title`":{`"S`":`"CV chua duoc chap nhan`"},`"titleEn`":{`"S`":`"CV not accepted`"},`"message`":{`"S`":`"CV cua ban cho vi tri $safeJobTitle tai $safeCompanyName chua duoc chap nhan.`"},`"messageEn`":{`"S`":`"Your CV for $safeJobTitle at $safeCompanyName was not accepted.`"},`"recipientId`":{`"S`":`"$candidateId`"},`"recipientRole`":{`"S`":`"candidate`"},`"senderId`":{`"S`":`"$employerId`"},`"senderName`":{`"S`":`"$safeCompanyName`"},`"data`":{`"M`":{`"jobId`":{`"S`":`"$jobId`"},`"jobTitle`":{`"S`":`"$safeJobTitle`"},`"companyName`":{`"S`":`"$safeCompanyName`"},`"isQuickJob`":{`"BOOL`":$isQuickJobStr}}},`"icon`":{`"S`":`"alert-circle`"},`"color`":{`"S`":`"#ef4444`"},`"actionUrl`":{`"S`":`"$actionUrl`"},`"actionText`":{`"S`":`"Xem viec khac`"},`"actionTextEn`":{`"S`":`"Browse jobs`"},`"read`":{`"BOOL`":true},`"deleted`":{`"BOOL`":false},`"createdAt`":{`"S`":`"$rejectedAt`"}}"
        
        [System.IO.File]::WriteAllText($putFile, $jsonContent2, [System.Text.Encoding]::UTF8)
        aws dynamodb put-item --table-name $NOTIF_TABLE --item "file://$putFile" --region $REGION 2>$null
        $created++
    }
    elseif ($status -eq "completed") {
        $jsonContent2 = "{`"notificationId`":{`"S`":`"$notifId2`"},`"type`":{`"S`":`"success`"},`"title`":{`"S`":`"Cong viec hoan thanh`"},`"titleEn`":{`"S`":`"Job completed`"},`"message`":{`"S`":`"Ban da hoan thanh $safeJobTitle tai $safeCompanyName.`"},`"messageEn`":{`"S`":`"You completed $safeJobTitle at $safeCompanyName.`"},`"recipientId`":{`"S`":`"$candidateId`"},`"recipientRole`":{`"S`":`"candidate`"},`"senderId`":{`"S`":`"$employerId`"},`"senderName`":{`"S`":`"$safeCompanyName`"},`"data`":{`"M`":{`"jobId`":{`"S`":`"$jobId`"},`"jobTitle`":{`"S`":`"$safeJobTitle`"},`"companyName`":{`"S`":`"$safeCompanyName`"},`"isQuickJob`":{`"BOOL`":$isQuickJobStr}}},`"icon`":{`"S`":`"check-circle`"},`"color`":{`"S`":`"#10b981`"},`"actionUrl`":{`"S`":`"$actionUrl`"},`"actionText`":{`"S`":`"Xem lich su`"},`"actionTextEn`":{`"S`":`"History`"},`"read`":{`"BOOL`":true},`"deleted`":{`"BOOL`":false},`"createdAt`":{`"S`":`"$completedAt`"}}"
        
        [System.IO.File]::WriteAllText($putFile, $jsonContent2, [System.Text.Encoding]::UTF8)
        aws dynamodb put-item --table-name $NOTIF_TABLE --item "file://$putFile" --region $REGION 2>$null
        $created++
    }
    
    if ($created % 10 -eq 0 -and $created -gt 0) {
        Write-Host "  ... $created created" -ForegroundColor Gray
    }
}

Remove-Item $putFile -Force -ErrorAction SilentlyContinue

Write-Host "`n[3/3] Summary:" -ForegroundColor Yellow
Write-Host "  Created: $created notifications" -ForegroundColor Green
Write-Host "  Skipped: $skipped (no candidateId)" -ForegroundColor Gray
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "BACKFILL COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
