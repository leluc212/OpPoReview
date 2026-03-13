# Grant DynamoDB permissions to Lambda role

Write-Host "Granting DynamoDB permissions to Lambda role..." -ForegroundColor Cyan

$ROLE_NAME = "CVUploadLambdaRole"
$REGION = "ap-southeast-1"

# Create policy document
$policyDocument = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:DeleteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:${REGION}:*:table/Applications",
        "arn:aws:dynamodb:${REGION}:*:table/Applications/index/*",
        "arn:aws:dynamodb:${REGION}:*:table/PostStandardJob",
        "arn:aws:dynamodb:${REGION}:*:table/PostQuickJob"
      ]
    }
  ]
}
"@

# Save to file
$policyDocument | Out-File -FilePath "dynamodb-policy.json" -Encoding UTF8

Write-Host "`nAdding DynamoDB policy to role: $ROLE_NAME" -ForegroundColor Yellow

# Put inline policy
aws iam put-role-policy `
    --role-name $ROLE_NAME `
    --policy-name ApplicationDynamoDBAccess `
    --policy-document file://dynamodb-policy.json

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Policy added successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to add policy" -ForegroundColor Red
    exit 1
}

# Clean up
Remove-Item dynamodb-policy.json -ErrorAction SilentlyContinue

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "Permissions Granted Successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "`nLambda can now access:" -ForegroundColor Yellow
Write-Host "  - Applications table" -ForegroundColor White
Write-Host "  - PostStandardJob table" -ForegroundColor White
Write-Host "  - PostQuickJob table" -ForegroundColor White
Write-Host "`nPlease wait 10 seconds for IAM changes to propagate" -ForegroundColor Yellow
