import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const Reports = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <DashboardLayout role="admin" showSearch={false}>
      <div>
        <h1>{t.adminReports.title}</h1>
        <p>{t.adminReports.subtitle}</p>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
