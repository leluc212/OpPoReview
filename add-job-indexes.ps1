# Add GSI indexes to PostStandardJob table

Write-Host "Adding EmployerIndex to PostStandardJob table..." -ForegroundColor Cyan

aws dynamodb update-table `
    --table-name PostStandardJob `
    --attribute-definitions `
        AttributeName=employerId,AttributeType=S `
        AttributeName=createdAt,AttributeType=S `
    --global-secondary-index-updates `
        '[{
            "Create": {
                "IndexName": "EmployerIndex",
                "KeySchema": [
                    {"AttributeName": "employerId", "KeyType": "HASH"},
                    {"AttributeName": "createdAt", "KeyType": "RANGE"}
                ],
                "Projection": {
                    "ProjectionType": "ALL"
                }
            }
        }]' `
    --region ap-southeast-1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ EmployerIndex created successfully!" -ForegroundColor Green
    Write-Host "Waiting for index to become active..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    Write-Host ""
    Write-Host "Adding StatusIndex to PostStandardJob table..." -ForegroundColor Cyan
    
    aws dynamodb update-table `
        --table-name PostStandardJob `
        --attribute-definitions `
            AttributeName=status,AttributeType=S `
            AttributeName=createdAt,AttributeType=S `
        --global-secondary-index-updates `
            '[{
                "Create": {
                    "IndexName": "StatusIndex",
                    "KeySchema": [
                        {"AttributeName": "status", "KeyType": "HASH"},
                        {"AttributeName": "createdAt", "KeyType": "RANGE"}
                    ],
                    "Projection": {
                        "ProjectionType": "ALL"
                    }
                }
            }]' `
        --region ap-southeast-1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ StatusIndex created successfully!" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Error creating indexes" -ForegroundColor Red
}
