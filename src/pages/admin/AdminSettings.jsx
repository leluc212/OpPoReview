import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Globe } from 'lucide-react';
import { Button } from '../../components/FormElements';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

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
`;

const SettingInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: 16px;
    font-weight: 500;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
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
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgLight};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const AdminSettings = () => {
  const { language, changeLanguage } = useLanguage();
  const t = useTranslations(language);

  return (
    <DashboardLayout role="admin" showSearch={false}>
      <SettingsContainer>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>{t.settings.title}</h1>

        <SettingsCard>
          <SectionTitle>{t.settings.accountSettings}</SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>
                <Globe style={{ display: 'inline', marginRight: '8px', width: '18px', height: '18px', verticalAlign: 'middle' }} />
                {t.settings.language}
              </h3>
              <p>{t.settings.languageDescription}</p>
            </SettingInfo>
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
          </SettingItem>
        </SettingsCard>
      </SettingsContainer>
    </DashboardLayout>
  );
};

export default AdminSettings;
