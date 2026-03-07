import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Button, FormGroup, Label, Input } from '../../components/FormElements';
import { Trash2, ArrowLeft, AlertTriangle, Check } from 'lucide-react';

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
    border-color: #EF4444;
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

const DangerBox = styled.div`
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(220, 38, 38, 0.12) 100%);
  border: 2px solid #FEE2E2;
  border-left: 5px solid #EF4444;
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 32px;
  
  display: flex;
  gap: 16px;
  
  svg {
    width: 28px;
    height: 28px;
    color: #EF4444;
    flex-shrink: 0;
  }
  
  .content {
    h3 {
      font-size: 18px;
      font-weight: 700;
      color: #EF4444;
      margin-bottom: 12px;
    }
    
    ul {
      margin: 0;
      padding-left: 20px;
      
      li {
        font-size: 14px;
        color: ${props => props.theme.colors.text};
        line-height: 1.8;
        margin-bottom: 8px;
        font-weight: 500;
      }
    }
    
    .warning-text {
      font-size: 14px;
      color: #EF4444;
      font-weight: 700;
      margin-top: 16px;
      padding: 12px;
      background: rgba(239, 68, 68, 0.1);
      border-radius: 8px;
    }
  }
`;

const ConfirmSection = styled.div`
  background: ${props => props.theme.colors.bgDark};
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 24px;
  border: 2px solid ${props => props.theme.colors.border};
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 16px;
    line-height: 1.6;
    
    strong {
      color: ${props => props.theme.colors.text};
      font-weight: 700;
    }
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  margin-bottom: 16px;
  
  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const DeleteButton = styled(Button)`
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function DeleteAccount() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [confirmations, setConfirmations] = useState({
    understand: false,
    permanent: false
  });
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const expectedText = language === 'vi' ? 'XÓA TÀI KHOẢN' : 'DELETE ACCOUNT';
  const canDelete = confirmations.understand && 
                    confirmations.permanent && 
                    password.trim() !== '' && 
                    confirmText === expectedText;

  const handleDelete = (e) => {
    e.preventDefault();
    
    if (!canDelete) return;
    
    // TODO: Call API to delete account
    console.log('Delete account confirmed');
    alert(language === 'vi' 
      ? 'Yêu cầu xóa tài khoản đã được gửi. Tài khoản sẽ bị xóa trong vòng 24 giờ.' 
      : 'Account deletion request submitted. Your account will be deleted within 24 hours.');
    
    // Navigate to landing page or logout
    navigate('/');
  };

  return (
    <DashboardLayout role="candidate" showSearch={false} key={language}>
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

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <DangerBox>
            <AlertTriangle />
            <div className="content">
              <h3>{language === 'vi' ? '⚠️ Cảnh báo quan trọng' : '⚠️ Important Warning'}</h3>
              <ul>
                <li>
                  {language === 'vi' 
                    ? 'Tất cả dữ liệu cá nhân của bạn sẽ bị xóa vĩnh viễn' 
                    : 'All your personal data will be permanently deleted'}
                </li>
                <li>
                  {language === 'vi' 
                    ? 'Lịch sử ứng tuyển và CV đã lưu sẽ bị mất' 
                    : 'Application history and saved CVs will be lost'}
                </li>
                <li>
                  {language === 'vi' 
                    ? 'Các công việc đã lưu và thông báo sẽ bị xóa' 
                    : 'Saved jobs and notifications will be deleted'}
                </li>
                <li>
                  {language === 'vi' 
                    ? 'Bạn không thể khôi phục tài khoản sau khi xóa' 
                    : 'You cannot recover your account after deletion'}
                </li>
              </ul>
              <div className="warning-text">
                {language === 'vi' 
                  ? '🔒 Hành động này KHÔNG THỂ HOÀN TÁC!' 
                  : '🔒 This action CANNOT BE UNDONE!'}
              </div>
            </div>
          </DangerBox>

          <form onSubmit={handleDelete}>
            <ConfirmSection>
              <p>
                <strong>{language === 'vi' ? 'Để xác nhận, vui lòng:' : 'To confirm, please:'}</strong>
              </p>
              
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={confirmations.understand}
                  onChange={(e) => setConfirmations({...confirmations, understand: e.target.checked})}
                />
                <span>
                  {language === 'vi' 
                    ? 'Tôi hiểu rằng tất cả dữ liệu của tôi sẽ bị xóa vĩnh viễn' 
                    : 'I understand that all my data will be permanently deleted'}
                </span>
              </CheckboxLabel>
              
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={confirmations.permanent}
                  onChange={(e) => setConfirmations({...confirmations, permanent: e.target.checked})}
                />
                <span>
                  {language === 'vi' 
                    ? 'Tôi xác nhận đây là hành động không thể hoàn tác' 
                    : 'I confirm this action is irreversible'}
                </span>
              </CheckboxLabel>
            </ConfirmSection>

            <FormGroup>
              <Label>{language === 'vi' ? 'Nhập mật khẩu của bạn' : 'Enter your password'}</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === 'vi' ? 'Mật khẩu' : 'Password'}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                {language === 'vi' 
                  ? `Nhập "${expectedText}" để xác nhận` 
                  : `Type "${expectedText}" to confirm`}
              </Label>
              <Input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={expectedText}
                required
              />
            </FormGroup>

            <ButtonGroup>
              <DeleteButton 
                type="submit" 
                disabled={!canDelete}
                style={{ flex: 1 }}
              >
                <Trash2 size={18} />
                {language === 'vi' ? 'Xóa tài khoản ' : 'Delete Account '}
              </DeleteButton>
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

export default DeleteAccount;
