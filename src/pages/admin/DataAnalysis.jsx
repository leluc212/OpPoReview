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
  const [activeTab, setActiveTab] = useState('advertisement');
  const [timeRange, setTimeRange] = useState('30days');

  const tabs = [
    { id: 'advertisement', label: language === 'vi' ? 'Quảng Cáo' : 'Advertising', icon: TrendingUp },
    { id: 'behavior', label: language === 'vi' ? 'Hành Vi' : 'Behavior', icon: Activity },
    { id: 'postStats', label: language === 'vi' ? 'Thống Kê Bài Đăng' : 'Post Stats', icon: FileText },
    { id: 'userBehavior', label: language === 'vi' ? 'Hành Vi User' : 'User Behavior', icon: Users },
    { id: 'shiftJob', label: language === 'vi' ? 'Việc Làm Ca' : 'Shift Jobs', icon: Clock },
    { id: 'standardJob', label: language === 'vi' ? 'Việc Làm Toàn Thời Gian' : 'Full-time Jobs', icon: Briefcase }
  ];

  const renderAdvertisementAnalysis = () => (
    <>
      <StatsGrid>
        <StatCard $color="#6366f1">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Tổng Chi Phí Quảng Cáo' : 'Total Ad Spend'}</StatLabel>
              <StatValue>{language === 'vi' ? '487,5 triệu' : '487.5 million'}</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+23% so với tháng trước' : '+23% vs last month'}
              </StatTrend>
            </div>
            <StatIcon $color="#6366f1">
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

        <StatCard $color="#8b5cf6">
          <StatHeader>
            <div>
              <StatLabel>{language === 'vi' ? 'Tỷ Lệ Nhấp (CTR)' : 'Click-through Rate (CTR)'}</StatLabel>
              <StatValue>6.5%</StatValue>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                {language === 'vi' ? '+2.1% so với tháng trước' : '+2.1% vs last month'}
              </StatTrend>
            </div>
            <StatIcon $color="#8b5cf6">
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

  const renderContent = () => {
    switch(activeTab) {
      case 'advertisement':
        return renderAdvertisementAnalysis();
      case 'behavior':
        return (
          <ChartPlaceholder style={{ height: '400px', background: 'white', borderRadius: '12px' }}>
            <Activity size={64} />
            <span style={{ fontSize: '1.1rem' }}>{language === 'vi' ? 'Phân tích hành vi người dùng' : 'User behavior analysis'}</span>
          </ChartPlaceholder>
        );
      case 'postStats':
        return (
          <ChartPlaceholder style={{ height: '400px', background: 'white', borderRadius: '12px' }}>
            <FileText size={64} />
            <span style={{ fontSize: '1.1rem' }}>{language === 'vi' ? 'Thống kê bài đăng' : 'Post statistics'}</span>
          </ChartPlaceholder>
        );
      case 'userBehavior':
        return (
          <ChartPlaceholder style={{ height: '400px', background: 'white', borderRadius: '12px' }}>
            <Users size={64} />
            <span style={{ fontSize: '1.1rem' }}>{language === 'vi' ? 'Hành vi người dùng chi tiết' : 'Detailed user behavior'}</span>
          </ChartPlaceholder>
        );
      case 'shiftJob':
        return (
          <ChartPlaceholder style={{ height: '400px', background: 'white', borderRadius: '12px' }}>
            <Clock size={64} />
            <span style={{ fontSize: '1.1rem' }}>{language === 'vi' ? 'Phân tích việc làm ca' : 'Shift-job analysis'}</span>
          </ChartPlaceholder>
        );
      case 'standardJob':
        return (
          <ChartPlaceholder style={{ height: '400px', background: 'white', borderRadius: '12px' }}>
            <Briefcase size={64} />
            <span style={{ fontSize: '1.1rem' }}>{language === 'vi' ? 'Phân tích việc làm toàn thời gian' : 'Full-time job analysis'}</span>
          </ChartPlaceholder>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout role="admin">
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
