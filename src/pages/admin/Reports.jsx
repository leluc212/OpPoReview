// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import adminReportService from '../../services/adminReportService';
import feedbackService from '../../services/feedbackService';
import { motion } from 'framer-motion';
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
  Award,
  MessageSquare,
  CheckCircle,
  Trash2
} from 'lucide-react';

const parseDateTime = (str) => {
  if (!str) return new Date();
  if (typeof str !== 'string') return new Date(str);
  // If it's a naive ISO string like "2026-06-04T04:27:00.123" without offset
  if (str.includes('T') && !str.endsWith('Z') && !str.includes('+') && !str.substring(str.indexOf('T')).includes('-')) {
    return new Date(str + 'Z');
  }
  return new Date(str);
};

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
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    candidates: [],
    employers: [],
    standardJobs: [],
    quickJobs: [],
    subscriptions: []
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('all');
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState('all');

  const loadFeedbacks = async () => {
    try {
      const list = await feedbackService.getAllFeedbacks();
      setFeedbacks(list);
      const unread = list.filter(item => item.status === 'unread').length;
      setUnreadCount(unread);
    } catch (e) {
      console.error('Error loading feedbacks:', e);
    }
  };

  const handleMarkAsRead = async (id) => {
    await feedbackService.markAsRead(id);
    await loadFeedbacks();
  };

  const handleDeleteFeedback = async (id) => {
    const msg = language === 'vi' 
      ? 'Bạn có chắc chắn muốn xóa ý kiến góp ý này không?' 
      : 'Are you sure you want to delete this feedback?';
    if (window.confirm(msg)) {
      await feedbackService.deleteFeedback(id);
      await loadFeedbacks();
    }
  };


  useEffect(() => {
    loadFeedbacks();

    const handleFeedbackUpdate = () => {
      loadFeedbacks();
    };

    window.addEventListener('newFeedbackSubmitted', handleFeedbackUpdate);
    window.addEventListener('feedbackStatusChanged', handleFeedbackUpdate);

    return () => {
      window.removeEventListener('newFeedbackSubmitted', handleFeedbackUpdate);
      window.removeEventListener('feedbackStatusChanged', handleFeedbackUpdate);
    };
  }, []);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(item => {
      const matchCat = feedbackCategoryFilter === 'all' || item.category === feedbackCategoryFilter;
      const matchStat = feedbackStatusFilter === 'all' || item.status === feedbackStatusFilter;
      return matchCat && matchStat;
    });
  }, [feedbacks, feedbackCategoryFilter, feedbackStatusFilter]);

  // Load report data from consolidated service
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const data = await adminReportService.getReportsData();
        setReportData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError(language === 'vi' 
          ? 'Không thể tải đầy đủ dữ liệu báo cáo. Có thể do lỗi kết nối hoặc CORS với AWS.' 
          : 'Could not load complete report data. This may be due to connection or CORS issues with AWS.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [language]);

  // Handler xuất Excel (chưa implement thư viện)
  const handleExportExcel = () => {
    alert(
      language === 'vi' 
        ? '🚧 Chức năng xuất Excel đang được phát triển\n\n📊 Dữ liệu sẽ được xuất:\n- Thống kê dịch vụ\n- Lịch sử mua gói\n- Trạng thái các gói\n- Báo cáo doanh thu'
        : '🚧 Excel export feature is under development\n\n📊 Dữ liệu sẽ được xuất:\n- Thống kê dịch vụ\n- Lịch sử mua gói\n- Trạng thái các gói\n- Báo cáo doanh thu'
    );
  };

  // Process data for statistics
  const statsSummary = useMemo(() => adminReportService.calculateStats(reportData), [reportData]);

  // Stats display configuration with dynamic trends
  const stats = [
    { 
      label: language === 'vi' ? 'Tổng Ứng Viên' : 'Total Candidates',
      value: statsSummary.totalCandidates.toString(),
      change: statsSummary.trends.candidates, 
      positive: !statsSummary.trends.candidates.includes('-'),
      icon: Users,
      color: '#3b82f6'
    },
    { 
      label: language === 'vi' ? 'Tổng Nhà Tuyển Dụng' : 'Total Employers',
      value: statsSummary.totalEmployers.toString(),
      change: statsSummary.trends.employers,
      positive: !statsSummary.trends.employers.includes('-'),
      icon: Building2,
      color: '#8b5cf6'
    },
    { 
      label: language === 'vi' ? 'Tin tiêu chuẩn' : 'Standard Jobs',
      value: statsSummary.totalStandardJobs.toString(),
      change: statsSummary.trends.standardJobs,
      positive: !statsSummary.trends.standardJobs.includes('-'),
      icon: Briefcase,
      color: '#10b981'
    },
    { 
      label: language === 'vi' ? 'Tin tuyển gấp' : 'Urgent Jobs',
      value: statsSummary.totalQuickJobs.toString(),
      change: statsSummary.trends.quickJobs,
      positive: !statsSummary.trends.quickJobs.includes('-'),
      icon: Zap,
      color: '#f59e0b'
    },
  ];

  // Revenue charts data
  const [revenueView, setRevenueView] = useState('month'); // 'day' | 'week' | 'month'

  const revenueData = useMemo(() => {
    const subs = reportData.subscriptions || [];
    const now = new Date();

    if (revenueView === 'day') {
      // Last 12 days
      return Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - (11 - i));
        const dateStr = d.toISOString().split('T')[0];
        const revenue = subs
          .filter(s => (s.status === 'active' || s.status === 'expired' || s.status === 'expiring') &&
            (s.purchaseDateTime || s.createdAt || '').startsWith(dateStr))
          .reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0) / 1000000;
        return { month: `${d.getDate()}/${d.getMonth() + 1}`, revenue };
      });
    }

    if (revenueView === 'week') {
      // Last 12 weeks
      return Array.from({ length: 12 }, (_, i) => {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() - (11 - i) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const revenue = subs
          .filter(s => {
            if (!(s.status === 'active' || s.status === 'expired' || s.status === 'expiring')) return false;
            const d = parseDateTime(s.purchaseDateTime || s.createdAt || '');
            return d >= weekStart && d <= weekEnd;
          })
          .reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0) / 1000000;
        return { month: `T${weekStart.getDate()}/${weekStart.getMonth() + 1}`, revenue };
      });
    }

    // Default: month
    return adminReportService.getRevenueByMonth(subs);
  }, [reportData.subscriptions, revenueView]);

  const maxRevenue = useMemo(() => Math.max(...revenueData.map(d => d.revenue), 10), [revenueData]);
  
  // Top employers processing - REVENUE BASED
  const topEmployersByRevenue = useMemo(() => 
    adminReportService.getTopEmployersByRevenue(reportData.subscriptions), 
  [reportData.subscriptions]);

  const topEmployersByPosts = useMemo(() => {
    const counts = {};
    const formattedStandard = Array.isArray(reportData.standardJobs) ? reportData.standardJobs : [];
    const formattedQuick = Array.isArray(reportData.quickJobs) ? reportData.quickJobs : [];
    const employersList = Array.isArray(reportData.employers) ? reportData.employers : [];

    [...formattedStandard, ...formattedQuick].forEach(job => {
      let company = job.companyName || job.company;
      
      // If company name is missing, try to find it from the employer profile list
      if (!company || company === 'Unknown Company') {
        const profile = employersList.find(e => 
          (job.employerId && e.userId === job.employerId) || 
          (job.employerEmail && e.email === job.employerEmail)
        );
        if (profile) {
          company = profile.companyName || profile.businessName;
        }
      }
      
      const finalName = company || 'Unknown Company';
      counts[finalName] = (counts[finalName] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, posts]) => ({ name, posts }))
      .sort((a, b) => b.posts - a.posts)
      .filter(item => item.name !== 'Unknown Company') // Optional: Filter out if still unknown
      .slice(0, 5);
  }, [reportData.standardJobs, reportData.quickJobs, reportData.employers]);

  const districts = useMemo(() => adminReportService.getDynamicDistricts(reportData), [reportData]);

  // Data for tables - DYNAMIC FROM SUBSCRIPTIONS
  const packageStats = useMemo(() => 
    adminReportService.calculatePackageStats(reportData.subscriptions), 
  [reportData.subscriptions]);

  const standardServices = useMemo(() => 
    packageStats.filter(p => p.type === 'standard'), 
  [packageStats]);

  const urgentServices = useMemo(() => 
    packageStats.filter(p => p.type === 'urgent'), 
  [packageStats]);

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <PageContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3b82f6', borderRadius: '50%', margin: '0 auto 16px' }}
            />
            <p>{language === 'vi' ? 'Đang tải dữ liệu báo cáo...' : 'Loading report data...'}</p>
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="admin">
        <PageContainer style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</div>
          <button onClick={() => window.location.reload()} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            {language === 'vi' ? 'Thử lại' : 'Retry'}
          </button>
        </PageContainer>
      </DashboardLayout>
    );
  }

  // Filter subscriptions for history and status tabs
  const standardSubscriptions = reportData.subscriptions.filter(s => 
    !s.packageName?.includes('Gấp') && !s.packageName?.includes('Urgent')
  );
  
  const urgentSubscriptions = reportData.subscriptions.filter(s => 
    s.packageName?.includes('Gấp') || s.packageName?.includes('Urgent')
  );

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
          <Tab 
            $active={activeTab === 'feedback'}
            onClick={() => setActiveTab('feedback')}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <MessageSquare size={18} style={{ marginRight: '8px' }} />
            {language === 'vi' ? 'Góp ý' : 'Feedback'}
            {unreadCount > 0 && (
              <span style={{ 
                marginLeft: '8px', 
                background: '#ef4444', 
                color: 'white', 
                borderRadius: '10px', 
                padding: '2px 8px', 
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '18px',
                minWidth: '18px'
              }}>
                {unreadCount}
              </span>
            )}
          </Tab>
        </TabsContainer>

        <ControlBar>
          {activeTab === 'feedback' ? (
            <FilterGroup>
              <Filter size={18} />
              <Select value={feedbackCategoryFilter} onChange={(e) => setFeedbackCategoryFilter(e.target.value)}>
                <option value="all">{language === 'vi' ? 'Tất cả phân loại' : 'All Categories'}</option>
                <option value="bug">{language === 'vi' ? 'Báo lỗi' : 'Bugs'}</option>
                <option value="suggestion">{language === 'vi' ? 'Góp ý' : 'Suggestions'}</option>
                <option value="other">{language === 'vi' ? 'Khác' : 'Others'}</option>
              </Select>
              <Select value={feedbackStatusFilter} onChange={(e) => setFeedbackStatusFilter(e.target.value)}>
                <option value="all">{language === 'vi' ? 'Tất cả trạng thái' : 'All Status'}</option>
                <option value="unread">{language === 'vi' ? 'Chưa đọc' : 'Unread'}</option>
                <option value="read">{language === 'vi' ? 'Đã đọc' : 'Read'}</option>
              </Select>
            </FilterGroup>
          ) : (
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
          )}
          {activeTab !== 'feedback' && (
            <DownloadButton onClick={handleExportExcel}>
              <Download />
              {language === 'vi' ? 'Xuất Excel' : 'Export Excel'}
            </DownloadButton>
          )}
        </ControlBar>

        {activeTab === 'statistics' && (
          <>
            <ServiceTable>
              <ServiceTableHeader>
                <Briefcase size={24} />
                {language === 'vi' ? 'Thống kê dịch vụ - Công việc Tiêu chuẩn' : 'Service Statistics - Standard Jobs'}
              </ServiceTableHeader>
              <ServiceTableContent>
                <ServiceTableGrid>
                  <thead>
                    <TableHeaderRow>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'STT' : 'No.'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Tên gói' : 'Package Name'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Giá' : 'Price'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Đơn vị' : 'Unit'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Thời hạn' : 'Duration'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Đã bán' : 'Sold'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Chưa kích hoạt' : 'Inactive'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Đã kích hoạt' : 'Active'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Hết thời hạn' : 'Expired'}</TableHeaderCell>
                    </TableHeaderRow>
                  </thead>
                  <tbody>
                    {standardServices.length > 0 ? standardServices.map((service, index) => (
                      <TableRow key={service.name}>
                        <TableCell $align="center" style={{ fontWeight: 600, color: '#6b7280' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>{service.name}</TableCell>
                        <TableCell $align="center" style={{ fontWeight: 700, color: '#10b981' }}>
                          {service.price}
                        </TableCell>
                        <TableCell $align="center" style={{ color: '#6b7280', fontSize: '13px' }}>VNĐ</TableCell>
                        <TableCell $align="center">{String(service.duration || '').replace(/[\u00A0\u200B\uFEFF]/g, ' ').trim()}</TableCell>
                        <TableCell $align="center" style={{ fontWeight: 700 }}>{service.totalCount}</TableCell>
                        <TableCell $align="center">{service.pendingCount > 0 ? service.pendingCount : '—'}</TableCell>
                        <TableCell $align="center">{service.activeCount > 0 ? service.activeCount : '—'}</TableCell>
                        <TableCell $align="center">{service.expiredCount > 0 ? service.expiredCount : '—'}</TableCell>
                      </TableRow>
                    )) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '15px' }}>
                          {language === 'vi' ? 'chưa có' : 'no data'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </ServiceTableGrid>
              </ServiceTableContent>
            </ServiceTable>

            <ServiceTable>
              <ServiceTableHeader>
                <Zap size={24} />
                {language === 'vi' ? 'Thống kê dịch vụ - Công việc Tuyển gấp' : 'Service Statistics - Urgent Jobs'}
              </ServiceTableHeader>
              <ServiceTableContent>
                <ServiceTableGrid>
                  <thead>
                    <TableHeaderRow>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'STT' : 'No.'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Tên gói' : 'Package Name'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Giá' : 'Price'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Đơn vị' : 'Unit'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Thời hạn' : 'Duration'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Đã bán' : 'Sold'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Chưa kích hoạt' : 'Inactive'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Đã kích hoạt' : 'Active'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Hết thời hạn' : 'Expired'}</TableHeaderCell>
                    </TableHeaderRow>
                  </thead>
                  <tbody>
                    {urgentServices.length > 0 ? urgentServices.map((service, index) => (
                      <TableRow key={service.name}>
                        <TableCell $align="center" style={{ fontWeight: 600, color: '#6b7280' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>{service.name}</TableCell>
                        <TableCell $align="center" style={{ fontWeight: 700, color: '#f59e0b' }}>
                          {service.price}
                        </TableCell>
                        <TableCell $align="center" style={{ color: '#6b7280', fontSize: '13px' }}>VNĐ</TableCell>
                        <TableCell $align="center">{String(service.duration || '').replace(/[\u00A0\u200B\uFEFF]/g, ' ').trim()}</TableCell>
                        <TableCell $align="center" style={{ fontWeight: 700 }}>{service.totalCount}</TableCell>
                        <TableCell $align="center">{service.pendingCount > 0 ? service.pendingCount : '—'}</TableCell>
                        <TableCell $align="center">{service.activeCount > 0 ? service.activeCount : '—'}</TableCell>
                        <TableCell $align="center">{service.expiredCount > 0 ? service.expiredCount : '—'}</TableCell>
                      </TableRow>
                    )) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '15px' }}>
                          {language === 'vi' ? 'chưa có' : 'no data'}
                        </td>
                      </tr>
                    )}
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
                <BarChart3 />
                {language === 'vi' ? 'Tổng Doanh Thu' : 'Total Revenue'}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '3px' }}>
                  {[
                    { key: 'day', label: language === 'vi' ? 'Ngày' : 'Day' },
                    { key: 'week', label: language === 'vi' ? 'Tuần' : 'Week' },
                    { key: 'month', label: language === 'vi' ? 'Tháng' : 'Month' },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setRevenueView(opt.key)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: revenueView === opt.key ? '#3b82f6' : 'transparent',
                        color: revenueView === opt.key ? 'white' : '#64748b',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <RevenueTotal>
                  {(statsSummary.totalRevenue / 1000000).toFixed(1)}M VND
                </RevenueTotal>
              </div>
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
                
                {revenueData.map((d, i) => {
                  const barHeight = (d.revenue / maxRevenue) * 180;
                  return (
                    <g key={i}>
                      <defs>
                        <linearGradient id={`revGrad${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                      <rect
                        x={65 + i * 52}
                        y={250 - barHeight}
                        width="30"
                        height={barHeight}
                        fill={`url(#revGrad${i})`}
                        rx="4"
                      />
                      {d.revenue > 0 && (
                        <text
                          x={80 + i * 52}
                          y={240 - barHeight}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#3b82f6"
                          fontWeight="700"
                        >
                          {d.revenue.toFixed(1)}
                        </text>
                      )}
                      <text
                        x={80 + i * 52}
                        y="275"
                        textAnchor="middle"
                        fontSize="11"
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
                  {topEmployersByRevenue.length > 0 ? topEmployersByRevenue.map((employer, index) => (
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
                  )) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                        {language === 'vi' ? 'Chưa có dữ liệu giao dịch' : 'No transaction data available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </TableCard>
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
                  {topEmployersByPosts.length > 0 ? topEmployersByPosts.map((employer, index) => (
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
                  )) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                        {language === 'vi' ? 'Chưa có dữ liệu đăng tin' : 'No job post data available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </TableCard>

          <TableCard>
            <ChartHeader>
              <h3>
                <Users />
                {language === 'vi' ? 'Thống Kê Tổng Quan' : 'Overview Statistics'}
              </h3>
            </ChartHeader>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#64748b' }}>{language === 'vi' ? 'Gói đang hoạt động' : 'Active Packages'}</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>{statsSummary.activeSubscriptions}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#64748b' }}>{language === 'vi' ? 'Yêu cầu chờ duyệt' : 'Pending Requests'}</span>
                <span style={{ fontWeight: 700, color: '#f59e0b' }}>{statsSummary.pendingSubscriptions}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#64748b' }}>{language === 'vi' ? 'Tỉ lệ tăng trưởng' : 'Growth Rate'}</span>
                <span style={{ fontWeight: 700, color: '#3b82f6' }}>{statsSummary.trends.revenue}</span>
              </div>
            </div>
          </TableCard>
        </ChartsGrid>
          </>
        )}

        {activeTab === 'history' && (
          <>
            <ServiceTable>
              <ServiceTableHeader>
                <Briefcase size={24} />
                {language === 'vi' ? 'Lịch sử mua gói - Công việc Tiêu chuẩn' : 'Purchase History - Standard Jobs'}
              </ServiceTableHeader>
              <ServiceTableContent>
                <ServiceTableGrid>
                  <thead>
                    <TableHeaderRow>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'STT' : 'No.'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Nhà tuyển dụng' : 'Employer'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Gói dịch vụ' : 'Package'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Giá' : 'Price'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Đơn vị' : 'Unit'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Ngày mua' : 'Purchase Date'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Trạng thái' : 'Status'}</TableHeaderCell>
                    </TableHeaderRow>
                  </thead>
                  <tbody>
                    {standardSubscriptions.length > 0 ? standardSubscriptions.map((purchase, index) => (
                      <TableRow key={purchase.subscriptionId || index}>
                        <TableCell $align="center" style={{ fontWeight: 600, color: '#6b7280' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>{purchase.companyName || purchase.employer || 'Unknown'}</TableCell>
                        <TableCell>{purchase.packageName}</TableCell>
                        <TableCell $align="center" style={{ fontWeight: 700, color: '#10b981' }}>
                          {(parseFloat(purchase.price) || 0).toLocaleString()}
                        </TableCell>
                        <TableCell $align="center" style={{ color: '#6b7280', fontSize: '13px' }}>VNĐ</TableCell>
                        <TableCell $align="center">
                          {purchase.purchaseDate || (purchase.purchaseDateTime ? parseDateTime(purchase.purchaseDateTime).toLocaleDateString('vi-VN') : (purchase.createdAt ? parseDateTime(purchase.createdAt).toLocaleDateString('vi-VN') : 'N/A'))}
                        </TableCell>
                        <TableCell $align="center">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                            {purchase.status === 'pending' && <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>{language === 'vi' ? 'Chưa kích hoạt' : 'Inactive'}</span>}
                            {purchase.status === 'active' && <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>{language === 'vi' ? 'Đã kích hoạt' : 'Active'}</span>}
                            {(purchase.status === 'expired' || purchase.status === 'expiring') && <span style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>{language === 'vi' ? 'Hết thời hạn' : 'Expired'}</span>}
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '15px' }}>{language === 'vi' ? 'chưa có' : 'no data available'}</td></tr>
                    )}
                  </tbody>
                </ServiceTableGrid>
              </ServiceTableContent>
            </ServiceTable>

            <ServiceTable>
              <ServiceTableHeader>
                <Zap size={24} />
                {language === 'vi' ? 'Lịch sử mua gói - Công việc Tuyển gấp' : 'Purchase History - Urgent Jobs'}
              </ServiceTableHeader>
              <ServiceTableContent>
                <ServiceTableGrid>
                  <thead>
                    <TableHeaderRow>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'STT' : 'No.'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Nhà tuyển dụng' : 'Employer'}</TableHeaderCell>
                      <TableHeaderCell>{language === 'vi' ? 'Gói dịch vụ' : 'Package'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Giá' : 'Price'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Đơn vị' : 'Unit'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Ngày mua' : 'Purchase Date'}</TableHeaderCell>
                      <TableHeaderCell $align="center">{language === 'vi' ? 'Trạng thái' : 'Status'}</TableHeaderCell>
                    </TableHeaderRow>
                  </thead>
                  <tbody>
                    {urgentSubscriptions.length > 0 ? urgentSubscriptions.map((purchase, index) => (
                      <TableRow key={purchase.subscriptionId || index}>
                        <TableCell $align="center" style={{ fontWeight: 600, color: '#6b7280' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>{purchase.companyName || purchase.employer || 'Unknown'}</TableCell>
                        <TableCell>{purchase.packageName}</TableCell>
                        <TableCell $align="center" style={{ fontWeight: 700, color: '#f59e0b' }}>
                          {(parseFloat(purchase.price) || 0).toLocaleString()}
                        </TableCell>
                        <TableCell $align="center" style={{ color: '#6b7280', fontSize: '13px' }}>VNĐ</TableCell>
                        <TableCell $align="center">
                          {purchase.purchaseDate || (purchase.purchaseDateTime ? parseDateTime(purchase.purchaseDateTime).toLocaleDateString('vi-VN') : (purchase.createdAt ? parseDateTime(purchase.createdAt).toLocaleDateString('vi-VN') : 'N/A'))}
                        </TableCell>
                        <TableCell $align="center">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                            {purchase.status === 'pending' && <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>{language === 'vi' ? 'Chưa kích hoạt' : 'Inactive'}</span>}
                            {purchase.status === 'active' && <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>{language === 'vi' ? 'Đã kích hoạt' : 'Active'}</span>}
                            {(purchase.status === 'expired' || purchase.status === 'expiring') && <span style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>{language === 'vi' ? 'Hết thời hạn' : 'Expired'}</span>}
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '15px' }}>{language === 'vi' ? 'chưa có' : 'no data available'}</td></tr>
                    )}
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
                {language === 'vi' ? 'Trạng thái các gói - Công việc Tiêu chuẩn' : 'Package Status - Standard Jobs'}
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
                    {standardSubscriptions.length > 0 ? standardSubscriptions.map((pkg, index) => (
                      <TableRow key={pkg.subscriptionId || index}>
                        <TableCell $align="center" style={{ fontWeight: 600, color: '#6b7280' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>{pkg.companyName || pkg.employer || 'Unknown'}</TableCell>
                        <TableCell>{pkg.packageName}</TableCell>
                        <TableCell $align="center">{pkg.purchaseDate || (pkg.purchaseDateTime ? parseDateTime(pkg.purchaseDateTime).toLocaleDateString('vi-VN') : (pkg.createdAt ? parseDateTime(pkg.createdAt).toLocaleDateString('vi-VN') : 'N/A'))}</TableCell>
                        <TableCell $align="center">{pkg.expiryDate || (pkg.expiryDateTime ? parseDateTime(pkg.expiryDateTime).toLocaleDateString('vi-VN') : (pkg.updatedAt ? new Date(parseDateTime(pkg.updatedAt).getTime() + (7 * 24 * 60 * 60 * 1000)).toLocaleDateString('vi-VN') : 'N/A'))}</TableCell>
                        <TableCell $align="center">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                            {pkg.status === 'pending' && <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>{language === 'vi' ? 'Chưa kích hoạt' : 'Inactive'}</span>}
                            {pkg.status === 'active' && <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>{language === 'vi' ? 'Đã kích hoạt' : 'Active'}</span>}
                            {(pkg.status === 'expired' || pkg.status === 'expiring') && <span style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>{language === 'vi' ? 'Hết thời hạn' : 'Expired'}</span>}
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '15px' }}>{language === 'vi' ? 'chưa có' : 'no data available'}</td></tr>
                    )}
                  </tbody>
                </ServiceTableGrid>
              </ServiceTableContent>
            </ServiceTable>

            <ServiceTable>
              <ServiceTableHeader>
                <Zap size={24} />
                {language === 'vi' ? 'Trạng thái các gói - Công việc Tuyển gấp' : 'Package Status - Urgent Jobs'}
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
                    {urgentSubscriptions.length > 0 ? urgentSubscriptions.map((pkg, index) => (
                      <TableRow key={pkg.subscriptionId || index}>
                        <TableCell $align="center" style={{ fontWeight: 600, color: '#6b7280' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>{pkg.companyName || pkg.employer || 'Unknown'}</TableCell>
                        <TableCell>{pkg.packageName}</TableCell>
                        <TableCell $align="center">{pkg.purchaseDate || (pkg.purchaseDateTime ? parseDateTime(pkg.purchaseDateTime).toLocaleDateString('vi-VN') : 'N/A')}</TableCell>
                        <TableCell $align="center">{pkg.expiryDate || (pkg.expiryDateTime ? parseDateTime(pkg.expiryDateTime).toLocaleDateString('vi-VN') : 'N/A')}</TableCell>
                        <TableCell $align="center">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                            {pkg.status === 'pending' && <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>{language === 'vi' ? 'Chưa kích hoạt' : 'Inactive'}</span>}
                            {pkg.status === 'active' && <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>{language === 'vi' ? 'Đã kích hoạt' : 'Active'}</span>}
                            {(pkg.status === 'expired' || pkg.status === 'expiring') && <span style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }}>{language === 'vi' ? 'Hết thời hạn' : 'Expired'}</span>}
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '15px' }}>{language === 'vi' ? 'chưa có' : 'no data available'}</td></tr>
                    )}
                  </tbody>
                </ServiceTableGrid>
              </ServiceTableContent>
            </ServiceTable>
          </>
        )}

        {activeTab === 'feedback' && (
          <ServiceTable>
            <ServiceTableHeader>
              <MessageSquare size={24} />
              {language === 'vi' ? 'Danh sách góp ý & Báo lỗi từ người dùng' : 'User Feedbacks & Bug Reports'}
            </ServiceTableHeader>
            <ServiceTableContent>
              <ServiceTableGrid style={{ minWidth: '1000px' }}>
                <thead>
                  <TableHeaderRow>
                    <TableHeaderCell $align="center" style={{ width: '60px' }}>{language === 'vi' ? 'STT' : 'No.'}</TableHeaderCell>
                    <TableHeaderCell style={{ width: '220px' }}>{language === 'vi' ? 'Người gửi' : 'Sender'}</TableHeaderCell>
                    <TableHeaderCell style={{ width: '120px' }}>{language === 'vi' ? 'Phân loại' : 'Category'}</TableHeaderCell>
                    <TableHeaderCell>{language === 'vi' ? 'Nội dung góp ý' : 'Feedback Content'}</TableHeaderCell>
                    <TableHeaderCell style={{ width: '180px' }}>{language === 'vi' ? 'Thời gian' : 'Time'}</TableHeaderCell>
                    <TableHeaderCell $align="center" style={{ width: '120px' }}>{language === 'vi' ? 'Trạng thái' : 'Status'}</TableHeaderCell>
                    <TableHeaderCell style={{ width: '180px' }}>{language === 'vi' ? 'Thao tác' : 'Actions'}</TableHeaderCell>
                  </TableHeaderRow>
                </thead>
                <tbody>
                  {filteredFeedbacks.length > 0 ? (
                    filteredFeedbacks.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell $align="center" style={{ fontWeight: 600, color: '#6b7280' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div style={{ fontWeight: 600 }}>{item.userName}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.userEmail}</div>
                            <div style={{ marginTop: '4px' }}>
                              <span style={{
                                fontSize: '11px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 600,
                                background: item.userRole === 'employer' ? '#f3e8ff' : item.userRole === 'candidate' ? '#dbeafe' : '#f3f4f6',
                                color: item.userRole === 'employer' ? '#6b21a8' : item.userRole === 'candidate' ? '#1e40af' : '#4b5563',
                              }}>
                                {item.userRole === 'employer' ? (language === 'vi' ? 'Nhà tuyển dụng' : 'Employer') :
                                 item.userRole === 'candidate' ? (language === 'vi' ? 'Ứng viên' : 'Candidate') :
                                 (language === 'vi' ? 'Khách' : 'Guest')}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: item.category === 'bug' ? '#fee2e2' : item.category === 'suggestion' ? '#e0f2fe' : '#f3f4f6',
                            color: item.category === 'bug' ? '#dc2626' : item.category === 'suggestion' ? '#0369a1' : '#4b5563',
                          }}>
                            {item.category === 'bug' ? (language === 'vi' ? 'Báo lỗi' : 'Bug') :
                             item.category === 'suggestion' ? (language === 'vi' ? 'Góp ý' : 'Suggestion') :
                             (language === 'vi' ? 'Ý kiến khác' : 'Other')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div style={{ maxWidth: '400px', whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.4' }}>
                            {item.comment}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontSize: '13px', color: '#4b5563' }}>
                            {parseDateTime(item.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </div>
                        </TableCell>
                        <TableCell $align="center">
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: item.status === 'unread' ? '#fef3c7' : '#d1fae5',
                            color: item.status === 'unread' ? '#d97706' : '#059669',
                          }}>
                            {item.status === 'unread' ? (language === 'vi' ? 'Chưa đọc' : 'Unread') : (language === 'vi' ? 'Đã đọc' : 'Read')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {item.status === 'unread' && (
                              <ActionButtonSmall 
                                $variant="primary" 
                                onClick={() => handleMarkAsRead(item.id)}
                                title={language === 'vi' ? 'Đánh dấu đã đọc' : 'Mark as read'}
                              >
                                <CheckCircle size={14} />
                                {language === 'vi' ? 'Đọc' : 'Read'}
                              </ActionButtonSmall>
                            )}
                            <ActionButtonSmall 
                              onClick={() => handleDeleteFeedback(item.id)}
                              style={{ background: '#fee2e2', color: '#dc2626' }}
                              title={language === 'vi' ? 'Xóa góp ý' : 'Delete feedback'}
                            >
                              <Trash2 size={14} />
                              {language === 'vi' ? 'Xóa' : 'Delete'}
                            </ActionButtonSmall>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748b', fontSize: '15px' }}>
                        {language === 'vi' ? 'Không tìm thấy ý kiến góp ý nào phù hợp.' : 'No matching feedbacks found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </ServiceTableGrid>
            </ServiceTableContent>
          </ServiceTable>
        )}
      </PageContainer>
    </DashboardLayout>
  );
};

export default Reports;
