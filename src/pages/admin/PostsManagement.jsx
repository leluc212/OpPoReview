import { useState, useMemo } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import TableFilter from '../../components/TableFilter';
import Modal from '../../components/Modal';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Briefcase, 
  Zap, 
  Calendar, 
  Users, 
  FileText,
  Eye,
  CheckCircle,
  Ban,
  Trash2,
  Clock,
  AlertTriangle,
  XCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Mail,
  Phone,
  Building2,
  User
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

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textLight};
  font-weight: ${props => props.$active ? '600' : '500'};
  font-size: 15px;
  cursor: pointer;
  border-bottom: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  margin-bottom: -2px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.bgDark};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
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
  height: 250px;
  gap: 12px;
  padding: 20px 0;
`;

const Bar = styled.div`
  flex: 1;
  background: ${props => props.$color};
  border-radius: ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0 0;
  height: ${props => props.$height}%;
  min-height: 20px;
  position: relative;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-5px);
  }
`;

const BarLabel = styled.div`
  position: absolute;
  bottom: -30px;
  font-size: 12px;
  color: ${props => props.theme.colors.textLight};
  text-align: center;
  width: 100%;
  font-weight: 500;
`;

const BarValue = styled.div`
  position: absolute;
  top: -25px;
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const PieChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const PieChartSVG = styled.svg`
  width: 200px;
  height: 200px;
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
  padding: 8px 12px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: ${props => props.$color};
  margin-right: 8px;
`;

const LegendLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const LegendValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const IconButton = styled.button`
  padding: 8px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$variant === 'danger' ? '#fee2e2' : props.$variant === 'success' ? '#dcfce7' : '#e0e7ff'};
  color: ${props => props.$variant === 'danger' ? '#dc2626' : props.$variant === 'success' ? '#15803d' : '#4338ca'};
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

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.$status === 'approved') return '#dcfce7';
    if (props.$status === 'rejected') return '#fee2e2';
    if (props.$status === 'warning') return '#fef3c7';
    if (props.$status === 'pending') return '#e0e7ff';
    return '#f3f4f6';
  }};
  color: ${props => {
    if (props.$status === 'approved') return '#15803d';
    if (props.$status === 'rejected') return '#dc2626';
    if (props.$status === 'warning') return '#ca8a04';
    if (props.$status === 'pending') return '#4338ca';
    return '#6b7280';
  }};
`;

const DateText = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  display: block;
`;

const DetailModal = styled.div`
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
`;

const DetailSection = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  label {
    display: block;
    font-size: 12px;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 4px;
    font-weight: 600;
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    font-weight: 500;
  }
`;

const CandidateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CandidateCard = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CandidateInfo = styled.div`
  h4 {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 2px;
  }
`;

const CandidateDate = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CandidateStatus = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PostsManagement = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('longterm');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Dữ liệu việc làm part-time lâu dài
  const [longtermJobs] = useState([
    {
      id: 1,
      title: 'Nhân viên phục vụ',
      employer: 'Katinat chi nhánh quận 8',
      employerEmail: 'hr@katinat.vn',
      employerPhone: '0901234567',
      postDate: '2026-01-15',
      endDate: '2026-06-15',
      applications: 45,
      cvSent: 38,
      status: 'approved',
      candidates: [
        { name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0912345678', appliedDate: '2026-01-16', status: 'pending' },
        { name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0923456789', appliedDate: '2026-01-17', status: 'approved' },
        { name: 'Lê Văn C', email: 'levanc@example.com', phone: '0934567890', appliedDate: '2026-01-18', status: 'rejected' },
      ]
    },
    {
      id: 2,
      title: 'Nhân viên chạy bàn',
      employer: 'The Coffee House chi nhánh Bình Thạnh',
      employerEmail: 'recruit@thecoffeehouse.vn',
      employerPhone: '0902345678',
      postDate: '2026-01-20',
      endDate: '2026-12-31',
      applications: 67,
      cvSent: 52,
      status: 'pending',
      candidates: [
        { name: 'Phạm Thị D', email: 'phamthid@example.com', phone: '0945678901', appliedDate: '2026-01-21', status: 'pending' },
        { name: 'Hoàng Văn E', email: 'hoangvane@example.com', phone: '0956789012', appliedDate: '2026-01-22', status: 'pending' },
      ]
    },
    {
      id: 3,
      title: 'Nhân viên phục vụ',
      employer: 'D coffee',
      employerEmail: 'hr@dcoffee.vn',
      employerPhone: '0903456789',
      postDate: '2026-02-01',
      endDate: '2026-08-01',
      applications: 89,
      cvSent: 71,
      status: 'approved',
      candidates: [
        { name: 'Vũ Thị F', email: 'vuthif@example.com', phone: '0967890123', appliedDate: '2026-02-02', status: 'approved' },
        { name: 'Đỗ Văn G', email: 'dovang@example.com', phone: '0978901234', appliedDate: '2026-02-03', status: 'approved' },
        { name: 'Bùi Thị H', email: 'buithih@example.com', phone: '0989012345', appliedDate: '2026-02-04', status: 'pending' },
      ]
    },
    {
      id: 4,
      title: 'Nhân viên chạy bàn',
      employer: 'Quán lẩu 88',
      employerEmail: 'contact@lau88.vn',
      employerPhone: '0904567890',
      postDate: '2026-01-10',
      endDate: '2026-07-10',
      applications: 34,
      cvSent: 28,
      status: 'warning',
      candidates: [
        { name: 'Ngô Văn I', email: 'ngovani@example.com', phone: '0990123456', appliedDate: '2026-01-11', status: 'pending' },
      ]
    },
    {
      id: 5,
      title: 'Nhân viên vận chuyển kho',
      employer: 'Nhà hàng cưới Victory',
      employerEmail: 'hr@victory.vn',
      employerPhone: '0905678901',
      postDate: '2026-01-25',
      endDate: '2026-05-25',
      applications: 23,
      cvSent: 19,
      status: 'rejected',
      candidates: [
        { name: 'Đinh Thị K', email: 'dinhthik@example.com', phone: '0901234567', appliedDate: '2026-01-26', status: 'rejected' },
      ]
    },
  ]);

  // Dữ liệu việc làm part-time gấp
  const [urgentJobs] = useState([
    {
      id: 6,
      title: 'Nhân viên phục vụ',
      employer: 'Highlands Coffee chi nhánh quận 1',
      employerEmail: 'hr@highlandscoffee.vn',
      employerPhone: '0906789012',
      postDate: '2026-02-10',
      endDate: '2026-02-15',
      applications: 156,
      cvSent: 98,
      status: 'approved',
      candidates: [
        { name: 'Trương Văn L', email: 'truongvanl@example.com', phone: '0912345678', appliedDate: '2026-02-10', status: 'approved' },
        { name: 'Lý Thị M', email: 'lythim@example.com', phone: '0923456789', appliedDate: '2026-02-10', status: 'approved' },
        { name: 'Mai Văn N', email: 'maivann@example.com', phone: '0934567890', appliedDate: '2026-02-11', status: 'pending' },
      ]
    },
    {
      id: 7,
      title: 'Nhân viên vận chuyển kho',
      employer: 'Phúc Long chi nhánh quận 3',
      employerEmail: 'recruit@phuclong.vn',
      employerPhone: '0907890123',
      postDate: '2026-02-12',
      endDate: '2026-02-14',
      applications: 78,
      cvSent: 65,
      status: 'pending',
      candidates: [
        { name: 'Cao Văn O', email: 'caovano@example.com', phone: '0945678901', appliedDate: '2026-02-12', status: 'pending' },
        { name: 'Tô Thị P', email: 'tothip@example.com', phone: '0956789012', appliedDate: '2026-02-12', status: 'pending' },
      ]
    },
    {
      id: 8,
      title: 'Nhân viên phục vụ',
      employer: 'Quán nhậu Hải Sản 88',
      employerEmail: 'hr@haisan88.vn',
      employerPhone: '0908901234',
      postDate: '2026-02-11',
      endDate: '2026-02-13',
      applications: 234,
      cvSent: 187,
      status: 'approved',
      candidates: [
        { name: 'Hồ Văn Q', email: 'hovanq@example.com', phone: '0967890123', appliedDate: '2026-02-11', status: 'approved' },
        { name: 'Dương Thị R', email: 'duongthir@example.com', phone: '0978901234', appliedDate: '2026-02-11', status: 'approved' },
        { name: 'Lâm Văn S', email: 'lamvans@example.com', phone: '0989012345', appliedDate: '2026-02-11', status: 'approved' },
        { name: 'Võ Thị T', email: 'vothit@example.com', phone: '0990123456', appliedDate: '2026-02-12', status: 'pending' },
      ]
    },
    {
      id: 9,
      title: 'Nhân viên chạy bàn',
      employer: 'Quán lẩu Hồng Kông',
      employerEmail: 'contact@lauhongkong.vn',
      employerPhone: '0909012345',
      postDate: '2026-02-09',
      endDate: '2026-02-12',
      applications: 145,
      cvSent: 112,
      status: 'warning',
      candidates: [
        { name: 'Phan Văn U', email: 'phanvanu@example.com', phone: '0901234567', appliedDate: '2026-02-09', status: 'pending' },
        { name: 'Đặng Thị V', email: 'dangthiv@example.com', phone: '0912345678', appliedDate: '2026-02-09', status: 'approved' },
      ]
    },
    {
      id: 10,
      title: 'Nhân viên phục vụ',
      employer: 'Starbucks chi nhánh quận 7',
      employerEmail: 'hr@starbucks.vn',
      employerPhone: '0910123456',
      postDate: '2026-02-08',
      endDate: '2026-02-11',
      applications: 56,
      cvSent: 43,
      status: 'rejected',
      candidates: [
        { name: 'Tạ Văn W', email: 'tavanw@example.com', phone: '0923456789', appliedDate: '2026-02-08', status: 'rejected' },
      ]
    },
  ]);

  const currentJobs = activeTab === 'longterm' ? longtermJobs : urgentJobs;

  const getStatusText = (status) => {
    if (status === 'approved') return language === 'vi' ? 'Đã duyệt' : 'Approved';
    if (status === 'rejected') return language === 'vi' ? 'Đã từ chối' : 'Rejected';
    if (status === 'warning') return language === 'vi' ? 'Bị cảnh báo' : 'Warning';
    if (status === 'pending') return language === 'vi' ? 'Chờ duyệt' : 'Pending';
    return status;
  };

  const filterOptions = [
    { value: 'approved', label: language === 'vi' ? 'Đã duyệt' : 'Approved' },
    { value: 'pending', label: language === 'vi' ? 'Chờ duyệt' : 'Pending' },
    { value: 'warning', label: language === 'vi' ? 'Bị cảnh báo' : 'Warning' },
    { value: 'rejected', label: language === 'vi' ? 'Đã từ chối' : 'Rejected' },
  ];

  const filteredJobs = useMemo(() => {
    return currentJobs.filter(job => {
      const matchesSearch = searchTerm === '' || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.employer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = filters.length === 0 || filters.includes(job.status);
      
      return matchesSearch && matchesFilters;
    });
  }, [currentJobs, searchTerm, filters]);

  const handleFilterToggle = (filterValue) => {
    setFilters(prev => 
      prev.includes(filterValue) 
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowDetailModal(true);
  };

  const getCandidateStatusText = (status) => {
    if (status === 'approved') return language === 'vi' ? 'Đã duyệt' : 'Approved';
    if (status === 'rejected') return language === 'vi' ? 'Đã từ chối' : 'Rejected';
    if (status === 'pending') return language === 'vi' ? 'Chờ duyệt' : 'Pending';
    return status;
  };

  const stats = {
    total: currentJobs.length,
    approved: currentJobs.filter(j => j.status === 'approved').length,
    pending: currentJobs.filter(j => j.status === 'pending').length,
    warning: currentJobs.filter(j => j.status === 'warning').length,
    rejected: currentJobs.filter(j => j.status === 'rejected').length,
  };

  const totalApplications = currentJobs.reduce((sum, job) => sum + job.applications, 0);
  const totalCVSent = currentJobs.reduce((sum, job) => sum + job.cvSent, 0);

  // Dữ liệu cho biểu đồ cột
  const barChartData = currentJobs.slice(0, 5).map(job => ({
    label: job.title.length > 15 ? job.title.substring(0, 15) + '...' : job.title,
    applications: job.applications,
    cvSent: job.cvSent
  }));

  const maxValue = Math.max(...barChartData.flatMap(d => [d.applications, d.cvSent]));

  // Dữ liệu cho biểu đồ tròn
  const pieData = [
    { label: language === 'vi' ? 'Đã duyệt' : 'Approved', value: stats.approved, color: '#10b981' },
    { label: language === 'vi' ? 'Chờ duyệt' : 'Pending', value: stats.pending, color: '#4338ca' },
    { label: language === 'vi' ? 'Bị cảnh báo' : 'Warning', value: stats.warning, color: '#f59e0b' },
    { label: language === 'vi' ? 'Đã từ chối' : 'Rejected', value: stats.rejected, color: '#ef4444' },
  ];

  const total = pieData.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const pieSlices = pieData.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const x1 = 100 + 80 * Math.cos((Math.PI * startAngle) / 180);
    const y1 = 100 + 80 * Math.sin((Math.PI * startAngle) / 180);
    const x2 = 100 + 80 * Math.cos((Math.PI * (startAngle + angle)) / 180);
    const y2 = 100 + 80 * Math.sin((Math.PI * (startAngle + angle)) / 180);
    const largeArc = angle > 180 ? 1 : 0;

    return {
      ...item,
      path: `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`,
      percentage: percentage.toFixed(1)
    };
  });

  return (
    <DashboardLayout role="admin" key={language}>
      <PageContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Quản Lý Bài Đăng' : 'Posts Management'}</h1>
          <p>{language === 'vi' ? 'Quản lý việc làm part-time lâu dài và gấp' : 'Manage long-term and urgent part-time jobs'}</p>
        </PageHeader>

        <TabContainer>
          <Tab 
            $active={activeTab === 'longterm'} 
            onClick={() => {
              setActiveTab('longterm');
              setSearchTerm('');
              setFilters([]);
            }}
          >
            <Briefcase />
            {language === 'vi' ? 'Part-time Lâu Dài' : 'Long-term Part-time'}
            <span style={{ 
              marginLeft: '4px', 
              padding: '2px 8px', 
              background: activeTab === 'longterm' ? '#1e40af' : '#64748b',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {longtermJobs.length}
            </span>
          </Tab>
          <Tab 
            $active={activeTab === 'urgent'} 
            onClick={() => {
              setActiveTab('urgent');
              setSearchTerm('');
              setFilters([]);
            }}
          >
            <Zap />
            {language === 'vi' ? 'Part-time Gấp' : 'Urgent Part-time'}
            <span style={{ 
              marginLeft: '4px', 
              padding: '2px 8px', 
              background: activeTab === 'urgent' ? '#1e40af' : '#64748b',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {urgentJobs.length}
            </span>
          </Tab>
        </TabContainer>

        <StatsRow>
          <StatBox $color="#1e40af">
            <h3>{language === 'vi' ? 'Tổng bài đăng' : 'Total Posts'}</h3>
            <p>{stats.total}</p>
          </StatBox>
          <StatBox $color="#10b981">
            <h3>{language === 'vi' ? 'Đã duyệt' : 'Approved'}</h3>
            <p>{stats.approved}</p>
          </StatBox>
          <StatBox $color="#4338ca">
            <h3>{language === 'vi' ? 'Chờ duyệt' : 'Pending'}</h3>
            <p>{stats.pending}</p>
          </StatBox>
          <StatBox $color="#f59e0b">
            <h3>{language === 'vi' ? 'Bị cảnh báo' : 'Warning'}</h3>
            <p>{stats.warning}</p>
          </StatBox>
          <StatBox $color="#ef4444">
            <h3>{language === 'vi' ? 'Đã từ chối' : 'Rejected'}</h3>
            <p>{stats.rejected}</p>
          </StatBox>
        </StatsRow>

        <ChartsContainer>
          <ChartCard>
            <ChartTitle>
              <BarChart3 size={20} />
              {language === 'vi' ? 'Biểu Đồ Ứng Tuyển & CV' : 'Applications & CV Chart'}
            </ChartTitle>
            <BarChartContainer>
              {barChartData.map((data, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '100%' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '100%', width: '100%', justifyContent: 'center' }}>
                    <Bar $height={(data.applications / maxValue) * 100} $color="#1e40af" title={`${language === 'vi' ? 'Ứng tuyển' : 'Applications'}: ${data.applications}`}>
                      <BarValue>{data.applications}</BarValue>
                    </Bar>
                    <Bar $height={(data.cvSent / maxValue) * 100} $color="#10b981" title={`CV ${language === 'vi' ? 'đã gửi' : 'sent'}: ${data.cvSent}`}>
                      <BarValue>{data.cvSent}</BarValue>
                    </Bar>
                  </div>
                  <BarLabel>{data.label}</BarLabel>
                </div>
              ))}
            </BarChartContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', background: '#1e40af', borderRadius: '4px' }}></div>
                <span style={{ fontSize: '14px' }}>{language === 'vi' ? 'Ứng tuyển' : 'Applications'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', background: '#10b981', borderRadius: '4px' }}></div>
                <span style={{ fontSize: '14px' }}>{language === 'vi' ? 'CV đã gửi' : 'CV Sent'}</span>
              </div>
            </div>
          </ChartCard>

          <ChartCard>
            <ChartTitle>
              <PieChartIcon size={20} />
              {language === 'vi' ? 'Phân Bố Trạng Thái' : 'Status Distribution'}
            </ChartTitle>
            <PieChartContainer>
              <PieChartSVG viewBox="0 0 200 200">
                {pieSlices.map((slice, index) => (
                  <path
                    key={index}
                    d={slice.path}
                    fill={slice.color}
                    stroke="white"
                    strokeWidth="2"
                  />
                ))}
              </PieChartSVG>
              <PieLegend>
                {pieData.map((item, index) => (
                  <LegendItem key={index}>
                    <LegendLabel>
                      <LegendColor $color={item.color} />
                      {item.label}
                    </LegendLabel>
                    <LegendValue>{item.value} ({pieSlices[index].percentage}%)</LegendValue>
                  </LegendItem>
                ))}
              </PieLegend>
            </PieChartContainer>
          </ChartCard>
        </ChartsContainer>

        <TableFilter 
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={filterOptions}
          activeFilters={filters}
          onFilterToggle={handleFilterToggle}
          searchPlaceholder={language === 'vi' ? 'Tìm kiếm bài đăng...' : 'Search posts...'}
        />

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>{language === 'vi' ? 'Tiêu đề' : 'Title'}</th>
                <th>{language === 'vi' ? 'Nhà tuyển dụng' : 'Employer'}</th>
                <th>{language === 'vi' ? 'Ngày đăng' : 'Post Date'}</th>
                <th>{language === 'vi' ? 'Ngày kết thúc' : 'End Date'}</th>
                <th>{language === 'vi' ? 'Ứng tuyển' : 'Applications'}</th>
                <th>{language === 'vi' ? 'CV đã gửi' : 'CV Sent'}</th>
                <th>{language === 'vi' ? 'Trạng thái' : 'Status'}</th>
                <th>{language === 'vi' ? 'Thao tác' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 600 }}>{job.title}</td>
                  <td>{job.employer}</td>
                  <td>
                    <DateText>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      {job.postDate}
                    </DateText>
                  </td>
                  <td>
                    <DateText>
                      <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      {job.endDate}
                    </DateText>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} />
                      <strong>{job.applications}</strong>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={14} />
                      <strong>{job.cvSent}</strong>
                    </div>
                  </td>
                  <td>
                    <StatusBadge $status={job.status}>
                      {getStatusText(job.status)}
                    </StatusBadge>
                  </td>
                  <td>
                    <ActionButtons>
                      <IconButton 
                        onClick={() => handleViewDetails(job)}
                        title={language === 'vi' ? 'Xem chi tiết' : 'View details'}
                      >
                        <Eye size={16} />
                      </IconButton>
                      {job.status === 'pending' && (
                        <>
                          <IconButton $variant="success" title={language === 'vi' ? 'Phê duyệt' : 'Approve'}>
                            <CheckCircle size={16} />
                          </IconButton>
                          <IconButton $variant="danger" title={language === 'vi' ? 'Từ chối' : 'Reject'}>
                            <Ban size={16} />
                          </IconButton>
                        </>
                      )}
                      {job.status === 'warning' && (
                        <IconButton $variant="danger" title={language === 'vi' ? 'Cảnh báo' : 'Warning'}>
                          <AlertTriangle size={16} />
                        </IconButton>
                      )}
                      <IconButton $variant="danger" title={language === 'vi' ? 'Xóa' : 'Delete'}>
                        <Trash2 size={16} />
                      </IconButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        {showDetailModal && selectedJob && (
          <Modal
            isOpen={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            title={language === 'vi' ? 'Chi Tiết Bài Đăng' : 'Post Details'}
          >
            <DetailModal>
              <DetailSection>
                <SectionTitle>
                  <Briefcase size={20} />
                  {language === 'vi' ? 'Thông Tin Công Việc' : 'Job Information'}
                </SectionTitle>
                <InfoGrid>
                  <InfoItem style={{ gridColumn: '1 / -1' }}>
                    <label>{language === 'vi' ? 'Tiêu đề' : 'Title'}</label>
                    <p style={{ fontSize: '16px', fontWeight: '600' }}>{selectedJob.title}</p>
                  </InfoItem>
                  <InfoItem>
                    <label>{language === 'vi' ? 'Ngày đăng' : 'Post Date'}</label>
                    <p>{selectedJob.postDate}</p>
                  </InfoItem>
                  <InfoItem>
                    <label>{language === 'vi' ? 'Ngày kết thúc' : 'End Date'}</label>
                    <p>{selectedJob.endDate}</p>
                  </InfoItem>
                  <InfoItem>
                    <label>{language === 'vi' ? 'Số lượng ứng tuyển' : 'Applications'}</label>
                    <p>{selectedJob.applications}</p>
                  </InfoItem>
                  <InfoItem>
                    <label>{language === 'vi' ? 'CV đã gửi' : 'CV Sent'}</label>
                    <p>{selectedJob.cvSent}</p>
                  </InfoItem>
                  <InfoItem>
                    <label>{language === 'vi' ? 'Trạng thái' : 'Status'}</label>
                    <StatusBadge $status={selectedJob.status}>
                      {getStatusText(selectedJob.status)}
                    </StatusBadge>
                  </InfoItem>
                </InfoGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>
                  <Building2 size={20} />
                  {language === 'vi' ? 'Thông Tin Nhà Tuyển Dụng' : 'Employer Information'}
                </SectionTitle>
                <InfoGrid>
                  <InfoItem style={{ gridColumn: '1 / -1' }}>
                    <label>{language === 'vi' ? 'Tên công ty' : 'Company Name'}</label>
                    <p style={{ fontSize: '15px', fontWeight: '600' }}>{selectedJob.employer}</p>
                  </InfoItem>
                  <InfoItem>
                    <label>Email</label>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={14} />
                      {selectedJob.employerEmail}
                    </p>
                  </InfoItem>
                  <InfoItem>
                    <label>{language === 'vi' ? 'Số điện thoại' : 'Phone'}</label>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} />
                      {selectedJob.employerPhone}
                    </p>
                  </InfoItem>
                </InfoGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>
                  <Users size={20} />
                  {language === 'vi' ? 'Danh Sách Ứng Viên' : 'Candidates List'}
                  <span style={{ 
                    marginLeft: '8px', 
                    padding: '2px 10px', 
                    background: '#1e40af',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {selectedJob.candidates?.length || 0}
                  </span>
                </SectionTitle>
                <CandidateList>
                  {selectedJob.candidates && selectedJob.candidates.length > 0 ? (
                    selectedJob.candidates.map((candidate, index) => (
                      <CandidateCard key={index}>
                        <CandidateInfo>
                          <h4>
                            <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            {candidate.name}
                          </h4>
                          <p>
                            <Mail size={12} />
                            {candidate.email}
                          </p>
                          <p>
                            <Phone size={12} />
                            {candidate.phone}
                          </p>
                        </CandidateInfo>
                        <CandidateDate>
                          <Calendar size={14} />
                          {candidate.appliedDate}
                        </CandidateDate>
                        <CandidateStatus>
                          <StatusBadge $status={candidate.status}>
                            {getCandidateStatusText(candidate.status)}
                          </StatusBadge>
                        </CandidateStatus>
                      </CandidateCard>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                      {language === 'vi' ? 'Chưa có ứng viên nào' : 'No candidates yet'}
                    </p>
                  )}
                </CandidateList>
              </DetailSection>
            </DetailModal>
          </Modal>
        )}
      </PageContainer>
    </DashboardLayout>
  );
};

export default PostsManagement;


