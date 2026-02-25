import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { Input, Label, Button, FormGroup } from '../../components/FormElements';
import { 
  Settings as SettingsIcon,
  Lock, 
  Bell, 
  FileText, 
  Palette, 
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
  background: white;
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
  background: ${props => props.$active ? props.theme.colors.primaryLight : 'white'};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight};
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

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 15px;
  color: ${props => props.theme.colors.text};
  background: white;
  transition: all ${props => props.theme.transitions.fast};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}14;
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
  // Giả lập state language để UI hoạt động nhưng không thực sự thay đổi ngôn ngữ
  const [language, setLanguage] = useState('vi');
  const changeLanguage = (lang) => setLanguage(lang);
  
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    applications: true,
    messages: true,
    system: false
  });
  const [selectedTheme, setSelectedTheme] = useState('default');
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
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) {
      console.log('Delete account');
    }
  };

  const handleDeactivateAccount = () => {
    if (window.confirm('Bạn có chắc chắn muốn vô hiệu hóa tài khoản?')) {
      console.log('Deactivate account');
    }
  };

  return (
    <DashboardLayout role="employer">
      <PageContainer>
        <PageHeader>
          <h1>Cài đặt</h1>
          <p>Quản lý cài đặt tài khoản và tùy chọn của bạn</p>
        </PageHeader>

        <SettingsGrid>
          {/* Appearance & Language */}
          <SettingCard>
            <SettingHeader>
              <div className="icon">
                <Globe />
              </div>
              <div className="info">
                <h3>Tùy chỉnh hiển thị</h3>
                <p>Ngôn ngữ và giao diện</p>
              </div>
            </SettingHeader>

            <SettingRow>
              <div>
                <div className="label">Ngôn ngữ</div>
                <div className="description">Chọn ngôn ngữ hiển thị</div>
              </div>
              <LanguageOptions>
                <LanguageButton
                  $active={language === 'vi'}
                  onClick={() => changeLanguage('vi')}
                >
                  Tiếng Việt
                </LanguageButton>
                <LanguageButton
                  $active={language === 'en'}
                  onClick={() => changeLanguage('en')}
                >
                  English
                </LanguageButton>
              </LanguageOptions>
            </SettingRow>

            <SettingRow>
              <div>
                <div className="label">Chế độ tối</div>
                <div className="description">Chuyển sang giao diện tối để dễ nhìn hơn</div>
              </div>
              <ToggleSwitch>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                <span></span>
              </ToggleSwitch>
            </SettingRow>
          </SettingCard>

          {/* Themes */}
          <SettingCard>
            <SettingHeader>
              <div className="icon">
                <Palette />
              </div>
              <div className="info">
                <h3>Chủ đề</h3>
                <p>Chọn màu sắc chủ đạo</p>
              </div>
            </SettingHeader>

            <FormGroup>
              <Label>Chủ đề màu</Label>
              <Select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
                <option value="default">Mặc định (Xanh dương)</option>
                <option value="green">Xanh lá</option>
                <option value="purple">Tím</option>
                <option value="orange">Cam</option>
              </Select>
            </FormGroup>
          </SettingCard>

          {/* Security */}
          <SettingCard>
            <SettingHeader>
              <div className="icon">
                <Lock />
              </div>
              <div className="info">
                <h3>Bảo mật</h3>
                <p>Thay đổi mật khẩu và cài đặt bảo mật</p>
              </div>
            </SettingHeader>

            <form onSubmit={handlePasswordChange}>
              <FormGroup>
                <Label>Mật khẩu hiện tại</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </FormGroup>

              <FormGroup>
                <Label>Mật khẩu mới</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Nhập mật khẩu mới"
                />
              </FormGroup>

              <FormGroup>
                <Label>Xác nhận mật khẩu mới</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </FormGroup>

              <Button type="submit" variant="primary">
                <Lock size={18} />
                Đổi mật khẩu
              </Button>
            </form>
          </SettingCard>

          {/* Notifications */}
          <SettingCard>
            <SettingHeader>
              <div className="icon">
                <Bell />
              </div>
              <div className="info">
                <h3>Thông báo</h3>
                <p>Quản lý thông báo nhận được</p>
              </div>
            </SettingHeader>

            <SettingRow>
              <div>
                <div className="label">Đơn ứng tuyển mới</div>
                <div className="description">Nhận thông báo khi có ứng viên nộp đơn</div>
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
                <div className="label">Tin nhắn</div>
                <div className="description">Nhận thông báo tin nhắn mới</div>
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
                <div className="label">Thông báo hệ thống</div>
                <div className="description">Nhận thông báo về cập nhật và bảo trì</div>
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
                <h3>Chính sách & Điều khoản</h3>
                <p>Xem các chính sách và điều khoản sử dụng</p>
              </div>
            </SettingHeader>

            <ButtonGroup>
              <Button variant="outline">
                <FileText size={18} />
                Điều khoản dịch vụ
              </Button>
              <Button variant="outline">
                <Shield size={18} />
                Chính sách bảo mật
              </Button>
            </ButtonGroup>
          </SettingCard>

          {/* Danger Zone */}
          <SettingCard>
            <DangerZone>
              <h4>Vùng nguy hiểm</h4>
              <p>Các hành động này không thể hoàn tác. Vui lòng cân nhắc kỹ trước khi thực hiện.</p>
              
              <ButtonGroup>
                <Button variant="outline" onClick={handleDeactivateAccount}>
                  <Trash2 size={18} />
                  Vô hiệu hóa tài khoản
                </Button>
                <Button variant="danger" onClick={handleDeleteAccount}>
                  <Trash2 size={18} />
                  Xóa tài khoản vĩnh viễn
                </Button>
              </ButtonGroup>
            </DangerZone>
          </SettingCard>
        </SettingsGrid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default EmployerSettings;
