// AWS Amplify v6 Auth configuration
import { 
  signUp, 
  signIn, 
  confirmSignUp, 
  resendSignUpCode, 
  signOut, 
  getCurrentUser,
  resetPassword,
  confirmResetPassword
} from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

// Configure token storage to use localStorage
cognitoUserPoolsTokenProvider.setKeyValueStorage(window.localStorage);

// Configure Amplify v6 with proper storage
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-southeast-1_ShCajkmJd',
      userPoolClientId: '2mv7qt4gpmq03dmlm0or9724n8',
      loginWith: {
        email: true
      }
    }
  }
});

console.info('✅ Amplify v6 configured with localStorage for token persistence');

// Export Auth functions for v6
export const Auth = {
  signUp,
  signIn,
  confirmSignUp,
  resendSignUpCode,
  signOut,
  getCurrentUser,
  resetPassword,
  confirmResetPassword
};

export { Amplify };
export default { Amplify, Auth };
