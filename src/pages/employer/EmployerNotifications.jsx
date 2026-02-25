import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
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
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 15px;
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
  background: ${props => props.theme.colors.bgDark};
  border-radius: 14px;
  overflow-x: auto;
  flex: 1;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }
`;

const Tab = styled(motion.button)`
  padding: 10px 20px;
  background: ${props => props.$active ? 'white' : 'transparent'};
  border: none;
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textLight};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'};
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
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
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: ${props => props.$variant === 'primary' 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'white'};
  color: ${props => props.$variant === 'primary' ? 'white' : props.theme.colors.text};
  border: 2px solid ${props => props.$variant === 'primary' ? 'transparent' : props.theme.colors.border};
  box-shadow: ${props => props.$variant === 'primary' 
    ? '0 4px 12px rgba(102, 126, 234, 0.3)' 
    : '0 2px 8px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$variant === 'primary' 
      ? '0 8px 20px rgba(102, 126, 234, 0.4)' 
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
  background: white;
  border: 2px solid ${props => props.$read ? props.theme.colors.border : props.theme.colors.primary + '40'};
  border-radius: 16px;
  padding: 20px 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
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
    background: ${props => {
      switch(props.$type) {
        case 'application': return 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)';
        case 'interview': return 'linear-gradient(180deg, #10B981 0%, #059669 100%)';
        case 'system': return 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)';
        case 'rating': return 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)';
        default: return 'linear-gradient(180deg, #94A3B8 0%, #64748B 100%)';
      }
    }};
    opacity: ${props => props.$read ? '0.3' : '1'};
  }
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
    border-color: ${props => props.theme.colors.primary}60;
  }
`;

const NotificationIcon = styled.div`
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 12px;
  background: ${props => {
    switch(props.$type) {
      case 'application': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'interview': return 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
      case 'system': return 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
      case 'rating': return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
      default: return 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px ${props => {
    switch(props.$type) {
      case 'application': return 'rgba(102, 126, 234, 0.3)';
      case 'interview': return 'rgba(16, 185, 129, 0.3)';
      case 'system': return 'rgba(59, 130, 246, 0.3)';
      case 'rating': return 'rgba(245, 158, 11, 0.3)';
      default: return 'rgba(0, 0, 0, 0.1)';
    }
  }};
  transition: all 0.3s ease;
  
  ${NotificationCard}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
  line-height: 1.4;
`;

const NotificationMessage = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  line-height: 1.6;
  margin-bottom: 8px;
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
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
    
    svg {
      width: 14px;
      height: 14px;
      opacity: 0.7;
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
    if (props.$variant === 'danger') return props.theme.colors.error + '10';
    return props.theme.colors.bgDark;
  }};
  color: ${props => {
    if (props.$variant === 'danger') return props.theme.colors.error;
    return props.theme.colors.text;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: ${props => {
      if (props.$variant === 'danger') return props.theme.colors.error;
      return props.theme.colors.primary;
    }};
    color: white;
    transform: scale(1.1);
    box-shadow: 0 4px 12px ${props => {
      if (props.$variant === 'danger') return props.theme.colors.error + '40';
      return 'rgba(102, 126, 234, 0.3)';
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
  background: white;
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

const EmployerNotifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'application',
      title: 'Ứng viên mới ứng tuyển',
      message: 'Nguyễn Văn A đã ứng tuyển vào vị trí Senior React Developer',
      time: '5 phút trước',
      read: false,
      icon: UserPlus
    },
    {
      id: 2,
      type: 'application',
      title: 'Ứng viên mới ứng tuyển',
      message: 'Trần Thị B đã ứng tuyển vào vị trí Nhân viên Marketing',
      time: '15 phút trước',
      read: false,
      icon: UserPlus
    },
    {
      id: 3,
      type: 'interview',
      title: 'Lịch phỏng vấn sắp tới',
      message: 'Bạn có lịch phỏng vấn với Lê Văn C vào lúc 14:00 ngày 26/02/2026',
      time: '1 giờ trước',
      read: false,
      icon: Clock
    },
    {
      id: 4,
      type: 'rating',
      title: 'Đánh giá nhân viên mới',
      message: 'Phạm Thị D đã hoàn thành công việc. Vui lòng đánh giá nhân viên.',
      time: '2 giờ trước',
      read: false,
      icon: Star
    },
    {
      id: 5,
      type: 'system',
      title: 'Tin tuyển dụng sắp hết hạn',
      message: 'Tin tuyển dụng "Thu ngân" sẽ hết hạn vào 27/02/2026',
      time: '3 giờ trước',
      read: true,
      icon: AlertCircle
    },
    {
      id: 6,
      type: 'application',
      title: 'Hồ sơ đã được xem',
      message: '12 ứng viên mới đã xem tin tuyển dụng của bạn',
      time: '4 giờ trước',
      read: true,
      icon: Eye
    },
    {
      id: 7,
      type: 'system',
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống đã được cập nhật phiên bản mới với nhiều tính năng hữu ích',
      time: '1 ngày trước',
      read: true,
      icon: CheckCircle
    },
    {
      id: 8,
      type: 'interview',
      title: 'Phỏng vấn đã hoàn thành',
      message: 'Phỏng vấn với Hoàng Văn E đã hoàn thành. Vui lòng cập nhật kết quả.',
      time: '2 ngày trước',
      read: true,
      icon: CheckCircle
    }
  ]);

  const tabs = [
    { id: 'all', label: 'Tất cả', count: notifications.length },
    { id: 'unread', label: 'Chưa đọc', count: notifications.filter(n => !n.read).length },
    { id: 'application', label: 'Ứng tuyển', count: notifications.filter(n => n.type === 'application').length },
    { id: 'interview', label: 'Phỏng vấn', count: notifications.filter(n => n.type === 'interview').length },
    { id: 'system', label: 'Hệ thống', count: notifications.filter(n => n.type === 'system').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
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
    <DashboardLayout role="employer">
      <NotificationsContainer>
        <PageHeader>
          <h1>Thông Báo</h1>
          <p>Cập nhật tình trạng tuyển dụng</p>
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
                Đánh dấu đã đọc tất cả
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
                  <NotificationMessage>{notification.message}</NotificationMessage>
                  <NotificationMeta>
                    <div className="meta-item">
                      <Clock />
                      {notification.time}
                    </div>
                    {!notification.read && <UnreadBadge>MỚI</UnreadBadge>}
                  </NotificationMeta>
                </NotificationContent>
                
                <NotificationActions>
                  {!notification.read && (
                    <IconButton
                      onClick={() => handleMarkAsRead(notification.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="Đánh dấu đã đọc"
                    >
                      <Eye />
                    </IconButton>
                  )}
                  <IconButton
                    $variant="danger"
                    onClick={() => handleDelete(notification.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Xóa"
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
            <h3>Không có thông báo</h3>
            <p>Bạn chưa có thông báo nào trong danh mục này</p>
          </EmptyState>
        )}
      </NotificationsContainer>
    </DashboardLayout>
  );
};

export default EmployerNotifications;
