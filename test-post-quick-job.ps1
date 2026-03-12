# Test POST /quick-jobs

$API_ENDPOINT = "https://6zw89pkuxb.execute-api.ap-southeast-1.amazonaws.com"

# Generate job ID
$date = Get-Date -Format "yyyyMMdd"
$random = -join ((65..90) + (48..57) | Get-Random -Count 5 | ForEach-Object {[char]$_})
$jobId = "QJOB-$date-$random"

# Calculate hours and salary
$startTime = "18:00"
$endTime = "23:00"
$hourlyRate = 35000

$startHour = [int]$startTime.Split(':')[0]
$endHour = [int]$endTime.Split(':')[0]
$hours = $endHour - $startHour
$totalSalary = $hourlyRate * $hours

Write-Host "Creating quick job..." -ForegroundColor Cyan
Write-Host "Job ID: $jobId" -ForegroundColor Yellow
Write-Host "Hours: $hours" -ForegroundColor Yellow
Write-Host "Total Salary: $totalSalary VND" -ForegroundColor Yellow
Write-Host ""

$body = @{
    idJob = $jobId
    employerId = "test-employer-$(Get-Date -Format 'yyyyMMddHHmmss')"
    employerEmail = "test@example.com"
    companyName = "Test Company"
    title = "Ca Tối - Nhân viên Phục vụ"
    location = "Quận 1, TP.HCM"
    jobType = "part-time"
    hourlyRate = $hourlyRate
    startTime = $startTime
    endTime = $endTime
    totalHours = $hours
    totalSalary = $totalSalary
    description = "Cần nhân viên phục vụ ca tối, làm việc tại quán ăn khu vực trung tâm"
    requirements = "Nhiệt tình, nhanh nhẹn, có kinh nghiệm ưu tiên"
    status = "active"
    category = "quick-jobs"
    applicants = 0
    views = 0
    fee = $totalSalary
    createdAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    updatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
} | ConvertTo-Json

Write-Host "Request body:" -ForegroundColor Cyan
Write-Host $body -ForegroundColor White
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "$API_ENDPOINT/quick-jobs" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "Success!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host $response.Content -ForegroundColor White
} catch {
    Write-Host "Error!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor White
    }
}
