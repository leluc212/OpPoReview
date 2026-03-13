# Check CV S3 Bucket Configuration

$bucketName = "opporeview-cv-storage"

Write-Host "`n=== Checking S3 Bucket: $bucketName ===" -ForegroundColor Cyan

# 1. Check if bucket exists
Write-Host "`n1. Checking bucket existence..." -ForegroundColor Yellow
aws s3 ls s3://$bucketName 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Bucket exists" -ForegroundColor Green
} else {
    Write-Host "❌ Bucket not found or no access" -ForegroundColor Red
    exit 1
}

# 2. Check CORS configuration
Write-Host "`n2. Checking CORS configuration..." -ForegroundColor Yellow
$cors = aws s3api get-bucket-cors --bucket $bucketName 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ CORS is configured:" -ForegroundColor Green
    $cors | ConvertFrom-Json | ConvertTo-Json -Depth 10
} else {
    Write-Host "❌ No CORS configuration found" -ForegroundColor Red
    Write-Host "Error: $cors" -ForegroundColor Red
}

# 3. List CV files
Write-Host "`n3. Listing CV files..." -ForegroundColor Yellow
$files = aws s3 ls s3://$bucketName/cvs/ --recursive
if ($files) {
    Write-Host "✅ Found CV files:" -ForegroundColor Green
    $files
} else {
    Write-Host "⚠️ No CV files found" -ForegroundColor Yellow
}

# 4. Check bucket policy
Write-Host "`n4. Checking bucket policy..." -ForegroundColor Yellow
$policy = aws s3api get-bucket-policy --bucket $bucketName 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Bucket policy exists:" -ForegroundColor Green
    $policy | ConvertFrom-Json | ConvertTo-Json -Depth 10
} else {
    Write-Host "⚠️ No bucket policy (this is OK for private bucket)" -ForegroundColor Yellow
}

# 5. Check public access block
Write-Host "`n5. Checking public access block..." -ForegroundColor Yellow
$publicAccess = aws s3api get-public-access-block --bucket $bucketName 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Public access block configuration:" -ForegroundColor Green
    $publicAccess | ConvertFrom-Json | ConvertTo-Json -Depth 10
} else {
    Write-Host "⚠️ No public access block configuration" -ForegroundColor Yellow
}

Write-Host "`n=== Check Complete ===" -ForegroundColor Cyan
