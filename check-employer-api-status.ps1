# Check Employer Profile API Status
Write-Host "🔍 Checking Employer Profile API Status" -ForegroundColor Cyan
Write-Host ""

$REGION = "ap-southeast-1"
$FUNCTION_NAME = "EmployerProfileAPI"
$TABLE_NAME = "EmployerProfiles"
$API_ID = "dlidp35x33"

# Check Lambda function
Write-Host "1. Checking Lambda function..." -ForegroundColor Yellow
try {
    $lambda = aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>&1 | ConvertFrom-Json
    Write-Host "   ✅ Lambda function exists" -ForegroundColor Green
    Write-Host "   Runtime: $($lambda.Configuration.Runtime)" -ForegroundColor Gray
    Write-Host "   Last Modified: $($lambda.Configuration.LastModified)" -ForegroundColor Gray
    Write-Host "   Memory: $($lambda.Configuration.MemorySize) MB" -ForegroundColor Gray
    Write-Host "   Timeout: $($lambda.Configuration.Timeout) seconds" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Lambda function not found or error" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

# Check DynamoDB table
Write-Host "2. Checking DynamoDB table..." -ForegroundColor Yellow
try {
    $table = aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION 2>&1 | ConvertFrom-Json
    Write-Host "   ✅ DynamoDB table exists" -ForegroundColor Green
    Write-Host "   Status: $($table.Table.TableStatus)" -ForegroundColor Gray
    Write-Host "   Item Count: $($table.Table.ItemCount)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ DynamoDB table not found or error" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

# Check API Gateway
Write-Host "3. Checking API Gateway..." -ForegroundColor Yellow
try {
    $api = aws apigateway get-rest-api --rest-api-id $API_ID --region $REGION 2>&1 | ConvertFrom-Json
    Write-Host "   ✅ API Gateway exists" -ForegroundColor Green
    Write-Host "   Name: $($api.name)" -ForegroundColor Gray
    Write-Host "   Created: $($api.createdDate)" -ForegroundColor Gray
    Write-Host "   Endpoint: https://$API_ID.execute-api.$REGION.amazonaws.com/prod" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ API Gateway not found or error" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

# Check Lambda permissions for API Gateway
Write-Host "4. Checking Lambda permissions..." -ForegroundColor Yellow
try {
    $policy = aws lambda get-policy --function-name $FUNCTION_NAME --region $REGION 2>&1 | ConvertFrom-Json
    $policyDoc = $policy.Policy | ConvertFrom-Json
    
    $apiGatewayPermissions = $policyDoc.Statement | Where-Object { $_.Principal.Service -eq "apigateway.amazonaws.com" }
    
    if ($apiGatewayPermissions) {
        Write-Host "   ✅ API Gateway has permission to invoke Lambda" -ForegroundColor Green
        Write-Host "   Permissions count: $($apiGatewayPermissions.Count)" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  No API Gateway permissions found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Could not check Lambda permissions" -ForegroundColor Yellow
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

# Check recent Lambda logs
Write-Host "5. Checking recent Lambda logs..." -ForegroundColor Yellow
try {
    $logGroups = aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/$FUNCTION_NAME" --region $REGION 2>&1 | ConvertFrom-Json
    
    if ($logGroups.logGroups.Count -gt 0) {
        Write-Host "   ✅ Log group exists" -ForegroundColor Green
        
        # Get latest log stream
        $logStreams = aws logs describe-log-streams --log-group-name "/aws/lambda/$FUNCTION_NAME" --order-by LastEventTime --descending --max-items 1 --region $REGION 2>&1 | ConvertFrom-Json
        
        if ($logStreams.logStreams.Count -gt 0) {
            $latestStream = $logStreams.logStreams[0]
            Write-Host "   Latest log stream: $($latestStream.logStreamName)" -ForegroundColor Gray
            Write-Host "   Last event: $($latestStream.lastEventTimestamp)" -ForegroundColor Gray
            
            # Get recent log events
            Write-Host ""
            Write-Host "   Recent log events:" -ForegroundColor Cyan
            $events = aws logs get-log-events --log-group-name "/aws/lambda/$FUNCTION_NAME" --log-stream-name $latestStream.logStreamName --limit 10 --region $REGION 2>&1 | ConvertFrom-Json
            
            foreach ($event in $events.events) {
                $timestamp = [DateTimeOffset]::FromUnixTimeMilliseconds($event.timestamp).LocalDateTime
                Write-Host "   [$timestamp] $($event.message)" -ForegroundColor Gray
            }
        } else {
            Write-Host "   ⚠️  No log streams found" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️  No log group found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Could not check logs" -ForegroundColor Yellow
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ Status check complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. If Lambda needs update: Run update-employer-lambda.ps1" -ForegroundColor White
Write-Host "   2. Test API: Open test-employer-api.html in browser" -ForegroundColor White
Write-Host "   3. Check logs: aws logs tail /aws/lambda/$FUNCTION_NAME --follow --region $REGION" -ForegroundColor White
