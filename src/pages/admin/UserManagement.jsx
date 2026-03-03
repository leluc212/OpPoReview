import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import TableFilter from '../../components/TableFilter';
import { Button } from '../../components/FormElements';
import { useLanguage } from '../../context/LanguageContext';

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
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);

  const [users] = useState([
    { name: 'ABC', email: 'abc@example.com', role: 'candidate', status: 'active', joined: '2024-01-15' },
    { name: 'xyz', email: 'xyz@example.com', role: 'candidate', status: 'active', joined: '2024-01-20' },
    { name: 'FPT Software', email: 'hr@FPT Software.com', role: 'employer', status: 'active', joined: '2024-01-10' },
    { name: 'Hồng Trà Ngô Gia', email: 'contact@Hồng Trà Ngô Gia.com', role: 'employer', status: 'pending', joined: '2024-02-01' },
  ]);

  const getRoleTranslation = (role) => {
    if (role === 'candidate') return t.login.roleCandidate;
    if (role === 'employer') return t.login.roleEmployer;
    if (role === 'admin') return t.login.roleAdmin;
    return role;
  };

  const filterOptions = [
    { value: 'candidate', label: t.sidebar.dashboard },
    { value: 'employer', label: t.nav.forEmployers },
    { value: 'active', label: t.adminUsers.status },
    { value: 'pending', label: t.adminEmployerApproval.status },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = filters.length === 0 || 
        filters.includes(user.role) ||
        filters.includes(user.status);
      
      return matchesSearch && matchesFilters;
    });
  }, [users, searchTerm, filters]);

  const handleFilterToggle = (filterValue) => {
    setFilters(prev => 
      prev.includes(filterValue) 
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  return (
    <DashboardLayout role="admin">
      <UserManagementContainer>
        <PageHeader>
          <h1>{t.adminUsers.title}</h1>
          <p style={{ color: '#94A3B8' }}>{t.adminUsers.subtitle}</p>
        </PageHeader>

        <TableFilter 
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={filterOptions}
          activeFilters={filters}
          onFilterToggle={handleFilterToggle}
          searchPlaceholder={t.common.search}
        />

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
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 600 }}>{user.name}</td>
                <td>{user.email}</td>
                <td>{getRoleTranslation(user.role)}</td>
                <td><StatusBadge status={user.status} /></td>
                <td style={{ color: '#E2E8F0', fontWeight: 500 }}>{user.joined}</td>
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
