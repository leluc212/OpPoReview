import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const Reports = () => {
  return (
    <DashboardLayout role="admin" showSearch={false}>
      <div>
        <h1>Báo Cáo</h1>
        <p>Phân tích và báo cáo nền tảng</p>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
