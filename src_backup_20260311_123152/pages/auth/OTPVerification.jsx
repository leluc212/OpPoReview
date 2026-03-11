import React, { useState } from 'react';
// load aws-amplify dynamically in handlers to tolerate different module shapes
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button } from '../../components/FormElements';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const OTPContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  padding: 40px;
`;

const OTPCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 64px 48px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.xl};
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: ${props => props.theme.colors.gradientPrimary};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 40px;
  
  strong {
    color: ${props => props.theme.colors.primary};
  }
`;

const OTPInputs = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
`;

const OTPInput = styled.input`
  width: 56px;
  height: 64px;
  border: 2px solid ${props => props.$filled ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.fast};
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const ResendLink = styled.button`
  background: none;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  margin-bottom: 24px;
  text-decoration: underline;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { email, role, password, name, fromRegistration } = location.state || { 
    email: 'user@example.com', 
    role: 'candidate',
    fromRegistration: false
  };
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    const code = otp.join('');
    try {
      // Import Auth functions from amplifyClient (v6 compatible)
      const { Auth } = await import('../../utils/amplifyClient');
      
      console.log('Confirming sign up for:', email, 'with code:', code);
      
      // AWS Amplify v6 confirmSignUp syntax
      const confirmResult = await Auth.confirmSignUp({
        username: email,
        confirmationCode: code
      });
      
      console.log('ConfirmSignUp successful:', confirmResult);

      // After successful OTP confirmation, redirect to login page
      // User will need to login with their credentials
      alert('Xác thực thành công! Vui lòng đăng nhập để tiếp tục.');
      
      // Redirect to appropriate login page based on role
      if (role === 'employer') {
        navigate('/login?role=employer');
      } else {
        navigate('/login?role=candidate');
      }
    } catch (err) {
      console.error('ConfirmSignUp error:', err);
      
      let errorMessage = 'Xác thực thất bại';
      if (err.name === 'CodeMismatchException' || err.message?.includes('Invalid code')) {
        errorMessage = 'Mã xác thực không đúng. Vui lòng kiểm tra lại.';
      } else if (err.name === 'ExpiredCodeException' || err.message?.includes('expired')) {
        errorMessage = 'Mã xác thực đã hết hạn. Vui lòng gửi lại mã mới.';
      } else if (err.name === 'NotAuthorizedException') {
        errorMessage = 'Tài khoản đã được xác thực. Vui lòng đăng nhập.';
      } else {
        errorMessage = err.message || 'Xác thực thất bại. Vui lòng thử lại.';
      }
      
      alert(errorMessage);
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      const { Auth } = await import('../../utils/amplifyClient');
      console.log('Resending confirmation code to:', email);
      await Auth.resendSignUpCode({
        username: email
      });
      alert('Mã xác thực đã được gửi lại!');
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      console.error('Resend code error:', err);
      alert('Không thể gửi lại mã: ' + (err.message || 'Vui lòng thử lại'));
    }
  };

  const otpValue = otp.join('');
  const isComplete = otpValue.length === 6;

  return (
    <OTPContainer>
      <OTPCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <IconWrapper>
          <CheckCircle />
        </IconWrapper>
        
        <Title>Xác Thực Email Của Bạn</Title>
        <Subtitle>
          Chúng tôi đã gửi mã 6 chữ số đến<br />
          <strong>{email}</strong>
        </Subtitle>

        <OTPInputs>
          {otp.map((digit, index) => (
            <OTPInput
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              $filled={!!digit}
            />
          ))}
        </OTPInputs>

        <ResendLink onClick={handleResend}>
          Không nhận được mã? Gửi lại
        </ResendLink>

        <Button
          $variant="primary"
          $fullWidth
          $size="large"
          onClick={handleVerify}
          disabled={!isComplete || isVerifying}
        >
          {isVerifying ? 'Đang xác thực...' : 'Xác Thực Email'}
        </Button>
      </OTPCard>
    </OTPContainer>
  );
};

export default OTPVerification;
