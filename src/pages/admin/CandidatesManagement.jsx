import { useState, useMemo } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, 
  Briefcase,
  TrendingUp,
  Clock,
  Eye,
  UserCheck,
  UserX,
  Activity
} from 'lucide-react';

const PageContainer = styled.div``;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 16px;
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
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;
  
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
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$color};
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
`;

const StatChange = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartContainer = styled.div`
  height: 300px;
  position: relative;
`;

const ChartSVG = styled.svg`
  width: 100%;
  height: 100%;
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
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.$color};
  }
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const ActivityDescription = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
`;

const ActivityTime = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textLight};
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RecentActivityCard = styled(Card)``;

const RecentActivityTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  padding: 12px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.md};
  align-items: center;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const UserInfo = styled.div`
  h4 {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
  }
  
  p {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const TimeInfo = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  text-align: right;
  
  @media (max-width: 640px) {
    text-align: left;
  }
`;

const CandidatesManagement = () => {
  const { language } = useLanguage();

  // Dữ liệu thống kê
  const stats = {
    total: { value: 2458, change: 12, label: language === 'vi' ? 'Tổng người dùng' : 'Total Users' },
    active: { value: 1834, change: 8, label: language === 'vi' ? 'Đang hoạt động' : 'Active Users' },
    newThisMonth: { value: 234, change: 15, label: language === 'vi' ? 'Mới tháng này' : 'New This Month' },
    verified: { value: 1956, change: 5, label: language === 'vi' ? 'Đã xác thực' : 'Verified' }
  };

  // Dữ liệu biểu đồ hoạt động (7 ngày)
  const chartData = [
    { day: 'T2', registrations: 45, applications: 32 },
    { day: 'T3', registrations: 52, applications: 38 },
    { day: 'T4', registrations: 48, applications: 35 },
    { day: 'T5', registrations: 61, applications: 42 },
    { day: 'T6', registrations: 55, applications: 40 },
    { day: 'T7', registrations: 70, applications: 55 },
    { day: 'CN', registrations: 65, applications: 48 }
  ];

  const maxValue = Math.max(...chartData.flatMap(d => [d.registrations, d.applications]));

  // Hoạt động gần đây
  const recentActivities = [
    { 
      user: 'Abc', 
      action: language === 'vi' ? 'Đăng ký tài khoản dùng' : 'Account registration',
      time: language === 'vi' ? '30 phút trước' : '30 minutes ago',
      type: 'register'
    },
    { 
      user: 'xyz', 
      action: language === 'vi' ? 'Ứng tuyển Bartender' : 'Applied for Bartender',
      time: language === 'vi' ? '1 giờ trước' : '1 hour ago',
      type: 'apply'
    },
    { 
      user: 'Design Inc.', 
      action: language === 'vi' ? 'Đăng tin tuyển dụng' : 'Posted job listing',
      time: language === 'vi' ? '3 giờ trước' : '3 hours ago',
      type: 'post'
    }
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'register': return <UserCheck />;
      case 'apply': return <Briefcase />;
      case 'post': return <Activity />;
      default: return <Users />;
    }
  };

  const getActivityColor = (type) => {
    switch(type) {
      case 'register': return '#10b981';
      case 'apply': return '#3b82f6';
      case 'post': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <DashboardLayout role="admin">
      <PageContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Quản Lý Ứng Viên' : 'Candidates Management'}</h1>
          <p>{language === 'vi' ? 'Theo dõi và quản lý hoạt động ứng viên' : 'Monitor and manage candidate activities'}</p>
        </PageHeader>

        <StatsGrid>
          <StatCard $color="#6366f1">
            <StatIcon $color="#6366f1">
              <Users />
            </StatIcon>
            <StatValue>
              {stats.total.value.toLocaleString()}
              <StatChange $positive={stats.total.change > 0}>
                <TrendingUp size={16} />
                +{stats.total.change}%
              </StatChange>
            </StatValue>
            <StatLabel>{stats.total.label}</StatLabel>
          </StatCard>

          <StatCard $color="#10b981">
            <StatIcon $color="#10b981">
              <Activity />
            </StatIcon>
            <StatValue>
              {stats.active.value.toLocaleString()}
              <StatChange $positive={stats.active.change > 0}>
                <TrendingUp size={16} />
                +{stats.active.change}%
              </StatChange>
            </StatValue>
            <StatLabel>{stats.active.label}</StatLabel>
          </StatCard>

          <StatCard $color="#f59e0b">
            <StatIcon $color="#f59e0b">
              <UserCheck />
            </StatIcon>
            <StatValue>
              {stats.newThisMonth.value.toLocaleString()}
              <StatChange $positive={stats.newThisMonth.change > 0}>
                <TrendingUp size={16} />
                +{stats.newThisMonth.change}%
              </StatChange>
            </StatValue>
            <StatLabel>{stats.newThisMonth.label}</StatLabel>
          </StatCard>

          <StatCard $color="#8b5cf6">
            <StatIcon $color="#8b5cf6">
              <UserX />
            </StatIcon>
            <StatValue>
              {stats.verified.value.toLocaleString()}
              <StatChange $positive={stats.verified.change > 0}>
                <TrendingUp size={16} />
                +{stats.verified.change}%
              </StatChange>
            </StatValue>
            <StatLabel>{stats.verified.label}</StatLabel>
          </StatCard>
        </StatsGrid>

        <ContentGrid>
          <Card>
            <CardHeader>
              <CardTitle>
                <Activity size={20} />
                {language === 'vi' ? 'Hoạt Động Nền Tảng' : 'Platform Activity'}
              </CardTitle>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                {language === 'vi' ? '7 ngày qua' : 'Last 7 days'}
              </div>
            </CardHeader>
            <ChartContainer>
              <ChartSVG viewBox="0 0 700 300">
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
                
                {/* Registrations line */}
                <polyline
                  points={chartData.map((d, i) => 
                    `${100 + i * 90},${250 - (d.registrations / maxValue) * 180}`
                  ).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                
                {/* Applications line */}
                <polyline
                  points={chartData.map((d, i) => 
                    `${100 + i * 90},${250 - (d.applications / maxValue) * 180}`
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
                      cy={250 - (d.registrations / maxValue) * 180}
                      r="4"
                      fill="#3b82f6"
                    />
                    <circle
                      cx={100 + i * 90}
                      cy={250 - (d.applications / maxValue) * 180}
                      r="4"
                      fill="#10b981"
                    />
                    <text
                      x={100 + i * 90}
                      y="280"
                      textAnchor="middle"
                      fontSize="12"
                      fill="#6b7280"
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
                {language === 'vi' ? 'Đăng ký mới' : 'New Registrations'}
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#10b981" />
                {language === 'vi' ? 'Ứng tuyển' : 'Applications'}
              </LegendItem>
            </ChartLegend>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Clock size={20} />
                {language === 'vi' ? 'Hoạt Động Gần Đây' : 'Recent Activity'}
              </CardTitle>
            </CardHeader>
            <ActivityList>
              {recentActivities.map((activity, index) => (
                <ActivityItem key={index}>
                  <ActivityIcon $color={getActivityColor(activity.type)}>
                    {getActivityIcon(activity.type)}
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityTitle>{activity.user}</ActivityTitle>
                    <ActivityDescription>{activity.action}</ActivityDescription>
                  </ActivityContent>
                  <ActivityTime>
                    <Clock size={12} />
                    {activity.time}
                  </ActivityTime>
                </ActivityItem>
              ))}
            </ActivityList>
          </Card>
        </ContentGrid>

        <RecentActivityCard>
          <CardHeader>
            <CardTitle>
              <Users size={20} />
              {language === 'vi' ? 'Hoạt Động Gần Đây' : 'Recent Activity'}
            </CardTitle>
          </CardHeader>
          <RecentActivityTable>
            {recentActivities.map((activity, index) => (
              <TableRow key={index}>
                <UserInfo>
                  <h4>{activity.user}</h4>
                  <p>{activity.action}</p>
                </UserInfo>
                <TimeInfo>{activity.time}</TimeInfo>
              </TableRow>
            ))}
          </RecentActivityTable>
        </RecentActivityCard>
      </PageContainer>
    </DashboardLayout>
  );
};

export default CandidatesManagement;
