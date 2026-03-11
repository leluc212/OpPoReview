const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  // Post confirmation trigger: add user to Cognito group based on custom:role attribute
  try {
    const userPoolId = event.userPoolId;
    const username = event.userName;
    const attrs = event.request && event.request.userAttributes ? event.request.userAttributes : {};
    const role = attrs['custom:role'] || attrs['role'] || '';

    if (!role) {
      console.log('No custom:role attribute found, skipping group assignment');
      return event;
    }

    const cognito = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

    const groupName = role.toLowerCase() === 'employer' ? 'Employer' : 'Candidate';

    console.log(`Adding user ${username} to group ${groupName} in pool ${userPoolId}`);

    await cognito.adminAddUserToGroup({
      UserPoolId: userPoolId,
      Username: username,
      GroupName: groupName,
    }).promise();

    return event;
  } catch (err) {
    console.error('PostConfirmation error', err);
    return event;
  }
};
