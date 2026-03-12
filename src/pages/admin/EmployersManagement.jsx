import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Building2, 
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Shield,
  XSquare,
  Calendar,
  Eye,
  Trash2,
  Briefcase,
  TrendingUp,
  Zap,
  Target,
  Flame,
  Star
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  
  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    gap: 8px;
  }
`;

const FilterButton = styled.button`
  padding: 10px 16px;
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgDark};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
    flex: 1;
    justify-content: center;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
  
  svg {
    width: 16px;
    height: 16px;
    
    @media (max-width: 768px) {
      width: 14px;
      height: 14px;
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

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.$status === 'success') return '#dcfce7';
    if (props.$status === 'danger') return '#fee2e2';
    return '#fef3c7';
  }};
  color: ${props => {
    if (props.$status === 'success') return '#15803d';
    if (props.$status === 'danger') return '#dc2626';
    return '#ca8a04';
  }};
`;

const DateText = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 10px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${props => {
    if (props.$variant === 'view') return '#3b82f6';
    if (props.$variant === 'delete') return '#ef4444';
    return '#6b7280';
  }};
  color: white;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const OverviewSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$color || props.theme.colors.primary};
  }
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
`;

const UrgentJobsBox = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 16px;
`;

const UrgentJobsTitle = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #92400e;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UrgentJobsSubtitle = styled.div`
  font-size: 14px;
  color: #78350f;
  font-weight: 600;
`;

const BoostGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const BoostItem = styled.div`
  background: ${props => props.$bgColor || '#f3f4f6'};
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const BoostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BoostIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$color || '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
`;

const BoostLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const BoostValue = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
`;

const ChartContainer = styled.div`
  height: 280px;
  margin-top: 20px;
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
  font-weight: 600;
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

const ActivityTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

const ActivityRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 16px;
  padding: 14px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.md};
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.border};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityUser = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const ActivityAction = styled.div`
  color: ${props => props.theme.colors.textLight};
  font-size: 13px;
`;

const ActivityTime = styled.div`
  color: ${props => props.theme.colors.textLight};
  font-size: 12px;
  text-align: right;
  
  @media (max-width: 768px) {
    text-align: left;
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

const EmployersManagement = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Sample data
  const employers = [
    { id: 1, name: 'Lẩu Bò Sài Gòn Vi Vu', type: 'Quán ăn/Nhậu', email: 'vuvu.hr@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-01-15', confirmDate: '2026-01-20' },
    { id: 2, name: 'Ốc Đêm 79', type: 'Quán nhậu', email: 'ocdem79.tuyendung@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-01-16', confirmDate: '2026-01-21' },
    { id: 3, name: 'Tiệm Trà Tháng Tư', type: 'Café/Trà sữa', email: 'tiemtrathang4.hr@gmail.com', verified: false, approvalStatus: 'pending', joined: '2026-01-17', confirmDate: null },
    { id: 4, name: 'Bia Sệt 123', type: 'Quán nhậu', email: 'biaset123.info@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-01-18', confirmDate: '2026-01-23' },
    { id: 5, name: 'Bếp Nhà Mẹ Nấu', type: 'Cơm niêu/Gia đình', email: 'bepnhamenau.hr@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-01-19', confirmDate: '2026-01-24' },
    { id: 6, name: 'Chill Out Beer Club', type: 'Pub/Nhậu', email: 'chillout.beer@gmail.com', verified: false, approvalStatus: 'pending', joined: '2026-01-20', confirmDate: null },
    { id: 7, name: 'Phở Gia Truyền 1954', type: 'Nhà hàng nhỏ', email: 'phogiatruyen.hr@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-01-21', confirmDate: '2026-01-26' },
    { id: 8, name: 'Sushi Sen Mini', type: 'Nhật Bản', email: 'sushisen.recruitment@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-01-22', confirmDate: '2026-01-27' },
    { id: 9, name: 'High Tea & Coffee', type: 'Café', email: 'hightea.coffee@gmail.com', verified: false, approvalStatus: 'rejected', joined: '2026-01-23', confirmDate: '2026-01-28' },
    { id: 10, name: 'Gà Nướng Ò Ó O', type: 'Quán ăn', email: 'ooo.ganuong@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-01-24', confirmDate: '2026-01-29' },
    { id: 11, name: 'Nướng Ngói Gia Bảo', type: 'Quán nhậu', email: 'nuongngoigiabao@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-01-25', confirmDate: '2026-01-30' },
    { id: 12, name: 'The Morning Bakery', type: 'Tiệm bánh', email: 'morningbakery.hr@gmail.com', verified: false, approvalStatus: 'pending', joined: '2026-01-26', confirmDate: null },
    { id: 13, name: 'Lẩu Phan', type: 'Nhà hàng lẩu', email: 'lauphan.tuyendung@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-01-27', confirmDate: '2026-02-01' },
    { id: 14, name: 'Beer Garden Phố', type: 'Quán nhậu', email: 'beergardenpho@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-01-28', confirmDate: '2026-02-02' },
    { id: 15, name: 'Mì Cay Sasin', type: 'Quán ăn', email: 'sasin.hr@gmail.com', verified: false, approvalStatus: 'pending', joined: '2026-01-29', confirmDate: null },
    { id: 16, name: 'Cà Phê Cây Me', type: 'Café sân vườn', email: 'caphecayme@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-01-30', confirmDate: '2026-02-04' },
    { id: 17, name: 'Nhà Hàng Chay Sen Vàng', type: 'Nhà hàng nhỏ', email: 'senvang.chay@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-01-31', confirmDate: '2026-02-05' },
    { id: 18, name: 'Xiên Khè', type: 'Quán nhậu', email: 'xienkhe.tuyendung@gmail.com', verified: false, approvalStatus: 'rejected', joined: '2026-02-01', confirmDate: '2026-02-06' },
    { id: 19, name: 'Dimsum House', type: 'Quán ăn', email: 'dimsumhouse.hr@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-02-02', confirmDate: '2026-02-07' },
    { id: 20, name: 'Bánh Mì PewPew', type: 'Thức ăn nhanh', email: 'banhmipewpew.info@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-02-03', confirmDate: '2026-02-08' },
    { id: 21, name: 'Urban Coffee', type: 'Café', email: 'urbancoffee.rec@gmail.com', verified: false, approvalStatus: 'pending', joined: '2026-02-04', confirmDate: null },
    { id: 22, name: 'Lẩu Cá Kèo Bà Huyện', type: 'Quán nhậu', email: 'laucakeobahuyen@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-02-05', confirmDate: '2026-02-10' },
    { id: 23, name: 'Hủ Tiếu Nam Vang Thành Đạt', type: 'Quán ăn', email: 'thanhtdat.hutieu@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-02-06', confirmDate: '2026-02-11' },
    { id: 24, name: 'Draft Beer Sài Gòn', type: 'Quán nhậu', email: 'draftbeer.sg@gmail.com', verified: false, approvalStatus: 'pending', joined: '2026-02-07', confirmDate: null },
    { id: 25, name: 'Gòng Tea', type: 'Trà sữa', email: 'gongtea.tuyendung@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-02-08', confirmDate: '2026-02-13' },
    { id: 26, name: 'Cơm Tấm Cali', type: 'Hệ thống nhỏ', email: 'comtamcali.hr@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-02-09', confirmDate: '2026-02-14' },
    { id: 27, name: 'Warning Zone', type: 'Quán nhậu', email: 'warningzone.recruitment@gmail.com', verified: false, approvalStatus: 'rejected', joined: '2026-02-10', confirmDate: '2026-02-15' },
    { id: 28, name: 'Trà Chanh Bụi Phố', type: 'Đồ uống', email: 'buipho.trachanh@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-02-11', confirmDate: '2026-02-16' },
    { id: 29, name: 'Quán Nướng Ngói Sapa', type: 'Quán ăn', email: 'nuongngoisapa@gmail.com', verified: true, approvalStatus: 'approved', joined: '2026-02-12', confirmDate: '2026-02-17' },
    { id: 30, name: 'Blue Star Cocktail Bar', type: 'Bar/Pub nhỏ', email: 'bluestar.bar@gmail.com', verified: false, approvalStatus: 'pending', joined: '2026-02-13', confirmDate: null },
  ];

  const getApprovalStatusText = (status) => {
    if (status === 'approved') return language === 'vi' ? 'Đã duyệt' : 'Approved';
    if (status === 'rejected') return language === 'vi' ? 'Không duyệt' : 'Rejected';
    if (status === 'pending') return language === 'vi' ? 'Chờ duyệt' : 'Pending';
    return status;
  };

  const getApprovalStatusVariant = (status) => {
    if (status === 'approved') return 'success';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || employer.approvalStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployers = filteredEmployers.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const stats = {
    total: filteredEmployers.length,
    approved: filteredEmployers.filter(e => e.approvalStatus === 'approved').length,
    pending: filteredEmployers.filter(e => e.approvalStatus === 'pending').length,
    rejected: filteredEmployers.filter(e => e.approvalStatus === 'rejected').length,
  };

  return (
    <DashboardLayout role="admin" key={language}>
      <PageContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Quản Lý Nhà Tuyển Dụng' : 'Employers Management'}</h1>
          <p>{language === 'vi' ? 'Quản lý thông tin và trạng thái của tất cả nhà tuyển dụng' : 'Manage information and status of all employers'}</p>
        </PageHeader>

        <StatsGrid>
          <StatsCard
            title={language === 'vi' ? 'Tổng Nhà Tuyển Dụng' : 'Total Employers'}
            value={stats.total.toString()}
            icon={Building2}
            color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
          <StatsCard
            title={language === 'vi' ? 'Đã Duyệt' : 'Approved'}
            value={stats.approved.toString()}
            icon={CheckCircle}
            color="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          />
          <StatsCard
            title={language === 'vi' ? 'Chờ Duyệt' : 'Pending'}
            value={stats.pending.toString()}
            icon={Clock}
            color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          />
          <StatsCard
            title={language === 'vi' ? 'Không Duyệt' : 'Rejected'}
            value={stats.rejected.toString()}
            icon={XCircle}
            color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          />
        </StatsGrid>

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
          
          <FilterGroup>
            <Filter size={18} />
            <FilterButton
              $active={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
            >
              {language === 'vi' ? 'Tất cả' : 'All'}
            </FilterButton>
            <FilterButton
              $active={statusFilter === 'approved'}
              onClick={() => setStatusFilter('approved')}
            >
              {language === 'vi' ? 'Đã duyệt' : 'Approved'}
            </FilterButton>
            <FilterButton
              $active={statusFilter === 'pending'}
              onClick={() => setStatusFilter('pending')}
            >
              {language === 'vi' ? 'Chờ duyệt' : 'Pending'}
            </FilterButton>
            <FilterButton
              $active={statusFilter === 'rejected'}
              onClick={() => setStatusFilter('rejected')}
            >
              {language === 'vi' ? 'Không duyệt' : 'Rejected'}
            </FilterButton>
          </FilterGroup>
        </FilterSection>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>{language === 'vi' ? 'STT' : 'No.'}</th>
                <th>{language === 'vi' ? 'Tên đơn vị (Quán)' : 'Business Name'}</th>
                <th>{language === 'vi' ? 'Loại hình' : 'Business Type'}</th>
                <th>{language === 'vi' ? 'Email tuyển dụng' : 'Recruitment Email'}</th>
                <th>{language === 'vi' ? 'Trạng thái phê duyệt' : 'Approval Status'}</th>
                <th>{language === 'vi' ? 'Ngày tham gia' : 'Join Date'}</th>
                <th>{language === 'vi' ? 'Chấp nhận điều khoản' : 'Terms Accepted'}</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployers.map((employer, index) => (
                <tr 
                  key={employer.id}
                  onClick={() => navigate(`/admin/employers/${employer.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>
                    {startIndex + index + 1}
                  </td>
                  <td style={{ fontWeight: 600 }}>{employer.name}</td>
                  <td>{employer.type}</td>
                  <td>{employer.email}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StatusBadge $status={getApprovalStatusVariant(employer.approvalStatus)}>
                        {getApprovalStatusText(employer.approvalStatus)}
                      </StatusBadge>
                      {employer.approvalStatus === 'pending' && (
                        <ActionButton
                          $variant="approve"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Open approval modal or navigate to verification page
                            navigate(`/admin/verification?employerId=${employer.id}`);
                          }}
                          style={{ background: '#10b981' }}
                        >
                          <CheckCircle />
                          {language === 'vi' ? 'Duyệt' : 'Approve'}
                        </ActionButton>
                      )}
                    </div>
                  </td>
                  <td>
                    <DateText>
                      <Calendar size={14} />
                      {employer.joined}
                    </DateText>
                  </td>
                  <td>
                    <VerificationBadge $verified={employer.verified}>
                      {employer.verified ? <Shield /> : <XSquare />}
                      {employer.verified 
                        ? (language === 'vi' ? 'Đồng ý' : 'Agreed')
                        : (language === 'vi' ? 'Không đồng ý' : 'Not Agreed')
                      }
                    </VerificationBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        <PaginationContainer>
          <PaginationInfo>
            {language === 'vi' 
              ? `Đang xem ${startIndex + 1}-${Math.min(endIndex, filteredEmployers.length)} trên ${filteredEmployers.length} kết quả`
              : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredEmployers.length)} of ${filteredEmployers.length} results`
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

export default EmployersManagement;
