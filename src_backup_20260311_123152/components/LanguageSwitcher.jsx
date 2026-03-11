import React from 'react';
import styled from 'styled-components';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SwitcherButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.bgLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  font-size: 14px;
  font-weight: 500;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.bgDark};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const LanguageSwitcher = () => {
  const { language, changeLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <SwitcherButton onClick={toggleLanguage} title={t.settings.language}>
      <Globe />
      <span>{language === 'vi' ? 'VI' : 'EN'}</span>
    </SwitcherButton>
  );
};

export default LanguageSwitcher;
