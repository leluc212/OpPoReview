import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const PackagesManagement = () => {
  return (
    <DashboardLayout role="admin" showSearch={false}>
      <div>
        <h1>Quản Lý Gói Dịch Vụ</h1>
        <p>Quản lý các gói đăng ký và giá</p>
      </div>
    </DashboardLayout>
  );
};

export default PackagesManagement;
