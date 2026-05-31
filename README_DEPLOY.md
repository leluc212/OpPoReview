Deployment guide — Package Subscriptions API

Goal
- Deploy the `package-subscriptions` Lambda + API Gateway + DynamoDB (package catalog table) so Admin edits persist and Employers see updated packages.

Prerequisites
- AWS CLI configured with credentials that can create/update Amplify / CloudFormation resources.
- Amplify CLI installed and configured: `npm i -g @aws-amplify/cli` and `amplify configure` done.
- From project root where `amplify/` directory exists.

Steps
1) Check Amplify status

```bash
# from project root
amplify status
```

2) Push Amplify backend changes (this will create/update Lambda, API, DynamoDB)

```bash
amplify push
```

- Monitor the output. When CloudFormation finishes, Amplify prints resource endpoints (API URLs). Copy the API URL for the Package Subscriptions API.

3) Set frontend env var

- Create `.env.local` (or update existing `.env`) in the project root and add:

```
VITE_PACKAGE_SUBSCRIPTIONS_API=https://<your-api-id>.execute-api.<region>.amazonaws.com/<stage>
```

- Save and restart the dev server: `npm run dev` or rebuild `npm run build`.

4) (Optional) Seed the PackageCatalog DynamoDB table

- The repo includes a seed file and script at `scripts/package_catalog_seed.json` and `scripts/seed_package_catalog.py`.

Run:

```bash
python scripts/seed_package_catalog.py --table PackageCatalog --region ap-southeast-1
```

- The script is interactive and will confirm before writing items.

5) Test the API

- Verify GET packages:

```bash
curl -i "$VITE_PACKAGE_SUBSCRIPTIONS_API/packages"
```

- Verify PUT (update one package):

```bash
curl -X PUT "$VITE_PACKAGE_SUBSCRIPTIONS_API/packages/hot-search" \
  -H 'Content-Type: application/json' \
  -d '{"packageName":"Hot Search (Edited)","order":1,"subtitle":{"vi":"Ưu tiên tìm kiếm","en":"Priority Search"},"prices":[{"duration":"24h","amount":19000}],"features":{"vi":["Lên Top"],"en":["Top search"]}}'
```

6) Verify from Admin UI

- With `VITE_PACKAGE_SUBSCRIPTIONS_API` set, open admin page and edit a package — the UI will call the PUT endpoint and you should see the change reflected in the catalog and in DynamoDB.

Troubleshooting
- If browser shows CORS errors, confirm API Gateway returns `Access-Control-Allow-Origin` header; the Lambda handler in `amplify/backend/package-subscriptions-lambda.py` sets CORS headers, but API Gateway must be deployed with integration responses that pass them.

Dev proxy option (avoid CORS while developing)
- If you prefer not to deploy immediately or to avoid CORS while testing, you can configure a dev proxy in Vite.
- Set an environment variable with the target API host (the real API URL), for example in PowerShell or Bash:

```bash
export PACKAGE_SUBSCRIPTIONS_PROXY_TARGET=https://<api-id>.execute-api.<region>.amazonaws.com/prod
```

- The Vite dev server will forward requests from `/api-packages/*` to that target. The frontend will automatically use `/api-packages` when `VITE_PACKAGE_SUBSCRIPTIONS_API` is not set and Vite dev server is running.

- Example: start dev server after setting the env var:
  - Example: start dev server after setting the env var:

  ```bash
  npm run dev
  ```

  Now Admin UI PUT/GET calls will go to `/api-packages` and be proxied to your real API, avoiding browser CORS problems.

GitHub Actions: seed PackageCatalog (optional, manual)
 - I added a manual GitHub Actions workflow to seed the `PackageCatalog` DynamoDB table: `.github/workflows/seed-package-catalog.yml`.
 - Purpose: allow you to seed or recreate the package catalog in DynamoDB without running `amplify push` (safe, isolated).
 - How to use:
   1. Add repository secrets in GitHub: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION`.
   2. Go to GitHub → Actions → `Seed Package Catalog` workflow, click `Run workflow`.
   3. Optionally set `createTable` to `yes` to create the `PackageCatalog` table if missing.
   4. Run the workflow — it will run the seed script non-interactively and describe the table upon completion.

This workflow is manual and will not run automatically; it only touches the `PackageCatalog` table and will not modify other AWS resources.
- If `amplify push` fails, inspect CloudFormation console for stack events. Amplify CLI will typically show the error message.

Security
- Do not commit AWS credentials. Use IAM roles with least privilege for deployment.

Contact
- If you'd like, I can also prepare a CI workflow to deploy automatically when you push to `main` (requires AWS secrets in CI). Let me know.