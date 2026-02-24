import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Bell, Mail, MessageSquare, Globe, Moon, Sun, Lock, Shield, FileText, Trash2 } from 'lucide-react';
import { Button, FormGroup, Label, Input } from '../../components/FormElements';

const SettingsContainer = styled.div`
  max-width: 900px;
`;

const SettingsCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: ${props => props.theme.colors.text};
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const SettingInfo = styled.div`
  flex: 1;
  margin-right: 20px;
  
  h3 {
    font-size: 16px;
    font-weight: 500;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    
    span {
      color: ${props => props.theme.colors.text};
    }
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.5;
  }
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + span {
      background: ${props => props.theme.colors.primary};
    }
    
    &:checked + span:before {
      transform: translateX(22px);
    }
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.colors.border};
    border-radius: 28px;
    transition: 0.3s;
    
    &:before {
      position: absolute;
      content: '';
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background: white;
      border-radius: 50%;
      transition: 0.3s;
    }
  }
`;

const LanguageOptions = styled.div`
  display: flex;
  gap: 12px;
`;

const LanguageButton = styled.button`
  padding: 8px 20px;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : 'white'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    background: ${props => props.$active ? props.theme.colors.primaryDark : props.theme.colors.bgDark};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const CandidateSettings = () => {
  // Giả lập state language để UI hoạt động nhưng không thực sự thay đổi ngôn ngữ
  const [language, setLanguage] = useState('vi');
  const changeLanguage = (lang) => setLanguage(lang);
  
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveSettings = () => {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    // In real app, this would update theme context
    alert(darkMode ? 'Light mode enabled' : 'Dark mode enabled');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters!');
      return;
    }
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <SettingsContainer>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>Cài Đặt</h1>

        <SettingsCard>
          <SectionTitle>Cài Đặt Tài Khoản</SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>
                <Globe size={18} style={{ marginRight: '8px', flexShrink: 0 }} />
                <span>Ngôn Ngữ</span>
              </h3>
              <p>Chọn ngôn ngữ hiển thị</p>
            </SettingInfo>
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
          </SettingItem>
          
          <SettingItem>
            <SettingInfo>
              <h3>
                {darkMode ? (
                  <Moon size={18} style={{ marginRight: '8px', flexShrink: 0 }} />
                ) : (
                  <Sun size={18} style={{ marginRight: '8px', flexShrink: 0 }} />
                )}
                <span>Chế Độ Tối</span>
              </h3>
              <p>Chuyển đổi giữa giao diện sáng và tối</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" checked={darkMode} onChange={handleDarkModeToggle} />
              <span></span>
            </Toggle>
          </SettingItem>
        </SettingsCard>

        <SettingsCard>
          <SectionTitle>Thông Báo</SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>Thông Báo Email</h3>
              <p>Nhận thông báo qua email</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" defaultChecked />
              <span></span>
            </Toggle>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>Cập Nhật Hồ Sơ</h3>
              <p>Thông báo về trạng thái hồ sơ</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" defaultChecked />
              <span></span>
            </Toggle>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>Đề Xuất Mới</h3>
              <p>Thông báo về công việc phù hợp</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" defaultChecked />
              <span></span>
            </Toggle>
          </SettingItem>
        </SettingsCard>

        <SettingsCard>
          <SectionTitle>Quyền Riêng Tư</SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>Hiển Thị Hồ Sơ</h3>
              <p>Cho phép nhà tuyển dụng xem hồ sơ</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" defaultChecked />
              <span></span>
            </Toggle>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>Hiển Thị Email</h3>
              <p>Hiển thị email trong hồ sơ công khai</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" />
              <span></span>
            </Toggle>
          </SettingItem>
          
          <SettingItem>
            <SettingInfo>
              <h3>Hiển Thị Số Điện Thoại</h3>
              <p>Hiển thị số điện thoại trong hồ sơ</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" />
              <span></span>
            </Toggle>
          </SettingItem>
        </SettingsCard>

        <SettingsCard>
          <SectionTitle>
            <Lock style={{ display: 'inline', marginRight: '8px', width: '20px', height: '20px', verticalAlign: 'middle' }} />
            Đăng Nhập & Bảo Mật
          </SectionTitle>
          
          <SettingItem style={{ display: 'block', paddingBottom: '24px' }}>
            <SettingInfo style={{ marginBottom: '16px' }}>
              <h3>Đổi Mật Khẩu</h3>
              <p>Cập nhật mật khẩu thường xuyên để bảo mật tài khoản</p>
            </SettingInfo>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
              <Input 
                type="password" 
                placeholder="Mật khẩu hiện tại"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
              <Input 
                type="password" 
                placeholder="Mật khẩu mới"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
              <Input 
                type="password" 
                placeholder="Xác nhận mật khẩu"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
              <Button $variant="primary" onClick={handlePasswordChange}>
                Cập Nhật Mật Khẩu
              </Button>
            </div>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>Xác Thực Hai Yếu Tố</h3>
              <p>Thêm lớp bảo mật cho tài khoản của bạn</p>
            </SettingInfo>
            <Button $variant="secondary">Bật 2FA</Button>
          </SettingItem>
        </SettingsCard>

        <SettingsCard>
          <SectionTitle>
            <Shield style={{ display: 'inline', marginRight: '8px', width: '20px', height: '20px', verticalAlign: 'middle' }} />
            Chính Sách & Điều Khoản
          </SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>
                <FileText style={{ display: 'inline', marginRight: '8px', width: '18px', height: '18px', verticalAlign: 'middle' }} />
                Điều Khoản Dịch Vụ
              </h3>
              <p>Đọc các điều khoản và điều kiện</p>
            </SettingInfo>
            <Button $variant="ghost">Xem Điều Khoản</Button>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>
                <Shield style={{ display: 'inline', marginRight: '8px', width: '18px', height: '18px', verticalAlign: 'middle' }} />
                Chính Sách Bảo Mật
              </h3>
              <p>Tìm hiểu cách chúng tôi bảo vệ dữ liệu của bạn</p>
            </SettingInfo>
            <Button $variant="ghost">Xem Chính Sách</Button>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>
                <FileText style={{ display: 'inline', marginRight: '8px', width: '18px', height: '18px', verticalAlign: 'middle' }} />
                Chính Sách Cookie
              </h3>
              <p>Hiểu về việc sử dụng cookie của chúng tôi</p>
            </SettingInfo>
            <Button $variant="ghost">Xem Chính Sách</Button>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>Tải Dữ Liệu</h3>
              <p>Tải xuống bản sao dữ liệu cá nhân của bạn</p>
            </SettingInfo>
            <Button $variant="secondary">Tải Dữ Liệu</Button>
          </SettingItem>
        </SettingsCard>

        <SettingsCard>
          <SectionTitle>Vùng Nguy Hiểm</SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>Xóa Tài Khoản</h3>
              <p>Xóa vĩnh viễn tài khoản của bạn</p>
            </SettingInfo>
            <Button $variant="danger">Xóa Tài Khoản</Button>
          </SettingItem>
        </SettingsCard>
        
        {showSavedMessage && (
          <div style={{ 
            padding: '16px', 
            background: '#10B981', 
            color: 'white', 
            borderRadius: '8px',
            marginTop: '16px',
            textAlign: 'center'
          }}>
            Đã lưu thay đổi thành công!
          </div>
        )}
      </SettingsContainer>
    </DashboardLayout>
  );
};

export default CandidateSettings;
