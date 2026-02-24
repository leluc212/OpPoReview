import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import TableFilter from '../../components/TableFilter';
import { Eye, CheckCircle, XCircle, MessageSquareOff, Star } from 'lucide-react';

const ApplicationsContainer = styled.div``;

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

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$variant === 'success' ? '#10b981' : 
              props.$variant === 'danger' ? '#ef4444' : 
              props.$variant === 'warning' ? '#f59e0b' :
              props.$variant === 'secondary' ? '#64748b' :
              props.theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 8px;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MarkedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #fef3c7;
  color: #d97706;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState([]);
  
  const [applications, setApplications] = useState([
    { id: 1, candidate: 'Hiếu sàn', job: 'Senior React Developer', applied: '2 giờ trước', status: 'pending', completed: false, marked: false, messagesDeleted: false },
    { id: 2, candidate: 'Duy sàn', job: 'Thu ngân', applied: '5 giờ trước', status: 'pending', completed: false, marked: false, messagesDeleted: false },
    { id: 3, candidate: 'Nheo', job: 'Nhân viên pha chế', applied: '1 ngày trước', status: 'approved', completed: false, marked: false, messagesDeleted: false },
    { id: 4, candidate: 'Gemmin', job: 'Senior React Developer', applied: '2 ngày trước', status: 'rejected', completed: false, marked: false, messagesDeleted: false },
    { id: 5, candidate: 'Zun', job: 'Nhân viên phục vụ', applied: '1 tuần trước', status: 'pending', completed: false, marked: false, messagesDeleted: false },
  ]);

  const filterOptions = [
    { value: 'pending', label: 'Chờ duyệt' },
    { value: 'approved', label: 'Chấp nhận' },
    { value: 'rejected', label: 'Từ chối' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'marked', label: 'Đã đánh dấu' },
  ];

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        app.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilters.length === 0 || 
        statusFilters.includes(app.status) ||
        (statusFilters.includes('marked') && app.marked);
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilters]);

  const handleFilterToggle = (filterValue) => {
    setStatusFilters(prev => 
      prev.includes(filterValue) 
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  const handleCompleteJob = (id) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, completed: true, status: 'completed', messagesDeleted: true } : app
    ));
    alert('Công việc đã hoàn thành! Tin nhắn đã được tự động hủy.');
  };

  const handleMarkCandidate = (id) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, marked: !app.marked } : app
    ));
  };

  return (
    <DashboardLayout role="employer">
      <ApplicationsContainer>
        <PageHeader>
          <h1>Hồ Sơ Ứng Tuyển</h1>
          <p style={{ color: '#64748B' }}>Xem và quản lý hồ sơ ứng viên</p>
        </PageHeader>

        <TableFilter 
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={filterOptions}
          activeFilters={statusFilters}
          onFilterToggle={handleFilterToggle}
          searchPlaceholder="Tìm kiếm theo ứng viên hoặc vị trí..."
        />

        <Table>
          <thead>
            <tr>
              <th>Ứng Viên</th>
              <th>Vị Trí</th>
              <th>Thời Gian Ứng Tuyển</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id}>
                <td style={{ fontWeight: 600 }}>
                  {app.candidate}
                  {app.marked && (
                    <MarkedBadge style={{ marginLeft: '8px' }}>
                      <Star /> Đã đánh dấu
                    </MarkedBadge>
                  )}
                </td>
                <td>{app.job}</td>
                <td style={{ color: '#64748B' }}>{app.applied}</td>
                <td>
                  <StatusBadge status={app.completed ? 'completed' : app.status} />
                </td>
                <td>
                  <ActionButton><Eye /> Xem Hồ Sơ</ActionButton>
                  
                  {!app.completed && app.status === 'approved' && (
                    <ActionButton 
                      $variant="success"
                      onClick={() => handleCompleteJob(app.id)}
                    >
                      <CheckCircle /> Hoàn thành
                    </ActionButton>
                  )}
                  
                  {app.completed && (
                    <ActionButton 
                      $variant="warning"
                      onClick={() => handleMarkCandidate(app.id)}
                    >
                      <Star /> {app.marked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
                    </ActionButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ApplicationsContainer>
    </DashboardLayout>
  );
};

export default Applications;
