# Enable CORS for /jobs/active
$apiId = "dlidp35x33"
$resourceId = "cepymp"
$region = "ap-southeast-1"

Write-Host "Enabling CORS for /jobs/active..." -ForegroundColor Cyan

aws apigateway delete-method --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --region $region 2>$null

aws apigateway put-method --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --authorization-type NONE --region $region

aws apigateway put-integration --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --type MOCK --request-templates file://cors-integration-request.json --region $region

aws apigateway put-method-response --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters file://cors-method-response-params.json --region $region

aws apigateway put-integration-response --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters file://cors-integration-response-params.json --region $region

aws apigateway create-deployment --rest-api-id $apiId --stage-name prod --description "CORS for active" --region $region

Write-Host "Done" -ForegroundColor Green
