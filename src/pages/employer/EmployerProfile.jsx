import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { Input, TextArea, Button, Label, FormGroup } from '../../components/FormElements';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Users, 
  FileText, 
  Upload,
  Camera,
  Save,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ProfileContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 15px;
    font-weight: 500;
  }
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SidePanel = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CompanyLogoCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.15);
    border-color: ${props => props.theme.colors.primary}40;
  }
`;

const LogoUploadArea = styled.div`
  width: 160px;
  height: 160px;
  margin: 0 auto 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(30, 64, 175, 0.3);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadButton = styled(motion.label)`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.theme.colors.bgLight};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.primary};
  }
  
  input {
    display: none;
  }
`;

const DeleteLogoButton = styled(motion.button)`
  position: absolute;
  bottom: 8px;
  left: 8px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #EF4444;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const CompanyName = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const CompanyType = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
`;

const StatsCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 16px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(30, 64, 175, 0.3);
    
    .value, .label {
      color: white;
    }
  }
  
  .value {
    font-size: 24px;
    font-weight: 900;
    color: ${props => props.theme.colors.text};
    display: block;
    margin-bottom: 4px;
    transition: color 0.3s ease;
  }
  
  .label {
    font-size: 12px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: color 0.3s ease;
  }
`;

const MainPanel = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.theme.colors.primary};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$columns || '1fr'};
  gap: 20px;
  margin-bottom: 24px;
`;

const InputWrapper = styled.div`
  position: relative;
  
  svg.input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 22px;
    height: 22px;
    color: ${props => props.theme.colors.primary};
    opacity: 0.9;
    pointer-events: none;
  }
  
  input, textarea {
    padding-left: 44px;
  }
`;

const SaveButton = styled(motion.button)`
  padding: 14px 32px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
  color: white;
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  box-shadow: 0 8px 24px rgba(30, 64, 175, 0.35);
  transition: all 0.3s ease;
  cursor: pointer;
  margin-top: 24px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(30, 64, 175, 0.45);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SuccessMessage = styled(motion.div)`
  padding: 16px 20px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const getInitialFormData = (language) => ({
  companyName: language === 'vi' ? 'Công Ty TNHH Một Mình Tui' : 'Solo Company LLC',
  email: 'contact@abcxyz.com',
  phone: '0379784509',
  address: language === 'vi' ? 'Quận 1, TP.HCM' : 'District 1, HCMC',
  website: 'https://abcxyz.com',
  description: language === 'vi' ? 'Công ty chuyên về phát triển phần mềm và giải pháp công nghệ.' : 'A company specializing in software development and technology solutions.',
  industry: language === 'vi' ? 'Công nghệ thông tin' : 'Information Technology',
  size: language === 'vi' ? '50-100 nhân viên' : '50-100 employees',
  foundedYear: '2015'
});

const EmployerProfile = () => {
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(() => {
    return localStorage.getItem('companyLogo') || null;
  });
  
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('employerProfile');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Error parsing saved data:', e);
        return getInitialFormData(language);
      }
    }
    return getInitialFormData(language);
  });
  
  const [originalFormData, setOriginalFormData] = useState(formData);

  useEffect(() => {
    const savedData = localStorage.getItem('employerProfile');
    if (!savedData) {
      const initialData = getInitialFormData(language);
      setFormData(initialData);
      setOriginalFormData(initialData);
      // Save initial data to localStorage so it's always available
      localStorage.setItem('employerProfile', JSON.stringify(initialData));
    }
  }, [language]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    localStorage.setItem('employerProfile', JSON.stringify(formData));
    setOriginalFormData(formData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setFormData(originalFormData);
    setIsEditing(false);
  };

  const handleLogoUpload = (e) => {
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
          setCompanyLogo(compressedBase64);
          localStorage.setItem('companyLogo', compressedBase64);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteLogo = () => {
    setCompanyLogo(null);
    localStorage.removeItem('companyLogo');
  };

  return (
    <DashboardLayout role="employer">
      <ProfileContainer>
        <PageHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>{language === 'vi' ? 'Hồ Sơ Công Ty' : 'Company Profile'}</h1>
              <p>{language === 'vi' ? 'Quản lý thông tin công ty' : 'Manage your company information'}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isEditing ? handleCancel : () => setIsEditing(true)}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: isEditing ? '#6B7280' : 'linear-gradient(135deg, #1e40af 0%, #1e40af 100%)',
                color: 'white',
                border: 'none',
                fontWeight: '700',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)'
              }}
            >
              <Edit3 size={18} />
              {isEditing ? (language === 'vi' ? 'Hủy' : 'Cancel') : (language === 'vi' ? 'Chỉnh Sửa' : 'Edit')}
            </motion.button>
          </div>
        </PageHeader>

        <ProfileContent>
          <SidePanel
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CompanyLogoCard>
              <LogoUploadArea>
                {companyLogo ? (
                  <img src={companyLogo} alt="Company Logo" />
                ) : (
                  <Building2 size={64} color="white" />
                )}
                {companyLogo && (
                  <DeleteLogoButton
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteLogo}
                  >
                    <X />
                  </DeleteLogoButton>
                )}
                <UploadButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera />
                  <input type="file" accept="image/*" onChange={handleLogoUpload} />
                </UploadButton>
              </LogoUploadArea>
              <CompanyName>{formData.companyName}</CompanyName>
              <CompanyType>{formData.industry}</CompanyType>
            </CompanyLogoCard>

            <StatsCard>
              <StatGrid>
                <StatItem>
                  <span className="value">24</span>
                  <span className="label">{language === 'vi' ? 'Tin tuyển dụng' : 'Job posts'}</span>
                </StatItem>
                <StatItem>
                  <span className="value">156</span>
                  <span className="label">{language === 'vi' ? 'Ứng viên' : 'Candidates'}</span>
                </StatItem>
                <StatItem>
                  <span className="value">89</span>
                  <span className="label">{language === 'vi' ? 'Đã tuyển' : 'Hired'}</span>
                </StatItem>
                <StatItem>
                  <span className="value">4.5</span>
                  <span className="label">{language === 'vi' ? 'Đánh giá' : 'Rating'}</span>
                </StatItem>
              </StatGrid>
            </StatsCard>
          </SidePanel>

          <MainPanel
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <form onSubmit={(e) => e.preventDefault()}>
              <SectionTitle>
                <Building2 />
                {language === 'vi' ? 'Thông Tin Công Ty' : 'Company Information'}
              </SectionTitle>

              <FormRow $columns="1fr">
                <FormGroup>
                  <Label htmlFor="companyName">{language === 'vi' ? 'Tên công ty' : 'Company name'}</Label>
                  <InputWrapper>
                    <Building2 className="input-icon" />
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder={language === 'vi' ? 'Nhập tên công ty' : 'Enter company name'}
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow $columns="1fr 1fr">
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <InputWrapper>
                    <Mail className="input-icon" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@company.com"
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="phone">{language === 'vi' ? 'Số điện thoại' : 'Phone number'}</Label>
                  <InputWrapper>
                    <Phone className="input-icon" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123456789"
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow $columns="1fr">
                <FormGroup>
                  <Label htmlFor="address">{language === 'vi' ? 'Địa chỉ' : 'Address'}</Label>
                  <InputWrapper>
                    <MapPin className="input-icon" />
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={language === 'vi' ? 'Địa chỉ công ty' : 'Company address'}
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow $columns="1fr">
                <FormGroup>
                  <Label htmlFor="website">Website</Label>
                  <InputWrapper>
                    <Globe className="input-icon" />
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow $columns="1fr 1fr 1fr">
                <FormGroup>
                  <Label htmlFor="industry">{language === 'vi' ? 'Lĩnh vực' : 'Industry'}</Label>
                  <InputWrapper>
                    <FileText className="input-icon" />
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      placeholder={language === 'vi' ? 'Lĩnh vực hoạt động' : 'Business industry'}
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="size">{language === 'vi' ? 'Quy mô' : 'Company size'}</Label>
                  <InputWrapper>
                    <Users className="input-icon" />
                    <Input
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      placeholder={language === 'vi' ? 'Số lượng nhân viên' : 'Number of employees'}
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="foundedYear">{language === 'vi' ? 'Năm thành lập' : 'Founded Year'}</Label>
                  <InputWrapper>
                    <FileText className="input-icon" />
                    <Input
                      id="foundedYear"
                      name="foundedYear"
                      value={formData.foundedYear}
                      onChange={handleChange}
                      placeholder="2015"
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow $columns="1fr">
                <FormGroup>
                  <Label htmlFor="description">{language === 'vi' ? 'Mô tả công ty' : 'Company description'}</Label>
                  <TextArea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={language === 'vi' ? 'Giới thiệu về công ty...' : 'Introduce your company...'}
                    rows={5}
                    disabled={!isEditing}
                  />
                </FormGroup>
              </FormRow>

              {isEditing && (
                <SaveButton
                  type="button"
                  onClick={handleSave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save />
                  {language === 'vi' ? 'Lưu Thay Đổi' : 'Save Changes'}
                </SaveButton>
              )}
            </form>
          </MainPanel>
        </ProfileContent>
      </ProfileContainer>
    </DashboardLayout>
  );
};

export default EmployerProfile;
