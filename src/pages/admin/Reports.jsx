import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const Reports = () => {
  return (
    <DashboardLayout role="admin" showSearch={false}>
      <div>
        <h1>Reports</h1>
        <p>Platform analytics and reports</p>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
