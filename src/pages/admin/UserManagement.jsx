import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import { Button } from '../../components/FormElements';

const UserManagementContainer = styled.div``;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
  }
`;

const Table = styled.table`
  width: 100%;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 16px;
    background: ${props => props.theme.colors.bgDark};
    font-weight: 600;
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  td {
    padding: 16px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover {
    background: ${props => props.theme.colors.bgDark};
  }
`;

const UserManagement = () => {
  const users = [
    { name: 'John Doe', email: 'john@example.com', role: 'candidate', status: 'active', joined: '2024-01-15' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'candidate', status: 'active', joined: '2024-01-20' },
    { name: 'TechCorp', email: 'hr@techcorp.com', role: 'employer', status: 'active', joined: '2024-01-10' },
    { name: 'StartupXYZ', email: 'contact@startupxyz.com', role: 'employer', status: 'pending', joined: '2024-02-01' },
  ];

  return (
    <DashboardLayout role="admin">
      <UserManagementContainer>
        <PageHeader>
          <h1>User Management</h1>
          <p style={{ color: '#64748B' }}>Manage all platform users</p>
        </PageHeader>

        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 600 }}>{user.name}</td>
                <td>{user.email}</td>
                <td style={{ textTransform: 'capitalize' }}>{user.role}</td>
                <td><StatusBadge status={user.status} /></td>
                <td style={{ color: '#64748B' }}>{user.joined}</td>
                <td>
                  <Button $variant="secondary" $size="small">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </UserManagementContainer>
    </DashboardLayout>
  );
};

export default UserManagement;
