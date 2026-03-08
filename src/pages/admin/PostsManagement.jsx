import { useState, useMemo } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import TableFilter from '../../components/TableFilter';
import Modal from '../../components/Modal';
import { useLanguage } from '../../context/LanguageContext';
import { jobPosts } from '../../data/jobPosts';
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
  grid-template-columns: 300px 1fr;
  gap: 24px;
  margin-bottom: 24px;
  align-items: start;
  
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 16px 24px;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const PaginationInfo = styled.div`
  color: ${props => props.theme.colors.textLight};
  font-size: 14px;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgLight};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${props => props.$active ? '600' : '500'};
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgDark};
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageEllipsis = styled.span`
  padding: 8px 4px;
  color: ${props => props.theme.colors.textLight};
`;

const PostsManagement = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('longterm');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Sample candidate names from CandidatesManagement (100 candidates)
  const candidatePool = [
    { name: 'Nguyễn Văn An', email: 'nguyen.an.01@example.com', phone: '0901234567' },
    { name: 'Trần Thị Bình', email: 'tran.binh.02@example.com', phone: '0902345678' },
    { name: 'Lê Minh Cường', email: 'le.cuong.03@example.com', phone: '0903456789' },
    { name: 'Phạm Hoàng Dũng', email: 'pham.dung.04@example.com', phone: '0904567890' },
    { name: 'Hoàng Ngọc Lan', email: 'hoang.lan.05@example.com', phone: '0905678901' },
    { name: 'Đỗ Văn Hùng', email: 'do.hung.06@example.com', phone: '0906789012' },
    { name: 'Bùi Thị Hương', email: 'bui.huong.07@example.com', phone: '0907890123' },
    { name: 'Vũ Tuấn Kiệt', email: 'vu.kiet.08@example.com', phone: '0908901234' },
    { name: 'Đặng Thanh Mai', email: 'dang.mai.09@example.com', phone: '0909012345' },
    { name: 'Ngô Văn Nam', email: 'ngo.nam.10@example.com', phone: '0910123456' },
    { name: 'Hồ Thị Nga', email: 'ho.nga.11@example.com', phone: '0911234567' },
    { name: 'Phan Đức Phúc', email: 'phan.phuc.12@example.com', phone: '0912345678' },
    { name: 'Huỳnh Phương Thảo', email: 'huynh.thao.13@example.com', phone: '0913456789' },
    { name: 'Nguyễn Văn Tuấn', email: 'nguyen.tuan.14@example.com', phone: '0914567890' },
    { name: 'Trần Thanh Tú', email: 'tran.tu.15@example.com', phone: '0915678901' },
    { name: 'Lê Thị Vân', email: 'le.van.16@example.com', phone: '0916789012' },
    { name: 'Phạm Văn Vinh', email: 'pham.vinh.17@example.com', phone: '0917890123' },
    { name: 'Hoàng Minh Vũ', email: 'hoang.vu.18@example.com', phone: '0918901234' },
    { name: 'Đỗ Thị Yến', email: 'do.yen.19@example.com', phone: '0919012345' },
    { name: 'Bùi Văn Chung', email: 'bui.chung.20@example.com', phone: '0920123456' },
    { name: 'Nguyễn Thị Duyên', email: 'nguyen.duyen.21@example.com', phone: '0921234567' },
    { name: 'Trần Văn Giang', email: 'tran.giang.22@example.com', phone: '0922345678' },
    { name: 'Lê Thanh Hải', email: 'le.hai.23@example.com', phone: '0923456789' },
    { name: 'Phạm Thị Hồng', email: 'pham.hong.24@example.com', phone: '0924567890' },
    { name: 'Hoàng Văn Huy', email: 'hoang.huy.25@example.com', phone: '0925678901' },
    { name: 'Đặng Thị Kim', email: 'dang.kim.26@example.com', phone: '0926789012' },
    { name: 'Ngô Thanh Lâm', email: 'ngo.lam.27@example.com', phone: '0927890123' },
    { name: 'Hồ Văn Lộc', email: 'ho.loc.28@example.com', phone: '0928901234' },
    { name: 'Phan Thị Ly', email: 'phan.ly.29@example.com', phone: '0929012345' },
    { name: 'Huỳnh Minh Nhật', email: 'huynh.nhat.30@example.com', phone: '0930123456' },
    { name: 'Nguyễn Thị Oanh', email: 'nguyen.oanh.31@example.com', phone: '0931234567' },
    { name: 'Trần Văn Phong', email: 'tran.phong.32@example.com', phone: '0932345678' },
    { name: 'Lê Thị Quyên', email: 'le.quyen.33@example.com', phone: '0933456789' },
    { name: 'Phạm Văn Sang', email: 'pham.sang.34@example.com', phone: '0934567890' },
    { name: 'Hoàng Thị Tâm', email: 'hoang.tam.35@example.com', phone: '0935678901' },
    { name: 'Đỗ Minh Thắng', email: 'do.thang.36@example.com', phone: '0936789012' },
    { name: 'Bùi Thị Thu', email: 'bui.thu.37@example.com', phone: '0937890123' },
    { name: 'Vũ Văn Tiến', email: 'vu.tien.38@example.com', phone: '0938901234' },
    { name: 'Đặng Thanh Tùng', email: 'dang.tung.39@example.com', phone: '0939012345' },
    { name: 'Ngô Thị Tuyết', email: 'ngo.tuyet.40@example.com', phone: '0940123456' },
    { name: 'Hồ Văn Uyên', email: 'ho.uyen.41@example.com', phone: '0941234567' },
    { name: 'Phan Minh Việt', email: 'phan.viet.42@example.com', phone: '0942345678' },
    { name: 'Huỳnh Thị Xoan', email: 'huynh.xoan.43@example.com', phone: '0943456789' },
    { name: 'Nguyễn Văn Ý', email: 'nguyen.y.44@example.com', phone: '0944567890' },
    { name: 'Trần Thanh Ân', email: 'tran.an.45@example.com', phone: '0945678901' },
    { name: 'Lê Thị Bích', email: 'le.bich.46@example.com', phone: '0946789012' },
    { name: 'Phạm Văn Cảnh', email: 'pham.canh.47@example.com', phone: '0947890123' },
    { name: 'Hoàng Minh Danh', email: 'hoang.danh.48@example.com', phone: '0948901234' },
    { name: 'Đỗ Thị Đào', email: 'do.dao.49@example.com', phone: '0949012345' },
    { name: 'Bùi Văn Đạt', email: 'bui.dat.50@example.com', phone: '0950123456' },
    { name: 'Nguyễn Thị Diệp', email: 'nguyen.diep.51@example.com', phone: '0951234567' },
    { name: 'Trần Văn Đông', email: 'tran.dong.52@example.com', phone: '0952345678' },
    { name: 'Lê Thị Hà', email: 'le.ha.53@example.com', phone: '0953456789' },
    { name: 'Phạm Văn Hiếu', email: 'pham.hieu.54@example.com', phone: '0954567890' },
    { name: 'Hoàng Thị Hoa', email: 'hoang.hoa.55@example.com', phone: '0955678901' },
    { name: 'Đặng Văn Hùng', email: 'dang.hung.56@example.com', phone: '0956789012' },
    { name: 'Ngô Thị Huyền', email: 'ngo.huyen.57@example.com', phone: '0957890123' },
    { name: 'Hồ Văn Khang', email: 'ho.khang.58@example.com', phone: '0958901234' },
    { name: 'Phan Thị Lan', email: 'phan.lan.59@example.com', phone: '0959012345' },
    { name: 'Huỳnh Minh Long', email: 'huynh.long.60@example.com', phone: '0960123456' },
    { name: 'Nguyễn Thị Minh', email: 'nguyen.minh.61@example.com', phone: '0961234567' },
    { name: 'Trần Văn Nam', email: 'tran.nam.62@example.com', phone: '0962345678' },
    { name: 'Lê Thị Ngọc', email: 'le.ngoc.63@example.com', phone: '0963456789' },
    { name: 'Phạm Văn Nghĩa', email: 'pham.nghia.64@example.com', phone: '0964567890' },
    { name: 'Hoàng Thị Nhung', email: 'hoang.nhung.65@example.com', phone: '0965678901' },
    { name: 'Đặng Văn Phong', email: 'dang.phong.66@example.com', phone: '0966789012' },
    { name: 'Ngô Thị Phương', email: 'ngo.phuong.67@example.com', phone: '0967890123' },
    { name: 'Hồ Văn Quân', email: 'ho.quan.68@example.com', phone: '0968901234' },
    { name: 'Phan Thị Quý', email: 'phan.quy.69@example.com', phone: '0969012345' },
    { name: 'Huỳnh Minh Sơn', email: 'huynh.son.70@example.com', phone: '0970123456' },
    { name: 'Nguyễn Thị Tâm', email: 'nguyen.tam.71@example.com', phone: '0971234567' },
    { name: 'Trần Văn Thành', email: 'tran.thanh.72@example.com', phone: '0972345678' },
    { name: 'Lê Thị Thúy', email: 'le.thuy.73@example.com', phone: '0973456789' },
    { name: 'Phạm Văn Trí', email: 'pham.tri.74@example.com', phone: '0974567890' },
    { name: 'Hoàng Thị Trúc', email: 'hoang.truc.75@example.com', phone: '0975678901' },
    { name: 'Đặng Văn Tú', email: 'dang.tu.76@example.com', phone: '0976789012' },
    { name: 'Ngô Thị Tú Anh', email: 'ngo.tuanh.77@example.com', phone: '0977890123' },
    { name: 'Hồ Văn Tùng', email: 'ho.tung.78@example.com', phone: '0978901234' },
    { name: 'Phan Thị Tươi', email: 'phan.tuoi.79@example.com', phone: '0979012345' },
    { name: 'Huỳnh Minh Vĩnh', email: 'huynh.vinh.80@example.com', phone: '0980123456' },
    { name: 'Nguyễn Thị Xuân', email: 'nguyen.xuan.81@example.com', phone: '0981234567' },
    { name: 'Trần Văn Ý', email: 'tran.y.82@example.com', phone: '0982345678' },
    { name: 'Lê Thị Ánh', email: 'le.anh.83@example.com', phone: '0983456789' },
    { name: 'Phạm Văn Bằng', email: 'pham.bang.84@example.com', phone: '0984567890' },
    { name: 'Hoàng Thị Cẩm', email: 'hoang.cam.85@example.com', phone: '0985678901' },
    { name: 'Đặng Văn Dũng', email: 'dang.dung.86@example.com', phone: '0986789012' },
    { name: 'Ngô Thị Duyên', email: 'ngo.duyen.87@example.com', phone: '0987890123' },
    { name: 'Hồ Văn Giang', email: 'ho.giang.88@example.com', phone: '0988901234' },
    { name: 'Phan Thị Hạnh', email: 'phan.hanh.89@example.com', phone: '0989012345' },
    { name: 'Huỳnh Minh Hậu', email: 'huynh.hau.90@example.com', phone: '0990123456' },
    { name: 'Nguyễn Thị Hiền', email: 'nguyen.hien.91@example.com', phone: '0991234567' },
    { name: 'Trần Văn Hòa', email: 'tran.hoa.92@example.com', phone: '0992345678' },
    { name: 'Lê Thị Huệ', email: 'le.hue.93@example.com', phone: '0993456789' },
    { name: 'Phạm Văn Hưng', email: 'pham.hung.94@example.com', phone: '0994567890' },
    { name: 'Hoàng Thị Khuyên', email: 'hoang.khuyen.95@example.com', phone: '0995678901' },
    { name: 'Đặng Văn Lợi', email: 'dang.loi.96@example.com', phone: '0996789012' },
    { name: 'Ngô Thị Mai', email: 'ngo.mai.97@example.com', phone: '0997890123' },
    { name: 'Hồ Văn Minh', email: 'ho.minh.98@example.com', phone: '0998901234' },
    { name: 'Phan Thị Mỹ', email: 'phan.my.99@example.com', phone: '0999012345' },
    { name: 'Huỳnh Minh Nhân', email: 'huynh.nhan.100@example.com', phone: '0990012346' },
  ];

  // Generate random candidates for each job
  const generateCandidates = (jobId, numApplications) => {
    const candidates = [];
    // Show 50-70% of applications as candidates (realistic conversion rate)
    // Min 15 candidates, max 80 candidates
    const conversionRate = 0.5 + Math.random() * 0.2; // 50-70%
    const numToShow = Math.min(Math.max(15, Math.floor(numApplications * conversionRate)), 80);
    const usedIndices = new Set();
    
    for (let i = 0; i < numToShow; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * candidatePool.length);
      } while (usedIndices.has(randomIndex));
      
      usedIndices.add(randomIndex);
      const candidate = candidatePool[randomIndex];
      
      // Random date between 05/03 and 08/03
      const day = 5 + Math.floor(Math.random() * 4);
      
      // Status distribution: 40% approved, 40% pending, 20% rejected
      let status;
      const rand = Math.random();
      if (rand < 0.4) status = 'approved';
      else if (rand < 0.8) status = 'pending';
      else status = 'rejected';
      
      candidates.push({
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        appliedDate: '0' + day + '/03/2026',
        status: status
      });
    }
    
    return candidates;
  };

  // Transform jobPosts data into posts with applications
  const transformJobToPost = (job, isUrgent = false) => {
    // For long-term jobs, set end date to 3-6 months from post date
    let endDate = job.workDate;
    if (!isUrgent) {
      const postDateParts = job.workDate.split('/');
      const postDay = parseInt(postDateParts[0]);
      const postMonth = parseInt(postDateParts[1]);
      const postYear = parseInt(postDateParts[2]);
      
      // Add 3-6 months randomly
      const monthsToAdd = 3 + Math.floor(Math.random() * 4); // 3-6 months
      let endMonth = postMonth + monthsToAdd;
      let endYear = postYear;
      
      if (endMonth > 12) {
        endYear += Math.floor(endMonth / 12);
        endMonth = endMonth % 12;
        if (endMonth === 0) {
          endMonth = 12;
          endYear -= 1;
        }
      }
      
      // Use same day or last day of month if day doesn't exist
      let endDay = postDay;
      const daysInMonth = new Date(endYear, endMonth, 0).getDate();
      if (endDay > daysInMonth) {
        endDay = daysInMonth;
      }
      
      endDate = String(endDay).padStart(2, '0') + '/' + String(endMonth).padStart(2, '0') + '/' + endYear;
    }
    
    return {
      id: job.id,
      title: job.title,
      employer: job.company,
      employerType: job.companyType,
      employerEmail: 'hr@' + job.company.toLowerCase().replace(/\s+/g, '') + '.vn',
      employerPhone: '090' + String(job.id).padStart(7, '0'),
      postDate: job.workDate,
      endDate: endDate,
      shift: job.shift,
      salary: job.salary,
      applications: job.views,
      cvSent: Math.floor(job.views * 0.7),
      status: job.urgent ? 'ai-approved' : (job.featured ? 'approved' : 'pending'),
      aiApproved: job.urgent || job.featured,
      location: job.location,
      tags: job.tags,
      candidates: generateCandidates(job.id, job.views)
    };
  };

  // Dữ liệu việc làm part-time lâu dài (standard jobs)
  const longtermJobs = jobPosts
    .filter(job => job.category === 'standard')
    .map(job => transformJobToPost(job, false));

  // Dữ liệu việc làm part-time gấp (urgent jobs)
  const urgentJobs = jobPosts
    .filter(job => job.category === 'urgent')
    .map(job => transformJobToPost(job, true));

  const currentJobs = activeTab === 'longterm' ? longtermJobs : urgentJobs;

  const getStatusText = (status) => {
    if (status === 'ai-approved') return language === 'vi' ? 'AI Tự động duyệt' : 'AI Auto-approved';
    if (status === 'approved') return language === 'vi' ? 'Đã duyệt' : 'Approved';
    if (status === 'rejected') return language === 'vi' ? 'Đã từ chối' : 'Rejected';
    if (status === 'warning') return language === 'vi' ? 'Bị cảnh báo' : 'Warning';
    if (status === 'pending') return language === 'vi' ? 'Chờ duyệt' : 'Pending';
    return status;
  };

  const filterOptions = [
    { value: 'ai-approved', label: language === 'vi' ? 'AI Tự động duyệt' : 'AI Auto-approved' },
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs_paginated = filteredJobs.slice(startIndex, endIndex);

  // Reset to page 1 when search or filters change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterToggle = (filterValue) => {
    setFilters(prev => 
      prev.includes(filterValue) 
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
    setCurrentPage(1);
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
              setCurrentPage(1);
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
              setCurrentPage(1);
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

        <ChartsContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <StatBox $color="#1e40af">
              <h3>{language === 'vi' ? 'Tổng bài đăng' : 'Total Posts'}</h3>
              <p>{stats.total}</p>
            </StatBox>
            <StatBox $color="#8b5cf6">
              <h3>{language === 'vi' ? 'Tổng ứng tuyển' : 'Total Applications'}</h3>
              <p>{totalApplications}</p>
            </StatBox>
            <StatBox $color="#10b981">
              <h3>{language === 'vi' ? 'Tổng CV đã gửi' : 'Total CV Sent'}</h3>
              <p>{totalCVSent}</p>
            </StatBox>
          </div>
          
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
        </ChartsContainer>

        <TableFilter 
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
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
                <th>{language === 'vi' ? 'Thao tác' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {currentJobs_paginated.map((job) => (
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
                    <ActionButtons>
                      <IconButton 
                        onClick={() => handleViewDetails(job)}
                        title={language === 'vi' ? 'Xem chi tiết' : 'View details'}
                      >
                        <Eye size={16} />
                      </IconButton>
                      <IconButton $variant="success" title={language === 'vi' ? 'Phê duyệt' : 'Approve'}>
                        <CheckCircle size={16} />
                      </IconButton>
                      <IconButton $variant="danger" title={language === 'vi' ? 'Từ chối' : 'Reject'}>
                        <Ban size={16} />
                      </IconButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        {filteredJobs.length > 0 && (
          <PaginationContainer>
            <PaginationInfo>
              {language === 'vi' 
                ? `Hiển thị ${startIndex + 1}-${Math.min(endIndex, filteredJobs.length)} trong tổng số ${filteredJobs.length} bài đăng`
                : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredJobs.length)} of ${filteredJobs.length} posts`
              }
            </PaginationInfo>
            
            <PaginationButtons>
              <PageButton
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                {language === 'vi' ? 'Trước' : 'Previous'}
              </PageButton>
              
              {(() => {
                const pages = [];
                
                if (totalPages <= 7) {
                  // Show all pages if 7 or fewer
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(
                      <PageButton
                        key={i}
                        $active={currentPage === i}
                        onClick={() => setCurrentPage(i)}
                      >
                        {i}
                      </PageButton>
                    );
                  }
                } else {
                  // Always show first page
                  pages.push(
                    <PageButton
                      key={1}
                      $active={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </PageButton>
                  );
                  
                  // Show ellipsis after first page if current page is far from start
                  if (currentPage > 3) {
                    pages.push(<PageEllipsis key="ellipsis-start">...</PageEllipsis>);
                  }
                  
                  // Show pages around current page
                  const startPage = Math.max(2, currentPage - 1);
                  const endPage = Math.min(totalPages - 1, currentPage + 1);
                  
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <PageButton
                        key={i}
                        $active={currentPage === i}
                        onClick={() => setCurrentPage(i)}
                      >
                        {i}
                      </PageButton>
                    );
                  }
                  
                  // Show ellipsis before last page if current page is far from end
                  if (currentPage < totalPages - 2) {
                    pages.push(<PageEllipsis key="ellipsis-end">...</PageEllipsis>);
                  }
                  
                  // Always show last page
                  pages.push(
                    <PageButton
                      key={totalPages}
                      $active={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </PageButton>
                  );
                }
                
                return pages;
              })()}
              
              <PageButton
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                {language === 'vi' ? 'Sau' : 'Next'}
              </PageButton>
            </PaginationButtons>
          </PaginationContainer>
        )}

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


