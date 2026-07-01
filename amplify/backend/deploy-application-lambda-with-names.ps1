# Deploy ApplicationLambda + patch IAM policy để cho phép đọc tên employer/worker
# Thay đổi: list_change_requests() nay trả về employerName + workerName thay vì UUID thô
$ErrorActionPreference = "Continue"

$REGION      = "ap-southeast-1"
$LAMBDA_NAME = "ApplicationLambda"
$POLICY_NAME = "ApplicationLambdaDynamoReadNames"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploy ApplicationLambda (name enrichment)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# ── Bước 1: Tạo ZIP ─────────────────────────────────────────────────────────
Write-Host "`n[1/3] Tao ZIP package..." -ForegroundColor Yellow
if (Test-Path "application-lambda.zip") { Remove-Item "application-lambda.zip" -Force }
Compress-Archive -Path "application-lambda.py", "email_service.py" -DestinationPath "application-lambda.zip" -Force
if ($LASTEXITCODE -ne 0 -or !(Test-Path "application-lambda.zip")) {
    Write-Host "ERROR: Khong tao duoc ZIP" -ForegroundColor Red; exit 1
}
Write-Host "  ZIP da tao: application-lambda.zip ($((Get-Item 'application-lambda.zip').Length / 1KB) KB)" -ForegroundColor Green

# ── Bước 2: Deploy code lên Lambda ──────────────────────────────────────────
Write-Host "`n[2/3] Upload code len Lambda..." -ForegroundColor Yellow
$deployResult = aws lambda update-function-code `
    --function-name $LAMBDA_NAME `
    --zip-file fileb://application-lambda.zip `
    --region $REGION 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Lambda code da duoc cap nhat thanh cong" -ForegroundColor Green
} else {
    Write-Host "  WARNING: $deployResult" -ForegroundColor Yellow
}

# ── Bước 3: Patch IAM role — thêm BatchGetItem cho EmployerProfiles + CandidateProfiles
Write-Host "`n[3/3] Cap nhat IAM policy cho Lambda role..." -ForegroundColor Yellow

# Lay role ARN tu Lambda config
$roleArn = (aws lambda get-function-configuration `
    --function-name $LAMBDA_NAME `
    --region $REGION `
    --query "Role" `
    --output text 2>&1)

if (-not $roleArn -or $roleArn -notmatch "arn:aws:iam") {
    Write-Host "  WARNING: Khong lay duoc role ARN — bo qua buoc patch IAM" -ForegroundColor Yellow
    Write-Host "  Hay them thu cong policy sau vao role cua $LAMBDA_NAME :" -ForegroundColor Yellow
    Write-Host '  Action: dynamodb:BatchGetItem, dynamodb:GetItem' -ForegroundColor White
    Write-Host '  Resource: arn:aws:dynamodb:ap-southeast-1:*:table/EmployerProfiles' -ForegroundColor White
    Write-Host '            arn:aws:dynamodb:ap-southeast-1:*:table/CandidateProfiles' -ForegroundColor White
} else {
    $roleName = $roleArn.Split('/')[-1]
    Write-Host "  Role: $roleName" -ForegroundColor Cyan

    $policyDoc = @'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadEmployerAndWorkerNames",
      "Effect": "Allow",
      "Action": [
        "dynamodb:BatchGetItem",
        "dynamodb:GetItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-southeast-1:*:table/EmployerProfiles",
        "arn:aws:dynamodb:ap-southeast-1:*:table/CandidateProfiles"
      ]
    }
  ]
}
'@

    $tmpPolicy = "$env:TEMP\app-lambda-names-policy.json"
    $policyDoc | Out-File -FilePath $tmpPolicy -Encoding ascii -Force

    aws iam put-role-policy `
        --role-name $roleName `
        --policy-name $POLICY_NAME `
        --policy-document "file://$tmpPolicy" `
        --region $REGION 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  IAM policy '$POLICY_NAME' da duoc gan vao role '$roleName'" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: Khong the gan policy tu dong — hay gap thu cong (xem tren)" -ForegroundColor Yellow
    }

    Remove-Item $tmpPolicy -Force -ErrorAction SilentlyContinue
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "XONG!" -ForegroundColor Green
Write-Host "list_change_requests() gio tra ve employerName + workerName" -ForegroundColor Green
Write-Host "Admin dashboard se hien ten thay vi UUID." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
