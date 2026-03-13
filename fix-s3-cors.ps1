# Fix S3 CORS for CV Storage Bucket
$BucketName = "opporeview-cv-storage"

Write-Host "Configuring CORS for S3 bucket: $BucketName" -ForegroundColor Cyan

# Create CORS configuration JSON file
$corsJson = @'
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "HEAD"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": [
                "ETag",
                "Content-Type",
                "Content-Length",
                "Content-Disposition"
            ],
            "MaxAgeSeconds": 3000
        }
    ]
}
'@

# Save to temporary file with ASCII encoding (no BOM)
$tempFile = "s3-cors-config.json"
[System.IO.File]::WriteAllText($tempFile, $corsJson, [System.Text.Encoding]::ASCII)

Write-Host "CORS configuration created" -ForegroundColor Yellow

# Apply CORS configuration
Write-Host ""
Write-Host "Applying CORS configuration..." -ForegroundColor Cyan
aws s3api put-bucket-cors --bucket $BucketName --cors-configuration file://$tempFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "CORS configuration applied successfully!" -ForegroundColor Green
    
    # Verify CORS configuration
    Write-Host ""
    Write-Host "Verifying CORS configuration..." -ForegroundColor Cyan
    aws s3api get-bucket-cors --bucket $BucketName
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "CORS verification successful!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Could not verify CORS configuration" -ForegroundColor Yellow
    }
} else {
    Write-Host "Failed to apply CORS configuration" -ForegroundColor Red
    Write-Host "Error code: $LASTEXITCODE" -ForegroundColor Red
}

# Cleanup
Remove-Item $tempFile -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- Bucket: $BucketName" -ForegroundColor White
Write-Host "- Allowed Origins: * (all origins)" -ForegroundColor White
Write-Host "- Allowed Methods: GET, HEAD" -ForegroundColor White

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Clear browser cache (Ctrl+Shift+Delete)" -ForegroundColor White
Write-Host "2. Refresh the web application" -ForegroundColor White
Write-Host "3. Try viewing CV again" -ForegroundColor White
