import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Calendar, CheckCircle, XCircle, Users, AlertCircle, Clock, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const PageContainer = styled.div`
  animation: fadeIn 0.5s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 8px;
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 16px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  overflow-x: auto;
`;

const Tab = styled.button`
  padding: 16px 24px;
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textLight};
  border-bottom: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const StaffGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const StaffCard = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const StaffHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 20px;
`;

const StaffInfo = styled.div`
  display: flex;
  gap: 16px;
  align-items: start;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 700;
`;

const StaffDetails = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 4px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch(props.$status) {
      case 'active': return '#10B98114';
      case 'pending': return '#F59E0B14';
      case 'completed': return '#3B82F614';
      case 'requested': return '#EF444414';
      default: return props.theme.colors.bgLight;
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'active': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'completed': return '#3B82F6';
      case 'requested': return '#EF4444';
      default: return props.theme.colors.text;
    }
  }};
`;

const StaffMeta = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${props => props.theme.colors.textLight};
    font-size: 14px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  
  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.gradientPrimary};
        color: white;
        &:hover { transform: translateY(-2px); box-shadow: ${props.theme.shadows.md}; }
      `;
    } else if (props.$variant === 'success') {
      return `
        background: #10B981;
        color: white;
        &:hover { background: #059669; }
      `;
    } else if (props.$variant === 'warning') {
      return `
        background: #F59E0B;
        color: white;
        &:hover { background: #D97706; }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: #EF4444;
        color: white;
        &:hover { background: #DC2626; }
      `;
    } else {
      return `
        background: white;
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};
        &:hover { border-color: ${props.theme.colors.primary}; color: ${props.theme.colors.primary}; }
      `;
    }
  }}
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textLight};
  
  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    opacity: 0.3;
  }
  
  h3 {
    font-size: 18px;
    margin-bottom: 8px;
  }
`;

const HRManagement = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [activeTab, setActiveTab] = useState('active');

  const staffData = {
    active: [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        position: 'Nhân viên bán hàng',
        startDate: '15/01/2026',
        shift: 'Ca sáng 8:00 - 12:00',
        location: 'Hà Nội',
        status: 'active'
      },
      {
        id: 2,
        name: 'Trần Thị B',
        position: 'Nhân viên kho',
        startDate: '12/01/2026',
        shift: 'Ca chiều 13:00 - 17:00',
        location: 'TP.HCM',
        status: 'active'
      }
    ],
    pending: [
      {
        id: 3,
        name: 'Lê Văn C',
        position: 'Lễ tân',
        startDate: '20/02/2026',
        shift: 'Ca full 8:00 - 17:00',
        location: 'Đà Nẵng',
        status: 'pending'
      }
    ],
    completed: [
      {
        id: 4,
        name: 'Phạm Thị D',
        position: 'Nhân viên phục vụ',
        startDate: '01/01/2026',
        endDate: '10/01/2026',
        shift: 'Ca tối 18:00 - 22:00',
        location: 'Hà Nội',
        status: 'completed',
        rating: 4.5
      }
    ],
    change_request: [
      {
        id: 5,
        name: 'Hoàng Văn E',
        position: 'Nhân viên giao hàng',
        startDate: '10/01/2026',
        shift: 'Ca sáng 8:00 - 12:00',
        location: 'TP.HCM',
        status: 'requested',
        reason: 'Yêu cầu thay đổi ca làm việc'
      }
    ]
  };

  const tabs = [
    { id: 'active', label: 'Đang làm việc', count: staffData.active.length },
    { id: 'pending', label: 'Chờ xác nhận', count: staffData.pending.length },
    { id: 'completed', label: 'Đã hoàn thành', count: staffData.completed.length },
    { id: 'change_request', label: 'Yêu cầu thay đổi', count: staffData.change_request.length }
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

  const renderStaffCard = (staff) => (
    <StaffCard key={staff.id}>
      <StaffHeader>
        <StaffInfo>
          <Avatar>{staff.name.charAt(0)}</Avatar>
          <StaffDetails>
            <h3>{staff.name}</h3>
            <p>{staff.position}</p>
            <StatusBadge $status={staff.status}>
              {staff.status === 'active' && 'Đang làm việc'}
              {staff.status === 'pending' && 'Chờ xác nhận'}
              {staff.status === 'completed' && 'Đã hoàn thành'}
              {staff.status === 'requested' && 'Yêu cầu thay đổi'}
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
          <Users />
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
        <div style={{ marginBottom: '16px', padding: '12px', background: '#FEF3C7', borderRadius: '8px', fontSize: '14px' }}>
          <strong>Lý do:</strong> {staff.reason}
        </div>
      )}

      <ActionButtons>
        {staff.status === 'pending' && (
          <>
            <Button $variant="success" onClick={() => handleConfirmStaff(staff.id)}>
              <CheckCircle />
              Xác nhận
            </Button>
            <Button $variant="danger" onClick={() => handleCloseJob(staff.id)}>
              <XCircle />
              Từ chối
            </Button>
          </>
        )}
        
        {staff.status === 'active' && (
          <>
            <Button $variant="warning" onClick={() => handleRequestChange(staff.id)}>
              <AlertCircle />
              Yêu cầu thay đổi
            </Button>
            <Button $variant="primary" onClick={() => handleCloseJob(staff.id)}>
              <CheckCircle />
              Kết thúc công việc
            </Button>
          </>
        )}
        
        {staff.status === 'completed' && (
          <Button $variant="primary" onClick={() => handleEvaluate(staff.id)}>
            <Star />
            Đánh giá nhân viên
          </Button>
        )}
        
        {staff.status === 'requested' && (
          <>
            <Button $variant="success" onClick={() => handleConfirmStaff(staff.id)}>
              <CheckCircle />
              Chấp nhận
            </Button>
            <Button $variant="danger" onClick={() => handleCloseJob(staff.id)}>
              <XCircle />
              Từ chối
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
          <h1>Quản lý nhân sự</h1>
          <p>Quản lý và theo dõi nhân viên đang làm việc</p>
        </PageHeader>

        <TabContainer>
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({tab.count})
            </Tab>
          ))}
        </TabContainer>

        {currentData.length > 0 ? (
          <StaffGrid>
            {currentData.map(renderStaffCard)}
          </StaffGrid>
        ) : (
          <EmptyState>
            <Users />
            <h3>Chưa có nhân viên</h3>
            <p>Không có nhân viên nào trong danh mục này</p>
          </EmptyState>
        )}
      </PageContainer>
    </DashboardLayout>
  );
};

export default HRManagement;
