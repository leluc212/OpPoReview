import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const EmployerNotifications = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <DashboardLayout role="employer" showSearch={false}>
      <div>
        <h1>{t.employerMisc.notificationsTitle}</h1>
        <p>{t.employerMisc.notificationsSubtitle}</p>
      </div>
    </DashboardLayout>
  );
};

export default EmployerNotifications;
