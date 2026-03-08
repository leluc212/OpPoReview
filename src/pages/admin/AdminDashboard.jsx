import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import { useLanguage } from '../../context/LanguageContext';
import { jobPosts } from '../../data/jobPosts';
import { Users, Briefcase, Building2, DollarSign, CheckSquare, XSquare, Shield, Calendar, ArrowRight, Zap, TrendingUp, Star, Sparkles } from 'lucide-react';

const DashboardContainer = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 48px;
  
  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatBox = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  border-left: 4px solid ${props => props.$borderColor || '#3b82f6'};
  box-shadow: ${props => props.theme.shadows.card};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$bgColor || '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatChange = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatDescription = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  margin-top: 8px;
  font-weight: 500;
`;

const Section = styled.section`
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    position: relative;
    padding-left: 16px;
    
    @media (max-width: 768px) {
      font-size: 20px;
      padding-left: 12px;
    }
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 28px;
      background: ${props => props.theme.colors.gradientPrimary};
      border-radius: 3px;
      
      @media (max-width: 768px) {
        width: 4px;
        height: 22px;
      }
    }
  }
`;

const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    opacity: 0.9;
    transform: translateX(2px);
  }
  
  transition: all 0.2s;
`;

const BoostSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;
  margin-bottom: 40px;
  align-items: stretch;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const BoostCard = styled.div`
  background: ${props => props.$bgColor || '#FFF9E6'};
  border-radius: 16px;
  padding: 32px 36px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const BoostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$color || '#F59E0B'};
  }
  
  h3 {
    font-size: 15px;
    font-weight: 700;
    color: #1F2937;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const BoostStats = styled.div`
  margin-bottom: 0;
`;

const BoostMainStat = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
  
  .number {
    font-size: 56px;
    font-weight: 900;
    color: #1F2937;
    line-height: 1;
  }
  
  .label {
    font-size: 20px;
    font-weight: 600;
    color: #6B7280;
  }
  
  .change {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #10B981;
    background: #D1FAE5;
    padding: 5px 12px;
    border-radius: 20px;
  }
`;

const BoostSubStat = styled.div`
  font-size: 16px;
  color: #6B7280;
  font-weight: 500;
`;

const BoostOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
  justify-items: center;
  padding: 16px 0 0 0;
`;

const BoostOption = styled.div`
  background: white;
  border-radius: 16px;
  padding: 28px 32px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  width: 260px;
  max-width: 100%;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
  
  .icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.$iconBg || '#DBEAFE'};
    flex-shrink: 0;
    
    svg {
      width: 28px;
      height: 28px;
      color: ${props => props.$iconColor || '#1E40AF'};
    }
  }
  
  .content {
    flex: 1;
    
    .name {
      font-size: 16px;
      font-weight: 700;
      color: #1F2937;
      margin-bottom: 6px;
    }
    
    .count {
      font-size: 28px;
      font-weight: 800;
      color: #1F2937;
      
      span {
        font-size: 15px;
        font-weight: 600;
        color: #6B7280;
        margin-left: 6px;
      }
    }
  }
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const RevenueSection = styled.div`
  margin-bottom: 40px;
`;

const RevenueChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`;

const RevenueStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RevenueStatBox = styled.div`
  background: ${props => props.$bgColor || '#EFF6FF'};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    svg {
      width: 24px;
      height: 24px;
      color: ${props => props.$iconColor || '#1E40AF'};
    }
  }
  
  .content {
    flex: 1;
    
    .label {
      font-size: 13px;
      font-weight: 600;
      color: #6B7280;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
    
    .value {
      font-size: 22px;
      font-weight: 700;
      color: #1F2937;
    }
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #1F2937;
  }
`;

const ChartFilters = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  
  button {
    padding: 6px 12px;
    border: 1px solid #E5E7EB;
    background: white;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    color: #6B7280;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover, &.active {
      background: #EFF6FF;
      border-color: #3B82F6;
      color: #1E40AF;
    }
  }
`;

const ChartLegend = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  position: relative;
`;

const SimpleBarChart = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 250px;
  gap: 8px;
  padding: 20px 0;
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 4px;
  
  .bars {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 200px;
    width: 100%;
    justify-content: center;
  }
  
  .bar {
    width: 20px;
    border-radius: 4px 4px 0 0;
    transition: all 0.3s;
    cursor: pointer;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  .label {
    font-size: 11px;
    color: #6B7280;
    font-weight: 500;
  }
`;

const SimpleLineChart = styled.div`
  height: 300px;
  position: relative;
  padding: 20px 0;
`;

const LineChartSvg = styled.svg`
  width: 100%;
  height: 100%;
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
  min-width: 800px;
  
  @media (max-width: 768px) {
    min-width: 600px;
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
    cursor: pointer;
    
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
    return '#fef3c7';
  }};
  color: ${props => {
    if (props.$status === 'success') return '#15803d';
    if (props.$status === 'danger') return '#dc2626';
    return '#ca8a04';
  }};
`;

const DateText = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  display: block;
  
  &.interview {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
  }
`;

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Calculate real statistics from data
  const totalCandidates = 100; // From CandidatesManagement.jsx
  const totalEmployers = 30; // From EmployersManagement.jsx
  const totalJobPosts = jobPosts.length; // From jobPosts.js
  
  // Calculate revenue from services (example calculation)
  const revenueFromBoost = 4200000; // 4.2M VND
  const revenueFromHotSearch = 3100000; // 3.1M VND
  const revenueFromBanner = 7500000; // 7.5M VND
  const totalRevenue = revenueFromBoost + revenueFromHotSearch + revenueFromBanner; // 14.8M VND
  
  // Sample data for recent candidates
  const recentCandidates = [
    { 
      id: 1,
      name: 'Mai Thanh Tuấn', 
      email: 'Tuanmaytinh@gmail.com', 
      ekycVerified: true,
      approvalStatus: 'approved',
      joined: '2026-03-05',
      interviewDate: '2026-03-15',
    },
    { 
      id: 2,
      name: 'Trần Thị Thu Chi', 
      email: 'thuchi12795@gmail.com', 
      ekycVerified: true,
      approvalStatus: 'pending',
      joined: '2026-03-04',
      interviewDate: '2026-03-12',
    },
    { 
      id: 3,
      name: 'Ngô Thanh Sơn', 
      email: 'Alibaba05623@gmail.com', 
      ekycVerified: false,
      approvalStatus: 'pending',
      joined: '2026-03-03',
      interviewDate: '2026-03-10',
    },
    { 
      id: 4,
      name: 'Phạm Thị Thu Thao', 
      email: 'thuthao123@gmail.com', 
      ekycVerified: true,
      approvalStatus: 'approved',
      joined: '2026-03-02',
      interviewDate: '2026-03-08',
    },
    { 
      id: 5,
      name: 'Hoàng Yến Vy', 
      email: 'dori.hyv@gmail.com', 
      ekycVerified: false,
      approvalStatus: 'rejected',
      joined: '2026-03-01',
      interviewDate: null,
    },
  ];

  // Sample data for recent employers
  const recentEmployers = [
    { 
      id: 1,
      name: 'Katinat chi nhánh quận 8', 
      email: 'hr@katinat.com', 
      verified: true,
      approvalStatus: 'approved',
      joined: '2026-03-06',
      interviewDate: '2026-03-14',
    },
    { 
      id: 2,
      name: 'The Coffee House chi nhánh Bình Thạnh', 
      email: 'recruit@thecoffeehouse.com', 
      verified: true,
      approvalStatus: 'approved',
      joined: '2026-03-05',
      interviewDate: '2026-03-13',
    },
    { 
      id: 3,
      name: 'D coffee', 
      email: 'hr@dcoffee.com', 
      verified: false,
      approvalStatus: 'pending',
      joined: '2026-03-04',
      interviewDate: '2026-03-11',
    },
    { 
      id: 4,
      name: 'Quán lẩu 88', 
      email: 'jobs@quanlau88.com', 
      verified: false,
      approvalStatus: 'pending',
      joined: '2026-03-03',
      interviewDate: '2026-03-09',
    },
    { 
      id: 5,
      name: 'Nhà hàng cưới Victory', 
      email: 'careers@victoryvn.com', 
      verified: true,
      approvalStatus: 'approved',
      joined: '2026-03-02',
      interviewDate: '2026-03-07',
    },
  ];
  
  const getApprovalStatusText = (status) => {
    if (status === 'approved') return language === 'vi' ? 'Đã duyệt' : 'Approved';
    if (status === 'rejected') return language === 'vi' ? 'Không duyệt' : 'Rejected';
    if (status === 'pending') return language === 'vi' ? 'Chờ duyệt' : 'Pending';
    return status;
  };

  // Data cho biểu đồ
  const platformData = {
    totalJobs: 28,
    change: '+47',
    discount: '15%',
    price: '18,5 triệu VND'
  };

  const boostPackages = [
    { name: language === 'vi' ? 'Quick Boost' : 'Quick Boost', count: 16, iconBg: '#DBEAFE', iconColor: '#1E40AF' },
    { name: language === 'vi' ? 'Spongit Banner' : 'Spongit Banner', count: 6, iconBg: '#E0E7FF', iconColor: '#4F46E5' },
    { name: language === 'vi' ? 'Hot Search' : 'Hot Search', count: 9, iconBg: '#FEE2E2', iconColor: '#DC2626' },
    { name: language === 'vi' ? 'Top Spotlight' : 'Top Spotlight', count: 4, iconBg: '#FCE7F3', iconColor: '#BE185D' }
  ];

  // Dữ liệu chuẩn cho biểu đồ - sử dụng thống nhất cho toàn bộ website
  const activityData = [
    { date: '18/4', posts: 35, applications: 28 },
    { date: '19/4', posts: 42, applications: 35 },
    { date: '20/4', posts: 48, applications: 40 },
    { date: '21/4', posts: 55, applications: 45 },
    { date: '22/4', posts: 62, applications: 52 },
    { date: '23/4', posts: 68, applications: 58 },
    { date: '24/4', posts: 75, applications: 65 }
  ];

  const jobStatsData = activityData; // Sử dụng cùng dữ liệu cho thống nhất

  const getApprovalStatusVariant = (status) => {
    if (status === 'approved') return 'success';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  return (
    <DashboardLayout role="admin" key={language}>
      <DashboardContainer>
        {/* 4 Thống kê chính */}
        <StatsGrid>
          <StatBox $borderColor="#667eea">
            <StatHeader>
              <StatIcon $bgColor="#667eea">
                <Users />
              </StatIcon>
              <StatContent>
                <StatTitle>{language === 'vi' ? 'Tổng ứng viên' : 'Total Candidates'}</StatTitle>
                <StatValue>
                  {totalCandidates.toLocaleString()}
                  <StatChange $positive={true}>
                    ↗ +12%
                  </StatChange>
                </StatValue>
              </StatContent>
            </StatHeader>
            <StatDescription>
              {language === 'vi' ? 'so với tháng trước' : 'vs last month'}
            </StatDescription>
          </StatBox>

          <StatBox $borderColor="#10b981">
            <StatHeader>
              <StatIcon $bgColor="#10b981">
                <Building2 />
              </StatIcon>
              <StatContent>
                <StatTitle>{language === 'vi' ? 'Tổng nhà tuyển dụng' : 'Total Employers'}</StatTitle>
                <StatValue>
                  {totalEmployers.toLocaleString()}
                  <StatChange $positive={true}>
                    ↗ +8%
                  </StatChange>
                </StatValue>
              </StatContent>
            </StatHeader>
            <StatDescription>
              {language === 'vi' ? 'so với tháng trước' : 'vs last month'}
            </StatDescription>
          </StatBox>

          <StatBox $borderColor="#3b82f6">
            <StatHeader>
              <StatIcon $bgColor="#3b82f6">
                <Briefcase />
              </StatIcon>
              <StatContent>
                <StatTitle>{language === 'vi' ? 'Bài đăng tuyển dụng' : 'Job Posts'}</StatTitle>
                <StatValue>
                  {totalJobPosts.toLocaleString()}
                  <StatChange $positive={true}>
                    ↗ +15%
                  </StatChange>
                </StatValue>
              </StatContent>
            </StatHeader>
            <StatDescription>
              {language === 'vi' ? 'so với tháng trước' : 'vs last month'}
            </StatDescription>
          </StatBox>

          <StatBox $borderColor="#f59e0b">
            <StatHeader>
              <StatIcon $bgColor="#f59e0b">
                <DollarSign />
              </StatIcon>
              <StatContent>
                <StatTitle>{language === 'vi' ? 'Tổng doanh thu' : 'Total Revenue'}</StatTitle>
                <StatValue>
                  {(totalRevenue / 1000000).toFixed(1)}M
                  <StatChange $positive={true}>
                    ↗ +23%
                  </StatChange>
                </StatValue>
              </StatContent>
            </StatHeader>
            <StatDescription>
              {language === 'vi' ? 'VND - tháng này' : 'VND - this month'}
            </StatDescription>
          </StatBox>
        </StatsGrid>

        {/* Tin tuyển gấp & Gói Boost */}
        <BoostSection>
          {/* Tin tuyển gấp */}
          <BoostCard $bgColor="#FFF9E6">
            <BoostHeader $color="#F59E0B">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <h3>{language === 'vi' ? 'BÀI TUYỂN GẤP' : 'URGENT JOBS'}</h3>
            </BoostHeader>
            <BoostStats>
              <BoostMainStat>
                <span className="number">{platformData.totalJobs}</span>
                <span className="label">{language === 'vi' ? 'Tin tuyển gấp' : 'Urgent Jobs'}</span>
                <span className="change">{platformData.change}</span>
              </BoostMainStat>
              <BoostSubStat>
                {language === 'vi' ? `Hoa Hồng ${platformData.discount}: ${platformData.price}` : `Commission ${platformData.discount}: ${platformData.price}`}
              </BoostSubStat>
            </BoostStats>
          </BoostCard>

          {/* Gói Boost */}
          <BoostCard $bgColor="#F0F9FF">
            <BoostHeader $color="#1E40AF">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              <h3>{language === 'vi' ? 'GÓI BOOST' : 'BOOST PACKAGES'}</h3>
            </BoostHeader>
            <BoostOptions>
              {boostPackages.map((pkg, index) => {
                // Chọn icon dựa trên tên gói
                let IconComponent;
                if (pkg.name === 'Quick Boost') IconComponent = Zap;
                else if (pkg.name === 'Spongit Banner') IconComponent = Star;
                else if (pkg.name === 'Hot Search') IconComponent = TrendingUp;
                else if (pkg.name === 'Top Spotlight') IconComponent = Sparkles;
                else IconComponent = Briefcase;
                
                return (
                  <BoostOption key={index} $iconBg={pkg.iconBg} $iconColor={pkg.iconColor}>
                    <div className="icon">
                      <IconComponent />
                    </div>
                    <div className="content">
                      <div className="name">{pkg.name}</div>
                      <div className="count">
                        {pkg.count} <span>{language === 'vi' ? 'Tin' : 'Jobs'}</span>
                      </div>
                    </div>
                  </BoostOption>
                );
              })}
            </BoostOptions>
          </BoostCard>
        </BoostSection>

        {/* Biểu đồ Hoạt động nền tảng */}
        <ChartsSection>
          {/* Line Chart - Hoạt động nền tảng */}
          <ChartCard>
            <ChartHeader>
              <h3>{language === 'vi' ? 'Hoạt động Nền Tảng' : 'Platform Activity'}</h3>
              <ChartFilters>
                <button className="active">{language === 'vi' ? 'Tuần' : 'Week'}</button>
                <button>{language === 'vi' ? 'Tháng' : 'Month'}</button>
                <button>{language === 'vi' ? 'Năm' : 'Year'}</button>
              </ChartFilters>
            </ChartHeader>
            <ChartLegend>
              <div className="legend-item">
                <div className="dot" style={{ background: '#3B82F6' }}></div>
                <span>{language === 'vi' ? 'Tin đăng' : 'Posts'}</span>
              </div>
              <div className="legend-item">
                <div className="dot" style={{ background: '#10B981' }}></div>
                <span>{language === 'vi' ? 'Ứng tuyển' : 'Applications'}</span>
              </div>
            </ChartLegend>
            <SimpleLineChart>
              <LineChartSvg viewBox="0 0 700 320">
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="50"
                    y1={50 + i * 50}
                    x2="650"
                    y2={50 + i * 50}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Y-axis labels */}
                {['80', '60', '40', '20', '0'].map((val, i) => (
                  <text
                    key={i}
                    x="40"
                    y={55 + i * 50}
                    textAnchor="end"
                    fontSize="11"
                    fill="#9ca3af"
                    fontWeight="400"
                  >
                    {val}
                  </text>
                ))}
                
                {/* Posts line with area */}
                <polyline
                  fill="url(#gradient1)"
                  stroke="none"
                  points={`50,250 ${activityData.map((d, i) => 
                    `${50 + (i / (activityData.length - 1)) * 600},${250 - (d.posts / 80) * 200}`
                  ).join(' ')} 650,250`}
                />
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={activityData.map((d, i) => 
                    `${50 + (i / (activityData.length - 1)) * 600},${250 - (d.posts / 80) * 200}`
                  ).join(' ')}
                />
                
                {/* Applications line with area */}
                <polyline
                  fill="url(#gradient2)"
                  stroke="none"
                  points={`50,250 ${activityData.map((d, i) => 
                    `${50 + (i / (activityData.length - 1)) * 600},${250 - (d.applications / 80) * 200}`
                  ).join(' ')} 650,250`}
                />
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={activityData.map((d, i) => 
                    `${50 + (i / (activityData.length - 1)) * 600},${250 - (d.applications / 80) * 200}`
                  ).join(' ')}
                />
                
                {/* Data points with values */}
                {activityData.map((d, i) => {
                  const x = 50 + (i / (activityData.length - 1)) * 600;
                  const yPosts = 250 - (d.posts / 80) * 200;
                  const yApps = 250 - (d.applications / 80) * 200;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={yPosts} r="4" fill="#3B82F6" stroke="white" strokeWidth="2" />
                      <circle cx={x} cy={yApps} r="4" fill="#10B981" stroke="white" strokeWidth="2" />
                      
                      {/* Value labels */}
                      <text x={x} y={yPosts - 10} textAnchor="middle" fontSize="10" fill="#3B82F6" fontWeight="600">
                        {d.posts}
                      </text>
                      <text x={x} y={yApps - 10} textAnchor="middle" fontSize="10" fill="#10B981" fontWeight="600">
                        {d.applications}
                      </text>
                      
                      {/* Date labels */}
                      <text x={x} y="275" textAnchor="middle" fontSize="11" fill="#6b7280" fontWeight="400">
                        {d.date}
                      </text>
                    </g>
                  );
                })}
              </LineChartSvg>
            </SimpleLineChart>
          </ChartCard>

          {/* Bar Chart - Thống kê công việc */}
          <ChartCard>
            <ChartHeader>
              <h3>{language === 'vi' ? 'Thống Kê Công Việc' : 'Job Statistics'}</h3>
              <ChartFilters>
                <button className="active">{language === 'vi' ? '7 ngày' : '7 days'}</button>
                <button>{language === 'vi' ? '30 ngày' : '30 days'}</button>
              </ChartFilters>
            </ChartHeader>
            <ChartLegend>
              <div className="legend-item">
                <div className="dot" style={{ background: '#3B82F6' }}></div>
                <span>{language === 'vi' ? 'Tin đăng' : 'Posts'}</span>
              </div>
              <div className="legend-item">
                <div className="dot" style={{ background: '#10B981' }}></div>
                <span>{language === 'vi' ? 'Ứng tuyển' : 'Applications'}</span>
              </div>
            </ChartLegend>
            <div style={{ position: 'relative', height: '250px', paddingTop: '20px' }}>
              <SimpleBarChart>
                {jobStatsData.map((data, index) => {
                  const maxValue = 80;
                  return (
                    <BarGroup key={index}>
                      <div className="bars">
                        <div style={{ position: 'relative' }}>
                          <div
                            className="bar"
                            style={{
                              height: `${(data.posts / maxValue) * 100}%`,
                              background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)'
                            }}
                            title={`${language === 'vi' ? 'Tin đăng' : 'Posts'}: ${data.posts}`}
                          />
                          <div style={{
                            position: 'absolute',
                            top: '-18px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '10px',
                            fontWeight: '600',
                            color: '#3B82F6',
                            whiteSpace: 'nowrap'
                          }}>
                            {data.posts}
                          </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <div
                            className="bar"
                            style={{
                              height: `${(data.applications / maxValue) * 100}%`,
                              background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)'
                            }}
                            title={`${language === 'vi' ? 'Ứng tuyển' : 'Applications'}: ${data.applications}`}
                          />
                          <div style={{
                            position: 'absolute',
                            top: '-18px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '10px',
                            fontWeight: '600',
                            color: '#10B981',
                            whiteSpace: 'nowrap'
                          }}>
                            {data.applications}
                          </div>
                        </div>
                      </div>
                      <div className="label">{data.date}</div>
                    </BarGroup>
                  );
                })}
              </SimpleBarChart>
            </div>
          </ChartCard>
        </ChartsSection>

        {/* Doanh Thu Từ Dịch Vụ */}
        <RevenueSection>
          <SectionHeader>
            <h2>{language === 'vi' ? 'Doanh Thu Từ Dịch Vụ' : 'Revenue From Services'}</h2>
          </SectionHeader>
          
          <RevenueChartCard>
            <ChartHeader>
              <h3>{language === 'vi' ? 'Xu Hướng Doanh Thu' : 'Revenue Trend'}</h3>
              <ChartFilters>
                <button className="active">{language === 'vi' ? '6 Tháng' : '6 Months'}</button>
                <button>{language === 'vi' ? 'Năm' : 'Year'}</button>
                <button>{language === 'vi' ? 'Tất cả' : 'All'}</button>
              </ChartFilters>
            </ChartHeader>
            
            {/* Legend */}
            <ChartLegend>
              <div className="legend-item">
                <div className="dot" style={{ background: '#3b82f6' }}></div>
                <span>{language === 'vi' ? 'Doanh thu thực tế' : 'Actual Revenue'}</span>
              </div>
              <div className="legend-item">
                <div className="dot" style={{ background: '#10b981' }}></div>
                <span>{language === 'vi' ? 'Mục tiêu' : 'Target'}</span>
              </div>
            </ChartLegend>
            
            <SimpleLineChart>
              <LineChartSvg viewBox="0 0 900 320" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <line
                    key={i}
                    x1="70"
                    y1={30 + i * 40}
                    x2="870"
                    y2={30 + i * 40}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Y-axis labels */}
                {['6M', '5M', '4M', '3M', '2M', '1M', '0'].map((val, i) => (
                  <text
                    key={i}
                    x="55"
                    y={35 + i * 40}
                    textAnchor="end"
                    fontSize="11"
                    fill="#9ca3af"
                    fontWeight="400"
                  >
                    {val}
                  </text>
                ))}
                
                {/* Green target curve with area */}
                <path
                  d="M 120 195 Q 220 180, 320 165 Q 420 145, 520 130 Q 620 115, 720 100 Q 770 95, 820 90 L 820 270 L 120 270 Z"
                  fill="url(#greenGradient)"
                />
                <path
                  d="M 120 195 Q 220 180, 320 165 Q 420 145, 520 130 Q 620 115, 720 100 Q 770 95, 820 90"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                
                {/* Blue revenue curve with area */}
                <path
                  d="M 120 210 Q 220 190, 320 170 Q 420 145, 520 125 Q 620 100, 720 80 Q 770 70, 820 60 L 820 270 L 120 270 Z"
                  fill="url(#blueGradient)"
                />
                <path
                  d="M 120 210 Q 220 190, 320 170 Q 420 145, 520 125 Q 620 100, 720 80 Q 770 70, 820 60"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                
                {/* Data points with values */}
                {[
                  { x: 120, yBlue: 210, yGreen: 195, label: language === 'vi' ? 'T1' : 'Jan', valueBlue: '2.1M', valueGreen: '2.5M' },
                  { x: 220, yBlue: 190, yGreen: 180, label: language === 'vi' ? 'T2' : 'Feb', valueBlue: '2.6M', valueGreen: '2.8M' },
                  { x: 320, yBlue: 170, yGreen: 165, label: language === 'vi' ? 'T3' : 'Mar', valueBlue: '3.1M', valueGreen: '3.2M' },
                  { x: 420, yBlue: 145, yGreen: 145, label: language === 'vi' ? 'T4' : 'Apr', valueBlue: '3.7M', valueGreen: '3.7M' },
                  { x: 520, yBlue: 125, yGreen: 130, label: language === 'vi' ? 'T5' : 'May', valueBlue: '4.2M', valueGreen: '4.0M' },
                  { x: 620, yBlue: 100, yGreen: 115, label: language === 'vi' ? 'T6' : 'Jun', valueBlue: '4.8M', valueGreen: '4.4M' },
                  { x: 720, yBlue: 80, yGreen: 100, label: language === 'vi' ? 'T7' : 'Jul', valueBlue: '5.3M', valueGreen: '4.8M' },
                  { x: 820, yBlue: 60, yGreen: 90, label: language === 'vi' ? 'T8' : 'Aug', valueBlue: '5.8M', valueGreen: '5.1M' },
                ].map((point, i) => (
                  <g key={i}>
                    <circle cx={point.x} cy={point.yGreen} r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                    <circle cx={point.x} cy={point.yBlue} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                    
                    {/* Value labels */}
                    <text
                      x={point.x}
                      y={point.yBlue - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#3b82f6"
                      fontWeight="600"
                    >
                      {point.valueBlue}
                    </text>
                    <text
                      x={point.x}
                      y={point.yGreen - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#10b981"
                      fontWeight="600"
                    >
                      {point.valueGreen}
                    </text>
                    
                    {/* Month labels */}
                    <text
                      x={point.x}
                      y="290"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#6b7280"
                      fontWeight="400"
                    >
                      {point.label}
                    </text>
                  </g>
                ))}
              </LineChartSvg>
            </SimpleLineChart>
          </RevenueChartCard>
          
          <RevenueStatsGrid>
            <RevenueStatBox $bgColor="#EFF6FF" $iconColor="#3B82F6">
              <div className="icon">
                <CheckSquare />
              </div>
              <div className="content">
                <div className="label">
                  <CheckSquare size={16} />
                  {language === 'vi' ? 'Bài viết BOOST' : 'Post BOOST'}
                </div>
                <div className="value">{(revenueFromBoost / 1000000).toFixed(1)}M đ</div>
              </div>
            </RevenueStatBox>
            
            <RevenueStatBox $bgColor="#F0F9FF" $iconColor="#0EA5E9">
              <div className="icon">
                <TrendingUp />
              </div>
              <div className="content">
                <div className="label">
                  <TrendingUp size={16} />
                  {language === 'vi' ? 'Hot Search' : 'Hot Search'}
                </div>
                <div className="value">{(revenueFromHotSearch / 1000000).toFixed(1)}M đ</div>
              </div>
            </RevenueStatBox>
            
            <RevenueStatBox $bgColor="#FEF3C7" $iconColor="#F59E0B">
              <div className="icon">
                <Star />
              </div>
              <div className="content">
                <div className="label">
                  <Star size={16} />
                  {language === 'vi' ? 'Banner Quảng Cáo' : 'Banner Ads'}
                </div>
                <div className="value">{(revenueFromBanner / 1000000).toFixed(1)}M đ</div>
              </div>
            </RevenueStatBox>
          </RevenueStatsGrid>
        </RevenueSection>

        <Section>
          <SectionHeader>
            <h2>{language === 'vi' ? 'Ứng Viên Gần Đây' : 'Recent Candidates'}</h2>
            <ViewAllButton onClick={() => navigate('/admin/candidates')}>
              {language === 'vi' ? 'Xem tất cả' : 'View All'}
              <ArrowRight />
            </ViewAllButton>
          </SectionHeader>
          
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>{language === 'vi' ? 'Tên ứng viên' : 'Candidate Name'}</th>
                  <th>{language === 'vi' ? 'Email' : 'Email'}</th>
                  <th>{language === 'vi' ? 'eKYC (4 bước)' : 'eKYC (4 steps)'}</th>
                  <th>{language === 'vi' ? 'Trạng thái duyệt' : 'Approval Status'}</th>
                  <th>{language === 'vi' ? 'Ngày tham gia' : 'Join Date'}</th>
                </tr>
              </thead>
              <tbody>
                {recentCandidates.map((candidate) => (
                  <tr key={candidate.id} onClick={() => navigate('/admin/candidates')}>
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
                      {candidate.interviewDate ? (
                        <DateText className="interview">
                          <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          {candidate.interviewDate}
                        </DateText>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                          {language === 'vi' ? 'Chưa có' : 'Not set'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </Section>

        <Section>
          <SectionHeader>
            <h2>{language === 'vi' ? 'Nhà Tuyển Dụng Gần Đây' : 'Recent Employers'}</h2>
            <ViewAllButton onClick={() => navigate('/admin/employers')}>
              {language === 'vi' ? 'Xem tất cả' : 'View All'}
              <ArrowRight />
            </ViewAllButton>
          </SectionHeader>
          
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>{language === 'vi' ? 'Tên nhà tuyển dụng' : 'Employer Name'}</th>
                  <th>{language === 'vi' ? 'Email' : 'Email'}</th>
                  <th>{language === 'vi' ? 'Trạng thái phê duyệt' : 'Approval Status'}</th>
                  <th>{language === 'vi' ? 'Ngày tham gia' : 'Join Date'}</th>
                  <th>{language === 'vi' ? 'Đã xác thực' : 'Verified'}</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployers.map((employer) => (
                  <tr key={employer.id} onClick={() => navigate('/admin/employers')}>
                    <td style={{ fontWeight: 600 }}>{employer.name}</td>
                    <td>{employer.email}</td>
                    <td>
                      <StatusBadge $status={getApprovalStatusVariant(employer.approvalStatus)}>
                        {getApprovalStatusText(employer.approvalStatus)}
                      </StatusBadge>
                    </td>
                    <td>
                      {employer.interviewDate ? (
                        <DateText className="interview">
                          <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          {employer.interviewDate}
                        </DateText>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                          {language === 'vi' ? 'Chưa có' : 'Not set'}
                        </span>
                      )}
                    </td>
                    <td>
                      <VerificationBadge $verified={employer.verified}>
                        {employer.verified ? <Shield /> : <XSquare />}
                        {employer.verified 
                          ? (language === 'vi' ? 'Đã xác thực' : 'Verified')
                          : (language === 'vi' ? 'Chưa xác thực' : 'Unverified')
                        }
                      </VerificationBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </Section>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default AdminDashboard;



