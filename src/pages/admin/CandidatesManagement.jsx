import { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, 
  UserCheck,
  UserX,
  Clock,
  Search,
  Filter,
  CheckSquare,
  XSquare,
  Calendar,
  Eye,
  Trash2,
  Briefcase,
  TrendingUp,
  Zap,
  Target,
  Flame,
  Star
} from 'lucide-react';

const PageContainer = styled.div`
  animation: fadeIn 0.5s ease-in;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
    
    @media (max-width: 768px) {
      font-size: 24px;
      margin-bottom: 6px;
    }
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 16px;
    
    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  
  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterSection = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 24px;
  border: 2px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
  }
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 250px;
  position: relative;
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.textLight};
    width: 18px;
    height: 18px;
    
    @media (max-width: 768px) {
      width: 16px;
      height: 16px;
    }
  }
  
  input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    font-size: 14px;
    background: ${props => props.theme.colors.bgDark};
    color: ${props => props.theme.colors.text};
    transition: all 0.2s;
    
    @media (max-width: 768px) {
      padding: 8px 10px 8px 36px;
      font-size: 13px;
    }
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
    
    &::placeholder {
      color: ${props => props.theme.colors.textLight};
    }
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    gap: 8px;
  }
`;

const FilterButton = styled.button`
  padding: 10px 16px;
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgDark};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
    flex: 1;
    justify-content: center;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
  
  svg {
    width: 16px;
    height: 16px;
    
    @media (max-width: 768px) {
      width: 14px;
      height: 14px;
    }
  }
`;

const TableWrapper = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  box-shadow: ${props => props.theme.shadows.card};
  
  @media (max-width: 768px) {
    border-radius: ${props => props.theme.borderRadius.md};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
  
  @media (max-width: 768px) {
    min-width: 700px;
  }
  
  th {
    text-align: left;
    padding: 16px 20px;
    background: ${props => props.theme.colors.bgDark};
    font-weight: 700;
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid ${props => props.theme.colors.border};
    white-space: nowrap;
    
    @media (max-width: 768px) {
      padding: 12px 10px;
      font-size: 11px;
    }
  }
  
  td {
    padding: 16px 20px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    
    @media (max-width: 768px) {
      padding: 12px 10px;
      font-size: 12px;
    }
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
  
  tbody tr {
    transition: all 0.2s;
    
    &:hover {
      background: ${props => props.theme.colors.bgDark};
    }
  }
`;

const VerificationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$verified ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.$verified ? '#15803d' : '#dc2626'};
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.$status === 'success') return '#dcfce7';
    if (props.$status === 'danger') return '#fee2e2';
    if (props.$status === 'info') return '#dbeafe';
    return '#fef3c7';
  }};
  color: ${props => {
    if (props.$status === 'success') return '#15803d';
    if (props.$status === 'danger') return '#dc2626';
    if (props.$status === 'info') return '#2563eb';
    return '#ca8a04';
  }};
`;

const DateText = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 10px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${props => {
    if (props.$variant === 'view') return '#3b82f6';
    if (props.$variant === 'delete') return '#ef4444';
    return '#6b7280';
  }};
  color: white;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const OverviewSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
    gap: 10px;
  }
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$color || props.theme.colors.primary};
    
    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    
    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

const UrgentJobsBox = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const UrgentJobsTitle = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #92400e;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    font-size: 22px;
    gap: 6px;
  }
`;

const UrgentJobsSubtitle = styled.div`
  font-size: 14px;
  color: #78350f;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const BoostGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const BoostItem = styled.div`
  background: ${props => props.$bgColor || '#f3f4f6'};
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    padding: 12px;
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const BoostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const BoostIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$color || '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: white;
    
    @media (max-width: 768px) {
      width: 18px;
      height: 18px;
    }
  }
`;

const BoostLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const BoostValue = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ChartContainer = styled.div`
  height: 280px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    height: 220px;
    margin-top: 16px;
    overflow-x: auto;
  }
`;

const ChartSVG = styled.svg`
  width: 100%;
  height: 100%;
  
  @media (max-width: 768px) {
    min-width: 500px;
  }
`;

const ChartLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

const ActivityTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

const ActivityRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 16px;
  padding: 14px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.md};
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.border};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityUser = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const ActivityAction = styled.div`
  color: ${props => props.theme.colors.textLight};
  font-size: 13px;
`;

const ActivityTime = styled.div`
  color: ${props => props.theme.colors.textLight};
  font-size: 12px;
  text-align: right;
  
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const CandidatesManagement = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data
  const candidates = [
    { 
      id: 1,
      name: 'Nguyễn Văn A', 
      email: 'nguyenvana@example.com', 
      ekycVerified: true,
      approvalStatus: 'approved',
      joined: '2024-03-05',
      reviewDate: '2024-03-15',
    },
    { 
      id: 2,
      name: 'Trần Thị B', 
      email: 'tranthib@example.com', 
      ekycVerified: true,
      approvalStatus: 'unseen',
      joined: '2024-03-04',
      reviewDate: '2024-03-12',
    },
    { 
      id: 3,
      name: 'Lê Văn C', 
      email: 'levanc@example.com', 
      ekycVerified: false,
      approvalStatus: 'unseen',
      joined: '2024-03-03',
      reviewDate: null,
    },
    { 
      id: 4,
      name: 'Phạm Thị D', 
      email: 'phamthid@example.com', 
      ekycVerified: true,
      approvalStatus: 'approved',
      joined: '2024-03-02',
      reviewDate: '2024-03-08',
    },
    { 
      id: 5,
      name: 'Hoàng Văn E', 
      email: 'hoangvane@example.com', 
      ekycVerified: false,
      approvalStatus: 'rejected',
      joined: '2024-03-01',
      reviewDate: '2024-03-06',
    },
    { 
      id: 6,
      name: 'Vũ Thị F', 
      email: 'vuthif@example.com', 
      ekycVerified: true,
      approvalStatus: 'approved',
      joined: '2024-02-28',
      reviewDate: '2024-03-05',
    },
    { 
      id: 7,
      name: 'Đặng Văn G', 
      email: 'dangvang@example.com', 
      ekycVerified: true,
      approvalStatus: 'seen',
      joined: '2024-02-27',
      reviewDate: null,
    },
    { 
      id: 8,
      name: 'Bùi Thị H', 
      email: 'buithih@example.com', 
      ekycVerified: false,
      approvalStatus: 'seen',
      joined: '2024-02-26',
      reviewDate: null,
    },
  ];

  const getApprovalStatusText = (status) => {
    if (status === 'approved') return language === 'vi' ? 'Đã duyệt' : 'Approved';
    if (status === 'rejected') return language === 'vi' ? 'Không duyệt' : 'Rejected';
    if (status === 'unseen') return language === 'vi' ? 'Chưa xem' : 'Not Viewed';
    if (status === 'seen') return language === 'vi' ? 'Đã xem' : 'Viewed';
    return status;
  };

  const getApprovalStatusVariant = (status) => {
    if (status === 'approved') return 'success';
    if (status === 'rejected') return 'danger';
    if (status === 'seen') return 'info';
    return 'warning';
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.approvalStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: filteredCandidates.length,
    approved: filteredCandidates.filter(c => c.approvalStatus === 'approved').length,
    unseen: filteredCandidates.filter(c => c.approvalStatus === 'unseen').length,
    seen: filteredCandidates.filter(c => c.approvalStatus === 'seen').length,
    rejected: filteredCandidates.filter(c => c.approvalStatus === 'rejected').length,
  };

  // Urgent jobs data
  const urgentJobsData = {
    total: 28,
    change: '+47',
    commission: '18,5 triệu VND',
    commissionRate: '15%'
  };

  // Boost packages data
  const boostPackages = [
    { name: 'Quick Boost', count: 16, icon: Zap, color: '#3b82f6', bgColor: '#dbeafe' },
    { name: 'Spongit Banner', count: 6, icon: Target, color: '#8b5cf6', bgColor: '#ede9fe' },
    { name: 'Hot Search', count: 9, icon: Flame, color: '#ef4444', bgColor: '#fee2e2' },
    { name: 'Top Spotlight', count: 4, icon: Star, color: '#f59e0b', bgColor: '#fef3c7' },
  ];

  // Chart data for platform activity
  const chartData = [
    { day: 'T2', registrations: 25, applications: 18 },
    { day: 'T3', registrations: 28, applications: 20 },
    { day: 'T4', registrations: 32, applications: 24 },
    { day: 'T5', registrations: 35, applications: 28 },
    { day: 'T6', registrations: 38, applications: 30 },
    { day: 'T7', registrations: 42, applications: 35 },
    { day: 'CN', registrations: 40, applications: 32 },
  ];

  const maxValue = Math.max(...chartData.flatMap(d => [d.registrations, d.applications]));

  // Recent activity data
  const recentActivity = [
    { user: 'Abc', action: language === 'vi' ? 'Đăng ký tài khoản dùng' : 'Account registration', time: language === 'vi' ? '30 phút trước' : '30 min ago' },
    { user: 'xyz', action: language === 'vi' ? 'Ứng tuyển Bartender' : 'Applied for Bartender', time: language === 'vi' ? '1 giờ trước' : '1 hour ago' },
    { user: 'Design Inc.', action: language === 'vi' ? 'Đăng tin tuyển dụng' : 'Posted job listing', time: language === 'vi' ? '3 giờ trước' : '3 hours ago' },
  ];

  return (
    <DashboardLayout role="admin" key={language}>
      <PageContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Quản Lý Ứng Viên' : 'Candidates Management'}</h1>
          <p>{language === 'vi' ? 'Quản lý thông tin và trạng thái của tất cả ứng viên' : 'Manage information and status of all candidates'}</p>
        </PageHeader>

        <StatsGrid>
          <StatsCard
            title={language === 'vi' ? 'Tổng Ứng Viên' : 'Total Candidates'}
            value={stats.total.toString()}
            icon={Users}
            color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
          <StatsCard
            title={language === 'vi' ? 'Đã Duyệt' : 'Approved'}
            value={stats.approved.toString()}
            icon={UserCheck}
            color="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          />
          <StatsCard
            title={language === 'vi' ? 'Chưa Xem' : 'Not Viewed'}
            value={stats.unseen.toString()}
            icon={Clock}
            color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          />
          <StatsCard
            title={language === 'vi' ? 'Đã Xem' : 'Viewed'}
            value={stats.seen.toString()}
            icon={Eye}
            color="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
          />
          <StatsCard
            title={language === 'vi' ? 'Không Duyệt' : 'Rejected'}
            value={stats.rejected.toString()}
            icon={UserX}
            color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          />
        </StatsGrid>

        <OverviewSection>
          <InfoCard>
            <CardHeader $color="#f59e0b">
              <Briefcase />
              <h3>{language === 'vi' ? 'Bài Tuyển Gấp' : 'Urgent Jobs'}</h3>
            </CardHeader>
            <UrgentJobsBox>
              <UrgentJobsTitle>
                {urgentJobsData.total} {language === 'vi' ? 'Tin tuyển gấp' : 'Urgent jobs'}
                <span style={{ fontSize: '16px', color: '#15803d' }}>{urgentJobsData.change}</span>
              </UrgentJobsTitle>
              <UrgentJobsSubtitle>
                {language === 'vi' ? 'Hoa Hồng' : 'Commission'} {urgentJobsData.commissionRate}: {urgentJobsData.commission}
              </UrgentJobsSubtitle>
            </UrgentJobsBox>
          </InfoCard>

          <InfoCard>
            <CardHeader $color="#8b5cf6">
              <Zap />
              <h3>{language === 'vi' ? 'Gói Boost' : 'Boost Packages'}</h3>
            </CardHeader>
            <BoostGrid>
              {boostPackages.map((pkg, index) => (
                <BoostItem key={index} $bgColor={pkg.bgColor}>
                  <BoostInfo>
                    <BoostIcon $color={pkg.color}>
                      <pkg.icon />
                    </BoostIcon>
                    <BoostLabel>{pkg.name}</BoostLabel>
                  </BoostInfo>
                  <BoostValue>{pkg.count} {language === 'vi' ? 'Tin' : 'Jobs'}</BoostValue>
                </BoostItem>
              ))}
            </BoostGrid>
          </InfoCard>
        </OverviewSection>

        <OverviewSection>
          <InfoCard>
            <CardHeader $color="#3b82f6">
              <TrendingUp />
              <h3>{language === 'vi' ? 'Hoạt Động Nền Tảng' : 'Platform Activity'}</h3>
            </CardHeader>
            <ChartContainer>
              <ChartSVG viewBox="0 0 700 280">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="50"
                    y1={40 + i * 50}
                    x2="650"
                    y2={40 + i * 50}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Registrations line */}
                <polyline
                  points={chartData.map((d, i) => 
                    `${100 + i * 90},${240 - (d.registrations / maxValue) * 180}`
                  ).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                
                {/* Applications line */}
                <polyline
                  points={chartData.map((d, i) => 
                    `${100 + i * 90},${240 - (d.applications / maxValue) * 180}`
                  ).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />
                
                {/* Data points */}
                {chartData.map((d, i) => (
                  <g key={i}>
                    <circle
                      cx={100 + i * 90}
                      cy={240 - (d.registrations / maxValue) * 180}
                      r="5"
                      fill="#3b82f6"
                    />
                    <circle
                      cx={100 + i * 90}
                      cy={240 - (d.applications / maxValue) * 180}
                      r="5"
                      fill="#10b981"
                    />
                    <text
                      x={100 + i * 90}
                      y="265"
                      textAnchor="middle"
                      fontSize="13"
                      fill="#6b7280"
                      fontWeight="600"
                    >
                      {d.day}
                    </text>
                  </g>
                ))}
              </ChartSVG>
            </ChartContainer>
            <ChartLegend>
              <LegendItem>
                <LegendDot $color="#3b82f6" />
                {language === 'vi' ? 'Tin Tuyển Dụng' : 'Job Postings'}
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#10b981" />
                {language === 'vi' ? 'Ứng Tuyển' : 'Applications'}
              </LegendItem>
            </ChartLegend>
          </InfoCard>

          <InfoCard>
            <CardHeader $color="#10b981">
              <Clock />
              <h3>{language === 'vi' ? 'Hoạt Động Gần Đây' : 'Recent Activity'}</h3>
            </CardHeader>
            <ActivityTable>
              {recentActivity.map((activity, index) => (
                <ActivityRow key={index}>
                  <ActivityUser>{activity.user}</ActivityUser>
                  <ActivityAction>{activity.action}</ActivityAction>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityRow>
              ))}
            </ActivityTable>
          </InfoCard>
        </OverviewSection>

        <FilterSection>
          <SearchBox>
            <Search />
            <input
              type="text"
              placeholder={language === 'vi' ? 'Tìm kiếm theo tên hoặc email...' : 'Search by name or email...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          
          <FilterGroup>
            <Filter size={18} />
            <FilterButton
              $active={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
            >
              {language === 'vi' ? 'Tất cả' : 'All'}
            </FilterButton>
            <FilterButton
              $active={statusFilter === 'approved'}
              onClick={() => setStatusFilter('approved')}
            >
              {language === 'vi' ? 'Đã duyệt' : 'Approved'}
            </FilterButton>
            <FilterButton
              $active={statusFilter === 'unseen'}
              onClick={() => setStatusFilter('unseen')}
            >
              {language === 'vi' ? 'Chưa xem' : 'Not Viewed'}
            </FilterButton>
            <FilterButton
              $active={statusFilter === 'seen'}
              onClick={() => setStatusFilter('seen')}
            >
              {language === 'vi' ? 'Đã xem' : 'Viewed'}
            </FilterButton>
            <FilterButton
              $active={statusFilter === 'rejected'}
              onClick={() => setStatusFilter('rejected')}
            >
              {language === 'vi' ? 'Không duyệt' : 'Rejected'}
            </FilterButton>
          </FilterGroup>
        </FilterSection>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>{language === 'vi' ? 'Tên ứng viên' : 'Candidate Name'}</th>
                <th>{language === 'vi' ? 'Email' : 'Email'}</th>
                <th>{language === 'vi' ? 'eKYC (4 bước)' : 'eKYC (4 steps)'}</th>
                <th>{language === 'vi' ? 'Trạng thái duyệt' : 'Approval Status'}</th>
                <th>{language === 'vi' ? 'Ngày tham gia' : 'Join Date'}</th>
                <th>{language === 'vi' ? 'Ngày xét duyệt' : 'Review Date'}</th>
                <th>{language === 'vi' ? 'Thao tác' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td style={{ fontWeight: 600 }}>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>
                    <VerificationBadge $verified={candidate.ekycVerified}>
                      {candidate.ekycVerified ? <CheckSquare /> : <XSquare />}
                      {candidate.ekycVerified 
                        ? (language === 'vi' ? 'Đã xác thực' : 'Verified')
                        : (language === 'vi' ? 'Chưa xác thực' : 'Unverified')
                      }
                    </VerificationBadge>
                  </td>
                  <td>
                    <StatusBadge $status={getApprovalStatusVariant(candidate.approvalStatus)}>
                      {getApprovalStatusText(candidate.approvalStatus)}
                    </StatusBadge>
                  </td>
                  <td>
                    <DateText>
                      <Calendar size={14} />
                      {candidate.joined}
                    </DateText>
                  </td>
                  <td>
                    {candidate.reviewDate ? (
                      <DateText>
                        <Calendar size={14} />
                        {candidate.reviewDate}
                      </DateText>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                        {language === 'vi' ? 'Chưa có' : 'Not set'}
                      </span>
                    )}
                  </td>
                  <td>
                    <ActionButtons>
                      <ActionButton $variant="view">
                        <Eye />
                        {language === 'vi' ? 'Xem' : 'View'}
                      </ActionButton>
                      <ActionButton $variant="delete">
                        <Trash2 />
                        {language === 'vi' ? 'Xóa' : 'Delete'}
                      </ActionButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </PageContainer>
    </DashboardLayout>
  );
};

export default CandidatesManagement;
