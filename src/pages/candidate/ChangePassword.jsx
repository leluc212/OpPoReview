import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Button, FormGroup, Label, Input } from '../../components/FormElements';
import { Lock, ArrowLeft, Check, Eye, EyeOff, Shield, X, CheckCircle, XCircle } from 'lucide-react';

const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 24px 32px;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.bgLight};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateX(-4px);
  }
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 40px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
`;

const InfoBox = styled.div`
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.12) 0%, rgba(30, 64, 175, 0.12) 100%);
  border-left: 5px solid ${props => props.theme.colors.primary};
  padding: 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 24px;
  
  display: flex;
  gap: 16px;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.theme.colors.primary};
    flex-shrink: 0;
  }
  
  .content {
    h3 {
      font-size: 16px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
      margin-bottom: 8px;
    }
    
    ul {
      margin: 0;
      padding-left: 20px;
      
      li {
        font-size: 14px;
        color: ${props => props.theme.colors.textLight};
        line-height: 1.8;
      }
    }
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  
  button {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: ${props => props.theme.colors.textLight};
    padding: 8px;
    display: flex;
    align-items: center;
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const SuccessMessage = styled(motion.div)`
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.12) 100%);
  border-left: 5px solid #10B981;
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  
  svg {
    width: 28px;
    height: 28px;
    color: #10B981;
  }
  
  .content {
    h3 {
      font-size: 18px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
      margin-bottom: 4px;
    }
    
    p {
      font-size: 14px;
      color: ${props => props.theme.colors.textLight};
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #EF4444;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

const RequirementsList = styled.div`
  margin-top: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${props => props.$met ? '#10B981' : props.theme.colors.textLight};
  font-weight: ${props => props.$met ? '600' : '400'};
  
  &:last-child {
    margin-bottom: 0;
  }
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.$met ? '#10B981' : '#94A3B8'};
  }
`;

function ChangePassword() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  const validatePassword = (password) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const isPasswordValid = () => {
    return passwordRequirements.minLength && 
           passwordRequirements.hasUppercase && 
           passwordRequirements.hasNumber && 
           passwordRequirements.hasSpecial;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password requirements
    if (!isPasswordValid()) {
      setError(language === 'vi' 
        ? 'Mật khẩu mới không đáp ứng đủ yêu cầu!' 
        : 'New password does not meet all requirements!');
      return;
    }
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(language === 'vi' 
        ? 'Mật khẩu xác nhận không khớp!' 
        : 'Passwords do not match!');
      return;
    }
    
    // TODO: Call API to change password
    console.log('Change password:', passwordData);
    
    setSuccess(true);
    setTimeout(() => {
      navigate('/candidate/settings');
    }, 2000);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <PageContainer>
        <BackButton
          onClick={() => navigate('/candidate/settings')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ArrowLeft size={18} />
          {language === 'vi' ? 'Quay lại' : 'Back'}
        </BackButton>

        {success && (
          <SuccessMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Check />
            <div className="content">
              <h3>{language === 'vi' ? 'Thành công!' : 'Success!'}</h3>
              <p>
                {language === 'vi' 
                  ? 'Mật khẩu đã được cập nhật. Đang chuyển về trang cài đặt...' 
                  : 'Password updated successfully. Redirecting to settings...'}
              </p>
            </div>
          </SuccessMessage>
        )}

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Lock size={28} />
            {language === 'vi' ? 'Đổi mật khẩu' : 'Change Password'}
          </h2>
          
          <InfoBox>
            <Shield />
            <div className="content">
              <h3>{language === 'vi' ? 'Yêu cầu mật khẩu' : 'Password Requirements'}</h3>
            </div>
          </InfoBox>

          <RequirementsList>
            <RequirementItem $met={passwordRequirements.minLength}>
              {passwordRequirements.minLength ? <CheckCircle /> : <XCircle />}
              <span>{language === 'vi' ? 'Tối thiểu 8 ký tự' : 'Minimum 8 characters'}</span>
            </RequirementItem>
            <RequirementItem $met={passwordRequirements.hasUppercase}>
              {passwordRequirements.hasUppercase ? <CheckCircle /> : <XCircle />}
              <span>{language === 'vi' ? 'Ít nhất một chữ hoa' : 'At least one uppercase letter'}</span>
            </RequirementItem>
            <RequirementItem $met={passwordRequirements.hasNumber}>
              {passwordRequirements.hasNumber ? <CheckCircle /> : <XCircle />}
              <span>{language === 'vi' ? 'Ít nhất một chữ số' : 'At least one number'}</span>
            </RequirementItem>
            <RequirementItem $met={passwordRequirements.hasSpecial}>
              {passwordRequirements.hasSpecial ? <CheckCircle /> : <XCircle />}
              <span>{language === 'vi' ? 'Ít nhất một ký tự đặc biệt' : 'At least one special character'}</span>
            </RequirementItem>
          </RequirementsList>

          {error && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <XCircle />
              <span>{error}</span>
            </ErrorMessage>
          )}

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>{language === 'vi' ? 'Mật khẩu hiện tại' : 'Current Password'}</Label>
              <PasswordInputWrapper>
                <Input
                  type={showPassword.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder={language === 'vi' ? 'Nhập mật khẩu hiện tại' : 'Enter current password'}
                  required
                />
                <button 
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </PasswordInputWrapper>
            </FormGroup>

            <FormGroup>
              <Label>{language === 'vi' ? 'Mật khẩu mới' : 'New Password'}</Label>
              <PasswordInputWrapper>
                <Input
                  type={showPassword.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    const newPassword = e.target.value;
                    setPasswordData({...passwordData, newPassword});
                    setPasswordRequirements(validatePassword(newPassword));
                    setError('');
                  }}
                  placeholder={language === 'vi' ? 'Nhập mật khẩu mới' : 'Enter new password'}
                  required
                  minLength="8"
                />
                <button 
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </PasswordInputWrapper>
            </FormGroup>

            <FormGroup>
              <Label>{language === 'vi' ? 'Xác nhận mật khẩu mới' : 'Confirm New Password'}</Label>
              <PasswordInputWrapper>
                <Input
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder={language === 'vi' ? 'Xác nhận mật khẩu mới' : 'Confirm new password'}
                  required
                  minLength="8"
                />
                <button 
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </PasswordInputWrapper>
            </FormGroup>

            <ButtonGroup>
              <Button type="submit" variant="primary" style={{ flex: 1 }}>
                <Lock size={18} />
                {language === 'vi' ? 'Cập nhật mật khẩu' : 'Update Password'}
              </Button>
              <Button 
                type="button"
                onClick={() => navigate('/candidate/settings')}
                style={{ flex: 1, background: '#6B7280' }}
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </Button>
            </ButtonGroup>
          </form>
        </Card>
      </PageContainer>
    </DashboardLayout>
  );
}

export default ChangePassword;
