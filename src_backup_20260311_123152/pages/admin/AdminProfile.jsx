import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
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
  Save,
  X,
  Edit3
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
  background: ${props => props.theme.colors.bgLight};
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
  background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
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

const DeleteAvatarButton = styled.button`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 36px;
  height: 36px;
  background: #EF4444;
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.2s;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    transform: scale(1.1);
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
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  overflow: hidden;
`;

const NavItem = styled.button`
  width: 100%;
  padding: 1rem 1.25rem;
  background: ${props => props.$active ? props.theme.colors.bgDark : props.theme.colors.bgLight};
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
    background: ${props => props.theme.colors.bgDark};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const Section = styled.div`
  background: ${props => props.theme.colors.bgLight};
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
  const { language, t } = useLanguage();
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('adminProfileImage') || null;
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const defaultProfileData = {
    fullName: 'Root',
    email: 'admin@oppo.vn',
    phone: '0909 123 456',
    address: 'Hồ Chí Minh, Việt Nam',
    bio: language === 'vi' ? 'Quản trị viên hệ thống OppoReview' : 'OppoReview System Administrator'
  };

  const [profileData, setProfileData] = useState(() => {
    const savedData = localStorage.getItem('adminProfile');
    return savedData ? JSON.parse(savedData) : defaultProfileData;
  });
  
  const [originalProfileData, setOriginalProfileData] = useState(profileData);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setProfileImage(compressedBase64);
          localStorage.setItem('adminProfileImage', compressedBase64);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    localStorage.removeItem('adminProfileImage');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  
  const handleSave = () => {
    localStorage.setItem('adminProfile', JSON.stringify(profileData));
    setOriginalProfileData(profileData);
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'profile':
        return (
          <Section>
            <SectionTitle>
              <User size={24} />
              {t.profile.personalInfo}
            </SectionTitle>
            <form onSubmit={handleSubmit}>
              <FormGrid>
                <FormGroup>
                  <Label>{t.profile.fullName}</Label>
                  <Input 
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    placeholder={language === 'vi' ? 'Nhập họ và tên' : 'Enter full name'}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{t.profile.email}</Label>
                  <Input 
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{t.profile.phone}</Label>
                  <Input 
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    placeholder="0909 123 456"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{t.profile.location}</Label>
                  <Input 
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    placeholder={language === 'vi' ? 'Nhập địa chỉ' : 'Enter address'}
                  />
                </FormGroup>

                <FormGroup className="full-width">
                  <Label>{t.profile.bio}</Label>
                  <TextArea 
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    placeholder={language === 'vi' ? 'Viết vài dòng về bạn...' : 'Write a few lines about yourself...'}
                    rows={4}
                  />
                </FormGroup>
              </FormGrid>

              <ButtonGroup>
                <Button type="button" $variant="primary" onClick={handleSave}>
                  <Save size={18} />
                  {language === 'vi' ? 'Lưu thay đổi' : 'Save changes'}
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
              {language === 'vi' ? 'Bảo Mật' : 'Security'}
            </SectionTitle>
            <form>
              <FormGroup>
                <Label>{language === 'vi' ? 'Mật khẩu hiện tại' : 'Current Password'}</Label>
                <Input type="password" placeholder={language === 'vi' ? 'Nhập mật khẩu hiện tại' : 'Enter current password'} />
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Mật khẩu mới' : 'New Password'}</Label>
                <Input type="password" placeholder={language === 'vi' ? 'Nhập mật khẩu mới' : 'Enter new password'} />
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Xác nhận mật khẩu mới' : 'Confirm New Password'}</Label>
                <Input type="password" placeholder={language === 'vi' ? 'Nhập lại mật khẩu mới' : 'Re-enter new password'} />
              </FormGroup>

              <SettingItem>
                <SettingInfo>
                  <SettingLabel>{language === 'vi' ? 'Xác thực hai yếu tố (2FA)' : 'Two-Factor Authentication (2FA)'}</SettingLabel>
                  <SettingDescription>{language === 'vi' ? 'Tăng cường bảo mật cho tài khoản của bạn' : 'Enhance your account security'}</SettingDescription>
                </SettingInfo>
                <Button $variant="primary">{language === 'vi' ? 'Bật 2FA' : 'Enable 2FA'}</Button>
              </SettingItem>

              <ButtonGroup>
                <Button type="button" $variant="outline">
                  {language === 'vi' ? 'Hủy bỏ' : 'Cancel'}
                </Button>
                <Button type="submit" $variant="primary">
                  <Lock size={18} />
                  {language === 'vi' ? 'Đổi mật khẩu' : 'Change Password'}
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
              {t.settings.notifications}
            </SectionTitle>
            
            <SettingItem>
              <SettingInfo>
                <SettingLabel>{t.settings.emailNotifications}</SettingLabel>
                <SettingDescription>{t.settings.emailNotificationsDesc}</SettingDescription>
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
                <SettingLabel>{language === 'vi' ? 'Thông báo Push' : 'Push Notifications'}</SettingLabel>
                <SettingDescription>{language === 'vi' ? 'Nhận thông báo đẩy trên trình duyệt' : 'Receive push notifications on browser'}</SettingDescription>
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
                <SettingLabel>{language === 'vi' ? 'Thông báo SMS' : 'SMS Notifications'}</SettingLabel>
                <SettingDescription>{language === 'vi' ? 'Nhận thông báo qua tin nhắn' : 'Receive notifications via SMS'}</SettingDescription>
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
                {language === 'vi' ? 'Lưu cài đặt' : 'Save Settings'}
              </Button>
            </ButtonGroup>
          </Section>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout role="admin" key={language}>
      <PageContainer>
        <PageHeader>
          <div>
            <Title>{language === 'vi' ? 'Hồ Sơ Admin' : 'Admin Profile'}</Title>
            <Subtitle>{language === 'vi' ? 'Quản lý thông tin cá nhân và cài đặt tài khoản' : 'Manage personal information and account settings'}</Subtitle>
          </div>
        </PageHeader>

        <Grid>
          <Sidebar>
            <ProfileCard>
              <AvatarWrapper>
                <Avatar>
                  {profileImage ? (
                    <img src={profileImage} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    'AD'
                  )}
                </Avatar>
                {profileImage && (
                  <DeleteAvatarButton onClick={handleDeleteImage}>
                    <X />
                  </DeleteAvatarButton>
                )}
                <AvatarUpload>
                  <Camera size={18} />
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
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
                {language === 'vi' ? 'Thông tin cá nhân' : 'Personal Info'}
              </NavItem>
              <NavItem 
                $active={activeSection === 'security'}
                onClick={() => setActiveSection('security')}
              >
                <Shield size={20} />
                {language === 'vi' ? 'Bảo mật' : 'Security'}
              </NavItem>
              <NavItem 
                $active={activeSection === 'notifications'}
                onClick={() => setActiveSection('notifications')}
              >
                <Bell size={20} />
                {language === 'vi' ? 'Thông báo' : 'Notifications'}
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
