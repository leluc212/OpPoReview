import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const EmployerMessages = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <DashboardLayout role="employer" showSearch={false}>
      <div>
        <h1>{t.employerMisc.messagesTitle}</h1>
        <p>{t.employerMisc.messagesSubtitle}</p>
      </div>
    </DashboardLayout>
  );
};

export default EmployerMessages;
