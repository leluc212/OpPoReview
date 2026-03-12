# Complete CORS fix for ALL job endpoints
$apiId = "dlidp35x33"
$region = "ap-southeast-1"

Write-Host "Fixing CORS for ALL job endpoints..." -ForegroundColor Cyan

# Resource IDs and paths
$endpoints = @(
    @{Path="/jobs"; Id="2c18pq"},
    @{Path="/jobs/active"; Id="cepymp"},
    @{Path="/jobs/employer/{employerId}"; Id="pieznv"},
    @{Path="/jobs/{idJob}"; Id="tirchz"},
    @{Path="/jobs/{idJob}/views"; Id="lbpl8x"}
)

foreach ($endpoint in $endpoints) {
    $path = $endpoint.Path
    $resourceId = $endpoint.Id
    
    Write-Host "`nConfiguring: $path" -ForegroundColor Yellow
    
    # Delete existing OPTIONS (ignore errors)
    aws apigateway delete-method --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --region $region 2>$null
    
    # Create OPTIONS method
    aws apigateway put-method --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --authorization-type NONE --region $region | Out-Null
    
    # Add MOCK integration
    aws apigateway put-integration --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --type MOCK --request-templates file://cors-integration-request.json --region $region | Out-Null
    
    # Add method response
    aws apigateway put-method-response --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters file://cors-method-response-params.json --region $region | Out-Null
    
    # Add integration response
    aws apigateway put-integration-response --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters file://cors-integration-response-params.json --region $region | Out-Null
    
    Write-Host "Done: $path" -ForegroundColor Green
}

# Deploy changes
Write-Host "`nDeploying to prod..." -ForegroundColor Cyan
aws apigateway create-deployment --rest-api-id $apiId --stage-name prod --description "Complete CORS fix" --region $region

Write-Host "`nCORS configuration complete!" -ForegroundColor Green
