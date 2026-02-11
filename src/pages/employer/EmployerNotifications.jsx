import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const EmployerNotifications = () => {
  return (
    <DashboardLayout role="employer" showSearch={false}>
      <div>
        <h1>Notifications</h1>
        <p>Stay updated with your applications</p>
      </div>
    </DashboardLayout>
  );
};

export default EmployerNotifications;
