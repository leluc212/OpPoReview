# Create sample standard jobs in DynamoDB

Write-Host "Creating sample standard jobs..." -ForegroundColor Cyan

$REGION = "ap-southeast-1"
$TABLE_NAME = "PostStandardJob"

# Get current user as employer
$session = aws sts get-caller-identity | ConvertFrom-Json
$employerId = "DEMO-EMPLOYER-001"
$employerEmail = "employer@demo.com"

$jobs = @(
    @{
        title = "Nhân viên Phục Vụ Quán Cafe"
        company = "Highlands Coffee"
        location = "Quận 1, TP.HCM"
        salary = "28.000 VNĐ/giờ"
        type = "Part-time"
        description = "Tìm kiếm nhân viên phục vụ nhiệt tình cho quán cafe"
    },
    @{
        title = "Nhân viên Pha Chế"
        company = "The Coffee House"
        location = "Quận 7, TP.HCM"
        salary = "25.000 VNĐ/giờ"
        type = "Part-time"
        description = "Cần barista có kinh nghiệm pha chế cà phê"
    },
    @{
        title = "Nhân viên Thu Ngân"
        company = "Katinat"
        location = "Quận 3, TP.HCM"
        salary = "24.000 VNĐ/giờ"
        type = "Part-time"
        description = "Tuyển thu ngân làm việc ca chiều"
    }
)

foreach ($job in $jobs) {
    $jobId = "JOB-$(Get-Date -Format 'yyyyMMdd')-$((New-Guid).ToString().Substring(0,8).ToUpper())"
    $now = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    
    Write-Host "`nCreating job: $($job.title)" -ForegroundColor Yellow
    
    $item = @{
        idJob = @{ S = $jobId }
        title = @{ S = $job.title }
        company = @{ S = $job.company }
        location = @{ S = $job.location }
        salary = @{ S = $job.salary }
        type = @{ S = $job.type }
        description = @{ S = $job.description }
        employerId = @{ S = $employerId }
        employerEmail = @{ S = $employerEmail }
        status = @{ S = "active" }
        applicants = @{ N = "0" }
        views = @{ N = "0" }
        createdAt = @{ S = $now }
        updatedAt = @{ S = $now }
    } | ConvertTo-Json -Depth 10 -Compress
    
    aws dynamodb put-item --table-name $TABLE_NAME --item $item --region $REGION
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Created: $jobId" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed" -ForegroundColor Red
    }
}

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "Sample jobs created successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "`nThese jobs now have real employer info and can receive applications" -ForegroundColor Yellow
