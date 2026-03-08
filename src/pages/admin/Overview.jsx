import { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { 
  DollarSign,
  TrendingUp,
  Target,
  Users,
  Calendar
} from 'lucide-react';

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
  const [timeRange] = useState('Last 30 days');

  // Revenue trend data
  const revenueData = [
    { month: 'Jan', revenue: 150, target: 120 },
    { month: 'Feb', revenue: 180, target: 140 },
    { month: 'Mar', revenue: 160, target: 150 },
    { month: 'Apr', revenue: 190, target: 160 },
    { month: 'May', revenue: 220, target: 180 },
    { month: 'Jun', revenue: 240, target: 190 },
    { month: 'Jul', revenue: 260, target: 200 },
    { month: 'Aug', revenue: 280, target: 210 },
    { month: 'Sep', revenue: 300, target: 220 },
    { month: 'Oct', revenue: 320, target: 230 },
    { month: 'Nov', revenue: 350, target: 240 },
    { month: 'Dec', revenue: 380, target: 250 },
  ];

  const maxValue = 400;

  // Generate smooth curve path
  const generatePath = (data, key) => {
    const points = data.map((d, i) => ({
      x: 60 + (i * 60),
      y: 240 - (d[key] / maxValue) * 180
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
              <StatLabel>{language === 'vi' ? 'Tổng Doanh Thu' : 'Total Revenue'}</StatLabel>
              <StatIcon $bg="#1e3a8a" $color="#3b82f6">
                <DollarSign />
              </StatIcon>
            </StatHeader>
            <StatValue>245M</StatValue>
            <StatChange $positive={true}>
              <TrendingUp />
              +12.5%
            </StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatLabel>{language === 'vi' ? 'Tỷ Lệ Chuyển Đổi' : 'Conversion Rate'}</StatLabel>
              <StatIcon $bg="#1e3a5a" $color="#06b6d4">
                <Target />
              </StatIcon>
            </StatHeader>
            <StatValue>24.8%</StatValue>
            <StatChange $positive={true}>
              <TrendingUp />
              +3.2%
            </StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatLabel>{language === 'vi' ? 'Giao Dịch Đang Hoạt Động' : 'Active Deals'}</StatLabel>
              <StatIcon $bg="#1e1e3a" $color="#8b5cf6">
                <Target />
              </StatIcon>
            </StatHeader>
            <StatValue>147</StatValue>
            <StatChange $positive={false}>
              <TrendingUp style={{ transform: 'rotate(180deg)' }} />
              -5
            </StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatLabel>{language === 'vi' ? 'Khách Hàng Mới' : 'New Leads'}</StatLabel>
              <StatIcon $bg="#1e2a1e" $color="#10b981">
                <Users />
              </StatIcon>
            </StatHeader>
            <StatValue>892</StatValue>
            <StatChange $positive={true}>
              <TrendingUp />
              +18.3%
            </StatChange>
          </StatCard>
        </StatsGrid>

        <ChartsContainer>
          <ChartCard>
            <ChartHeader>
              <ChartTitle>{language === 'vi' ? 'Xu Hướng Doanh Thu' : 'Revenue Trend'}</ChartTitle>
              <ChartSubtitle>{language === 'vi' ? 'Hiệu suất hàng tháng so với mục tiêu' : 'Monthly performance vs target'}</ChartSubtitle>
            </ChartHeader>

            <ChartLegend>
              <LegendItem $color="#06b6d4">{language === 'vi' ? 'Doanh thu' : 'Revenue'}</LegendItem>
              <LegendItem $color="#10b981">{language === 'vi' ? 'Mục tiêu' : 'Target'}</LegendItem>
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
              {['$600k', '$450k', '$300k', '$150k', '$0k'].map((label, i) => (
                <text
                  key={i}
                  x="30"
                  y={65 + i * 45}
                  textAnchor="end"
                  fontSize="11"
                  fill="#6b7280"
                >
                  {label}
                </text>
              ))}

              {/* Revenue area */}
              <path
                d={`${revenuePath} L 720 240 L 60 240 Z`}
                fill="url(#revenueGradient)"
              />

              {/* Target area */}
              <path
                d={`${targetPath} L 720 240 L 60 240 Z`}
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
              <ChartTitle>{language === 'vi' ? 'Giai Đoạn Pipeline' : 'Pipeline Stages'}</ChartTitle>
              <ChartSubtitle>{language === 'vi' ? 'Phân bổ theo giai đoạn' : 'Distribution by stage'}</ChartSubtitle>
            </ChartHeader>

            <div style={{ marginTop: '32px' }}>
              <PipelineStage>
                <StageHeader>
                  <StageName>Lead</StageName>
                  <StageValue>892 <span>45%</span></StageValue>
                </StageHeader>
                <ProgressBar>
                  <ProgressFill $width={45} $color="#3b82f6" />
                </ProgressBar>
              </PipelineStage>

              <PipelineStage>
                <StageHeader>
                  <StageName>Qualified</StageName>
                  <StageValue>556 <span>28%</span></StageValue>
                </StageHeader>
                <ProgressBar>
                  <ProgressFill $width={28} $color="#10b981" />
                </ProgressBar>
              </PipelineStage>

              <PipelineStage>
                <StageHeader>
                  <StageName>Proposal</StageName>
                  <StageValue>357 <span>18%</span></StageValue>
                </StageHeader>
                <ProgressBar>
                  <ProgressFill $width={18} $color="#f59e0b" />
                </ProgressBar>
              </PipelineStage>

              <PipelineStage>
                <StageHeader>
                  <StageName>Negotiation</StageName>
                  <StageValue>179 <span>9%</span></StageValue>
                </StageHeader>
                <ProgressBar>
                  <ProgressFill $width={9} $color="#8b5cf6" />
                </ProgressBar>
              </PipelineStage>

              <TotalValue>
                <TotalLabel>{language === 'vi' ? 'Tổng Giá Trị Pipeline' : 'Total Pipeline Value'}</TotalLabel>
                <TotalAmount>$4.8M</TotalAmount>
              </TotalValue>
            </div>
          </ChartCard>
        </ChartsContainer>
      </PageContainer>
    </DashboardLayout>
  );
};

export default Overview;
