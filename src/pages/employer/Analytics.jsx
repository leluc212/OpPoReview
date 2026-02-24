import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { TrendingUp, Users, Eye, DollarSign, Calendar, BarChart3, PieChart, Activity, Briefcase } from 'lucide-react';

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
  background: ${props => props.$active ? props.theme.colors.primary : 'white'};
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
  background: white;
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
  background: white;
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
  background: white;
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
  const [timeFilter, setTimeFilter] = useState('month');

  const stats = [
    {
      icon: <Briefcase />,
      label: 'Tổng tin tuyển dụng',
      value: '24',
      trend: '+12%',
      positive: true,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <Users />,
      label: 'Tổng ứng viên',
      value: '1,234',
      trend: '+28%',
      positive: true,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: <Eye />,
      label: 'Lượt xem công việc',
      value: '8,456',
      trend: '+15%',
      positive: true,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: <DollarSign />,
      label: 'Chi phí tuyển dụng',
      value: '45M',
      trend: '-8%',
      positive: true,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  const topJobs = [
    { title: 'Nhân viên kinh doanh', applications: 156, views: 1234, status: 'active' },
    { title: 'Nhân viên kho', applications: 89, views: 876, status: 'active' },
    { title: 'Lễ tân', applications: 67, views: 654, status: 'closed' },
    { title: 'Nhân viên phục vụ', applications: 45, views: 432, status: 'active' },
    { title: 'Nhân viên giao hàng', applications: 34, views: 321, status: 'draft' }
  ];

  return (
    <DashboardLayout role="employer">
      <PageContainer>
        <PageHeader>
          <h1>Phân tích & Thống kê</h1>
          <p>Theo dõi hiệu suất tuyển dụng của bạn</p>
        </PageHeader>

        <FilterBar>
          <FilterButton $active={timeFilter === 'week'} onClick={() => setTimeFilter('week')}>
            7 ngày qua
          </FilterButton>
          <FilterButton $active={timeFilter === 'month'} onClick={() => setTimeFilter('month')}>
            30 ngày qua
          </FilterButton>
          <FilterButton $active={timeFilter === 'quarter'} onClick={() => setTimeFilter('quarter')}>
            3 tháng qua
          </FilterButton>
          <FilterButton $active={timeFilter === 'year'} onClick={() => setTimeFilter('year')}>
            Năm nay
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
              <h3>Xu hướng ứng tuyển</h3>
              <Calendar size={20} />
            </ChartHeader>
            <ChartPlaceholder>
              <BarChart3 />
              <p>Biểu đồ xu hướng ứng tuyển theo thời gian</p>
            </ChartPlaceholder>
          </ChartCard>

          <ChartCard>
            <ChartHeader>
              <h3>Phân bố ứng viên</h3>
              <PieChart size={20} />
            </ChartHeader>
            <ChartPlaceholder>
              <PieChart />
              <p>Biểu đồ phân bố ứng viên theo vị trí</p>
            </ChartPlaceholder>
          </ChartCard>
        </ChartsGrid>

        <TableContainer>
          <TableHeader>
            <h3>Top công việc hot nhất</h3>
          </TableHeader>
          <Table>
            <thead>
              <tr>
                <th>Tiêu đề công việc</th>
                <th>Ứng viên</th>
                <th>Lượt xem</th>
                <th>Trạng thái</th>
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
                      {job.status === 'active' && 'Đang tuyển'}
                      {job.status === 'closed' && 'Đã đóng'}
                      {job.status === 'draft' && 'Nháp'}
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
