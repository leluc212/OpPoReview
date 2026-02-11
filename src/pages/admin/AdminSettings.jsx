import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const AdminSettings = () => {
  return (
    <DashboardLayout role="admin" showSearch={false}>
      <div>
        <h1>Admin Settings</h1>
        <p>Platform configuration and settings</p>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
