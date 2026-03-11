// Amplify v6 configuration for Auth (Cognito User Pool)
const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'ap-southeast-1_ShCajkmJd',
      userPoolClientId: '2mv7qt4gpmq03dmlm0or9724n8',
      loginWith: {
        email: true
      }
    }
  }
};

export default awsConfig;
