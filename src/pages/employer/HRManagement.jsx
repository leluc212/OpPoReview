import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Users, Briefcase, MapPin, Calendar, Clock, CheckCircle, XCircle, Star, AlertCircle } from 'lucide-react';

// ─── Page wrapper ─────────────────────────────────────────
const PageContainer = styled(motion.div)``;

// ─── Page header (đồng nhất Applications) ─────────────────
const PageHeader = styled.div`
  margin-bottom: 28px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const PageTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PageIconBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 15px;
  background: #EFF6FF;
  border: 1.5px solid #BFDBFE;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg { width: 22px; height: 22px; color: #1e40af; }
`;

const PageTitleText = styled.div`
  h1 {
    font-size: 26px;
    font-weight: 800;
    color: ${props => props.theme.colors.text};
    letter-spacing: -0.5px;
    line-height: 1.2;
    margin-bottom: 4px;
  }
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 13.5px;
    font-weight: 500;
  }
`;

const CountBadge = styled.div`
  align-self: flex-start;
  padding: 6px 16px;
  background: #EFF6FF;
  border: 1.5px solid #BFDBFE;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 700;
  color: #1e40af;
  white-space: nowrap;
`;

// ─── Job Type Switcher ─────────────────────────────────────
const JobTypeSwitcher = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
  padding: 5px;
  background: #F1F5F9;
  border-radius: 13px;
  border: 1.5px solid #E2E8F0;
`;

const JobTypeBtn = styled(motion.button)`
  flex: 1;
  padding: 11px 20px;
  background: ${props => props.$active ? '#1e40af' : 'transparent'};
  border: none;
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.$active ? 'white' : '#64748B'};
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$active ? '0 3px 10px rgba(30,64,175,0.28)' : 'none'};
  &:hover {
    color: ${props => props.$active ? 'white' : '#1e40af'};
    background: ${props => props.$active ? '#1e40af' : '#E0EAFF'};
  }
`;

// ─── Sub-tab bar ───────────────────────────────────────────
const TabBar = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
  overflow-x: auto;
  &::-webkit-scrollbar { display: none; }
`;

const TabBtn = styled(motion.button)`
  padding: 8px 18px;
  background: ${props => props.$active ? '#EFF6FF' : 'transparent'};
  border: 1.5px solid ${props => props.$active ? '#BFDBFE' : 'transparent'};
  border-radius: 100px;
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.$active ? '#1e40af' : '#94A3B8'};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  &:hover {
    color: #1e40af;
    background: #EFF6FF;
    border-color: #BFDBFE;
  }
`;

// ─── Card list ─────────────────────────────────────────────
const CardGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const statusColor = (status) => {
  if (status === 'active') return '#10B981';
  if (status === 'pending') return '#F59E0B';
  if (status === 'completed') return '#1e40af';
  if (status === 'requested') return '#EF4444';
  return '#94A3B8';
};

const StaffCard = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  transition: border-color 0.22s ease, box-shadow 0.22s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    border-radius: 16px 0 0 16px;
    background: ${props => statusColor(props.$status)};
    opacity: 0.5;
    transition: opacity 0.2s ease;
  }

  &:hover {
    border-color: #BFDBFE;
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.13);

    &::before { opacity: 1; }
  }
`;

// Expanded card (shows meta + actions below)
const StaffCardExpanded = styled(StaffCard)`
  flex-direction: column;
  align-items: stretch;
  gap: 0;
`;

const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const StaffAvatar = styled.div`
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 12px;
  background: #EFF6FF;
  border: 1.5px solid #BFDBFE;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  color: #1e40af;
  transition: all 0.2s ease;

  ${StaffCard}:hover & {
    background: #1e40af;
    color: white;
    border-color: #1e40af;
  }
  ${StaffCardExpanded}:hover & {
    background: #1e40af;
    color: white;
    border-color: #1e40af;
  }
`;

const StaffInfo = styled.div`
  flex: 0 0 200px;
  min-width: 0;

  .name {
    font-size: 14.5px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .position {
    font-size: 12.5px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const MetaChip = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px 12px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  white-space: nowrap;
  flex-shrink: 0;

  svg { width: 12px; height: 12px; color: #1e40af; opacity: 0.7; flex-shrink: 0; }
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;

  background: ${props => {
    if (props.$status === 'active') return '#ECFDF5';
    if (props.$status === 'pending') return '#FFFBEB';
    if (props.$status === 'completed') return '#EFF6FF';
    if (props.$status === 'requested') return '#FEF2F2';
    return '#F1F5F9';
  }};
  color: ${props => statusColor(props.$status)};
  border: 1.5px solid ${props => {
    if (props.$status === 'active') return '#A7F3D0';
    if (props.$status === 'pending') return '#FDE68A';
    if (props.$status === 'completed') return '#BFDBFE';
    if (props.$status === 'requested') return '#FECACA';
    return '#E2E8F0';
  }};

  .dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`;

const ActionsCol = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
`;

const ActionBtn = styled(motion.button)`
  padding: 8px 14px;
  border-radius: 9px;
  background: ${props =>
    props.$variant === 'success' ? '#10B981' :
    props.$variant === 'danger'  ? '#EF4444' :
    props.$variant === 'warning' ? '#F59E0B' :
    '#1e40af'
  };
  color: white;
  font-size: 12.5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 6px ${props =>
    props.$variant === 'success' ? 'rgba(16,185,129,0.22)' :
    props.$variant === 'danger'  ? 'rgba(239,68,68,0.22)' :
    props.$variant === 'warning' ? 'rgba(245,158,11,0.22)' :
    'rgba(30,64,175,0.22)'
  };
  svg { width: 13px; height: 13px; }
  &:hover {
    filter: brightness(1.08);
    box-shadow: 0 4px 12px ${props =>
      props.$variant === 'success' ? 'rgba(16,185,129,0.32)' :
      props.$variant === 'danger'  ? 'rgba(239,68,68,0.32)' :
      props.$variant === 'warning' ? 'rgba(245,158,11,0.32)' :
      'rgba(30,64,175,0.32)'
    };
  }
  &:active { transform: scale(0.97); }
`;

const MetaRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #F1F5F9;
`;

const ReasonBox = styled.div`
  margin-top: 14px;
  padding: 12px 16px;
  background: #FFFBEB;
  border-radius: 10px;
  border: 1.5px solid #FDE68A;
  font-size: 13px;
  color: #78350F;
  strong { font-weight: 700; color: #92400E; }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 16px;
  border: 1.5px dashed #E2E8F0;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.05);

  .icon { font-size: 36px; margin-bottom: 12px; opacity: 0.5; }
  h3 { font-size: 18px; font-weight: 700; margin-bottom: 6px; color: ${props => props.theme.colors.text}; }
  p { font-size: 14px; color: ${props => props.theme.colors.textLight}; }
`;

// ─── Component ─────────────────────────────────────────────
const HRManagement = () => {
  const { language } = useLanguage();
  const [jobType, setJobType] = useState('standard');
  const [activeTab, setActiveTab] = useState('active');

  const allStaffData = {
    standard: {
      active: [
        {
          id: 1,
          name: language === 'vi' ? 'Nguyễn Văn A' : 'Nguyen Van A',
          position: language === 'vi' ? 'Kỹ sư phần mềm' : 'Software Engineer',
          startDate: '01/01/2026',
          shift: language === 'vi' ? 'Toàn thời gian' : 'Full-time',
          location: language === 'vi' ? 'Quận 3, TP.HCM' : 'District 3, HCMC',
          status: 'active',
          jobType: 'standard'
        },
        {
          id: 2,
          name: language === 'vi' ? 'Trần Thị B' : 'Tran Thi B',
          position: language === 'vi' ? 'Kế toán' : 'Accountant',
          startDate: '15/12/2025',
          shift: language === 'vi' ? 'Toàn thời gian' : 'Full-time',
          location: language === 'vi' ? 'Quận Phú Nhuận, TP.HCM' : 'Phu Nhuan Dist., HCMC',
          status: 'active',
          jobType: 'standard'
        }
      ],
      pending: [
        {
          id: 101,
          name: language === 'vi' ? 'Hiếu sàn' : 'Hieu san',
          position: 'Senior React Developer',
          startDate: language === 'vi' ? '2 giờ trước' : '2 hours ago',
          shift: language === 'vi' ? 'Toàn thời gian' : 'Full-time',
          location: language === 'vi' ? 'Quận 1, TP.HCM' : 'District 1, HCMC',
          status: 'pending',
          jobType: 'standard'
        },
        {
          id: 102,
          name: language === 'vi' ? 'Duy sàn' : 'Duy san',
          position: language === 'vi' ? 'Thu ngân' : 'Cashier',
          startDate: language === 'vi' ? '5 giờ trước' : '5 hours ago',
          shift: language === 'vi' ? 'Toàn thời gian' : 'Full-time',
          location: language === 'vi' ? 'Quận Bình Thạnh, TP.HCM' : 'Binh Thanh Dist., HCMC',
          status: 'pending',
          jobType: 'standard'
        },
      ],
      completed: [
        {
          id: 4,
          name: language === 'vi' ? 'Phạm Thị D' : 'Pham Thi D',
          position: language === 'vi' ? 'Nhân viên hành chính' : 'Admin Staff',
          startDate: '01/10/2025',
          endDate: '28/02/2026',
          shift: language === 'vi' ? 'Toàn thời gian' : 'Full-time',
          location: language === 'vi' ? 'Quận Phú Nhuận, TP.HCM' : 'Phu Nhuan Dist., HCMC',
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
          shift: language === 'vi' ? 'Ca sáng 8:00 - 12:00' : 'Morning 8:00 - 12:00',
          location: language === 'vi' ? 'Quận Tân Bình, TP.HCM' : 'Tan Binh Dist., HCMC',
          status: 'active',
          jobType: 'quick'
        },
        {
          id: 12,
          name: language === 'vi' ? 'Trần Thị Y' : 'Tran Thi Y',
          position: language === 'vi' ? 'Nhân viên kho' : 'Warehouse Staff',
          startDate: '12/02/2026',
          shift: language === 'vi' ? 'Ca chiều 13:00 - 17:00' : 'Afternoon 13:00 - 17:00',
          location: language === 'vi' ? 'Quận 7, TP.HCM' : 'District 7, HCMC',
          status: 'active',
          jobType: 'quick'
        }
      ],
      pending: [
        {
          id: 103,
          name: 'Zun',
          position: language === 'vi' ? 'Nhân viên phục vụ' : 'Waiter/Server',
          startDate: language === 'vi' ? '1 tuần trước' : '1 week ago',
          shift: language === 'vi' ? 'Ca linh hoạt' : 'Flexible shift',
          location: language === 'vi' ? 'Quận Gò Vấp, TP.HCM' : 'Go Vap Dist., HCMC',
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
          shift: language === 'vi' ? 'Ca tối 18:00 - 22:00' : 'Evening 18:00 - 22:00',
          location: language === 'vi' ? 'Quận 4, TP.HCM' : 'District 4, HCMC',
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
          shift: language === 'vi' ? 'Ca sáng 8:00 - 12:00' : 'Morning 8:00 - 12:00',
          location: language === 'vi' ? 'Quận 10, TP.HCM' : 'District 10, HCMC',
          status: 'requested',
          reason: language === 'vi' ? 'Yêu cầu thay đổi ca làm việc' : 'Request to change work shift',
          jobType: 'quick'
        }
      ]
    }
  };

  const staffData = allStaffData[jobType];

  const tabs = [
    { id: 'active',         label: language === 'vi' ? 'Đang làm việc' : 'Active',           count: staffData.active.length },
    { id: 'pending',        label: language === 'vi' ? 'Chờ xác nhận' : 'Pending',            count: staffData.pending.length },
    { id: 'completed',      label: language === 'vi' ? 'Đã hoàn thành' : 'Completed',         count: staffData.completed.length },
    ...(jobType === 'quick' ? [{ id: 'change_request', label: language === 'vi' ? 'Yêu cầu thay đổi' : 'Change Requests', count: staffData.change_request.length }] : []),
  ];

  const currentData = staffData[activeTab] || [];

  const statusLabel = (s) => {
    const map = {
      vi:  { active: 'Đang làm việc', pending: 'Chờ xác nhận', completed: 'Đã hoàn thành', requested: 'Yêu cầu thay đổi' },
      en:  { active: 'Active', pending: 'Pending', completed: 'Completed', requested: 'Change request' },
    };
    return map[language]?.[s] || s;
  };

  const renderCard = (staff, index) => {
    const initials = staff.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    return (
      <StaffCardExpanded
        key={staff.id}
        $status={staff.status}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.25, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ y: -2 }}
        layout
      >
        {/* Top row */}
        <CardRow>
          <StaffAvatar>{initials}</StaffAvatar>

          <StaffInfo>
            <div className="name">{staff.name}</div>
            <div className="position">{staff.position}</div>
          </StaffInfo>

          <MetaChip><Clock />{staff.startDate}</MetaChip>
          <MetaChip><MapPin />{staff.location}</MetaChip>
          <MetaChip><Briefcase />{staff.shift}</MetaChip>
          {staff.rating && (
            <MetaChip><Star style={{color:'#F59E0B'}} />  {staff.rating}/5</MetaChip>
          )}

          <StatusPill $status={staff.status}>
            <span className="dot" />
            {statusLabel(staff.status)}
          </StatusPill>

          <ActionsCol>
            {staff.status === 'pending' && (
              <>
                <ActionBtn $variant="success" whileTap={{ scale: 0.97 }}>
                  <CheckCircle />{language === 'vi' ? 'Xác nhận' : 'Confirm'}
                </ActionBtn>
                <ActionBtn $variant="danger" whileTap={{ scale: 0.97 }}>
                  <XCircle />{language === 'vi' ? 'Từ chối' : 'Reject'}
                </ActionBtn>
              </>
            )}
            {staff.status === 'active' && (
              <>
                <ActionBtn $variant="warning" whileTap={{ scale: 0.97 }}>
                  <AlertCircle />{language === 'vi' ? 'Yêu cầu thay đổi' : 'Request change'}
                </ActionBtn>
                <ActionBtn $variant="primary" whileTap={{ scale: 0.97 }}>
                  <XCircle />{language === 'vi' ? 'Kết thúc' : 'End'}
                </ActionBtn>
              </>
            )}
            {staff.status === 'completed' && (
              <ActionBtn $variant="primary" whileTap={{ scale: 0.97 }}>
                <Star />{language === 'vi' ? 'Đánh giá' : 'Rate'}
              </ActionBtn>
            )}
            {staff.status === 'requested' && (
              <>
                <ActionBtn $variant="success" whileTap={{ scale: 0.97 }}>
                  <CheckCircle />{language === 'vi' ? 'Chấp nhận' : 'Accept'}
                </ActionBtn>
                <ActionBtn $variant="danger" whileTap={{ scale: 0.97 }}>
                  <XCircle />{language === 'vi' ? 'Từ chối' : 'Reject'}
                </ActionBtn>
              </>
            )}
          </ActionsCol>
        </CardRow>

        {/* Reason box for change requests */}
        {staff.reason && (
          <ReasonBox>
            <strong>{language === 'vi' ? 'Lý do: ' : 'Reason: '}</strong>{staff.reason}
          </ReasonBox>
        )}
      </StaffCardExpanded>
    );
  };

  return (
    <DashboardLayout role="employer">
      <PageContainer
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Header */}
        <PageHeader>
          <PageTitleGroup>
            <PageIconBox><Users /></PageIconBox>
            <PageTitleText>
              <h1>{language === 'vi' ? 'Quản lý nhân sự' : 'HR Management'}</h1>
              <p>{language === 'vi' ? 'Quản lý và theo dõi nhân viên đang làm việc' : 'Manage and track your active workforce'}</p>
            </PageTitleText>
          </PageTitleGroup>
          <CountBadge>
            {currentData.length} {language === 'vi' ? 'nhân viên' : 'staff'}
          </CountBadge>
        </PageHeader>

        {/* Job type switcher */}
        <JobTypeSwitcher>
          <JobTypeBtn
            $active={jobType === 'standard'}
            onClick={() => { setJobType('standard'); setActiveTab('active'); }}
            whileTap={{ scale: 0.98 }}
          >
            {language === 'vi' ? 'Công việc tiêu chuẩn' : 'Standard Jobs'}
          </JobTypeBtn>
          <JobTypeBtn
            $active={jobType === 'quick'}
            onClick={() => { setJobType('quick'); setActiveTab('active'); }}
            whileTap={{ scale: 0.98 }}
          >
            {language === 'vi' ? 'Công việc theo ca' : 'Quick Jobs'}
          </JobTypeBtn>
        </JobTypeSwitcher>

        {/* Sub-tabs */}
        <TabBar>
          {tabs.map(tab => (
            <TabBtn
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.97 }}
            >
              {tab.label} ({tab.count})
            </TabBtn>
          ))}
        </TabBar>

        {/* Cards */}
        <CardGrid>
          <AnimatePresence mode="popLayout">
            {currentData.length > 0 ? (
              currentData.map((staff, index) => renderCard(staff, index))
            ) : (
              <EmptyState
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="icon">👥</div>
                <h3>{language === 'vi' ? 'Chưa có nhân viên' : 'No staff yet'}</h3>
                <p>{language === 'vi' ? 'Không có nhân viên nào trong danh mục này' : 'No staff members in this category'}</p>
              </EmptyState>
            )}
          </AnimatePresence>
        </CardGrid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default HRManagement;
