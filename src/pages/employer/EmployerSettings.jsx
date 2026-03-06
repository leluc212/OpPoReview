import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Input, Label, Button, FormGroup } from '../../components/FormElements';
import { 
  Settings as SettingsIcon,
  Lock, 
  Bell, 
  FileText, 
  Globe, 
  Trash2, 
  Shield,
  AlertTriangle,
  ChevronRight,
  Check
} from 'lucide-react';

const SettingsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 16px;
  }
`;

const PageContainer = styled.div`
  animation: fadeIn 0.5s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: 24px;
`;

const SettingCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 28px;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const SettingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  .icon {
    width: 48px;
    height: 48px;
    border-radius: ${props => props.theme.borderRadius.md};
    background: ${props => props.theme.colors.gradientPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 24px;
      height: 24px;
      color: white;
    }
  }
  
  .info {
    h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 4px;
      color: ${props => props.theme.colors.text};
    }
    
    p {
      color: ${props => props.theme.colors.textLight};
      font-size: 14px;
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 32px;
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  
  h2 {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    
    svg {
      width: 24px;
      height: 24px;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const SettingItem = styled(motion.div)`
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.border};
    transform: translateX(4px);
  }
  
  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: ${props => props.theme.borderRadius.lg};
    background: ${props => props.$color ? `linear-gradient(135deg, ${props.$color}15, ${props.$color}25)` : props.theme.colors.gradientPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    svg {
      width: 24px;
      height: 24px;
      color: ${props => props.$color || props.theme.colors.primary};
    }
  }
  
  .setting-content {
    flex: 1;
    
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: ${props => props.theme.colors.text};
      margin-bottom: 4px;
    }
    
    p {
      font-size: 14px;
      color: ${props => props.theme.colors.textLight};
    }
  }
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.theme.colors.gray200};
    transition: all 0.3s ease;
    border-radius: 28px;
    
    &:before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: all 0.3s ease;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
  }
  
  input:checked + span {
    background: linear-gradient(135deg, #10B981, #059669);
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
  }
  
  input:checked + span:before {
    transform: translateX(24px);
  }
`;

const ToggleSwitch = Toggle;

const LanguageOptions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const LanguageButton = styled(motion.button)`
  padding: 14px 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgDark};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  }
  
  > div:first-child {
    flex: 1;
    margin-right: 20px;
  }
  
  .label {
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    font-size: 15px;
    margin-bottom: 4px;
  }
  
  .description {
    color: ${props => props.theme.colors.textLight};
    font-size: 13px;
    line-height: 1.5;
  }
`;

const DangerZone = styled.div`
  border: 2px solid #EF4444;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  background: #FEF2F2;
  
  h4 {
    color: #EF4444;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    color: #7F1D1D;
    font-size: 14px;
    margin-bottom: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const EmployerSettings = () => {
  const { language, changeLanguage, t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    applications: true,
    messages: true,
    system: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log('Change password:', passwordData);
  };

  const handleDeleteAccount = () => {
    if (window.confirm(language === 'vi' ? 'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!' : 'Are you sure you want to delete your account? This action cannot be undone!')) {
      console.log('Delete account');
    }
  };

  const handleDeactivateAccount = () => {
    if (window.confirm(language === 'vi' ? 'Bạn có chắc chắn muốn vô hiệu hóa tài khoản?' : 'Are you sure you want to deactivate your account?')) {
      console.log('Deactivate account');
    }
  };

  return (
    <DashboardLayout role="employer">
      <PageContainer>
        <PageHeader>
          <h1>{t.settings.title}</h1>
          <p>{language === 'vi' ? 'Quản lý cài đặt tài khoản và tùy chọn của bạn' : 'Manage your account settings and preferences'}</p>
        </PageHeader>

        <SettingsGrid>
          {/* Appearance & Language */}
          <SettingCard>
            <SettingHeader>
              <div className="icon">
                <Globe />
              </div>
              <div className="info">
                <h3>{language === 'vi' ? 'Tùy chỉnh hiển thị' : 'Display Settings'}</h3>
                <p>{language === 'vi' ? 'Ngôn ngữ và giao diện' : 'Language and appearance'}</p>
              </div>
            </SettingHeader>

            <SettingRow>
              <div>
                <div className="label">{t.settings.language}</div>
                <div className="description">{t.settings.languageDescription}</div>
              </div>
              <LanguageOptions>
                <LanguageButton
                  $active={language === 'vi'}
                  onClick={() => changeLanguage('vi')}
                >
                  {t.settings.vietnamese}
                </LanguageButton>
                <LanguageButton
                  $active={language === 'en'}
                  onClick={() => changeLanguage('en')}
                >
                  {t.settings.english}
                </LanguageButton>
              </LanguageOptions>
            </SettingRow>

            <SettingRow>
              <div>
                <div className="label">{t.settings.darkMode}</div>
                <div className="description">{t.settings.darkModeDesc}</div>
              </div>
              <ToggleSwitch>
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                />
                <span></span>
              </ToggleSwitch>
            </SettingRow>
          </SettingCard>

          {/* Security - Hidden */}
          {/* <SettingCard>
            <SettingHeader>
              <div className="icon">
                <Lock />
              </div>
              <div className="info">
                <h3>{language === 'vi' ? 'Bảo mật' : 'Security'}</h3>
                <p>{language === 'vi' ? 'Thay đổi mật khẩu và cài đặt bảo mật' : 'Change password and security settings'}</p>
              </div>
            </SettingHeader>

            <form onSubmit={handlePasswordChange}>
              <FormGroup>
                <Label>{language === 'vi' ? 'Mật khẩu hiện tại' : 'Current Password'}</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder={language === 'vi' ? 'Nhập mật khẩu hiện tại' : 'Enter current password'}
                />
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Mật khẩu mới' : 'New Password'}</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder={language === 'vi' ? 'Nhập mật khẩu mới' : 'Enter new password'}
                />
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Xác nhận mật khẩu mới' : 'Confirm New Password'}</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder={language === 'vi' ? 'Nhập lại mật khẩu mới' : 'Confirm new password'}
                />
              </FormGroup>

              <Button type="submit" variant="primary">
                <Lock size={18} />
                {language === 'vi' ? 'Đổi mật khẩu' : 'Change Password'}
              </Button>
            </form>
          </SettingCard> */}

          {/* Notifications */}
          <SettingCard>
            <SettingHeader>
              <div className="icon">
                <Bell />
              </div>
              <div className="info">
                <h3>{language === 'vi' ? 'Thông báo' : 'Notifications'}</h3>
                <p>{language === 'vi' ? 'Quản lý thông báo nhận được' : 'Manage your notification preferences'}</p>
              </div>
            </SettingHeader>

            <SettingRow>
              <div>
                <div className="label">{language === 'vi' ? 'Đơn ứng tuyển mới' : 'New Applications'}</div>
                <div className="description">{language === 'vi' ? 'Nhận thông báo khi có ứng viên nộp đơn' : 'Get notified when candidates apply'}</div>
              </div>
              <ToggleSwitch>
                <input
                  type="checkbox"
                  checked={notifications.applications}
                  onChange={(e) => setNotifications({...notifications, applications: e.target.checked})}
                />
                <span></span>
              </ToggleSwitch>
            </SettingRow>

            <SettingRow>
              <div>
                <div className="label">{language === 'vi' ? 'Tin nhắn' : 'Messages'}</div>
                <div className="description">{language === 'vi' ? 'Nhận thông báo tin nhắn mới' : 'Get notified of new messages'}</div>
              </div>
              <ToggleSwitch>
                <input
                  type="checkbox"
                  checked={notifications.messages}
                  onChange={(e) => setNotifications({...notifications, messages: e.target.checked})}
                />
                <span></span>
              </ToggleSwitch>
            </SettingRow>

            <SettingRow>
              <div>
                <div className="label">{language === 'vi' ? 'Thông báo hệ thống' : 'System Notifications'}</div>
                <div className="description">{language === 'vi' ? 'Nhận thông báo về cập nhật và bảo trì' : 'Get updates and maintenance notices'}</div>
              </div>
              <ToggleSwitch>
                <input
                  type="checkbox"
                  checked={notifications.system}
                  onChange={(e) => setNotifications({...notifications, system: e.target.checked})}
                />
                <span></span>
              </ToggleSwitch>
            </SettingRow>
          </SettingCard>

          {/* Policy */}
          <SettingCard>
            <SettingHeader>
              <div className="icon">
                <FileText />
              </div>
              <div className="info">
                <h3>{language === 'vi' ? 'Chính sách & Điều khoản' : 'Policy & Terms'}</h3>
                <p>{language === 'vi' ? 'Xem các chính sách và điều khoản sử dụng' : 'View policies and terms of service'}</p>
              </div>
            </SettingHeader>

            <ButtonGroup>
              <Button variant="outline">
                <FileText size={18} />
                {language === 'vi' ? 'Điều khoản dịch vụ' : 'Terms of Service'}
              </Button>
              <Button variant="outline">
                <Shield size={18} />
                {language === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy'}
              </Button>
            </ButtonGroup>
          </SettingCard>

          {/* Danger Zone - Hidden */}
          {/* <SettingCard>
            <DangerZone>
              <h4>{language === 'vi' ? 'Vùng nguy hiểm' : 'Danger Zone'}</h4>
              <p>{language === 'vi' ? 'Các hành động này không thể hoàn tác. Vui lòng cân nhắc kỹ trước khi thực hiện.' : 'These actions cannot be undone. Please proceed with caution.'}</p>
              
              <ButtonGroup>
                <Button variant="outline" onClick={handleDeactivateAccount}>
                  <Trash2 size={18} />
                  {language === 'vi' ? 'Vô hiệu hóa tài khoản' : 'Deactivate Account'}
                </Button>
                <Button variant="danger" onClick={handleDeleteAccount}>
                  <Trash2 size={18} />
                  {language === 'vi' ? 'Xóa tài khoản ' : 'Delete Account '}
                </Button>
              </ButtonGroup>
            </DangerZone>
          </SettingCard> */}
        </SettingsGrid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default EmployerSettings;
