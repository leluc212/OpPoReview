import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { Calendar, CheckCircle, XCircle, Users, AlertCircle, Clock, Star, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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

const PageContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 15px;
    font-weight: 500;
  }
`;

const JobTypeContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  padding: 6px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: 14px;
`;

const JobTypeTab = styled(motion.button)`
  flex: 1;
  padding: 14px 28px;
  background: ${props => props.$active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  border: none;
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.$active ? 'white' : props.theme.colors.textLight};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'};
  
  &:hover {
    color: ${props => props.$active ? 'white' : props.theme.colors.primary};
    background: ${props => props.$active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : props.theme.colors.border};
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  padding: 6px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: 14px;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }
`;

const Tab = styled(motion.button)`
  padding: 12px 24px;
  background: ${props => props.$active ? props.theme.colors.bgLight : 'transparent'};
  border: none;
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textLight};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.$active ? props.theme.colors.bgLight : props.theme.colors.border};
  }
`;

const StaffGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const StaffCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 28px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${props => {
      switch(props.$status) {
        case 'active': return 'linear-gradient(90deg, #10B981 0%, #059669 100%)';
        case 'pending': return 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)';
        case 'completed': return 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)';
        case 'requested': return 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)';
        default: return 'linear-gradient(90deg, #94A3B8 0%, #64748B 100%)';
      }
    }};
  }
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(102, 126, 234, 0.2);
    border-color: ${props => props.theme.colors.primary}40;
  }
`;

const StaffHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
`;

const StaffInfo = styled.div`
  display: flex;
  gap: 16px;
  align-items: start;
  flex: 1;
  min-width: 250px;
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  min-width: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 26px;
  font-weight: 800;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  
  ${StaffCard}:hover & {
    transform: scale(1.08) rotate(3deg);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
  }
`;

const StaffDetails = styled.div`
  flex: 1;
  
  h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 6px;
    color: ${props => props.theme.colors.text};
    transition: color 0.3s ease;
    
    ${StaffCard}:hover & {
      color: ${props => props.theme.colors.primary};
    }
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: 500;
  }
`;

const StatusBadge = styled.span`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${props => {
    switch(props.$status) {
      case 'active': return 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
      case 'pending': return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
      case 'completed': return 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
      case 'requested': return 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
      default: return props.theme.colors.bgLight;
    }
  }};
  color: white;
  box-shadow: 0 4px 12px ${props => {
    switch(props.$status) {
      case 'active': return 'rgba(16, 185, 129, 0.3)';
      case 'pending': return 'rgba(245, 158, 11, 0.3)';
      case 'completed': return 'rgba(59, 130, 246, 0.3)';
      case 'requested': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(0, 0, 0, 0.1)';
    }
  }};
`;

const StaffMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: 14px;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${props => props.theme.colors.text};
    font-size: 14px;
    font-weight: 500;
    padding: 8px 12px;
    background: ${props => props.theme.colors.bgDark};
    border-radius: 10px;
    border: 1.5px solid ${props => props.theme.colors.border};
    transition: all 0.3s ease;
    
    &:hover {
      border-color: ${props => props.theme.colors.primary};
      transform: translateX(3px);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
    }
    
    svg {
      width: 18px;
      height: 18px;
      color: ${props => props.theme.colors.primary};
      flex-shrink: 0;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        &:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
      `;
    } else if (props.$variant === 'success') {
      return `
        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        color: white;
        &:hover { 
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
        }
      `;
    } else if (props.$variant === 'warning') {
      return `
        background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
        color: white;
        &:hover { 
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
        color: white;
        &:hover { 
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.bgLight};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};
        &:hover { 
          border-color: ${props.theme.colors.primary}; 
          color: ${props.theme.colors.primary};
          transform: translateY(-2px);
        }
      `;
    }
  }}
  
  &:active {
    transform: scale(0.98);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 80px 20px;
  background: ${props => props.theme.colors.bgLight};
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
  }
`;

const ReasonBox = styled.div`
  margin-bottom: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
  border-radius: 12px;
  border: 2px solid #FBBF24;
  display: flex;
  align-items: start;
  gap: 12px;
  
  svg {
    width: 20px;
    height: 20px;
    color: #D97706;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  div {
    flex: 1;
    
    strong {
      font-weight: 700;
      color: #92400E;
      display: block;
      margin-bottom: 4px;
      font-size: 13px;
    }
    
    span {
      color: #78350F;
      font-size: 14px;
      line-height: 1.5;
    }
  }
`;

const HRManagement = () => {
  const { language } = useLanguage();
  const [jobType, setJobType] = useState('standard'); // 'standard' or 'quick'
  const [activeTab, setActiveTab] = useState('active');

  // Separate data for standard and quick jobs
  const allStaffData = {
    standard: {
      active: [
        {
          id: 1,
          name: language === 'vi' ? 'Nguyễn Văn A' : 'Nguyen Van A',
          position: language === 'vi' ? 'Kỹ sư phần mềm' : 'Software Engineer',
          startDate: '01/01/2026',
          shift: language === 'vi' ? 'Toàn thời gian' : 'Full-time',
          location: language === 'vi' ? 'Hà Nội' : 'Hanoi',
          status: 'active',
          jobType: 'standard'
        },
        {
          id: 2,
          name: language === 'vi' ? 'Trần Thị B' : 'Tran Thi B',
          position: language === 'vi' ? 'Kế toán' : 'Accountant',
          startDate: '15/12/2025',
          shift: language === 'vi' ? 'Toàn thời gian' : 'Full-time',
          location: language === 'vi' ? 'TP.HCM' : 'HCMC',
          status: 'active',
          jobType: 'standard'
        }
      ],
      pending: [
        {
          id: 3,
          name: language === 'vi' ? 'Lê Văn C' : 'Le Van C',
          position: language === 'vi' ? 'Marketing Manager' : 'Marketing Manager',
          startDate: '10/03/2026',
          shift: language === 'vi' ? 'Toàn thời gian' : 'Full-time',
          location: language === 'vi' ? 'Đà Nẵng' : 'Da Nang',
          status: 'pending',
          jobType: 'standard'
        }
      ],
      completed: [
        {
          id: 4,
          name: language === 'vi' ? 'Phạm Thị D' : 'Pham Thi D',
          position: language === 'vi' ? 'Nhân viên hành chính' : 'Admin Staff',
          startDate: '01/10/2025',
          endDate: '28/02/2026',
          shift: language === 'vi' ? 'Toàn thời gian' : 'Full-time',
          location: language === 'vi' ? 'Hà Nội' : 'Hanoi',
          status: 'completed',
          rating: 4.8,
          jobType: 'standard'
        }
      ],
      change_request: []
    },
    quick: {
      active: [
        {
          id: 11,
          name: language === 'vi' ? 'Nguyễn Văn X' : 'Nguyen Van X',
          position: language === 'vi' ? 'Nhân viên bán hàng' : 'Sales Staff',
          startDate: '15/02/2026',
          shift: language === 'vi' ? 'Ca sáng 8:00 - 12:00' : 'Morning shift 8:00 - 12:00',
          location: language === 'vi' ? 'Hà Nội' : 'Hanoi',
          status: 'active',
          jobType: 'quick'
        },
        {
          id: 12,
          name: language === 'vi' ? 'Trần Thị Y' : 'Tran Thi Y',
          position: language === 'vi' ? 'Nhân viên kho' : 'Warehouse Staff',
          startDate: '12/02/2026',
          shift: language === 'vi' ? 'Ca chiều 13:00 - 17:00' : 'Afternoon shift 13:00 - 17:00',
          location: language === 'vi' ? 'TP.HCM' : 'HCMC',
          status: 'active',
          jobType: 'quick'
        }
      ],
      pending: [
        {
          id: 13,
          name: language === 'vi' ? 'Lê Văn Z' : 'Le Van Z',
          position: language === 'vi' ? 'Lễ tân' : 'Receptionist',
          startDate: '20/03/2026',
          shift: language === 'vi' ? 'Ca full 8:00 - 17:00' : 'Full shift 8:00 - 17:00',
          location: language === 'vi' ? 'Đà Nẵng' : 'Da Nang',
          status: 'pending',
          jobType: 'quick'
        }
      ],
      completed: [
        {
          id: 14,
          name: language === 'vi' ? 'Phạm Thị K' : 'Pham Thi K',
          position: language === 'vi' ? 'Nhân viên phục vụ' : 'Service Staff',
          startDate: '01/02/2026',
          endDate: '10/02/2026',
          shift: language === 'vi' ? 'Ca tối 18:00 - 22:00' : 'Evening shift 18:00 - 22:00',
          location: language === 'vi' ? 'Hà Nội' : 'Hanoi',
          status: 'completed',
          rating: 4.5,
          jobType: 'quick'
        }
      ],
      change_request: [
        {
          id: 15,
          name: language === 'vi' ? 'Hoàng Văn L' : 'Hoang Van L',
          position: language === 'vi' ? 'Nhân viên giao hàng' : 'Delivery Staff',
          startDate: '10/02/2026',
          shift: language === 'vi' ? 'Ca sáng 8:00 - 12:00' : 'Morning shift 8:00 - 12:00',
          location: language === 'vi' ? 'TP.HCM' : 'HCMC',
          status: 'requested',
          reason: language === 'vi' ? 'Yêu cầu thay đổi ca làm việc' : 'Request to change work shift',
          jobType: 'quick'
        }
      ]
    }
  };

  const staffData = allStaffData[jobType];

  const tabs = [
    { id: 'active', label: language === 'vi' ? 'Đang làm việc' : 'Active', count: staffData.active.length },
    { id: 'pending', label: language === 'vi' ? 'Chờ xác nhận' : 'Pending Confirmation', count: staffData.pending.length },
    { id: 'completed', label: language === 'vi' ? 'Đã hoàn thành' : 'Completed', count: staffData.completed.length },
    { id: 'change_request', label: language === 'vi' ? 'Yêu cầu thay đổi' : 'Change Requests', count: staffData.change_request.length }
  ];

  const handleConfirmStaff = (staffId) => {
    console.log('Confirm staff:', staffId);
  };

  const handleEvaluate = (staffId) => {
    console.log('Evaluate staff:', staffId);
  };

  const handleRequestChange = (staffId) => {
    console.log('Request change:', staffId);
  };

  const handleCloseJob = (staffId) => {
    console.log('Close job:', staffId);
  };

  const renderStaffCard = (staff, index) => (
    <StaffCard 
      key={staff.id}
      $status={staff.status}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
    >
      <StaffHeader>
        <StaffInfo>
          <Avatar>{staff.name.charAt(0)}</Avatar>
          <StaffDetails>
            <h3>{staff.name}</h3>
            <p>{staff.position}</p>
            <StatusBadge $status={staff.status}>
              {staff.status === 'active' && (language === 'vi' ? 'Đang làm việc' : 'Active')}
              {staff.status === 'pending' && (language === 'vi' ? 'Chờ xác nhận' : 'Pending confirmation')}
              {staff.status === 'completed' && (language === 'vi' ? 'Đã hoàn thành' : 'Completed')}
              {staff.status === 'requested' && (language === 'vi' ? 'Yêu cầu thay đổi' : 'Change request')}
            </StatusBadge>
          </StaffDetails>
        </StaffInfo>
      </StaffHeader>

      <StaffMeta>
        <div className="meta-item">
          <Calendar />
          <span>{staff.startDate}</span>
        </div>
        <div className="meta-item">
          <Clock />
          <span>{staff.shift}</span>
        </div>
        <div className="meta-item">
          <MapPin />
          <span>{staff.location}</span>
        </div>
        {staff.rating && (
          <div className="meta-item">
            <Star />
            <span>{staff.rating}/5.0</span>
          </div>
        )}
      </StaffMeta>

      {staff.reason && (
        <ReasonBox>
          <AlertCircle />
          <div>
            <strong>{language === 'vi' ? 'Lý do yêu cầu:' : 'Request reason:'}</strong>
            <span>{staff.reason}</span>
          </div>
        </ReasonBox>
      )}

      <ActionButtons>
        {staff.status === 'pending' && (
          <>
            <Button 
              $variant="success" 
              onClick={() => handleConfirmStaff(staff.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <CheckCircle />
              {language === 'vi' ? 'Xác nhận' : 'Confirm'}
            </Button>
            <Button 
              $variant="danger" 
              onClick={() => handleCloseJob(staff.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <XCircle />
              {language === 'vi' ? 'Từ chối' : 'Reject'}
            </Button>
          </>
        )}
        
        {staff.status === 'active' && (
          <>
            <Button 
              $variant="warning" 
              onClick={() => handleRequestChange(staff.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <AlertCircle />
              {language === 'vi' ? 'Yêu cầu thay đổi' : 'Request change'}
            </Button>
            <Button 
              $variant="primary" 
              onClick={() => handleCloseJob(staff.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <CheckCircle />
              {language === 'vi' ? 'Kết thúc công việc' : 'Close assignment'}
            </Button>
          </>
        )}
        
        {staff.status === 'completed' && (
          <Button 
            $variant="primary" 
            onClick={() => handleEvaluate(staff.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Star />
            {language === 'vi' ? 'Đánh giá nhân viên' : 'Rate employee'}
          </Button>
        )}
        
        {staff.status === 'requested' && (
          <>
            <Button 
              $variant="success" 
              onClick={() => handleConfirmStaff(staff.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <CheckCircle />
              {language === 'vi' ? 'Chấp nhận' : 'Accept'}
            </Button>
            <Button 
              $variant="danger" 
              onClick={() => handleCloseJob(staff.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <XCircle />
              {language === 'vi' ? 'Từ chối' : 'Reject'}
            </Button>
          </>
        )}
      </ActionButtons>
    </StaffCard>
  );

  const currentData = staffData[activeTab] || [];

  return (
    <DashboardLayout role="employer">
      <PageContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Quản lý nhân sự' : 'HR Management'}</h1>
          <p>{language === 'vi' ? 'Quản lý và theo dõi nhân viên đang làm việc' : 'Manage and track your active workforce'}</p>
        </PageHeader>

        <JobTypeContainer>
          <JobTypeTab
            $active={jobType === 'standard'}
            onClick={() => setJobType('standard')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {language === 'vi' ? '🏢 Công việc tiêu chuẩn' : '🏢 Standard Jobs'}
          </JobTypeTab>
          <JobTypeTab
            $active={jobType === 'quick'}
            onClick={() => setJobType('quick')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {language === 'vi' ? '⚡ Công việc theo ca' : '⚡ Quick Jobs'}
          </JobTypeTab>
        </JobTypeContainer>

        <TabContainer>
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label} ({tab.count})
            </Tab>
          ))}
        </TabContainer>

        {currentData.length > 0 ? (
          <StaffGrid>
            {currentData.map((staff, index) => renderStaffCard(staff, index))}
          </StaffGrid>
        ) : (
          <EmptyState
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Users />
            <h3>{language === 'vi' ? 'Chưa có nhân viên' : 'No staff yet'}</h3>
            <p>{language === 'vi' ? 'Không có nhân viên nào trong danh mục này' : 'There are no staff members in this category'}</p>
          </EmptyState>
        )}
      </PageContainer>
    </DashboardLayout>
  );
};

export default HRManagement;
