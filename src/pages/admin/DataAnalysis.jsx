import { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Activity,
  Briefcase,
  Clock,
  Eye,
  MousePointerClick,
  DollarSign,
  Calendar,
  Filter
} from 'lucide-react';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  overflow-x: auto;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  margin-bottom: -2px;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border-left: 4px solid ${props => props.$color || props.theme.colors.primary};
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => `${props.$color}15` || `${props.theme.colors.primary}15`};
  color: ${props => props.$color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
  font-weight: 500;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  flex-direction: column;
  gap: 1rem;
`;

const DataTable = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TableTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.5rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
`;

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch(props.$variant) {
      case 'success': return '#dcfce7';
      case 'warning': return '#fef3c7';
      case 'danger': return '#fee2e2';
      default: return '#e0e7ff';
    }
  }};
  color: ${props => {
    switch(props.$variant) {
      case 'success': return '#15803d';
      case 'warning': return '#ca8a04';
      case 'danger': return '#dc2626';
      default: return '#4338ca';
    }
  }};
`;

const DataAnalysis = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30days');

  const tabs = [
    { id: 'overview', label: language === 'vi' ? 'Tổng Quan' : 'Overview', icon: BarChart3 },
    { id: 'users', label: language === 'vi' ? 'Người Dùng' : 'Users', icon: Users },
    { id: 'jobs', label: language === 'vi' ? 'Việc Làm' : 'Jobs', icon: Briefcase },
    { id: 'revenue', label: language === 'vi' ? 'Doanh Thu' : 'Revenue', icon: DollarSign },
    { id: 'engagement', label: language === 'vi' ? 'Tương Tác' : 'Engagement', icon: Activity }
  ];

  const renderAdvertisementAnalysis = () => (
    <>
      <StatsGrid>
        <StatCard $color="#1e40af">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Tổng Chi Phí Quảng Cáo' : 'Total Ad Spend'}</StatLabel>
              <StatValue>{language === 'vi' ? '487,5 triệu' : '487.5 million'}</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+23% so với tháng trước' : '+23% vs last month'}
              </StatTrend>
            </div>
            <StatIcon $color="#1e40af">
              <DollarSign size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#10b981">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Lượt Hiển Thị' : 'Impressions'}</StatLabel>
              <StatValue>2,4M</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+18% so với tháng trước' : '+18% vs last month'}
              </StatTrend>
            </div>
            <StatIcon $color="#10b981">
              <Eye size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#f59e0b">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Lượt Nhấp Chuột' : 'Clicks'}</StatLabel>
              <StatValue>156K</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+15% so với tháng trước' : '+15% vs last month'}
              </StatTrend>
            </div>
            <StatIcon $color="#f59e0b">
              <MousePointerClick size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#1e40af">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Tỷ Lệ Nhấp (CTR)' : 'Click-through Rate (CTR)'}</StatLabel>
              <StatValue>6.5%</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+2.1% so với tháng trước' : '+2.1% vs last month'}
              </StatTrend>
            </div>
            <StatIcon $color="#1e40af">
              <Activity size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>{language === 'vi' ? 'Chi Phí Quảng Cáo Theo Thời Gian' : 'Ad Spend Over Time'}</ChartTitle>
          </ChartHeader>
          <ChartPlaceholder>
            <BarChart3 size={48} />
            <span>{language === 'vi' ? 'Biểu đồ chi phí quảng cáo' : 'Ad spend chart'}</span>
          </ChartPlaceholder>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>{language === 'vi' ? 'Hiệu Suất Quảng Cáo' : 'Ad Performance'}</ChartTitle>
          </ChartHeader>
          <ChartPlaceholder>
            <TrendingUp size={48} />
            <span>{language === 'vi' ? 'Biểu đồ hiệu suất' : 'Performance chart'}</span>
          </ChartPlaceholder>
        </ChartCard>
      </ChartsGrid>

      <DataTable>
        <TableHeader>
          <TableTitle>{language === 'vi' ? 'Top Chiến Dịch Quảng Cáo' : 'Top Ad Campaigns'}</TableTitle>
        </TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>{language === 'vi' ? 'Tên Chiến Dịch' : 'Campaign Name'}</Th>
              <Th>{language === 'vi' ? 'Chi Phí' : 'Cost'}</Th>
              <Th>{language === 'vi' ? 'Lượt Hiển Thị' : 'Impressions'}</Th>
              <Th>{language === 'vi' ? 'Lượt Nhấp' : 'Clicks'}</Th>
              <Th>CTR</Th>
              <Th>{language === 'vi' ? 'Trạng Thái' : 'Status'}</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>{language === 'vi' ? 'Tuyển Dụng IT Hàng Đầu' : 'Top IT Hiring'}</Td>
              <Td>125,000,000 VND</Td>
              <Td>850,000</Td>
              <Td>55,250</Td>
              <Td>6.5%</Td>
              <Td><Badge $variant="success">{language === 'vi' ? 'Đang chạy' : 'Running'}</Badge></Td>
            </tr>
            <tr>
              <Td>{language === 'vi' ? 'Việc Làm Bán Thời Gian' : 'Part-time Jobs'}</Td>
              <Td>78,500,000 VND</Td>
              <Td>520,000</Td>
              <Td>31,200</Td>
              <Td>6.0%</Td>
              <Td><Badge $variant="success">{language === 'vi' ? 'Đang chạy' : 'Running'}</Badge></Td>
            </tr>
            <tr>
              <Td>{language === 'vi' ? 'Cơ Hội Nghề Nghiệp 2024' : 'Career Opportunities 2024'}</Td>
              <Td>95,000,000 VND</Td>
              <Td>680,000</Td>
              <Td>47,600</Td>
              <Td>7.0%</Td>
              <Td><Badge $variant="success">{language === 'vi' ? 'Đang chạy' : 'Running'}</Badge></Td>
            </tr>
            <tr>
              <Td>{language === 'vi' ? 'Tuyển Dụng Fresher' : 'Fresher Hiring'}</Td>
              <Td>62,000,000 VND</Td>
              <Td>420,000</Td>
              <Td>23,520</Td>
              <Td>5.6%</Td>
              <Td><Badge $variant="warning">{language === 'vi' ? 'Tạm dừng' : 'Paused'}</Badge></Td>
            </tr>
            <tr>
              <Td>{language === 'vi' ? 'Nhân Viên Kinh Doanh' : 'Sales Staff'}</Td>
              <Td>127,000,000 VND</Td>
              <Td>930,000</Td>
              <Td>65,100</Td>
              <Td>7.0%</Td>
              <Td><Badge $variant="success">{language === 'vi' ? 'Đang chạy' : 'Running'}</Badge></Td>
            </tr>
          </tbody>
        </Table>
      </DataTable>
    </>
  );

  const renderOverview = () => (
    <>
      <StatsGrid>
        <StatCard $color="#1e40af">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Tổng Người Dùng' : 'Total Users'}</StatLabel>
              <StatValue>2,458</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+12% so với tháng trước' : '+12% vs last month'}
              </StatTrend>
            </div>
            <StatIcon $color="#1e40af">
              <Users size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#10b981">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Tin Đang Tuyển' : 'Active Jobs'}</StatLabel>
              <StatValue>345</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+8% so với tuần trước' : '+8% vs last week'}
              </StatTrend>
            </div>
            <StatIcon $color="#10b981">
              <Briefcase size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#f59e0b">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Ứng Tuyển' : 'Applications'}</StatLabel>
              <StatValue>1,234</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+18% so với tuần trước' : '+18% vs last week'}
              </StatTrend>
            </div>
            <StatIcon $color="#f59e0b">
              <FileText size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#8b5cf6">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Doanh Thu Tháng' : 'Monthly Revenue'}</StatLabel>
              <StatValue>{language === 'vi' ? '24.5M' : '$1.05M'}</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+23% so với tháng trước' : '+23% vs last month'}
              </StatTrend>
            </div>
            <StatIcon $color="#8b5cf6">
              <DollarSign size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>{language === 'vi' ? 'Người Dùng Mới Theo Thời Gian' : 'New Users Over Time'}</ChartTitle>
          </ChartHeader>
          <ChartPlaceholder>
            <BarChart3 size={48} />
            <span>{language === 'vi' ? 'Biểu đồ người dùng mới' : 'New users chart'}</span>
          </ChartPlaceholder>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>{language === 'vi' ? 'Tin Tuyển Dụng Theo Ngành' : 'Jobs by Industry'}</ChartTitle>
          </ChartHeader>
          <ChartPlaceholder>
            <Activity size={48} />
            <span>{language === 'vi' ? 'Biểu đồ phân bố ngành' : 'Industry distribution'}</span>
          </ChartPlaceholder>
        </ChartCard>
      </ChartsGrid>

      <DataTable>
        <TableHeader>
          <TableTitle>{language === 'vi' ? 'Hoạt Động Gần Đây' : 'Recent Activity'}</TableTitle>
        </TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>{language === 'vi' ? 'Người Dùng' : 'User'}</Th>
              <Th>{language === 'vi' ? 'Hành Động' : 'Action'}</Th>
              <Th>{language === 'vi' ? 'Thời Gian' : 'Time'}</Th>
              <Th>{language === 'vi' ? 'Trạng Thái' : 'Status'}</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Nguyễn Văn A</Td>
              <Td>{language === 'vi' ? 'Đăng ký tài khoản' : 'Registered account'}</Td>
              <Td>{language === 'vi' ? '2 giờ trước' : '2 hours ago'}</Td>
              <Td><Badge $variant="success">{language === 'vi' ? 'Hoàn thành' : 'Completed'}</Badge></Td>
            </tr>
            <tr>
              <Td>FPT Software</Td>
              <Td>{language === 'vi' ? 'Đăng tin tuyển dụng' : 'Posted job'}</Td>
              <Td>{language === 'vi' ? '3 giờ trước' : '3 hours ago'}</Td>
              <Td><Badge $variant="success">{language === 'vi' ? 'Hoàn thành' : 'Completed'}</Badge></Td>
            </tr>
            <tr>
              <Td>Trần Thị B</Td>
              <Td>{language === 'vi' ? 'Ứng tuyển vị trí' : 'Applied for position'}</Td>
              <Td>{language === 'vi' ? '5 giờ trước' : '5 hours ago'}</Td>
              <Td><Badge $variant="success">{language === 'vi' ? 'Hoàn thành' : 'Completed'}</Badge></Td>
            </tr>
          </tbody>
        </Table>
      </DataTable>
    </>
  );

  const renderUsers = () => (
    <>
      <StatsGrid>
        <StatCard $color="#1e40af">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Ứng Viên' : 'Candidates'}</StatLabel>
              <StatValue>1,856</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+15% tháng này' : '+15% this month'}
              </StatTrend>
            </div>
            <StatIcon $color="#1e40af">
              <Users size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#10b981">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Nhà Tuyển Dụng' : 'Employers'}</StatLabel>
              <StatValue>602</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+8% tháng này' : '+8% this month'}
              </StatTrend>
            </div>
            <StatIcon $color="#10b981">
              <Users size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#f59e0b">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Người Dùng Hoạt Động' : 'Active Users'}</StatLabel>
              <StatValue>1,234</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+22% tuần này' : '+22% this week'}
              </StatTrend>
            </div>
            <StatIcon $color="#f59e0b">
              <Activity size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#ef4444">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Chờ Xác Thực' : 'Pending Verification'}</StatLabel>
              <StatValue>45</StatValue>
              <StatTrend $positive={false}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+5 hôm nay' : '+5 today'}
              </StatTrend>
            </div>
            <StatIcon $color="#ef4444">
              <Clock size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>{language === 'vi' ? 'Tăng Trưởng Người Dùng' : 'User Growth'}</ChartTitle>
          </ChartHeader>
          <ChartPlaceholder>
            <TrendingUp size={48} />
            <span>{language === 'vi' ? 'Biểu đồ tăng trưởng' : 'Growth chart'}</span>
          </ChartPlaceholder>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>{language === 'vi' ? 'Phân Bố Người Dùng' : 'User Distribution'}</ChartTitle>
          </ChartHeader>
          <ChartPlaceholder>
            <Users size={48} />
            <span>{language === 'vi' ? 'Biểu đồ phân bố' : 'Distribution chart'}</span>
          </ChartPlaceholder>
        </ChartCard>
      </ChartsGrid>
    </>
  );

  const renderJobs = () => (
    <>
      <StatsGrid>
        <StatCard $color="#1e40af">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Tổng Tin Tuyển Dụng' : 'Total Jobs'}</StatLabel>
              <StatValue>1,245</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+45 tuần này' : '+45 this week'}
              </StatTrend>
            </div>
            <StatIcon $color="#1e40af">
              <Briefcase size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#10b981">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Đang Tuyển' : 'Active'}</StatLabel>
              <StatValue>345</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+12 hôm nay' : '+12 today'}
              </StatTrend>
            </div>
            <StatIcon $color="#10b981">
              <Briefcase size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#f59e0b">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Lượt Xem' : 'Views'}</StatLabel>
              <StatValue>45.2K</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+28% tuần này' : '+28% this week'}
              </StatTrend>
            </div>
            <StatIcon $color="#f59e0b">
              <Eye size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#8b5cf6">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Ứng Tuyển' : 'Applications'}</StatLabel>
              <StatValue>8,456</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+156 hôm nay' : '+156 today'}
              </StatTrend>
            </div>
            <StatIcon $color="#8b5cf6">
              <FileText size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>
      </StatsGrid>

      <DataTable>
        <TableHeader>
          <TableTitle>{language === 'vi' ? 'Top Tin Tuyển Dụng' : 'Top Jobs'}</TableTitle>
        </TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>{language === 'vi' ? 'Vị Trí' : 'Position'}</Th>
              <Th>{language === 'vi' ? 'Công Ty' : 'Company'}</Th>
              <Th>{language === 'vi' ? 'Lượt Xem' : 'Views'}</Th>
              <Th>{language === 'vi' ? 'Ứng Tuyển' : 'Applications'}</Th>
              <Th>{language === 'vi' ? 'Trạng Thái' : 'Status'}</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Senior Frontend Developer</Td>
              <Td>FPT Software</Td>
              <Td>2,345</Td>
              <Td>156</Td>
              <Td><Badge $variant="success">{language === 'vi' ? 'Đang tuyển' : 'Active'}</Badge></Td>
            </tr>
            <tr>
              <Td>Marketing Manager</Td>
              <Td>Viettel</Td>
              <Td>1,890</Td>
              <Td>98</Td>
              <Td><Badge $variant="success">{language === 'vi' ? 'Đang tuyển' : 'Active'}</Badge></Td>
            </tr>
            <tr>
              <Td>Data Analyst</Td>
              <Td>VinGroup</Td>
              <Td>1,567</Td>
              <Td>87</Td>
              <Td><Badge $variant="success">{language === 'vi' ? 'Đang tuyển' : 'Active'}</Badge></Td>
            </tr>
          </tbody>
        </Table>
      </DataTable>
    </>
  );

  const renderRevenue = () => (
    <>
      <StatsGrid>
        <StatCard $color="#10b981">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Doanh Thu Tháng' : 'Monthly Revenue'}</StatLabel>
              <StatValue>{language === 'vi' ? '24.5M VND' : '$1.05M'}</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+23% so với tháng trước' : '+23% vs last month'}
              </StatTrend>
            </div>
            <StatIcon $color="#10b981">
              <DollarSign size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#1e40af">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Gói Đăng Ký' : 'Subscriptions'}</StatLabel>
              <StatValue>156</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+12 tháng này' : '+12 this month'}
              </StatTrend>
            </div>
            <StatIcon $color="#1e40af">
              <Calendar size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#f59e0b">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Doanh Thu Quảng Cáo' : 'Ad Revenue'}</StatLabel>
              <StatValue>{language === 'vi' ? '8.2M VND' : '$350K'}</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+18% tháng này' : '+18% this month'}
              </StatTrend>
            </div>
            <StatIcon $color="#f59e0b">
              <DollarSign size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#8b5cf6">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Trung Bình/Giao Dịch' : 'Avg/Transaction'}</StatLabel>
              <StatValue>{language === 'vi' ? '450K VND' : '$19.5'}</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+5% tháng này' : '+5% this month'}
              </StatTrend>
            </div>
            <StatIcon $color="#8b5cf6">
              <DollarSign size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>{language === 'vi' ? 'Doanh Thu Theo Thời Gian' : 'Revenue Over Time'}</ChartTitle>
          </ChartHeader>
          <ChartPlaceholder>
            <BarChart3 size={48} />
            <span>{language === 'vi' ? 'Biểu đồ doanh thu' : 'Revenue chart'}</span>
          </ChartPlaceholder>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>{language === 'vi' ? 'Nguồn Doanh Thu' : 'Revenue Sources'}</ChartTitle>
          </ChartHeader>
          <ChartPlaceholder>
            <DollarSign size={48} />
            <span>{language === 'vi' ? 'Biểu đồ nguồn thu' : 'Revenue sources'}</span>
          </ChartPlaceholder>
        </ChartCard>
      </ChartsGrid>
    </>
  );

  const renderEngagement = () => (
    <>
      <StatsGrid>
        <StatCard $color="#1e40af">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Lượt Truy Cập' : 'Page Views'}</StatLabel>
              <StatValue>125.4K</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+32% tuần này' : '+32% this week'}
              </StatTrend>
            </div>
            <StatIcon $color="#1e40af">
              <Eye size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#10b981">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Thời Gian Trung Bình' : 'Avg Session'}</StatLabel>
              <StatValue>8m 34s</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+12% tuần này' : '+12% this week'}
              </StatTrend>
            </div>
            <StatIcon $color="#10b981">
              <Clock size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#f59e0b">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Tỷ Lệ Tương Tác' : 'Engagement Rate'}</StatLabel>
              <StatValue>68.5%</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+5.2% tuần này' : '+5.2% this week'}
              </StatTrend>
            </div>
            <StatIcon $color="#f59e0b">
              <Activity size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#8b5cf6">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Tỷ Lệ Chuyển Đổi' : 'Conversion Rate'}</StatLabel>
              <StatValue>12.8%</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+3.1% tuần này' : '+3.1% this week'}
              </StatTrend>
            </div>
            <StatIcon $color="#8b5cf6">
              <MousePointerClick size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>{language === 'vi' ? 'Hoạt Động Người Dùng' : 'User Activity'}</ChartTitle>
          </ChartHeader>
          <ChartPlaceholder>
            <Activity size={48} />
            <span>{language === 'vi' ? 'Biểu đồ hoạt động' : 'Activity chart'}</span>
          </ChartPlaceholder>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>{language === 'vi' ? 'Tương Tác Theo Giờ' : 'Engagement by Hour'}</ChartTitle>
          </ChartHeader>
          <ChartPlaceholder>
            <Clock size={48} />
            <span>{language === 'vi' ? 'Biểu đồ theo giờ' : 'Hourly chart'}</span>
          </ChartPlaceholder>
        </ChartCard>
      </ChartsGrid>
    </>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'jobs':
        return renderJobs();
      case 'revenue':
        return renderRevenue();
      case 'engagement':
        return renderEngagement();
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout role="admin" key={language}>
      <PageContainer>
        <PageHeader>
          <Title>{language === 'vi' ? 'Phân Tích Dữ Liệu' : 'Data Analysis'}</Title>
          <Subtitle>{language === 'vi' ? 'Theo dõi và phân tích dữ liệu nền tảng' : 'Track and analyze platform data'}</Subtitle>
        </PageHeader>

        <FilterBar>
          <FilterGroup>
            <FilterLabel>{language === 'vi' ? 'Khoảng thời gian:' : 'Time range:'}</FilterLabel>
            <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="7days">{language === 'vi' ? '7 ngày qua' : 'Last 7 days'}</option>
              <option value="30days">{language === 'vi' ? '30 ngày qua' : 'Last 30 days'}</option>
              <option value="3months">{language === 'vi' ? '3 tháng qua' : 'Last 3 months'}</option>
              <option value="year">{language === 'vi' ? 'Năm nay' : 'This year'}</option>
              <option value="custom">{language === 'vi' ? 'Tùy chỉnh' : 'Custom'}</option>
            </Select>
          </FilterGroup>
        </FilterBar>

        <TabContainer>
          {tabs.map(tab => (
            <Tab 
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabContainer>

        {renderContent()}
      </PageContainer>
    </DashboardLayout>
  );
};

export default DataAnalysis;
