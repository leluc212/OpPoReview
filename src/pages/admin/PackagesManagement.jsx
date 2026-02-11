import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const PackagesManagement = () => {
  return (
    <DashboardLayout role="admin" showSearch={false}>
      <div>
        <h1>Packages Management</h1>
        <p>Manage subscription packages and pricing</p>
      </div>
    </DashboardLayout>
  );
};

export default PackagesManagement;
