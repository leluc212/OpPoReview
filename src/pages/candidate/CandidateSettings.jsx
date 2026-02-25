import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Globe, 
  Moon, 
  Sun, 
  Lock, 
  Shield, 
  FileText, 
  Trash2,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  User,
  Phone,
  Key,
  Download,
  AlertTriangle,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { Button, FormGroup, Label, Input } from '../../components/FormElements';

const SettingsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 48px;
  margin-bottom: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }
  
  .header-content {
    position: relative;
    z-index: 1;
    
    h1 {
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 16px;
      
      svg {
        width: 40px;
        height: 40px;
      }
    }
    
    p {
      font-size: 16px;
      opacity: 0.9;
      font-weight: 400;
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  
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
  border: 1px solid ${props => props.theme.colors.border};
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    
    h2 {
      font-size: 22px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
      display: flex;
      align-items: center;
      gap: 12px;
      
      svg {
        width: 24px;
        height: 24px;
        color: ${props => props.theme.colors.primary};
      }
    }
  }
`;

const SettingItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 12px;
  transition: all 0.3s;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    border-color: ${props => props.$color || props.theme.colors.primary};
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  .setting-left {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 16px;
    
    .icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: ${props => props.theme.borderRadius.lg};
      background: ${props => props.$color || props.theme.colors.primary}15;
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
    
    .setting-info {
      flex: 1;
      
      h3 {
        font-size: 16px;
        font-weight: 700;
        color: ${props => props.theme.colors.text};
        margin-bottom: 6px;
      }
      
      p {
        font-size: 14px;
        color: ${props => props.theme.colors.textLight};
        line-height: 1.5;
      }
    }
  }
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 56px;
  height: 32px;
  flex-shrink: 0;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + span {
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    
    &:checked + span:before {
      transform: translateX(24px);
    }
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #CBD5E1;
    border-radius: 32px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:before {
      position: absolute;
      content: '';
      height: 24px;
      width: 24px;
      left: 4px;
      bottom: 4px;
      background: white;
      border-radius: 50%;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
  }
`;

const LanguageOptions = styled.div`
  display: flex;
  gap: 12px;
`;

const LanguageButton = styled(motion.button)`
  padding: 10px 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const PasswordForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
`;

const InfoBox = styled(motion.div)`
  background: ${props => {
    if (props.$type === 'warning') return 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)';
    if (props.$type === 'success') return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)';
    return 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
  }};
  border-left: 4px solid ${props => {
    if (props.$type === 'warning') return '#EF4444';
    if (props.$type === 'success') return '#10B981';
    return props.theme.colors.primary;
  }};
  padding: 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  
  .info-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => {
        if (props.$type === 'warning') return '#EF4444';
        if (props.$type === 'success') return '#10B981';
        return props.theme.colors.primary;
      }};
    }
    
    h4 {
      font-size: 15px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
    }
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.7;
    margin-left: 32px;
  }
`;

const PolicyItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  .policy-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    
    .icon {
      width: 48px;
      height: 48px;
      border-radius: ${props => props.theme.borderRadius.lg};
      background: ${props => props.theme.colors.primary}15;
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        width: 24px;
        height: 24px;
        color: ${props => props.theme.colors.primary};
      }
    }
    
    .policy-info {
      h3 {
        font-size: 16px;
        font-weight: 700;
        color: ${props => props.theme.colors.text};
        margin-bottom: 4px;
      }
      
      p {
        font-size: 14px;
        color: ${props => props.theme.colors.textLight};
      }
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const DangerZone = styled(Card)`
  border-color: #FEE2E2;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%);
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  text-align: center;
  
  .stat-value {
    font-size: 24px;
    font-weight: 800;
    color: ${props => props.$color || props.theme.colors.primary};
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 12px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 600;
  }
`;

function CandidateSettings() {
  const [language, setLanguage] = useState('vi');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    profile: true,
    suggestions: false
  });
  
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showEmail: false,
    showPhone: false
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handlePrivacyToggle = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <SettingsContainer>
        <PageHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <h1><SettingsIcon />Cài đặt</h1>
            <p>Quản lý tài khoản, thông báo và quyền riêng tư của bạn</p>
          </div>
        </PageHeader>

        <ContentGrid>
          <MainContent>
            {/* Account Settings */}
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="card-header">
                <h2><User />Cài đặt tài khoản</h2>
              </div>
              
              <SettingItem
                $color="#667eea"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="setting-left">
                  <div className="icon-wrapper">
                    <Globe />
                  </div>
                  <div className="setting-info">
                    <h3>Ngôn ngữ</h3>
                    <p>Chọn ngôn ngữ hiển thị cho ứng dụng</p>
                  </div>
                </div>
                <LanguageOptions>
                  <LanguageButton 
                    $active={language === 'vi'} 
                    onClick={() => setLanguage('vi')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {language === 'vi' && <Check />}
                    🇻🇳 Tiếng Việt
                  </LanguageButton>
                  <LanguageButton 
                    $active={language === 'en'} 
                    onClick={() => setLanguage('en')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {language === 'en' && <Check />}
                    🇬🇧 English
                  </LanguageButton>
                </LanguageOptions>
              </SettingItem>
              
              <SettingItem
                $color="#F59E0B"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="setting-left">
                  <div className="icon-wrapper">
                    {darkMode ? <Moon /> : <Sun />}
                  </div>
                  <div className="setting-info">
                    <h3>Chế độ tối</h3>
                    <p>Bật/tắt giao diện tối để giảm mỏi mắt</p>
                  </div>
                </div>
                <Toggle>
                  <input 
                    type="checkbox" 
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                  <span></span>
                </Toggle>
              </SettingItem>
            </Card>

            {/* Notifications */}
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="card-header">
                <h2><Bell />Thông báo</h2>
              </div>
              
              <SettingItem
                $color="#10B981"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="setting-left">
                  <div className="icon-wrapper">
                    <Mail />
                  </div>
                  <div className="setting-info">
                    <h3>Nhận email</h3>
                    <p>Nhận email về cơ hội việc làm mới và cập nhật quan trọng</p>
                  </div>
                </div>
                <Toggle>
                  <input 
                    type="checkbox" 
                    checked={notifications.email}
                    onChange={() => handleNotificationToggle('email')}
                  />
                  <span></span>
                </Toggle>
              </SettingItem>
              
              <SettingItem
                $color="#667eea"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="setting-left">
                  <div className="icon-wrapper">
                    <Bell />
                  </div>
                  <div className="setting-info">
                    <h3>Cập nhật hồ sơ</h3>
                    <p>Nhận thông báo khi nhà tuyển dụng xem hồ sơ của bạn</p>
                  </div>
                </div>
                <Toggle>
                  <input 
                    type="checkbox" 
                    checked={notifications.profile}
                    onChange={() => handleNotificationToggle('profile')}
                  />
                  <span></span>
                </Toggle>
              </SettingItem>
              
              <SettingItem
                $color="#F59E0B"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="setting-left">
                  <div className="icon-wrapper">
                    <MessageSquare />
                  </div>
                  <div className="setting-info">
                    <h3>Gợi ý việc làm</h3>
                    <p>Nhận thông báo về việc làm phù hợp với kỹ năng của bạn</p>
                  </div>
                </div>
                <Toggle>
                  <input 
                    type="checkbox" 
                    checked={notifications.suggestions}
                    onChange={() => handleNotificationToggle('suggestions')}
                  />
                  <span></span>
                </Toggle>
              </SettingItem>
            </Card>

            {/* Privacy */}
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="card-header">
                <h2><Shield />Quyền riêng tư</h2>
              </div>
              
              <SettingItem
                $color="#10B981"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="setting-left">
                  <div className="icon-wrapper">
                    {privacy.showProfile ? <Eye /> : <EyeOff />}
                  </div>
                  <div className="setting-info">
                    <h3>Hiển thị hồ sơ công khai</h3>
                    <p>Cho phép nhà tuyển dụng tìm kiếm và xem hồ sơ của bạn</p>
                  </div>
                </div>
                <Toggle>
                  <input 
                    type="checkbox" 
                    checked={privacy.showProfile}
                    onChange={() => handlePrivacyToggle('showProfile')}
                  />
                  <span></span>
                </Toggle>
              </SettingItem>
              
              <SettingItem
                $color="#667eea"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="setting-left">
                  <div className="icon-wrapper">
                    <Mail />
                  </div>
                  <div className="setting-info">
                    <h3>Hiển thị email</h3>
                    <p>Cho phép nhà tuyển dụng liên hệ qua email</p>
                  </div>
                </div>
                <Toggle>
                  <input 
                    type="checkbox" 
                    checked={privacy.showEmail}
                    onChange={() => handlePrivacyToggle('showEmail')}
                  />
                  <span></span>
                </Toggle>
              </SettingItem>
              
              <SettingItem
                $color="#F59E0B"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="setting-left">
                  <div className="icon-wrapper">
                    <Phone />
                  </div>
                  <div className="setting-info">
                    <h3>Hiển thị số điện thoại</h3>
                    <p>Cho phép nhà tuyển dụng liên hệ qua điện thoại</p>
                  </div>
                </div>
                <Toggle>
                  <input 
                    type="checkbox" 
                    checked={privacy.showPhone}
                    onChange={() => handlePrivacyToggle('showPhone')}
                  />
                  <span></span>
                </Toggle>
              </SettingItem>
            </Card>

            {/* Policies */}
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="card-header">
                <h2><FileText />Chính sách & điều khoản</h2>
              </div>
              
              <PolicyItem
                whileHover={{ scale: 1.01 }}
                onClick={() => window.open('/terms', '_blank')}
              >
                <div className="policy-left">
                  <div className="icon">
                    <FileText />
                  </div>
                  <div className="policy-info">
                    <h3>Điều khoản dịch vụ</h3>
                    <p>Xem điều khoản và điều kiện sử dụng dịch vụ</p>
                  </div>
                </div>
                <ChevronRight />
              </PolicyItem>
              
              <PolicyItem
                whileHover={{ scale: 1.01 }}
                onClick={() => window.open('/privacy', '_blank')}
              >
                <div className="policy-left">
                  <div className="icon">
                    <Shield />
                  </div>
                  <div className="policy-info">
                    <h3>Chính sách bảo mật</h3>
                    <p>Tìm hiểu cách chúng tôi xử lý dữ liệu của bạn</p>
                  </div>
                </div>
                <ChevronRight />
              </PolicyItem>
              
              <PolicyItem
                whileHover={{ scale: 1.01 }}
                onClick={() => window.open('/cookies', '_blank')}
              >
                <div className="policy-left">
                  <div className="icon">
                    <FileText />
                  </div>
                  <div className="policy-info">
                    <h3>Chính sách Cookies</h3>
                    <p>Quản lý cookies và thiết lập theo dõi</p>
                  </div>
                </div>
                <ChevronRight />
              </PolicyItem>
              
              <PolicyItem
                whileHover={{ scale: 1.01 }}
              >
                <div className="policy-left">
                  <div className="icon">
                    <Download />
                  </div>
                  <div className="policy-info">
                    <h3>Tải dữ liệu của bạn</h3>
                    <p>Tải xuống bản sao dữ liệu cá nhân của bạn</p>
                  </div>
                </div>
                <ChevronRight />
              </PolicyItem>
            </Card>
          </MainContent>

          <Sidebar>
            {/* Security Card */}
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="card-header">
                <h2><Lock />Bảo mật</h2>
              </div>
              
              <PasswordForm>
                <FormGroup>
                  <Label>Mật khẩu hiện tại</Label>
                  <div style={{ position: 'relative' }}>
                    <Input
                      type={showPassword.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      placeholder="Nhập mật khẩu hiện tại"
                      style={{ paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormGroup>
                
                <FormGroup>
                  <Label>Mật khẩu mới</Label>
                  <div style={{ position: 'relative' }}>
                    <Input
                      type={showPassword.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Nhập mật khẩu mới"
                      style={{ paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormGroup>
                
                <FormGroup>
                  <Label>Xác nhận mật khẩu mới</Label>
                  <div style={{ position: 'relative' }}>
                    <Input
                      type={showPassword.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      placeholder="Xác nhận mật khẩu mới"
                      style={{ paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormGroup>
                
                <Button onClick={handlePasswordChange} style={{ width: '100%', marginTop: '8px' }}>
                  <Key style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Đổi mật khẩu
                </Button>
              </PasswordForm>
              
              {showSavedMessage && (
                <InfoBox 
                  $type="success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: '16px' }}
                >
                  <div className="info-header">
                    <Check />
                    <h4>Thành công!</h4>
                  </div>
                  <p>Đã lưu thay đổi thành công!</p>
                </InfoBox>
              )}
              
              <InfoBox 
                $type="info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ marginTop: '16px', cursor: 'pointer' }}
              >
                <div className="info-header">
                  <Shield />
                  <h4>Xác thực hai yếu tố (2FA)</h4>
                </div>
                <p>Tăng cường bảo mật tài khoản bằng xác thực hai yếu tố</p>
              </InfoBox>
            </Card>

            {/* Stats Overview */}
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="card-header">
                <h2><User />Tổng quan</h2>
              </div>
              
              <QuickStats>
                <StatItem $color="#667eea">
                  <div className="stat-value">8</div>
                  <div className="stat-label">Cài đặt kích hoạt</div>
                </StatItem>
                <StatItem $color="#10B981">
                  <div className="stat-value">100%</div>
                  <div className="stat-label">Bảo mật</div>
                </StatItem>
              </QuickStats>
              
              <InfoBox 
                $type="info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="info-header">
                  <Shield />
                  <h4>Mức độ bảo mật: Cao</h4>
                </div>
                <p>Tài khoản của bạn được bảo vệ tốt với các cài đặt bảo mật hiện tại.</p>
              </InfoBox>
            </Card>

            {/* Danger Zone */}
            <DangerZone
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="card-header">
                <h2 style={{ color: '#DC2626' }}><AlertTriangle />Vùng nguy hiểm</h2>
              </div>
              
              <InfoBox 
                $type="warning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="info-header">
                  <AlertTriangle />
                  <h4>Xóa tài khoản</h4>
                </div>
                <p>Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu. Hành động này không thể hoàn tác!</p>
              </InfoBox>
              
              <Button 
                variant="outline" 
                style={{ 
                  width: '100%',
                  marginTop: '16px',
                  borderColor: '#DC2626', 
                  color: '#DC2626',
                  background: 'transparent'
                }}
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) {
                    console.log('Deleting account...');
                  }
                }}
              >
                <Trash2 style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                Xóa tài khoản
              </Button>
            </DangerZone>
          </Sidebar>
        </ContentGrid>
      </SettingsContainer>
    </DashboardLayout>
  );
}

export default CandidateSettings;
