import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const EmployerProfile = () => {
  return (
    <DashboardLayout role="employer" showSearch={false}>
      <div>
        <h1>Hồ Sơ Công Ty</h1>
        <p>Quản lý thông tin công ty</p>
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfile;
