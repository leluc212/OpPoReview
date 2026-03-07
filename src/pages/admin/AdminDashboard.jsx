import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import { useLanguage } from '../../context/LanguageContext';
import { Users, Briefcase, Building2, DollarSign, CheckSquare, XSquare, Shield, Calendar, ArrowRight } from 'lucide-react';

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
  gap: 16px;
  margin-bottom: 48px;
  
  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const BoostCard = styled.div`
  background: ${props => props.$bgColor || '#FFF9E6'};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const BoostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$color || '#F59E0B'};
  }
  
  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #1F2937;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const BoostStats = styled.div`
  margin-bottom: 16px;
`;

const BoostMainStat = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
  
  .number {
    font-size: 48px;
    font-weight: 900;
    color: #1F2937;
    line-height: 1;
  }
  
  .label {
    font-size: 18px;
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
    padding: 4px 8px;
    border-radius: 6px;
  }
`;

const BoostSubStat = styled.div`
  font-size: 14px;
  color: #6B7280;
  font-weight: 500;
`;

const BoostOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const BoostOption = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.$iconBg || '#DBEAFE'};
    flex-shrink: 0;
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => props.$iconColor || '#1E40AF'};
    }
  }
  
  .content {
    flex: 1;
    
    .name {
      font-size: 14px;
      font-weight: 600;
      color: #1F2937;
      margin-bottom: 4px;
    }
    
    .count {
      font-size: 20px;
      font-weight: 700;
      color: #1F2937;
      
      span {
        font-size: 12px;
        font-weight: 500;
        color: #6B7280;
        margin-left: 4px;
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
  height: 250px;
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
    { name: 'Quick Boost', count: 16, icon: '⚡', iconBg: '#DBEAFE', iconColor: '#1E40AF' },
    { name: 'Hot Search', count: 9, icon: '🔥', iconBg: '#FEE2E2', iconColor: '#DC2626' },
    { name: 'Spongit Banner', count: 6, icon: '📱', iconBg: '#E0E7FF', iconColor: '#4F46E5' },
    { name: 'Top Spotlight', count: 4, icon: '⭐', iconBg: '#FCE7F3', iconColor: '#BE185D' }
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
        <StatsGrid>
          <StatsCard
            title={language === 'vi' ? 'Tổng Người Dùng' : 'Total Users'}
            value="2,458"
            change="+12%"
            changeText={language === 'vi' ? 'sơ với tháng trước' : 'vs last month'}
            icon={Users}
            color="linear-gradient(135deg, #1e40af 0%, #1e40af 100%)"
            positive
          />
          <StatsCard
            title={language === 'vi' ? 'Tin Đang Tuyển' : 'Active Jobs'}
            value="345"
            change="+8%"
            changeText={language === 'vi' ? 'sơ với tuần trước' : 'vs last week'}
            icon={Briefcase}
            color="linear-gradient(135deg, #F093FB 0%, #F5576C 100%)"
            positive
          />
          <StatsCard
            title={language === 'vi' ? 'Công Ty' : 'Companies'}
            value="156"
            change="+15"
            changeText={language === 'vi' ? 'đang chờ duyệt' : 'pending approval'}
            icon={Building2}
            color="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
            positive
          />
          <StatsCard
            title={language === 'vi' ? 'Doanh Thu' : 'Revenue'}
            value={language === 'vi' ? '24.5 tỷ VND' : '$1.05M USD'}
            change="+23%"
            changeText={language === 'vi' ? 'sơ với tháng trước' : 'vs last month'}
            icon={DollarSign}
            color="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
            positive
          />
        </StatsGrid>

        {/* Bài Tuyển Gấp & Gói Boost */}
        <BoostSection>
          {/* Bài Tuyển Gấp */}
          <BoostCard $bgColor="#FFF9E6">
            <BoostHeader $color="#F59E0B">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <h3>{language === 'vi' ? 'Bài Tuyển Gấp' : 'Urgent Jobs'}</h3>
            </BoostHeader>
            <BoostStats>
              <BoostMainStat>
                <span className="number">{platformData.totalJobs}</span>
                <span className="label">{language === 'vi' ? 'Tin' : 'Jobs'}</span>
                <span className="change">↑ {platformData.change}</span>
              </BoostMainStat>
              <BoostSubStat>
                {language === 'vi' ? `Giảm ${platformData.discount} - Chỉ còn ${platformData.price}` : `${platformData.discount} off - Only ${platformData.price}`}
              </BoostSubStat>
            </BoostStats>
          </BoostCard>

          {/* Gói Boost */}
          <BoostCard $bgColor="#F0F9FF">
            <BoostHeader $color="#1E40AF">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              <h3>{language === 'vi' ? 'Gói Boost' : 'Boost Packages'}</h3>
            </BoostHeader>
            <BoostOptions>
              {boostPackages.map((pkg, index) => (
                <BoostOption key={index} $iconBg={pkg.iconBg} $iconColor={pkg.iconColor}>
                  <div className="icon">
                    <span style={{ fontSize: '20px' }}>{pkg.icon}</span>
                  </div>
                  <div className="content">
                    <div className="name">{pkg.name}</div>
                    <div className="count">
                      {pkg.count} <span>{language === 'vi' ? 'tin' : 'jobs'}</span>
                    </div>
                  </div>
                </BoostOption>
              ))}
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
              <LineChartSvg viewBox="0 0 700 300">
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
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
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
                  strokeWidth="3"
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
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={activityData.map((d, i) => 
                    `${50 + (i / (activityData.length - 1)) * 600},${250 - (d.applications / 80) * 200}`
                  ).join(' ')}
                />
                
                {/* Data points */}
                {activityData.map((d, i) => (
                  <g key={i}>
                    <circle
                      cx={50 + (i / (activityData.length - 1)) * 600}
                      cy={250 - (d.posts / 80) * 200}
                      r="5"
                      fill="#3B82F6"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <circle
                      cx={50 + (i / (activityData.length - 1)) * 600}
                      cy={250 - (d.applications / 80) * 200}
                      r="5"
                      fill="#10B981"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={50 + (i / (activityData.length - 1)) * 600}
                      y="275"
                      textAnchor="middle"
                      fontSize="13"
                      fill="#6b7280"
                      fontWeight="600"
                    >
                      {d.date}
                    </text>
                  </g>
                ))}
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
            <SimpleBarChart>
              {jobStatsData.map((data, index) => {
                const maxValue = 80; // Giá trị tối đa cho scale
                return (
                  <BarGroup key={index}>
                    <div className="bars">
                      <div
                        className="bar"
                        style={{
                          height: `${(data.posts / maxValue) * 100}%`,
                          background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)'
                        }}
                        title={`${language === 'vi' ? 'Tin đăng' : 'Posts'}: ${data.posts}`}
                      />
                      <div
                        className="bar"
                        style={{
                          height: `${(data.applications / maxValue) * 100}%`,
                          background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)'
                        }}
                        title={`${language === 'vi' ? 'Ứng tuyển' : 'Applications'}: ${data.applications}`}
                      />
                    </div>
                    <div className="label">{data.date}</div>
                  </BarGroup>
                );
              })}
            </SimpleBarChart>
          </ChartCard>
        </ChartsSection>

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



