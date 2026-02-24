import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import TableFilter from '../../components/TableFilter';
import { Edit, Trash2, Users, Clock, TrendingUp, Eye, BarChart3 } from 'lucide-react';
import { Button } from '../../components/FormElements';

const JobManagementContainer = styled.div``;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const JobCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 2px solid ${props => props.theme.colors.border};
  padding: 28px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.theme.shadows.card};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${props => props.$status === 'active' ? props.theme.colors.success : props.theme.colors.textLight};
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.colors.primary};
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 20px 50px ${props => props.theme.colors.primary}20,
      0 0 0 1px ${props => props.theme.colors.primary}30;
    border-color: ${props => props.theme.colors.primary}40;
    
    &::before {
      opacity: 1;
    }
    
    &::after {
      opacity: 0.04;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const JobInfo = styled.div`
  flex: 1;
`;

const JobTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  line-height: 1.3;
  
  ${JobCard}:hover & {
    color: ${props => props.theme.colors.primary};
  }
`;

const JobMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.colors.primary};
  }
  
  strong {
    color: ${props => props.theme.colors.text};
    font-weight: 700;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
`;

const StatBox = styled.div`
  background: ${props => props.theme.colors.bgDark};
  padding: 12px;
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 6px;
  }
  
  .value {
    font-size: 20px;
    font-weight: 800;
    color: ${props => props.theme.colors.text};
    display: block;
    margin-bottom: 2px;
  }
  
  .label {
    font-size: 11px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$variant === 'danger' 
    ? props.theme.colors.danger + '15' 
    : props.theme.colors.primary + '15'};
  color: ${props => props.$variant === 'danger' 
    ? props.theme.colors.danger 
    : props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: ${props => props.$variant === 'danger' 
      ? props.theme.colors.danger 
      : props.theme.colors.primary};
    color: white;
    border-color: ${props => props.$variant === 'danger' 
      ? props.theme.colors.danger 
      : props.theme.colors.primary};
    transform: scale(1.1);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: ${props => props.theme.colors.textLight};
  
  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    opacity: 0.3;
  }
  
  h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: 14px;
  }
`;

const JobManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState([]);

  const [jobs] = useState([
    { 
      id: 1, 
      title: 'Senior React Developer', 
      applicants: 45, 
      status: 'active', 
      posted: '2 ngày trước',
      views: 234,
      responseRate: 85
    },
    { 
      id: 2, 
      title: 'Thu ngân', 
      applicants: 32, 
      status: 'active', 
      posted: '1 tuần trước',
      views: 156,
      responseRate: 72
    },
    { 
      id: 3, 
      title: 'Nhân viên pha chế', 
      applicants: 28, 
      status: 'inactive', 
      posted: '2 tuần trước',
      views: 98,
      responseRate: 65
    },
  ]);

  const filterOptions = [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' },
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = searchTerm === '' || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilters.length === 0 || 
        statusFilters.includes(job.status);
      
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilters]);

  const handleFilterToggle = (filterValue) => {
    setStatusFilters(prev => 
      prev.includes(filterValue) 
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  const handleEdit = (jobId) => {
    console.log('Edit job:', jobId);
    // Navigate to edit page or open modal
  };

  const handleDelete = (jobId) => {
    console.log('Delete job:', jobId);
    // Show confirmation and delete
  };

  return (
    <DashboardLayout role="employer">
      <JobManagementContainer>
        <PageHeader>
          <h1>Quản Lý Tin Tuyển Dụng</h1>
          <Button $variant="primary">+ Đăng Tin Mới</Button>
        </PageHeader>

        <TableFilter 
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={filterOptions}
          activeFilters={statusFilters}
          onFilterToggle={handleFilterToggle}
          searchPlaceholder="Tìm kiếm việc làm..."
        />

        {filteredJobs.length === 0 ? (
          <EmptyState>
            <BarChart3 />
            <h3>Không tìm thấy tin tuyển dụng</h3>
            <p>Thử điều chỉnh bộ lọc hoặc tạo tin tuyển dụng mới</p>
          </EmptyState>
        ) : (
          <JobGrid>
            {filteredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                $status={job.status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <CardHeader>
                  <JobInfo>
                    <JobTitle>{job.title}</JobTitle>
                    <JobMeta>
                      <MetaItem>
                        <Clock />
                        {job.posted}
                      </MetaItem>
                    </JobMeta>
                  </JobInfo>
                  <StatusBadge status={job.status} />
                </CardHeader>

                <StatsRow>
                  <StatBox>
                    <Users />
                    <span className="value">{job.applicants}</span>
                    <span className="label">Ứng viên</span>
                  </StatBox>
                  <StatBox>
                    <Eye />
                    <span className="value">{job.views}</span>
                    <span className="label">Lượt xem</span>
                  </StatBox>
                  <StatBox>
                    <TrendingUp />
                    <span className="value">{job.responseRate}%</span>
                    <span className="label">Phản hồi</span>
                  </StatBox>
                </StatsRow>

                <CardFooter>
                  <MetaItem>
                    <strong>ID:</strong> #{job.id}
                  </MetaItem>
                  <ActionButtons>
                    <IconButton
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(job.id)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      $variant="danger"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(job.id)}
                    >
                      <Trash2 />
                    </IconButton>
                  </ActionButtons>
                </CardFooter>
              </JobCard>
            ))}
          </JobGrid>
        )}
      </JobManagementContainer>
    </DashboardLayout>
  );
};

export default JobManagement;
