import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const EmployerProfile = () => {
  return (
    <DashboardLayout role="employer" showSearch={false}>
      <div>
        <h1>Company Profile</h1>
        <p>Manage your company information</p>
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfile;
