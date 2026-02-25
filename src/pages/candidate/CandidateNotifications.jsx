import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  Bell, 
  Briefcase, 
  CheckCircle, 
  MessageSquare, 
  AlertCircle,
  Eye,
  Clock,
  ThumbsUp,
  X,
  Filter,
  Check,
  UserPlus,
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react';

const NotificationsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 20px 24px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  
  .filter-left {
    display: flex;
    align-items: center;
    gap: 12px;
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => props.theme.colors.primary};
    }
    
    span {
      font-weight: 600;
      font-size: 14px;
      color: ${props => props.theme.colors.text};
    }
  }
  
  .filter-buttons {
    display: flex;
    gap: 8px;
  }
`;

const FilterButton = styled(motion.button)`
  padding: 8px 16px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
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
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
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
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 10px;
    line-height: 1.6;
  }
  
  .notification-footer {
    display: flex;
    align-items: center;
    gap: 16px;
    
    time {
      font-size: 13px;
      color: ${props => props.theme.colors.textLight};
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
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'application',
      icon: Eye,
      color: '#667eea',
      title: 'Hồ sơ đã được xem',
      message: 'FPT Software đã xem hồ sơ ứng tuyển Senior React Developer của bạn',
      time: '2 giờ trước',
      unread: true
    },
    {
      id: 2,
      type: 'message',
      icon: MessageSquare,
      color: '#F59E0B',
      title: 'Tin nhắn mới',
      message: 'Bạn có tin nhắn mới từ Hồng Trà Ngô Gia',
      time: '5 giờ trước',
      unread: true
    },
    {
      id: 3,
      type: 'success',
      icon: CheckCircle,
      color: '#10B981',
      title: 'Hồ sơ được chấp nhận',
      message: 'Hồ sơ Nhân viên tại Highlands của bạn đã được chấp nhận',
      time: '1 ngày trước',
      unread: false
    },
    {
      id: 4,
      type: 'application',
      icon: Briefcase,
      color: '#667eea',
      title: 'Công việc phù hợp với bạn',
      message: 'Có 3 công việc mới phù hợp với kỹ năng React, Node.js của bạn',
      time: '3 giờ trước',
      unread: true
    },
    {
      id: 5,
      type: 'success',
      icon: ThumbsUp,
      color: '#10B981',
      title: 'Hồ sơ được yêu thích',
      message: 'VNG Corporation đã lưu hồ sơ của bạn vào danh sách ứng viên tiềm năng',
      time: '6 giờ trước',
      unread: true
    },
    {
      id: 6,
      type: 'alert',
      icon: Calendar,
      color: '#EF4444',
      title: 'Lời mời phỏng vấn',
      message: 'Grab Vietnam mời bạn tham gia phỏng vấn vào 10:00 AM ngày 28/02/2026',
      time: '1 ngày trước',
      unread: false
    },
    {
      id: 7,
      type: 'info',
      icon: TrendingUp,
      color: '#667eea',
      title: 'Hồ sơ của bạn nổi bật',
      message: 'Hồ sơ của bạn đã được xem 156 lần trong tuần này, tăng 45% so với tuần trước',
      time: '2 ngày trước',
      unread: false
    },
    {
      id: 8,
      type: 'success',
      icon: Award,
      color: '#10B981',
      title: 'Chúc mừng! Hồ sơ hoàn thiện 100%',
      message: 'Bạn đã hoàn thiện hồ sơ. Cơ hội được tuyển dụng tăng 70%',
      time: '3 ngày trước',
      unread: false
    },
    {
      id: 9,
      type: 'message',
      icon: MessageSquare,
      color: '#F59E0B',
      title: 'Tin nhắn từ nhà tuyển dụng',
      message: 'Shopee Vietnam đã gửi tin nhắn về vị trí Senior Frontend Engineer',
      time: '4 giờ trước',
      unread: true
    },
    {
      id: 10,
      type: 'application',
      icon: UserPlus,
      color: '#667eea',
      title: 'Nhà tuyển dụng theo dõi bạn',
      message: 'Tiki Corporation và 2 công ty khác đã theo dõi hồ sơ của bạn',
      time: '1 ngày trước',
      unread: false
    }
  ]);

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
    <DashboardLayout role="candidate" showSearch={false}>
      <NotificationsContainer>
        <PageHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-left">
              <h1><Bell />Thông Báo</h1>
              <p>Cập nhật mới nhất về công việc và hồ sơ của bạn</p>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <div className="stat-value">{notifications.length}</div>
                <div className="stat-label">Tổng số</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{unreadCount}</div>
                <div className="stat-label">Chưa đọc</div>
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
              <div className="filter-left">
                <Filter />
                <span>Lọc thông báo</span>
              </div>
              <div className="filter-buttons">
                <FilterButton 
                  $active={filter === 'all'}
                  onClick={() => setFilter('all')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tất cả
                </FilterButton>
                <FilterButton 
                  $active={filter === 'unread'}
                  onClick={() => setFilter('unread')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Chưa đọc
                </FilterButton>
                <FilterButton 
                  $active={filter === 'application'}
                  onClick={() => setFilter('application')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ứng tuyển
                </FilterButton>
                <FilterButton 
                  $active={filter === 'message'}
                  onClick={() => setFilter('message')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tin nhắn
                </FilterButton>
              </div>
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
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#64748B' }}>
                  Không có thông báo
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>
                  {filter === 'unread' 
                    ? 'Bạn đã đọc tất cả thông báo' 
                    : 'Chưa có thông báo nào trong mục này'}
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
                <h2><TrendingUp />Thống kê</h2>
              </div>
              
              <QuickStats>
                <StatItem $color="#667eea">
                  <div className="stat-header">
                    <span className="stat-label">Thông báo hôm nay</span>
                    <Bell />
                  </div>
                  <div className="stat-value">6</div>
                </StatItem>
                
                <StatItem $color="#10B981">
                  <div className="stat-header">
                    <span className="stat-label">Lượt xem hồ sơ</span>
                    <Eye />
                  </div>
                  <div className="stat-value">156</div>
                </StatItem>
                
                <StatItem $color="#F59E0B">
                  <div className="stat-header">
                    <span className="stat-label">Tin nhắn mới</span>
                    <MessageSquare />
                  </div>
                  <div className="stat-value">2</div>
                </StatItem>
                
                <StatItem $color="#EF4444">
                  <div className="stat-header">
                    <span className="stat-label">Lời mời phỏng vấn</span>
                    <Calendar />
                  </div>
                  <div className="stat-value">1</div>
                </StatItem>
              </QuickStats>
            </Card>

            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="card-header">
                <h2><Clock />Hoạt động gần đây</h2>
              </div>
              
              <ActivityItem>
                <h4>FPT Software xem hồ sơ</h4>
                <p>2 giờ trước</p>
              </ActivityItem>
              
              <ActivityItem>
                <h4>Bạn nhận tin nhắn mới</h4>
                <p>5 giờ trước</p>
              </ActivityItem>
              
              <ActivityItem>
                <h4>Hồ sơ được chấp nhận</h4>
                <p>1 ngày trước</p>
              </ActivityItem>
              
              <ActivityItem>
                <h4>Lời mời phỏng vấn từ Grab</h4>
                <p>1 ngày trước</p>
              </ActivityItem>
            </Card>
          </Sidebar>
        </ContentGrid>
      </NotificationsContainer>
    </DashboardLayout>
  );
}

export default CandidateNotifications;
