import { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  User, 
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  Bell,
  Globe,
  Moon,
  Sun,
  Camera,
  Save
} from 'lucide-react';
import { Input, TextArea, Label, Button } from '../../components/FormElements';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div``;

const MainContent = styled.div``;

const ProfileCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
`;

const AvatarUpload = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  input {
    display: none;
  }
`;

const ProfileName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const ProfileRole = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const ProfileBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => `${props.theme.colors.primary}15`};
  color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.85rem;
  font-weight: 500;
`;

const NavList = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  overflow: hidden;
`;

const NavItem = styled.button`
  width: 100%;
  padding: 1rem 1.25rem;
  background: ${props => props.$active ? props.theme.colors.background : 'white'};
  border: none;
  border-left: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${props => props.$active ? '600' : '500'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const Section = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const SettingDescription = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;

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
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: ${props => props.theme.colors.primary};
  }

  input:checked + span:before {
    transform: translateX(24px);
  }
`;

const ThemeOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ThemeOption = styled.div`
  padding: 1rem;
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ThemeIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const AdminProfile = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const [profileData, setProfileData] = useState({
    fullName: 'Admin',
    email: 'admin@oppo.vn',
    phone: '0909 123 456',
    address: 'Hà Nội, Việt Nam',
    bio: 'Quản trị viên hệ thống OppoReview'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationToggle = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'profile':
        return (
          <Section>
            <SectionTitle>
              <User size={24} />
              Thông Tin Cá Nhân
            </SectionTitle>
            <form onSubmit={handleSubmit}>
              <FormGrid>
                <FormGroup>
                  <Label>Họ và tên</Label>
                  <Input 
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input 
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Số điện thoại</Label>
                  <Input 
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    placeholder="0909 123 456"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Địa chỉ</Label>
                  <Input 
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ"
                  />
                </FormGroup>

                <FormGroup className="full-width">
                  <Label>Giới thiệu</Label>
                  <TextArea 
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    placeholder="Viết vài dòng về bạn..."
                    rows={4}
                  />
                </FormGroup>
              </FormGrid>

              <ButtonGroup>
                <Button type="button" $variant="outline">
                  Hủy bỏ
                </Button>
                <Button type="submit" $variant="primary">
                  <Save size={18} />
                  Lưu thay đổi
                </Button>
              </ButtonGroup>
            </form>
          </Section>
        );

      case 'security':
        return (
          <Section>
            <SectionTitle>
              <Shield size={24} />
              Bảo Mật
            </SectionTitle>
            <form>
              <FormGroup>
                <Label>Mật khẩu hiện tại</Label>
                <Input type="password" placeholder="Nhập mật khẩu hiện tại" />
              </FormGroup>

              <FormGroup>
                <Label>Mật khẩu mới</Label>
                <Input type="password" placeholder="Nhập mật khẩu mới" />
              </FormGroup>

              <FormGroup>
                <Label>Xác nhận mật khẩu mới</Label>
                <Input type="password" placeholder="Nhập lại mật khẩu mới" />
              </FormGroup>

              <SettingItem>
                <SettingInfo>
                  <SettingLabel>Xác thực hai yếu tố (2FA)</SettingLabel>
                  <SettingDescription>Tăng cường bảo mật cho tài khoản của bạn</SettingDescription>
                </SettingInfo>
                <Button $variant="primary">Bật 2FA</Button>
              </SettingItem>

              <ButtonGroup>
                <Button type="button" $variant="outline">
                  Hủy bỏ
                </Button>
                <Button type="submit" $variant="primary">
                  <Lock size={18} />
                  Đổi mật khẩu
                </Button>
              </ButtonGroup>
            </form>
          </Section>
        );

      case 'notifications':
        return (
          <Section>
            <SectionTitle>
              <Bell size={24} />
              Thông Báo
            </SectionTitle>
            
            <SettingItem>
              <SettingInfo>
                <SettingLabel>Thông báo Email</SettingLabel>
                <SettingDescription>Nhận thông báo qua email</SettingDescription>
              </SettingInfo>
              <ToggleSwitch>
                <input 
                  type="checkbox" 
                  checked={notifications.email}
                  onChange={() => handleNotificationToggle('email')}
                />
                <span></span>
              </ToggleSwitch>
            </SettingItem>

            <SettingItem>
              <SettingInfo>
                <SettingLabel>Thông báo Push</SettingLabel>
                <SettingDescription>Nhận thông báo đẩy trên trình duyệt</SettingDescription>
              </SettingInfo>
              <ToggleSwitch>
                <input 
                  type="checkbox" 
                  checked={notifications.push}
                  onChange={() => handleNotificationToggle('push')}
                />
                <span></span>
              </ToggleSwitch>
            </SettingItem>

            <SettingItem>
              <SettingInfo>
                <SettingLabel>Thông báo SMS</SettingLabel>
                <SettingDescription>Nhận thông báo qua tin nhắn</SettingDescription>
              </SettingInfo>
              <ToggleSwitch>
                <input 
                  type="checkbox" 
                  checked={notifications.sms}
                  onChange={() => handleNotificationToggle('sms')}
                />
                <span></span>
              </ToggleSwitch>
            </SettingItem>

            <ButtonGroup>
              <Button $variant="primary">
                <Save size={18} />
                Lưu cài đặt
              </Button>
            </ButtonGroup>
          </Section>
        );

      case 'preferences':
        return (
          <Section>
            <SectionTitle>
              <Globe size={24} />
              Tùy Chỉnh
            </SectionTitle>

            <FormGroup>
              <Label>Ngôn ngữ</Label>
              <select style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}>
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </FormGroup>

            <FormGroup>
              <Label>Giao diện</Label>
              <ThemeOptions>
                <ThemeOption $active={!isDarkMode} onClick={() => setIsDarkMode(false)}>
                  <ThemeIcon $color="#f59e0b">
                    <Sun size={20} />
                  </ThemeIcon>
                  <div>
                    <div style={{ fontWeight: 600 }}>Sáng</div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Giao diện sáng</div>
                  </div>
                </ThemeOption>

                <ThemeOption $active={isDarkMode} onClick={() => setIsDarkMode(true)}>
                  <ThemeIcon $color="#6366f1">
                    <Moon size={20} />
                  </ThemeIcon>
                  <div>
                    <div style={{ fontWeight: 600 }}>Tối</div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Giao diện tối</div>
                  </div>
                </ThemeOption>
              </ThemeOptions>
            </FormGroup>

            <ButtonGroup>
              <Button $variant="primary">
                <Save size={18} />
                Lưu cài đặt
              </Button>
            </ButtonGroup>
          </Section>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout role="admin">
      <PageContainer>
        <PageHeader>
          <Title>Hồ Sơ Admin</Title>
          <Subtitle>Quản lý thông tin cá nhân và cài đặt tài khoản</Subtitle>
        </PageHeader>

        <Grid>
          <Sidebar>
            <ProfileCard>
              <AvatarWrapper>
                <Avatar>AD</Avatar>
                <AvatarUpload>
                  <Camera size={18} />
                  <input type="file" accept="image/*" />
                </AvatarUpload>
              </AvatarWrapper>
              <ProfileName>{profileData.fullName}</ProfileName>
              <ProfileRole>{profileData.email}</ProfileRole>
              <ProfileBadge>
                <Shield size={16} />
                Super Admin
              </ProfileBadge>
            </ProfileCard>

            <NavList>
              <NavItem 
                $active={activeSection === 'profile'}
                onClick={() => setActiveSection('profile')}
              >
                <User size={20} />
                Thông tin cá nhân
              </NavItem>
              <NavItem 
                $active={activeSection === 'security'}
                onClick={() => setActiveSection('security')}
              >
                <Shield size={20} />
                Bảo mật
              </NavItem>
              <NavItem 
                $active={activeSection === 'notifications'}
                onClick={() => setActiveSection('notifications')}
              >
                <Bell size={20} />
                Thông báo
              </NavItem>
              <NavItem 
                $active={activeSection === 'preferences'}
                onClick={() => setActiveSection('preferences')}
              >
                <Globe size={20} />
                Tùy chỉnh
              </NavItem>
            </NavList>
          </Sidebar>

          <MainContent>
            {renderContent()}
          </MainContent>
        </Grid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default AdminProfile;
