import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { TrendingUp, TrendingDown, Users, Eye, DollarSign, Calendar, BarChart3, PieChart, Briefcase } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// ─── Page wrapper ────────────────────────────────────────────
const PageContainer = styled(motion.div)``;

// ─── Header (đồng nhất với Applications) ─────────────────────
const PageHeader = styled.div`
  margin-bottom: 24px;
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

// ─── Time filter pills ────────────────────────────────────────
const FilterBar = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterPill = styled(motion.button)`
  padding: 7px 18px;
  border-radius: 100px;
  background: ${props => props.$active ? '#EFF6FF' : 'transparent'};
  border: 1.5px solid ${props => props.$active ? '#BFDBFE' : 'transparent'};
  font-weight: 700;
  font-size: 13px;
  color: ${props => props.$active ? '#1e40af' : '#94A3B8'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  &:hover {
    color: #1e40af;
    background: #EFF6FF;
    border-color: #BFDBFE;
  }
`;

// ─── Stat cards ───────────────────────────────────────────────
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
`;

const StatCard = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 20px 22px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    border-radius: 16px 0 0 16px;
    background: ${props => props.$accent || '#1e40af'};
    opacity: 0.6;
  }

  &:hover {
    border-color: #BFDBFE;
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.12);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const StatIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: ${props => props.$bg || '#EFF6FF'};
  border: 1.5px solid ${props => props.$border || '#BFDBFE'};
  display: flex;
  align-items: center;
  justify-content: center;
  svg { width: 20px; height: 20px; color: ${props => props.$iconColor || '#1e40af'}; }
`;

const StatTrend = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 100px;
  background: ${props => props.$positive ? '#ECFDF5' : '#FEF2F2'};
  color: ${props => props.$positive ? '#10B981' : '#EF4444'};
  border: 1px solid ${props => props.$positive ? '#A7F3D0' : '#FECACA'};
  font-size: 12px;
  font-weight: 700;
  svg { width: 12px; height: 12px; }
`;

const StatValue = styled.div`
  font-size: 30px;
  font-weight: 900;
  color: ${props => props.theme.colors.text};
  letter-spacing: -1px;
  line-height: 1;
  margin-bottom: 6px;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textLight};
  font-size: 13px;
  font-weight: 500;
`;

// ─── Charts ───────────────────────────────────────────────────
const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const ChartCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 22px 24px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #F1F5F9;
  h3 { font-size: 15px; font-weight: 700; color: ${props => props.theme.colors.text}; }
  svg { color: #94A3B8; }
`;

const ChartPlaceholder = styled.div`
  height: 260px;
  background: #F8FAFC;
  border-radius: 12px;
  border: 1.5px dashed #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  color: #CBD5E1;
  svg { width: 40px; height: 40px; opacity: 0.4; }
  p { font-size: 13px; font-weight: 500; }
`;

// ─── Top jobs table ───────────────────────────────────────────
const TableContainer = styled.div`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
`;

const TableHeader = styled.div`
  padding: 18px 22px;
  border-bottom: 1px solid #F1F5F9;
  h3 { font-size: 15px; font-weight: 700; color: ${props => props.theme.colors.text}; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    text-align: left;
    padding: 12px 22px;
    background: #F8FAFC;
    color: #94A3B8;
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 1px solid #F1F5F9;
  }
  td {
    padding: 14px 22px;
    font-size: 13.5px;
    color: ${props => props.theme.colors.text};
    font-weight: 500;
  }
  tr:hover td { background: #FAFBFF; }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  background: ${props =>
    props.$status === 'active' ? '#ECFDF5' :
    props.$status === 'closed' ? '#FEF2F2' : '#FFFBEB'};
  color: ${props =>
    props.$status === 'active' ? '#10B981' :
    props.$status === 'closed' ? '#EF4444' : '#F59E0B'};
  border: 1px solid ${props =>
    props.$status === 'active' ? '#A7F3D0' :
    props.$status === 'closed' ? '#FECACA' : '#FDE68A'};
  &::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
`;

// ─── Component ────────────────────────────────────────────────
const Analytics = () => {
  const { language } = useLanguage();
  const [timeFilter, setTimeFilter] = useState('month');

  const stats = [
    { icon: <Briefcase />, label: language === 'vi' ? 'Tổng tin tuyển dụng' : 'Total job posts', value: '24', trend: '+12%', positive: true, accent: '#1e40af', bg: '#EFF6FF', border: '#BFDBFE', iconColor: '#1e40af' },
    { icon: <Users />, label: language === 'vi' ? 'Tổng ứng viên' : 'Total candidates', value: '1,234', trend: '+28%', positive: true, accent: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8', iconColor: '#EC4899' },
    { icon: <Eye />, label: language === 'vi' ? 'Lượt xem công việc' : 'Job views', value: '8,456', trend: '+15%', positive: true, accent: '#06B6D4', bg: '#ECFEFF', border: '#A5F3FC', iconColor: '#06B6D4' },
    { icon: <DollarSign />, label: language === 'vi' ? 'Chi phí tuyển dụng' : 'Hiring cost', value: '45M', trend: '-8%', positive: false, accent: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', iconColor: '#10B981' },
  ];

  const topJobs = [
    { title: language === 'vi' ? 'Nhân viên kinh doanh' : 'Sales Executive', applications: 156, views: 1234, status: 'active' },
    { title: language === 'vi' ? 'Nhân viên kho' : 'Warehouse Staff', applications: 89, views: 876, status: 'active' },
    { title: language === 'vi' ? 'Lễ tân' : 'Receptionist', applications: 67, views: 654, status: 'closed' },
    { title: language === 'vi' ? 'Nhân viên phục vụ' : 'Service Staff', applications: 45, views: 432, status: 'active' },
    { title: language === 'vi' ? 'Nhân viên giao hàng' : 'Delivery Staff', applications: 34, views: 321, status: 'draft' },
  ];

  const timePills = [
    { id: 'week',    label: language === 'vi' ? '7 ngày qua'  : 'Last 7 days' },
    { id: 'month',   label: language === 'vi' ? '30 ngày qua' : 'Last 30 days' },
    { id: 'quarter', label: language === 'vi' ? '3 tháng qua' : 'Last 3 months' },
    { id: 'year',    label: language === 'vi' ? 'Năm nay'     : 'This year' },
  ];

  return (
    <DashboardLayout role="employer">
      <PageContainer
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* ── Header ── */}
        <PageHeader>
          <PageTitleGroup>
            <PageIconBox><BarChart3 /></PageIconBox>
            <PageTitleText>
              <h1>{language === 'vi' ? 'Phân tích & Thống kê' : 'Analytics & Insights'}</h1>
              <p>{language === 'vi' ? 'Theo dõi hiệu suất tuyển dụng của bạn' : 'Track your hiring performance'}</p>
            </PageTitleText>
          </PageTitleGroup>
        </PageHeader>

        {/* ── Time filter ── */}
        <FilterBar>
          {timePills.map(p => (
            <FilterPill
              key={p.id}
              $active={timeFilter === p.id}
              onClick={() => setTimeFilter(p.id)}
              whileTap={{ scale: 0.97 }}
            >
              {p.label}
            </FilterPill>
          ))}
        </FilterBar>

        {/* ── Stat cards ── */}
        <StatsGrid>
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              $accent={stat.accent}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.07 }}
              whileHover={{ y: -3 }}
            >
              <StatHeader>
                <StatIcon $bg={stat.bg} $border={stat.border} $iconColor={stat.iconColor}>
                  {stat.icon}
                </StatIcon>
                <StatTrend $positive={stat.positive}>
                  {stat.positive ? <TrendingUp /> : <TrendingDown />}
                  {stat.trend}
                </StatTrend>
              </StatHeader>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        {/* ── Charts ── */}
        <ChartsGrid>
          <ChartCard>
            <ChartHeader>
              <h3>{language === 'vi' ? 'Xu hướng ứng tuyển' : 'Application Trend'}</h3>
              <Calendar size={18} />
            </ChartHeader>
            <ChartPlaceholder>
              <BarChart3 />
              <p>{language === 'vi' ? 'Biểu đồ xu hướng ứng tuyển theo thời gian' : 'Application trend chart over time'}</p>
            </ChartPlaceholder>
          </ChartCard>

          <ChartCard>
            <ChartHeader>
              <h3>{language === 'vi' ? 'Phân bố ứng viên' : 'Candidate Distribution'}</h3>
              <PieChart size={18} />
            </ChartHeader>
            <ChartPlaceholder>
              <PieChart />
              <p>{language === 'vi' ? 'Biểu đồ phân bố ứng viên theo vị trí' : 'Candidate distribution by role'}</p>
            </ChartPlaceholder>
          </ChartCard>
        </ChartsGrid>

        {/* ── Top jobs ── */}
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
              {topJobs.map((job, i) => (
                <tr key={i}>
                  <td>{job.title}</td>
                  <td>{job.applications}</td>
                  <td>{job.views}</td>
                  <td>
                    <StatusBadge $status={job.status}>
                      {job.status === 'active' && (language === 'vi' ? 'Đang tuyển' : 'Active')}
                      {job.status === 'closed' && (language === 'vi' ? 'Đã đóng' : 'Closed')}
                      {job.status === 'draft'  && (language === 'vi' ? 'Nháp' : 'Draft')}
                    </StatusBadge>
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
