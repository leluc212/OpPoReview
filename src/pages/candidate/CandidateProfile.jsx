import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Button, Input, TextArea, FormGroup, Label } from '../../components/FormElements';
import { Upload, Save } from 'lucide-react';

const ProfileContainer = styled.div`
  max-width: 900px;
`;

const ProfileCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 40px;
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: ${props => props.theme.colors.text};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  & > div:last-child {
    grid-column: 1 / -1;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: 600;
`;

const CandidateProfile = () => {
  const [formData, setFormData] = useState({
    fullName: 'Lực Thứ Hai',
    email: 'lucthuhai@gmail.com',
    phone: '+84 379784509',
    location: 'Thủ Đức, TP.HCM',
    title: 'Senior React Developer',
    bio: 'Kinh nghiệm 20 năm làm IT',
    linkedin: 'linkedin.com/in/lucthuhai',
    github: 'github.com/lucthuhai',
    website: 'leluc.com'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log('Saving profile:', formData);
    alert('Đã lưu thay đổi thành công!');
  };

  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <ProfileContainer>
        <ProfileCard>
          <SectionTitle>Thông Tin Cá Nhân</SectionTitle>
          
          <AvatarSection>
            <Avatar>JD</Avatar>
            <div>
              <Button $variant="primary">
                <Upload /> Tải Ảnh
              </Button>
              <p style={{ fontSize: '14px', color: '#64748B', marginTop: '8px' }}>
                JPG, PNG hoặc GIF. Tối đa 5MB
              </p>
            </div>
          </AvatarSection>

          <FormGrid>
            <FormGroup>
              <Label>Họ Và Tên</Label>
              <Input name="fullName" value={formData.fullName} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>Số Điện Thoại</Label>
              <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>Địa Điểm</Label>
              <Input name="location" value={formData.location} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>Chức Danh Nghề Nghiệp</Label>
              <Input name="title" value={formData.title} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>Giới Thiệu</Label>
              <TextArea name="bio" value={formData.bio} onChange={handleChange} style={{ gridColumn: '1 / -1' }} />
            </FormGroup>
          </FormGrid>
        </ProfileCard>

        <ProfileCard>
          <SectionTitle>Liên Kết Mạng Xã Hội</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>LinkedIn</Label>
              <Input name="linkedin" value={formData.linkedin} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>GitHub</Label>
              <Input name="github" value={formData.github} onChange={handleChange} />
            </FormGroup>

            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Website</Label>
              <Input name="website" value={formData.website} onChange={handleChange} />
            </FormGroup>
          </FormGrid>
        </ProfileCard>

        <Button $variant="primary" $size="large" onClick={handleSave}>
          <Save /> Lưu Thay Đổi
        </Button>
      </ProfileContainer>
    </DashboardLayout>
  );
};

export default CandidateProfile;
