import { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  DollarSign,
  Calendar,
  Download,
  Filter,
  FileText,
  Activity
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

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  border: none;
  border-bottom: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgDark};
  }
`;

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Select = styled.select`
  padding: 10px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgDark};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    flex: 1;
    font-size: 13px;
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.$color || props.theme.colors.primary};
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.$color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$color};
    
    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 600;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const StatChange = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 10px;
    
    @media (max-width: 768px) {
      font-size: 16px;
    }
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  position: relative;
  
  @media (max-width: 768px) {
    height: 250px;
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
  flex-wrap: wrap;
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

const TableCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
  
  th {
    text-align: left;
    padding: 12px 16px;
    background: ${props => props.theme.colors.bgDark};
    font-weight: 700;
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid ${props => props.theme.colors.border};
    white-space: nowrap;
    
    @media (max-width: 768px) {
      padding: 10px 12px;
      font-size: 11px;
    }
  }
  
  td {
    padding: 12px 16px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    font-size: 14px;
    
    @media (max-width: 768px) {
      padding: 10px 12px;
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

const Reports = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('analysis');
  const [timeRange, setTimeRange] = useState('month');

  // Stats data
  const stats = [
    { 
      label: language === 'vi' ? 'Tổng Doanh Thu' : 'Total Revenue',
      value: language === 'vi' ? '245 triệu' : '245M VND',
      change: '+23%',
      positive: true,
      icon: DollarSign,
      color: '#10b981'
    },
    { 
      label: language === 'vi' ? 'Tổng Người Dùng' : 'Total Users',
      value: '2,458',
      change: '+12%',
      positive: true,
      icon: Users,
      color: '#3b82f6'
    },
    { 
      label: language === 'vi' ? 'Nhà Tuyển Dụng' : 'Employers',
      value: '156',
      change: '+15',
      positive: true,
      icon: Building2,
      color: '#8b5cf6'
    },
    { 
      label: language === 'vi' ? 'Tin Đăng' : 'Job Posts',
      value: '345',
      change: '+8%',
      positive: true,
      icon: Briefcase,
      color: '#f59e0b'
    },
  ];

  // Monthly revenue data
  const revenueData = [
    { month: 'T1', revenue: 180, target: 200 },
    { month: 'T2', revenue: 195, target: 200 },
    { month: 'T3', revenue: 210, target: 220 },
    { month: 'T4', revenue: 225, target: 220 },
    { month: 'T5', revenue: 235, target: 240 },
    { month: 'T6', revenue: 245, target: 240 },
  ];

  const maxRevenue = Math.max(...revenueData.flatMap(d => [d.revenue, d.target]));

  // User growth data
  const userGrowthData = [
    { month: 'T1', candidates: 320, employers: 25 },
    { month: 'T2', candidates: 380, employers: 32 },
    { month: 'T3', candidates: 450, employers: 38 },
    { month: 'T4', candidates: 520, employers: 45 },
    { month: 'T5', candidates: 610, employers: 52 },
    { month: 'T6', candidates: 680, employers: 58 },
  ];

  const maxUsers = Math.max(...userGrowthData.flatMap(d => [d.candidates, d.employers]));

  // Package distribution data
  const packageData = [
    { name: 'Quick Boost', value: 35, color: '#3b82f6' },
    { name: 'Hot Search', value: 25, color: '#ef4444' },
    { name: 'Spotlight Banner', value: 20, color: '#8b5cf6' },
    { name: 'Top Spotlight', value: 20, color: '#f59e0b' },
  ];

  const totalPackages = packageData.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  // Top employers data
  const topEmployers = [
    { name: 'Highlands Coffee', posts: 45, revenue: '25M', growth: '+18%' },
    { name: 'Phúc Long', posts: 38, revenue: '22M', growth: '+15%' },
    { name: 'Katinat', posts: 32, revenue: '18M', growth: '+12%' },
    { name: 'The Coffee House', posts: 28, revenue: '16M', growth: '+10%' },
    { name: 'Starbucks', posts: 25, revenue: '15M', growth: '+8%' },
  ];

  return (
    <DashboardLayout role="admin" key={language}>
      <PageContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Báo Cáo & Phân Tích' : 'Reports & Analysis'}</h1>
          <p>{language === 'vi' ? 'Phân tích dữ liệu và báo cáo tổng quan hệ thống' : 'Data analysis and system overview reports'}</p>
        </PageHeader>

        <TabsContainer>
          <Tab 
            $active={activeTab === 'analysis'}
            onClick={() => setActiveTab('analysis')}
          >
            <BarChart3 size={18} style={{ display: 'inline', marginRight: '8px' }} />
            {language === 'vi' ? 'Data Analysis' : 'Data Analysis'}
          </Tab>
          <Tab 
            $active={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
          >
            <FileText size={18} style={{ display: 'inline', marginRight: '8px' }} />
            {language === 'vi' ? 'Báo Cáo' : 'Reports'}
          </Tab>
        </TabsContainer>

        <ControlBar>
          <FilterGroup>
            <Filter size={18} />
            <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="week">{language === 'vi' ? 'Tuần này' : 'This Week'}</option>
              <option value="month">{language === 'vi' ? 'Tháng này' : 'This Month'}</option>
              <option value="quarter">{language === 'vi' ? 'Quý này' : 'This Quarter'}</option>
              <option value="year">{language === 'vi' ? 'Năm này' : 'This Year'}</option>
            </Select>
          </FilterGroup>
          <DownloadButton>
            <Download />
            {language === 'vi' ? 'Tải Báo Cáo' : 'Download Report'}
          </DownloadButton>
        </ControlBar>

        {activeTab === 'analysis' && (
          <>
            <StatsGrid>
              {stats.map((stat, index) => (
                <StatCard key={index} $color={stat.color}>
                  <StatIcon $color={stat.color}>
                    <stat.icon />
                  </StatIcon>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                  <StatChange $positive={stat.positive}>
                    <TrendingUp size={14} />
                    {stat.change}
                  </StatChange>
                </StatCard>
              ))}
            </StatsGrid>

            <ChartsGrid>
              <ChartCard>
                <ChartHeader>
                  <h3>
                    <BarChart3 />
                    {language === 'vi' ? 'Doanh Thu Theo Tháng' : 'Monthly Revenue'}
                  </h3>
                </ChartHeader>
                <ChartContainer>
                  <ChartSVG viewBox="0 0 700 300">
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
                    
                    {revenueData.map((d, i) => (
                      <g key={i}>
                        <rect
                          x={80 + i * 100}
                          y={250 - (d.revenue / maxRevenue) * 180}
                          width="35"
                          height={(d.revenue / maxRevenue) * 180}
                          fill="#10b981"
                          rx="4"
                        />
                        <rect
                          x={120 + i * 100}
                          y={250 - (d.target / maxRevenue) * 180}
                          width="35"
                          height={(d.target / maxRevenue) * 180}
                          fill="#3b82f6"
                          rx="4"
                        />
                        <text
                          x={110 + i * 100}
                          y="275"
                          textAnchor="middle"
                          fontSize="13"
                          fill="#6b7280"
                          fontWeight="600"
                        >
                          {d.month}
                        </text>
                      </g>
                    ))}
                  </ChartSVG>
                </ChartContainer>
                <ChartLegend>
                  <LegendItem>
                    <LegendDot $color="#10b981" />
                    {language === 'vi' ? 'Doanh Thu' : 'Revenue'}
                  </LegendItem>
                  <LegendItem>
                    <LegendDot $color="#3b82f6" />
                    {language === 'vi' ? 'Mục Tiêu' : 'Target'}
                  </LegendItem>
                </ChartLegend>
              </ChartCard>

              <ChartCard>
                <ChartHeader>
                  <h3>
                    <Activity />
                    {language === 'vi' ? 'Tăng Trưởng Người Dùng' : 'User Growth'}
                  </h3>
                </ChartHeader>
                <ChartContainer>
                  <ChartSVG viewBox="0 0 700 300">
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
                    
                    <polyline
                      points={userGrowthData.map((d, i) => 
                        `${100 + i * 100},${250 - (d.candidates / maxUsers) * 180}`
                      ).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                    />
                    
                    <polyline
                      points={userGrowthData.map((d, i) => 
                        `${100 + i * 100},${250 - (d.employers / maxUsers) * 180}`
                      ).join(' ')}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                    />
                    
                    {userGrowthData.map((d, i) => (
                      <g key={i}>
                        <circle
                          cx={100 + i * 100}
                          cy={250 - (d.candidates / maxUsers) * 180}
                          r="5"
                          fill="#3b82f6"
                        />
                        <circle
                          cx={100 + i * 100}
                          cy={250 - (d.employers / maxUsers) * 180}
                          r="5"
                          fill="#8b5cf6"
                        />
                        <text
                          x={100 + i * 100}
                          y="275"
                          textAnchor="middle"
                          fontSize="13"
                          fill="#6b7280"
                          fontWeight="600"
                        >
                          {d.month}
                        </text>
                      </g>
                    ))}
                  </ChartSVG>
                </ChartContainer>
                <ChartLegend>
                  <LegendItem>
                    <LegendDot $color="#3b82f6" />
                    {language === 'vi' ? 'Ứng Viên' : 'Candidates'}
                  </LegendItem>
                  <LegendItem>
                    <LegendDot $color="#8b5cf6" />
                    {language === 'vi' ? 'Nhà Tuyển Dụng' : 'Employers'}
                  </LegendItem>
                </ChartLegend>
              </ChartCard>
            </ChartsGrid>

            <ChartsGrid>
              <ChartCard>
                <ChartHeader>
                  <h3>
                    <PieChart />
                    {language === 'vi' ? 'Phân Bố Gói Dịch Vụ' : 'Package Distribution'}
                  </h3>
                </ChartHeader>
                <ChartContainer>
                  <ChartSVG viewBox="0 0 400 300">
                    <g transform="translate(200, 150)">
                      {packageData.map((item, index) => {
                        const percentage = (item.value / totalPackages) * 100;
                        const angle = (percentage / 100) * 360;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + angle;
                        
                        const startRad = (startAngle - 90) * (Math.PI / 180);
                        const endRad = (endAngle - 90) * (Math.PI / 180);
                        
                        const x1 = 100 * Math.cos(startRad);
                        const y1 = 100 * Math.sin(startRad);
                        const x2 = 100 * Math.cos(endRad);
                        const y2 = 100 * Math.sin(endRad);
                        
                        const largeArc = angle > 180 ? 1 : 0;
                        
                        const path = `M 0 0 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`;
                        
                        currentAngle = endAngle;
                        
                        return (
                          <path
                            key={index}
                            d={path}
                            fill={item.color}
                            stroke="white"
                            strokeWidth="2"
                          />
                        );
                      })}
                    </g>
                  </ChartSVG>
                </ChartContainer>
                <ChartLegend>
                  {packageData.map((item, index) => (
                    <LegendItem key={index}>
                      <LegendDot $color={item.color} />
                      {item.name} ({item.value}%)
                    </LegendItem>
                  ))}
                </ChartLegend>
              </ChartCard>

              <TableCard>
                <ChartHeader>
                  <h3>
                    <Building2 />
                    {language === 'vi' ? 'Top Nhà Tuyển Dụng' : 'Top Employers'}
                  </h3>
                </ChartHeader>
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <th>{language === 'vi' ? 'Tên' : 'Name'}</th>
                        <th>{language === 'vi' ? 'Tin Đăng' : 'Posts'}</th>
                        <th>{language === 'vi' ? 'Doanh Thu' : 'Revenue'}</th>
                        <th>{language === 'vi' ? 'Tăng Trưởng' : 'Growth'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topEmployers.map((employer, index) => (
                        <tr key={index}>
                          <td style={{ fontWeight: 600 }}>{employer.name}</td>
                          <td>{employer.posts}</td>
                          <td>{employer.revenue}</td>
                          <td style={{ color: '#10b981', fontWeight: 600 }}>{employer.growth}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              </TableCard>
            </ChartsGrid>
          </>
        )}

        {activeTab === 'reports' && (
          <>
            <StatsGrid>
              {stats.map((stat, index) => (
                <StatCard key={index} $color={stat.color}>
                  <StatIcon $color={stat.color}>
                    <stat.icon />
                  </StatIcon>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                  <StatChange $positive={stat.positive}>
                    <TrendingUp size={14} />
                    {stat.change}
                  </StatChange>
                </StatCard>
              ))}
            </StatsGrid>

            <TableCard>
              <ChartHeader>
                <h3>
                  <FileText />
                  {language === 'vi' ? 'Báo Cáo Chi Tiết' : 'Detailed Reports'}
                </h3>
              </ChartHeader>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <th>{language === 'vi' ? 'Loại Báo Cáo' : 'Report Type'}</th>
                      <th>{language === 'vi' ? 'Thời Gian' : 'Period'}</th>
                      <th>{language === 'vi' ? 'Trạng Thái' : 'Status'}</th>
                      <th>{language === 'vi' ? 'Ngày Tạo' : 'Created Date'}</th>
                      <th>{language === 'vi' ? 'Thao Tác' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>{language === 'vi' ? 'Báo Cáo Doanh Thu' : 'Revenue Report'}</td>
                      <td>{language === 'vi' ? 'Tháng 6/2026' : 'June 2026'}</td>
                      <td><span style={{ color: '#10b981', fontWeight: 600 }}>{language === 'vi' ? 'Hoàn Thành' : 'Completed'}</span></td>
                      <td>2026-06-30</td>
                      <td>
                        <DownloadButton style={{ padding: '6px 12px', fontSize: '12px' }}>
                          <Download size={14} />
                          {language === 'vi' ? 'Tải' : 'Download'}
                        </DownloadButton>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>{language === 'vi' ? 'Báo Cáo Người Dùng' : 'User Report'}</td>
                      <td>{language === 'vi' ? 'Tháng 6/2026' : 'June 2026'}</td>
                      <td><span style={{ color: '#10b981', fontWeight: 600 }}>{language === 'vi' ? 'Hoàn Thành' : 'Completed'}</span></td>
                      <td>2026-06-30</td>
                      <td>
                        <DownloadButton style={{ padding: '6px 12px', fontSize: '12px' }}>
                          <Download size={14} />
                          {language === 'vi' ? 'Tải' : 'Download'}
                        </DownloadButton>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>{language === 'vi' ? 'Báo Cáo Tin Đăng' : 'Job Posts Report'}</td>
                      <td>{language === 'vi' ? 'Tháng 6/2026' : 'June 2026'}</td>
                      <td><span style={{ color: '#f59e0b', fontWeight: 600 }}>{language === 'vi' ? 'Đang Xử Lý' : 'Processing'}</span></td>
                      <td>2026-06-30</td>
                      <td>
                        <DownloadButton style={{ padding: '6px 12px', fontSize: '12px', opacity: 0.5, cursor: 'not-allowed' }}>
                          <Download size={14} />
                          {language === 'vi' ? 'Tải' : 'Download'}
                        </DownloadButton>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>{language === 'vi' ? 'Báo Cáo Gói Dịch Vụ' : 'Package Report'}</td>
                      <td>{language === 'vi' ? 'Tháng 5/2026' : 'May 2026'}</td>
                      <td><span style={{ color: '#10b981', fontWeight: 600 }}>{language === 'vi' ? 'Hoàn Thành' : 'Completed'}</span></td>
                      <td>2026-05-31</td>
                      <td>
                        <DownloadButton style={{ padding: '6px 12px', fontSize: '12px' }}>
                          <Download size={14} />
                          {language === 'vi' ? 'Tải' : 'Download'}
                        </DownloadButton>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </TableWrapper>
            </TableCard>
          </>
        )}
      </PageContainer>
    </DashboardLayout>
  );
};

export default Reports;
