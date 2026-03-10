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
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
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
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 20px 22px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    border-radius: 16px 0 0 16px;
    background: ${props => props.$accent || '#1e40af'};
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: ${props => props.$accent || '#1e40af'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: ${props => props.$accent || '#BFDBFE'};
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.12);

    &::before {
      opacity: 1;
      width: 5px;
    }

    &::after {
      opacity: 0.02;
    }
  }

  > * {
    position: relative;
    z-index: 1;
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
  transition: all 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.$iconColor || '#1e40af'};
    transition: transform 0.3s ease;
  }

  ${StatCard}:hover & {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.15);

    svg {
      transform: scale(1.1);
    }
  }
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
  transition: all 0.3s ease;

  ${StatCard}:hover & {
    transform: translateX(2px);
    color: ${props => props.$accent || props.theme.colors.text};
  }
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textLight};
  font-size: 13px;
  font-weight: 500;
`;

// ─── Charts ───────────────────────────────────────────────────
const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 22px 24px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.12);
    border-color: #BFDBFE;
  }
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #F1F5F9;

  .title-group {
    h3 {
      font-size: 16px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
      margin-bottom: 4px;
    }
    p {
      font-size: 12px;
      color: #94A3B8;
      font-weight: 500;
    }
  }

  svg {
    color: #94A3B8;
    flex-shrink: 0;
  }
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 260px;
  overflow: visible;

  @media (max-width: 640px) {
    height: 200px;
  }
`;

const ChartLegend = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748B;
  font-weight: 600;

  &::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.$color};
  }
`;

const Tooltip = styled.div`
  position: absolute;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(8px);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  pointer-events: none;
  white-space: nowrap;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translate(-50%, -100%);
  margin-top: -8px;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid rgba(15, 23, 42, 0.95);
  }
`;

const SectionDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #E8EFFF;
  margin: 32px 0;
`;

const PipelineCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
`;

const PipelineHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #F1F5F9;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
  }

  p {
    font-size: 12px;
    color: #94A3B8;
    font-weight: 500;
  }
`;

const PipelineStage = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const StageName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const StageValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #1e40af;

  span {
    color: #94A3B8;
    font-weight: 500;
    margin-left: 4px;
    font-size: 12px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #F1F5F9;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.$width}%;
  background: ${props => props.$color};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const TotalRow = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #E8EFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #64748B;
`;

const TotalValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #1e40af;
`;

// ─── Top jobs table ───────────────────────────────────────────
const TableContainer = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.12);
    border-color: #BFDBFE;
  }
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
    padding: 14px 22px;
    background: #F8FAFC;
    color: #94A3B8;
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 1px solid #F1F5F9;
  }

  td {
    padding: 16px 22px;
    font-size: 13.5px;
    color: ${props => props.theme.colors.text};
    font-weight: 500;
    border-bottom: 1px solid #F1F5F9;
  }

  tbody tr {
    transition: all 0.2s ease;

    &:hover {
      background: #FAFBFF;
      transform: scale(1.01);
    }

    &:last-child td {
      border-bottom: none;
    }
  }

  @media (max-width: 768px) {
    th, td {
      padding: 12px 16px;
      font-size: 12px;
    }
  }
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
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Application trend data
  const applicationData = [
    { month: language === 'vi' ? 'T1' : 'Jan', value: 45 },
    { month: language === 'vi' ? 'T2' : 'Feb', value: 52 },
    { month: language === 'vi' ? 'T3' : 'Mar', value: 48 },
    { month: language === 'vi' ? 'T4' : 'Apr', value: 65 },
    { month: language === 'vi' ? 'T5' : 'May', value: 78 },
    { month: language === 'vi' ? 'T6' : 'Jun', value: 92 },
    { month: language === 'vi' ? 'T7' : 'Jul', value: 88 },
    { month: language === 'vi' ? 'T8' : 'Aug', value: 105 },
    { month: language === 'vi' ? 'T9' : 'Sep', value: 98 },
    { month: language === 'vi' ? 'T10' : 'Oct', value: 112 },
    { month: language === 'vi' ? 'T11' : 'Nov', value: 128 },
    { month: language === 'vi' ? 'T12' : 'Dec', value: 145 },
  ];

  const maxValue = 160;

  // Generate smooth curve path
  const generatePath = (data) => {
    const points = data.map((d, i) => ({
      x: 60 + (i * 50),
      y: 220 - (d.value / maxValue) * 180
    }));

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const xMid = (points[i].x + points[i + 1].x) / 2;
      const yMid = (points[i].y + points[i + 1].y) / 2;
      const cpX1 = (xMid + points[i].x) / 2;
      const cpX2 = (xMid + points[i + 1].x) / 2;
      path += ` Q ${cpX1} ${points[i].y}, ${xMid} ${yMid}`;
      path += ` Q ${cpX2} ${points[i + 1].y}, ${points[i + 1].x} ${points[i + 1].y}`;
    }
    return path;
  };

  const applicationPath = generatePath(applicationData);

  // Candidate distribution data
  const candidateDistribution = [
    { label: language === 'vi' ? 'Kinh doanh' : 'Sales', value: 35, color: '#3B82F6' },
    { label: language === 'vi' ? 'Kỹ thuật' : 'Technical', value: 25, color: '#10B981' },
    { label: language === 'vi' ? 'Dịch vụ' : 'Service', value: 20, color: '#F59E0B' },
    { label: language === 'vi' ? 'Khác' : 'Others', value: 20, color: '#8B5CF6' },
  ];

  // Application pipeline stages
  const pipelineStages = [
    { name: language === 'vi' ? 'Đã nộp hồ sơ' : 'Applied', count: 234, total: 234, color: '#3B82F6' },
    { name: language === 'vi' ? 'Đang xem xét' : 'Reviewing', count: 156, total: 234, color: '#10B981' },
    { name: language === 'vi' ? 'Phỏng vấn' : 'Interview', count: 89, total: 234, color: '#F59E0B' },
    { name: language === 'vi' ? 'Chào nhận việc' : 'Offered', count: 45, total: 234, color: '#EC4899' },
    { name: language === 'vi' ? 'Đã tuyển' : 'Hired', count: 28, total: 234, color: '#8B5CF6' },
  ];

  const stats = [
    { icon: <Briefcase />, label: language === 'vi' ? 'Tổng tin tuyển dụng' : 'Total job posts', value: '24', trend: '+12%', positive: true, accent: '#1e40af', bg: '#EFF6FF', border: '#BFDBFE', iconColor: '#1e40af' },
    { icon: <Users />, label: language === 'vi' ? 'Tổng ứng viên' : 'Total candidates', value: '1,234', trend: '+28%', positive: true, accent: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8', iconColor: '#EC4899' },
    { icon: <Eye />, label: language === 'vi' ? 'Lượt xem công việc' : 'Job views', value: '8,456', trend: '+15%', positive: true, accent: '#06B6D4', bg: '#ECFEFF', border: '#A5F3FC', iconColor: '#06B6D4' },
    { icon: <DollarSign />, label: language === 'vi' ? 'Chi phí tuyển dụng' : 'Hiring cost', value: '45M VNĐ', trend: '-8%', positive: true, accent: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', iconColor: '#10B981' },
  ];

  const topJobs = [
    { title: language === 'vi' ? 'Nhân viên kinh doanh' : 'Sales Executive', applications: 156, views: 1234, status: 'active' },
    { title: language === 'vi' ? 'Nhân viên kho' : 'Warehouse Staff', applications: 89, views: 876, status: 'active' },
    { title: language === 'vi' ? 'Lễ tân' : 'Receptionist', applications: 67, views: 654, status: 'closed' },
    { title: language === 'vi' ? 'Nhân viên Phục Vụ' : 'Service Staff', applications: 45, views: 432, status: 'active' },
    { title: language === 'vi' ? 'Nhân viên Giao Hàng' : 'Delivery Staff', applications: 34, views: 321, status: 'draft' },
  ];

  const timePills = [
    { id: 'week',    label: language === 'vi' ? '7 ngày qua'  : 'Last 7 days' },
    { id: 'month',   label: language === 'vi' ? '30 ngày qua' : 'Last 30 days' },
    { id: 'quarter', label: language === 'vi' ? '3 tháng qua' : 'Last 3 months' },
    { id: 'year',    label: language === 'vi' ? 'Năm nay'     : 'This year' },
  ];

  return (
    <DashboardLayout role="employer" key={language}>
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
              <StatValue $accent={stat.accent}>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        {/* ── Charts ── */}
        <ChartsGrid>
          <ChartCard>
            <ChartHeader>
              <div className="title-group">
                <h3>{language === 'vi' ? 'Xu hướng ứng tuyển' : 'Application Trend'}</h3>
                <p>{language === 'vi' ? 'Theo dõi số lượng ứng tuyển theo thời gian' : 'Track application count over time'}</p>
              </div>
              <Calendar size={18} />
            </ChartHeader>
            <ChartLegend>
              <LegendItem $color="#1e40af">{language === 'vi' ? 'Số lượng ứng tuyển' : 'Applications'}</LegendItem>
            </ChartLegend>
            <ChartSvg viewBox="0 0 660 260">
              <defs>
                <linearGradient id="applicationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e40af" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="40"
                  y1={40 + i * 45}
                  x2="640"
                  y2={40 + i * 45}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
              ))}

              {/* Y-axis labels */}
              {['160', '120', '80', '40', '0'].map((label, i) => (
                <text
                  key={i}
                  x="30"
                  y={45 + i * 45}
                  textAnchor="end"
                  fontSize="11"
                  fill="#94A3B8"
                  fontWeight="500"
                >
                  {label}
                </text>
              ))}

              {/* Area under curve */}
              <path
                d={`${applicationPath} L 660 220 L 60 220 Z`}
                fill="url(#applicationGradient)"
              />

              {/* Line */}
              <path
                d={applicationPath}
                fill="none"
                stroke="#1e40af"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points with hover */}
              {applicationData.map((d, i) => {
                const cx = 60 + i * 50;
                const cy = 220 - (d.value / maxValue) * 180;
                const isHovered = hoveredPoint === i;

                return (
                  <g key={i}>
                    {/* Hover area */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="15"
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredPoint(i)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />

                    {/* Glow when hovered */}
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="8"
                        fill="#1e40af"
                        opacity="0.3"
                        filter="url(#glow)"
                      />
                    )}

                    {/* Data point */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? "6" : "4"}
                      fill="#1e40af"
                      stroke="#ffffff"
                      strokeWidth="2"
                      style={{
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                    />

                    {/* Tooltip */}
                    {isHovered && (
                      <>
                        <rect
                          x={cx - 35}
                          y={cy - 50}
                          width="70"
                          height="36"
                          rx="6"
                          fill="rgba(15, 23, 42, 0.95)"
                        />
                        <text
                          x={cx}
                          y={cy - 34}
                          textAnchor="middle"
                          fontSize="11"
                          fill="white"
                          fontWeight="600"
                        >
                          {d.month}
                        </text>
                        <text
                          x={cx}
                          y={cy - 20}
                          textAnchor="middle"
                          fontSize="14"
                          fill="white"
                          fontWeight="800"
                        >
                          {d.value}
                        </text>
                        <path
                          d={`M ${cx - 4} ${cy - 14} L ${cx + 4} ${cy - 14} L ${cx} ${cy - 8} Z`}
                          fill="rgba(15, 23, 42, 0.95)"
                        />
                      </>
                    )}
                  </g>
                );
              })}

              {/* X-axis labels */}
              {applicationData.map((d, i) => (
                <text
                  key={i}
                  x={60 + i * 50}
                  y="245"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#94A3B8"
                  fontWeight="500"
                >
                  {d.month}
                </text>
              ))}
            </ChartSvg>
          </ChartCard>

          <ChartCard>
            <ChartHeader>
              <div className="title-group">
                <h3>{language === 'vi' ? 'Phân bố ứng viên' : 'Candidate Distribution'}</h3>
                <p>{language === 'vi' ? 'Theo ngành nghề và vị trí' : 'By industry and position'}</p>
              </div>
              <PieChart size={18} />
            </ChartHeader>
            <ChartLegend>
              {candidateDistribution.map((item, i) => (
                <LegendItem key={i} $color={item.color}>
                  {item.label} ({item.value}%)
                </LegendItem>
              ))}
            </ChartLegend>
            <ChartSvg viewBox="0 0 300 220">
              {(() => {
                let currentAngle = -90;
                const centerX = 150;
                const centerY = 110;
                const radius = 80;
                const innerRadius = 50;

                return candidateDistribution.map((item, i) => {
                  const angle = (item.value / 100) * 360;
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + angle;
                  const isHovered = hoveredSegment === i;

                  // Calculate outer radius with hover effect
                  const outerRadius = isHovered ? radius + 8 : radius;

                  const x1 = centerX + outerRadius * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = centerY + outerRadius * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = centerX + outerRadius * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = centerY + outerRadius * Math.sin((Math.PI * endAngle) / 180);

                  const x3 = centerX + innerRadius * Math.cos((Math.PI * endAngle) / 180);
                  const y3 = centerY + innerRadius * Math.sin((Math.PI * endAngle) / 180);
                  const x4 = centerX + innerRadius * Math.cos((Math.PI * startAngle) / 180);
                  const y4 = centerY + innerRadius * Math.sin((Math.PI * startAngle) / 180);

                  const largeArcFlag = angle > 180 ? 1 : 0;

                  const pathData = [
                    `M ${x1} ${y1}`,
                    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    `L ${x3} ${y3}`,
                    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                    'Z'
                  ].join(' ');

                  currentAngle = endAngle;

                  // Calculate percentage label position
                  const midAngle = startAngle + angle / 2;
                  const labelRadius = (outerRadius + innerRadius) / 2;
                  const labelX = centerX + labelRadius * Math.cos((Math.PI * midAngle) / 180);
                  const labelY = centerY + labelRadius * Math.sin((Math.PI * midAngle) / 180);

                  return (
                    <g key={i}>
                      {/* Shadow when hovered */}
                      {isHovered && (
                        <path
                          d={pathData}
                          fill={item.color}
                          opacity="0.2"
                          filter="url(#glow)"
                        />
                      )}

                      {/* Main segment */}
                      <path
                        d={pathData}
                        fill={item.color}
                        stroke="#ffffff"
                        strokeWidth="2"
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          opacity: hoveredSegment !== null && !isHovered ? 0.5 : 1
                        }}
                        onMouseEnter={() => setHoveredSegment(i)}
                        onMouseLeave={() => setHoveredSegment(null)}
                      />

                      {/* Percentage text */}
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={isHovered ? "15" : "13"}
                        fontWeight="800"
                        fill="white"
                        style={{
                          pointerEvents: 'none',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {item.value}%
                      </text>
                    </g>
                  );
                });
              })()}

              {/* Center circle */}
              <circle cx="150" cy="110" r="45" fill="#ffffff" />
              <text
                x="150"
                y="102"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                fontWeight="600"
                fill="#94A3B8"
              >
                {language === 'vi' ? 'Tổng' : 'Total'}
              </text>
              <text
                x="150"
                y="120"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="24"
                fontWeight="800"
                fill="#1e40af"
              >
                {candidateDistribution.reduce((sum, item) => sum + item.value, 0)}%
              </text>
            </ChartSvg>
          </ChartCard>
        </ChartsGrid>

        {/* ── Top jobs ── */}
        <TableContainer
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
        >
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
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: i === 0 ? '#FEF3C7' : i === 1 ? '#DBEAFE' : '#F3F4F6',
                        color: i === 0 ? '#F59E0B' : i === 1 ? '#3B82F6' : '#6B7280',
                        fontSize: '12px',
                        fontWeight: '800'
                      }}>
                        {i + 1}
                      </span>
                      <span style={{ fontWeight: '600' }}>{job.title}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: '#EFF6FF',
                      color: '#1e40af',
                      fontWeight: '700',
                      fontSize: '13px'
                    }}>
                      {job.applications}
                    </span>
                  </td>
                  <td style={{ color: '#64748B' }}>{job.views.toLocaleString()}</td>
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
