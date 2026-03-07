import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Users, UsersRound, FileText, MessageSquare, Clock, MapPin, Phone, Mail, Edit, Trash2, Eye, CheckCircle, Send, Search, Calendar, DollarSign, Newspaper, TrendingUp, AlertCircle, User, Plus, X, Wallet } from 'lucide-react';

// Mock HR Staff Data
const getHRStaff = (language) => [
  {
    id: 1,
    name: language === 'vi' ? 'Nguyễn Minh Tuấn' : 'Nguyen Minh Tuan',
    position: language === 'vi' ? 'Nhân viên pha chế' : 'Barista',
    location: language === 'vi' ? 'Quận 8' : 'District 8',
    phone: '0123 456 789',
    email: 'nguyenminhtuan@example.com',
    startDate: language === 'vi' ? '15/01/2024' : '01/15/2024',
    status: 'active',
    shift: '06:00 - 14:00',
    confirmedAt: language === 'vi' ? '15/01/2024 - 09:30' : '01/15/2024 - 09:30',
    canRequestChange: true,
    isWithinTimeWindow: true
  },
  {
    id: 2,
    name: language === 'vi' ? 'Phạm Thu Hương' : 'Pham Thu Huong',
    position: language === 'vi' ? 'Thu ngân' : 'Cashier',
    location: language === 'vi' ? 'Quận 1' : 'District 1',
    phone: '0987 654 321',
    email: 'phamthuhuong@example.com',
    startDate: language === 'vi' ? '20/02/2024' : '02/20/2024',
    status: 'active',
    shift: '14:00 - 22:00',
    confirmedAt: language === 'vi' ? '20/02/2024 - 14:15' : '02/20/2024 - 14:15',
    canRequestChange: true,
    isWithinTimeWindow: false
  },
  {
    id: 3,
    name: language === 'vi' ? 'Trần Quốc Bảo' : 'Tran Quoc Bao',
    position: language === 'vi' ? 'Nhân viên phục vụ' : 'Server',
    location: language === 'vi' ? 'Quận 7' : 'District 7',
    phone: '0909 111 222',
    email: 'tranquocbao@example.com',
    startDate: language === 'vi' ? '10/03/2024' : '03/10/2024',
    status: 'active',
    shift: '18:00 - 22:00',
    confirmedAt: language === 'vi' ? '10/03/2024 - 08:45' : '03/10/2024 - 08:45',
    canRequestChange: true,
    isWithinTimeWindow: true
  }
];

// Mock Quick Job Posts Data
const getQuickJobPosts = (language) => [
  {
    id: 1,
    title: language === 'vi' ? 'Nhân viên pha chế - GẤP' : 'Barista - URGENT',
    location: language === 'vi' ? 'Quận 1, TP.HCM' : 'District 1, HCMC',
    salary: language === 'vi' ? '10-15 triệu' : '$400-600',
    type: language === 'vi' ? 'Tuyển gấp' : 'Urgent',
    applicants: 15,
    views: 89,
    status: 'active',
    deadline: language === 'vi' ? '3 ngày nữa' : '3 days left'
  },
  {
    id: 2,
    title: language === 'vi' ? 'Thu ngân - Cần ngay' : 'Cashier - Immediate',
    location: language === 'vi' ? 'Quận 7, TP.HCM' : 'District 7, HCMC',
    salary: language === 'vi' ? '8-12 triệu' : '$320-480',
    type: language === 'vi' ? 'Tuyển gấp' : 'Urgent',
    applicants: 23,
    views: 134,
    status: 'active',
    deadline: language === 'vi' ? '5 ngày nữa' : '5 days left'
  },
  {
    id: 3,
    title: language === 'vi' ? 'Nhân viên phục vụ - Khẩn cấp' : 'Server - Critical',
    location: language === 'vi' ? 'Quận 3, TP.HCM' : 'District 3, HCMC',
    salary: language === 'vi' ? '7-10 triệu' : '$280-400',
    type: language === 'vi' ? 'Tuyển gấp' : 'Urgent',
    applicants: 18,
    views: 102,
    status: 'active',
    deadline: language === 'vi' ? '2 ngày nữa' : '2 days left'
  }
];

// Mock Chat Conversations Data
const getChatConversations = (language) => [
  {
    id: 1,
    name: language === 'vi' ? 'Nguyễn Minh Tuấn' : 'Nguyen Minh Tuan',
    role: language === 'vi' ? 'Nhân viên' : 'Employee',
    lastMessage: language === 'vi' ? 'Chưa có tin nhắn' : 'No messages yet',
    time: language === 'vi' ? '10 phút trước' : '10 min ago',
    unread: 0,
    status: 'online',
    position: language === 'vi' ? 'Nhân viên pha chế' : 'Barista',
    messages: []
  },
  {
    id: 2,
    name: language === 'vi' ? 'Phạm Thu Hương' : 'Pham Thu Huong',
    role: language === 'vi' ? 'Nhân viên' : 'Employee',
    lastMessage: language === 'vi' ? 'Chưa có tin nhắn' : 'No messages yet',
    time: language === 'vi' ? '25 phút trước' : '25 min ago',
    unread: 0,
    status: 'online',
    position: language === 'vi' ? 'Thu ngân' : 'Cashier',
    messages: []
  },
  {
    id: 3,
    name: language === 'vi' ? 'Trần Quốc Bảo' : 'Tran Quoc Bao',
    role: language === 'vi' ? 'Nhân viên' : 'Employee',
    lastMessage: language === 'vi' ? 'Chưa có tin nhắn' : 'No messages yet',
    time: language === 'vi' ? '2 giờ trước' : '2 hours ago',
    unread: 0,
    status: 'offline',
    position: language === 'vi' ? 'Nhân viên phục vụ' : 'Server',
    messages: []
  }
];

// ─── Page wrapper ─────────────────────────────────────────
const PageContainer = styled(motion.div)``;

// ─── Page header (đồng nhất Applications) ─────────────────
const PageHeader = styled.div`
  margin-bottom: 28px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const PageTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PageIconBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 15px;
  background: #EFF6FF;
  border: 1.5px solid #BFDBFE;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg { width: 22px; height: 22px; color: #1e40af; }
`;

const PageTitleText = styled.div`
  h1 {
    font-size: 26px;
    font-weight: 800;
    color: ${props => props.theme.colors.text};
    letter-spacing: -0.5px;
    line-height: 1.2;
    margin-bottom: 4px;
  }
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 13.5px;
    font-weight: 500;
  }
`;

const CountBadge = styled.div`
  align-self: flex-start;
  padding: 6px 16px;
  background: #EFF6FF;
  border: 1.5px solid #BFDBFE;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 700;
  color: #1e40af;
  white-space: nowrap;
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 16px;
  border: 1.5px dashed #E2E8F0;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.05);

  .icon { font-size: 36px; margin-bottom: 12px; opacity: 0.5; }
  h3 { font-size: 18px; font-weight: 700; margin-bottom: 6px; color: ${props => props.theme.colors.text}; }
  p { font-size: 14px; color: ${props => props.theme.colors.textLight}; }
`;

// ─── Quick Jobs Section ────────────────────────────────────
const QuickJobsSection = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  border: 1.5px solid #E8EFFF;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  margin-bottom: 24px;
`;

const QuickJobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const QuickJobCard = styled(motion.button)`
  padding: 28px 24px;
  background: ${props => {
    const alpha = props.$active ? '20' : '08';
    return `linear-gradient(135deg, ${props.$color}${alpha} 0%, ${props.$color}05 100%)`;
  }};
  border: 2px solid ${props => props.$active ? props.$color : props.$color + '30'};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.$color};
    transform: translateY(-4px);
    box-shadow: ${props => `0 12px 40px ${props.$color}25`};
    background: ${props => `linear-gradient(135deg, ${props.$color}25 0%, ${props.$color}10 100%)`};
  }
`;

const QuickJobIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${props => props.$color}20;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  ${QuickJobCard}:hover & {
    background: ${props => props.$color};
    
    svg {
      color: white;
    }
  }
  
  svg {
    width: 32px;
    height: 32px;
    color: ${props => props.$color};
    transition: color 0.3s ease;
  }
`;

const QuickJobLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const QuickJobDescription = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.textLight};
  text-align: center;
  line-height: 1.5;
`;

// ─── HR Staff Styles ───────────────────────────────────────
const StaffGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StaffCard = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #BFDBFE;
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.13);
    transform: translateY(-2px);
  }
`;

const StaffHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const StaffName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const StaffPosition = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
`;

const StaffStatus = styled.div`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  background: ${props => props.$status === 'active' ? '#D1FAE5' : '#FEF3C7'};
  color: ${props => props.$status === 'active' ? '#047857' : '#92400E'};
  border: 1px solid ${props => props.$status === 'active' ? '#10B981' : '#F59E0B'};
`;

const StaffMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
  padding: 16px 0;
  border-top: 1px solid #E8EFFF;
  border-bottom: 1px solid #E8EFFF;
  
  .meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    
    svg {
      width: 14px;
      height: 14px;
      color: #1e40af;
    }
  }
`;

const StaffActions = styled.div`
  display: flex;
  gap: 8px;
`;

const StaffButton = styled(motion.button)`
  flex: 1;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  background: ${props => {
    if (props.$variant === 'danger') return '#EF4444';
    if (props.$variant === 'warning') return '#FEF3C7';
    return '#EFF6FF';
  }};
  color: ${props => {
    if (props.$variant === 'danger') return 'white';
    if (props.$variant === 'warning') return '#D97706';
    return '#1e40af';
  }};
  border: 1.5px solid ${props => {
    if (props.$variant === 'danger') return '#EF4444';
    if (props.$variant === 'warning') return '#FCD34D';
    return '#BFDBFE';
  }};
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => {
      if (props.$variant === 'danger') return '0 4px 12px rgba(239, 68, 68, 0.3)';
      if (props.$variant === 'warning') return '0 4px 12px rgba(245, 158, 11, 0.3)';
      return '0 4px 12px rgba(30, 64, 175, 0.15)';
    }};
  }
`;

// ─── Quick Job Posts Styles ────────────────────────────────
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 0;
  border-bottom: 2px solid #E8EFFF;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
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
`;

const PostJobButton = styled(motion.button)`
  padding: 10px 18px;
  border-radius: 10px;
  background: #1e40af;
  color: white;
  font-weight: 700;
  font-size: 13.5px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(30, 64, 175, 0.28);
  transition: all 0.2s ease;

  &:hover {
    background: #1e3a8a;
    box-shadow: 0 6px 18px rgba(30, 64, 175, 0.38);
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const QuickJobPostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const QuickJobPostCard = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => props.$status === 'active' ? '#F59E0B' : '#94A3B8'};
    border-radius: 16px 0 0 16px;
  }
  
  &:hover {
    border-color: #BFDBFE;
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.13);
    transform: translateY(-2px);
  }
`;

const QuickJobPostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const QuickJobPostTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const QuickJobPostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const QuickJobPostStats = styled.div`
  display: flex;
  gap: 20px;
  padding: 16px 0;
  border-top: 1px solid #E8EFFF;
  border-bottom: 1px solid #E8EFFF;
  margin-bottom: 16px;
  
  .stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .stat-value {
      font-size: 20px;
      font-weight: 800;
      color: ${props => props.theme.colors.text};
    }
    
    .stat-label {
      font-size: 12px;
      color: ${props => props.theme.colors.textLight};
      font-weight: 600;
    }
  }
`;

const QuickJobPostActions = styled.div`
  display: flex;
  gap: 8px;
`;

const QuickJobPostButton = styled(motion.button)`
  flex: 1;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  background: ${props => {
    if (props.$variant === 'primary') return '#F59E0B';
    if (props.$variant === 'danger') return '#EF4444';
    return '#EFF6FF';
  }};
  
  color: ${props => props.$variant === 'primary' || props.$variant === 'danger' ? 'white' : '#1e40af'};
  border: 1.5px solid ${props => {
    if (props.$variant === 'primary') return '#F59E0B';
    if (props.$variant === 'danger') return '#EF4444';
    return '#BFDBFE';
  }};
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => {
      if (props.$variant === 'primary') return '0 4px 12px rgba(245, 158, 11, 0.3)';
      if (props.$variant === 'danger') return '0 4px 12px rgba(239, 68, 68, 0.3)';
      return '0 4px 12px rgba(30, 64, 175, 0.15)';
    }};
  }
`;

const QuickJobStatusBadge = styled.div`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  background: ${props => props.$status === 'active' ? '#FEF3C7' : '#F1F5F9'};
  color: ${props => props.$status === 'active' ? '#92400E' : '#64748B'};
  border: 1px solid ${props => props.$status === 'active' ? '#F59E0B' : '#CBD5E1'};
`;

// ─── Chat Styles ───────────────────────────────────────────
const ChatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChatCard = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    border-color: #BFDBFE;
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.13);
    transform: translateY(-2px);
  }
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ChatInfo = styled.div`
  flex: 1;
`;

const ChatName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const ChatRole = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
`;

const ChatStatus = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$status === 'online' ? '#10B981' : '#94A3B8'};
  box-shadow: ${props => props.$status === 'online' ? '0 0 0 2px #D1FAE5' : 'none'};
`;

const ChatMessagePreview = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
`;

const ChatFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #E8EFFF;
`;

const ChatTime = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 600;
`;

const ChatUnread = styled.div`
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  background: #DBEAFE;
  color: #1e40af;
  border: 1px solid #BFDBFE;
`;

// ─── Chat Modal Styles ──────────────────────────
const ChatModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ChatModalContainer = styled(motion.div)`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  height: 80vh;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const ChatModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 2px solid #E8EFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
`;

const ChatModalHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ChatModalAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 700;
  position: relative;
`;

const ChatModalOnlineStatus = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$online ? '#10B981' : '#94A3B8'};
  border: 2px solid white;
`;

const ChatModalHeaderText = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 2px;
  }
  p {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
  }
`;

const ChatModalCloseButton = styled(motion.button)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: white;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #F1F5F9;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ChatModalMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #F8FAFC;
`;

const ChatMessage = styled(motion.div)`
  display: flex;
  justify-content: ${props => props.$sender === 'me' ? 'flex-end' : 'flex-start'};
  align-items: center;
  gap: 8px;
  position: relative;

  &:hover .delete-button {
    opacity: 1;
  }
`;

const ChatMessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: ${props => props.$sender === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
  background: ${props => props.$sender === 'me' ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' : 'white'};
  color: ${props => props.$sender === 'me' ? 'white' : props.theme.colors.text};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .message-text {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 4px;
  }

  .message-time {
    font-size: 11px;
    opacity: 0.7;
    text-align: right;
  }
`;

const DeleteMessageButton = styled(motion.button)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #EF4444;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: #DC2626;
  }
`;

const ChatModalInput = styled.div`
  padding: 20px 24px;
  border-top: 2px solid #E8EFFF;
  background: white;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ChatInputField = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #E8EFFF;
  border-radius: 12px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  background: #F8FAFC;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #1e40af;
    background: white;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

const ChatSendButton = styled(motion.button)`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);

  svg {
    width: 20px;
    height: 20px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ─── Wallet Verification Modal ─────────────────────────────
const WalletModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const WalletModalContainer = styled(motion.div)`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const WalletModalIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;

  svg {
    width: 40px;
    height: 40px;
    color: #D97706;
  }
`;

const WalletModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
`;

const WalletModalMessage = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.textLight};
  line-height: 1.6;
  margin-bottom: 32px;
`;

const WalletModalActions = styled.div`
  display: flex;
  gap: 12px;
`;

const WalletModalButton = styled(motion.button)`
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  background: ${props => props.$variant === 'primary' ? '#1e40af' : '#F1F5F9'};
  color: ${props => props.$variant === 'primary' ? 'white' : props.theme.colors.text};
  border: 1.5px solid ${props => props.$variant === 'primary' ? '#1e40af' : '#E2E8F0'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$variant === 'primary'
      ? '0 6px 20px rgba(30, 64, 175, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// ─── Delete Confirmation Modal ─────────────────────────────
const DeleteModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 20px;
`;

const DeleteModalContainer = styled(motion.div)`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const DeleteModalIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    width: 40px;
    height: 40px;
    color: #EF4444;
  }
`;

const DeleteModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
`;

const DeleteModalMessage = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.textLight};
  line-height: 1.6;
  margin-bottom: 8px;
`;

const DeleteModalJobTitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  background: #F8FAFC;
  padding: 12px 16px;
  border-radius: 12px;
  margin: 16px 0 24px;
  border: 2px solid #E2E8F0;
`;

const DeleteModalActions = styled.div`
  display: flex;
  gap: 12px;
`;

const DeleteModalButton = styled(motion.button)`
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid;

  ${props => props.$variant === 'danger' ? `
    background: #EF4444;
    color: white;
    border-color: #EF4444;
    &:hover:not(:disabled) {
      background: #DC2626;
      border-color: #DC2626;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
    }
  ` : `
    background: white;
    color: ${props.theme.colors.text};
    border-color: #E2E8F0;
    &:hover:not(:disabled) {
      background: #F8FAFC;
      border-color: #CBD5E1;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// ─── Success Toast ─────────────────────────────────────────
const SuccessToast = styled(motion.div)`
  position: fixed;
  top: 24px;
  right: 24px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
  z-index: 1002;
  font-weight: 600;
  font-size: 15px;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

// ─── Component ─────────────────────────────────────────────
const HRManagement = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hr');
  const [hrStaff] = useState(() => getHRStaff(language));
  
  // Load quick jobs from localStorage
  const [quickJobPosts, setQuickJobPosts] = useState(() => {
    const savedJobs = localStorage.getItem('quickJobs');
    if (savedJobs) {
      try {
        const jobs = JSON.parse(savedJobs);
        // Format jobs for display
        return jobs.map(job => ({
          id: job.id,
          title: job.title,
          location: job.location,
          salary: job.hourlyRate 
            ? `${parseInt(job.hourlyRate).toLocaleString('vi-VN')} VNĐ/giờ`
            : (language === 'vi' ? 'Thỏa thuận' : 'Negotiable'),
          shift: job.startTime && job.endTime ? `${job.startTime} - ${job.endTime}` : '',
          type: language === 'vi' ? 'Tuyển gấp' : 'Urgent',
          applicants: job.applicants || 0,
          views: job.views || 0,
          status: job.status || 'active',
          deadline: (() => {
            const created = new Date(job.createdAt);
            const now = new Date();
            const diffTime = 7 * 24 * 60 * 60 * 1000 - (now - created); // 7 days validity
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
              return language === 'vi' ? `${diffDays} ngày nữa` : `${diffDays} days left`;
            }
            return language === 'vi' ? 'Hết hạn' : 'Expired';
          })(),
          contactPhone: job.contactPhone,
          description: job.description,
          createdAt: job.createdAt
        }));
      } catch (e) {
        console.error('Error loading quick jobs:', e);
      }
    }
    // No fallback mock cards: show empty state when no saved jobs
    return [];
  });
  
  const [chatConversations] = useState(() => getChatConversations(language));
  const [activeChatId, setActiveChatId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Mock wallet connection status - in real app, get from user context or API
  const [isWalletConnected] = useState(() => {
    return localStorage.getItem('employer_wallet_connected') === 'true';
  });

  const activeChat = activeChatId
    ? chatConversations.find(chat => chat.id === activeChatId)
    : null;

  // Load messages from localStorage when opening a chat
  useEffect(() => {
    if (activeChatId) {
      const savedMessages = localStorage.getItem(`chat_${activeChatId}`);
      if (savedMessages) {
        setCurrentMessages(JSON.parse(savedMessages));
      } else {
        const chat = chatConversations.find(c => c.id === activeChatId);
        if (chat) {
          setCurrentMessages(chat.messages);
        }
      }
    }
  }, [activeChatId, chatConversations]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (activeChatId && currentMessages.length > 0) {
      localStorage.setItem(`chat_${activeChatId}`, JSON.stringify(currentMessages));
    }
  }, [currentMessages, activeChatId]);

  const handleOpenChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const handleCloseChat = () => {
    setActiveChatId(null);
    setCurrentMessages([]);
    setMessageInput('');
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(), // Use timestamp for unique ID
      sender: 'me',
      text: messageInput,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setCurrentMessages([...currentMessages, newMessage]);
    setMessageInput('');
  };

  const handleDeleteMessage = (messageId) => {
    const updatedMessages = currentMessages.filter(msg => msg.id !== messageId);
    setCurrentMessages(updatedMessages);

    // Update localStorage after deletion
    if (activeChatId) {
      if (updatedMessages.length > 0) {
        localStorage.setItem(`chat_${activeChatId}`, JSON.stringify(updatedMessages));
      } else {
        localStorage.removeItem(`chat_${activeChatId}`);
      }
    }
  };

  const handleCreatePost = () => {
    if (!isWalletConnected) {
      setShowWalletModal(true);
    } else {
      navigate('/employer/post-quick-job');
    }
  };

  const handleConnectWallet = () => {
    // Simulate wallet connection success
    localStorage.setItem('employer_wallet_connected', 'true');
    setShowWalletModal(false);

    // Show success notification
    alert(language === 'vi'
      ? '✓ Liên kết ví thành công! Bạn có thể đăng bài ngay bây giờ.'
      : '✓ Wallet connected successfully! You can now post jobs.');

    // Navigate to post job page
    navigate('/employer/post-job');
  };

  // Reload jobs from localStorage
  const loadJobsFromLocalStorage = () => {
    const savedJobs = localStorage.getItem('quickJobs');
    if (savedJobs) {
      try {
        const jobs = JSON.parse(savedJobs);
        const formattedJobs = jobs.map(job => ({
          id: job.id,
          title: job.title,
          location: job.location,
          salary: job.hourlyRate 
            ? `${parseInt(job.hourlyRate).toLocaleString('vi-VN')} VNĐ/giờ`
            : (language === 'vi' ? 'Thỏa thuận' : 'Negotiable'),
          shift: job.startTime && job.endTime ? `${job.startTime} - ${job.endTime}` : '',
          type: language === 'vi' ? 'Tuyển gấp' : 'Urgent',
          applicants: job.applicants || 0,
          views: job.views || 0,
          status: job.status || 'active',
          deadline: (() => {
            const created = new Date(job.createdAt);
            const now = new Date();
            const diffTime = 7 * 24 * 60 * 60 * 1000 - (now - created);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
              return language === 'vi' ? `${diffDays} ngày nữa` : `${diffDays} days left`;
            }
            return language === 'vi' ? 'Hết hạn' : 'Expired';
          })(),
          contactPhone: job.contactPhone,
          description: job.description,
          createdAt: job.createdAt
        }));
        setQuickJobPosts(formattedJobs);
      } catch (e) {
        console.error('Error loading quick jobs:', e);
        setQuickJobPosts([]);
      }
    } else {
      setQuickJobPosts([]);
    }
  };

  // Open delete confirmation modal
  const handleDeleteJob = (jobId) => {
    setDeleteJobId(jobId);
  };

  // Confirm and delete job from localStorage
  const confirmDeleteJob = async () => {
    if (!deleteJobId) return;
    
    setIsDeleting(true);
    
    // Simulate async operation for better UX
    await new Promise(resolve => setTimeout(resolve, 600));

    const savedJobs = localStorage.getItem('quickJobs');
    if (savedJobs) {
      try {
        const jobs = JSON.parse(savedJobs);
        const updatedJobs = jobs.filter(job => job.id !== deleteJobId);
        localStorage.setItem('quickJobs', JSON.stringify(updatedJobs));
        loadJobsFromLocalStorage();
        
        // Show success toast
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } catch (e) {
        console.error('Error deleting job:', e);
      }
    }
    
    setIsDeleting(false);
    setDeleteJobId(null);
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteJobId(null);
  };

  // Get job title for delete confirmation
  const jobToDelete = deleteJobId ? quickJobPosts.find(job => job.id === deleteJobId) : null;

  // Reload jobs when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadJobsFromLocalStorage();
      }
    };

    const handleFocus = () => {
      loadJobsFromLocalStorage();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [language]);

  return (
    <DashboardLayout role="employer" key={language}>
      <PageContainer
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Header */}
        <PageHeader>
          <PageTitleGroup>
            <PageIconBox><Clock /></PageIconBox>
            <PageTitleText>
              <h1>{language === 'vi' ? 'Công việc tuyển gấp' : 'Quick Jobs'}</h1>
              <p>{language === 'vi' ? 'Quản lý nhân sự, bài đăng và tin nhắn tuyển dụng nhanh' : 'Manage HR, posts and recruitment messages quickly'}</p>
            </PageTitleText>
          </PageTitleGroup>
        </PageHeader>

        {/* Quick Jobs Section */}
        <QuickJobsSection>
          <QuickJobsGrid>
            <QuickJobCard
              $color="#1e40af"
              $active={activeSection === 'hr'}
              onClick={() => setActiveSection('hr')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <QuickJobIcon $color="#1e40af">
                <UsersRound />
              </QuickJobIcon>
              <QuickJobLabel>{language === 'vi' ? 'Quản lý nhân sự' : 'HR Management'}</QuickJobLabel>
              <QuickJobDescription>
                {language === 'vi' ? 'Quản lý và theo dõi nhân viên đang làm việc' : 'Manage and track your workforce'}
              </QuickJobDescription>
            </QuickJobCard>
            
            <QuickJobCard
              $color="#10B981"
              $active={activeSection === 'posts'}
              onClick={() => setActiveSection('posts')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <QuickJobIcon $color="#10B981">
                <FileText />
              </QuickJobIcon>
              <QuickJobLabel>{language === 'vi' ? 'Quản lý bài đăng' : 'Post Management'}</QuickJobLabel>
              <QuickJobDescription>
                {language === 'vi' ? 'Tạo và quản lý các tin tuyển dụng' : 'Create and manage job postings'}
              </QuickJobDescription>
            </QuickJobCard>
            
            <QuickJobCard
              $color="#F59E0B"
              $active={activeSection === 'chat'}
              onClick={() => setActiveSection('chat')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <QuickJobIcon $color="#F59E0B">
                <MessageSquare />
              </QuickJobIcon>
              <QuickJobLabel>{language === 'vi' ? 'Chatting' : 'Chatting'}</QuickJobLabel>
              <QuickJobDescription>
                {language === 'vi' ? 'Trò chuyện với ứng viên và nhân viên' : 'Chat with candidates and employees'}
              </QuickJobDescription>
            </QuickJobCard>
          </QuickJobsGrid>
        </QuickJobsSection>

        {/* Content Section */}
        {activeSection === 'hr' && (
          <StaffGrid>
            <AnimatePresence>
              {hrStaff.map((staff, index) => (
                <StaffCard
                  key={staff.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StaffHeader>
                    <div>
                      <StaffName>{staff.name}</StaffName>
                      <StaffPosition>{staff.position}</StaffPosition>
                    </div>
                    <StaffStatus $status={staff.status}>
                      {staff.status === 'active' 
                        ? (language === 'vi' ? 'Đang làm' : 'Active')
                        : (language === 'vi' ? 'Nghỉ phép' : 'On Leave')}
                    </StaffStatus>
                  </StaffHeader>
                  
                  <StaffMeta>
                    <div className="meta-row">
                      <MapPin />{staff.location}
                    </div>
                    <div className="meta-row">
                      <Phone />{staff.phone}
                    </div>
                    <div className="meta-row">
                      <Mail />{staff.email}
                    </div>
                    <div className="meta-row">
                      <Calendar />{language === 'vi' ? 'Bắt đầu:' : 'Started:'} {staff.startDate}
                    </div>
                    <div className="meta-row">
                      <Clock />{language === 'vi' ? 'Giờ làm:' : 'Work hours:'} {staff.shift}
                    </div>
                    <div className="meta-row">
                      <CheckCircle />{language === 'vi' ? 'Xác nhận:' : 'Confirmed:'} {staff.confirmedAt}
                    </div>
                  </StaffMeta>
                  
                  <StaffActions>
                    <StaffButton
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <User />{language === 'vi' ? 'Xem hồ sơ' : 'View profile'}
                    </StaffButton>
                    {staff.canRequestChange && (
                      <StaffButton
                        $variant="warning"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (staff.isWithinTimeWindow) {
                            alert(language === 'vi' 
                              ? '✓ Yêu cầu thay đổi của bạn đã được gửi!'
                              : '✓ Your change request has been submitted!');
                          } else {
                            alert(language === 'vi' 
                              ? '✗ Đã quá 1 giờ, không thể yêu cầu thay đổi!'
                              : '✗ More than 1 hour passed, cannot request changes!');
                          }
                        }}
                      >
                        <AlertCircle />{language === 'vi' ? 'Yêu cầu thay đổi' : 'Request change'}
                      </StaffButton>
                    )}
                  </StaffActions>
                </StaffCard>
              ))}
            </AnimatePresence>
          </StaffGrid>
        )}

        {activeSection === 'posts' && (
          <>
            <SectionHeader>
              <SectionTitle>
                <FileText />
                {language === 'vi' ? 'Quản lý bài đăng' : 'Post Management'}
              </SectionTitle>
              <PostJobButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreatePost}
              >
                <Plus />
                {language === 'vi' ? 'Đăng bài mới' : 'Create Post'}
              </PostJobButton>
            </SectionHeader>
            {quickJobPosts.length === 0 ? (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#64748B'
              }}>
                <FileText style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.3 }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#334155' }}>
                  {language === 'vi' ? 'Chưa có bài đăng nào' : 'No posts yet'}
                </h3>
                <p style={{ fontSize: '14px' }}>
                  {language === 'vi' 
                    ? 'Bắt đầu tuyển dụng bằng cách tạo bài đăng đầu tiên của bạn' 
                    : 'Start hiring by creating your first job post'}
                </p>
              </div>
            ) : (
            <QuickJobPostsGrid>
              <AnimatePresence>
                {quickJobPosts.map((post, index) => (
                <QuickJobPostCard
                  key={post.id}
                  $status={post.status}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <QuickJobPostHeader>
                    <div>
                      <QuickJobPostTitle>{post.title}</QuickJobPostTitle>
                      <QuickJobPostMeta>
                        <div className="meta-item">
                          <MapPin />{post.location}
                        </div>
                        <div className="meta-item">
                          <DollarSign />{post.salary}
                        </div>
                        {post.shift && (
                          <div className="meta-item">
                            <Clock />{post.shift}
                          </div>
                        )}
                        <div className="meta-item">
                          <Calendar />{post.deadline}
                        </div>
                      </QuickJobPostMeta>
                    </div>
                    <QuickJobStatusBadge $status={post.status}>
                      {post.status === 'active'
                        ? (language === 'vi' ? 'Đang tuyển' : 'Active')
                        : (language === 'vi' ? 'Đã đóng' : 'Closed')}
                    </QuickJobStatusBadge>
                  </QuickJobPostHeader>
                  
                  <QuickJobPostStats>
                    <div className="stat">
                      <div className="stat-value">{post.applicants}</div>
                      <div className="stat-label">{language === 'vi' ? 'Ứng viên' : 'Applicants'}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">{post.views}</div>
                      <div className="stat-label">{language === 'vi' ? 'Lượt xem' : 'Views'}</div>
                    </div>
                  </QuickJobPostStats>
                  
                  <QuickJobPostActions>
                    <QuickJobPostButton
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Eye />{language === 'vi' ? 'Xem' : 'View'}
                    </QuickJobPostButton>
                    <QuickJobPostButton
                      $variant="primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Edit />{language === 'vi' ? 'Sửa' : 'Edit'}
                    </QuickJobPostButton>
                    <QuickJobPostButton
                      $variant="danger"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDeleteJob(post.id)}
                    >
                      <Trash2 />
                    </QuickJobPostButton>
                  </QuickJobPostActions>
                </QuickJobPostCard>
              ))}
              </AnimatePresence>
            </QuickJobPostsGrid>
            )}
          </>
        )}

        {activeSection === 'chat' && (
          <ChatGrid>
            <AnimatePresence>
              {chatConversations.map((chat, index) => (
                <ChatCard
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleOpenChat(chat.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChatHeader>
                    <ChatInfo>
                      <ChatName>{chat.name}</ChatName>
                      <ChatRole>{chat.role} • {chat.position}</ChatRole>
                    </ChatInfo>
                    <ChatStatus $status={chat.status} />
                  </ChatHeader>
                  
                  <ChatMessagePreview>{chat.lastMessage}</ChatMessagePreview>
                  
                  <ChatFooter>
                    <ChatTime>{chat.time}</ChatTime>
                    {chat.unread > 0 && (
                      <ChatUnread>{chat.unread} {language === 'vi' ? 'mới' : 'new'}</ChatUnread>
                    )}
                  </ChatFooter>
                </ChatCard>
              ))}
            </AnimatePresence>
          </ChatGrid>
        )}

        {/* Chat Modal */}
        <AnimatePresence>
          {activeChatId && activeChat && (
            <ChatModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseChat}
            >
              <ChatModalContainer
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ChatModalHeader>
                  <ChatModalHeaderInfo>
                    <ChatModalAvatar>
                      {activeChat.name.charAt(0)}
                      <ChatModalOnlineStatus $online={activeChat.status === 'online'} />
                    </ChatModalAvatar>
                    <ChatModalHeaderText>
                      <h3>{activeChat.name}</h3>
                      <p>{activeChat.role} • {activeChat.position}</p>
                    </ChatModalHeaderText>
                  </ChatModalHeaderInfo>
                  <ChatModalCloseButton
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseChat}
                  >
                    <X />
                  </ChatModalCloseButton>
                </ChatModalHeader>

                <ChatModalMessages>
                  {currentMessages.map((msg, index) => (
                    <ChatMessage
                      key={msg.id}
                      $sender={msg.sender}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {msg.sender === 'me' && (
                        <DeleteMessageButton
                          className="delete-button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteMessage(msg.id)}
                        >
                          <X />
                        </DeleteMessageButton>
                      )}
                      <ChatMessageBubble $sender={msg.sender}>
                        <div className="message-text">{msg.text}</div>
                        <div className="message-time">{msg.time}</div>
                      </ChatMessageBubble>
                      {msg.sender === 'them' && (
                        <DeleteMessageButton
                          className="delete-button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteMessage(msg.id)}
                        >
                          <X />
                        </DeleteMessageButton>
                      )}
                    </ChatMessage>
                  ))}
                </ChatModalMessages>

                <ChatModalInput>
                  <ChatInputField
                    type="text"
                    placeholder={language === 'vi' ? 'Nhập tin nhắn...' : 'Type a message...'}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <ChatSendButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                  >
                    <Send />
                  </ChatSendButton>
                </ChatModalInput>
              </ChatModalContainer>
            </ChatModalOverlay>
          )}
        </AnimatePresence>

        {/* Wallet Verification Modal */}
        <AnimatePresence>
          {showWalletModal && (
            <WalletModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWalletModal(false)}
            >
              <WalletModalContainer
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <WalletModalIcon>
                  <Wallet />
                </WalletModalIcon>
                <WalletModalTitle>
                  {language === 'vi' ? 'Yêu cầu liên kết ví' : 'Wallet Connection Required'}
                </WalletModalTitle>
                <WalletModalMessage>
                  {language === 'vi'
                    ? 'Bạn cần liên kết ví ngân hàng trước khi có thể đăng tin tuyển dụng. Điều này giúp đảm bảo thanh toán an toàn và minh bạch.'
                    : 'You need to connect your bank wallet before posting job listings. This ensures secure and transparent payment processing.'}
                </WalletModalMessage>
                <WalletModalActions>
                  <WalletModalButton
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowWalletModal(false)}
                  >
                    <X />
                    {language === 'vi' ? 'Đóng' : 'Cancel'}
                  </WalletModalButton>
                  <WalletModalButton
                    $variant="primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConnectWallet}
                  >
                    <Wallet />
                    {language === 'vi' ? 'Liên kết ví' : 'Connect Wallet'}
                  </WalletModalButton>
                </WalletModalActions>
              </WalletModalContainer>
            </WalletModalOverlay>
          )}

          {deleteJobId && jobToDelete && (
            <DeleteModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelDelete}
            >
              <DeleteModalContainer
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <DeleteModalIcon>
                  <AlertCircle />
                </DeleteModalIcon>
                <DeleteModalTitle>
                  {language === 'vi' ? 'Xác nhận xóa bài đăng' : 'Confirm Delete Post'}
                </DeleteModalTitle>
                <DeleteModalMessage>
                  {language === 'vi'
                    ? 'Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.'
                    : 'Are you sure you want to delete this post? This action cannot be undone.'}
                </DeleteModalMessage>
                <DeleteModalJobTitle>
                  {jobToDelete.title}
                </DeleteModalJobTitle>
                <DeleteModalActions>
                  <DeleteModalButton
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={cancelDelete}
                    disabled={isDeleting}
                  >
                    <X />
                    {language === 'vi' ? 'Hủy' : 'Cancel'}
                  </DeleteModalButton>
                  <DeleteModalButton
                    $variant="danger"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmDeleteJob}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Trash2 />
                        </motion.div>
                        {language === 'vi' ? 'Đang xóa...' : 'Deleting...'}
                      </>
                    ) : (
                      <>
                        <Trash2 />
                        {language === 'vi' ? 'Xóa bài đăng' : 'Delete Post'}
                      </>
                    )}
                  </DeleteModalButton>
                </DeleteModalActions>
              </DeleteModalContainer>
            </DeleteModalOverlay>
          )}

          {showSuccessToast && (
            <SuccessToast
              initial={{ opacity: 0, y: -20, x: 100 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
            >
              <CheckCircle />
              {language === 'vi' ? 'Đã xóa bài đăng thành công!' : 'Post deleted successfully!'}
            </SuccessToast>
          )}
        </AnimatePresence>
      </PageContainer>
    </DashboardLayout>
  );
};

export default HRManagement;
