import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Bell, Mail, MessageSquare, Globe } from 'lucide-react';
import { Button, FormGroup, Label } from '../../components/FormElements';
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
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
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
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const CandidateSettings = () => {
  const { language, changeLanguage } = useLanguage();
  const t = useTranslations(language);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const handleSaveSettings = () => {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  return (
    <DashboardLayout role="candidate" showSearch={false}>
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

        <SettingsCard>
          <SectionTitle>{t.settings.notifications}</SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>{t.settings.emailNotifications}</h3>
              <p>{t.settings.emailNotificationsDesc}</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" defaultChecked />
              <span></span>
            </Toggle>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>{t.settings.applicationUpdates}</h3>
              <p>{t.settings.applicationUpdatesDesc}</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" defaultChecked />
              <span></span>
            </Toggle>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>{t.settings.newMatches}</h3>
              <p>{t.settings.newMatchesDesc}</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" defaultChecked />
              <span></span>
            </Toggle>
          </SettingItem>
        </SettingsCard>

        <SettingsCard>
          <SectionTitle>{t.settings.privacy}</SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>{t.settings.profileVisibility}</h3>
              <p>{t.settings.profileVisibilityDesc}</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" defaultChecked />
              <span></span>
            </Toggle>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <h3>{t.settings.showEmail}</h3>
              <p>{t.settings.showEmailDesc}</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" />
              <span></span>
            </Toggle>
          </SettingItem>
          
          <SettingItem>
            <SettingInfo>
              <h3>{t.settings.showPhone}</h3>
              <p>{t.settings.showPhoneDesc}</p>
            </SettingInfo>
            <Toggle>
              <input type="checkbox" />
              <span></span>
            </Toggle>
          </SettingItem>
        </SettingsCard>

        <SettingsCard>
          <SectionTitle>{t.settings.dangerZone}</SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>{t.settings.deleteAccount}</h3>
              <p>{t.settings.deleteAccountDesc}</p>
            </SettingInfo>
            <Button $variant="danger">{t.settings.deleteButton}</Button>
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
            {t.settings.changesSaved}
          </div>
        )}
      </SettingsContainer>
    </DashboardLayout>
  );
};

export default CandidateSettings;
