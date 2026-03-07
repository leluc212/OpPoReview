import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Users, UsersRound, FileText, MessageSquare, Clock, MapPin, Phone, Mail, Edit, Trash2, Eye, CheckCircle, Send, Search, Calendar, DollarSign, Newspaper, TrendingUp } from 'lucide-react';

// Mock HR Staff Data
const getHRStaff = (language) => [
  {
    id: 1,
    name: language === 'vi' ? 'Nguyễn Văn A' : 'Nguyen Van A',
    position: language === 'vi' ? 'Nhân viên pha chế' : 'Barista',
    location: language === 'vi' ? 'Quận 8' : 'District 8',
    phone: '0123 456 789',
    email: 'nguyenvana@example.com',
    startDate: language === 'vi' ? '15/01/2024' : '01/15/2024',
    status: 'active',
    shift: language === 'vi' ? 'Ca sáng' : 'Morning shift'
  },
  {
    id: 2,
    name: language === 'vi' ? 'Trần Thị B' : 'Tran Thi B',
    position: language === 'vi' ? 'Thu ngân' : 'Cashier',
    location: language === 'vi' ? 'Quận 1' : 'District 1',
    phone: '0987 654 321',
    email: 'tranthib@example.com',
    startDate: language === 'vi' ? '20/02/2024' : '02/20/2024',
    status: 'active',
    shift: language === 'vi' ? 'Ca chiều' : 'Afternoon shift'
  },
  {
    id: 3,
    name: language === 'vi' ? 'Lê Văn C' : 'Le Van C',
    position: language === 'vi' ? 'Nhân viên phục vụ' : 'Server',
    location: language === 'vi' ? 'Quận 7' : 'District 7',
    phone: '0909 111 222',
    email: 'levanc@example.com',
    startDate: language === 'vi' ? '10/03/2024' : '03/10/2024',
    status: 'active',
    shift: language === 'vi' ? 'Ca tối' : 'Night shift'
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
    name: language === 'vi' ? 'Hiếu sàn' : 'Hieu san',
    role: language === 'vi' ? 'Ứng viên' : 'Candidate',
    lastMessage: language === 'vi' ? 'Em có thể bắt đầu làm việc ngay ạ' : 'I can start working immediately',
    time: language === 'vi' ? '5 phút trước' : '5 min ago',
    unread: 2,
    status: 'online',
    position: language === 'vi' ? 'Pha chế' : 'Barista'
  },
  {
    id: 2,
    name: language === 'vi' ? 'Duy sàn' : 'Duy san',
    role: language === 'vi' ? 'Ứng viên' : 'Candidate',
    lastMessage: language === 'vi' ? 'Mức lương có thương lượng được không ạ?' : 'Is the salary negotiable?',
    time: language === 'vi' ? '15 phút trước' : '15 min ago',
    unread: 1,
    status: 'online',
    position: language === 'vi' ? 'Thu ngân' : 'Cashier'
  },
  {
    id: 3,
    name: language === 'vi' ? 'Nguyễn Văn A' : 'Nguyen Van A',
    role: language === 'vi' ? 'Nhân viên' : 'Employee',
    lastMessage: language === 'vi' ? 'Hôm nay em xin nghỉ ạ' : 'I need to take leave today',
    time: language === 'vi' ? '1 giờ trước' : '1 hour ago',
    unread: 0,
    status: 'offline',
    position: language === 'vi' ? 'Pha chế' : 'Barista'
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
  
  background: ${props => props.$variant === 'danger' ? '#EF4444' : '#EFF6FF'};
  color: ${props => props.$variant === 'danger' ? 'white' : '#1e40af'};
  border: 1.5px solid ${props => props.$variant === 'danger' ? '#EF4444' : '#BFDBFE'};
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.$variant === 'danger' ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 4px 12px rgba(30, 64, 175, 0.15)'};
  }
`;

// ─── Quick Job Posts Styles ────────────────────────────────
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

const ChatMessage = styled.div`
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

// ─── Component ─────────────────────────────────────────────
const HRManagement = () => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState('hr');
  const [hrStaff] = useState(() => getHRStaff(language));
  const [quickJobPosts] = useState(() => getQuickJobPosts(language));
  const [chatConversations] = useState(() => getChatConversations(language));

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
                      <Clock />{staff.shift}
                    </div>
                  </StaffMeta>
                  
                  <StaffActions>
                    <StaffButton
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Eye />{language === 'vi' ? 'Chi tiết' : 'Details'}
                    </StaffButton>
                    <StaffButton
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Edit />{language === 'vi' ? 'Sửa' : 'Edit'}
                    </StaffButton>
                    <StaffButton
                      $variant="danger"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 />
                    </StaffButton>
                  </StaffActions>
                </StaffCard>
              ))}
            </AnimatePresence>
          </StaffGrid>
        )}

        {activeSection === 'posts' && (
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
                        <div className="meta-item">
                          <Clock />{post.deadline}
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
                    >
                      <Trash2 />
                    </QuickJobPostButton>
                  </QuickJobPostActions>
                </QuickJobPostCard>
              ))}
            </AnimatePresence>
          </QuickJobPostsGrid>
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
                >
                  <ChatHeader>
                    <ChatInfo>
                      <ChatName>{chat.name}</ChatName>
                      <ChatRole>{chat.role} • {chat.position}</ChatRole>
                    </ChatInfo>
                    <ChatStatus $status={chat.status} />
                  </ChatHeader>
                  
                  <ChatMessage>{chat.lastMessage}</ChatMessage>
                  
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
      </PageContainer>
    </DashboardLayout>
  );
};

export default HRManagement;
