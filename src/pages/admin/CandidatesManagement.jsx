import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, 
  UserCheck,
  UserX,
  Clock,
  Search,
  Filter,
  CheckSquare,
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

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  
  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  background: transparent;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textLight};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.bgDark};
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
    if (props.$status === 'info') return '#dbeafe';
    return '#fef3c7';
  }};
  color: ${props => {
    if (props.$status === 'success') return '#15803d';
    if (props.$status === 'danger') return '#dc2626';
    if (props.$status === 'info') return '#2563eb';
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
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
    gap: 10px;
  }
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$color || props.theme.colors.primary};
    
    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    
    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

const UrgentJobsBox = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const UrgentJobsTitle = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #92400e;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    font-size: 22px;
    gap: 6px;
  }
`;

const UrgentJobsSubtitle = styled.div`
  font-size: 14px;
  color: #78350f;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const BoostGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const BoostItem = styled.div`
  background: ${props => props.$bgColor || '#f3f4f6'};
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    padding: 12px;
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const BoostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const BoostIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$color || '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: white;
    
    @media (max-width: 768px) {
      width: 18px;
      height: 18px;
    }
  }
`;

const BoostLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const BoostValue = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ChartSVGOld = styled.svg`
  width: 100%;
  height: 100%;
  
  @media (max-width: 768px) {
    min-width: 500px;
  }
`;

const ChartLegendOld = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
`;

const LegendItemOld = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const LegendDotOld = styled.div`
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

const ChartsSection = styled.div`
  margin-top: 32px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
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
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Sample data
  const candidates = [
    { id: 1, name: 'Nguyễn Văn An', email: 'nguyen.an.01@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-15', reviewDate: '2026-01-20' },
    { id: 2, name: 'Trần Thị Bình', email: 'tran.binh.02@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-16', reviewDate: '2026-01-21' },
    { id: 3, name: 'Lê Minh Cường', email: 'le.cuong.03@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-01-17', reviewDate: null },
    { id: 4, name: 'Phạm Hoàng Dũng', email: 'pham.dung.04@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-18', reviewDate: '2026-01-23' },
    { id: 5, name: 'Hoàng Ngọc Lan', email: 'hoang.lan.05@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-19', reviewDate: '2026-01-24' },
    { id: 6, name: 'Đỗ Văn Hùng', email: 'do.hung.06@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-01-20', reviewDate: null },
    { id: 7, name: 'Bùi Thị Hương', email: 'bui.huong.07@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-21', reviewDate: '2026-01-26' },
    { id: 8, name: 'Vũ Tuấn Kiệt', email: 'vu.kiet.08@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-22', reviewDate: '2026-01-27' },
    { id: 9, name: 'Đặng Thanh Mai', email: 'dang.mai.09@example.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-01-23', reviewDate: '2026-01-28' },
    { id: 10, name: 'Ngô Văn Nam', email: 'ngo.nam.10@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-24', reviewDate: '2026-01-29' },
    { id: 11, name: 'Hồ Thị Nga', email: 'ho.nga.11@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-25', reviewDate: '2026-01-30' },
    { id: 12, name: 'Phan Đức Phúc', email: 'phan.phuc.12@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-01-26', reviewDate: null },
    { id: 13, name: 'Huỳnh Phương Thảo', email: 'huynh.thao.13@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-27', reviewDate: '2026-02-01' },
    { id: 14, name: 'Nguyễn Văn Tuấn', email: 'nguyen.tuan.14@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-28', reviewDate: '2026-02-02' },
    { id: 15, name: 'Trần Thanh Tú', email: 'tran.tu.15@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-01-29', reviewDate: null },
    { id: 16, name: 'Lê Thị Vân', email: 'le.van.16@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-30', reviewDate: '2026-02-04' },
    { id: 17, name: 'Phạm Văn Vinh', email: 'pham.vinh.17@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-01-31', reviewDate: '2026-02-05' },
    { id: 18, name: 'Hoàng Minh Vũ', email: 'hoang.vu.18@example.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-02-01', reviewDate: '2026-02-06' },
    { id: 19, name: 'Đỗ Thị Yến', email: 'do.yen.19@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-02', reviewDate: '2026-02-07' },
    { id: 20, name: 'Bùi Văn Chung', email: 'bui.chung.20@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-03', reviewDate: '2026-02-08' },
    { id: 21, name: 'Nguyễn Thị Duyên', email: 'nguyen.duyen.21@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-02-04', reviewDate: null },
    { id: 22, name: 'Trần Văn Giang', email: 'tran.giang.22@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-05', reviewDate: '2026-02-10' },
    { id: 23, name: 'Lê Thanh Hải', email: 'le.hai.23@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-06', reviewDate: '2026-02-11' },
    { id: 24, name: 'Phạm Thị Hồng', email: 'pham.hong.24@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-02-07', reviewDate: null },
    { id: 25, name: 'Hoàng Văn Huy', email: 'hoang.huy.25@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-08', reviewDate: '2026-02-13' },
    { id: 26, name: 'Đặng Thị Kim', email: 'dang.kim.26@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-09', reviewDate: '2026-02-14' },
    { id: 27, name: 'Ngô Thanh Lâm', email: 'ngo.lam.27@example.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-02-10', reviewDate: '2026-02-15' },
    { id: 28, name: 'Hồ Văn Lộc', email: 'ho.loc.28@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-11', reviewDate: '2026-02-16' },
    { id: 29, name: 'Phan Thị Ly', email: 'phan.ly.29@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-12', reviewDate: '2026-02-17' },
    { id: 30, name: 'Huỳnh Minh Nhật', email: 'huynh.nhat.30@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-02-13', reviewDate: null },
    { id: 31, name: 'Nguyễn Thị Oanh', email: 'nguyen.oanh.31@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-14', reviewDate: '2026-02-19' },
    { id: 32, name: 'Trần Văn Phong', email: 'tran.phong.32@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-15', reviewDate: '2026-02-20' },
    { id: 33, name: 'Lê Thị Quyên', email: 'le.quyen.33@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-02-16', reviewDate: null },
    { id: 34, name: 'Phạm Văn Sang', email: 'pham.sang.34@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-17', reviewDate: '2026-02-22' },
    { id: 35, name: 'Hoàng Thị Tâm', email: 'hoang.tam.35@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-18', reviewDate: '2026-02-23' },
    { id: 36, name: 'Đỗ Minh Thắng', email: 'do.thang.36@example.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-02-19', reviewDate: '2026-02-24' },
    { id: 37, name: 'Bùi Thị Thu', email: 'bui.thu.37@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-20', reviewDate: '2026-02-25' },
    { id: 38, name: 'Vũ Văn Tiến', email: 'vu.tien.38@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-21', reviewDate: '2026-02-26' },
    { id: 39, name: 'Đặng Thanh Tùng', email: 'dang.tung.39@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-02-22', reviewDate: null },
    { id: 40, name: 'Ngô Thị Tuyết', email: 'ngo.tuyet.40@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-23', reviewDate: '2026-02-28' },
    { id: 41, name: 'Hồ Văn Uyên', email: 'ho.uyen.41@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-24', reviewDate: '2026-03-01' },
    { id: 42, name: 'Phan Minh Việt', email: 'phan.viet.42@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-02-25', reviewDate: null },
    { id: 43, name: 'Huỳnh Thị Xoan', email: 'huynh.xoan.43@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-26', reviewDate: '2026-03-03' },
    { id: 44, name: 'Nguyễn Văn Ý', email: 'nguyen.y.44@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-02-27', reviewDate: '2026-03-04' },
    { id: 45, name: 'Trần Thanh Ân', email: 'tran.an.45@example.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-02-28', reviewDate: '2026-03-05' },
    { id: 46, name: 'Lê Thị Bích', email: 'le.bich.46@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-01', reviewDate: '2026-03-06' },
    { id: 47, name: 'Phạm Văn Cảnh', email: 'pham.canh.47@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-02', reviewDate: '2026-03-07' },
    { id: 48, name: 'Hoàng Minh Danh', email: 'hoang.danh.48@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-03', reviewDate: null },
    { id: 49, name: 'Đỗ Thị Đào', email: 'do.dao.49@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-04', reviewDate: '2026-03-09' },
    { id: 50, name: 'Bùi Văn Đạt', email: 'bui.dat.50@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-05', reviewDate: '2026-03-10' },
    { id: 51, name: 'Nguyễn Thị Diệp', email: 'nguyen.diep.51@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-06', reviewDate: null },
    { id: 52, name: 'Trần Văn Đông', email: 'tran.dong.52@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-07', reviewDate: '2026-03-12' },
    { id: 53, name: 'Lê Thị Hà', email: 'le.ha.53@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-08', reviewDate: '2026-03-13' },
    { id: 54, name: 'Phạm Văn Hiếu', email: 'pham.hieu.54@example.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-03-09', reviewDate: '2026-03-14' },
    { id: 55, name: 'Hoàng Thị Hoa', email: 'hoang.hoa.55@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-10', reviewDate: '2026-03-15' },
    { id: 56, name: 'Đặng Văn Hùng', email: 'dang.hung.56@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-11', reviewDate: '2026-03-16' },
    { id: 57, name: 'Ngô Thị Huyền', email: 'ngo.huyen.57@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-12', reviewDate: null },
    { id: 58, name: 'Hồ Văn Khang', email: 'ho.khang.58@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-13', reviewDate: '2026-03-18' },
    { id: 59, name: 'Phan Thị Lan', email: 'phan.lan.59@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-14', reviewDate: '2026-03-19' },
    { id: 60, name: 'Huỳnh Minh Long', email: 'huynh.long.60@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-15', reviewDate: null },
    { id: 61, name: 'Nguyễn Thị Minh', email: 'nguyen.minh.61@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-16', reviewDate: '2026-03-21' },
    { id: 62, name: 'Trần Văn Nam', email: 'tran.nam.62@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-17', reviewDate: '2026-03-22' },
    { id: 63, name: 'Lê Thị Ngọc', email: 'le.ngoc.63@example.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-03-18', reviewDate: '2026-03-23' },
    { id: 64, name: 'Phạm Văn Nghĩa', email: 'pham.nghia.64@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-19', reviewDate: '2026-03-24' },
    { id: 65, name: 'Hoàng Thị Nhung', email: 'hoang.nhung.65@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-20', reviewDate: '2026-03-25' },
    { id: 66, name: 'Đặng Văn Phong', email: 'dang.phong.66@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-21', reviewDate: null },
    { id: 67, name: 'Ngô Thị Phương', email: 'ngo.phuong.67@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-22', reviewDate: '2026-03-27' },
    { id: 68, name: 'Hồ Văn Quân', email: 'ho.quan.68@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-23', reviewDate: '2026-03-28' },
    { id: 69, name: 'Phan Thị Quý', email: 'phan.quy.69@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-24', reviewDate: null },
    { id: 70, name: 'Huỳnh Minh Sơn', email: 'huynh.son.70@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-25', reviewDate: '2026-03-30' },
    { id: 71, name: 'Nguyễn Thị Tâm', email: 'nguyen.tam.71@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-26', reviewDate: '2026-03-31' },
    { id: 72, name: 'Trần Văn Thành', email: 'tran.thanh.72@example.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-03-27', reviewDate: '2026-04-01' },
    { id: 73, name: 'Lê Thị Thúy', email: 'le.thuy.73@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-28', reviewDate: '2026-04-02' },
    { id: 74, name: 'Phạm Văn Trí', email: 'pham.tri.74@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-29', reviewDate: '2026-04-03' },
    { id: 75, name: 'Hoàng Thị Trúc', email: 'hoang.truc.75@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-03-30', reviewDate: null },
    { id: 76, name: 'Đặng Văn Tú', email: 'dang.tu.76@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-03-31', reviewDate: '2026-04-05' },
    { id: 77, name: 'Ngô Thị Tú Anh', email: 'ngo.tuanh.77@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-01', reviewDate: '2026-04-06' },
    { id: 78, name: 'Hồ Văn Tùng', email: 'ho.tung.78@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-04-02', reviewDate: null },
    { id: 79, name: 'Phan Thị Tươi', email: 'phan.tuoi.79@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-03', reviewDate: '2026-04-08' },
    { id: 80, name: 'Huỳnh Minh Vĩnh', email: 'huynh.vinh.80@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-04', reviewDate: '2026-04-09' },
    { id: 81, name: 'Nguyễn Thị Xuân', email: 'nguyen.xuan.81@example.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-04-05', reviewDate: '2026-04-10' },
    { id: 82, name: 'Trần Văn Ý', email: 'tran.y.82@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-06', reviewDate: '2026-04-11' },
    { id: 83, name: 'Lê Thị Ánh', email: 'le.anh.83@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-07', reviewDate: '2026-04-12' },
    { id: 84, name: 'Phạm Văn Bằng', email: 'pham.bang.84@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-04-08', reviewDate: null },
    { id: 85, name: 'Hoàng Thị Cẩm', email: 'hoang.cam.85@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-09', reviewDate: '2026-04-14' },
    { id: 86, name: 'Đặng Văn Dũng', email: 'dang.dung.86@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-10', reviewDate: '2026-04-15' },
    { id: 87, name: 'Ngô Thị Duyên', email: 'ngo.duyen.87@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-04-11', reviewDate: null },
    { id: 88, name: 'Hồ Văn Giang', email: 'ho.giang.88@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-12', reviewDate: '2026-04-17' },
    { id: 89, name: 'Phan Thị Hạnh', email: 'phan.hanh.89@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-13', reviewDate: '2026-04-18' },
    { id: 90, name: 'Huỳnh Minh Hậu', email: 'huynh.hau.90@example.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-04-14', reviewDate: '2026-04-19' },
    { id: 91, name: 'Nguyễn Thị Hiền', email: 'nguyen.hien.91@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-15', reviewDate: '2026-04-20' },
    { id: 92, name: 'Trần Văn Hòa', email: 'tran.hoa.92@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-16', reviewDate: '2026-04-21' },
    { id: 93, name: 'Lê Thị Huệ', email: 'le.hue.93@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-04-17', reviewDate: null },
    { id: 94, name: 'Phạm Văn Hưng', email: 'pham.hung.94@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-18', reviewDate: '2026-04-23' },
    { id: 95, name: 'Hoàng Thị Khuyên', email: 'hoang.khuyen.95@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-19', reviewDate: '2026-04-24' },
    { id: 96, name: 'Đặng Văn Lợi', email: 'dang.loi.96@example.com', ekycVerified: false, approvalStatus: 'pending', joined: '2026-04-20', reviewDate: null },
    { id: 97, name: 'Ngô Thị Mai', email: 'ngo.mai.97@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-21', reviewDate: '2026-04-26' },
    { id: 98, name: 'Hồ Văn Minh', email: 'ho.minh.98@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-22', reviewDate: '2026-04-27' },
    { id: 99, name: 'Phan Thị Mỹ', email: 'phan.my.99@example.com', ekycVerified: false, approvalStatus: 'rejected', joined: '2026-04-23', reviewDate: '2026-04-28' },
    { id: 100, name: 'Huỳnh Minh Nhân', email: 'huynh.nhan.100@example.com', ekycVerified: true, approvalStatus: 'approved', joined: '2026-04-24', reviewDate: '2026-04-29' },
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
    const matchesTab = activeTab === 'all' || candidate.approvalStatus === activeTab;
    return matchesSearch && matchesTab;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const stats = {
    total: filteredCandidates.length,
    approved: filteredCandidates.filter(c => c.approvalStatus === 'approved').length,
    pending: filteredCandidates.filter(c => c.approvalStatus === 'pending').length,
    rejected: filteredCandidates.filter(c => c.approvalStatus === 'rejected').length,
  };

  return (
    <DashboardLayout role="admin" key={language}>
      <PageContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Quản Lý Ứng Viên' : 'Candidates Management'}</h1>
          <p>{language === 'vi' ? 'Quản lý thông tin và trạng thái của tất cả ứng viên' : 'Manage information and status of all candidates'}</p>
        </PageHeader>

        <StatsGrid>
          <StatsCard
            title={language === 'vi' ? 'Tổng Ứng Viên' : 'Total Candidates'}
            value={stats.total.toString()}
            icon={Users}
            color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
          <StatsCard
            title={language === 'vi' ? 'Đã Duyệt' : 'Approved'}
            value={stats.approved.toString()}
            icon={UserCheck}
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
            icon={UserX}
            color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          />
        </StatsGrid>

        <ChartsSection>
          <ChartCard>
            <ChartHeader>
              <h3>
                <TrendingUp />
                {language === 'vi' ? 'Tăng Trưởng Ứng Viên' : 'Candidate Growth'}
              </h3>
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
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}
                
                <polyline
                  points="100,200 200,180 300,150 400,120 500,100 600,80"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                
                {[
                  { x: 100, y: 200, label: 'T1' },
                  { x: 200, y: 180, label: 'T2' },
                  { x: 300, y: 150, label: 'T3' },
                  { x: 400, y: 120, label: 'T4' },
                  { x: 500, y: 100, label: 'T5' },
                  { x: 600, y: 80, label: 'T6' }
                ].map((point, i) => (
                  <g key={i}>
                    <circle cx={point.x} cy={point.y} r="5" fill="#3b82f6" />
                    <text
                      x={point.x}
                      y="275"
                      textAnchor="middle"
                      fontSize="13"
                      fill="#6b7280"
                      fontWeight="600"
                    >
                      {point.label}
                    </text>
                  </g>
                ))}
              </ChartSVG>
            </ChartContainer>
            <ChartLegend>
              <LegendItem>
                <LegendDot $color="#3b82f6" />
                {language === 'vi' ? 'Số lượng ứng viên' : 'Number of candidates'}
              </LegendItem>
            </ChartLegend>
          </ChartCard>

          <ChartCard>
            <ChartHeader>
              <h3>
                <Target />
                {language === 'vi' ? 'Phân Bố Trạng Thái' : 'Status Distribution'}
              </h3>
            </ChartHeader>
            <ChartContainer>
              <ChartSVG viewBox="0 0 400 300">
                <g transform="translate(200, 150)">
                  {/* Đã duyệt - 40% (144 degrees) - Xanh lá */}
                  <path
                    d="M 0 0 L 0 -100 A 100 100 0 0 1 80.90 -58.78 Z"
                    fill="#10b981"
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* Chờ duyệt - 40% (144 degrees) - Vàng */}
                  <path
                    d="M 0 0 L 80.90 -58.78 A 100 100 0 0 1 -80.90 58.78 Z"
                    fill="#f59e0b"
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* Từ chối - 20% (72 degrees) - Đỏ */}
                  <path
                    d="M 0 0 L -80.90 58.78 A 100 100 0 0 1 0 -100 Z"
                    fill="#ef4444"
                    stroke="white"
                    strokeWidth="2"
                  />
                </g>
              </ChartSVG>
            </ChartContainer>
            <ChartLegend>
              <LegendItem>
                <LegendDot $color="#10b981" />
                {language === 'vi' ? 'Đã duyệt (40%)' : 'Approved (40%)'}
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#f59e0b" />
                {language === 'vi' ? 'Chờ duyệt (40%)' : 'Pending (40%)'}
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#ef4444" />
                {language === 'vi' ? 'Từ chối (20%)' : 'Rejected (20%)'}
              </LegendItem>
            </ChartLegend>
          </ChartCard>
        </ChartsSection>

        <TabsContainer>
          <Tab 
            $active={activeTab === 'all'} 
            onClick={() => handleTabChange('all')}
          >
            {language === 'vi' ? 'Tất cả' : 'All'} ({candidates.length})
          </Tab>
          <Tab 
            $active={activeTab === 'approved'} 
            onClick={() => handleTabChange('approved')}
          >
            {language === 'vi' ? 'Đã duyệt' : 'Approved'} ({candidates.filter(c => c.approvalStatus === 'approved').length})
          </Tab>
          <Tab 
            $active={activeTab === 'pending'} 
            onClick={() => handleTabChange('pending')}
          >
            {language === 'vi' ? 'Chờ duyệt' : 'Pending'} ({candidates.filter(c => c.approvalStatus === 'pending').length})
          </Tab>
          <Tab 
            $active={activeTab === 'rejected'} 
            onClick={() => handleTabChange('rejected')}
          >
            {language === 'vi' ? 'Từ chối' : 'Rejected'} ({candidates.filter(c => c.approvalStatus === 'rejected').length})
          </Tab>
        </TabsContainer>

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
                <th>{language === 'vi' ? 'eKYC (4 bước)' : 'eKYC (4 steps)'}</th>
                <th>{language === 'vi' ? 'Trạng thái duyệt' : 'Approval Status'}</th>
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
                        : (language === 'vi' ? 'Chưa xác thực' : 'Unverified')
                      }
                    </VerificationBadge>
                  </td>
                  <td>
                    <StatusBadge $status={getApprovalStatusVariant(candidate.approvalStatus)}>
                      {getApprovalStatusText(candidate.approvalStatus)}
                    </StatusBadge>
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

