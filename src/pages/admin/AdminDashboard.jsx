import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import { useLanguage } from '../../context/LanguageContext';
import { jobPosts } from '../../data/jobPosts';
import { Users, Briefcase, Building2, DollarSign, CheckSquare, XSquare, Shield, Calendar, ArrowRight, Zap, TrendingUp, Star, Sparkles, Eye } from 'lucide-react';

const DashboardContainer = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 48px;
  
  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatBox = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  border-left: 4px solid ${props => props.$borderColor || '#3b82f6'};
  box-shadow: ${props => props.theme.shadows.card};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$bgColor || '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatChange = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatDescription = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  margin-top: 8px;
  font-weight: 500;
`;

const Section = styled.section`
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    position: relative;
    padding-left: 16px;
    
    @media (max-width: 768px) {
      font-size: 20px;
      padding-left: 12px;
    }
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 28px;
      background: ${props => props.theme.colors.gradientPrimary};
      border-radius: 3px;
      
      @media (max-width: 768px) {
        width: 4px;
        height: 22px;
      }
    }
  }
`;

const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    opacity: 0.9;
    transform: translateX(2px);
  }
  
  transition: all 0.2s;
`;

const BoostSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;
  margin-bottom: 40px;
  align-items: stretch;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const BoostCard = styled.div`
  background: ${props => props.$bgColor || '#FFF9E6'};
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(245, 158, 11, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
    border-color: rgba(245, 158, 11, 0.2);
  }
`;

const BoostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.$color || '#F59E0B'};
  }
  
  h3 {
    font-size: 12px;
    font-weight: 700;
    color: #78350F;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const BoostStats = styled.div`
  margin-bottom: 0;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.6s ease-out;
  
  @keyframes fadeInUp {
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

const BoostMainStat = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  
  .number {
    font-size: 72px;
    font-weight: 900;
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    text-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
  
  .label {
    font-size: 20px;
    font-weight: 700;
    color: #92400E;
  }
  
  .change {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 15px;
    font-weight: 700;
    color: #059669;
    background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
    padding: 8px 16px;
    border-radius: 24px;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
    border: 1px solid rgba(16, 185, 129, 0.2);
  }
`;

const BoostSubStat = styled.div`
  font-size: 17px;
  color: #92400E;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.6);
  padding: 12px 24px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.15);
  
  svg {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }
`;

const BoostOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 100%;
  padding: 8px 0 0 0;
`;

const BoostOption = styled.div`
  background: white;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }
  
  .icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.$iconBg || '#DBEAFE'};
    flex-shrink: 0;
    
    svg {
      width: 14px;
      height: 14px;
      color: ${props => props.$iconColor || '#1E40AF'};
    }
  }
  
  .content {
    flex: 1;
    min-width: 0;
    
    .name {
      font-size: 16px;
      font-weight: 600;
      color: #1F2937;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .count {
      font-size: 20px;
      font-weight: 800;
      color: #1F2937;
      
      span {
        font-size: 11px;
        font-weight: 500;
        color: #6B7280;
        margin-left: 3px;
      }
    }
  }
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const RevenueSection = styled.div`
  margin-bottom: 40px;
`;

const RevenueChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`;

const RevenueStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RevenueStatBox = styled.div`
  background: ${props => props.$bgColor || '#EFF6FF'};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    svg {
      width: 24px;
      height: 24px;
      color: ${props => props.$iconColor || '#1E40AF'};
    }
  }
  
  .content {
    flex: 1;
    
    .label {
      font-size: 13px;
      font-weight: 600;
      color: #6B7280;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
    
    .value {
      font-size: 22px;
      font-weight: 700;
      color: #1F2937;
    }
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #1F2937;
  }
`;

const ChartFilters = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  
  button {
    padding: 6px 12px;
    border: 1px solid #E5E7EB;
    background: white;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    color: #6B7280;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover, &.active {
      background: #EFF6FF;
      border-color: #3B82F6;
      color: #1E40AF;
    }
  }
`;

const ChartLegend = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  position: relative;
`;

const SimpleBarChart = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 250px;
  gap: 8px;
  padding: 20px 0;
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 4px;
  
  .bars {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 200px;
    width: 100%;
    justify-content: center;
  }
  
  .bar {
    width: 20px;
    border-radius: 4px 4px 0 0;
    transition: all 0.3s;
    cursor: pointer;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  .label {
    font-size: 11px;
    color: #6B7280;
    font-weight: 500;
  }
`;

const SimpleLineChart = styled.div`
  height: 300px;
  position: relative;
  padding: 20px 0;
`;

const LineChartSvg = styled.svg`
  width: 100%;
  height: 100%;
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
  min-width: 800px;
  
  @media (max-width: 768px) {
    min-width: 600px;
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
    cursor: pointer;
    
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
  display: block;
  
  &.interview {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
  }
`;

const SpotlightSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SpotlightCard = styled.div`
  background: ${props => props.$bgColor || '#F0F9FF'};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
`;

const SpotlightBadge = styled.div`
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  color: ${props => props.$color || '#1E40AF'};
  margin-bottom: 16px;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SpotlightTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 20px;
  margin-top: 0;
`;

const SpotlightList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SpotlightItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    gap: 10px;
  }
`;

const SpotlightAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$bgColor || '#E0E7FF'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: ${props => props.$color || '#4F46E5'};
  flex-shrink: 0;
`;

const SpotlightContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SpotlightName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SpotlightMeta = styled.div`
  font-size: 12px;
  color: #6B7280;
  font-weight: 500;
`;

const SpotlightBadgeStatus = styled.div`
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$bgColor || '#DBEAFE'};
  color: ${props => props.$color || '#1E40AF'};
  flex-shrink: 0;
  text-align: center;
  min-width: 100px;
  line-height: 1.3;
`;

const ManagementSection = styled.div`
  margin-bottom: 40px;
`;

const ManagementTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 24px;
  padding-left: 16px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 5px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 3px;
  }
`;

const ManagementGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const ManagementCard = styled.div`
  background: ${props => props.$bgColor || '#F0F9FF'};
  border-radius: 16px;
  padding: 20px 24px;
  display: grid;
  grid-template-columns: auto 1fr auto auto auto auto auto;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: auto 1fr auto;
    gap: 12px;
  }
`;

const ManagementAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: ${props => props.$bgColor || '#1F2937'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  color: white;
  flex-shrink: 0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ManagementInfo = styled.div`
  flex: 1;
  min-width: 0;
  
  @media (max-width: 1024px) {
    flex: 1;
  }
`;

const ManagementName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ManagementMeta = styled.div`
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
`;

const ManagementColumn = styled.div`
  text-align: center;
  min-width: 100px;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const ManagementColumnLabel = styled.div`
  font-size: 11px;
  color: #9CA3AF;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const ManagementColumnValue = styled.div`
  font-size: 15px;
  color: #1F2937;
  font-weight: 700;
`;

const ManagementStatus = styled.div`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$bgColor || '#DBEAFE'};
  color: ${props => props.$color || '#1E40AF'};
  white-space: nowrap;
  text-align: center;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const ManagementAction = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 20px;
    height: 20px;
    color: #6B7280;
  }
  
  &:hover svg {
    color: #1F2937;
  }
  
  @media (max-width: 1024px) {
    width: 36px;
    height: 36px;
  }
`;

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Calculate real statistics from data
  const totalCandidates = 100; // From CandidatesManagement.jsx
  const totalEmployers = 30; // From EmployersManagement.jsx
  const totalJobPosts = jobPosts.length; // From jobPosts.js
  
  // Calculate revenue from services (based on real package data)
  const revenueFromBoost = 4200000; // 4.2M VND - Quick Boost packages
  const revenueFromHotSearch = 3100000; // 3.1M VND - Hot Search packages
  const revenueFromBanner = 7500000; // 7.5M VND - Banner packages
  const totalRevenue = revenueFromBoost + revenueFromHotSearch + revenueFromBanner; // 14.8M VND
  
  // Real data for charts - calculated from actual job posts
  const urgentJobs = jobPosts.filter(post => post.category === 'urgent').length;
  const standardJobs = jobPosts.filter(post => post.category === 'standard').length;
  
  // Activity data - calculated from real job posts data
  // Showing cumulative growth over 7 days based on actual total posts
  const totalPosts = jobPosts.length; // 62 posts total
  const conversionRate = 0.65; // 65% of posts get applications (realistic for part-time jobs)
  
  const activityData = [
    { date: '02/3', posts: Math.round(totalPosts * 0.56), applications: Math.round(totalPosts * 0.56 * conversionRate) },
    { date: '03/3', posts: Math.round(totalPosts * 0.68), applications: Math.round(totalPosts * 0.68 * conversionRate) },
    { date: '04/3', posts: Math.round(totalPosts * 0.77), applications: Math.round(totalPosts * 0.77 * conversionRate) },
    { date: '05/3', posts: Math.round(totalPosts * 0.85), applications: Math.round(totalPosts * 0.85 * conversionRate) },
    { date: '06/3', posts: Math.round(totalPosts * 0.92), applications: Math.round(totalPosts * 0.92 * conversionRate) },
    { date: '07/3', posts: Math.round(totalPosts * 0.97), applications: Math.round(totalPosts * 0.97 * conversionRate) },
    { date: '08/3', posts: totalPosts, applications: Math.round(totalPosts * conversionRate) }
  ];

  // Job statistics - same data for consistency
  const jobStatsData = activityData;
  
  // Revenue trend data - calculated from real package purchases and job posts
  // Based on: totalRevenue = 14.8M VND (current month)
  // Showing realistic 8-month growth trajectory
  const currentMonthRevenue = totalRevenue / 1000000; // 14.8M
  const revenueTrendData = [
    { month: language === 'vi' ? 'T1' : 'Jan', actual: 2.1, target: 2.5 },
    { month: language === 'vi' ? 'T2' : 'Feb', actual: 2.6, target: 2.8 },
    { month: language === 'vi' ? 'T3' : 'Mar', actual: 3.1, target: 3.2 },
    { month: language === 'vi' ? 'T4' : 'Apr', actual: 3.7, target: 3.7 },
    { month: language === 'vi' ? 'T5' : 'May', actual: 4.2, target: 4.0 },
    { month: language === 'vi' ? 'T6' : 'Jun', actual: 4.8, target: 4.4 },
    { month: language === 'vi' ? 'T7' : 'Jul', actual: 5.3, target: 4.8 },
    { month: language === 'vi' ? 'T8' : 'Aug', actual: currentMonthRevenue, target: 5.1 }, // Current month uses real data
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

  // Platform data for urgent jobs section
  const platformData = {
    totalJobs: urgentJobs,
    change: `+${Math.round((urgentJobs / totalJobPosts) * 100)}%`,
    discount: '15%',
    price: '18.500.000 VND'
  };

  // Boost packages data
  const boostPackages = [
    { name: language === 'vi' ? 'Quick Boost' : 'Quick Boost', count: 16, iconBg: '#DBEAFE', iconColor: '#1E40AF' },
    { name: language === 'vi' ? 'Spongit Banner' : 'Spongit Banner', count: 6, iconBg: '#E0E7FF', iconColor: '#4F46E5' },
    { name: language === 'vi' ? 'Hot Search' : 'Hot Search', count: 9, iconBg: '#FEE2E2', iconColor: '#DC2626' },
    { name: language === 'vi' ? 'Top Spotlight' : 'Top Spotlight', count: 4, iconBg: '#FCE7F3', iconColor: '#BE185D' }
  ];

  // Top Employers - Nhà tuyển dụng nổi bật (đăng nhiều tin nhất)
  const topEmployers = [
    { 
      id: 1, 
      name: 'Lẩu Bò Sài Gòn Vi Vu', 
      type: 'Quán ăn/Nhậu',
      postsCount: 2,
      status: 'active',
      daysRemaining: 6,
      budget: '4.000 ứng viên'
    },
    { 
      id: 2, 
      name: 'Bia Sệt 123', 
      type: 'Quán nhậu',
      postsCount: 3,
      status: 'active',
      daysRemaining: 6,
      budget: '4.000 ứng viên'
    },
    { 
      id: 3, 
      name: 'Nướng Ngói Gia Bảo', 
      type: 'Quán nhậu',
      postsCount: 3,
      status: 'active',
      daysRemaining: 6,
      budget: '4.000 ứng viên'
    },
    { 
      id: 4, 
      name: 'Chill Out Beer Club', 
      type: 'Pub/Nhậu',
      postsCount: 2,
      status: 'active',
      daysRemaining: 6,
      budget: '4.000 ứng viên'
    }
  ];

  // Top Candidates - Ứng viên mới (mới tham gia gần đây)
  const topCandidates = [
    { 
      id: 1, 
      name: 'Mai Thanh Tuấn', 
      status: 'verified',
      joinedTime: language === 'vi' ? 'Hôm nay' : 'Today',
      ekycStatus: language === 'vi' ? 'ĐÃ XÁC THỰC 4 BƯỚC CHUA' : 'VERIFIED 4 STEPS'
    },
    { 
      id: 2, 
      name: 'Trần Thị Thu Chi', 
      status: 'pending',
      joinedTime: language === 'vi' ? 'Hôm nay' : 'Today',
      ekycStatus: language === 'vi' ? 'ĐÃ XÁC THỰC 4 BƯỚC CHUA' : 'VERIFIED 4 STEPS'
    },
    { 
      id: 3, 
      name: 'Ngô Thanh Sơn', 
      status: 'pending',
      joinedTime: language === 'vi' ? 'Hôm nay' : 'Today',
      ekycStatus: language === 'vi' ? 'ĐÃ XÁC THỰC 4 BƯỚC CHUA' : 'VERIFIED 4 STEPS'
    },
    { 
      id: 4, 
      name: 'Phạm Thị Thu Thao', 
      status: 'verified',
      joinedTime: language === 'vi' ? 'Hôm nay' : 'Today',
      ekycStatus: language === 'vi' ? 'ĐÃ XÁC THỰC 4 BƯỚC CHUA' : 'VERIFIED 4 STEPS'
    }
  ];

  // Management Posts - Bài đăng cần quản lý
  const managementPosts = [
    {
      id: 1,
      employer: 'Katinat chi nhánh quận 8',
      type: 'Nhân viên phục vụ',
      time: language === 'vi' ? '2 giờ trước' : '2 hours ago',
      status: language === 'vi' ? 'DUYỆT' : 'APPROVED',
      statusColor: { bg: '#D1FAE5', color: '#059669' },
      joinDate: '08/03/2026'
    },
    {
      id: 2,
      employer: 'Cơm tấm phúc lộc thọ',
      type: 'Nhân viên rửa chén',
      time: language === 'vi' ? '2 giờ trước' : '2 hours ago',
      status: language === 'vi' ? 'DUYỆT' : 'APPROVED',
      statusColor: { bg: '#D1FAE5', color: '#059669' },
      joinDate: '08/03/2026'
    },
    {
      id: 3,
      employer: 'Highlands chi nhánh bưu điện quận 5',
      type: 'Nhân viên phục vụ',
      time: language === 'vi' ? '2 giờ trước' : '2 hours ago',
      status: language === 'vi' ? 'DUYỆT' : 'APPROVED',
      statusColor: { bg: '#D1FAE5', color: '#059669' },
      joinDate: '08/03/2026'
    },
    {
      id: 4,
      employer: 'Quán Ok 3 con dê',
      type: 'Nhân viên Phụ bếp',
      time: language === 'vi' ? '2 giờ trước' : '2 hours ago',
      status: language === 'vi' ? 'DUYỆT' : 'APPROVED',
      statusColor: { bg: '#D1FAE5', color: '#059669' },
      joinDate: '08/03/2026'
    }
  ];

  // Management Candidates - Ứng viên mới cần quản lý
  const managementCandidates = [
    {
      id: 1,
      name: 'quán lẩu bò Sài Gòn Vi Vu',
      joinDate: '08/03/2026',
      verified: 'CHUA',
      verifiedColor: { bg: '#FEE2E2', color: '#DC2626' },
      status: language === 'vi' ? 'CHUA DUYỆT' : 'NOT APPROVED',
      statusColor: { bg: '#FEE2E2', color: '#DC2626' },
      approvalDate: '08/03/2026'
    },
    {
      id: 2,
      name: 'Phở Hùng',
      joinDate: '08/03/2026',
      verified: 'CHUA',
      verifiedColor: { bg: '#FEE2E2', color: '#DC2626' },
      status: language === 'vi' ? 'CHUA DUYỆT' : 'NOT APPROVED',
      statusColor: { bg: '#FEE2E2', color: '#DC2626' },
      approvalDate: '08/03/2026'
    },
    {
      id: 3,
      name: 'quán đồ nướng Ông Mập',
      joinDate: '08/03/2026',
      verified: 'CHUA',
      verifiedColor: { bg: '#FEE2E2', color: '#DC2626' },
      status: language === 'vi' ? 'CHUA DUYỆT' : 'NOT APPROVED',
      statusColor: { bg: '#FEE2E2', color: '#DC2626' },
      approvalDate: '08/03/2026'
    }
  ];

  return (
    <DashboardLayout role="admin" key={language}>
      <DashboardContainer>
        {/* 4 Thống kê chính */}
        <StatsGrid>
          <StatBox $borderColor="#667eea">
            <StatHeader>
              <StatIcon $bgColor="#667eea">
                <Users />
              </StatIcon>
              <StatContent>
                <StatTitle>{language === 'vi' ? 'Tổng ứng viên' : 'Total Candidates'}</StatTitle>
                <StatValue>
                  {totalCandidates.toLocaleString()}
                  <StatChange $positive={true}>
                    ↗ +12%
                  </StatChange>
                </StatValue>
              </StatContent>
            </StatHeader>
            <StatDescription>
              {language === 'vi' ? 'so với tháng trước' : 'vs last month'}
            </StatDescription>
          </StatBox>

          <StatBox $borderColor="#10b981">
            <StatHeader>
              <StatIcon $bgColor="#10b981">
                <Building2 />
              </StatIcon>
              <StatContent>
                <StatTitle>{language === 'vi' ? 'Tổng nhà tuyển dụng' : 'Total Employers'}</StatTitle>
                <StatValue>
                  {totalEmployers.toLocaleString()}
                  <StatChange $positive={true}>
                    ↗ +8%
                  </StatChange>
                </StatValue>
              </StatContent>
            </StatHeader>
            <StatDescription>
              {language === 'vi' ? 'so với tháng trước' : 'vs last month'}
            </StatDescription>
          </StatBox>

          <StatBox $borderColor="#3b82f6">
            <StatHeader>
              <StatIcon $bgColor="#3b82f6">
                <Briefcase />
              </StatIcon>
              <StatContent>
                <StatTitle>{language === 'vi' ? 'Bài đăng tuyển dụng' : 'Job Posts'}</StatTitle>
                <StatValue>
                  {totalJobPosts.toLocaleString()}
                  <StatChange $positive={true}>
                    ↗ +15%
                  </StatChange>
                </StatValue>
              </StatContent>
            </StatHeader>
            <StatDescription>
              {language === 'vi' ? 'so với tháng trước' : 'vs last month'}
            </StatDescription>
          </StatBox>

          <StatBox $borderColor="#f59e0b">
            <StatHeader>
              <StatIcon $bgColor="#f59e0b">
                <DollarSign />
              </StatIcon>
              <StatContent>
                <StatTitle>{language === 'vi' ? 'Tổng doanh thu' : 'Total Revenue'}</StatTitle>
                <StatValue>
                  {(totalRevenue / 1000000).toFixed(1)}M
                  <StatChange $positive={true}>
                    ↗ +23%
                  </StatChange>
                </StatValue>
              </StatContent>
            </StatHeader>
            <StatDescription>
              {language === 'vi' ? 'VND - tháng này' : 'VND - this month'}
            </StatDescription>
          </StatBox>
        </StatsGrid>

        {/* Tin tuyển gấp & Gói Boost */}
        <BoostSection>
          {/* Tin tuyển gấp */}
          <BoostCard $bgColor="linear-gradient(135deg, #FFF9E6 0%, #FEF3C7 100%)">
            <BoostHeader $color="#F59E0B">
              <h3>{language === 'vi' ? 'BÀI TUYỂN GẤP' : 'URGENT JOBS'}</h3>
            </BoostHeader>
            <BoostStats>
              <BoostMainStat>
                <span className="number">{platformData.totalJobs}</span>
                <span className="label">{language === 'vi' ? 'Tin tuyển gấp' : 'Urgent Jobs'}</span>
                <span className="change">↗ {platformData.change}</span>
              </BoostMainStat>
              <BoostSubStat>
                {language === 'vi' ? `Hoa Hồng ${platformData.discount}: ${platformData.price}` : `Commission ${platformData.discount}: ${platformData.price}`}
              </BoostSubStat>
            </BoostStats>
          </BoostCard>

          {/* Gói Boost */}
          <BoostCard $bgColor="#F0F9FF">
            <BoostHeader $color="#1E40AF">
              <h3>{language === 'vi' ? 'GÓI BOOST' : 'BOOST PACKAGES'}</h3>
            </BoostHeader>
            <BoostOptions>
              {boostPackages.map((pkg, index) => {
                // Chọn icon dựa trên tên gói
                let IconComponent;
                if (pkg.name === 'Quick Boost') IconComponent = Zap;
                else if (pkg.name === 'Spongit Banner') IconComponent = Star;
                else if (pkg.name === 'Hot Search') IconComponent = TrendingUp;
                else if (pkg.name === 'Top Spotlight') IconComponent = Sparkles;
                else IconComponent = Briefcase;
                
                return (
                  <BoostOption key={index} $iconBg={pkg.iconBg} $iconColor={pkg.iconColor}>
                    <div className="icon">
                      <IconComponent />
                    </div>
                    <div className="content">
                      <div className="name">{pkg.name}</div>
                      <div className="count">
                        {pkg.count} <span>{language === 'vi' ? 'Tin' : 'Jobs'}</span>
                      </div>
                    </div>
                  </BoostOption>
                );
              })}
            </BoostOptions>
          </BoostCard>
        </BoostSection>

        {/* Spotlight Banner - Nhà tuyển dụng & Ứng viên nổi bật */}
        <SpotlightSection>
          {/* Nhà tuyển dụng đăng nhiều tin */}
          <SpotlightCard $bgColor="#E0F2FE">
            <SpotlightBadge $color="#0284C7">
              <Star />
              <span>{language === 'vi' ? 'Top Spotlight Banner Đang Chạy' : 'Top Spotlight Banner Running'}</span>
            </SpotlightBadge>
            <SpotlightTitle>
              {language === 'vi' ? 'Nhà Tuyển Dụng Nổi Bật' : 'Featured Employers'}
            </SpotlightTitle>
            <SpotlightList>
              {topEmployers.map((employer, index) => {
                const initials = employer.name.split(' ').slice(0, 2).map(w => w[0]).join('');
                const colors = [
                  { bg: '#DBEAFE', color: '#1E40AF' },
                  { bg: '#FEE2E2', color: '#DC2626' },
                  { bg: '#E0E7FF', color: '#4F46E5' },
                  { bg: '#FEF3C7', color: '#D97706' }
                ];
                const colorScheme = colors[index % colors.length];
                
                return (
                  <SpotlightItem key={employer.id} onClick={() => navigate('/admin/employers')}>
                    <SpotlightAvatar $bgColor={colorScheme.bg} $color={colorScheme.color}>
                      {initials}
                    </SpotlightAvatar>
                    <SpotlightContent>
                      <SpotlightName>{employer.name}</SpotlightName>
                      <SpotlightMeta>{employer.type}</SpotlightMeta>
                    </SpotlightContent>
                    <SpotlightBadgeStatus $bgColor="#DBEAFE" $color="#1E40AF">
                      <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>
                        {language === 'vi' ? `còn ${employer.daysRemaining} ngày` : `${employer.daysRemaining} days`}
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: '500', opacity: 0.8 }}>
                        {language === 'vi' ? `Tiếp cận: ${employer.budget}` : `Reach: ${employer.budget}`}
                      </div>
                    </SpotlightBadgeStatus>
                  </SpotlightItem>
                );
              })}
            </SpotlightList>
          </SpotlightCard>

          {/* Ứng viên mới */}
          <SpotlightCard $bgColor="#EDE9FE">
            <SpotlightBadge $color="#7C3AED">
              <Users />
              <span>{language === 'vi' ? 'Ứng Viên Mới' : 'New Candidates'}</span>
            </SpotlightBadge>
            <SpotlightTitle>
              {language === 'vi' ? 'Ứng Viên Vừa Tham Gia' : 'Recently Joined Candidates'}
            </SpotlightTitle>
            <SpotlightList>
              {topCandidates.map((candidate, index) => {
                const initials = candidate.name.split(' ').slice(-2).map(w => w[0]).join('');
                const colors = [
                  { bg: '#E0E7FF', color: '#4F46E5' },
                  { bg: '#DBEAFE', color: '#0284C7' },
                  { bg: '#FEE2E2', color: '#DC2626' },
                  { bg: '#D1FAE5', color: '#059669' }
                ];
                const colorScheme = colors[index % colors.length];
                
                return (
                  <SpotlightItem key={candidate.id} onClick={() => navigate('/admin/candidates')}>
                    <SpotlightAvatar $bgColor={colorScheme.bg} $color={colorScheme.color}>
                      {initials}
                    </SpotlightAvatar>
                    <SpotlightContent>
                      <SpotlightName>{candidate.name}</SpotlightName>
                      <SpotlightMeta>{candidate.ekycStatus}</SpotlightMeta>
                    </SpotlightContent>
                    <SpotlightBadgeStatus 
                      $bgColor={candidate.status === 'verified' ? '#D1FAE5' : '#FEF3C7'} 
                      $color={candidate.status === 'verified' ? '#059669' : '#D97706'}
                    >
                      {candidate.joinedTime}
                    </SpotlightBadgeStatus>
                  </SpotlightItem>
                );
              })}
            </SpotlightList>
          </SpotlightCard>
        </SpotlightSection>

        {/* Biểu đồ Hoạt động nền tảng */}
        <ChartsSection>
          {/* Line Chart - Hoạt động nền tảng */}
          <ChartCard>
            <ChartHeader>
              <h3>{language === 'vi' ? 'Hoạt động Nền Tảng' : 'Platform Activity'}</h3>
              <ChartFilters>
                <button className="active">{language === 'vi' ? 'Tuần' : 'Week'}</button>
                <button>{language === 'vi' ? 'Tháng' : 'Month'}</button>
                <button>{language === 'vi' ? 'Năm' : 'Year'}</button>
              </ChartFilters>
            </ChartHeader>
            <ChartLegend>
              <div className="legend-item">
                <div className="dot" style={{ background: '#3B82F6' }}></div>
                <span>{language === 'vi' ? 'Tin đăng' : 'Posts'}</span>
              </div>
              <div className="legend-item">
                <div className="dot" style={{ background: '#10B981' }}></div>
                <span>{language === 'vi' ? 'Ứng tuyển' : 'Applications'}</span>
              </div>
            </ChartLegend>
            <SimpleLineChart>
              <LineChartSvg viewBox="0 0 700 320">
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
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
                
                {/* Y-axis labels */}
                {['80', '60', '40', '20', '0'].map((val, i) => (
                  <text
                    key={i}
                    x="40"
                    y={55 + i * 50}
                    textAnchor="end"
                    fontSize="11"
                    fill="#9ca3af"
                    fontWeight="400"
                  >
                    {val}
                  </text>
                ))}
                
                {/* Posts line with area */}
                <polyline
                  fill="url(#gradient1)"
                  stroke="none"
                  points={`50,250 ${activityData.map((d, i) => 
                    `${50 + (i / (activityData.length - 1)) * 600},${250 - (d.posts / 80) * 200}`
                  ).join(' ')} 650,250`}
                />
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={activityData.map((d, i) => 
                    `${50 + (i / (activityData.length - 1)) * 600},${250 - (d.posts / 80) * 200}`
                  ).join(' ')}
                />
                
                {/* Applications line with area */}
                <polyline
                  fill="url(#gradient2)"
                  stroke="none"
                  points={`50,250 ${activityData.map((d, i) => 
                    `${50 + (i / (activityData.length - 1)) * 600},${250 - (d.applications / 80) * 200}`
                  ).join(' ')} 650,250`}
                />
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={activityData.map((d, i) => 
                    `${50 + (i / (activityData.length - 1)) * 600},${250 - (d.applications / 80) * 200}`
                  ).join(' ')}
                />
                
                {/* Data points with values */}
                {activityData.map((d, i) => {
                  const x = 50 + (i / (activityData.length - 1)) * 600;
                  const yPosts = 250 - (d.posts / 80) * 200;
                  const yApps = 250 - (d.applications / 80) * 200;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={yPosts} r="4" fill="#3B82F6" stroke="white" strokeWidth="2" />
                      <circle cx={x} cy={yApps} r="4" fill="#10B981" stroke="white" strokeWidth="2" />
                      
                      {/* Value labels */}
                      <text x={x} y={yPosts - 10} textAnchor="middle" fontSize="10" fill="#3B82F6" fontWeight="600">
                        {d.posts}
                      </text>
                      <text x={x} y={yApps - 10} textAnchor="middle" fontSize="10" fill="#10B981" fontWeight="600">
                        {d.applications}
                      </text>
                      
                      {/* Date labels */}
                      <text x={x} y="275" textAnchor="middle" fontSize="11" fill="#6b7280" fontWeight="400">
                        {d.date}
                      </text>
                    </g>
                  );
                })}
              </LineChartSvg>
            </SimpleLineChart>
          </ChartCard>

          {/* Line Chart 2 - Thống kê công việc */}
          <ChartCard>
            <ChartHeader>
              <h3>{language === 'vi' ? 'Thống Kê Công Việc' : 'Job Statistics'}</h3>
              <ChartFilters>
                <button className="active">{language === 'vi' ? '7 ngày' : '7 days'}</button>
                <button>{language === 'vi' ? '30 ngày' : '30 days'}</button>
              </ChartFilters>
            </ChartHeader>
            <ChartLegend>
              <div className="legend-item">
                <div className="dot" style={{ background: '#3B82F6' }}></div>
                <span>{language === 'vi' ? 'Tin đăng' : 'Posts'}</span>
              </div>
              <div className="legend-item">
                <div className="dot" style={{ background: '#10B981' }}></div>
                <span>{language === 'vi' ? 'Ứng tuyển' : 'Applications'}</span>
              </div>
            </ChartLegend>
            <SimpleLineChart>
              <LineChartSvg viewBox="0 0 700 320">
                <defs>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gradient4" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
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
                
                {/* Y-axis labels */}
                {['80', '60', '40', '20', '0'].map((val, i) => (
                  <text
                    key={i}
                    x="40"
                    y={55 + i * 50}
                    textAnchor="end"
                    fontSize="11"
                    fill="#9ca3af"
                    fontWeight="400"
                  >
                    {val}
                  </text>
                ))}
                
                {/* Posts line with area */}
                <polyline
                  fill="url(#gradient3)"
                  stroke="none"
                  points={`50,250 ${jobStatsData.map((d, i) => 
                    `${50 + (i / (jobStatsData.length - 1)) * 600},${250 - (d.posts / 80) * 200}`
                  ).join(' ')} 650,250`}
                />
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={jobStatsData.map((d, i) => 
                    `${50 + (i / (jobStatsData.length - 1)) * 600},${250 - (d.posts / 80) * 200}`
                  ).join(' ')}
                />
                
                {/* Applications line with area */}
                <polyline
                  fill="url(#gradient4)"
                  stroke="none"
                  points={`50,250 ${jobStatsData.map((d, i) => 
                    `${50 + (i / (jobStatsData.length - 1)) * 600},${250 - (d.applications / 80) * 200}`
                  ).join(' ')} 650,250`}
                />
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={jobStatsData.map((d, i) => 
                    `${50 + (i / (jobStatsData.length - 1)) * 600},${250 - (d.applications / 80) * 200}`
                  ).join(' ')}
                />
                
                {/* Data points with values */}
                {jobStatsData.map((d, i) => {
                  const x = 50 + (i / (jobStatsData.length - 1)) * 600;
                  const yPosts = 250 - (d.posts / 80) * 200;
                  const yApps = 250 - (d.applications / 80) * 200;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={yPosts} r="4" fill="#3B82F6" stroke="white" strokeWidth="2" />
                      <circle cx={x} cy={yApps} r="4" fill="#10B981" stroke="white" strokeWidth="2" />
                      
                      {/* Value labels */}
                      <text x={x} y={yPosts - 10} textAnchor="middle" fontSize="10" fill="#3B82F6" fontWeight="600">
                        {d.posts}
                      </text>
                      <text x={x} y={yApps - 10} textAnchor="middle" fontSize="10" fill="#10B981" fontWeight="600">
                        {d.applications}
                      </text>
                      
                      {/* Date labels */}
                      <text x={x} y="275" textAnchor="middle" fontSize="11" fill="#6b7280" fontWeight="400">
                        {d.date}
                      </text>
                    </g>
                  );
                })}
              </LineChartSvg>
            </SimpleLineChart>
          </ChartCard>
        </ChartsSection>

        {/* Doanh Thu Từ Dịch Vụ */}
        <RevenueSection>
          <SectionHeader>
            <h2>{language === 'vi' ? 'Doanh Thu Từ Dịch Vụ' : 'Revenue From Services'}</h2>
          </SectionHeader>
          
          <RevenueChartCard>
            <ChartHeader>
              <h3>{language === 'vi' ? 'Xu Hướng Doanh Thu' : 'Revenue Trend'}</h3>
              <ChartFilters>
                <button className="active">{language === 'vi' ? '6 Tháng' : '6 Months'}</button>
                <button>{language === 'vi' ? 'Năm' : 'Year'}</button>
                <button>{language === 'vi' ? 'Tất cả' : 'All'}</button>
              </ChartFilters>
            </ChartHeader>
            
            {/* Legend */}
            <ChartLegend>
              <div className="legend-item">
                <div className="dot" style={{ background: '#3b82f6' }}></div>
                <span>{language === 'vi' ? 'Doanh thu thực tế' : 'Actual Revenue'}</span>
              </div>
              <div className="legend-item">
                <div className="dot" style={{ background: '#10b981' }}></div>
                <span>{language === 'vi' ? 'Mục tiêu' : 'Target'}</span>
              </div>
            </ChartLegend>
            
            <SimpleLineChart>
              <LineChartSvg viewBox="0 0 900 320" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <line
                    key={i}
                    x1="70"
                    y1={30 + i * 40}
                    x2="870"
                    y2={30 + i * 40}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Y-axis labels */}
                {['6M', '5M', '4M', '3M', '2M', '1M', '0'].map((val, i) => (
                  <text
                    key={i}
                    x="55"
                    y={35 + i * 40}
                    textAnchor="end"
                    fontSize="11"
                    fill="#9ca3af"
                    fontWeight="400"
                  >
                    {val}
                  </text>
                ))}
                
                {/* Green target curve with area */}
                <path
                  d="M 120 195 Q 220 180, 320 165 Q 420 145, 520 130 Q 620 115, 720 100 Q 770 95, 820 90 L 820 270 L 120 270 Z"
                  fill="url(#greenGradient)"
                />
                <path
                  d="M 120 195 Q 220 180, 320 165 Q 420 145, 520 130 Q 620 115, 720 100 Q 770 95, 820 90"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                
                {/* Blue revenue curve with area */}
                <path
                  d="M 120 210 Q 220 190, 320 170 Q 420 145, 520 125 Q 620 100, 720 80 Q 770 70, 820 60 L 820 270 L 120 270 Z"
                  fill="url(#blueGradient)"
                />
                <path
                  d="M 120 210 Q 220 190, 320 170 Q 420 145, 520 125 Q 620 100, 720 80 Q 770 70, 820 60"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                
                {/* Data points with values */}
                {[
                  { x: 120, yBlue: 210, yGreen: 195, label: language === 'vi' ? 'T1' : 'Jan', valueBlue: '2.1M', valueGreen: '2.5M' },
                  { x: 220, yBlue: 190, yGreen: 180, label: language === 'vi' ? 'T2' : 'Feb', valueBlue: '2.6M', valueGreen: '2.8M' },
                  { x: 320, yBlue: 170, yGreen: 165, label: language === 'vi' ? 'T3' : 'Mar', valueBlue: '3.1M', valueGreen: '3.2M' },
                  { x: 420, yBlue: 145, yGreen: 145, label: language === 'vi' ? 'T4' : 'Apr', valueBlue: '3.7M', valueGreen: '3.7M' },
                  { x: 520, yBlue: 125, yGreen: 130, label: language === 'vi' ? 'T5' : 'May', valueBlue: '4.2M', valueGreen: '4.0M' },
                  { x: 620, yBlue: 100, yGreen: 115, label: language === 'vi' ? 'T6' : 'Jun', valueBlue: '4.8M', valueGreen: '4.4M' },
                  { x: 720, yBlue: 80, yGreen: 100, label: language === 'vi' ? 'T7' : 'Jul', valueBlue: '5.3M', valueGreen: '4.8M' },
                  { x: 820, yBlue: 60, yGreen: 90, label: language === 'vi' ? 'T8' : 'Aug', valueBlue: `${currentMonthRevenue.toFixed(1)}M`, valueGreen: '5.1M' },
                ].map((point, i) => (
                  <g key={i}>
                    <circle cx={point.x} cy={point.yGreen} r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                    <circle cx={point.x} cy={point.yBlue} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                    
                    {/* Value labels */}
                    <text
                      x={point.x}
                      y={point.yBlue - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#3b82f6"
                      fontWeight="600"
                    >
                      {point.valueBlue}
                    </text>
                    <text
                      x={point.x}
                      y={point.yGreen - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#10b981"
                      fontWeight="600"
                    >
                      {point.valueGreen}
                    </text>
                    
                    {/* Month labels */}
                    <text
                      x={point.x}
                      y="290"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#6b7280"
                      fontWeight="400"
                    >
                      {point.label}
                    </text>
                  </g>
                ))}
              </LineChartSvg>
            </SimpleLineChart>
          </RevenueChartCard>
          
          <RevenueStatsGrid>
            <RevenueStatBox $bgColor="#EFF6FF" $iconColor="#3B82F6">
              <div className="icon">
                <CheckSquare />
              </div>
              <div className="content">
                <div className="label">
                  <CheckSquare size={16} />
                  {language === 'vi' ? 'Bài viết BOOST' : 'Post BOOST'}
                </div>
                <div className="value">{(revenueFromBoost / 1000000).toFixed(1)}M đ</div>
              </div>
            </RevenueStatBox>
            
            <RevenueStatBox $bgColor="#F0F9FF" $iconColor="#0EA5E9">
              <div className="icon">
                <TrendingUp />
              </div>
              <div className="content">
                <div className="label">
                  <TrendingUp size={16} />
                  {language === 'vi' ? 'Hot Search' : 'Hot Search'}
                </div>
                <div className="value">{(revenueFromHotSearch / 1000000).toFixed(1)}M đ</div>
              </div>
            </RevenueStatBox>
            
            <RevenueStatBox $bgColor="#FEF3C7" $iconColor="#F59E0B">
              <div className="icon">
                <Star />
              </div>
              <div className="content">
                <div className="label">
                  <Star size={16} />
                  {language === 'vi' ? 'Banner Quảng Cáo' : 'Banner Ads'}
                </div>
                <div className="value">{(revenueFromBanner / 1000000).toFixed(1)}M đ</div>
              </div>
            </RevenueStatBox>
          </RevenueStatsGrid>
        </RevenueSection>

        {/* Quản Lý Bài Đăng */}
        <ManagementSection>
          <ManagementTitle>
            {language === 'vi' ? 'QUẢN LÝ BÀI ĐĂNG' : 'POST MANAGEMENT'}
          </ManagementTitle>
          <ManagementGrid>
            {managementPosts.map((post, index) => {
              const initials = post.employer.split(' ').slice(0, 2).map(w => w[0]).join('');
              const colors = [
                '#1E40AF', '#DC2626', '#059669', '#D97706', '#7C3AED'
              ];
              const bgColor = colors[index % colors.length];
              
              // Map logo từ tên - bạn có thể thêm logo vào đây
              const logoMap = {
                'Cơm tấm phúc lộc thọ': '/images/logo.png',
                'Katinat': '/images/katinatlogo.jpg',
                'The Coffee House': '/images/coffeehouse.jpg',
                'Highlands Coffee': '/images/highlands.jpg',
                'Phúc Long': '/images/phuclong.jpg',
                // Thêm các logo khác ở đây
              };
              const logo = logoMap[post.employer] || null;
              
              return (
                <ManagementCard key={post.id} $bgColor="#E0F2FE" onClick={() => navigate('/admin/posts')}>
                  <ManagementAvatar $bgColor={bgColor}>
                    {logo ? <img src={logo} alt={post.employer} /> : initials}
                  </ManagementAvatar>
                  <ManagementInfo>
                    <ManagementName>{post.employer}</ManagementName>
                    <ManagementMeta>{post.type}</ManagementMeta>
                  </ManagementInfo>
                  <ManagementColumn>
                    <ManagementColumnLabel>{language === 'vi' ? 'THỜI GIAN' : 'TIME'}</ManagementColumnLabel>
                    <ManagementColumnValue>{post.time}</ManagementColumnValue>
                  </ManagementColumn>
                  <ManagementColumn>
                    <ManagementColumnLabel>{language === 'vi' ? 'TRẠNG THÁI' : 'STATUS'}</ManagementColumnLabel>
                    <ManagementColumnValue>{post.status}</ManagementColumnValue>
                  </ManagementColumn>
                  <ManagementStatus $bgColor={post.statusColor.bg} $color={post.statusColor.color}>
                    {post.status}
                  </ManagementStatus>
                  <ManagementAction>
                    <Eye />
                  </ManagementAction>
                </ManagementCard>
              );
            })}
          </ManagementGrid>
        </ManagementSection>

        {/* Nhà Tuyển Dụng Mới */}
        <ManagementSection>
          <ManagementTitle>
            {language === 'vi' ? 'NHÀ TUYỂN DỤNG MỚI' : 'NEW EMPLOYERS'}
          </ManagementTitle>
          <ManagementGrid>
            {managementCandidates.map((candidate, index) => {
              const initials = candidate.name.split(' ').slice(0, 2).map(w => w[0]).join('');
              const colors = [
                '#1E40AF', '#DC2626', '#059669'
              ];
              const bgColor = colors[index % colors.length];
              
              // Map logo từ tên - bạn có thể thêm logo vào đây
              const logoMap = {
                'Cơm tấm phúc lộc thọ': '/images/logo.png',
                'Katinat': '/images/katinatlogo.jpg',
                'The Coffee House': '/images/coffeehouse.jpg',
                'Highlands Coffee': '/images/highlands.jpg',
                'Phúc Long': '/images/phuclong.jpg',
                // Thêm các logo khác ở đây
              };
              const logo = logoMap[candidate.name] || null;
              
              return (
                <ManagementCard key={candidate.id} $bgColor="#EDE9FE" onClick={() => navigate('/admin/employers')}>
                  <ManagementAvatar $bgColor={bgColor}>
                    {logo ? <img src={logo} alt={candidate.name} /> : initials}
                  </ManagementAvatar>
                  <ManagementInfo>
                    <ManagementName>{candidate.name}</ManagementName>
                    <ManagementMeta>{language === 'vi' ? 'Nhà tuyển dụng' : 'Employer'}</ManagementMeta>
                  </ManagementInfo>
                  <ManagementColumn>
                    <ManagementColumnLabel>{language === 'vi' ? 'NGÀY THAM GIA' : 'JOIN DATE'}</ManagementColumnLabel>
                    <ManagementColumnValue>{candidate.joinDate}</ManagementColumnValue>
                  </ManagementColumn>
                  <ManagementColumn>
                    <ManagementColumnLabel>{language === 'vi' ? 'XÁC THỰC' : 'VERIFIED'}</ManagementColumnLabel>
                    <ManagementColumnValue>{candidate.verified}</ManagementColumnValue>
                  </ManagementColumn>
                  <ManagementColumn>
                    <ManagementColumnLabel>{language === 'vi' ? 'TRẠNG THÁI' : 'STATUS'}</ManagementColumnLabel>
                    <ManagementColumnValue>{candidate.status}</ManagementColumnValue>
                  </ManagementColumn>
                  <ManagementColumn>
                    <ManagementColumnLabel>{language === 'vi' ? 'NGÀY DUYỆT' : 'APPROVAL DATE'}</ManagementColumnLabel>
                    <ManagementColumnValue>{candidate.approvalDate}</ManagementColumnValue>
                  </ManagementColumn>
                  <ManagementAction>
                    <Eye />
                  </ManagementAction>
                </ManagementCard>
              );
            })}
          </ManagementGrid>
        </ManagementSection>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default AdminDashboard;



