Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying CompletedJobs DynamoDB Table & IAM Policy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"
$REGION = "ap-southeast-1"
$TABLE_NAME = "CompletedJobs"

# 1. Check if CompletedJobs table exists
Write-Host "`n[1/3] Checking if table $TABLE_NAME already exists..." -ForegroundColor Yellow
$tableExists = $false
try {
    $descJson = aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION 2>$null
    if ($descJson) {
        $desc = $descJson | ConvertFrom-Json
        if ($desc -and $desc.Table.TableStatus) {
            $tableExists = $true
            Write-Host "Table $TABLE_NAME already exists." -ForegroundColor Green
        }
    }
} catch {
    # Table does not exist
}

# 2. Create CompletedJobs table if it doesn't exist
if (-not $tableExists) {
    Write-Host "Creating table $TABLE_NAME..." -ForegroundColor Yellow
    $gsi = '[{"IndexName":"JobIdIndex","KeySchema":[{"AttributeName":"jobId","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}},{"IndexName":"CandidateIdIndex","KeySchema":[{"AttributeName":"candidateId","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}},{"IndexName":"EmployerIdIndex","KeySchema":[{"AttributeName":"employerId","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}}]'
    
    aws dynamodb create-table `
      --table-name CompletedJobs `
      --billing-mode PAY_PER_REQUEST `
      --attribute-definitions `
        AttributeName=recordId,AttributeType=S `
        AttributeName=jobId,AttributeType=S `
        AttributeName=candidateId,AttributeType=S `
        AttributeName=employerId,AttributeType=S `
      --key-schema AttributeName=recordId,KeyType=HASH `
      --global-secondary-indexes $gsi `
      --region $REGION

    Write-Host "✅ Table CompletedJobs created successfully." -ForegroundColor Green
}

# 3. Update IAM Role Policy to allow DynamoDB access
Write-Host "`n[2/3] Updating IAM Role CVUploadLambdaRole policy to grant access..." -ForegroundColor Yellow

$policyDoc = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Effect = "Allow"
            Action = @(
                "dynamodb:PutItem"
                "dynamodb:GetItem"
                "dynamodb:UpdateItem"
                "dynamodb:Query"
                "dynamodb:Scan"
                "dynamodb:DeleteItem"
            )
            Resource = @(
                "arn:aws:dynamodb:ap-southeast-1:*:table/StandardApplications"
                "arn:aws:dynamodb:ap-southeast-1:*:table/StandardApplications/index/*"
                "arn:aws:dynamodb:ap-southeast-1:*:table/PostStandardJob"
                "arn:aws:dynamodb:ap-southeast-1:*:table/PostQuickJob"
                "arn:aws:dynamodb:ap-southeast-1:*:table/CompletedJobs"
                "arn:aws:dynamodb:ap-southeast-1:*:table/CompletedJobs/index/*"
            )
        }
    )
} | ConvertTo-Json -Depth 10

# Write policy to temp file for CLI invocation
$policyFile = [System.IO.Path]::GetTempFileName()
$policyDoc | Out-File -FilePath $policyFile -Encoding utf8

try {
    aws iam put-role-policy `
      --role-name CVUploadLambdaRole `
      --policy-name ApplicationsDynamoDBAccess `
      --policy-document file://$($policyFile.Replace('\', '/'))
    
    Write-Host "✅ CVUploadLambdaRole policy updated successfully with CompletedJobs permissions." -ForegroundColor Green
} catch {
    Write-Host "⚠️ Warning: Failed to update CVUploadLambdaRole policy. You might need admin permissions to update IAM policies: $_" -ForegroundColor Red
} finally {
    if (Test-Path $policyFile) {
        Remove-Item $policyFile -Force
    }
}

Write-Host "`n[3/3] Completed database & IAM deployment." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
