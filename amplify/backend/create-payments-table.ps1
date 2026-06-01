$gsi = '[{"IndexName":"TransferCodeIndex","KeySchema":[{"AttributeName":"transferCode","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}},{"IndexName":"UserIdIndex","KeySchema":[{"AttributeName":"userId","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}}]'

aws dynamodb create-table `
  --table-name Payments `
  --billing-mode PAY_PER_REQUEST `
  --attribute-definitions `
    AttributeName=paymentId,AttributeType=S `
    AttributeName=transferCode,AttributeType=S `
    AttributeName=userId,AttributeType=S `
  --key-schema AttributeName=paymentId,KeyType=HASH `
  --global-secondary-indexes $gsi `
  --region ap-southeast-1

Write-Host "✅ Table Payments created"

# Enable TTL
Start-Sleep -Seconds 10
aws dynamodb update-time-to-live `
  --table-name Payments `
  --time-to-live-specification "Enabled=true,AttributeName=ttl" `
  --region ap-southeast-1

Write-Host "✅ TTL enabled"
