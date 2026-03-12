import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Bell, 
  BellOff, 
  UserPlus, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Trash2,
  Eye,
  Star
} from 'lucide-react';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const NotificationsContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

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

  svg {
    width: 24px;
    height: 24px;
    color: #1e40af;
  }
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

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 6px;
  background: #f8fafc;
  border-radius: 14px;
  overflow-x: auto;
  border: 1.5px solid #E8EFFF;
  flex: 1;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 3px;
  }
`;

const Tab = styled(motion.button)`
  padding: 10px 20px;
  background: ${props => props.$active ? '#ffffff' : 'transparent'};
  border: none;
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.$active ? '#1e40af' : '#64748B'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(30, 64, 175, 0.08)' : 'none'};
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: #1e40af;
    background: ${props => props.$active ? '#ffffff' : '#f1f5f9'};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled(motion.button)`
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: ${props => props.$variant === 'primary' ? '#1e40af' : '#ffffff'};
  color: ${props => props.$variant === 'primary' ? 'white' : '#1E293B'};
  border: 1.5px solid ${props => props.$variant === 'primary' ? 'transparent' : '#e2e8f0'};
  box-shadow: ${props => props.$variant === 'primary' 
    ? '0 4px 12px rgba(30, 64, 175, 0.25)' 
    : '0 2px 8px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$variant === 'primary' 
      ? '0 6px 16px rgba(30, 64, 175, 0.35)' 
      : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const NotificationsGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const NotificationCard = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid ${props => props.$read ? '#F1F5F9' : '#BFDBFE'};
  border-radius: 16px;
  padding: 20px 24px;
  transition: all 0.22s ease;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.04);
  position: relative;
  overflow: hidden;
  display: flex;
  gap: 16px;
  align-items: start;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    border-radius: 16px 0 0 16px;
    background: ${props => {
      switch(props.$type) {
        case 'application': return '#1e40af';
        case 'interview': return '#10B981';
        case 'system': return '#1e40af';
        case 'rating': return '#F59E0B';
        default: return '#64748B';
      }
    }};
    opacity: ${props => props.$read ? '0.2' : '0.8'};
    transition: opacity 0.2s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.12);
    border-color: #93C5FD;
    &::before {
      opacity: 1;
    }
  }
`;

const NotificationIcon = styled.div`
  width: 46px;
  height: 46px;
  min-width: 46px;
  border-radius: 14px;
  background: ${props => {
    switch(props.$type) {
      case 'application': return '#EFF6FF';
      case 'interview': return '#ECFDF5';
      case 'system': return '#EFF6FF';
      case 'rating': return '#FFFBEB';
      default: return '#F8FAFC';
    }
  }};
  border: 1.5px solid ${props => {
    switch(props.$type) {
      case 'application': return '#BFDBFE';
      case 'interview': return '#A7F3D0';
      case 'system': return '#BFDBFE';
      case 'rating': return '#FDE68A';
      default: return '#E2E8F0';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    switch(props.$type) {
      case 'application': return '#1e40af';
      case 'interview': return '#10B981';
      case 'system': return '#1e40af';
      case 'rating': return '#F59E0B';
      default: return '#64748B';
    }
  }};
  transition: all 0.2s ease;
  
  ${NotificationCard}:hover & {
    transform: scale(1.05);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 6px;
  line-height: 1.4;
`;

const NotificationMessage = styled.p`
  font-size: 14.5px;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 8px;
  font-weight: 500;
`;

const NotificationMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #64748B;
    font-weight: 500;
    
    svg {
      width: 14px;
      height: 14px;
      opacity: 0.8;
    }
  }
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: flex-end;
`;

const IconButton = styled(motion.button)`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${props => {
    if (props.$variant === 'danger') return '#FEF2F2';
    return '#F1F5F9';
  }};
  color: ${props => {
    if (props.$variant === 'danger') return '#EF4444';
    return '#64748B';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${props => {
    if (props.$variant === 'danger') return '#FECACA';
    return '#E2E8F0';
  }};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background: ${props => {
      if (props.$variant === 'danger') return '#FEE2E2';
      return '#E2E8F0';
    }};
    color: ${props => {
      if (props.$variant === 'danger') return '#DC2626';
      return '#334155';
    }};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => {
      if (props.$variant === 'danger') return 'rgba(239, 68, 68, 0.15)';
      return 'rgba(0, 0, 0, 0.05)';
    }};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const UnreadBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 80px 20px;
  background: ${props => props.theme.colors.bgLight};
  border-radius: 20px;
  border: 2px dashed ${props => props.theme.colors.border};
  
  svg {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
    color: ${props => props.theme.colors.primary};
    opacity: 0.4;
  }
  
  h3 {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 10px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: 15px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const getNotifications = (language) => ([
  {
    id: 1,
    type: 'application',
    title: language === 'vi' ? 'Ứng viên mới ứng tuyển' : 'New candidate application',
    message: language === 'vi' ? 'Nguyễn Hùng Anh đã ứng tuyển' : 'Nguyen Van A has applied',
    jobTitle: language === 'vi' ? 'Nhân viên Bán Hàng' : 'Sales Staff',
    time: language === 'vi' ? '5 phút trước' : '5 minutes ago',
    read: false,
    isQuickJob: true,
    icon: UserPlus
  },
  {
    id: 2,
    type: 'application',
    title: language === 'vi' ? 'Ứng viên mới ứng tuyển' : 'New candidate application',
    message: language === 'vi' ? 'Trương Tú Phương đã ứng tuyển' : 'Tran Thi B has applied',
    jobTitle: language === 'vi' ? 'Nhân viên Hành Chính' : 'Administrative Staff',
    time: language === 'vi' ? '15 phút trước' : '15 minutes ago',
    read: false,
    isQuickJob: true,
    icon: UserPlus
  },
  {
    id: 3,
    type: 'application',
    title: language === 'vi' ? 'Nhận hồ sơ ứng tuyển' : 'Application received',
    message: language === 'vi' ? 'Lê Văn Minh đã ứng tuyển' : 'Le Van Minh has applied',
    jobTitle: language === 'vi' ? 'Kỹ sư Phần mềm' : 'Software Engineer',
    time: language === 'vi' ? '1 giờ trước' : '1 hour ago',
    read: false,
    isQuickJob: true,
    icon: UserPlus
  },
  {
    id: 4,
    type: 'system',
    title: language === 'vi' ? 'Gói sắp hết hạn' : 'Package expiring soon',
    message: language === 'vi' ? 'Gói Banner Nổi Bật của bạn sẽ hết hạn vào 20/03/2026' : 'Your Featured Banner package will expire on 20/03/2026',
    time: language === 'vi' ? '1 ngày trước' : '1 day ago',
    read: false,
    isQuickJob: false,
    icon: AlertCircle
  }
]);

const EmployerNotifications = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(() => getNotifications(language));

  useEffect(() => {
    setNotifications(prev => {
      const next = getNotifications(language);
      return next.map(item => {
        const previousItem = prev.find(p => p.id === item.id);
        return previousItem ? { ...item, read: previousItem.read } : item;
      });
    });
  }, [language]);

  const tabs = [
    { id: 'all', label: language === 'vi' ? 'Tất cả' : 'All', count: notifications.length },
    { id: 'unread', label: language === 'vi' ? 'Chưa đọc' : 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'application', label: language === 'vi' ? 'Ứng tuyển' : 'Applications', count: notifications.filter(n => n.type === 'application').length },
    { id: 'system', label: language === 'vi' ? 'Hệ thống' : 'System', count: notifications.filter(n => n.type === 'system').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    // Show quick job notifications and system notifications (like package expiring)
    if (!notification.isQuickJob && notification.type !== 'system') return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout role="employer" key={language}>
      <NotificationsContainer>
        <PageHeader>
          <PageTitleGroup>
            <PageIconBox>
              <Bell />
            </PageIconBox>
            <PageTitleText>
              <h1>{language === 'vi' ? 'Thông Báo' : 'Notifications'}</h1>
              <p>{language === 'vi' ? 'Cập nhật tình trạng tuyển dụng' : 'Stay updated on hiring status'}</p>
            </PageTitleText>
          </PageTitleGroup>
        </PageHeader>

        <HeaderActions>
          <TabContainer>
            {tabs.map(tab => (
              <Tab
                key={tab.id}
                $active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </Tab>
            ))}
          </TabContainer>
          
          <ActionButtons>
            {unreadCount > 0 && (
              <ActionButton
                $variant="primary"
                onClick={handleMarkAllAsRead}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle />
                {language === 'vi' ? 'Đánh dấu đã đọc tất cả' : 'Mark all as read'}
              </ActionButton>
            )}
          </ActionButtons>
        </HeaderActions>

        {filteredNotifications.length > 0 ? (
          <NotificationsGrid>
            {filteredNotifications.map((notification, index) => (
              <NotificationCard
                key={notification.id}
                $type={notification.type}
                $read={notification.read}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <NotificationIcon $type={notification.type}>
                  <notification.icon />
                </NotificationIcon>
                
                <NotificationContent>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                  <NotificationMessage>
                    {notification.message}
                    {notification.jobTitle && (
                      <span> — {notification.jobTitle}</span>
                    )}
                  </NotificationMessage>
                  <NotificationMeta>
                    <div className="meta-item">
                      <Clock />
                      {notification.time}
                    </div>
                    {!notification.read && <UnreadBadge>{language === 'vi' ? 'MỚI' : 'NEW'}</UnreadBadge>}
                  </NotificationMeta>
                </NotificationContent>
                
                <NotificationActions>
                  {!notification.read && (
                    <IconButton
                      onClick={() => handleMarkAsRead(notification.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={language === 'vi' ? 'Đánh dấu đã đọc' : 'Mark as read'}
                    >
                      <Eye />
                    </IconButton>
                  )}
                  <IconButton
                    $variant="danger"
                    onClick={() => handleDelete(notification.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={language === 'vi' ? 'Xóa' : 'Delete'}
                  >
                    <Trash2 />
                  </IconButton>
                </NotificationActions>
              </NotificationCard>
            ))}
          </NotificationsGrid>
        ) : (
          <EmptyState
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <BellOff />
            <h3>{language === 'vi' ? 'Không có thông báo' : 'No notifications'}</h3>
            <p>{language === 'vi' ? 'Bạn chưa có thông báo nào trong danh mục này' : 'There are no notifications in this category yet'}</p>
          </EmptyState>
        )}
      </NotificationsContainer>
    </DashboardLayout>
  );
};

export default EmployerNotifications;
