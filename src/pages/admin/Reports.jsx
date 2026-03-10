import { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { jobPosts } from '../../data/jobPosts';
import { 
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Download,
  Filter,
  MapPin,
  Zap,
  Briefcase,
  Package,
  Award
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

const PageEllipsis = styled.span`
  color: ${props => props.theme.colors.textLight};
  font-weight: 600;
  padding: 0 4px;
`;

const ServiceTable = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  overflow: hidden;
  margin-bottom: 32px;
`;

const ServiceTableHeader = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 20px 24px;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    padding: 16px 20px;
    font-size: 16px;
  }
`;

const ServiceTableContent = styled.div`
  overflow-x: auto;
`;

const ServiceTableGrid = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
  
  @media (max-width: 768px) {
    min-width: 700px;
  }
`;

const TableHeaderRow = styled.tr`
  background: ${props => props.theme.colors.bgDark};
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const TableHeaderCell = styled.th`
  padding: 16px 20px;
  text-align: ${props => props.$align || 'left'};
  font-weight: 700;
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 11px;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.bgDark};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 16px 20px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  text-align: ${props => props.$align || 'left'};
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 12px;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.$status === 'active') return '#dcfce7';
    if (props.$status === 'expired') return '#fee2e2';
    return '#fef3c7';
  }};
  color: ${props => {
    if (props.$status === 'active') return '#15803d';
    if (props.$status === 'expired') return '#dc2626';
    return '#ca8a04';
  }};
`;

const ActionButtonSmall = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${props => props.$variant === 'primary' ? props.theme.colors.primary : '#e5e7eb'};
  color: ${props => props.$variant === 'primary' ? 'white' : props.theme.colors.text};
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 40px 0 24px 0;
  padding-bottom: 16px;
  border-bottom: 3px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin: 32px 0 20px 0;
  }
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const RevenueTotal = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const RankBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: 800;
  font-size: 14px;
  background: ${props => {
    if (props.$rank === 1) return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
    if (props.$rank === 2) return 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)';
    if (props.$rank === 3) return 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)';
    return 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)';
  }};
  color: ${props => props.$rank <= 3 ? 'white' : '#6b7280'};
  box-shadow: ${props => props.theme.shadows.sm};
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
`;

const Reports = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('statistics');
  const [dateFilter, setDateFilter] = useState('month');
  const [locationFilter, setLocationFilter] = useState('all');

  // Handler xuất Excel (chưa implement thư viện)
  const handleExportExcel = () => {
    alert(
      language === 'vi' 
        ? '🚧 Chức năng xuất Excel đang được phát triển\n\n📊 Dữ liệu sẽ được xuất:\n- Thống kê dịch vụ\n- Lịch sử mua gói\n- Trạng thái các gói\n- Báo cáo doanh thu'
        : '🚧 Excel export feature is under development\n\n📊 Data to be exported:\n- Service statistics\n- Purchase history\n- Package status\n- Revenue reports'
    );
  };

  // Calculate real statistics
  const totalCandidates = 100;
  const totalEmployers = 30;
  const totalPosts = jobPosts.length;
  const urgentPosts = jobPosts.filter(post => post.category === 'urgent').length;
  const standardPosts = jobPosts.filter(post => post.category === 'standard').length;

  // Stats data
  const stats = [
    { 
      label: language === 'vi' ? 'Tổng Ứng Viên' : 'Total Candidates',
      value: totalCandidates.toString(),
      change: '+12%',
      positive: true,
      icon: Users,
      color: '#3b82f6'
    },
    { 
      label: language === 'vi' ? 'Tổng Nhà Tuyển Dụng' : 'Total Employers',
      value: totalEmployers.toString(),
      change: '+8%',
      positive: true,
      icon: Building2,
      color: '#8b5cf6'
    },
    { 
      label: language === 'vi' ? 'Job Thường' : 'Standard Jobs',
      value: standardPosts.toString(),
      change: '+15%',
      positive: true,
      icon: Briefcase,
      color: '#10b981'
    },
    { 
      label: language === 'vi' ? 'Job Gấp' : 'Urgent Jobs',
      value: urgentPosts.toString(),
      change: '+23%',
      positive: true,
      icon: Zap,
      color: '#f59e0b'
    },
  ];

  // Revenue data for Job thường (Standard Jobs)
  const standardRevenueData = [
    { month: 'T1', revenue: 85 },
    { month: 'T2', revenue: 92 },
    { month: 'T3', revenue: 98 },
    { month: 'T4', revenue: 105 },
    { month: 'T5', revenue: 112 },
    { month: 'T6', revenue: 90 },
  ];

  // Revenue data for Job gấp (Urgent Jobs)
  const urgentRevenueData = [
    { month: 'T1', revenue: 95 },
    { month: 'T2', revenue: 103 },
    { month: 'T3', revenue: 112 },
    { month: 'T4', revenue: 120 },
    { month: 'T5', revenue: 123 },
    { month: 'T6', revenue: 127 },
  ];

  const maxStandardRevenue = Math.max(...standardRevenueData.map(d => d.revenue));
  const maxUrgentRevenue = Math.max(...urgentRevenueData.map(d => d.revenue));

  // Top employers by posts count (Đăng nhiều tin nhất)
  const employerPostCounts = {};
  jobPosts.forEach(post => {
    employerPostCounts[post.company] = (employerPostCounts[post.company] || 0) + 1;
  });
  
  const topEmployersByPosts = Object.entries(employerPostCounts)
    .map(([name, count]) => ({ name, posts: count }))
    .sort((a, b) => b.posts - a.posts)
    .slice(0, 5);

  // Top employers by package purchases (Mua nhiều gói nhất) - simulated data
  const topEmployersByPackages = [
    { name: 'Chill Out Beer Club', packages: 12, revenue: '18.5M' },
    { name: 'Bia Sệt 123', packages: 10, revenue: '15.2M' },
    { name: 'Beer Garden Phố', packages: 9, revenue: '14.8M' },
    { name: 'Nướng Ngói Gia Bảo', packages: 8, revenue: '12.3M' },
    { name: 'Lẩu Bò Sài Gòn Vi Vu', packages: 7, revenue: '10.9M' },
  ];

  // Districts in Ho Chi Minh City
  const districts = [
    'Tất cả quận',
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5',
    'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
    'Quận 11', 'Quận 12', 'Quận Bình Thạnh', 'Quận Tân Bình',
    'Quận Tân Phú', 'Quận Phú Nhuận', 'Quận Gò Vấp',
    'Quận Bình Tân', 'Quận Thủ Đức'
  ];

  // Service packages data for Job thường
  const standardJobServices = [
    { id: 1, name: 'Quick Boost', price: '245.000 VND', duration: '24H', status: 'active' },
    { id: 2, name: 'Hot Search', price: '395.000 VND', duration: '48H', status: 'active' },
    { id: 3, name: 'Spongit Banner', price: '745.000 VND', duration: '7 ngày', status: 'active' },
    { id: 4, name: 'Top Spotlight', price: '1.245.000 VND', duration: '14 ngày', status: 'active' },
  ];

  // Service packages data for Job gấp
  const urgentJobServices = [
    { id: 1, name: 'Quick Boost Gấp', price: '345.000 VND', duration: '12H', status: 'active' },
    { id: 2, name: 'Hot Search Gấp', price: '495.000 VND', duration: '24H', status: 'active' },
    { id: 3, name: 'Spongit Banner Gấp', price: '895.000 VND', duration: '3 ngày', status: 'active' },
    { id: 4, name: 'Top Spotlight Gấp', price: '1.495.000 VND', duration: '7 ngày', status: 'active' },
  ];

  // Purchase history for Job thường
  const standardPurchaseHistory = [
    { id: 1, employer: 'Lẩu Bò Sài Gòn Vi Vu', package: 'Hot Search', price: '395.000 VND', date: '08/03/2026', status: 'active' },
    { id: 2, employer: 'Phở Gia Truyền 1954', package: 'Spongit Banner', price: '745.000 VND', date: '07/03/2026', status: 'active' },
    { id: 3, employer: 'Urban Coffee', package: 'Quick Boost', price: '245.000 VND', date: '06/03/2026', status: 'expired' },
    { id: 4, employer: 'Dimsum House', package: 'Top Spotlight', price: '1.245.000 VND', date: '05/03/2026', status: 'active' },
    { id: 5, employer: 'Bánh Mì PewPew', package: 'Hot Search', price: '395.000 VND', date: '04/03/2026', status: 'active' },
  ];

  // Purchase history for Job gấp
  const urgentPurchaseHistory = [
    { id: 1, employer: 'Chill Out Beer Club', package: 'Quick Boost Gấp', price: '345.000 VND', date: '08/03/2026', status: 'active' },
    { id: 2, employer: 'Bia Sệt 123', package: 'Hot Search Gấp', price: '495.000 VND', date: '08/03/2026', status: 'active' },
    { id: 3, employer: 'Beer Garden Phố', package: 'Spongit Banner Gấp', price: '895.000 VND', date: '07/03/2026', status: 'active' },
    { id: 4, employer: 'Nướng Ngói Gia Bảo', package: 'Top Spotlight Gấp', price: '1.495.000 VND', date: '07/03/2026', status: 'active' },
    { id: 5, employer: 'Lẩu Phan', package: 'Quick Boost Gấp', price: '345.000 VND', date: '06/03/2026', status: 'expired' },
  ];

  // Package status for Job thường
  const standardPackageStatus = [
    { id: 1, employer: 'Lẩu Bò Sài Gòn Vi Vu', package: 'Hot Search', startDate: '08/03/2026', endDate: '10/03/2026', status: 'active' },
    { id: 2, employer: 'Phở Gia Truyền 1954', package: 'Spongit Banner', startDate: '07/03/2026', endDate: '14/03/2026', status: 'active' },
    { id: 3, employer: 'Urban Coffee', package: 'Quick Boost', startDate: '06/03/2026', endDate: '07/03/2026', status: 'expired' },
    { id: 4, employer: 'Dimsum House', package: 'Top Spotlight', startDate: '05/03/2026', endDate: '19/03/2026', status: 'active' },
  ];

  // Package status for Job gấp
  const urgentPackageStatus = [
    { id: 1, employer: 'Chill Out Beer Club', package: 'Quick Boost Gấp', startDate: '08/03/2026', endDate: '08/03/2026', status: 'active' },
    { id: 2, employer: 'Bia Sệt 123', package: 'Hot Search Gấp', startDate: '08/03/2026', endDate: '09/03/2026', status: 'active' },
    { id: 3, employer: 'Beer Garden Phố', package: 'Spongit Banner Gấp', startDate: '07/03/2026', endDate: '10/03/2026', status: 'active' },
    { id: 4, employer: 'Nướng Ngói Gia Bảo', package: 'Top Spotlight Gấp', startDate: '07/03/2026', endDate: '14/03/2026', status: 'active' },
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
            $active={activeTab === 'statistics'}
            onClick={() => setActiveTab('statistics')}
          >
            <BarChart3 size={18} style={{ display: 'inline', marginRight: '8px' }} />
            {language === 'vi' ? 'Thống kê dịch vụ' : 'Service Statistics'}
          </Tab>
          <Tab 
            $active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          >
            <Package size={18} style={{ display: 'inline', marginRight: '8px' }} />
            {language === 'vi' ? 'Lịch sử mua gói' : 'Purchase History'}
          </Tab>
          <Tab 
            $active={activeTab === 'status'}
            onClick={() => setActiveTab('status')}
          >
            <Award size={18} style={{ display: 'inline', marginRight: '8px' }} />
            {language === 'vi' ? 'Trạng thái các gói' : 'Package Status'}
          </Tab>
        </TabsContainer>

        <ControlBar>
          <FilterGroup>
            <Filter size={18} />
            <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="day">{language === 'vi' ? 'Theo ngày' : 'By Day'}</option>
              <option value="month">{language === 'vi' ? 'Theo tháng' : 'By Month'}</option>
              <option value="year">{language === 'vi' ? 'Theo năm' : 'By Year'}</option>
            </Select>
            <MapPin size={18} />
            <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              {districts.map((district, index) => (
                <option key={index} value={index === 0 ? 'all' : district}>
                  {district}
                </option>
              ))}
            </Select>
          </FilterGroup>
          <DownloadButton onClick={handleExportExcel}>
            <Download />
            {language === 'vi' ? 'Xuất Excel' : 'Export Excel'}
          </DownloadButton>
        </ControlBar>

        {activeTab === 'statistics' && (
          <>
            <ServiceTable>
              <ServiceTableHeader>
                <Briefcase size={24} />
                {language === 'vi' ? 'Thống kê dịch vụ - Job Thường' : 'Service Statistics - Standard Jobs'}
              </ServiceTableHeader>
              <ServiceTableContent>
                <ServiceTableGrid>
                  <thead>
                    <TableHeaderRow>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'STT' : 'No.'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Tên gói' : 'Package Name'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Giá' : 'Price'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Thời hạn' : 'Duration'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Trạng thái' : 'Status'}</TableHeaderCell>
                    </TableHeaderRow>
                  </thead>
                  <tbody>
                    {standardJobServices.map((service, index) => (
                      <TableRow key={service.id}>
                        <TableCell $align="center" style={{ fontWeight: 600, color: '#6b7280' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>{service.name}</TableCell>
                        <TableCell $align="center" style={{ fontWeight: 700, color: '#10b981' }}>
                          {service.price}
                        </TableCell>
                        <TableCell $align="center">{service.duration}</TableCell>
                        <TableCell $align="center">
                          <StatusBadge $status={service.status}>
                            {language === 'vi' ? 'Hoạt động' : 'Active'}
                          </StatusBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </ServiceTableGrid>
              </ServiceTableContent>
            </ServiceTable>

            <ServiceTable>
              <ServiceTableHeader>
                <Zap size={24} />
                {language === 'vi' ? 'Thống kê dịch vụ - Job Gấp' : 'Service Statistics - Urgent Jobs'}
              </ServiceTableHeader>
              <ServiceTableContent>
                <ServiceTableGrid>
                  <thead>
                    <TableHeaderRow>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'STT' : 'No.'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Tên gói' : 'Package Name'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Giá' : 'Price'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Thời hạn' : 'Duration'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Trạng thái' : 'Status'}</TableHeaderCell>
                    </TableHeaderRow>
                  </thead>
                  <tbody>
                    {urgentJobServices.map((service, index) => (
                      <TableRow key={service.id}>
                        <TableCell $align="center" style={{ fontWeight: 600, color: '#6b7280' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>{service.name}</TableCell>
                        <TableCell $align="center" style={{ fontWeight: 700, color: '#f59e0b' }}>
                          {service.price}
                        </TableCell>
                        <TableCell $align="center">{service.duration}</TableCell>
                        <TableCell $align="center">
                          <StatusBadge $status={service.status}>
                            {language === 'vi' ? 'Hoạt động' : 'Active'}
                          </StatusBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </ServiceTableGrid>
              </ServiceTableContent>
            </ServiceTable>

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

        <SectionTitle>
          <DollarSign size={24} />
          {language === 'vi' ? 'Báo Cáo Doanh Thu' : 'Revenue Reports'}
        </SectionTitle>

        <ChartsGrid>
          <ChartCard>
            <ChartHeader>
              <h3>
                <Briefcase />
                {language === 'vi' ? 'Doanh Thu Job Thường' : 'Standard Jobs Revenue'}
              </h3>
              <RevenueTotal>{language === 'vi' ? '90.000.000 VNĐ' : '90.000.000 VNĐ'}</RevenueTotal>
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
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}
                
                {standardRevenueData.map((d, i) => {
                  const barHeight = (d.revenue / maxStandardRevenue) * 180;
                  return (
                    <g key={i}>
                      <defs>
                        <linearGradient id={`standardGrad${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                      <rect
                        x={80 + i * 100}
                        y={250 - barHeight}
                        width="60"
                        height={barHeight}
                        fill={`url(#standardGrad${i})`}
                        rx="6"
                      />
                      <text
                        x={110 + i * 100}
                        y={240 - barHeight}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#10b981"
                        fontWeight="700"
                      >
                        {d.revenue}M
                      </text>
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
                  );
                })}
              </ChartSVG>
            </ChartContainer>
          </ChartCard>

          <ChartCard>
            <ChartHeader>
              <h3>
                <Zap />
                {language === 'vi' ? 'Doanh Thu Job Gấp' : 'Urgent Jobs Revenue'}
              </h3>
              <RevenueTotal>{language === 'vi' ? '127 triệu VNĐ' : '127M VND'}</RevenueTotal>
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
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}
                
                {urgentRevenueData.map((d, i) => {
                  const barHeight = (d.revenue / maxUrgentRevenue) * 180;
                  return (
                    <g key={i}>
                      <defs>
                        <linearGradient id={`urgentGrad${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                      <rect
                        x={80 + i * 100}
                        y={250 - barHeight}
                        width="60"
                        height={barHeight}
                        fill={`url(#urgentGrad${i})`}
                        rx="6"
                      />
                      <text
                        x={110 + i * 100}
                        y={240 - barHeight}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#f59e0b"
                        fontWeight="700"
                      >
                        {d.revenue}M
                      </text>
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
                  );
                })}
              </ChartSVG>
            </ChartContainer>
          </ChartCard>
        </ChartsGrid>

        <SectionTitle>
          <BarChart3 size={24} />
          {language === 'vi' ? 'Báo Cáo Tuyển Dụng' : 'Recruitment Reports'}
        </SectionTitle>

        <ChartsGrid>
          <TableCard>
            <ChartHeader>
              <h3>
                <Award />
                {language === 'vi' ? 'Đăng Nhiều Tin Nhất' : 'Most Job Posts'}
              </h3>
            </ChartHeader>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>{language === 'vi' ? 'Top' : 'Rank'}</th>
                    <th>{language === 'vi' ? 'Nhà Tuyển Dụng' : 'Employer'}</th>
                    <th style={{ textAlign: 'center' }}>{language === 'vi' ? 'Số Tin' : 'Posts'}</th>
                  </tr>
                </thead>
                <tbody>
                  {topEmployersByPosts.map((employer, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: 'center' }}>
                        <RankBadge $rank={index + 1}>
                          {index + 1}
                        </RankBadge>
                      </td>
                      <td style={{ fontWeight: 600 }}>{employer.name}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#3b82f6', fontSize: '16px' }}>
                        {employer.posts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </TableCard>

          <TableCard>
            <ChartHeader>
              <h3>
                <Package />
                {language === 'vi' ? 'Mua Nhiều Gói Nhất' : 'Most Packages Purchased'}
              </h3>
            </ChartHeader>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>{language === 'vi' ? 'Top' : 'Rank'}</th>
                    <th>{language === 'vi' ? 'Nhà Tuyển Dụng' : 'Employer'}</th>
                    <th style={{ textAlign: 'center' }}>{language === 'vi' ? 'Số Gói' : 'Packages'}</th>
                    <th style={{ textAlign: 'right' }}>{language === 'vi' ? 'Doanh Thu' : 'Revenue'}</th>
                  </tr>
                </thead>
                <tbody>
                  {topEmployersByPackages.map((employer, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: 'center' }}>
                        <RankBadge $rank={index + 1}>
                          {index + 1}
                        </RankBadge>
                      </td>
                      <td style={{ fontWeight: 600 }}>{employer.name}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#8b5cf6', fontSize: '16px' }}>
                        {employer.packages}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#10b981' }}>
                        {employer.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </TableCard>
        </ChartsGrid>
          </>
        )}

        {activeTab === 'history' && (
          <>
            <ServiceTable>
              <ServiceTableHeader>
                <Briefcase size={24} />
                {language === 'vi' ? 'Lịch sử mua gói - Job Thường' : 'Purchase History - Standard Jobs'}
              </ServiceTableHeader>
              <ServiceTableContent>
                <ServiceTableGrid>
                  <thead>
                    <TableHeaderRow>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'STT' : 'No.'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Nhà tuyển dụng' : 'Employer'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Gói dịch vụ' : 'Package'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Giá' : 'Price'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Ngày mua' : 'Purchase Date'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Trạng thái' : 'Status'}</TableHeaderCell>
                    </TableHeaderRow>
                  </thead>
                  <tbody>
                    {standardPurchaseHistory.map((purchase, index) => (
                      <TableRow key={purchase.id}>
                        <TableCell $align="center" style={{ fontWeight: 600, color: '#6b7280' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>{purchase.employer}</TableCell>
                        <TableCell>{purchase.package}</TableCell>
                        <TableCell $align="center" style={{ fontWeight: 700, color: '#10b981' }}>
                          {purchase.price}
                        </TableCell>
                        <TableCell $align="center">{purchase.date}</TableCell>
                        <TableCell $align="center">
                          <StatusBadge $status={purchase.status}>
                            {purchase.status === 'active' 
                              ? (language === 'vi' ? 'Hoạt động' : 'Active')
                              : (language === 'vi' ? 'Hết hạn' : 'Expired')
                            }
                          </StatusBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </ServiceTableGrid>
              </ServiceTableContent>
            </ServiceTable>

            <ServiceTable>
              <ServiceTableHeader>
                <Zap size={24} />
                {language === 'vi' ? 'Lịch sử mua gói - Job Gấp' : 'Purchase History - Urgent Jobs'}
              </ServiceTableHeader>
              <ServiceTableContent>
                <ServiceTableGrid>
                  <thead>
                    <TableHeaderRow>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'STT' : 'No.'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Nhà tuyển dụng' : 'Employer'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Gói dịch vụ' : 'Package'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Giá' : 'Price'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Ngày mua' : 'Purchase Date'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Trạng thái' : 'Status'}</TableHeaderCell>
                    </TableHeaderRow>
                  </thead>
                  <tbody>
                    {urgentPurchaseHistory.map((purchase, index) => (
                      <TableRow key={purchase.id}>
                        <TableCell $align="center" style={{ fontWeight: 600, color: '#6b7280' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>{purchase.employer}</TableCell>
                        <TableCell>{purchase.package}</TableCell>
                        <TableCell $align="center" style={{ fontWeight: 700, color: '#f59e0b' }}>
                          {purchase.price}
                        </TableCell>
                        <TableCell $align="center">{purchase.date}</TableCell>
                        <TableCell $align="center">
                          <StatusBadge $status={purchase.status}>
                            {purchase.status === 'active' 
                              ? (language === 'vi' ? 'Hoạt động' : 'Active')
                              : (language === 'vi' ? 'Hết hạn' : 'Expired')
                            }
                          </StatusBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </ServiceTableGrid>
              </ServiceTableContent>
            </ServiceTable>
          </>
        )}

        {activeTab === 'status' && (
          <>
            <ServiceTable>
              <ServiceTableHeader>
                <Briefcase size={24} />
                {language === 'vi' ? 'Trạng thái các gói - Job Thường' : 'Package Status - Standard Jobs'}
              </ServiceTableHeader>
              <ServiceTableContent>
                <ServiceTableGrid>
                  <thead>
                    <TableHeaderRow>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'STT' : 'No.'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Nhà tuyển dụng' : 'Employer'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Gói dịch vụ' : 'Package'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Ngày bắt đầu' : 'Start Date'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Ngày kết thúc' : 'End Date'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Trạng thái' : 'Status'}</TableHeaderCell>
                    </TableHeaderRow>
                  </thead>
                  <tbody>
                    {standardPackageStatus.map((pkg, index) => (
                      <TableRow key={pkg.id}>
                        <TableCell $align="center" style={{ fontWeight: 600, color: '#6b7280' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>{pkg.employer}</TableCell>
                        <TableCell>{pkg.package}</TableCell>
                        <TableCell $align="center">{pkg.startDate}</TableCell>
                        <TableCell $align="center">{pkg.endDate}</TableCell>
                        <TableCell $align="center">
                          <StatusBadge $status={pkg.status}>
                            {pkg.status === 'active' 
                              ? (language === 'vi' ? 'Hoạt động' : 'Active')
                              : (language === 'vi' ? 'Hết hạn' : 'Expired')
                            }
                          </StatusBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </ServiceTableGrid>
              </ServiceTableContent>
            </ServiceTable>

            <ServiceTable>
              <ServiceTableHeader>
                <Zap size={24} />
                {language === 'vi' ? 'Trạng thái các gói - Job Gấp' : 'Package Status - Urgent Jobs'}
              </ServiceTableHeader>
              <ServiceTableContent>
                <ServiceTableGrid>
                  <thead>
                    <TableHeaderRow>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'STT' : 'No.'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Nhà tuyển dụng' : 'Employer'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Gói dịch vụ' : 'Package'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Ngày bắt đầu' : 'Start Date'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Ngày kết thúc' : 'End Date'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Trạng thái' : 'Status'}</TableHeaderCell>
                    </TableHeaderRow>
                  </thead>
                  <tbody>
                    {urgentPackageStatus.map((pkg, index) => (
                      <TableRow key={pkg.id}>
                        <TableCell $align="center" style={{ fontWeight: 600, color: '#6b7280' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>{pkg.employer}</TableCell>
                        <TableCell>{pkg.package}</TableCell>
                        <TableCell $align="center">{pkg.startDate}</TableCell>
                        <TableCell $align="center">{pkg.endDate}</TableCell>
                        <TableCell $align="center">
                          <StatusBadge $status={pkg.status}>
                            {pkg.status === 'active' 
                              ? (language === 'vi' ? 'Hoạt động' : 'Active')
                              : (language === 'vi' ? 'Hết hạn' : 'Expired')
                            }
                          </StatusBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </ServiceTableGrid>
              </ServiceTableContent>
            </ServiceTable>
          </>
        )}
      </PageContainer>
    </DashboardLayout>
  );
};

export default Reports;
