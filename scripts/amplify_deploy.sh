#!/usr/bin/env bash
# Helper script to push Amplify backend (no automatic secrets; run locally with configured AWS creds)

set -euo pipefail

echo "Checking Amplify status..."
amplify status

echo "About to push Amplify backend (CloudFormation). This will create/update Lambda, API Gateway, and DynamoDB."
read -p "Continue? (yes/no): " yn
if [ "$yn" != "yes" ]; then
  echo "Aborted"
  exit 1
fi

amplify push --yes

echo "Amplify push finished. You should copy the API endpoint and set VITE_PACKAGE_SUBSCRIPTIONS_API in your frontend .env.local"

echo "Example (bash):"
echo "  export VITE_PACKAGE_SUBSCRIPTIONS_API=https://<api-id>.execute-api.<region>.amazonaws.com/<stage>"

echo "Restart your dev server after setting the env var: npm run dev"
