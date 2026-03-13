# Fix CV S3 Bucket CORS Configuration

$bucketName = "opporeview-cv-storage"

Write-Host "`n=== Fixing CORS for S3 Bucket: $bucketName ===" -ForegroundColor Cyan

# Create CORS configuration
$corsConfig = @{
    CORSRules = @(
        @{
            AllowedHeaders = @("*")
            AllowedMethods = @("GET", "PUT", "POST", "DELETE", "HEAD")
            AllowedOrigins = @(
                "https://leluc213.github.io",
                "http://localhost:3000",
                "http://localhost:5173"
            )
            ExposeHeaders = @("ETag", "Content-Type", "Content-Length")
            MaxAgeSeconds = 3600
        }
    )
} | ConvertTo-Json -Depth 10

# Save to temp file
$tempFile = "cv-bucket-cors.json"
$corsConfig | Out-File -FilePath $tempFile -Encoding utf8

Write-Host "`nCORS Configuration:" -ForegroundColor Yellow
Get-Content $tempFile

# Apply CORS configuration
Write-Host "`nApplying CORS configuration..." -ForegroundColor Yellow
aws s3api put-bucket-cors --bucket $bucketName --cors-configuration file://$tempFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ CORS configuration applied successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to apply CORS configuration" -ForegroundColor Red
    exit 1
}

# Verify CORS configuration
Write-Host "`nVerifying CORS configuration..." -ForegroundColor Yellow
$cors = aws s3api get-bucket-cors --bucket $bucketName
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ CORS verification successful:" -ForegroundColor Green
    $cors | ConvertFrom-Json | ConvertTo-Json -Depth 10
} else {
    Write-Host "❌ Failed to verify CORS configuration" -ForegroundColor Red
}

# Cleanup
Remove-Item $tempFile -ErrorAction SilentlyContinue

Write-Host "`n=== CORS Fix Complete ===" -ForegroundColor Cyan
Write-Host "`nNote: Presigned URLs should work now for viewing/downloading CVs" -ForegroundColor Cyan
