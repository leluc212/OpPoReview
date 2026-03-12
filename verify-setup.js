#!/usr/bin/env node

/**
 * Verification Script for Employer Profile API Integration
 * Checks all components are properly configured
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checks = [];

function check(name, condition, details = '') {
  const status = condition ? '✅' : '❌';
  checks.push({ name, status, condition, details });
  console.log(`${status} ${name}${details ? ': ' + details : ''}`);
}

console.log('\n🔍 Verifying Employer Profile API Integration Setup\n');

// 1. Check .env file
console.log('📋 Environment Configuration:');
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);
check('1. .env file exists', envExists);

if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  check('2. VITE_EMPLOYER_API_URL configured', envContent.includes('VITE_EMPLOYER_API_URL'));
  check('3. API URL points to correct endpoint', envContent.includes('xalmen0v0m'));
}

// 2. Check vite.config.js
console.log('\n⚙️  Vite Configuration:');
const viteConfigPath = path.join(process.cwd(), 'vite.config.js');
const viteConfigExists = fs.existsSync(viteConfigPath);
check('4. vite.config.js exists', viteConfigExists);

if (viteConfigExists) {
  const viteContent = fs.readFileSync(viteConfigPath, 'utf8');
  check('5. /api-employer proxy configured', viteContent.includes('/api-employer'));
  check('6. Proxy target is correct', viteContent.includes('xalmen0v0m'));
}

// 3. Check service file
console.log('\n🔧 Service Layer:');
const servicePath = path.join(process.cwd(), 'src/services/employerProfileService.js');
const serviceExists = fs.existsSync(servicePath);
check('7. employerProfileService.js exists', serviceExists);

if (serviceExists) {
  const serviceContent = fs.readFileSync(servicePath, 'utf8');
  check('8. getAuthToken function exists', serviceContent.includes('getAuthToken'));
  check('9. makeRequest function exists', serviceContent.includes('makeRequest'));
  check('10. getMyProfile function exists', serviceContent.includes('getMyProfile'));
  check('11. createProfile function exists', serviceContent.includes('createProfile'));
  check('12. updateProfile function exists', serviceContent.includes('updateProfile'));
  check('13. Token validation implemented', serviceContent.includes('if (!token)'));
  check('14. Error handling implemented', serviceContent.includes('catch (error)'));
  check('15. Logging implemented', serviceContent.includes('console.log'));
}

// 4. Check Lambda function
console.log('\n⚡ Lambda Function:');
const lambdaPath = path.join(process.cwd(), 'amplify/backend/api-employer-profile.cjs');
const lambdaExists = fs.existsSync(lambdaPath);
check('16. api-employer-profile.cjs exists', lambdaExists);

if (lambdaExists) {
  const lambdaContent = fs.readFileSync(lambdaPath, 'utf8');
  check('17. getUserIdFromToken function exists', lambdaContent.includes('getUserIdFromToken'));
  check('18. CORS headers configured', lambdaContent.includes('corsHeaders'));
  check('19. POST /profile endpoint exists', lambdaContent.includes("httpMethod === 'POST'"));
  check('20. GET /profile endpoint exists', lambdaContent.includes("httpMethod === 'GET'"));
  check('21. PUT /profile endpoint exists', lambdaContent.includes("httpMethod === 'PUT'"));
  check('22. DELETE /profile endpoint exists', lambdaContent.includes("httpMethod === 'DELETE'"));
}

// 5. Check DynamoDB service
console.log('\n💾 DynamoDB Service:');
const dbServicePath = path.join(process.cwd(), 'amplify/backend/employer-profile.cjs');
const dbServiceExists = fs.existsSync(dbServicePath);
check('23. employer-profile.cjs exists', dbServiceExists);

if (dbServiceExists) {
  const dbContent = fs.readFileSync(dbServicePath, 'utf8');
  check('24. createProfile method exists', dbContent.includes('createProfile'));
  check('25. getProfile method exists', dbContent.includes('getProfile'));
  check('26. updateProfile method exists', dbContent.includes('updateProfile'));
  check('27. deleteProfile method exists', dbContent.includes('deleteProfile'));
  check('28. DynamoDB client initialized', dbContent.includes('DynamoDBDocument'));
}

// 6. Check UI component
console.log('\n🎨 UI Component:');
const uiPath = path.join(process.cwd(), 'src/pages/employer/EmployerProfile.jsx');
const uiExists = fs.existsSync(uiPath);
check('29. EmployerProfile.jsx exists', uiExists);

if (uiExists) {
  const uiContent = fs.readFileSync(uiPath, 'utf8');
  check('30. employerProfileService imported', uiContent.includes('employerProfileService'));
  check('31. useAuth hook used', uiContent.includes('useAuth'));
  check('32. handleSave function exists', uiContent.includes('handleSave'));
  check('33. useEffect for loading profile', uiContent.includes('useEffect'));
}

// 7. Check documentation
console.log('\n📚 Documentation:');
const docs = [
  'COGNITO-API-INTEGRATION-FIX.md',
  'IMPLEMENTATION-COMPLETE.md',
  'QUICK-START-GUIDE.md',
  'TESTING-INSTRUCTIONS.md',
  'CHANGES-SUMMARY.md'
];

docs.forEach((doc, idx) => {
  const docPath = path.join(process.cwd(), doc);
  const docExists = fs.existsSync(docPath);
  check(`${34 + idx}. ${doc} exists`, docExists);
});

// 8. Check test tool
console.log('\n🧪 Testing Tools:');
const testToolPath = path.join(process.cwd(), 'test-employer-api.html');
const testToolExists = fs.existsSync(testToolPath);
check('39. test-employer-api.html exists', testToolExists);

// Summary
console.log('\n' + '='.repeat(60));
const passed = checks.filter(c => c.condition).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

console.log(`\n📊 Summary: ${passed}/${total} checks passed (${percentage}%)\n`);

if (percentage === 100) {
  console.log('✅ All checks passed! System is ready for testing.\n');
  console.log('Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Log in as employer');
  console.log('3. Go to "Hồ sơ công ty" (Company Profile)');
  console.log('4. Fill in company information');
  console.log('5. Click "Lưu" (Save)');
  console.log('6. Check browser console for success messages');
  console.log('7. Refresh page to verify data persists\n');
  process.exit(0);
} else if (percentage >= 80) {
  console.log('⚠️  Most checks passed. Review failed items above.\n');
  process.exit(1);
} else {
  console.log('❌ Several checks failed. Please review the setup.\n');
  process.exit(1);
}
