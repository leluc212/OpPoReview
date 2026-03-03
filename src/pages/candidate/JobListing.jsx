import React, { useMemo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  Search, MapPin, Briefcase, DollarSign, Clock, Star, TrendingUp, 
  ChevronDown, Building2, Bookmark, Eye, ArrowUpRight, Filter,
  X, SlidersHorizontal, Grid, List, Sparkles, Zap, Navigation, Target
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

// Animations
const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const shimmer = `
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
`;

const Container = styled.div`
  ${fadeIn}
  animation: fadeIn 0.6s ease;
`;

const HeroSection = styled(motion.div)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 32px 40px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: pulse 8s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 0.5; }
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: white;
  margin-bottom: 6px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const HeroSubtitle = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.9);
  margin-bottom: 24px;
  font-weight: 500;
`;

const SearchContainer = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 8px;
  display: flex;
  gap: 8px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.bgDark};
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.textLight};
  }
  
  input {
    flex: 1;
    border: none;
    background: none;
    outline: none;
    font-size: 15px;
    color: #F1F5F9;
    
    &::placeholder {
      color: ${props => props.theme.colors.textLight};
    }
  }
`;

const SearchButton = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const QuickFilters = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`;

const FilterChip = styled(motion.button)`
  padding: 6px 14px;
  background: ${props => props.$active ? 'white' : 'rgba(255,255,255,0.2)'};
  color: ${props => props.$active ? props.theme.colors.primary : 'white'};
  border: 1px solid ${props => props.$active ? 'white' : 'rgba(255,255,255,0.3)'};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: white;
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

// Category Tabs
const CategoryTabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const CategoryTab = styled(motion.button)`
  flex: 1;
  padding: 16px 24px;
  background: ${props => props.$active 
    ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary})` 
    : props.theme.colors.bgLight};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  border: 2px solid ${props => props.$active ? 'transparent' : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: ${props => props.$active ? `0 8px 24px ${props.theme.colors.primary}30` : '0 2px 8px rgba(0,0,0,0.04)'};
  
  svg {
    width: 22px;
    height: 22px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px ${props => props.$active 
      ? `${props.theme.colors.primary}40` 
      : 'rgba(0,0,0,0.08)'};
    border-color: ${props => props.$active ? 'transparent' : props.theme.colors.primary};
  }
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 28px;
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FilterSidebar = styled(motion.aside)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.theme.colors.primary};
    }
  }
  
  @media (max-width: 1024px) {
    position: static;
    max-height: none;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg {
      width: 22px;
      height: 22px;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const ClearButton = styled.button`
  padding: 6px 12px;
  background: transparent;
  color: ${props => props.theme.colors.danger};
  border: 1px solid ${props => props.theme.colors.danger};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.danger};
    color: white;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  cursor: pointer;
  user-select: none;
  
  h4 {
    font-size: 15px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.theme.colors.textLight};
    transition: transform 0.2s ease;
    transform: ${props => props.$expanded ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const FilterOptions = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.bgLight};
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${props => props.theme.colors.primary};
  }
  
  span {
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    font-weight: 500;
  }
  
  small {
    margin-left: auto;
    font-size: 12px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 600;
  }
`;

const MainContent = styled.div``;

const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

const ResultsInfo = styled.div`
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
  }
`;

const ViewControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SortSelect = styled.select`
  padding: 10px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 4px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ViewButton = styled.button`
  padding: 8px 12px;
  background: ${props => props.$active ? 'white' : 'transparent'};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textLight};
  }
  
  &:hover svg {
    color: ${props => props.theme.colors.primary};
  }
`;

// Job Cards
const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const JobCardWrapper = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 12px 40px rgba(0,0,0,0.08);
    transform: translateY(-4px);
    
    &::before {
      opacity: 1;
    }
  }
`;

const JobCardHeader = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const CompanyLogo = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}15, ${props => props.theme.colors.secondary}15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
  border: 2px solid ${props => props.theme.colors.border};
`;

const JobInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const JobTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const CompanyName = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  margin-bottom: 5px;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const JobMeta = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const JobCardBody = styled.div`
  margin-bottom: 12px;
`;

const JobTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const Tag = styled.span`
  padding: 4px 10px;
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 11px;
  font-weight: 600;
  border: 1px solid ${props => props.theme.colors.border};
`;

const JobSalary = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(135deg, ${props => props.theme.colors.success}10, ${props => props.theme.colors.success}05);
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.success}30;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.colors.success};
  }
  
  span {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.colors.success};
  }
`;

const JobCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const JobActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled(motion.button)`
  padding: 8px 14px;
  background: ${props => props.$primary 
    ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary})`
    : props.theme.colors.bgLight};
  color: ${props => props.$primary ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.$primary ? 'transparent' : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.$primary 
      ? `${props.theme.colors.primary}40` 
      : 'rgba(0,0,0,0.08)'};
  }
`;

const SaveButton = styled(motion.button)`
  width: 34px;
  height: 34px;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.$saved ? props.theme.colors.warning + '15' : props.theme.colors.bgLight};
  color: ${props => props.$saved ? props.theme.colors.warning : props.theme.colors.textLight};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  svg {
    width: 16px;
    height: 16px;
    fill: ${props => props.$saved ? props.theme.colors.warning : 'none'};
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.warning};
    color: ${props => props.theme.colors.warning};
    background: ${props => props.theme.colors.warning}15;
  }
`;

const JobPosted = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  
  svg {
    width: 13px;
    height: 13px;
  }
`;

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Translate salary string based on language
const translateSalary = (salaryStr, language) => {
  if (language === 'vi') return salaryStr;
  return salaryStr
    .replace(/triệu VND/g, 'million VND')
    .replace(/\/ca/g, '/shift')
    .replace(/\/giờ/g, '/hour');
};

// Translate location string based on language
const translateLocation = (locationStr, language) => {
  if (language === 'vi') return locationStr;
  return locationStr
    .replace(/Quận/g, 'District')
    .replace(/TP\.HCM/g, 'HCMC')
    .replace(/Hà Nội/g, 'Hanoi')
    .replace(/Đà Nẵng/g, 'Da Nang')
    .replace(/Tân Bình/g, 'Tan Binh')
    .replace(/Phú Nhuận/g, 'Phu Nhuan')
    .replace(/Bình Thạnh/g, 'Binh Thanh')
    .replace(/Toàn/g, 'All');
};

// Translate time indicators
const translateTimePosted = (timeStr, language) => {
  if (language === 'vi') return timeStr;
  return timeStr
    .replace(/(\d+)\s*ngày trước/g, '$1 days ago')
    .replace(/(\d+)\s*giờ trước/g, '$1 hours ago')
    .replace(/1\s*days ago/g, '1 day ago')
    .replace(/1\s*hours ago/g, '1 hour ago');
};

// Parse time posted to hours for sorting (newer = smaller number)
const parseTimeToHours = (timeStr) => {
  // Extract number from string
  const match = timeStr.match(/(\d+)/);
  if (!match) return 999999; // Unknown time goes to end
  
  const num = parseInt(match[1]);
  
  // Convert to hours
  if (timeStr.includes('giờ') || timeStr.includes('hour')) {
    return num;
  } else if (timeStr.includes('ngày') || timeStr.includes('day')) {
    return num * 24;
  } else if (timeStr.includes('tuần') || timeStr.includes('week')) {
    return num * 24 * 7;
  } else if (timeStr.includes('tháng') || timeStr.includes('month')) {
    return num * 24 * 30;
  }
  
  return 999999; // Unknown format goes to end
};

// Translate job titles
const translateJobTitle = (titleStr, language) => {
  if (language === 'vi') return titleStr;
  
  const titleMap = {
    'Nhân viên Kế toán Tổng hợp': 'General Accountant',
    'Nhân viên Kinh doanh B2B': 'B2B Sales Executive',
    'Nhân viên Marketing Online': 'Online Marketing Staff',
    'Nhân viên Hành chính Nhân sự': 'HR & Admin Staff',
    'Nhân viên pha chế - Part-time': 'Barista - Part-time',
    'Thu ngân - Part-time': 'Cashier - Part-time',
    'Nhân viên phục vụ - Part-time': 'Service Staff - Part-time',
    'Pha chế trà sữa - Part-time': 'Bubble Tea Barista - Part-time',
    'Nhân viên Telesales': 'Telesales Staff',
    'Nhân viên Văn phòng': 'Office Staff',
    'Giáo viên Tiếng Anh': 'English Teacher',
    'Lễ tân - Receptionist': 'Receptionist',
    'Ca Đêm - Nhân viên bảo vệ': 'Night Shift - Security Guard',
    'Ca Sáng - Nhân viên kho': 'Morning Shift - Warehouse Staff',
    'Ca Chiều - Nhân viên phục vụ': 'Afternoon Shift - Service Staff',
    'Shift Supervisor - Ca đêm': 'Shift Supervisor - Night Shift',
    'Ca Linh Động - Nhân viên giao hàng': 'Flexible Shift - Delivery Staff',
    'Ca Sáng - Nhân viên bán hàng': 'Morning Shift - Sales Staff',
    'Ca Chiều - Nhân viên pha chế': 'Afternoon Shift - Barista',
    'Ca Tối - Thu ngân siêu thị': 'Evening Shift - Supermarket Cashier',
    'Ca Sáng - Phục vụ nhà hàng': 'Morning Shift - Restaurant Server',
    'Ca Linh Động - Nhân viên kho': 'Flexible Shift - Warehouse Staff'
  };
  
  return titleMap[titleStr] || titleStr;
};

// Translate tags
const translateTag = (tagStr, language) => {
  if (language === 'vi') return tagStr;
  
  const tagMap = {
    'Kế toán': 'Accounting',
    'Excel': 'Excel',
    'MISA': 'MISA',
    'Kinh doanh': 'Sales',
    'B2B': 'B2B',
    'Hoa hồng cao': 'High Commission',
    'Marketing': 'Marketing',
    'Facebook Ads': 'Facebook Ads',
    'SEO': 'SEO',
    'Nhân sự': 'HR',
    'Hành chính': 'Admin',
    'Office': 'Office',
    'Pha chế': 'Bartending',
    'Part-time': 'Part-time',
    'F&B': 'F&B',
    'Thu ngân': 'Cashier',
    'Bán lẻ': 'Retail',
    'Phục vụ': 'Service',
    'Coffee': 'Coffee',
    'Trà sữa': 'Bubble Tea',
    'Telesales': 'Telesales',
    'Gọi điện': 'Cold Calling',
    'Hoa hồng': 'Commission',
    'Văn phòng': 'Office Work',
    'Word/Excel': 'Word/Excel',
    'Giao tiếp': 'Communication',
    'Giáo viên': 'Teacher',
    'Tiếng Anh': 'English',
    'IELTS': 'IELTS',
    'Lễ tân': 'Receptionist',
    'Khách sạn': 'Hotel',
    'Ca đêm': 'Night Shift',
    'Bảo vệ': 'Security',
    'An ninh': 'Security',
    'Ca sáng': 'Morning Shift',
    'Kho vận': 'Warehouse',
    'Logistics': 'Logistics',
    'Ca chiều': 'Afternoon Shift',
    'Quản lý': 'Management',
    'Linh động': 'Flexible',
    'Giao hàng': 'Delivery',
    'Xe máy': 'Motorbike',
    'Bán hàng': 'Sales',
    'Cửa hàng': 'Store',
    'Nhà hàng': 'Restaurant',
    'Ca tối': 'Evening Shift',
    'Siêu thị': 'Supermarket'
  };
  
  return tagMap[tagStr] || tagStr;
};

// Translate job type
const translateJobType = (typeStr, language) => {
  if (language === 'vi') return typeStr;
  
  return typeStr
    .replace(/Ca đêm/g, 'Night Shift')
    .replace(/Ca sáng/g, 'Morning Shift')
    .replace(/Ca chiều/g, 'Afternoon Shift')
    .replace(/Ca tối/g, 'Evening Shift')
    .replace(/Ca linh động/g, 'Flexible Shift')
    .replace(/Part-time/g, 'Part-time')
    .replace(/Full-time/g, 'Full-time');
};

// Jobs data - moved outside component to avoid re-creation on each render
// Helper function to get jobs from localStorage
const getStoredJobs = () => {
  try {
    const storedJobs = localStorage.getItem('employerJobs');
    if (storedJobs) {
      const jobs = JSON.parse(storedJobs);
      // Transform employer jobs to candidate job format
      return jobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.department || 'Công ty',
        location: job.location,
        lat: 10.7769, // Default HCM location
        lng: 106.7009,
        type: job.jobType === 'full-time' ? 'Full-time' : 
              job.jobType === 'part-time' ? 'Part-time' :
              job.jobType === 'contract' ? 'Contract' :
              job.jobType === 'freelance' ? 'Freelance' : 'Full-time',
        category: 'standard',
        salary: job.salaryMin && job.salaryMax 
          ? `${job.salaryMin} - ${job.salaryMax}` 
          : job.salaryMin 
            ? `Từ ${job.salaryMin}` 
            : job.salaryMax
              ? `Tối đa ${job.salaryMax}`
              : 'Thỏa thuận',
        postedAt: job.posted || 'Vừa xong',
        tags: [
          job.experienceLevel === 'entry' ? 'Entry Level' : 
          job.experienceLevel === 'mid' ? 'Mid Level' :
          job.experienceLevel === 'senior' ? 'Senior' :
          job.experienceLevel === 'lead' ? 'Lead/Manager' : '',
          job.department || ''
        ].filter(Boolean),
        featured: false,
        urgent: false,
        views: job.views || 0
      }));
    }
  } catch (error) {
    console.error('Error loading jobs from localStorage:', error);
  }
  return [];
};

const JOBS_DATA = [
  // Standard Jobs - Full-time
  {
    id: 1,
    title: 'Nhân viên Kế toán Tổng hợp',
    company: 'Vinamilk',
    location: 'Quận 1, TP.HCM',
    lat: 10.7769,
    lng: 106.7009,
    type: 'Full-time',
    category: 'standard',
    salary: '12 - 18 triệu VND',
    postedAt: '2 ngày trước',
    tags: ['Kế toán', 'Excel', 'MISA'],
    featured: true,
    urgent: false,
    views: 245
  },
  {
    id: 2,
    title: 'Nhân viên Kinh doanh B2B',
    company: 'Viettel',
    location: 'Quận 7, TP.HCM',
    lat: 10.7333,
    lng: 106.7182,
    type: 'Full-time',
    category: 'standard',
    salary: '15 - 25 triệu VND',
    postedAt: '1 ngày trước',
    tags: ['Kinh doanh', 'B2B', 'Hoa hồng cao'],
    featured: true,
    urgent: false,
    views: 412
  },
  {
    id: 3,
    title: 'Nhân viên Marketing Online',
    company: 'Lazada Vietnam',
    location: 'Tân Bình, TP.HCM',
    lat: 10.7992,
    lng: 106.6550,
    type: 'Full-time',
    category: 'standard',
    salary: '10 - 15 triệu VND',
    postedAt: '3 ngày trước',
    tags: ['Marketing', 'Facebook Ads', 'SEO'],
    featured: false,
    urgent: false,
    views: 189
  },
  {
    id: 4,
    title: 'Nhân viên Hành chính Nhân sự',
    company: 'Samsung Vietnam',
    location: 'Quận 1, TP.HCM',
    lat: 10.7825,
    lng: 106.6958,
    type: 'Full-time',
    category: 'standard',
    salary: '9 - 13 triệu VND',
    postedAt: '5 ngày trước',
    tags: ['Nhân sự', 'Hành chính', 'Office'],
    featured: false,
    urgent: false,
    views: 321
  },
  {
    id: 5,
    title: 'Nhân viên pha chế - Part-time',
    company: 'The Coffee House',
    location: 'Quận 1, TP.HCM',
    lat: 10.7756,
    lng: 106.7004,
    type: 'Part-time',
    category: 'standard',
    salary: '25 - 35 triệu VND',
    postedAt: '2 ngày trước',
    tags: ['Pha chế', 'Part-time', 'F&B'],
    featured: false,
    urgent: false,
    views: 234
  },
  {
    id: 12,
    title: 'Thu ngân - Part-time',
    company: 'Lotte Mart',
    location: 'Quận 7, TP.HCM',
    lat: 10.7295,
    lng: 106.7195,
    type: 'Part-time',
    category: 'standard',
    salary: '22 - 30 triệu VND',
    postedAt: '3 ngày trước',
    tags: ['Thu ngân', 'Part-time', 'Bán lẻ'],
    featured: false,
    urgent: true,
    views: 189
  },
  {
    id: 13,
    title: 'Nhân viên phục vụ - Part-time',
    company: 'Starbucks Vietnam',
    location: 'Bình Thạnh, TP.HCM',
    lat: 10.8065,
    lng: 106.7147,
    type: 'Part-time',
    category: 'standard',
    salary: '20 - 28 triệu VND',
    postedAt: '1 ngày trước',
    tags: ['Phục vụ', 'Part-time', 'Coffee'],
    featured: false,
    urgent: false,
    views: 167
  },
  {
    id: 14,
    title: 'Pha chế trà sữa - Part-time',
    company: 'Gong Cha',
    location: 'Tân Bình, TP.HCM',
    lat: 10.7985,
    lng: 106.6635,
    type: 'Part-time',
    category: 'standard',
    salary: '23 - 32 triệu VND',
    postedAt: '4 ngày trước',
    tags: ['Pha chế', 'Part-time', 'Trà sữa'],
    featured: false,
    urgent: false,
    views: 198
  },
  {
    id: 6,
    title: 'Nhân viên Telesales',
    company: 'VNPT',
    location: 'Bình Thạnh, TP.HCM',
    lat: 10.8100,
    lng: 106.7089,
    type: 'Full-time',
    category: 'standard',
    salary: '8 - 20 triệu VND',
    postedAt: '4 ngày trước',
    tags: ['Telesales', 'Gọi điện', 'Hoa hồng'],
    featured: true,
    urgent: false,
    views: 278
  },
  {
    id: 15,
    title: 'Nhân viên Văn phòng',
    company: 'Hòa Phát Group',
    location: 'Quận 3, TP.HCM',
    lat: 10.7866,
    lng: 106.6906,
    type: 'Full-time',
    category: 'standard',
    salary: '8 - 12 triệu VND',
    postedAt: '2 ngày trước',
    tags: ['Văn phòng', 'Word/Excel', 'Giao tiếp'],
    featured: false,
    urgent: true,
    views: 312
  },
  {
    id: 16,
    title: 'Giáo viên Tiếng Anh',
    company: 'ILA Vietnam',
    location: 'Quận 10, TP.HCM',
    lat: 10.7735,
    lng: 106.6676,
    type: 'Full-time',
    category: 'standard',
    salary: '12 - 18 triệu VND',
    postedAt: '1 ngày trước',
    tags: ['Giáo viên', 'Tiếng Anh', 'IELTS'],
    featured: false,
    urgent: false,
    views: 256
  },
  {
    id: 17,
    title: 'Lễ tân - Receptionist',
    company: 'Sheraton Saigon',
    location: 'Quận 1, TP.HCM',
    lat: 10.7801,
    lng: 106.7002,
    type: 'Full-time',
    category: 'standard',
    salary: '9 - 14 triệu VND',
    postedAt: '3 ngày trước',
    tags: ['Lễ tân', 'Tiếng Anh', 'Khách sạn'],
    featured: false,
    urgent: false,
    views: 189
  },
  // Shift Jobs - Tuyển gấp
  {
    id: 7,
    title: 'Ca Đêm - Nhân viên bảo vệ',
    company: 'SecureGuard',
    location: 'Quận 1, TP.HCM',
    lat: 10.7730,
    lng: 106.6985,
    type: 'Ca đêm (22:00 - 06:00)',
    category: 'shift',
    salary: '200k - 250k/ca',
    postedAt: '1 ngày trước',
    tags: ['Ca đêm', 'Bảo vệ', 'An ninh'],
    featured: false,
    urgent: true,
    views: 156
  },
  {
    id: 8,
    title: 'Ca Sáng - Nhân viên kho',
    company: 'FastMove Logistics',
    location: 'Tân Bình, TP.HCM',
    lat: 10.7750,
    lng: 106.7000,
    type: 'Ca sáng (06:00 - 14:00)',
    category: 'shift',
    salary: '180k - 220k/ca',
    postedAt: '2 ngày trước',
    tags: ['Ca sáng', 'Kho vận', 'Logistics'],
    featured: true,
    urgent: true,
    views: 234
  },
  {
    id: 9,
    title: 'Ca Chiều - Nhân viên phục vụ',
    company: 'Highland Coffee',
    location: 'Phú Nhuận, TP.HCM',
    lat: 10.7700,
    lng: 106.6970,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '150k - 180k/ca',
    postedAt: '1 ngày trước',
    tags: ['Ca chiều', 'F&B', 'Phục vụ'],
    featured: false,
    urgent: true,
    views: 198
  },
  {
    id: 10,
    title: 'Shift Supervisor - Ca đêm',
    company: 'NightOwl Logistics',
    location: 'Quận 7, TP.HCM',
    lat: 10.7690,
    lng: 106.6990,
    type: 'Ca đêm (20:00 - 04:00)',
    category: 'shift',
    salary: '250k - 300k/ca',
    postedAt: '3 ngày trước',
    tags: ['Ca đêm', 'Quản lý', 'Logistics'],
    featured: true,
    urgent: true,
    views: 312
  },
  {
    id: 11,
    title: 'Ca Linh Động - Nhân viên giao hàng',
    company: 'Grab Express',
    location: 'Toàn TP.HCM',
    lat: 10.7740,
    lng: 106.6995,
    type: 'Ca linh động',
    category: 'shift',
    salary: '50k - 80k/giờ',
    postedAt: '1 ngày trước',
    tags: ['Linh động', 'Giao hàng', 'Xe máy'],
    featured: false,
    urgent: true,
    views: 445
  },
  {
    id: 18,
    title: 'Ca Sáng - Nhân viên bán hàng',
    company: 'Circle K',
    location: 'Quận 1, TP.HCM',
    lat: 10.7715,
    lng: 106.6975,
    type: 'Ca sáng (06:00 - 14:00)',
    category: 'shift',
    salary: '160k - 200k/ca',
    postedAt: '1 ngày trước',
    tags: ['Ca sáng', 'Bán hàng', 'Cửa hàng'],
    featured: false,
    urgent: true,
    views: 167
  },
  {
    id: 19,
    title: 'Ca Chiều - Nhân viên pha chế',
    company: 'The Coffee House',
    location: 'Quận 1, TP.HCM',
    lat: 10.7735,
    lng: 106.7005,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '170k - 210k/ca',
    postedAt: '2 giờ trước',
    tags: ['Ca chiều', 'Pha chế', 'F&B'],
    featured: true,
    urgent: true,
    views: 223
  },
  {
    id: 20,
    title: 'Ca Tối - Thu ngân siêu thị',
    company: 'Lotte Mart',
    location: 'Quận 3, TP.HCM',
    lat: 10.7760,
    lng: 106.6960,
    type: 'Ca tối (18:00 - 22:00)',
    category: 'shift',
    salary: '150k - 180k/ca',
    postedAt: '3 giờ trước',
    tags: ['Ca tối', 'Thu ngân', 'Siêu thị'],
    featured: false,
    urgent: true,
    views: 189
  },
  {
    id: 21,
    title: 'Ca Sáng - Phục vụ nhà hàng',
    company: 'KFC Việt Nam',
    location: 'Quận 1, TP.HCM',
    lat: 10.7710,
    lng: 106.6965,
    type: 'Ca sáng (07:00 - 15:00)',
    category: 'shift',
    salary: '155k - 190k/ca',
    postedAt: '5 giờ trước',
    tags: ['Ca sáng', 'Phục vụ', 'Nhà hàng'],
    featured: false,
    urgent: true,
    views: 201
  },
  {
    id: 22,
    title: 'Ca Linh Động - Nhân viên kho',
    company: 'Lazada Express',
    location: 'Quận 1, TP.HCM',
    lat: 10.7745,
    lng: 106.6955,
    type: 'Ca linh động',
    category: 'shift',
    salary: '60k - 90k/giờ',
    postedAt: '1 ngày trước',
    tags: ['Linh động', 'Kho vận', 'Part-time'],
    featured: false,
    urgent: true,
    views: 156
  },
  {
    id: 23,
    title: 'Ca Chiều - Nhân viên bảo vệ',
    company: 'G4S Security',
    location: 'Quận 1, TP.HCM',
    lat: 10.7720,
    lng: 106.7010,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '180k - 220k/ca',
    postedAt: '4 giờ trước',
    tags: ['Ca chiều', 'Bảo vệ', 'An ninh'],
    featured: false,
    urgent: true,
    views: 134
  },
  {
    id: 24,
    title: 'Ca Tối - Nhân viên Café',
    company: 'Highlands Coffee - Làng ĐH',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8520,
    lng: 106.8360,
    type: 'Ca tối (18:00 - 23:00)',
    category: 'shift',
    salary: '165k - 200k/ca',
    postedAt: '3 giờ trước',
    tags: ['Ca tối', 'F&B', 'Pha chế'],
    featured: false,
    urgent: true,
    views: 178
  },
  {
    id: 25,
    title: 'Ca Sáng - Phục vụ Quán ăn',
    company: 'Cơm Tấm Sườn Bì Chả',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8490,
    lng: 106.8380,
    type: 'Ca sáng (06:00 - 12:00)',
    category: 'shift',
    salary: '140k - 170k/ca',
    postedAt: '5 giờ trước',
    tags: ['Ca sáng', 'Phục vụ', 'Quán ăn'],
    featured: false,
    urgent: true,
    views: 145
  },
  {
    id: 26,
    title: 'Ca Chiều - Gia sư Toán Lý',
    company: 'Trung tâm gia sư SmartEdu',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8530,
    lng: 106.8350,
    type: 'Ca chiều (14:00 - 20:00)',
    category: 'shift',
    salary: '200k - 300k/ca',
    postedAt: '1 ngày trước',
    tags: ['Ca chiều', 'Gia sư', 'Giảng dạy'],
    featured: true,
    urgent: true,
    views: 267
  },
  {
    id: 27,
    title: 'Ca Đêm - Giao hàng đêm',
    company: 'Now Food - Khu ĐH',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8480,
    lng: 106.8390,
    type: 'Ca đêm (20:00 - 02:00)',
    category: 'shift',
    salary: '180k - 250k/ca',
    postedAt: '6 giờ trước',
    tags: ['Ca đêm', 'Giao hàng', 'Xe máy'],
    featured: false,
    urgent: true,
    views: 198
  },
  {
    id: 28,
    title: 'Ca Sáng - Nhân viên kho',
    company: 'Shopee Warehouse',
    location: 'Quận 9, TP.HCM',
    lat: 10.8510,
    lng: 106.8340,
    type: 'Ca sáng (07:00 - 15:00)',
    category: 'shift',
    salary: '175k - 210k/ca',
    postedAt: '2 ngày trước',
    tags: ['Ca sáng', 'Kho vận', 'Logistics'],
    featured: false,
    urgent: true,
    views: 223
  },
  {
    id: 29,
    title: 'Ca Chiều - Phục vụ Trà sữa',
    company: 'Gong Cha - Thủ Đức',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8500,
    lng: 106.8370,
    type: 'Ca chiều (14:00 - 22:00)',
    category: 'shift',
    salary: '160k - 195k/ca',
    postedAt: '4 giờ trước',
    tags: ['Ca chiều', 'Phục vụ', 'Trà sữa'],
    featured: false,
    urgent: true,
    views: 187
  },
  {
    id: 30,
    title: 'Ca Sáng - Thu ngân',
    company: 'Circle K - Khu ĐH',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8540,
    lng: 106.8330,
    type: 'Ca sáng (06:00 - 14:00)',
    category: 'shift',
    salary: '155k - 185k/ca',
    postedAt: '2 giờ trước',
    tags: ['Ca sáng', 'Thu ngân', 'Cửa hàng'],
    featured: true,
    urgent: true,
    views: 234
  },
  {
    id: 31,
    title: 'Ca Tối - Bartender',
    company: 'Pub & Beer Garden',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8470,
    lng: 106.8400,
    type: 'Ca tối (18:00 - 01:00)',
    category: 'shift',
    salary: '190k - 250k/ca',
    postedAt: '5 giờ trước',
    tags: ['Ca tối', 'Bartender', 'Pha chế'],
    featured: false,
    urgent: true,
    views: 156
  },
  {
    id: 32,
    title: 'Ca Linh Động - Shipper',
    company: 'Grab Food',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8495,
    lng: 106.8385,
    type: 'Ca linh động',
    category: 'shift',
    salary: '60k - 100k/giờ',
    postedAt: '1 ngày trước',
    tags: ['Linh động', 'Giao hàng', 'Xe máy'],
    featured: true,
    urgent: true,
    views: 412
  },
  {
    id: 33,
    title: 'Ca Chiều - Nhân viên KFC',
    company: 'KFC - Đại học Quốc gia',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8515,
    lng: 106.8365,
    type: 'Ca chiều (15:00 - 23:00)',
    category: 'shift',
    salary: '170k - 210k/ca',
    postedAt: '3 giờ trước',
    tags: ['Ca chiều', 'Fast food', 'Phục vụ'],
    featured: false,
    urgent: true,
    views: 289
  },
  {
    id: 34,
    title: 'Ca Sáng - Lễ tân Văn phòng',
    company: 'CoWorking Space TD',
    location: 'Thủ Đức, TP.HCM',
    lat: 10.8485,
    lng: 106.8355,
    type: 'Ca sáng (08:00 - 16:00)',
    category: 'shift',
    salary: '175k - 220k/ca',
    postedAt: '1 ngày trước',
    tags: ['Ca sáng', 'Lễ tân', 'Văn phòng'],
    featured: false,
    urgent: true,
    views: 167
  }
];

const JobListing = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const resultsRef = useRef(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [jobCategory, setJobCategory] = useState('standard'); // 'standard' or 'shift'
  
  // Merge stored jobs with default jobs data
  const allJobs = useMemo(() => {
    const storedJobs = getStoredJobs();
    return [...storedJobs, ...JOBS_DATA];
  }, []); // Re-calculate when component mounts
  
  const [quickFilter, setQuickFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list');
  const [expandedFilters, setExpandedFilters] = useState({
    jobType: true,
    experience: true,
    salary: true,
    company: true
  });

  // Filter states
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  
  // Location-based states
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showNearbyJobs, setShowNearbyJobs] = useState(false);
  const [nearbyRadius, setNearbyRadius] = useState(3); // km
  const [showSavedJobsOnly, setShowSavedJobsOnly] = useState(false);

  // Check if we're on saved jobs page
  useEffect(() => {
    // Removed - no longer using separate route for saved jobs
  }, [location.pathname]);

  // Load saved jobs from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(saved.map(job => job.id));
  }, []);

  // Handle search from Navbar
  useEffect(() => {
    if (location.state?.searchKeyword) {
      setSearchKeyword(location.state.searchKeyword);
    }
  }, [location.state]);

  // Scroll to results function
  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  };

  // Auto scroll to results when searching
  useEffect(() => {
    if (searchKeyword || selectedLocation) {
      const timer = setTimeout(() => {
        scrollToResults();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [searchKeyword, selectedLocation]);

  // Auto scroll when filters change
  useEffect(() => {
    if (selectedJobTypes.length > 0 || selectedExperience.length > 0 || 
        selectedSalaryRanges.length > 0 || selectedCompanies.length > 0) {
      scrollToResults();
    }
  }, [selectedJobTypes, selectedExperience, selectedSalaryRanges, selectedCompanies]);

  // Reset nearby jobs when switching from shift to standard category
  useEffect(() => {
    if (jobCategory === 'standard') {
      setShowNearbyJobs(false);
    }
  }, [jobCategory]);

  // Get user's current location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoadingLocation(false);
          setShowNearbyJobs(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to a default location in Ho Chi Minh City (Ben Thanh Market)
          setUserLocation({
            lat: 10.7723,
            lng: 106.6981
          });
          setIsLoadingLocation(false);
          setShowNearbyJobs(true);
        }
      );
    } else {
      // Browser doesn't support geolocation, use default location
      setUserLocation({
        lat: 10.7723,
        lng: 106.6981
      });
      setIsLoadingLocation(false);
      setShowNearbyJobs(true);
    }
  };

  const handleSaveJob = (jobId, e) => {
    e?.stopPropagation();
    
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;
    
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const isAlreadySaved = saved.some(j => j.id === jobId);
    
    let updated;
    if (isAlreadySaved) {
      updated = saved.filter(j => j.id !== jobId);
    } else {
      updated = [...saved, job];
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(updated));
    
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleJobClick = (jobId) => {
    // Job detail page removed
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Toggle filter handlers
  const toggleJobType = (type) => {
    setSelectedJobTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleExperience = (level) => {
    setSelectedExperience(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const toggleSalaryRange = (range) => {
    setSelectedSalaryRanges(prev => 
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const toggleCompany = (company) => {
    setSelectedCompanies(prev => 
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    );
  };

  const clearAllFilters = () => {
    setSearchKeyword('');
    setSelectedLocation('');
    setSelectedJobTypes([]);
    setSelectedExperience([]);
    setSelectedSalaryRanges([]);
    setSelectedCompanies([]);
    setQuickFilter('all');
  };

  // Helper functions for filtering
  const getSalaryValue = (salaryStr) => {
    const match = salaryStr.match(/(\d+)/);
    return match ? parseInt(match[0]) : 0;
  };

  const isInSalaryRange = (salary, range) => {
    const value = getSalaryValue(salary);
    
    if (jobCategory === 'standard') {
      switch(range) {
        case '0-50': return value < 50;
        case '50-100': return value >= 50 && value < 100;
        case '100-150': return value >= 100 && value < 150;
        case '150+': return value >= 150;
        default: return true;
      }
    } else {
      switch(range) {
        case '0-150k': return value < 150;
        case '150-200k': return value >= 150 && value < 200;
        case '200-250k': return value >= 200 && value < 250;
        case '250k+': return value >= 250;
        default: return true;
      }
    }
  };

  const getExperienceLevel = (jobTitle) => {
    const title = jobTitle.toLowerCase();
    if (title.includes('intern') || title.includes('thực tập')) return 'intern';
    if (title.includes('junior') || title.includes('fresher')) return 'junior';
    if (title.includes('senior')) return 'senior';
    return 'mid';
  };

  // Get nearby jobs
  const nearbyJobs = useMemo(() => {
    if (!userLocation) return [];
    
    return allJobs
      .filter(job => job.category === jobCategory)
      .map(job => ({
        ...job,
        distance: calculateDistance(userLocation.lat, userLocation.lng, job.lat, job.lng)
      }))
      .filter(job => job.distance <= nearbyRadius)
      .sort((a, b) => a.distance - b.distance);
  }, [userLocation, jobCategory, nearbyRadius, allJobs]);

  // Advanced filtering with useMemo for performance
  const filteredJobs = useMemo(() => {
    let result = allJobs;
    
    // Filter by saved jobs only
    if (showSavedJobsOnly) {
      result = result.filter(job => savedJobs.includes(job.id));
      // Don't apply category filter for saved jobs
    } else {
      // For shift jobs, only show nearby jobs when location is enabled
      if (jobCategory === 'shift') {
        if (!showNearbyJobs) {
          return []; // Don't show any jobs until location is enabled
        }
        return nearbyJobs; // Show only nearby jobs within radius
      }
      
      result = result.filter(job => job.category === jobCategory);
    }
    
    // Add distance if user location is available
    if (userLocation) {
      result = result.map(job => ({
        ...job,
        distance: calculateDistance(userLocation.lat, userLocation.lng, job.lat, job.lng)
      }));
    }

    // Search by keyword
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim();
      result = result.filter(job => {
        const locationParts = job.location.toLowerCase().split(',').map(part => part.trim());
        const locationMatch = locationParts.some(part => 
          part === keyword || part.startsWith(keyword + ' ') || part.includes(keyword)
        );
        return (
          job.title.toLowerCase().includes(keyword) ||
          job.company.toLowerCase().includes(keyword) ||
          job.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
          locationMatch
        );
      });
    }

    // Filter by location
    if (selectedLocation.trim()) {
      const location = selectedLocation.toLowerCase().trim();
      result = result.filter(job => {
        const locationParts = job.location.toLowerCase().split(',').map(part => part.trim());
        // Exact match or starts with search term followed by space
        return locationParts.some(part => {
          return part === location || part.startsWith(location + ' ');
        });
      });
    }

    // Filter by job type
    if (selectedJobTypes.length > 0) {
      result = result.filter(job => 
        selectedJobTypes.some(type => job.type.toLowerCase().includes(type.toLowerCase()))
      );
    }

    // Filter by experience (standard jobs only)
    if (selectedExperience.length > 0 && jobCategory === 'standard') {
      result = result.filter(job => 
        selectedExperience.includes(getExperienceLevel(job.title))
      );
    }

    // Filter by salary range
    if (selectedSalaryRanges.length > 0) {
      result = result.filter(job => 
        selectedSalaryRanges.some(range => isInSalaryRange(job.salary, range))
      );
    }

    // Filter by company
    if (selectedCompanies.length > 0) {
      result = result.filter(job => 
        selectedCompanies.includes(job.company)
      );
    }

    // Quick filters
    if (quickFilter === 'urgent') result = result.filter(job => job.urgent);
    if (quickFilter === 'featured') result = result.filter(job => job.featured);
    if (quickFilter === 'saved') result = result.filter(job => savedJobs.includes(job.id));

    // Sorting
    result = [...result].sort((a, b) => {
      switch(sortBy) {
        case 'salary':
          return getSalaryValue(b.salary) - getSalaryValue(a.salary);
        case 'views':
          return b.views - a.views;
        case 'newest':
          // Sort by posted time (newer jobs first - smaller hours value = more recent)
          return parseTimeToHours(a.postedAt) - parseTimeToHours(b.postedAt);
        case 'relevant':
        default:
          return 0;
      }
    });

    return result;
  }, [jobCategory, searchKeyword, selectedLocation, selectedJobTypes, 
      selectedExperience, selectedSalaryRanges, selectedCompanies, 
      quickFilter, savedJobs, sortBy, userLocation, showNearbyJobs, nearbyJobs, allJobs, showSavedJobsOnly]);

  const categoryJobs = allJobs.filter(job => job.category === jobCategory);

  return (
    <DashboardLayout role="candidate">
      <Container>
        {/* Hero Search Section */}
        <HeroSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroContent>
            <HeroTitle>
              {jobCategory === 'standard' 
                ? (language === 'vi' ? 'Tìm công việc mơ ước của bạn ' : 'Find Your Dream Job ')
                : (language === 'vi' ? 'Công việc theo ca - Tuyển gấp ' : 'Shift Jobs - Hiring Now ')}
            </HeroTitle>
            <HeroSubtitle>
              {jobCategory === 'standard'
                ? (language === 'vi' 
                    ? `Hơn ${allJobs.filter(j => j.category === 'standard').length} công việc tiêu chuẩn đang chờ bạn khám phá` 
                    : `Over ${allJobs.filter(j => j.category === 'standard').length} standard jobs waiting for you to explore`)
                : (language === 'vi'
                    ? `${allJobs.filter(j => j.category === 'shift').length} công việc theo ca đang tuyển gấp, làm ngay hôm nay!`
                    : `${allJobs.filter(j => j.category === 'shift').length} shift jobs hiring urgently, start today!`)}
            </HeroSubtitle>
            
            <SearchContainer>
              <SearchInput>
                <Search />
                <input 
                  type="text" 
                  placeholder={language === 'vi' ? 'Tìm theo vị trí, công ty, kỹ năng...' : 'Search by position, company, skills...'}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      scrollToResults();
                    }
                  }}
                />
              </SearchInput>
              
              <SearchInput>
                <MapPin />
                <input 
                  type="text" 
                  placeholder={language === 'vi' ? 'Địa điểm' : 'Location'}
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      scrollToResults();
                    }
                  }}
                />
              </SearchInput>
              
              <SearchButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToResults}
              >
                <Search />
                {language === 'vi' ? 'Tìm kiếm' : 'Search'}
              </SearchButton>
            </SearchContainer>
            
            {/* Location-based search button - Only for shift jobs */}
            {jobCategory === 'shift' && (
              <motion.div
                style={{ 
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={getUserLocation}
                disabled={isLoadingLocation}
                style={{
                  padding: '12px 24px',
                  background: showNearbyJobs 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : 'rgba(255, 255, 255, 0.15)',
                  border: showNearbyJobs 
                    ? '2px solid rgba(16, 185, 129, 0.5)'
                    : '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoadingLocation ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isLoadingLocation ? (
                  <>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    {language === 'vi' ? 'Đang lấy vị trí...' : 'Getting location...'}
                  </>
                ) : (
                  <>
                    <Navigation size={16} />
                    {showNearbyJobs 
                      ? (language === 'vi' ? 'Vị trí đã bật' : 'Location Enabled') 
                      : (language === 'vi' ? 'Tìm việc gần tôi' : 'Find Jobs Near Me')}
                  </>
                )}
              </motion.button>
              
              {showNearbyJobs && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  {language === 'vi' 
                    ? `Tìm thấy ${nearbyJobs.length} việc làm trong bán kính ${nearbyRadius}km`
                    : `Found ${nearbyJobs.length} jobs within ${nearbyRadius}km radius`}
                </motion.span>
              )}
              </motion.div>
            )}
          </HeroContent>
        </HeroSection>

        {/* Category Tabs */}
        <CategoryTabs>
          <CategoryTab
            $active={jobCategory === 'standard' && !showSavedJobsOnly}
            onClick={() => {
              setJobCategory('standard');
              setQuickFilter('all');
              setShowSavedJobsOnly(false);
              navigate('/candidate/jobs');
              setTimeout(() => scrollToResults(), 100);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Briefcase />
            {language === 'vi' ? 'Công việc đã lưu' : 'Standard Jobs'}
            <span style={{ marginLeft: 'auto', fontSize: '14px', opacity: 0.9 }}>
              ({allJobs.filter(j => j.category === 'standard').length})
            </span>
          </CategoryTab>
          
          <CategoryTab
            $active={jobCategory === 'shift' && !showSavedJobsOnly}
            onClick={() => {
              setJobCategory('shift');
              setQuickFilter('all');
              setShowSavedJobsOnly(false);
              navigate('/candidate/jobs');
              setTimeout(() => scrollToResults(), 100);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap />
            {language === 'vi' ? 'Công việc theo ca - Tuyển gấp' : 'Shift Jobs - Hiring Now'}
            <span style={{ marginLeft: 'auto', fontSize: '14px', opacity: 0.9 }}>
              ({allJobs.filter(j => j.category === 'shift').length})
            </span>
          </CategoryTab>
          
          <CategoryTab
            $active={showSavedJobsOnly}
            onClick={() => {
              setShowSavedJobsOnly(true);
              setTimeout(() => scrollToResults(), 100);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Bookmark />
            {language === 'vi' ? 'Công việc đã lưu' : 'Saved Jobs'}
            <span style={{ marginLeft: 'auto', fontSize: '14px', opacity: 0.9 }}>
              ({savedJobs.length})
            </span>
          </CategoryTab>
        </CategoryTabs>

        {/* Nearby Jobs Section - Hidden now, jobs shown in main list */}

        {/* Main Content with Filters */}
        <MainLayout>
          {/* Filter Sidebar */}
          <FilterSidebar
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FilterHeader>
              <h3>
                <SlidersHorizontal />
                {language === 'vi' ? 'Bộ lọc' : 'Filters'}
              </h3>
              <ClearButton onClick={clearAllFilters}>{language === 'vi' ? 'Xóa' : 'Clear'}</ClearButton>
            </FilterHeader>

            <FilterSection>
              <FilterTitle onClick={() => toggleFilter('jobType')} $expanded={expandedFilters.jobType}>
                <h4>{jobCategory === 'standard' 
                  ? (language === 'vi' ? 'Loại hình công việc' : 'Job Type')
                  : (language === 'vi' ? 'Loại ca làm việc' : 'Shift Type')}</h4>
                <ChevronDown />
              </FilterTitle>
              {expandedFilters.jobType && (
                <FilterOptions
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                >
                  {jobCategory === 'standard' ? (
                    <>
                      <FilterOption>
                        <input 
                          type="checkbox" 
                          id="fulltime" 
                          checked={selectedJobTypes.includes('full-time')}
                          onChange={() => toggleJobType('full-time')}
                        />
                        <span>{language === 'vi' ? 'Toàn thời gian' : 'Full-time'}</span>
                        <small>28</small>
                      </FilterOption>
                      <FilterOption>
                        <input 
                          type="checkbox" 
                          id="parttime" 
                          checked={selectedJobTypes.includes('part-time')}
                          onChange={() => toggleJobType('part-time')}
                        />
                        <span>{language === 'vi' ? 'Bán thời gian' : 'Part-time'}</span>
                        <small>12</small>
                      </FilterOption>
                    </>
                  ) : (
                    <>
                      <FilterOption>
                        <input 
                          type="checkbox" 
                          id="morning" 
                          checked={selectedJobTypes.includes('sáng')}
                          onChange={() => toggleJobType('sáng')}
                        />
                        <span>{language === 'vi' ? 'Ca sáng (6h-14h)' : 'Morning Shift (6AM-2PM)'}</span>
                        <small>8</small>
                      </FilterOption>
                      <FilterOption>
                        <input 
                          type="checkbox" 
                          id="afternoon" 
                          checked={selectedJobTypes.includes('chiều')}
                          onChange={() => toggleJobType('chiều')}
                        />
                        <span>{language === 'vi' ? 'Ca chiều (14h-22h)' : 'Afternoon Shift (2PM-10PM)'}</span>
                        <small>6</small>
                      </FilterOption>
                      <FilterOption>
                        <input 
                          type="checkbox" 
                          id="night" 
                          checked={selectedJobTypes.includes('đêm')}
                          onChange={() => toggleJobType('đêm')}
                        />
                        <span>{language === 'vi' ? 'Ca đêm (22h-6h)' : 'Night Shift (10PM-6AM)'}</span>
                        <small>5</small>
                      </FilterOption>
                      <FilterOption>
                        <input 
                          type="checkbox" 
                          id="flexible" 
                          checked={selectedJobTypes.includes('linh động')}
                          onChange={() => toggleJobType('linh động')}
                        />
                        <span>{language === 'vi' ? 'Ca linh động' : 'Flexible Shift'}</span>
                        <small>4</small>
                      </FilterOption>
                    </>
                  )}
                </FilterOptions>
              )}
            </FilterSection>

            {jobCategory === 'standard' && (
              <FilterSection>
                <FilterTitle onClick={() => toggleFilter('experience')} $expanded={expandedFilters.experience}>
                  <h4>{language === 'vi' ? 'Kinh nghiệm' : 'Experience'}</h4>
                  <ChevronDown />
                </FilterTitle>
                {expandedFilters.experience && (
                  <FilterOptions
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                  >
                    <FilterOption>
                      <input 
                        type="checkbox" 
                        id="intern" 
                        checked={selectedExperience.includes('intern')}
                        onChange={() => toggleExperience('intern')}
                      />
                      <span>{language === 'vi' ? 'Thực tập sinh' : 'Intern'}</span>
                      <small>15</small>
                    </FilterOption>
                    <FilterOption>
                      <input 
                        type="checkbox" 
                        id="junior" 
                        checked={selectedExperience.includes('junior')}
                        onChange={() => toggleExperience('junior')}
                      />
                      <span>{language === 'vi' ? 'Junior (0-2 năm)' : 'Junior (0-2 years)'}</span>
                      <small>28</small>
                    </FilterOption>
                    <FilterOption>
                      <input 
                        type="checkbox" 
                        id="mid" 
                        checked={selectedExperience.includes('mid')}
                        onChange={() => toggleExperience('mid')}
                      />
                      <span>{language === 'vi' ? 'Middle (2-5 năm)' : 'Middle (2-5 years)'}</span>
                      <small>32</small>
                    </FilterOption>
                  </FilterOptions>
                )}
              </FilterSection>
            )}

            <FilterSection>
              <FilterTitle onClick={() => toggleFilter('salary')} $expanded={expandedFilters.salary}>
                <h4>{jobCategory === 'standard' 
                  ? (language === 'vi' ? 'Mức lương' : 'Salary')
                  : (language === 'vi' ? 'Thu nhập/ca' : 'Income/Shift')}</h4>
                <ChevronDown />
              </FilterTitle>
              {expandedFilters.salary && (
                <FilterOptions
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                >
                  {jobCategory === 'standard' ? (
                    <>
                      <FilterOption>
                        <input 
                          type="checkbox" 
                          id="0-50" 
                          checked={selectedSalaryRanges.includes('0-50')}
                          onChange={() => toggleSalaryRange('0-50')}
                        />
                        <span>{language === 'vi' ? 'Dưới 50 triệu' : 'Under 50 million'}</span>
                        <small>12</small>
                      </FilterOption>
                      <FilterOption>
                        <input 
                          type="checkbox" 
                          id="50-100" 
                          checked={selectedSalaryRanges.includes('50-100')}
                          onChange={() => toggleSalaryRange('50-100')}
                        />
                        <span>{language === 'vi' ? '50 - 100 triệu' : '50 - 100 million'}</span>
                        <small>25</small>
                      </FilterOption>
                      <FilterOption>
                        <input 
                          type="checkbox" 
                          id="100-150" 
                          checked={selectedSalaryRanges.includes('100-150')}
                          onChange={() => toggleSalaryRange('100-150')}
                        />
                        <span>{language === 'vi' ? '100 - 150 triệu' : '100 - 150 million'}</span>
                        <small>18</small>
                      </FilterOption>
                    </>
                  ) : (
                    <>
                      <FilterOption>
                        <input 
                          type="checkbox" 
                          id="0-150k" 
                          checked={selectedSalaryRanges.includes('0-150k')}
                          onChange={() => toggleSalaryRange('0-150k')}
                        />
                        <span>{language === 'vi' ? 'Dưới 150k/ca' : 'Under 150k/shift'}</span>
                        <small>5</small>
                      </FilterOption>
                      <FilterOption>
                        <input 
                          type="checkbox" 
                          id="150-200k" 
                          checked={selectedSalaryRanges.includes('150-200k')}
                          onChange={() => toggleSalaryRange('150-200k')}
                        />
                        <span>{language === 'vi' ? '150k - 200k/ca' : '150k - 200k/shift'}</span>
                        <small>8</small>
                      </FilterOption>
                      <FilterOption>
                        <input 
                          type="checkbox" 
                          id="200-250k" 
                          checked={selectedSalaryRanges.includes('200-250k')}
                          onChange={() => toggleSalaryRange('200-250k')}
                        />
                        <span>{language === 'vi' ? '200k - 250k/ca' : '200k - 250k/shift'}</span>
                        <small>6</small>
                      </FilterOption>
                      <FilterOption>
                        <input 
                          type="checkbox" 
                          id="250k+" 
                          checked={selectedSalaryRanges.includes('250k+')}
                          onChange={() => toggleSalaryRange('250k+')}
                        />
                        <span>{language === 'vi' ? 'Trên 250k/ca' : 'Over 250k/shift'}</span>
                        <small>4</small>
                      </FilterOption>
                    </>
                  )}
                </FilterOptions>
              )}
            </FilterSection>
          </FilterSidebar>

          {/* Jobs List */}
          <MainContent ref={resultsRef}>
            <ContentHeader>
              <ResultsInfo>
                <h2>
                  {jobCategory === 'standard' 
                    ? (language === 'vi' ? 'Công việc tiêu chuẩn' : 'Standard Jobs')
                    : (language === 'vi' ? 'Công việc theo ca' : 'Shift Jobs')}
                </h2>
                <p>{language === 'vi' 
                  ? `Tìm thấy ${filteredJobs.length} công việc phù hợp`
                  : `Found ${filteredJobs.length} matching jobs`}</p>
              </ResultsInfo>
              
              <ViewControls>
                <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">{language === 'vi' ? 'Mới nhất' : 'Newest'}</option>
                  <option value="salary">{language === 'vi' ? 'Lương cao nhất' : 'Highest Salary'}</option>
                  <option value="relevant">{language === 'vi' ? 'Phù hợp nhất' : 'Most Relevant'}</option>
                </SortSelect>
                
                <ViewToggle>
                  <ViewButton 
                    $active={viewMode === 'list'} 
                    onClick={() => setViewMode('list')}
                  >
                    <List />
                  </ViewButton>
                  <ViewButton 
                    $active={viewMode === 'grid'} 
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid />
                  </ViewButton>
                </ViewToggle>
              </ViewControls>
            </ContentHeader>

            <JobsGrid>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <JobCardComponent 
                    key={job.id} 
                    job={job} 
                    saved={savedJobs.includes(job.id)}
                    onSave={handleSaveJob}
                    onClick={handleJobClick}
                    delay={index * 0.05}
                    showDistance={jobCategory === 'shift' && showNearbyJobs}
                    language={language}
                  />
                ))
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '80px 20px', 
                  gridColumn: '1 / -1',
                  color: '#6b7280'
                }}>
                  {jobCategory === 'shift' && !showNearbyJobs ? (
                    <>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
                      <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                        {language === 'vi' ? 'Bật vị trí để tìm việc gần bạn' : 'Enable location to find jobs near you'}
                      </p>
                      <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '20px' }}>
                        {language === 'vi' 
                          ? 'Nhấn nút "Tìm việc gần tôi" ở phía trên để xem các công việc theo ca trong bán kính 3km'
                          : 'Click "Find Jobs Near Me" button above to see shift jobs within 3km radius'}
                      </p>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                      <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                        {language === 'vi' ? 'Không tìm thấy công việc phù hợp' : 'No matching jobs found'}
                      </p>
                      <p style={{ fontSize: '15px', color: '#6b7280' }}>
                        {jobCategory === 'shift' 
                          ? (language === 'vi' 
                              ? 'Không có công việc theo ca trong bán kính 3km. Thử mở rộng bán kính tìm kiếm.'
                              : 'No shift jobs within 3km radius. Try expanding the search radius.')
                          : (language === 'vi'
                              ? 'Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn'
                              : 'Try adjusting your filters or search keywords')
                        }
                      </p>
                    </>
                  )}
                </div>
              )}
            </JobsGrid>
          </MainContent>
        </MainLayout>
      </Container>
    </DashboardLayout>
  );
};

// Add keyframe animation for loading spinner
const GlobalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = GlobalStyles;
  document.head.appendChild(styleSheet);
}

// Job Card Component
const JobCardComponent = ({ job, saved, onSave, onClick, delay = 0, showDistance = false, language }) => {
  const getCompanyInitial = (company) => {
    return company.charAt(0).toUpperCase();
  };

  return (
    <JobCardWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick(job.id)}
    >
      <JobCardHeader>
        <CompanyLogo>
          {getCompanyInitial(job.company)}
        </CompanyLogo>
        <JobInfo>
          <JobTitle>
            {translateJobTitle(job.title, language)}
            {job.urgent && <StatusBadge status="urgent" size="sm">{language === 'vi' ? 'Tuyển gấp' : 'Urgent'}</StatusBadge>}
            {job.featured && <Star size={18} fill="#F59E0B" color="#F59E0B" />}
          </JobTitle>
          <CompanyName>
            <Building2 />
            {job.company}
          </CompanyName>
          <JobMeta>
            <MetaItem>
              <MapPin />
              {translateLocation(job.location, language)}
            </MetaItem>
            {showDistance && job.distance !== undefined && (
              <MetaItem style={{ color: '#10b981', fontWeight: '600' }}>
                <Target size={16} />
                {job.distance < 1 
                  ? `${(job.distance * 1000).toFixed(0)}m` 
                  : `${job.distance.toFixed(1)}km`}
              </MetaItem>
            )}
            <MetaItem>
              <Briefcase />
              {translateJobType(job.type, language)}
            </MetaItem>
            <MetaItem>
              <Eye />
              {job.views} {language === 'vi' ? 'lượt xem' : 'views'}
            </MetaItem>
          </JobMeta>
        </JobInfo>
      </JobCardHeader>

      <JobCardBody>
        <JobTags>
          {job.tags.map((tag, idx) => (
            <Tag key={idx}>{translateTag(tag, language)}</Tag>
          ))}
        </JobTags>
        
        <JobSalary>
          <DollarSign />
          <span>{translateSalary(job.salary, language)}</span>
        </JobSalary>
      </JobCardBody>

      <JobCardFooter>
        <JobPosted>
          <Clock />
          {translateTimePosted(job.postedAt, language)}
        </JobPosted>
        
        <JobActions>
          <ActionButton
            $primary
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onClick(job.id);
            }}
          >
            {language === 'vi' ? 'Ứng tuyển ngay' : 'Apply Now'}
            <ArrowUpRight />
          </ActionButton>
          
          <SaveButton
            $saved={saved}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => onSave(job.id, e)}
          >
            <Bookmark />
          </SaveButton>
        </JobActions>
      </JobCardFooter>
    </JobCardWrapper>
  );
};

export default JobListing;
