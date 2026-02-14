import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Button, Input, TextArea, FormGroup, Label } from '../../components/FormElements';
import { Upload, Save } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

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
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [formData, setFormData] = useState({
    fullName: 'Lực Thứ Hai',
    email: 'lucthuhai@gmail.com',
    phone: '+89 379784509',
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
    alert(t.settings.changesSaved);
  };

  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <ProfileContainer>
        <ProfileCard>
          <SectionTitle>{t.profile.personalInfo}</SectionTitle>
          
          <AvatarSection>
            <Avatar>JD</Avatar>
            <div>
              <Button $variant="primary">
                <Upload /> {t.profile.uploadPhoto}
              </Button>
              <p style={{ fontSize: '14px', color: '#64748B', marginTop: '8px' }}>
                {t.profile.uploadPhotoHelp}
              </p>
            </div>
          </AvatarSection>

          <FormGrid>
            <FormGroup>
              <Label>{t.profile.fullName}</Label>
              <Input name="fullName" value={formData.fullName} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>{t.profile.email}</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>{t.profile.phone}</Label>
              <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>{t.profile.location}</Label>
              <Input name="location" value={formData.location} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>{t.profile.professionalTitle}</Label>
              <Input name="title" value={formData.title} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>{t.profile.bio}</Label>
              <TextArea name="bio" value={formData.bio} onChange={handleChange} style={{ gridColumn: '1 / -1' }} />
            </FormGroup>
          </FormGrid>
        </ProfileCard>

        <ProfileCard>
          <SectionTitle>{t.profile.socialLinks}</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>{t.profile.linkedin}</Label>
              <Input name="linkedin" value={formData.linkedin} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>{t.profile.github}</Label>
              <Input name="github" value={formData.github} onChange={handleChange} />
            </FormGroup>

            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>{t.profile.website}</Label>
              <Input name="website" value={formData.website} onChange={handleChange} />
            </FormGroup>
          </FormGrid>
        </ProfileCard>

        <Button $variant="primary" $size="large" onClick={handleSave}>
          <Save /> {t.profile.saveChanges}
        </Button>
      </ProfileContainer>
    </DashboardLayout>
  );
};

export default CandidateProfile;
