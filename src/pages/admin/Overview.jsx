import { useState, useEffect } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { 
  DollarSign,
  TrendingUp,
  Briefcase,
  Building2,
  Users,
  Calendar
} from 'lucide-react';
import adminReportService from '../../services/adminReportService';

const PageContainer = styled.div`
  background: #0a0a0a;
  min-height: 100vh;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
`;

const DateSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  color: #9ca3af;
  font-size: 14px;
  cursor: pointer;
  
  svg {
    width: 16px;
    height: 16px;
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
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3a3a3a;
    transform: translateY(-2px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #9ca3af;
  font-weight: 500;
`;

const StatIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${props => props.$bg || '#1e3a8a'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color || '#3b82f6'};
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 24px;
`;

const ChartHeader = styled.div`
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
`;

const ChartSubtitle = styled.p`
  font-size: 13px;
  color: #6b7280;
`;

const ChartLegend = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #9ca3af;
  
  &::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.$color};
  }
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 280px;
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
  font-weight: 500;
  color: #ffffff;
`;

const StageValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #9ca3af;
  
  span {
    color: #6b7280;
    font-weight: 400;
    margin-left: 4px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #2a2a2a;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.$width}%;
  background: ${props => props.$color};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const TotalValue = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #2a2a2a;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.div`
  font-size: 14px;
  color: #9ca3af;
`;

const TotalAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
`;

const Overview = () => {
  const { language } = useLanguage();
  const [timeRange] = useState(language === 'vi' ? '30 ngày qua' : 'Last 30 days');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalEmployers: 0,
    totalStandardJobs: 0,
    totalQuickJobs: 0,
    totalRevenue: 0,
    trends: {}
  });
  const [revenueData, setRevenueData] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await adminReportService.getReportsData();
        
        const calculatedStats = adminReportService.calculateStats(data);
        setStats(calculatedStats);
        
        const monthlyRevenue = adminReportService.getRevenueByMonth(data.subscriptions);
        setRevenueData(monthlyRevenue);
        
        const pipeline = adminReportService.calculatePipelineStats(data.applications);
        setPipelineData(pipeline);
      } catch (error) {
        console.error('Error fetching overview data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate dynamic max value for chart
  const revenueValues = revenueData.map(d => d.revenue);
  const targetValues = revenueData.map(d => d.target);
  const maxRevenueValue = Math.max(...revenueValues, ...targetValues, 10);
  const chartHeightScale = 180 / maxRevenueValue;

  // Generate smooth curve path
  const generatePath = (data, key) => {
    if (!data || data.length === 0) return '';
    
    const points = data.map((d, i) => ({
      x: 60 + (i * 60),
      y: 240 - (d[key] * chartHeightScale)
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

  const revenuePath = generatePath(revenueData, 'revenue');
  const targetPath = generatePath(revenueData, 'target');

  const formatLargeNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <DashboardLayout role="admin">
      <PageContainer>
        <Header>
          <Title>{language === 'vi' ? 'Tổng Quan' : 'Overview'}</Title>
          <DateSelector>
            <Calendar size={16} />
            {timeRange}
          </DateSelector>
        </Header>

        <StatsGrid>
          <StatCard>
            <StatHeader>
              <StatLabel>{language === 'vi' ? 'Tổng ứng viên' : 'Total Candidates'}</StatLabel>
              <StatIcon $bg="#1e3a8a" $color="#667eea">
                <Users />
              </StatIcon>
            </StatHeader>
            <StatValue>{loading ? '...' : stats.totalCandidates}</StatValue>
            <StatChange $positive={!stats.trends.candidates?.startsWith('-')}>
              <TrendingUp />
              {stats.trends.candidates || '0%'}
            </StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatLabel>{language === 'vi' ? 'Tổng nhà tuyển dụng' : 'Total Employers'}</StatLabel>
              <StatIcon $bg="#064e3b" $color="#10b981">
                <Building2 />
              </StatIcon>
            </StatHeader>
            <StatValue>{loading ? '...' : stats.totalEmployers}</StatValue>
            <StatChange $positive={!stats.trends.employers?.startsWith('-')}>
              <TrendingUp />
              {stats.trends.employers || '0%'}
            </StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatLabel>{language === 'vi' ? 'Tổng bài đăng' : 'Job Posts'}</StatLabel>
              <StatIcon $bg="#1e1e3a" $color="#3b82f6">
                <Briefcase />
              </StatIcon>
            </StatHeader>
            <StatValue>{loading ? '...' : (stats.totalStandardJobs + stats.totalQuickJobs)}</StatValue>
            <StatChange $positive={!stats.trends.standardJobs?.startsWith('-')}>
              <TrendingUp />
              {stats.trends.standardJobs || '0%'}
            </StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatLabel>{language === 'vi' ? 'Tổng doanh thu' : 'Total Revenue'}</StatLabel>
              <StatIcon $bg="#422006" $color="#f59e0b">
                <DollarSign />
              </StatIcon>
            </StatHeader>
            <StatValue>{loading ? '...' : formatLargeNumber(stats.totalRevenue)}</StatValue>
            <StatChange $positive={!stats.trends.revenue?.startsWith('-')}>
              <TrendingUp />
              {stats.trends.revenue || '0%'}
            </StatChange>
          </StatCard>
        </StatsGrid>

        <ChartsContainer>
          <ChartCard>
            <ChartHeader>
              <ChartTitle>{language === 'vi' ? 'Xu Hướng Doanh Thu' : 'Revenue Trend'}</ChartTitle>
              <ChartSubtitle>{language === 'vi' ? 'Hiệu suất hàng tháng so với mục tiêu ($)' : 'Monthly performance vs target ($)'}</ChartSubtitle>
            </ChartHeader>

            <ChartLegend>
              <LegendItem $color="#06b6d4">{language === 'vi' ? 'Doanh thu (triệu)' : 'Revenue (millions)'}</LegendItem>
              <LegendItem $color="#10b981">{language === 'vi' ? 'Mục tiêu (triệu)' : 'Target (millions)'}</LegendItem>
            </ChartLegend>

            <ChartSvg viewBox="0 0 780 280">
              <defs>
                <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="targetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="40"
                  y1={60 + i * 45}
                  x2="760"
                  y2={60 + i * 45}
                  stroke="#2a2a2a"
                  strokeWidth="1"
                />
              ))}

              {/* Y-axis labels */}
              {[1, 0.75, 0.5, 0.25, 0].map((factor, i) => (
                <text
                  key={i}
                  x="30"
                  y={65 + i * 45}
                  textAnchor="end"
                  fontSize="11"
                  fill="#6b7280"
                >
                  {`$${(maxRevenueValue * factor).toFixed(1)}M`}
                </text>
              ))}

              {!loading && revenuePath && (
                <>
                  {/* Revenue area */}
                  <path
                    d={`${revenuePath} L ${60 + (revenueData.length - 1) * 60} 240 L 60 240 Z`}
                    fill="url(#revenueGradient)"
                  />

                  {/* Target area */}
                  <path
                    d={`${targetPath} L ${60 + (revenueData.length - 1) * 60} 240 L 60 240 Z`}
                    fill="url(#targetGradient)"
                  />

                  {/* Revenue line */}
                  <path
                    d={revenuePath}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Target line */}
                  <path
                    d={targetPath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </>
              )}

              {/* X-axis labels */}
              {revenueData.map((d, i) => (
                <text
                  key={i}
                  x={60 + i * 60}
                  y="265"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#6b7280"
                >
                  {d.month}
                </text>
              ))}
            </ChartSvg>
          </ChartCard>

          <ChartCard>
            <ChartHeader>
              <ChartTitle>{language === 'vi' ? 'Tiến độ hồ sơ (Pipeline)' : 'Pipeline Stages'}</ChartTitle>
              <ChartSubtitle>{language === 'vi' ? 'Phân bổ theo trạng thái ứng tuyển' : 'Distribution by application status'}</ChartSubtitle>
            </ChartHeader>

            <div style={{ marginTop: '32px' }}>
              {pipelineData.length > 0 ? pipelineData.map((stage, idx) => (
                <PipelineStage key={idx}>
                  <StageHeader>
                    <StageName>{stage.name}</StageName>
                    <StageValue>{stage.count} <span>{stage.percentage}%</span></StageValue>
                  </StageHeader>
                  <ProgressBar>
                    <ProgressFill $width={stage.percentage} $color={stage.color} />
                  </ProgressBar>
                </PipelineStage>
              )) : (
                <div style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
                  {language === 'vi' ? 'Chưa có dữ liệu hồ sơ' : 'No application data available'}
                </div>
              )}

              <TotalValue>
                <TotalLabel>{language === 'vi' ? 'Tổng số hồ sơ trong hệ thống' : 'Total applications in system'}</TotalLabel>
                <TotalAmount>{loading ? '...' : (pipelineData.reduce((sum, s) => sum + s.count, 0))}</TotalAmount>
              </TotalValue>
            </div>
          </ChartCard>
        </ChartsContainer>
      </PageContainer>
    </DashboardLayout>
  );
};

export default Overview;
