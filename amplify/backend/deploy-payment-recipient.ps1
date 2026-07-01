# Deploy ApplicationLambda — thêm paymentRecipientId support
# Thay đổi:
#   1. submit_application: lưu paymentRecipientId = candidateId khi tạo mới
#   2. update_application_status: nhận paymentRecipientId từ body (để employer cập nhật khi confirm worker mới)
#   3. Credit wallet: đọc paymentRecipientId thay vì candidateId — trả tiền đúng người
$ErrorActionPreference = "Continue"

$REGION      = "ap-southeast-1"
$LAMBDA_NAME = "ApplicationLambda"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploy ApplicationLambda (paymentRecipientId)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# ── Bước 1: Tạo ZIP ─────────────────────────────────────────────────────────
Write-Host "`n[1/2] Tao ZIP package..." -ForegroundColor Yellow
if (Test-Path "application-lambda.zip") { Remove-Item "application-lambda.zip" -Force }
Compress-Archive -Path "application-lambda.py", "email_service.py" -DestinationPath "application-lambda.zip" -Force
if ($LASTEXITCODE -ne 0 -or !(Test-Path "application-lambda.zip")) {
    Write-Host "ERROR: Khong tao duoc ZIP" -ForegroundColor Red; exit 1
}
Write-Host "  ZIP da tao: application-lambda.zip ($((Get-Item 'application-lambda.zip').Length / 1KB) KB)" -ForegroundColor Green

# ── Bước 2: Deploy code lên Lambda ──────────────────────────────────────────
Write-Host "`n[2/2] Upload code len Lambda..." -ForegroundColor Yellow
$deployResult = aws lambda update-function-code `
    --function-name $LAMBDA_NAME `
    --zip-file fileb://application-lambda.zip `
    --region $REGION 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Lambda code da duoc cap nhat thanh cong" -ForegroundColor Green
} else {
    Write-Host "  WARNING: $deployResult" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "XONG! Cac thay doi:" -ForegroundColor Green
Write-Host "  - submit_application: luu paymentRecipientId = candidateId" -ForegroundColor Green
Write-Host "  - update_application_status: nhan paymentRecipientId tu body" -ForegroundColor Green
Write-Host "  - Credit wallet: dung paymentRecipientId (tro tien dung worker moi)" -ForegroundColor Green
Write-Host "`nTiep theo: chay backfill-payment-recipient.py de cap nhat data cu" -ForegroundColor Yellow
Write-Host "  python backfill-payment-recipient.py" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
