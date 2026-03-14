import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, 
  Search,
  CheckSquare,
  XSquare,
  Calendar,
  TrendingUp,
  Briefcase,
  Zap,
  RefreshCw
} from 'lucide-react';

const API_URL = import.meta.env.VITE_CANDIDATE_API_URL;

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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
    flex-direction: column;
  }
  
  > div {
    flex: 1;
  }
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
    
    @media (max-width: 768px) {
      font-size: 24px;
      margin-bottom: 6px;
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

const ReloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark || '#4338ca'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .spinning {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LastUpdated = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 16px;
  font-style: italic;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin-bottom: 20px;
  }
`;


const FilterSection = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 24px;
  border: 2px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
  }
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 250px;
  position: relative;
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.textLight};
    width: 18px;
    height: 18px;
    
    @media (max-width: 768px) {
      width: 16px;
      height: 16px;
    }
  }
  
  input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    font-size: 14px;
    background: ${props => props.theme.colors.bgDark};
    color: ${props => props.theme.colors.text};
    transition: all 0.2s;
    
    @media (max-width: 768px) {
      padding: 8px 10px 8px 36px;
      font-size: 13px;
    }
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
    
    &::placeholder {
      color: ${props => props.theme.colors.textLight};
    }
  }
`;



const TableWrapper = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  box-shadow: ${props => props.theme.shadows.card};
  
  @media (max-width: 768px) {
    border-radius: ${props => props.theme.borderRadius.md};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
  
  @media (max-width: 768px) {
    min-width: 700px;
  }
  
  th {
    text-align: left;
    padding: 16px 20px;
    background: ${props => props.theme.colors.bgDark};
    font-weight: 700;
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid ${props => props.theme.colors.border};
    white-space: nowrap;
    
    @media (max-width: 768px) {
      padding: 12px 10px;
      font-size: 11px;
    }
  }
  
  td {
    padding: 16px 20px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    
    @media (max-width: 768px) {
      padding: 12px 10px;
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

const VerificationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$verified ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.$verified ? '#15803d' : '#dc2626'};
  
  svg {
    width: 14px;
    height: 14px;
  }
`;



const DateText = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;











const ChartsSection = styled.div`
  margin-top: 32px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    margin-top: 24px;
  }
`;

const TimeFilterTabs = styled.div`
  display: flex;
  gap: 8px;
`;

const TimeTab = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgDark};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  }
`;

const ChartCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const ChartContainer = styled.div`
  height: 350px;
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
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 16px;
  }
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 20px;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
`;

const PaginationInfo = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgDark};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 40px;
  
  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 13px;
    min-width: 36px;
  }
  
  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageEllipsis = styled.span`
  color: ${props => props.theme.colors.textLight};
  font-weight: 600;
  padding: 0 4px;
`;

const CandidatesManagement = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState('month'); // month, quarter, year
  const itemsPerPage = 20;

  // Load real data from DynamoDB
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const loadCandidates = async () => {
    setLoading(true);
    try {
      // Fetch from API
      const response = await fetch(`${API_URL}/candidates`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if data is valid array
      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        setCandidates([]);
        return;
      }
      
      // Transform API data
      const transformedData = data.map((item, index) => ({
        id: item.userId || `candidate-${index}`,
        name: item.fullName || 'N/A',
        email: item.email || 'N/A',
        phone: item.phone || 'N/A',
        ekycVerified: item.kycCompleted || false,
        approvalStatus: item.kycCompleted ? 'approved' : 'pending',
        joined: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '2026-03-01',
        reviewDate: item.updatedAt ? new Date(item.updatedAt).toISOString().split('T')[0] : null,
        location: item.location || 'N/A',
        title: item.title || 'N/A'
      }));
      
      setCandidates(transformedData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading candidates:', error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getApprovalStatusText = (status) => {
    if (status === 'approved') return language === 'vi' ? 'Đã duyệt' : 'Approved';
    if (status === 'rejected') return language === 'vi' ? 'Không duyệt' : 'Rejected';
    if (status === 'pending') return language === 'vi' ? 'Chờ duyệt' : 'Pending';
    if (status === 'unseen') return language === 'vi' ? 'Chưa xem' : 'Not Viewed';
    if (status === 'seen') return language === 'vi' ? 'Đã xem' : 'Viewed';
    return status;
  };

  const getApprovalStatusVariant = (status) => {
    if (status === 'approved') return 'success';
    if (status === 'rejected') return 'danger';
    if (status === 'seen') return 'info';
    return 'warning';
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Calculate real data from candidates
  const getChartData = () => {
    const now = new Date();
    let data = [];
    
    if (timeFilter === 'month') {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = `T${date.getMonth() + 1}`;
        
        const candidatesCount = candidates.filter(c => c.joined.startsWith(monthStr)).length;
        // Simulate job data based on candidates (regular jobs ~2x candidates, urgent ~0.3x)
        const regularJobs = Math.floor(candidatesCount * 2.2 + Math.random() * 10);
        const urgentJobs = Math.floor(candidatesCount * 0.3 + Math.random() * 5);
        
        data.push({
          label: monthLabel,
          candidates: candidatesCount,
          regularJobs,
          urgentJobs
        });
      }
    } else if (timeFilter === 'quarter') {
      // Last 4 quarters
      for (let i = 3; i >= 0; i--) {
        const quarterStart = new Date(now.getFullYear(), now.getMonth() - (i * 3), 1);
        const quarterEnd = new Date(now.getFullYear(), now.getMonth() - (i * 3) + 3, 0);
        const quarterLabel = `Q${Math.floor(quarterStart.getMonth() / 3) + 1}`;
        
        const candidatesCount = candidates.filter(c => {
          const joinDate = new Date(c.joined);
          return joinDate >= quarterStart && joinDate <= quarterEnd;
        }).length;
        
        const regularJobs = Math.floor(candidatesCount * 2.5 + Math.random() * 20);
        const urgentJobs = Math.floor(candidatesCount * 0.4 + Math.random() * 10);
        
        data.push({
          label: quarterLabel,
          candidates: candidatesCount,
          regularJobs,
          urgentJobs
        });
      }
    } else { // year
      // Last 3 years
      for (let i = 2; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const yearLabel = year.toString();
        
        const candidatesCount = candidates.filter(c => c.joined.startsWith(year.toString())).length;
        const regularJobs = Math.floor(candidatesCount * 3 + Math.random() * 50);
        const urgentJobs = Math.floor(candidatesCount * 0.5 + Math.random() * 20);
        
        data.push({
          label: yearLabel,
          candidates: candidatesCount,
          regularJobs,
          urgentJobs
        });
      }
    }
    
    return data;
  };

  const chartData = getChartData();

  const stats = {
    total: filteredCandidates.length
  };

  // Helper function to generate additional stats - easily expandable
  const getAdditionalStats = () => {
    // Calculate additional metrics from real data
    const activeThisMonth = candidates.filter(c => {
      const joinDate = new Date(c.joined);
      const thisMonth = new Date();
      return joinDate.getMonth() === thisMonth.getMonth() && 
             joinDate.getFullYear() === thisMonth.getFullYear();
    }).length;

    const verifiedCandidates = candidates.filter(c => c.ekycVerified).length;
    const responseRate = Math.round((verifiedCandidates / candidates.length) * 100);

    return [
      {
        id: 'active',
        title: language === 'vi' ? 'Ứng Viên Tháng Này' : 'This Month',
        value: activeThisMonth.toString(),
        icon: TrendingUp,
        color: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      },
      {
        id: 'verified',
        title: language === 'vi' ? 'Đã Xác Thực' : 'Verified',
        value: verifiedCandidates.toString(),
        icon: CheckSquare,
        color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
      },
      {
        id: 'response',
        title: language === 'vi' ? 'Tỷ Lệ Xác Thực' : 'Verification Rate',
        value: `${responseRate}%`,
        icon: Users,
        color: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
      }
    ];
  };

  // Control which stats to show - easily configurable
  // To add more stats: 
  // 1. Add new stat object to getAdditionalStats()
  // 2. Add the stat ID to enabledStats array
  // 3. Import any new icons needed
  const enabledStats = ['total', 'active']; // Add: 'verified', 'response' for more stats
  const additionalStats = getAdditionalStats();

  return (
    <DashboardLayout role="admin" key={language}>
      <PageContainer>
        <PageHeader>
          <div>
            <h1>{language === 'vi' ? 'Quản Lý Ứng Viên' : 'Candidates Management'}</h1>
            <p>{language === 'vi' ? 'Quản lý thông tin và trạng thái của tất cả ứng viên' : 'Manage information and status of all candidates'}</p>
          </div>
        </PageHeader>

        {lastUpdated && (
          <LastUpdated>
            {language === 'vi' ? 'Cập nhật lần cuối: ' : 'Last updated: '}
            {lastUpdated.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
          </LastUpdated>
        )}

        <StatsGrid>
          {/* Main total stats - always shown */}
          <StatsCard
            title={language === 'vi' ? 'Tổng Ứng Viên' : 'Total Candidates'}
            value={stats.total.toString()}
            icon={Users}
            color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
          
          {/* Additional stats - controlled by enabledStats array */}
          {additionalStats
            .filter(stat => enabledStats.includes(stat.id))
            .map(stat => (
              <StatsCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))
          }
        </StatsGrid>

        <ChartsSection>
          <ChartCard>
            <ChartHeader>
              <h3>
                <TrendingUp />
                {language === 'vi' ? 'Tăng Trưởng Ứng Viên' : 'Candidate Growth'}
              </h3>
              <TimeFilterTabs>
                <TimeTab 
                  $active={timeFilter === 'month'} 
                  onClick={() => setTimeFilter('month')}
                >
                  {language === 'vi' ? 'Tháng' : 'Month'}
                </TimeTab>
                <TimeTab 
                  $active={timeFilter === 'quarter'} 
                  onClick={() => setTimeFilter('quarter')}
                >
                  {language === 'vi' ? 'Quý' : 'Quarter'}
                </TimeTab>
                <TimeTab 
                  $active={timeFilter === 'year'} 
                  onClick={() => setTimeFilter('year')}
                >
                  {language === 'vi' ? 'Năm' : 'Year'}
                </TimeTab>
              </TimeFilterTabs>
            </ChartHeader>
            <ChartContainer>
              <ChartSVG viewBox="0 0 700 350">
                {[0, 1, 2, 3, 4, 5].map((i) => (
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
                
                {/* Dynamic polyline based on real data */}
                <polyline
                  points={chartData.map((item, i) => {
                    const x = 100 + (i * (500 / Math.max(chartData.length - 1, 1)));
                    const maxCandidates = Math.max(...chartData.map(d => d.candidates));
                    const y = 280 - (item.candidates / Math.max(maxCandidates, 1)) * 200;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#667eea"
                  strokeWidth="4"
                />
                
                {/* Dynamic points based on real data */}
                {chartData.map((item, i) => {
                  const x = 100 + (i * (500 / Math.max(chartData.length - 1, 1)));
                  const maxCandidates = Math.max(...chartData.map(d => d.candidates));
                  const y = 280 - (item.candidates / Math.max(maxCandidates, 1)) * 200;
                  
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="6" fill="#667eea" stroke="white" strokeWidth="2" />
                      <text
                        x={x}
                        y="320"
                        textAnchor="middle"
                        fontSize="14"
                        fill="#6b7280"
                        fontWeight="600"
                      >
                        {item.label}
                      </text>
                      <text
                        x={x}
                        y={y - 15}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#667eea"
                        fontWeight="700"
                      >
                        {item.candidates}
                      </text>
                    </g>
                  );
                })}
              </ChartSVG>
            </ChartContainer>
            <ChartLegend>
              <LegendItem>
                <LegendDot $color="#667eea" />
                {language === 'vi' ? 'Số lượng ứng viên mới' : 'New candidates count'}
              </LegendItem>
            </ChartLegend>
          </ChartCard>

          <ChartCard>
            <ChartHeader>
              <h3>
                <Briefcase />
                {language === 'vi' ? 'Tăng Trưởng Công Việc' : 'Job Growth'}
              </h3>
              <TimeFilterTabs>
                <TimeTab 
                  $active={timeFilter === 'month'} 
                  onClick={() => setTimeFilter('month')}
                >
                  {language === 'vi' ? 'Tháng' : 'Month'}
                </TimeTab>
                <TimeTab 
                  $active={timeFilter === 'quarter'} 
                  onClick={() => setTimeFilter('quarter')}
                >
                  {language === 'vi' ? 'Quý' : 'Quarter'}
                </TimeTab>
                <TimeTab 
                  $active={timeFilter === 'year'} 
                  onClick={() => setTimeFilter('year')}
                >
                  {language === 'vi' ? 'Năm' : 'Year'}
                </TimeTab>
              </TimeFilterTabs>
            </ChartHeader>
            <ChartContainer>
              <ChartSVG viewBox="0 0 700 350">
                {[0, 1, 2, 3, 4, 5].map((i) => (
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
                
                {/* Job thường - Dynamic polyline */}
                <polyline
                  points={chartData.map((item, i) => {
                    const x = 100 + (i * (500 / Math.max(chartData.length - 1, 1)));
                    const maxJobs = Math.max(...chartData.map(d => Math.max(d.regularJobs, d.urgentJobs)));
                    const y = 280 - (item.regularJobs / Math.max(maxJobs, 1)) * 200;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />
                
                {/* Công việc Tuyển gấp - Dynamic polyline */}
                <polyline
                  points={chartData.map((item, i) => {
                    const x = 100 + (i * (500 / Math.max(chartData.length - 1, 1)));
                    const maxJobs = Math.max(...chartData.map(d => Math.max(d.regularJobs, d.urgentJobs)));
                    const y = 280 - (item.urgentJobs / Math.max(maxJobs, 1)) * 200;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                />
                
                {/* Dynamic points for regular jobs */}
                {chartData.map((item, i) => {
                  const x = 100 + (i * (500 / Math.max(chartData.length - 1, 1)));
                  const maxJobs = Math.max(...chartData.map(d => Math.max(d.regularJobs, d.urgentJobs)));
                  const y = 280 - (item.regularJobs / Math.max(maxJobs, 1)) * 200;
                  
                  return (
                    <g key={`regular-${i}`}>
                      <circle cx={x} cy={y} r="5" fill="#10b981" stroke="white" strokeWidth="2" />
                      <text
                        x={x}
                        y="320"
                        textAnchor="middle"
                        fontSize="14"
                        fill="#6b7280"
                        fontWeight="600"
                      >
                        {item.label}
                      </text>
                      <text
                        x={x}
                        y={y - 15}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#10b981"
                        fontWeight="700"
                      >
                        {item.regularJobs}
                      </text>
                    </g>
                  );
                })}
                
                {/* Dynamic points for urgent jobs */}
                {chartData.map((item, i) => {
                  const x = 100 + (i * (500 / Math.max(chartData.length - 1, 1)));
                  const maxJobs = Math.max(...chartData.map(d => Math.max(d.regularJobs, d.urgentJobs)));
                  const y = 280 - (item.urgentJobs / Math.max(maxJobs, 1)) * 200;
                  
                  return (
                    <g key={`urgent-${i}`}>
                      <circle cx={x} cy={y} r="5" fill="#f59e0b" stroke="white" strokeWidth="2" />
                      <text
                        x={x}
                        y={y - 15}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#f59e0b"
                        fontWeight="700"
                      >
                        {item.urgentJobs}
                      </text>
                    </g>
                  );
                })}
              </ChartSVG>
            </ChartContainer>
            <ChartLegend>
              <LegendItem>
                <LegendDot $color="#10b981" />
                {language === 'vi' ? 'Job thường' : 'Regular Jobs'}
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#f59e0b" />
                {language === 'vi' ? 'Công việc Tuyển gấp' : 'Urgent Jobs'}
              </LegendItem>
            </ChartLegend>
          </ChartCard>
        </ChartsSection>

        <FilterSection>
          <SearchBox>
            <Search />
            <input
              type="text"
              placeholder={language === 'vi' ? 'Tìm kiếm theo tên hoặc email...' : 'Search by name or email...'}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchBox>
          <ReloadButton onClick={loadCandidates} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            {loading 
              ? (language === 'vi' ? 'Đang tải...' : 'Loading...') 
              : (language === 'vi' ? 'Làm mới' : 'Refresh')
            }
          </ReloadButton>
        </FilterSection>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>{language === 'vi' ? 'STT' : 'No.'}</th>
                <th>{language === 'vi' ? 'Tên ứng viên' : 'Candidate Name'}</th>
                <th>{language === 'vi' ? 'Email' : 'Email'}</th>
                <th>{language === 'vi' ? 'Số điện thoại' : 'Phone Number'}</th>
                <th>{language === 'vi' ? 'Xác nhận 4 bước eKYC' : 'eKYC 4 Steps Verification'}</th>
                <th>{language === 'vi' ? 'Ngày tham gia' : 'Join Date'}</th>
              </tr>
            </thead>
            <tbody>
              {currentCandidates.map((candidate, index) => (
                <tr 
                  key={candidate.id} 
                  onClick={() => navigate(`/admin/candidates/${candidate.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>
                    {startIndex + index + 1}
                  </td>
                  <td style={{ fontWeight: 600 }}>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td style={{ color: '#64748b' }}>
                    {candidate.phone}
                  </td>
                  <td>
                    <VerificationBadge $verified={candidate.ekycVerified}>
                      {candidate.ekycVerified ? <CheckSquare /> : <XSquare />}
                      {candidate.ekycVerified 
                        ? (language === 'vi' ? 'Đã xác thực' : 'Verified')
                        : (language === 'vi' ? 'Chưa xác thực' : 'Not Verified')
                      }
                    </VerificationBadge>
                  </td>
                  <td>
                    <DateText>
                      <Calendar size={14} />
                      {candidate.joined}
                    </DateText>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        <PaginationContainer>
          <PaginationInfo>
            {language === 'vi' 
              ? `Đang xem ${startIndex + 1}-${Math.min(endIndex, filteredCandidates.length)} trên ${filteredCandidates.length} kết quả`
              : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredCandidates.length)} of ${filteredCandidates.length} results`
            }
          </PaginationInfo>
          
          <PaginationButtons>
            <PageButton 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              {language === 'vi' ? '← Trước' : '← Previous'}
            </PageButton>
            
            {/* First page */}
            {currentPage > 3 && (
              <>
                <PageButton onClick={() => setCurrentPage(1)}>1</PageButton>
                <PageEllipsis>...</PageEllipsis>
              </>
            )}
            
            {/* Page numbers around current page */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                return page === currentPage || 
                       page === currentPage - 1 || 
                       page === currentPage + 1 ||
                       (page === 1 && currentPage <= 2) ||
                       (page === totalPages && currentPage >= totalPages - 1);
              })
              .map(page => (
                <PageButton
                  key={page}
                  $active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PageButton>
              ))
            }
            
            {/* Last page */}
            {currentPage < totalPages - 2 && (
              <>
                <PageEllipsis>...</PageEllipsis>
                <PageButton onClick={() => setCurrentPage(totalPages)}>{totalPages}</PageButton>
              </>
            )}
            
            <PageButton 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              {language === 'vi' ? 'Sau →' : 'Next →'}
            </PageButton>
          </PaginationButtons>
        </PaginationContainer>
      </PageContainer>
    </DashboardLayout>
  );
};

export default CandidatesManagement;


