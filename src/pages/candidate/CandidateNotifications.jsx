import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Bell, 
  Briefcase, 
  CheckCircle, 
  Eye,
  Clock,
  X,
  TrendingUp,
  Award,
  Filter,
  Inbox,
  Mail
} from 'lucide-react';

const NotificationsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled(motion.div)`
  background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 48px;
  margin-bottom: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }
  
  .header-content {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .header-left {
      flex: 1;
      
      h1 {
        font-size: 36px;
        font-weight: 800;
        margin-bottom: 12px;
        letter-spacing: -0.5px;
        display: flex;
        align-items: center;
        gap: 16px;
        
        svg {
          width: 40px;
          height: 40px;
        }
      }
      
      p {
        font-size: 16px;
        opacity: 0.9;
        font-weight: 400;
      }
    }
    
    .header-stats {
      display: flex;
      gap: 24px;
      
      .stat-item {
        text-align: center;
        
        .stat-value {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 13px;
          opacity: 0.8;
          font-weight: 500;
        }
      }
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FilterBar = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)`
  padding: 10px 20px;
  border-radius: 24px;
  border: none;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #1e40af 0%, #1e40af 100%)' 
    : props.theme.colors.bgLight};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$active 
    ? '0 4px 12px rgba(30, 64, 175, 0.4)' 
    : '0 2px 8px rgba(0, 0, 0, 0.08)'};
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  .badge {
    background: ${props => props.$active ? 'rgba(255, 255, 255, 0.3)' : props.theme.colors.primary};
    color: ${props => props.$active ? 'white' : 'white'};
    padding: 2px 7px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 700;
    min-width: 20px;
    text-align: center;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$active 
      ? '0 6px 16px rgba(30, 64, 175, 0.5)' 
      : '0 4px 12px rgba(0, 0, 0, 0.12)'};
    ${props => !props.$active && `
      background: ${props.theme.colors.bgDark};
    `}
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const NotificationCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 24px;
  border: 1px solid ${props => props.$unread ? props.theme.colors.primary : props.theme.colors.border};
  border-left: 4px solid ${props => props.$borderColor || props.theme.colors.border};
  display: flex;
  gap: 16px;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => props.$borderColor || props.theme.colors.primary};
  }
  
  ${props => props.$unread && `
    background: linear-gradient(135deg, rgba(30, 64, 175, 0.03) 0%, rgba(30, 64, 175, 0.03) 100%);
  `}
`;

const NotificationIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.$color || props.theme.colors.primary}15;
  color: ${props => props.$color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 28px;
    height: 28px;
  }
`;

const NotificationContent = styled.div`
  flex: 1;
  
  h3 {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 8px;
    
    .unread-badge {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${props => props.theme.colors.primary};
    }
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    opacity: 0.85;
    margin-bottom: 10px;
    line-height: 1.6;
    font-weight: 500;
  }
  
  .notification-footer {
    display: flex;
    align-items: center;
    gap: 16px;
    
    time {
      font-size: 13px;
      color: ${props => props.theme.colors.text};
      opacity: 0.7;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
      
      svg {
        width: 14px;
        height: 14px;
      }
    }
  }
`;

const ActionButton = styled(motion.button)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.bgDark};
  color: ${props => props.theme.colors.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
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
  }
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const StatItem = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  border-left: 4px solid ${props => props.$color || props.theme.colors.primary};
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    
    .stat-label {
      font-size: 13px;
      color: ${props => props.theme.colors.textLight};
      font-weight: 600;
    }
    
    svg {
      width: 18px;
      height: 18px;
      color: ${props => props.$color || props.theme.colors.primary};
    }
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: 800;
    color: ${props => props.$color || props.theme.colors.primary};
  }
`;

const ActivityItem = styled.div`
  padding: 14px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  h4 {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
  }
  
  p {
    font-size: 12px;
    color: ${props => props.theme.colors.textLight};
  }
`;

function CandidateNotifications() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState('all');
  
  const getNotificationsData = () => [
    {
      id: 1,
      type: 'application',
      icon: Eye,
      color: '#1e40af',
      title: language === 'vi' ? 'Hồ sơ đã được xem' : 'Profile viewed',
      message: language === 'vi' 
        ? 'FPT Software đã xem hồ sơ ứng tuyển Senior React Developer của bạn'
        : 'FPT Software viewed your Senior React Developer application',
      time: language === 'vi' ? '2 giờ trước' : '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'success',
      icon: CheckCircle,
      color: '#10B981',
      title: language === 'vi' ? 'Hồ sơ được chấp nhận' : 'Application accepted',
      message: language === 'vi'
        ? 'Hồ sơ Nhân viên tại Highlands của bạn đã được chấp nhận'
        : 'Your application for Highlands has been accepted',
      time: language === 'vi' ? '1 ngày trước' : '1 day ago',
      unread: false
    },
    {
      id: 3,
      type: 'application',
      icon: Briefcase,
      color: '#1e40af',
      title: language === 'vi' ? 'Công việc phù hợp với bạn' : 'Jobs matching your profile',
      message: language === 'vi'
        ? 'Có 3 công việc mới phù hợp với kỹ năng React, Node.js của bạn'
        : '3 new jobs match your React, Node.js skills',
      time: language === 'vi' ? '3 giờ trước' : '3 hours ago',
      unread: true
    },
    {
      id: 4,
      type: 'success',
      icon: Award,
      color: '#10B981',
      title: language === 'vi' ? 'Chúc mừng! Hồ sơ hoàn thiện 100%' : 'Congratulations! Profile 100% complete',
      message: language === 'vi'
        ? 'Bạn đã hoàn thiện hồ sơ. Cơ hội được tuyển dụng tăng 70%'
        : 'You completed your profile. Your hiring chances increased by 70%',
      time: language === 'vi' ? '3 ngày trước' : '3 days ago',
      unread: false
    },
    {
      id: 5,
      type: 'application',
      icon: Eye,
      color: '#F59E0B',
      title: language === 'vi' ? 'Đề xuất: Hồ sơ của bạn đang được quan tâm!' : 'Suggestion: Your profile is getting attention!',
      message: language === 'vi'
        ? 'Bạn có 12 nhà tuyển dụng đã xem hồ sơ và 5 công việc mới phù hợp với bạn. Hãy cập nhật hồ sơ để tăng cơ hội!'
        : 'You have 12 employers who viewed your profile and 5 new matching jobs. Update your profile to increase your chances!',
      time: language === 'vi' ? 'Hôm nay' : 'Today',
      unread: true
    }
  ];

  const [notifications, setNotifications] = useState(getNotificationsData());

  useEffect(() => {
    setNotifications(getNotificationsData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const handleRemoveNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter(n => n.unread)
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <DashboardLayout role="candidate" showSearch={false} key={language}>
      <NotificationsContainer>
        <PageHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-left">
              <h1><Bell />{language === 'vi' ? 'Thông Báo' : 'Notifications'}</h1>
              <p>{language === 'vi' ? 'Cập nhật mới nhất về công việc và hồ sơ của bạn' : 'Latest updates about your jobs and profile'}</p>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <div className="stat-value">{notifications.length}</div>
                <div className="stat-label">{language === 'vi' ? 'Tổng số' : 'Total'}</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{unreadCount}</div>
                <div className="stat-label">{language === 'vi' ? 'Chưa đọc' : 'Unread'}</div>
              </div>
            </div>
          </div>
        </PageHeader>

        <ContentGrid>
          <MainContent>
            <FilterBar
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <FilterButton
                $active={filter === 'all'}
                onClick={() => setFilter('all')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Inbox />
                <span>{language === 'vi' ? 'Tất cả' : 'All'}</span>
                <span className="badge">{notifications.length}</span>
              </FilterButton>
              <FilterButton
                $active={filter === 'unread'}
                onClick={() => setFilter('unread')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail />
                <span>{language === 'vi' ? 'Chưa đọc' : 'Unread'}</span>
                <span className="badge">{unreadCount}</span>
              </FilterButton>
            </FilterBar>

            {filteredNotifications.map((notif, index) => (
              <NotificationCard 
                key={notif.id} 
                $unread={notif.unread}
                $borderColor={notif.color}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                onClick={() => handleMarkAsRead(notif.id)}
                whileHover={{ scale: 1.01 }}
              >
                <NotificationIcon $color={notif.color}>
                  <notif.icon />
                </NotificationIcon>
                <NotificationContent>
                  <h3>
                    {notif.title}
                    {notif.unread && <span className="unread-badge" />}
                  </h3>
                  <p>{notif.message}</p>
                  <div className="notification-footer">
                    <time>
                      <Clock />
                      {notif.time}
                    </time>
                  </div>
                </NotificationContent>
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveNotification(notif.id);
                  }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X />
                </ActionButton>
              </NotificationCard>
            ))}

            {filteredNotifications.length === 0 && (
              <Card
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', padding: '60px 20px' }}
              >
                <Bell size={48} style={{ color: '#CBD5E1', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#E2E8F0' }}>
                  {language === 'vi' ? 'Không có thông báo' : 'No notifications'}
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>
                  {filter === 'unread'
                    ? (language === 'vi' ? 'Bạn đã đọc tất cả thông báo' : 'You have read all notifications')
                    : (language === 'vi' ? 'Không có thông báo nào trong mục này' : 'No notifications in this category')}
                </p>
              </Card>
            )}
          </MainContent>

          <Sidebar>
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="card-header">
                <h2><TrendingUp />{language === 'vi' ? 'Thống kê' : 'Statistics'}</h2>
              </div>
              
              <QuickStats>
                <StatItem $color="#1e40af">
                  <div className="stat-header">
                    <span className="stat-label">{language === 'vi' ? 'Thông báo hôm nay' : 'Today\'s notifications'}</span>
                    <Bell />
                  </div>
                  <div className="stat-value">{notifications.filter(n => n.time.includes(language === 'vi' ? 'giờ trước' : 'hours ago')).length}</div>
                </StatItem>
                
                <StatItem $color="#10B981">
                  <div className="stat-header">
                    <span className="stat-label">{language === 'vi' ? 'Lượt xem hồ sơ' : 'Profile views'}</span>
                    <Eye />
                  </div>
                  <div className="stat-value">{notifications.filter(n => n.type === 'application' && (n.title.includes('xem') || n.title.includes('viewed'))).length}</div>
                </StatItem>
                
                <StatItem $color="#1e40af">
                  <div className="stat-header">
                    <span className="stat-label">{language === 'vi' ? 'Hồ sơ được chấp nhận' : 'Applications accepted'}</span>
                    <CheckCircle />
                  </div>
                  <div className="stat-value">{notifications.filter(n => n.type === 'success' && (n.title.includes('chấp nhận') || n.title.includes('accepted'))).length}</div>
                </StatItem>
                
                <StatItem $color="#10B981">
                  <div className="stat-header">
                    <span className="stat-label">{language === 'vi' ? 'Công việc phù hợp' : 'Matching jobs'}</span>
                    <Briefcase />
                  </div>
                  <div className="stat-value">{notifications.filter(n => n.title.includes('phù hợp') || n.title.includes('matching')).length}</div>
                </StatItem>
              </QuickStats>
            </Card>

            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="card-header">
                <h2><Clock />{language === 'vi' ? 'Hoạt động gần đây' : 'Recent Activity'}</h2>
              </div>
              
              {notifications.slice(0, 4).map((notif, index) => (
                <ActivityItem key={notif.id}>
                  <h4>{notif.title}</h4>
                  <p>{notif.time}</p>
                </ActivityItem>
              ))}
            </Card>
          </Sidebar>
        </ContentGrid>
      </NotificationsContainer>
    </DashboardLayout>
  );
}

export default CandidateNotifications;
