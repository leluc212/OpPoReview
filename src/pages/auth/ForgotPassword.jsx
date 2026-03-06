import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

/* ═══════════════════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════════════════ */
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  padding: 24px;
  font-family: 'Inter', sans-serif;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 48px 40px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 24px;
  left: 24px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  transition: all 0.2s;
  
  &:hover {
    background: #e2e8f0;
    transform: translateX(-4px);
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const Step = styled.div`
  width: ${props => props.$active ? '40px' : '12px'};
  height: 12px;
  border-radius: 6px;
  background: ${props => props.$active ? 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)' : '#e2e8f0'};
  transition: all 0.3s;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  border-radius: 20px;
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
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
  color: #1e293b;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #64748b;
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.6;
  
  strong {
    color: #2563eb;
    font-weight: 600;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid ${props => props.$error ? '#ef4444' : '#e2e8f0'};
  border-radius: 12px;
  font-size: 15px;
  color: #1e293b;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }
  
  &::placeholder {
    color: #cbd5e1;
  }
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 16px;
  color: #94a3b8;
  padding: 4px;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #2563eb;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorText = styled.span`
  font-size: 13px;
  color: #ef4444;
  margin-top: -4px;
`;

const OTPInputs = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const OTPInput = styled.input`
  width: 56px;
  height: 64px;
  border: 2px solid ${props => props.$filled ? '#2563eb' : '#e2e8f0'};
  border-radius: 12px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #1e293b;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }
`;

const ResendWrapper = styled.div`
  text-align: center;
  margin-top: 16px;
`;

const ResendText = styled.p`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
`;

const ResendButton = styled.button`
  color: #2563eb;
  font-weight: 600;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SuccessIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    width: 48px;
    height: 48px;
  }
`;

/* ═══════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════ */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: New Password, 4: Success
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle phone number submission
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // Validate phone number (Vietnamese format)
    if (!phoneNumber) {
      newErrors.phone = t.forgotPassword?.errorPhoneRequired || 'Vui lòng nhập số điện thoại';
    } else if (!/^(0|\+84)[0-9]{9}$/.test(phoneNumber)) {
      newErrors.phone = t.forgotPassword?.errorPhoneInvalid || 'Số điện thoại không hợp lệ';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // TODO: Call API to send OTP
    console.log('Sending OTP to:', phoneNumber);
    setErrors({});
    setStep(2);
    setResendTimer(60);
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e, index) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (index + i < 6) {
        newOtp[index + i] = char;
      }
    });
    setOtp(newOtp);
    
    // Focus last filled input
    const lastIndex = Math.min(index + pastedData.length - 1, 5);
    otpRefs.current[lastIndex]?.focus();
  };

  // Handle OTP keydown
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setErrors({ otp: t.forgotPassword?.errorOtpRequired || 'Vui lòng nhập đầy đủ mã OTP' });
      return;
    }
    
    // TODO: Call API to verify OTP
    console.log('Verifying OTP:', otpValue);
    setErrors({});
    setStep(3);
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    // TODO: Call API to resend OTP
    console.log('Resending OTP to:', phoneNumber);
    setResendTimer(60);
    setOtp(['', '', '', '', '', '']);
  };

  // Handle password reset
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!password) {
      newErrors.password = t.forgotPassword?.errorPasswordRequired || 'Vui lòng nhập mật khẩu mới';
    } else if (password.length < 6) {
      newErrors.password = t.forgotPassword?.errorPasswordMinLength || 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = t.forgotPassword?.errorConfirmPasswordRequired || 'Vui lòng xác nhận mật khẩu';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t.forgotPassword?.errorPasswordMismatch || 'Mật khẩu xác nhận không khớp';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // TODO: Call API to reset password
    console.log('Resetting password for:', phoneNumber);
    setErrors({});
    setStep(4);
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  // Render based on step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <IconWrapper>
              <Phone />
            </IconWrapper>
            <Title>{t.forgotPassword?.title || 'Quên mật khẩu?'}</Title>
            <Subtitle>
              {t.forgotPassword?.subtitlePhone || 'Nhập số điện thoại của bạn để nhận mã xác minh'}
            </Subtitle>
            <Form onSubmit={handlePhoneSubmit}>
              <InputGroup>
                <Label>{t.forgotPassword?.labelPhone || 'Số điện thoại'} *</Label>
                <InputWrapper>
                  <InputIcon>
                    <Phone />
                  </InputIcon>
                  <Input
                    type="tel"
                    placeholder={t.forgotPassword?.placeholderPhone || '0912345678'}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    $error={errors.phone}
                  />
                </InputWrapper>
                {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
              </InputGroup>
              <Button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t.forgotPassword?.buttonSendOtp || 'Gửi mã xác minh'}
                <ArrowRight />
              </Button>
            </Form>
          </>
        );
      
      case 2:
        return (
          <>
            <IconWrapper>
              <Phone />
            </IconWrapper>
            <Title>{t.forgotPassword?.titleOtp || 'Nhập mã xác minh'}</Title>
            <Subtitle>
              {t.forgotPassword?.subtitleOtp || 'Nhập mã OTP 6 chữ số đã được gửi đến'} <strong>{phoneNumber}</strong>
            </Subtitle>
            <Form onSubmit={handleOtpSubmit}>
              <OTPInputs>
                {otp.map((digit, index) => (
                  <OTPInput
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onPaste={(e) => handleOtpPaste(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    $filled={!!digit}
                  />
                ))}
              </OTPInputs>
              {errors.otp && <ErrorText style={{ textAlign: 'center' }}>{errors.otp}</ErrorText>}
              <ResendWrapper>
                <ResendText>
                  {t.forgotPassword?.textDidntReceive || 'Không nhận được mã?'}
                </ResendText>
                <ResendButton
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                >
                  {resendTimer > 0
                    ? `${t.forgotPassword?.textResendIn || 'Gửi lại sau'} ${resendTimer}s`
                    : t.forgotPassword?.buttonResend || 'Gửi lại mã'}
                </ResendButton>
              </ResendWrapper>
              <Button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t.forgotPassword?.buttonVerifyOtp || 'Xác minh'}
                <ArrowRight />
              </Button>
            </Form>
          </>
        );
      
      case 3:
        return (
          <>
            <IconWrapper>
              <Lock />
            </IconWrapper>
            <Title>{t.forgotPassword?.titleNewPassword || 'Đặt mật khẩu mới'}</Title>
            <Subtitle>
              {t.forgotPassword?.subtitleNewPassword || 'Nhập mật khẩu mới cho tài khoản của bạn'}
            </Subtitle>
            <Form onSubmit={handlePasswordSubmit}>
              <InputGroup>
                <Label>{t.forgotPassword?.labelNewPassword || 'Mật khẩu mới'} *</Label>
                <InputWrapper>
                  <InputIcon>
                    <Lock />
                  </InputIcon>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t.forgotPassword?.placeholderPassword || 'Nhập mật khẩu mới'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    $error={errors.password}
                  />
                  <TogglePasswordButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </TogglePasswordButton>
                </InputWrapper>
                {errors.password && <ErrorText>{errors.password}</ErrorText>}
              </InputGroup>
              
              <InputGroup>
                <Label>{t.forgotPassword?.labelConfirmPassword || 'Xác nhận mật khẩu'} *</Label>
                <InputWrapper>
                  <InputIcon>
                    <Lock />
                  </InputIcon>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t.forgotPassword?.placeholderConfirmPassword || 'Nhập lại mật khẩu'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    $error={errors.confirmPassword}
                  />
                  <TogglePasswordButton
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </TogglePasswordButton>
                </InputWrapper>
                {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
              </InputGroup>
              
              <Button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t.forgotPassword?.buttonResetPassword || 'Đặt lại mật khẩu'}
                <CheckCircle />
              </Button>
            </Form>
          </>
        );
      
      case 4:
        return (
          <>
            <SuccessIcon
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <CheckCircle />
            </SuccessIcon>
            <Title>{t.forgotPassword?.titleSuccess || 'Thành công!'}</Title>
            <Subtitle>
              {t.forgotPassword?.subtitleSuccess || 'Mật khẩu của bạn đã được đặt lại thành công. Bạn sẽ được chuyển đến trang đăng nhập...'}
            </Subtitle>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {step < 4 && (
          <BackButton to="/login">
            <ArrowLeft size={20} />
          </BackButton>
        )}
        
        {step < 4 && (
          <StepIndicator>
            <Step $active={step === 1} />
            <Step $active={step === 2} />
            <Step $active={step === 3} />
          </StepIndicator>
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
