import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const EmployerMessages = () => {
  return (
    <DashboardLayout role="employer" showSearch={false}>
      <div>
        <h1>Messages</h1>
        <p>Chat with candidates</p>
      </div>
    </DashboardLayout>
  );
};

export default EmployerMessages;
