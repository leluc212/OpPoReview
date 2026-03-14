import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import TableFilter from '../../components/TableFilter';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Package, 
  Zap, 
  Star, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  Users,
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

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatBox = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border-left: 4px solid ${props => props.$color || props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.sm};
  
  h3 {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 8px;
    font-weight: 500;
    text-transform: uppercase;
  }
  
  p {
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BarChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 300px;
  gap: 16px;
  padding: 20px 0;
`;

const BarGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const MonthLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textLight};
  margin-top: 12px;
  font-weight: 600;
`;

const BarsWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: flex-end;
  height: 100%;
  width: 100%;
  justify-content: center;
`;

const Bar = styled.div`
  flex: 1;
  max-width: 20px;
  background: ${props => props.$color};
  border-radius: ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0 0;
  height: ${props => props.$height}%;
  min-height: 10px;
  position: relative;
  transition: all 0.3s;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-5px);
  }
`;

const BarValue = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
`;

const PieChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const PieChartSVG = styled.svg`
  width: 220px;
  height: 220px;
`;

const PieLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.border};
    transform: translateX(4px);
  }
`;

const LegendColor = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: ${props => props.$color};
  margin-right: 10px;
`;

const LegendLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  flex: 1;
  font-weight: 500;
`;

const LegendValue = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button`
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textLight};
  background: ${props => props.$active ? props.theme.colors.bgLight : 'transparent'};
  border: none;
  border-bottom: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.bgLight};
  }
`;

const TableWrapper = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 16px;
    background: ${props => props.theme.colors.bgDark};
    font-weight: 600;
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    border-bottom: 2px solid ${props => props.theme.colors.border};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  td {
    padding: 16px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    font-size: 14px;
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

const PackageBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 13px;
  font-weight: 600;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.$status === 'active') return '#dcfce7';
    if (props.$status === 'expired') return '#fee2e2';
    if (props.$status === 'expiring') return '#fef3c7';
    return '#f3f4f6';
  }};
  color: ${props => {
    if (props.$status === 'active') return '#15803d';
    if (props.$status === 'expired') return '#dc2626';
    if (props.$status === 'expiring') return '#ca8a04';
    return '#6b7280';
  }};
`;

const DateText = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  display: block;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  padding: 8px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  background: #e0e7ff;
  color: #4338ca;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
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

const ApproveButton = styled.button`
  padding: 6px 16px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  background: #10b981;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PackagesManagement = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'
  const itemsPerPage = 20;

  // Dữ liệu gói dịch vụ đã mua - Load từ API
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load subscriptions from API
  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        setLoading(true);
        const API_ENDPOINT = import.meta.env.VITE_PACKAGE_SUBSCRIPTIONS_API;
        const response = await fetch(`${API_ENDPOINT}/subscriptions`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch subscriptions');
        }
        
        const data = await response.json();
        
        // Transform API data to match component format
        const transformedData = data.map(item => ({
          id: item.subscriptionId,
          employer: item.companyName,
          package: item.packageName,
          purchaseDate: item.purchaseDate,
          expiryDate: item.expiryDate,
          status: item.status,
          price: typeof item.price === 'number' ? item.price : parseFloat(item.price),
          duration: item.duration,
          approvalStatus: item.approvalStatus
        }));
        
        setPurchases(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error loading subscriptions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadSubscriptions();
  }, []);

  // Dữ liệu theo tháng cho biểu đồ (6 tháng gần nhất)
  const monthlyData = [
    { month: 'T9/25', quickBoost: 8, hotSearch: 5, spotlight: 3, topSpotlight: 2 },
    { month: 'T10/25', quickBoost: 12, hotSearch: 7, spotlight: 4, topSpotlight: 3 },
    { month: 'T11/25', quickBoost: 15, hotSearch: 9, spotlight: 6, topSpotlight: 4 },
    { month: 'T12/25', quickBoost: 18, hotSearch: 11, spotlight: 7, topSpotlight: 5 },
    { month: 'T1/26', quickBoost: 22, hotSearch: 14, spotlight: 9, topSpotlight: 6 },
    { month: 'T2/26', quickBoost: 25, hotSearch: 16, spotlight: 11, topSpotlight: 8 },
  ];

  const packageColors = {
    'Quick Boost': '#3b82f6',
    'Hot Search': '#f59e0b',
    'Spotlight Banner': '#8b5cf6',
    'Top Spotlight': '#ef4444'
  };

  const packageIcons = {
    'Quick Boost': Zap,
    'Hot Search': TrendingUp,
    'Spotlight Banner': Star,
    'Top Spotlight': Package
  };

  const getStatusText = (status) => {
    if (status === 'active') return language === 'vi' ? 'Đang hoạt động' : 'Active';
    if (status === 'expired') return language === 'vi' ? 'Đã hết hạn' : 'Expired';
    if (status === 'expiring') return language === 'vi' ? 'Sắp hết hạn' : 'Expiring Soon';
    return status;
  };

  const filterOptions = [
    { value: 'Quick Boost', label: 'Quick Boost' },
    { value: 'Hot Search', label: 'Hot Search' },
    { value: 'Spotlight Banner', label: 'Spotlight Banner' },
    { value: 'Top Spotlight', label: 'Top Spotlight' },
    { value: 'active', label: language === 'vi' ? 'Đang hoạt động' : 'Active' },
    { value: 'expiring', label: language === 'vi' ? 'Sắp hết hạn' : 'Expiring' },
    { value: 'expired', label: language === 'vi' ? 'Đã hết hạn' : 'Expired' },
  ];

  const filteredPurchases = useMemo(() => {
    return purchases.filter(purchase => {
      // Filter by approval status based on active tab
      // "Chờ duyệt" = gói chưa có status (pending approval)
      // "Đã duyệt" = gói đã có status (active, expiring, expired)
      const matchesTab = activeTab === 'pending' 
        ? (purchase.approvalStatus === 'pending' || purchase.status === 'pending')
        : (purchase.status === 'active' || purchase.status === 'expiring' || purchase.status === 'expired');
      
      const matchesSearch = searchTerm === '' || 
        purchase.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.package.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = filters.length === 0 || 
        filters.includes(purchase.package) ||
        filters.includes(purchase.status);
      
      return matchesTab && matchesSearch && matchesFilters;
    });
  }, [purchases, searchTerm, filters, activeTab]);

  // Pagination
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPurchases = filteredPurchases.slice(startIndex, endIndex);

  // Reset to page 1 when search or filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handleFilterToggle = (filterValue) => {
    setFilters(prev => 
      prev.includes(filterValue) 
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  const handleApprove = async (purchaseId) => {
    try {
      console.log('Approving purchase:', purchaseId);
      
      const API_ENDPOINT = import.meta.env.VITE_PACKAGE_SUBSCRIPTIONS_API;
      const response = await fetch(`${API_ENDPOINT}/subscriptions/${purchaseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'active',
          approvalStatus: 'approved'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve subscription');
      }
      
      const updatedSubscription = await response.json();
      console.log('Subscription approved:', updatedSubscription);
      
      // Update local state
      setPurchases(prev => prev.map(purchase => 
        purchase.id === purchaseId 
          ? {
              ...purchase,
              status: updatedSubscription.status,
              approvalStatus: updatedSubscription.approvalStatus,
              purchaseDate: updatedSubscription.purchaseDate,
              expiryDate: updatedSubscription.expiryDate
            }
          : purchase
      ));
      
    } catch (error) {
      console.error('Error approving subscription:', error);
      alert('Có lỗi xảy ra khi duyệt gói. Vui lòng thử lại.');
    }
  };

  const stats = {
    total: purchases.length,
    active: purchases.filter(p => p.status === 'active').length,
    expiring: purchases.filter(p => p.status === 'expiring').length,
    totalRevenue: purchases.reduce((sum, p) => sum + p.price, 0),
  };

  // Dữ liệu cho biểu đồ tròn
  const packageCounts = {
    'Quick Boost': purchases.filter(p => p.package === 'Quick Boost').length,
    'Hot Search': purchases.filter(p => p.package === 'Hot Search').length,
    'Spotlight Banner': purchases.filter(p => p.package === 'Spotlight Banner').length,
    'Top Spotlight': purchases.filter(p => p.package === 'Top Spotlight').length,
  };

  const pieData = Object.entries(packageCounts).map(([label, value]) => ({
    label,
    value,
    color: packageColors[label]
  }));

  const total = pieData.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const pieSlices = pieData.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const x1 = 110 + 90 * Math.cos((Math.PI * startAngle) / 180);
    const y1 = 110 + 90 * Math.sin((Math.PI * startAngle) / 180);
    const x2 = 110 + 90 * Math.cos((Math.PI * (startAngle + angle)) / 180);
    const y2 = 110 + 90 * Math.sin((Math.PI * (startAngle + angle)) / 180);
    const largeArc = angle > 180 ? 1 : 0;

    return {
      ...item,
      path: `M 110 110 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`,
      percentage: percentage.toFixed(1)
    };
  });

  // Tính max value cho biểu đồ cột
  const maxValue = Math.max(
    ...monthlyData.flatMap(d => [d.quickBoost, d.hotSearch, d.spotlight, d.topSpotlight])
  );

  return (
    <DashboardLayout role="admin">
      <PageContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Quản Lý Gói Dịch Vụ' : 'Package Management'}</h1>
          <p>{language === 'vi' ? 'Quản lý gói dịch vụ của nhà tuyển dụng F&B' : 'Manage F&B employer service packages'}</p>
        </PageHeader>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>
              {language === 'vi' ? 'Đang tải dữ liệu...' : 'Loading data...'}
            </div>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              {language === 'vi' ? 'Lỗi tải dữ liệu' : 'Error loading data'}
            </div>
            <div style={{ fontSize: '14px' }}>{error}</div>
          </div>
        )}

        {!loading && !error && (
          <>
        <StatsRow>
          <StatBox $color="#1e40af">
            <h3>{language === 'vi' ? 'Tổng gói đã bán' : 'Total Purchases'}</h3>
            <p>{stats.total}</p>
          </StatBox>
          <StatBox $color="#10b981">
            <h3>{language === 'vi' ? 'Đang hoạt động' : 'Active'}</h3>
            <p>{stats.active}</p>
          </StatBox>
          <StatBox $color="#f59e0b">
            <h3>{language === 'vi' ? 'Sắp hết hạn' : 'Expiring Soon'}</h3>
            <p>{stats.expiring}</p>
          </StatBox>
          <StatBox $color="#8b5cf6">
            <h3>{language === 'vi' ? 'Tổng doanh thu' : 'Total Revenue'}</h3>
            <p>{stats.totalRevenue.toLocaleString('vi-VN')} VND</p>
          </StatBox>
        </StatsRow>

        <ChartsContainer>
          <ChartCard>
            <ChartTitle>
              <BarChart3 size={20} />
              {language === 'vi' ? 'Số Lượng Gói Mua Theo Tháng' : 'Monthly Package Purchases'}
            </ChartTitle>
            <BarChartContainer>
              {monthlyData.map((data, index) => (
                <BarGroup key={index}>
                  <BarsWrapper>
                    <Bar 
                      $height={(data.quickBoost / maxValue) * 100} 
                      $color={packageColors['Quick Boost']}
                      title={`Bài viết: ${data.quickBoost}`}
                    >
                      <BarValue>{data.quickBoost}</BarValue>
                    </Bar>
                    <Bar 
                      $height={(data.hotSearch / maxValue) * 100} 
                      $color={packageColors['Hot Search']}
                      title={`Hot Search: ${data.hotSearch}`}
                    >
                      <BarValue>{data.hotSearch}</BarValue>
                    </Bar>
                    <Bar 
                      $height={(data.spotlight / maxValue) * 100} 
                      $color={packageColors['Spotlight Banner']}
                      title={`Banner nổi bật 1: ${data.spotlight}`}
                    >
                      <BarValue>{data.spotlight}</BarValue>
                    </Bar>
                    <Bar 
                      $height={(data.topSpotlight / maxValue) * 100} 
                      $color={packageColors['Top Spotlight']}
                      title={`Banner nổi bật 2: ${data.topSpotlight}`}
                    >
                      <BarValue>{data.topSpotlight}</BarValue>
                    </Bar>
                  </BarsWrapper>
                  <MonthLabel>{data.month}</MonthLabel>
                </BarGroup>
              ))}
            </BarChartContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
              {Object.entries(packageColors).map(([name, color]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', background: color, borderRadius: '4px' }}></div>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{name}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard>
            <ChartTitle>
              <PieChartIcon size={20} />
              {language === 'vi' ? 'Phân Bố Gói Dịch Vụ' : 'Package Distribution'}
            </ChartTitle>
            <PieChartContainer>
              <PieChartSVG viewBox="0 0 220 220">
                {pieSlices.map((slice, index) => (
                  <path
                    key={index}
                    d={slice.path}
                    fill={slice.color}
                    stroke="white"
                    strokeWidth="3"
                  />
                ))}
              </PieChartSVG>
              <PieLegend>
                {pieData.map((item, index) => {
                  const Icon = packageIcons[item.label];
                  return (
                    <LegendItem key={index}>
                      <LegendLabel>
                        <LegendColor $color={item.color} />
                        <Icon size={16} style={{ marginRight: '6px' }} />
                        {item.label}
                      </LegendLabel>
                      <LegendValue>{item.value} ({pieSlices[index].percentage}%)</LegendValue>
                    </LegendItem>
                  );
                })}
              </PieLegend>
            </PieChartContainer>
          </ChartCard>
        </ChartsContainer>

        <TabsContainer>
          <Tab 
            $active={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
          >
            <Clock size={18} style={{ marginRight: '8px' }} />
            {language === 'vi' ? 'Chờ duyệt' : 'Pending Approval'}
          </Tab>
          <Tab 
            $active={activeTab === 'approved'}
            onClick={() => setActiveTab('approved')}
          >
            <CheckCircle size={18} style={{ marginRight: '8px' }} />
            {language === 'vi' ? 'Đã duyệt' : 'Approved'}
          </Tab>
        </TabsContainer>

        <TableFilter 
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={filterOptions}
          activeFilters={filters}
          onFilterToggle={handleFilterToggle}
          searchPlaceholder={language === 'vi' ? 'Tìm kiếm nhà tuyển dụng hoặc gói...' : 'Search employer or package...'}
        />

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>{language === 'vi' ? 'Nhà tuyển dụng' : 'Employer'}</th>
                <th>{language === 'vi' ? 'Gói dịch vụ' : 'Package'}</th>
                <th>{language === 'vi' ? 'Thời gian mua' : 'Purchase Date'}</th>
                <th>{language === 'vi' ? 'Hết hạn' : 'Expiry Date'}</th>
                <th>{language === 'vi' ? 'Thời hạn' : 'Duration'}</th>
                <th>{language === 'vi' ? 'Giá trị' : 'Price'}</th>
                <th>{language === 'vi' ? 'Tình trạng' : 'Status'}</th>
                <th>{language === 'vi' ? 'Thao tác' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {currentPurchases.map((purchase) => {
                const Icon = packageIcons[purchase.package];
                return (
                  <tr key={purchase.id}>
                    <td style={{ fontWeight: 600 }}>{purchase.employer}</td>
                    <td>
                      <PackageBadge $color={packageColors[purchase.package]}>
                        <Icon />
                        {purchase.package}
                      </PackageBadge>
                    </td>
                    <td>
                      <DateText>
                        <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {purchase.purchaseDate}
                      </DateText>
                    </td>
                    <td>
                      <DateText>
                        <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {purchase.expiryDate}
                      </DateText>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{purchase.duration}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        {purchase.price.toLocaleString('vi-VN')} VND
                      </div>
                    </td>
                    <td>
                      {activeTab === 'pending' ? (
                        <ApproveButton onClick={() => handleApprove(purchase.id)}>
                          <CheckCircle size={16} />
                          {language === 'vi' ? 'Duyệt' : 'Approve'}
                        </ApproveButton>
                      ) : (
                        <StatusBadge $status={purchase.status}>
                          {getStatusText(purchase.status)}
                        </StatusBadge>
                      )}
                    </td>
                    <td>
                      <ActionButtons>
                        <IconButton title={language === 'vi' ? 'Xem chi tiết' : 'View details'}>
                          <Eye size={16} />
                        </IconButton>
                      </ActionButtons>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrapper>

        <PaginationContainer>
          <PaginationInfo>
            {language === 'vi' 
              ? `Hiển thị ${startIndex + 1}-${Math.min(endIndex, filteredPurchases.length)} trong tổng số ${filteredPurchases.length} gói`
              : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredPurchases.length)} of ${filteredPurchases.length} packages`
            }
          </PaginationInfo>
          <PaginationButtons>
            <PageButton 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              {language === 'vi' ? 'Trước' : 'Previous'}
            </PageButton>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              
              // Show first page, last page, current page, and pages around current
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PageButton
                    key={pageNumber}
                    $active={currentPage === pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </PageButton>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return <PageEllipsis key={pageNumber}>...</PageEllipsis>;
              }
              return null;
            })}
            
            <PageButton 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              {language === 'vi' ? 'Sau' : 'Next'}
            </PageButton>
          </PaginationButtons>
        </PaginationContainer>
        </>
        )}
      </PageContainer>
    </DashboardLayout>
  );
};

export default PackagesManagement;



