import React, { useState } from 'react';
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
  Check
} from 'lucide-react';

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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: white;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
    border-color: ${props => props.theme.colors.primary}40;
  }
`;

const LogoUploadArea = styled.div`
  width: 160px;
  height: 160px;
  margin: 0 auto 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  
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
  background: white;
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
  background: white;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
    
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
  background: white;
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
    width: 18px;
    height: 18px;
    color: ${props => props.theme.colors.textLight};
    pointer-events: none;
  }
  
  input, textarea {
    padding-left: 44px;
  }
`;

const SaveButton = styled(motion.button)`
  padding: 14px 32px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
  transition: all 0.3s ease;
  cursor: pointer;
  margin-top: 24px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.45);
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

const EmployerProfile = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: 'Công Ty TNHH Một Mình Tui',
    email: 'contact@abcxyz.com',
    phone: '0379784509',
    address: 'Quận 1, TP.HCM',
    website: 'https://abcxyz.com',
    description: 'Công ty chuyên về phát triển phần mềm và giải pháp công nghệ.',
    industry: 'Công nghệ thông tin',
    size: '50-100 nhân viên',
    foundedYear: '2015'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Logo uploaded:', file);
      // Handle logo upload logic here
    }
  };

  return (
    <DashboardLayout role="employer">
      <ProfileContainer>
        <PageHeader>
          <h1>Hồ Sơ Công Ty</h1>
          <p>Quản lý thông tin công ty</p>
        </PageHeader>

        <ProfileContent>
          <SidePanel
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CompanyLogoCard>
              <LogoUploadArea>
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
                  <span className="label">Tin tuyển dụng</span>
                </StatItem>
                <StatItem>
                  <span className="value">156</span>
                  <span className="label">Ứng viên</span>
                </StatItem>
                <StatItem>
                  <span className="value">89</span>
                  <span className="label">Đã tuyển</span>
                </StatItem>
                <StatItem>
                  <span className="value">4.5</span>
                  <span className="label">Đánh giá</span>
                </StatItem>
              </StatGrid>
            </StatsCard>
          </SidePanel>

          <MainPanel
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <form onSubmit={handleSubmit}>
              <SectionTitle>
                <Building2 />
                Thông Tin Công Ty
              </SectionTitle>

              <FormRow $columns="1fr">
                <FormGroup>
                  <Label htmlFor="companyName">Tên công ty</Label>
                  <InputWrapper>
                    <Building2 className="input-icon" />
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Nhập tên công ty"
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
                    />
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <InputWrapper>
                    <Phone className="input-icon" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123456789"
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow $columns="1fr">
                <FormGroup>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <InputWrapper>
                    <MapPin className="input-icon" />
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Địa chỉ công ty"
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
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow $columns="1fr 1fr">
                <FormGroup>
                  <Label htmlFor="industry">Lĩnh vực</Label>
                  <InputWrapper>
                    <FileText className="input-icon" />
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      placeholder="Lĩnh vực hoạt động"
                    />
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="size">Quy mô</Label>
                  <InputWrapper>
                    <Users className="input-icon" />
                    <Input
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      placeholder="Số lượng nhân viên"
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow $columns="1fr">
                <FormGroup>
                  <Label htmlFor="description">Mô tả công ty</Label>
                  <TextArea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Giới thiệu về công ty..."
                    rows={5}
                  />
                </FormGroup>
              </FormRow>

              <SaveButton
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save />
                Lưu Thay Đổi
              </SaveButton>

              {showSuccess && (
                <SuccessMessage
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Check />
                  Cập nhật thông tin thành công!
                </SuccessMessage>
              )}
            </form>
          </MainPanel>
        </ProfileContent>
      </ProfileContainer>
    </DashboardLayout>
  );
};

export default EmployerProfile;
