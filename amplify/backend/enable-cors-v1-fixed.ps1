# Enable CORS for API Gateway v1 (REST API) - Fixed version
Write-Host "Enabling CORS for EmployerProfileAPI..." -ForegroundColor Cyan

$API_ID = "xalmen0v0m"
$REGION = "ap-southeast-1"

try {
    # Get all resources
    Write-Host "Getting resources..." -ForegroundColor Blue
    $resources = aws apigateway get-resources --rest-api-id $API_ID --output json | ConvertFrom-Json
    
    foreach ($resource in $resources.items) {
        $resourceId = $resource.id
        $path = $resource.path
        
        Write-Host "Processing resource: $path" -ForegroundColor Gray
        
        # Get methods for this resource
        $methods = $resource.resourceMethods
        
        if ($methods) {
            foreach ($method in $methods.Keys) {
                Write-Host "  - Configuring $method" -ForegroundColor Gray
                
                # Get method integration
                $integration = aws apigateway get-integration `
                    --rest-api-id $API_ID `
                    --resource-id $resourceId `
                    --http-method $method `
                    --output json 2>&1 | ConvertFrom-Json
                
                # Put method response for 200
                aws apigateway put-method-response `
                    --rest-api-id $API_ID `
                    --resource-id $resourceId `
                    --http-method $method `
                    --status-code 200 `
                    --response-models '{"application/json":"Empty"}' `
                    --response-parameters '{"method.response.header.Access-Control-Allow-Headers":false,"method.response.header.Access-Control-Allow-Methods":false,"method.response.header.Access-Control-Allow-Origin":false}' `
                    2>&1 | Out-Null
                
                # Put integration response
                aws apigateway put-integration-response `
                    --rest-api-id $API_ID `
                    --resource-id $resourceId `
                    --http-method $method `
                    --status-code 200 `
                    --response-parameters '{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,Authorization'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'"}' `
                    2>&1 | Out-Null
            }
        }
        
        # Add OPTIONS method if not exists
        if (-not $methods.OPTIONS) {
            Write-Host "  - Adding OPTIONS method" -ForegroundColor Yellow
            
            # Put method
            aws apigateway put-method `
                --rest-api-id $API_ID `
                --resource-id $resourceId `
                --http-method OPTIONS `
                --authorization-type NONE `
                2>&1 | Out-Null
            
            # Put mock integration
            aws apigateway put-integration `
                --rest-api-id $API_ID `
                --resource-id $resourceId `
                --http-method OPTIONS `
                --type MOCK `
                --request-templates '{"application/json":"{\\"statusCode\\": 200}"}' `
                2>&1 | Out-Null
            
            # Put method response
            aws apigateway put-method-response `
                --rest-api-id $API_ID `
                --resource-id $resourceId `
                --http-method OPTIONS `
                --status-code 200 `
                --response-models '{"application/json":"Empty"}' `
                --response-parameters '{"method.response.header.Access-Control-Allow-Headers":false,"method.response.header.Access-Control-Allow-Methods":false,"method.response.header.Access-Control-Allow-Origin":false}' `
                2>&1 | Out-Null
            
            # Put integration response
            aws apigateway put-integration-response `
                --rest-api-id $API_ID `
                --resource-id $resourceId `
                --http-method OPTIONS `
                --status-code 200 `
                --response-parameters '{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,Authorization'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'"}' `
                2>&1 | Out-Null
        }
    }
    
    # Create new deployment
    Write-Host "`nCreating new deployment..." -ForegroundColor Blue
    $deployment = aws apigateway create-deployment `
        --rest-api-id $API_ID `
        --stage-name prod `
        --stage-description "CORS enabled" `
        --output json 2>&1 | ConvertFrom-Json
    
    Write-Host "Deployment created: $($deployment.id)" -ForegroundColor Green
    
    Write-Host "`nCORS enabled successfully!" -ForegroundColor Green
    Write-Host "API URL: https://$API_ID.execute-api.$REGION.amazonaws.com/prod" -ForegroundColor Cyan
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
