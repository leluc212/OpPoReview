# Enable CORS for PUT /jobs/{idJob}

$API_ID = "dlidp35x33"
$REGION = "ap-southeast-1"

Write-Host "Enabling CORS for PUT /jobs/{idJob}..." -ForegroundColor Cyan

# Get resource ID for /jobs/{idJob}
$RESOURCE_ID = aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query "items[?path=='/jobs/{idJob}'].id" --output text

Write-Host "Resource ID: $RESOURCE_ID" -ForegroundColor Green

# Update PUT integration response
Write-Host "Updating PUT integration response..." -ForegroundColor Yellow
aws apigateway put-integration-response --rest-api-id $API_ID --resource-id $RESOURCE_ID --http-method PUT --status-code 200 --response-parameters "method.response.header.Access-Control-Allow-Origin='*',method.response.header.Access-Control-Allow-Headers='Content-Type,Authorization',method.response.header.Access-Control-Allow-Methods='GET,POST,PUT,DELETE,OPTIONS'" --region $REGION

Write-Host "CORS enabled for PUT method" -ForegroundColor Green

# Deploy API
Write-Host "Deploying API..." -ForegroundColor Cyan
aws apigateway create-deployment --rest-api-id $API_ID --stage-name prod --region $REGION

Write-Host "Done!" -ForegroundColor Green
