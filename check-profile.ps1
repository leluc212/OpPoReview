$userId = "296aa58c-30a1-70cc-44ed-b829e33a8245"
$keyJson = @"
{
  "userId": {
    "S": "$userId"
  }
}
"@
$keyJson | Out-File -FilePath "key.json" -Encoding ascii
aws dynamodb get-item --table-name CandidateProfiles --key file://key.json --region ap-southeast-1
Remove-Item "key.json" -ErrorAction SilentlyContinue
