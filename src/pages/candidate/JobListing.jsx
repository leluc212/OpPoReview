import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  Search, MapPin, Briefcase, DollarSign, Clock, Star, TrendingUp, 
  ChevronDown, Building2, Bookmark, Eye, ArrowUpRight, Filter,
  X, SlidersHorizontal, Grid, List, Sparkles, Zap, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';

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
  padding: 48px 40px;
  margin-bottom: 32px;
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
  font-size: 36px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const HeroSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.9);
  margin-bottom: 32px;
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
  padding: 12px 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.bgLight};
  
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
    color: ${props => props.theme.colors.text};
    
    &::placeholder {
      color: ${props => props.theme.colors.textLight};
    }
  }
`;

const SearchButton = styled(motion.button)`
  padding: 16px 32px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 600;
  font-size: 15px;
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
  margin-top: 24px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`;

const FilterChip = styled(motion.button)`
  padding: 8px 16px;
  background: ${props => props.$active ? 'white' : 'rgba(255,255,255,0.2)'};
  color: ${props => props.$active ? props.theme.colors.primary : 'white'};
  border: 1px solid ${props => props.$active ? 'white' : 'rgba(255,255,255,0.3)'};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 14px;
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
  margin-bottom: 32px;
`;

const CategoryTab = styled(motion.button)`
  flex: 1;
  padding: 20px 28px;
  background: ${props => props.$active 
    ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary})` 
    : 'white'};
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
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 24px;
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
  margin-bottom: 24px;
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
  margin-bottom: 24px;
  
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
  margin-bottom: 24px;
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
  background: white;
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

// Featured Jobs Section
const FeaturedSection = styled(motion.div)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}05 0%, ${props => props.theme.colors.secondary}05 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid ${props => props.theme.colors.primary}20;
`;

const FeaturedHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.theme.colors.warning};
  }
  
  h3 {
    font-size: 15px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
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
  background: white;
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
  background: ${props => props.$saved ? props.theme.colors.warning + '15' : 'white'};
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

const JobListing = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [jobCategory, setJobCategory] = useState('standard'); // 'standard' or 'shift'
  const [quickFilter, setQuickFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list');
  const [expandedFilters, setExpandedFilters] = useState({
    jobType: true,
    experience: true,
    salary: true,
    company: true
  });

  const jobs = [
    // Standard Jobs
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'FPT Software',
      location: 'Quận 1, TP.HCM',
      type: 'Full-time',
      category: 'standard',
      salary: '120 - 150 triệu VND',
      postedAt: '2 ngày trước',
      tags: ['React', 'TypeScript', 'Hybrid'],
      featured: true,
      urgent: false,
      views: 245
    },
    {
      id: 2,
      title: 'Senior Full Stack Developer',
      company: 'Grab Vietnam',
      location: 'Quận 7, TP.HCM',
      type: 'Full-time',
      category: 'standard',
      salary: '150 - 200 triệu VND',
      postedAt: '1 ngày trước',
      tags: ['Node.js', 'React', 'AWS'],
      featured: true,
      urgent: true,
      views: 412
    },
    {
      id: 3,
      title: 'Frontend Developer (Vue.js)',
      company: 'Tiki Corporation',
      location: 'Tân Bình, TP.HCM',
      type: 'Full-time',
      category: 'standard',
      salary: '90 - 120 triệu VND',
      postedAt: '3 ngày trước',
      tags: ['Vue.js', 'JavaScript', 'CSS'],
      featured: false,
      urgent: false,
      views: 189
    },
    {
      id: 4,
      title: 'Backend Developer (Python)',
      company: 'Shopee Vietnam',
      location: 'Quận 1, TP.HCM',
      type: 'Full-time',
      category: 'standard',
      salary: '110 - 140 triệu VND',
      postedAt: '5 ngày trước',
      tags: ['Python', 'Django', 'PostgreSQL'],
      featured: false,
      urgent: false,
      views: 321
    },
    {
      id: 5,
      title: 'UI/UX Designer',
      company: 'VNG Corporation',
      location: 'Bình Thạnh, TP.HCM',
      type: 'Contract',
      category: 'standard',
      salary: '80 - 100 triệu VND',
      postedAt: '1 tuần trước',
      tags: ['Figma', 'UI Design', 'Prototyping'],
      featured: false,
      urgent: false,
      views: 156
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'Momo',
      location: 'Quận 7, TP.HCM',
      type: 'Full-time',
      category: 'standard',
      salary: '130 - 160 triệu VND',
      postedAt: '4 ngày trước',
      tags: ['AWS', 'Docker', 'Kubernetes'],
      featured: true,
      urgent: false,
      views: 278
    },
    // Shift Jobs - Tuyển gấp
    {
      id: 7,
      title: 'Ca Đêm - Nhân viên bảo vệ',
      company: 'SecureGuard',
      location: 'Quận 1, TP.HCM',
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
      type: 'Ca linh động',
      category: 'shift',
      salary: '50k - 80k/giờ',
      postedAt: '1 ngày trước',
      tags: ['Linh động', 'Giao hàng', 'Xe máy'],
      featured: false,
      urgent: true,
      views: 445
    }
  ];

  const handleSaveJob = (jobId, e) => {
    e?.stopPropagation();
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleJobClick = (jobId) => {
    navigate(`/candidate/jobs/${jobId}`);
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Filter by category first
  const categoryJobs = jobs.filter(job => job.category === jobCategory);
  const featuredJobs = categoryJobs.filter(job => job.featured);
  
  const filteredJobs = categoryJobs.filter(job => {
    if (quickFilter === 'urgent') return job.urgent;
    if (quickFilter === 'featured') return job.featured;
    if (quickFilter === 'saved') return savedJobs.includes(job.id);
    return true;
  });

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
                ? 'Tìm công việc mơ ước của bạn ' 
                : 'Công việc theo ca - Tuyển gấp '}
            </HeroTitle>
            <HeroSubtitle>
              {jobCategory === 'standard'
                ? `Hơn ${jobs.filter(j => j.category === 'standard').length} công việc tiêu chuẩn đang chờ bạn khám phá`
                : `${jobs.filter(j => j.category === 'shift').length} công việc theo ca đang tuyển gấp, làm ngay hôm nay!`}
            </HeroSubtitle>
            
            <SearchContainer>
              <SearchInput>
                <Search />
                <input 
                  type="text" 
                  placeholder="Tìm theo vị trí, công ty, kỹ năng..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </SearchInput>
              
              <SearchInput>
                <MapPin />
                <input 
                  type="text" 
                  placeholder="Địa điểm"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                />
              </SearchInput>
              
              <SearchButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Search />
                Tìm kiếm
              </SearchButton>
            </SearchContainer>
          </HeroContent>
        </HeroSection>

        {/* Category Tabs */}
        <CategoryTabs>
          <CategoryTab
            $active={jobCategory === 'standard'}
            onClick={() => {
              setJobCategory('standard');
              setQuickFilter('all');
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Briefcase />
            Công việc tiêu chuẩn
            <span style={{ marginLeft: 'auto', fontSize: '14px', opacity: 0.9 }}>
              ({jobs.filter(j => j.category === 'standard').length})
            </span>
          </CategoryTab>
          
          <CategoryTab
            $active={jobCategory === 'shift'}
            onClick={() => {
              setJobCategory('shift');
              setQuickFilter('all');
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap />
            Công việc theo ca - Tuyển gấp
            <span style={{ marginLeft: 'auto', fontSize: '14px', opacity: 0.9 }}>
              ({jobs.filter(j => j.category === 'shift').length})
            </span>
          </CategoryTab>
        </CategoryTabs>

        {/* Featured Jobs Section */}
        {featuredJobs.length > 0 && quickFilter === 'all' && (
          <FeaturedSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FeaturedHeader>
              <Award />
              <h3>Việc làm nổi bật</h3>
            </FeaturedHeader>
            <JobsGrid>
              {featuredJobs.slice(0, 2).map(job => (
                <JobCardComponent 
                  key={job.id} 
                  job={job} 
                  saved={savedJobs.includes(job.id)}
                  onSave={handleSaveJob}
                  onClick={handleJobClick}
                />
              ))}
            </JobsGrid>
          </FeaturedSection>
        )}

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
                Bộ lọc
              </h3>
              <ClearButton onClick={() => {}}>Xóa</ClearButton>
            </FilterHeader>

            <FilterSection>
              <FilterTitle onClick={() => toggleFilter('jobType')} $expanded={expandedFilters.jobType}>
                <h4>{jobCategory === 'standard' ? 'Loại hình công việc' : 'Loại ca làm việc'}</h4>
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
                        <input type="checkbox" id="fulltime" />
                        <span>Toàn thời gian</span>
                        <small>24</small>
                      </FilterOption>
                      <FilterOption>
                        <input type="checkbox" id="parttime" />
                        <span>Bán thời gian</span>
                        <small>8</small>
                      </FilterOption>
                      <FilterOption>
                        <input type="checkbox" id="contract" />
                        <span>Hợp đồng</span>
                        <small>12</small>
                      </FilterOption>
                      <FilterOption>
                        <input type="checkbox" id="freelance" />
                        <span>Freelance</span>
                        <small>6</small>
                      </FilterOption>
                    </>
                  ) : (
                    <>
                      <FilterOption>
                        <input type="checkbox" id="morning" />
                        <span>Ca sáng (6h-14h)</span>
                        <small>8</small>
                      </FilterOption>
                      <FilterOption>
                        <input type="checkbox" id="afternoon" />
                        <span>Ca chiều (14h-22h)</span>
                        <small>6</small>
                      </FilterOption>
                      <FilterOption>
                        <input type="checkbox" id="night" />
                        <span>Ca đêm (22h-6h)</span>
                        <small>5</small>
                      </FilterOption>
                      <FilterOption>
                        <input type="checkbox" id="flexible" />
                        <span>Ca linh động</span>
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
                  <h4>Kinh nghiệm</h4>
                  <ChevronDown />
                </FilterTitle>
                {expandedFilters.experience && (
                  <FilterOptions
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                  >
                    <FilterOption>
                      <input type="checkbox" id="intern" />
                      <span>Thực tập sinh</span>
                      <small>15</small>
                    </FilterOption>
                    <FilterOption>
                      <input type="checkbox" id="junior" />
                      <span>Junior (0-2 năm)</span>
                      <small>28</small>
                    </FilterOption>
                    <FilterOption>
                      <input type="checkbox" id="mid" />
                      <span>Middle (2-5 năm)</span>
                      <small>32</small>
                    </FilterOption>
                    <FilterOption>
                      <input type="checkbox" id="senior" />
                      <span>Senior (5+ năm)</span>
                      <small>18</small>
                    </FilterOption>
                  </FilterOptions>
                )}
              </FilterSection>
            )}

            <FilterSection>
              <FilterTitle onClick={() => toggleFilter('salary')} $expanded={expandedFilters.salary}>
                <h4>{jobCategory === 'standard' ? 'Mức lương' : 'Thu nhập/ca'}</h4>
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
                        <input type="checkbox" id="0-50" />
                        <span>Dưới 50 triệu</span>
                        <small>12</small>
                      </FilterOption>
                      <FilterOption>
                        <input type="checkbox" id="50-100" />
                        <span>50 - 100 triệu</span>
                        <small>25</small>
                      </FilterOption>
                      <FilterOption>
                        <input type="checkbox" id="100-150" />
                        <span>100 - 150 triệu</span>
                        <small>18</small>
                      </FilterOption>
                      <FilterOption>
                        <input type="checkbox" id="150+" />
                        <span>Trên 150 triệu</span>
                        <small>8</small>
                      </FilterOption>
                    </>
                  ) : (
                    <>
                      <FilterOption>
                        <input type="checkbox" id="0-150k" />
                        <span>Dưới 150k/ca</span>
                        <small>5</small>
                      </FilterOption>
                      <FilterOption>
                        <input type="checkbox" id="150-200k" />
                        <span>150k - 200k/ca</span>
                        <small>8</small>
                      </FilterOption>
                      <FilterOption>
                        <input type="checkbox" id="200-250k" />
                        <span>200k - 250k/ca</span>
                        <small>6</small>
                      </FilterOption>
                      <FilterOption>
                        <input type="checkbox" id="250k+" />
                        <span>Trên 250k/ca</span>
                        <small>4</small>
                      </FilterOption>
                    </>
                  )}
                </FilterOptions>
              )}
            </FilterSection>
          </FilterSidebar>

          {/* Jobs List */}
          <MainContent>
            <ContentHeader>
              <ResultsInfo>
                <h2>
                  {jobCategory === 'standard' ? 'Công việc tiêu chuẩn' : 'Công việc theo ca'}
                </h2>
                <p>Tìm thấy {filteredJobs.length} công việc phù hợp</p>
              </ResultsInfo>
              
              <ViewControls>
                <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Mới nhất</option>
                  <option value="salary">Lương cao nhất</option>
                  <option value="relevant">Phù hợp nhất</option>
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
              {filteredJobs.map((job, index) => (
                <JobCardComponent 
                  key={job.id} 
                  job={job} 
                  saved={savedJobs.includes(job.id)}
                  onSave={handleSaveJob}
                  onClick={handleJobClick}
                  delay={index * 0.05}
                />
              ))}
            </JobsGrid>
          </MainContent>
        </MainLayout>
      </Container>
    </DashboardLayout>
  );
};

// Job Card Component
const JobCardComponent = ({ job, saved, onSave, onClick, delay = 0 }) => {
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
            {job.title}
            {job.urgent && <StatusBadge status="urgent" size="sm">Tuyển gấp</StatusBadge>}
            {job.featured && <Star size={18} fill="#F59E0B" color="#F59E0B" />}
          </JobTitle>
          <CompanyName>
            <Building2 />
            {job.company}
          </CompanyName>
          <JobMeta>
            <MetaItem>
              <MapPin />
              {job.location}
            </MetaItem>
            <MetaItem>
              <Briefcase />
              {job.type}
            </MetaItem>
            <MetaItem>
              <Eye />
              {job.views} lượt xem
            </MetaItem>
          </JobMeta>
        </JobInfo>
      </JobCardHeader>

      <JobCardBody>
        <JobTags>
          {job.tags.map((tag, idx) => (
            <Tag key={idx}>{tag}</Tag>
          ))}
        </JobTags>
        
        <JobSalary>
          <DollarSign />
          <span>{job.salary}</span>
        </JobSalary>
      </JobCardBody>

      <JobCardFooter>
        <JobPosted>
          <Clock />
          {job.postedAt}
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
            Ứng tuyển ngay
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
