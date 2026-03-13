# PowerShell script to add sample data to PostQuickJob table

Write-Host "Adding sample quick job to DynamoDB..." -ForegroundColor Cyan

$sampleJob = @{
    idJob = "QJOB-20260313-SMPL1"
    employerId = "sample-employer-001"
    employerEmail = "employer@example.com"
    companyId = "sample-employer-001"
    companyName = "Nha hang Pho Co"
    title = "Nhan vien Phuc vu"
    location = "Quan 1, TP.HCM"
    jobType = "part-time"
    hourlyRate = 35000
    startTime = "18:00"
    endTime = "23:00"
    totalHours = 5
    totalSalary = 175000
    description = "Can nhan vien phuc vu ca toi"
    requirements = "Nhiet tinh, nhanh nhen"
    contactPhone = "0901234567"
    status = "active"
    category = "quick-jobs"
    applicants = 0
    views = 0
    fee = 175000
    createdAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    updatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
}

$item = @"
{
    "idJob": {"S": "$($sampleJob.idJob)"},
    "employerId": {"S": "$($sampleJob.employerId)"},
    "employerEmail": {"S": "$($sampleJob.employerEmail)"},
    "companyId": {"S": "$($sampleJob.companyId)"},
    "companyName": {"S": "$($sampleJob.companyName)"},
    "title": {"S": "$($sampleJob.title)"},
    "location": {"S": "$($sampleJob.location)"},
    "jobType": {"S": "$($sampleJob.jobType)"},
    "hourlyRate": {"N": "$($sampleJob.hourlyRate)"},
    "startTime": {"S": "$($sampleJob.startTime)"},
    "endTime": {"S": "$($sampleJob.endTime)"},
    "totalHours": {"N": "$($sampleJob.totalHours)"},
    "totalSalary": {"N": "$($sampleJob.totalSalary)"},
    "description": {"S": "$($sampleJob.description)"},
    "requirements": {"S": "$($sampleJob.requirements)"},
    "contactPhone": {"S": "$($sampleJob.contactPhone)"},
    "status": {"S": "$($sampleJob.status)"},
    "category": {"S": "$($sampleJob.category)"},
    "applicants": {"N": "$($sampleJob.applicants)"},
    "views": {"N": "$($sampleJob.views)"},
    "fee": {"N": "$($sampleJob.fee)"},
    "createdAt": {"S": "$($sampleJob.createdAt)"},
    "updatedAt": {"S": "$($sampleJob.updatedAt)"}
}
"@

$tempFile = "temp-quick-job-item.json"
$item | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "Sample job: $($sampleJob.title)" -ForegroundColor Yellow
Write-Host "Inserting into DynamoDB..." -ForegroundColor Cyan

aws dynamodb put-item --table-name PostQuickJob --item file://$tempFile --region ap-southeast-1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Success!" -ForegroundColor Green
} else {
    Write-Host "Failed" -ForegroundColor Red
}

Remove-Item $tempFile -ErrorAction SilentlyContinue
