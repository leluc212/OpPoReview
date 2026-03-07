import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';

const Reports = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout role="admin" showSearch={false} key={language}>
      <div>
        <h1>{t.adminReports.title}</h1>
        <p>{t.adminReports.subtitle}</p>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
