import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import TableFilter from '../../components/TableFilter';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);

  const [users] = useState([
    { name: 'ABC', email: 'abc@example.com', role: 'candidate', status: 'active', joined: '2024-01-15' },
    { name: 'xyz', email: 'xyz@example.com', role: 'candidate', status: 'active', joined: '2024-01-20' },
    { name: 'FPT Software', email: 'hr@FPT Software.com', role: 'employer', status: 'active', joined: '2024-01-10' },
    { name: 'Hồng Trà Ngô Gia', email: 'contact@Hồng Trà Ngô Gia.com', role: 'employer', status: 'pending', joined: '2024-02-01' },
  ]);

  const filterOptions = [
    { value: 'candidate', label: 'Ứng viên' },
    { value: 'employer', label: 'Nhà tuyển dụng' },
    { value: 'active', label: 'Hoạt động' },
    { value: 'pending', label: 'Chờ duyệt' },
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
          <h1>Quản Lý Người Dùng</h1>
          <p style={{ color: '#64748B' }}>Quản lý toàn bộ người dùng trên nền tảng</p>
        </PageHeader>

        <TableFilter 
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={filterOptions}
          activeFilters={filters}
          onFilterToggle={handleFilterToggle}
          searchPlaceholder="Tìm kiếm người dùng..."
        />

        <Table>
          <thead>
            <tr>
              <th>Họ Tên</th>
              <th>Email</th>
              <th>Vai Trò</th>
              <th>Trạng Thái</th>
              <th>Ngày Tham Gia</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 600 }}>{user.name}</td>
                <td>{user.email}</td>
                <td style={{ textTransform: 'capitalize' }}>{user.role}</td>
                <td><StatusBadge status={user.status} /></td>
                <td style={{ color: '#64748B' }}>{user.joined}</td>
                <td>
                  <Button $variant="secondary" $size="small">Xem</Button>
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
