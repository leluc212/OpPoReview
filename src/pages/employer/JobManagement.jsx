import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import TableFilter from '../../components/TableFilter';
import { Edit, Trash2, Users, Clock, TrendingUp, Eye, BarChart3, Plus, Calendar, MapPin, DollarSign } from 'lucide-react';
import { Button } from '../../components/FormElements';
import { Link } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const JobManagementContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const CreateButton = styled(motion.button)`
  padding: 14px 28px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.45);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const JobCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  border: 2px solid ${props => props.theme.colors.border};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${props => {
      if (props.$status === 'active') return 'linear-gradient(90deg, #10B981 0%, #059669 100%)';
      return 'linear-gradient(90deg, #94A3B8 0%, #64748B 100%)';
    }};
  }
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(102, 126, 234, 0.2);
    border-color: ${props => props.theme.colors.primary}40;
  }
`;

const CardContent = styled.div`
  padding: 24px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
`;

const JobInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const JobTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
  
  ${JobCard}:hover & {
    color: ${props => props.theme.colors.primary};
  }
`;

const JobMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.colors.primary};
    opacity: 0.7;
  }
  
  strong {
    color: ${props => props.theme.colors.text};
    font-weight: 700;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 20px 0;
  padding: 16px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: 14px;
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: white;
  border-radius: 10px;
  border: 1.5px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$color || props.theme.colors.primary};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    border-color: ${props => props.$color || props.theme.colors.primary};
    transform: translateY(-3px);
    box-shadow: 0 4px 12px ${props => props.$color ? `${props.$color}20` : 'rgba(0, 0, 0, 0.1)'};
    
    &::before {
      opacity: 0.05;
    }
    
    svg {
      transform: scale(1.15);
    }
  }
  
  svg {
    width: 22px;
    height: 22px;
    color: ${props => props.$color || props.theme.colors.primary};
    transition: transform 0.3s ease;
  }
  
  .value {
    font-size: 24px;
    font-weight: 900;
    color: ${props => props.theme.colors.text};
    display: block;
    line-height: 1;
    letter-spacing: -0.5px;
  }
  
  .label {
    font-size: 11px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 2px solid ${props => props.theme.colors.bgDark};
`;

const IDLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 600;
  
  strong {
    color: ${props => props.theme.colors.text};
    font-weight: 700;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled(motion.button)`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${props => {
    if (props.$variant === 'danger') return props.theme.colors.error + '10';
    if (props.$variant === 'primary') return props.theme.colors.primary + '10';
    return props.theme.colors.bgDark;
  }};
  color: ${props => {
    if (props.$variant === 'danger') return props.theme.colors.error;
    if (props.$variant === 'primary') return props.theme.colors.primary;
    return props.theme.colors.text;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: ${props => {
      if (props.$variant === 'danger') return props.theme.colors.error;
      if (props.$variant === 'primary') return props.theme.colors.primary;
      return props.theme.colors.primary;
    }};
    color: white;
    border-color: ${props => {
      if (props.$variant === 'danger') return props.theme.colors.error;
      if (props.$variant === 'primary') return props.theme.colors.primary;
      return props.theme.colors.primary;
    }};
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 4px 12px ${props => {
      if (props.$variant === 'danger') return props.theme.colors.error + '40';
      if (props.$variant === 'primary') return props.theme.colors.primary + '40';
      return 'rgba(0, 0, 0, 0.15)';
    }};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  border: 2px dashed ${props => props.theme.colors.border};
  
  svg {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
    color: ${props => props.theme.colors.primary};
    opacity: 0.4;
  }
  
  h3 {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 10px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: 15px;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 24px;
  }
`;

const StatusBadgeWrapper = styled.div`
  .status-badge {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
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
          <CreateButton
            as={Link}
            to="/employer/post-job"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus />
            Đăng Tin Mới
          </CreateButton>
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
          <EmptyState
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <BarChart3 />
            <h3>Không tìm thấy tin tuyển dụng</h3>
            <p>Thử điều chỉnh bộ lọc hoặc tạo tin tuyển dụng mới</p>
            <CreateButton
              as={Link}
              to="/employer/post-job"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus />
              Đăng Tin Mới
            </CreateButton>
          </EmptyState>
        ) : (
          <JobGrid>
            {filteredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                $status={job.status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <CardContent>
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
                    <StatusBadgeWrapper>
                      <StatusBadge status={job.status} />
                    </StatusBadgeWrapper>
                  </CardHeader>

                  <StatsRow>
                    <StatBox $color="#667eea">
                      <Users />
                      <span className="value">{job.applicants}</span>
                      <span className="label">Ứng viên</span>
                    </StatBox>
                    <StatBox $color="#10B981">
                      <Eye />
                      <span className="value">{job.views}</span>
                      <span className="label">Lượt xem</span>
                    </StatBox>
                    <StatBox $color="#F59E0B">
                      <TrendingUp />
                      <span className="value">{job.responseRate}%</span>
                      <span className="label">Phản hồi</span>
                    </StatBox>
                  </StatsRow>

                  <CardFooter>
                    <IDLabel>
                      <strong>ID:</strong> #{job.id}
                    </IDLabel>
                    <ActionButtons>
                      <IconButton
                        $variant="primary"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(job.id)}
                        title="Chỉnh sửa"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        $variant="danger"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(job.id)}
                        title="Xóa"
                      >
                        <Trash2 />
                      </IconButton>
                    </ActionButtons>
                  </CardFooter>
                </CardContent>
              </JobCard>
            ))}
          </JobGrid>
        )}
      </JobManagementContainer>
    </DashboardLayout>
  );
};

export default JobManagement;
