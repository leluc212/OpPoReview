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

// Configure Amplify v6 - correct syntax
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

console.info('✅ Amplify v6 configured successfully');

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
