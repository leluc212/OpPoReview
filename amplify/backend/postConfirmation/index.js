const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
const docClient = new AWS.DynamoDB.DocumentClient();

function parseIdentityProvider(attrs) {
  // Social users often include `identities` claim; fallback to Cognito local.
  try {
    const identitiesRaw = attrs.identities;
    if (!identitiesRaw) return 'COGNITO';
    const identities = JSON.parse(identitiesRaw);
    const providerName = identities && identities[0] && identities[0].providerName;
    return providerName ? providerName.toUpperCase() : 'COGNITO';
  } catch (err) {
    console.warn('Could not parse identities attribute', err && err.message);
    return 'COGNITO';
  }
}

async function assignGroup(userPoolId, username, role) {
  const groupName = role === 'employer' ? 'Employer' : 'Candidate';

  console.log(`Adding user ${username} to group ${groupName} in pool ${userPoolId}`);

  await cognito.adminAddUserToGroup({
    UserPoolId: userPoolId,
    Username: username,
    GroupName: groupName,
  }).promise();
}

async function upsertUserRecord(attrs, role) {
  const usersTableName = process.env.USERS_TABLE_NAME || process.env.USERS_TABLE || 'Users';
  const userId = attrs.sub;
  const email = attrs.email || '';
  const fullName = attrs.name || attrs.given_name || '';
  const provider = parseIdentityProvider(attrs);
  const now = new Date().toISOString();

  if (!userId) {
    console.warn('Missing sub claim, skipping user upsert');
    return;
  }

  // Keep createdAt stable, always update login metadata.
  await docClient.update({
    TableName: usersTableName,
    Key: { userId },
    UpdateExpression: [
      'SET #email = :email',
      '#fullName = :fullName',
      '#role = if_not_exists(#role, :role)',
      '#provider = :provider',
      '#isActive = :isActive',
      '#updatedAt = :updatedAt',
      '#lastLoginAt = :lastLoginAt',
      '#createdAt = if_not_exists(#createdAt, :createdAt)'
    ].join(', '),
    ExpressionAttributeNames: {
      '#email': 'email',
      '#fullName': 'fullName',
      '#role': 'role',
      '#provider': 'provider',
      '#isActive': 'isActive',
      '#updatedAt': 'updatedAt',
      '#lastLoginAt': 'lastLoginAt',
      '#createdAt': 'createdAt'
    },
    ExpressionAttributeValues: {
      ':email': email,
      ':fullName': fullName,
      ':role': role,
      ':provider': provider,
      ':isActive': true,
      ':updatedAt': now,
      ':lastLoginAt': now,
      ':createdAt': now
    }
  }).promise();

  console.log(`Upserted user profile in table ${usersTableName} for ${email || userId}`);
}

exports.handler = async (event) => {
  // Post-confirmation: assign default group and persist user profile in DynamoDB.
  const userPoolId = event.userPoolId;
  const username = event.userName;
  const attrs = event.request && event.request.userAttributes ? event.request.userAttributes : {};

  // For social login where custom:role is absent, default to candidate.
  const role = (attrs['custom:role'] || attrs.role || 'candidate').toLowerCase() === 'employer'
    ? 'employer'
    : 'candidate';

  try {
    await assignGroup(userPoolId, username, role);
  } catch (err) {
    // Do not block sign-in flow if group assignment fails.
    console.error('Failed assigning user to group', err);
  }

  try {
    await upsertUserRecord(attrs, role);
  } catch (err) {
    // Do not block sign-in flow if DB upsert fails.
    console.error('Failed upserting user profile', err);
  }

  return event;
};
