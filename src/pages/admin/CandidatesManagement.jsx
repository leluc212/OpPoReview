import { useState } from 'react';
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
  Zap
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

  // Sample data
  const candidates = [
    { id: 1, name: 'Nguyễn Văn An', email: 'nguyen.an.01@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-15', reviewDate: '2026-01-20' },
    { id: 2, name: 'Trần Thị Bình', email: 'tran.binh.02@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-16', reviewDate: '2026-01-21' },
    { id: 3, name: 'Lê Minh Cường', email: 'le.cuong.03@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-01-17', reviewDate: null },
    { id: 4, name: 'Phạm Hoàng Dũng', email: 'pham.dung.04@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-18', reviewDate: '2026-01-23' },
    { id: 5, name: 'Hoàng Ngọc Lan', email: 'hoang.lan.05@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-19', reviewDate: '2026-01-24' },
    { id: 6, name: 'Đỗ Văn Hùng', email: 'do.hung.06@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-01-20', reviewDate: null },
    { id: 7, name: 'Bùi Thị Hương', email: 'bui.huong.07@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-21', reviewDate: '2026-01-26' },
    { id: 8, name: 'Vũ Tuấn Kiệt', email: 'vu.kiet.08@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-22', reviewDate: '2026-01-27' },
    { id: 9, name: 'Đặng Thanh Mai', email: 'dang.mai.09@gmail.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-01-23', reviewDate: '2026-01-28' },
    { id: 10, name: 'Ngô Văn Nam', email: 'ngo.nam.10@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-24', reviewDate: '2026-01-29' },
    { id: 11, name: 'Hồ Thị Nga', email: 'ho.nga.11@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-25', reviewDate: '2026-01-30' },
    { id: 12, name: 'Phan Đức Phúc', email: 'phan.phuc.12@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-01-26', reviewDate: null },
    { id: 13, name: 'Huỳnh Phương Thảo', email: 'huynh.thao.13@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-27', reviewDate: '2026-02-01' },
    { id: 14, name: 'Nguyễn Văn Tuấn', email: 'nguyen.tuan.14@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-28', reviewDate: '2026-02-02' },
    { id: 15, name: 'Trần Thanh Tú', email: 'tran.tu.15@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-01-29', reviewDate: null },
    { id: 16, name: 'Lê Thị Vân', email: 'le.van.16@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-30', reviewDate: '2026-02-04' },
    { id: 17, name: 'Phạm Văn Vinh', email: 'pham.vinh.17@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-31', reviewDate: '2026-02-05' },
    { id: 18, name: 'Hoàng Minh Vũ', email: 'hoang.vu.18@gmail.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-02-01', reviewDate: '2026-02-06' },
    { id: 19, name: 'Đỗ Thị Yến', email: 'do.yen.19@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-02', reviewDate: '2026-02-07' },
    { id: 20, name: 'Bùi Văn Chung', email: 'bui.chung.20@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-03', reviewDate: '2026-02-08' },
    { id: 21, name: 'Nguyễn Thị Duyên', email: 'nguyen.duyen.21@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-02-04', reviewDate: null },
    { id: 22, name: 'Trần Văn Giang', email: 'tran.giang.22@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-05', reviewDate: '2026-02-10' },
    { id: 23, name: 'Lê Thanh Hải', email: 'le.hai.23@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-06', reviewDate: '2026-02-11' },
    { id: 24, name: 'Phạm Thị Hồng', email: 'pham.hong.24@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-02-07', reviewDate: null },
    { id: 25, name: 'Hoàng Văn Huy', email: 'hoang.huy.25@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-08', reviewDate: '2026-02-13' },
    { id: 26, name: 'Đặng Thị Kim', email: 'dang.kim.26@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-09', reviewDate: '2026-02-14' },
    { id: 27, name: 'Ngô Thanh Lâm', email: 'ngo.lam.27@gmail.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-02-10', reviewDate: '2026-02-15' },
    { id: 28, name: 'Hồ Văn Lộc', email: 'ho.loc.28@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-11', reviewDate: '2026-02-16' },
    { id: 29, name: 'Phan Thị Ly', email: 'phan.ly.29@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-12', reviewDate: '2026-02-17' },
    { id: 30, name: 'Huỳnh Minh Nhật', email: 'huynh.nhat.30@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-02-13', reviewDate: null },
    { id: 31, name: 'Nguyễn Thị Oanh', email: 'nguyen.oanh.31@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-14', reviewDate: '2026-02-19' },
    { id: 32, name: 'Trần Văn Phong', email: 'tran.phong.32@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-15', reviewDate: '2026-02-20' },
    { id: 33, name: 'Lê Thị Quyên', email: 'le.quyen.33@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-02-16', reviewDate: null },
    { id: 34, name: 'Phạm Văn Sang', email: 'pham.sang.34@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-17', reviewDate: '2026-02-22' },
    { id: 35, name: 'Hoàng Thị Tâm', email: 'hoang.tam.35@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-18', reviewDate: '2026-02-23' },
    { id: 36, name: 'Đỗ Minh Thắng', email: 'do.thang.36@gmail.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-02-19', reviewDate: '2026-02-24' },
    { id: 37, name: 'Bùi Thị Thu', email: 'bui.thu.37@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-20', reviewDate: '2026-02-25' },
    { id: 38, name: 'Vũ Văn Tiến', email: 'vu.tien.38@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-21', reviewDate: '2026-02-26' },
    { id: 39, name: 'Đặng Thanh Tùng', email: 'dang.tung.39@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-02-22', reviewDate: null },
    { id: 40, name: 'Ngô Thị Tuyết', email: 'ngo.tuyet.40@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-23', reviewDate: '2026-02-28' },
    { id: 41, name: 'Hồ Văn Uyên', email: 'ho.uyen.41@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-24', reviewDate: '2026-03-01' },
    { id: 42, name: 'Phan Minh Việt', email: 'phan.viet.42@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-02-25', reviewDate: null },
    { id: 43, name: 'Huỳnh Thị Xoan', email: 'huynh.xoan.43@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-26', reviewDate: '2026-03-03' },
    { id: 44, name: 'Nguyễn Văn Ý', email: 'nguyen.y.44@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-27', reviewDate: '2026-03-04' },
    { id: 45, name: 'Trần Thanh Ân', email: 'tran.an.45@gmail.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-02-28', reviewDate: '2026-03-05' },
    { id: 46, name: 'Lê Thị Bích', email: 'le.bich.46@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-01', reviewDate: '2026-03-06' },
    { id: 47, name: 'Phạm Văn Cảnh', email: 'pham.canh.47@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-02', reviewDate: '2026-03-07' },
    { id: 48, name: 'Hoàng Minh Danh', email: 'hoang.danh.48@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-03', reviewDate: null },
    { id: 49, name: 'Đỗ Thị Đào', email: 'do.dao.49@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-04', reviewDate: '2026-03-09' },
    { id: 50, name: 'Bùi Văn Đạt', email: 'bui.dat.50@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-05', reviewDate: '2026-03-10' },
    { id: 51, name: 'Nguyễn Thị Diệp', email: 'nguyen.diep.51@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-06', reviewDate: null },
    { id: 52, name: 'Trần Văn Đông', email: 'tran.dong.52@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-07', reviewDate: '2026-03-12' },
    { id: 53, name: 'Lê Thị Hà', email: 'le.ha.53@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-08', reviewDate: '2026-03-13' },
    { id: 54, name: 'Phạm Văn Hiếu', email: 'pham.hieu.54@gmail.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-03-09', reviewDate: '2026-03-14' },
    { id: 55, name: 'Hoàng Thị Hoa', email: 'hoang.hoa.55@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-10', reviewDate: '2026-03-15' },
    { id: 56, name: 'Đặng Văn Hùng', email: 'dang.hung.56@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-11', reviewDate: '2026-03-16' },
    { id: 57, name: 'Ngô Thị Huyền', email: 'ngo.huyen.57@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-12', reviewDate: null },
    { id: 58, name: 'Hồ Văn Khang', email: 'ho.khang.58@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-13', reviewDate: '2026-03-18' },
    { id: 59, name: 'Phan Thị Lan', email: 'phan.lan.59@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-14', reviewDate: '2026-03-19' },
    { id: 60, name: 'Huỳnh Minh Long', email: 'huynh.long.60@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-15', reviewDate: null },
    { id: 61, name: 'Nguyễn Thị Minh', email: 'nguyen.minh.61@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-16', reviewDate: '2026-03-21' },
    { id: 62, name: 'Trần Văn Nam', email: 'tran.nam.62@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-17', reviewDate: '2026-03-22' },
    { id: 63, name: 'Lê Thị Ngọc', email: 'le.ngoc.63@gmail.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-03-18', reviewDate: '2026-03-23' },
    { id: 64, name: 'Phạm Văn Nghĩa', email: 'pham.nghia.64@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-19', reviewDate: '2026-03-24' },
    { id: 65, name: 'Hoàng Thị Nhung', email: 'hoang.nhung.65@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-20', reviewDate: '2026-03-25' },
    { id: 66, name: 'Đặng Văn Phong', email: 'dang.phong.66@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-21', reviewDate: null },
    { id: 67, name: 'Ngô Thị Phương', email: 'ngo.phuong.67@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-22', reviewDate: '2026-03-27' },
    { id: 68, name: 'Hồ Văn Quân', email: 'ho.quan.68@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-23', reviewDate: '2026-03-28' },
    { id: 69, name: 'Phan Thị Quý', email: 'phan.quy.69@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-24', reviewDate: null },
    { id: 70, name: 'Huỳnh Minh Sơn', email: 'huynh.son.70@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-25', reviewDate: '2026-03-30' },
    { id: 71, name: 'Nguyễn Thị Tâm', email: 'nguyen.tam.71@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-26', reviewDate: '2026-03-31' },
    { id: 72, name: 'Trần Văn Thành', email: 'tran.thanh.72@gmail.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-03-27', reviewDate: '2026-04-01' },
    { id: 73, name: 'Lê Thị Thúy', email: 'le.thuy.73@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-28', reviewDate: '2026-04-02' },
    { id: 74, name: 'Phạm Văn Trí', email: 'pham.tri.74@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-29', reviewDate: '2026-04-03' },
    { id: 75, name: 'Hoàng Thị Trúc', email: 'hoang.truc.75@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-30', reviewDate: null },
    { id: 76, name: 'Đặng Văn Tú', email: 'dang.tu.76@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-31', reviewDate: '2026-04-05' },
    { id: 77, name: 'Ngô Thị Tú Anh', email: 'ngo.tuanh.77@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-01', reviewDate: '2026-04-06' },
    { id: 78, name: 'Hồ Văn Tùng', email: 'ho.tung.78@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-04-02', reviewDate: null },
    { id: 79, name: 'Phan Thị Tươi', email: 'phan.tuoi.79@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-03', reviewDate: '2026-04-08' },
    { id: 80, name: 'Huỳnh Minh Vĩnh', email: 'huynh.vinh.80@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-04', reviewDate: '2026-04-09' },
    { id: 81, name: 'Nguyễn Thị Xuân', email: 'nguyen.xuan.81@gmail.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-04-05', reviewDate: '2026-04-10' },
    { id: 82, name: 'Trần Văn Ý', email: 'tran.y.82@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-06', reviewDate: '2026-04-11' },
    { id: 83, name: 'Lê Thị Ánh', email: 'le.anh.83@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-07', reviewDate: '2026-04-12' },
    { id: 84, name: 'Phạm Văn Bằng', email: 'pham.bang.84@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-04-08', reviewDate: null },
    { id: 85, name: 'Hoàng Thị Cẩm', email: 'hoang.cam.85@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-09', reviewDate: '2026-04-14' },
    { id: 86, name: 'Đặng Văn Dũng', email: 'dang.dung.86@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-10', reviewDate: '2026-04-15' },
    { id: 87, name: 'Ngô Thị Duyên', email: 'ngo.duyen.87@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-04-11', reviewDate: null },
    { id: 88, name: 'Hồ Văn Giang', email: 'ho.giang.88@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-12', reviewDate: '2026-04-17' },
    { id: 89, name: 'Phan Thị Hạnh', email: 'phan.hanh.89@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-13', reviewDate: '2026-04-18' },
    { id: 90, name: 'Huỳnh Minh Hậu', email: 'huynh.hau.90@gmail.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-04-14', reviewDate: '2026-04-19' },
    { id: 91, name: 'Nguyễn Thị Hiền', email: 'nguyen.hien.91@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-15', reviewDate: '2026-04-20' },
    { id: 92, name: 'Trần Văn Hòa', email: 'tran.hoa.92@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-16', reviewDate: '2026-04-21' },
    { id: 93, name: 'Lê Thị Huệ', email: 'le.hue.93@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-04-17', reviewDate: null },
    { id: 94, name: 'Phạm Văn Hưng', email: 'pham.hung.94@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-18', reviewDate: '2026-04-23' },
    { id: 95, name: 'Hoàng Thị Khuyên', email: 'hoang.khuyen.95@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-19', reviewDate: '2026-04-24' },
    { id: 96, name: 'Đặng Văn Lợi', email: 'dang.loi.96@gmail.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-04-20', reviewDate: null },
    { id: 97, name: 'Ngô Thị Mai', email: 'ngo.mai.97@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-21', reviewDate: '2026-04-26' },
    { id: 98, name: 'Hồ Văn Minh', email: 'ho.minh.98@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-22', reviewDate: '2026-04-27' },
    { id: 99, name: 'Phan Thị Mỹ', email: 'phan.my.99@gmail.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-04-23', reviewDate: '2026-04-28' },
    { id: 100, name: 'Huỳnh Minh Nhân', email: 'huynh.nhan.100@gmail.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-24', reviewDate: '2026-04-29' },
  ];

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
          <h1>{language === 'vi' ? 'Quản Lý Ứng Viên' : 'Candidates Management'}</h1>
          <p>{language === 'vi' ? 'Quản lý thông tin và trạng thái của tất cả ứng viên' : 'Manage information and status of all candidates'}</p>
        </PageHeader>

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
                
                {/* Job gấp - Dynamic polyline */}
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
                {language === 'vi' ? 'Job gấp' : 'Urgent Jobs'}
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
        </FilterSection>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>{language === 'vi' ? 'STT' : 'No.'}</th>
                <th>{language === 'vi' ? 'Tên ứng viên' : 'Candidate Name'}</th>
                <th>{language === 'vi' ? 'Email' : 'Email'}</th>
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


