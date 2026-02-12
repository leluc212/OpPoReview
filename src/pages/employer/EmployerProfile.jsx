import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const EmployerProfile = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <DashboardLayout role="employer" showSearch={false}>
      <div>
        <h1>{t.employerMisc.profileTitle}</h1>
        <p>{t.employerMisc.profileSubtitle}</p>
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfile;
