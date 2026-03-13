# Create S3 bucket for CV storage
$bucketName = "opporeview-cv-storage"
$region = "ap-southeast-1"

Write-Host "Creating S3 bucket for CV storage..." -ForegroundColor Cyan

# Create bucket
aws s3api create-bucket --bucket $bucketName --region $region --create-bucket-configuration LocationConstraint=$region

if ($LASTEXITCODE -eq 0) {
    Write-Host "Bucket created successfully" -ForegroundColor Green
} else {
    Write-Host "Failed to create bucket (may already exist)" -ForegroundColor Yellow
}

# Block public access
Write-Host "Blocking public access..." -ForegroundColor Cyan
aws s3api put-public-access-block --bucket $bucketName --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Enable versioning
Write-Host "Enabling versioning..." -ForegroundColor Cyan
aws s3api put-bucket-versioning --bucket $bucketName --versioning-configuration Status=Enabled

# Add CORS configuration
Write-Host "Setting CORS configuration..." -ForegroundColor Cyan

$corsJson = @"
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
            "AllowedOrigins": ["https://leluc213.github.io", "http://localhost:5173"],
            "ExposeHeaders": ["ETag"],
            "MaxAgeSeconds": 3000
        }
    ]
}
"@

$corsJson | Out-File -FilePath "cors-config.json" -Encoding utf8
aws s3api put-bucket-cors --bucket $bucketName --cors-configuration file://cors-config.json
Remove-Item "cors-config.json" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "S3 bucket setup complete!" -ForegroundColor Green
Write-Host "Bucket name: $bucketName" -ForegroundColor Yellow
Write-Host "Region: $region" -ForegroundColor Yellow
