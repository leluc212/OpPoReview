import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { TrendingUp, Users, Eye, DollarSign, Calendar, BarChart3, PieChart, Activity, Briefcase } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 16px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgLight};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.$active ? 'white' : props.theme.colors.primary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    transform: translateY(-4px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$color || props.theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => props.$positive ? '#DCFCE7' : '#FEE2E2'};
  color: ${props => props.$positive ? '#16A34A' : '#DC2626'};
  font-size: 12px;
  font-weight: 600;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textLight};
  font-size: 14px;
  font-weight: 500;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const ChartCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 28px;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  background: linear-gradient(135deg, ${props => props.theme.colors.bgLight} 0%, white 100%);
  border-radius: ${props => props.theme.borderRadius.md};
  border: 2px dashed ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  color: ${props => props.theme.colors.textLight};
  
  svg {
    width: 48px;
    height: 48px;
    opacity: 0.3;
  }
  
  p {
    font-size: 14px;
  }
`;

const TableContainer = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 16px 24px;
    background: ${props => props.theme.colors.bgLight};
    color: ${props => props.theme.colors.textLight};
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  td {
    padding: 16px 24px;
    border-top: 1px solid ${props => props.theme.colors.border};
    font-size: 14px;
    color: ${props => props.theme.colors.text};
  }
  
  tr:hover {
    background: ${props => props.theme.colors.bgLight};
  }
`;

const Badge = styled.span`
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch(props.$status) {
      case 'active': return '#DCFCE7';
      case 'closed': return '#FEE2E2';
      case 'draft': return '#FEF3C7';
      default: return props.theme.colors.bgLight;
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'active': return '#16A34A';
      case 'closed': return '#DC2626';
      case 'draft': return '#CA8A04';
      default: return props.theme.colors.text;
    }
  }};
`;

const Analytics = () => {
  const { language } = useLanguage();
  const [timeFilter, setTimeFilter] = useState('month');

  const stats = [
    {
      icon: <Briefcase />,
      label: language === 'vi' ? 'Tổng tin tuyển dụng' : 'Total job posts',
      value: '24',
      trend: '+12%',
      positive: true,
      color: 'linear-gradient(135deg, #1e40af 0%, #1e40af 100%)'
    },
    {
      icon: <Users />,
      label: language === 'vi' ? 'Tổng ứng viên' : 'Total candidates',
      value: '1,234',
      trend: '+28%',
      positive: true,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: <Eye />,
      label: language === 'vi' ? 'Lượt xem công việc' : 'Job views',
      value: '8,456',
      trend: '+15%',
      positive: true,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: <DollarSign />,
      label: language === 'vi' ? 'Chi phí tuyển dụng' : 'Hiring cost',
      value: '45M',
      trend: '-8%',
      positive: true,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  const topJobs = [
    { title: language === 'vi' ? 'Nhân viên kinh doanh' : 'Sales Executive', applications: 156, views: 1234, status: 'active' },
    { title: language === 'vi' ? 'Nhân viên kho' : 'Warehouse Staff', applications: 89, views: 876, status: 'active' },
    { title: language === 'vi' ? 'Lễ tân' : 'Receptionist', applications: 67, views: 654, status: 'closed' },
    { title: language === 'vi' ? 'Nhân viên phục vụ' : 'Service Staff', applications: 45, views: 432, status: 'active' },
    { title: language === 'vi' ? 'Nhân viên giao hàng' : 'Delivery Staff', applications: 34, views: 321, status: 'draft' }
  ];

  return (
    <DashboardLayout role="employer">
      <PageContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Phân tích & Thống kê' : 'Analytics & Insights'}</h1>
          <p>{language === 'vi' ? 'Theo dõi hiệu suất tuyển dụng của bạn' : 'Track your hiring performance'}</p>
        </PageHeader>

        <FilterBar>
          <FilterButton $active={timeFilter === 'week'} onClick={() => setTimeFilter('week')}>
            {language === 'vi' ? '7 ngày qua' : 'Last 7 days'}
          </FilterButton>
          <FilterButton $active={timeFilter === 'month'} onClick={() => setTimeFilter('month')}>
            {language === 'vi' ? '30 ngày qua' : 'Last 30 days'}
          </FilterButton>
          <FilterButton $active={timeFilter === 'quarter'} onClick={() => setTimeFilter('quarter')}>
            {language === 'vi' ? '3 tháng qua' : 'Last 3 months'}
          </FilterButton>
          <FilterButton $active={timeFilter === 'year'} onClick={() => setTimeFilter('year')}>
            {language === 'vi' ? 'Năm nay' : 'This year'}
          </FilterButton>
        </FilterBar>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatHeader>
                <StatIcon $color={stat.color}>
                  {stat.icon}
                </StatIcon>
                <StatTrend $positive={stat.positive}>
                  <TrendingUp />
                  {stat.trend}
                </StatTrend>
              </StatHeader>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <ChartsGrid>
          <ChartCard>
            <ChartHeader>
              <h3>{language === 'vi' ? 'Xu hướng ứng tuyển' : 'Application Trend'}</h3>
              <Calendar size={20} />
            </ChartHeader>
            <ChartPlaceholder>
              <BarChart3 />
              <p>{language === 'vi' ? 'Biểu đồ xu hướng ứng tuyển theo thời gian' : 'Application trend chart over time'}</p>
            </ChartPlaceholder>
          </ChartCard>

          <ChartCard>
            <ChartHeader>
              <h3>{language === 'vi' ? 'Phân bố ứng viên' : 'Candidate Distribution'}</h3>
              <PieChart size={20} />
            </ChartHeader>
            <ChartPlaceholder>
              <PieChart />
              <p>{language === 'vi' ? 'Biểu đồ phân bố ứng viên theo vị trí' : 'Candidate distribution by role'}</p>
            </ChartPlaceholder>
          </ChartCard>
        </ChartsGrid>

        <TableContainer>
          <TableHeader>
            <h3>{language === 'vi' ? 'Top công việc hot nhất' : 'Top Performing Jobs'}</h3>
          </TableHeader>
          <Table>
            <thead>
              <tr>
                <th>{language === 'vi' ? 'Tiêu đề công việc' : 'Job title'}</th>
                <th>{language === 'vi' ? 'Ứng viên' : 'Candidates'}</th>
                <th>{language === 'vi' ? 'Lượt xem' : 'Views'}</th>
                <th>{language === 'vi' ? 'Trạng thái' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {topJobs.map((job, index) => (
                <tr key={index}>
                  <td>{job.title}</td>
                  <td>{job.applications}</td>
                  <td>{job.views}</td>
                  <td>
                    <Badge $status={job.status}>
                      {job.status === 'active' && (language === 'vi' ? 'Đang tuyển' : 'Active')}
                      {job.status === 'closed' && (language === 'vi' ? 'Đã đóng' : 'Closed')}
                      {job.status === 'draft' && (language === 'vi' ? 'Nháp' : 'Draft')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </PageContainer>
    </DashboardLayout>
  );
};

export default Analytics;
