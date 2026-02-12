import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import { Button } from '../../components/FormElements';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

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
  const { language } = useLanguage();
  const t = useTranslations(language);

  const users = [
    { name: 'John Doe', email: 'john@example.com', role: 'candidate', status: 'active', joined: '2024-01-15' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'candidate', status: 'active', joined: '2024-01-20' },
    { name: 'FPT Software', email: 'hr@FPT Software.com', role: 'employer', status: 'active', joined: '2024-01-10' },
    { name: 'Hồng Trà Ngô Gia', email: 'contact@Hồng Trà Ngô Gia.com', role: 'employer', status: 'pending', joined: '2024-02-01' },
  ];

  return (
    <DashboardLayout role="admin">
      <UserManagementContainer>
        <PageHeader>
          <h1>{t.adminUsers.title}</h1>
          <p style={{ color: '#64748B' }}>{t.adminUsers.subtitle}</p>
        </PageHeader>

        <Table>
          <thead>
            <tr>
              <th>{t.adminUsers.name}</th>
              <th>{t.adminUsers.email}</th>
              <th>{t.adminUsers.role}</th>
              <th>{t.adminUsers.status}</th>
              <th>{t.adminUsers.joined}</th>
              <th>{t.adminUsers.actions}</th>
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
                  <Button $variant="secondary" $size="small">{t.adminUsers.view}</Button>
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
