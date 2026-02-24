import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const EmployerNotifications = () => {
  return (
    <DashboardLayout role="employer" showSearch={false}>
      <div>
        <h1>Thông Báo</h1>
        <p>Cập nhật tình trạng tuyển dụng</p>
      </div>
    </DashboardLayout>
  );
};

export default EmployerNotifications;
