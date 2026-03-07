import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';

const PackagesManagement = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout role="admin" showSearch={false} key={language}>
      <div>
        <h1>{t.adminPackages.title}</h1>
        <p>{t.adminPackages.subtitle}</p>
      </div>
    </DashboardLayout>
  );
};

export default PackagesManagement;
