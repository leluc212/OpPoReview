# Add DynamoDB policy to Lambda role

Write-Host "Adding DynamoDB policy to CVUploadLambdaRole..." -ForegroundColor Cyan

$ROLE_NAME = "CVUploadLambdaRole"
$POLICY_NAME = "ApplicationsDynamoDBAccess"

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
        "arn:aws:dynamodb:ap-southeast-1:*:table/StandardApplications",
        "arn:aws:dynamodb:ap-southeast-1:*:table/StandardApplications/index/*",
        "arn:aws:dynamodb:ap-southeast-1:*:table/PostStandardJob",
        "arn:aws:dynamodb:ap-southeast-1:*:table/PostQuickJob"
      ]
    }
  ]
}
"@

# Save to temp file (without BOM)
[System.IO.File]::WriteAllText("dynamo-policy-temp.json", $policyDocument)

# Add inline policy to role
Write-Host "Adding inline policy to role..." -ForegroundColor Yellow
aws iam put-role-policy --role-name $ROLE_NAME --policy-name $POLICY_NAME --policy-document file://dynamo-policy-temp.json

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Policy added successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to add policy" -ForegroundColor Red
}

# Cleanup
Remove-Item dynamo-policy-temp.json -ErrorAction SilentlyContinue

Write-Host "`nDone! Lambda now has access to Applications table." -ForegroundColor Cyan
