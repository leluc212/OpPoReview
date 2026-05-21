import { useState, useEffect } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  Bell, 
  Settings,
  CheckCircle,
  AlertCircle,
  Info,
  Users,
  Briefcase,
  DollarSign,
  Filter,
  Search,
  Trash2,
  Eye,
  Send,
  Package
} from 'lucide-react';
import { Button } from '../../components/FormElements';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeaderLeft = styled.div``;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div``;

const Sidebar = styled.div``;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 1.25rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border-left: 4px solid ${props => props.$color};
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.9rem;
  background: ${props => props.theme.colors.bgLight};
  color: #F1F5F9;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NotificationItem = styled.div`
  background: ${props => props.$unread ? props.theme.colors.bgDark : props.theme.colors.bgLight};
  border: 2px solid ${props => props.$unread ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.25rem;
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-2px);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const NotificationIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$color ? `${props.$color}15` : `${props.theme.colors.primary}15`};
  color: ${props => props.$color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const NotificationMessage = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  opacity: 0.85;
`;

const NotificationMeta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text};
  opacity: 0.7;
  font-weight: 500;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${props => {
    switch(props.$variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary};
          color: white;
          &:hover {
            opacity: 0.9;
          }
        `;
      case 'danger':
        return `
          background: #fee2e2;
          color: #dc2626;
          &:hover {
            background: #fecaca;
          }
        `;
      default:
        return `
          background: ${props.theme.colors.background};
          color: ${props.theme.colors.text};
          &:hover {
            background: ${props.theme.colors.border};
          }
        `;
    }
  }}
`;

const UnreadBadge = styled.span`
  width: 8px;
  height: 8px;
  background: #1e40af;
  border-radius: 50%;
  flex-shrink: 0;
`;

const SettingsCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SettingsTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.25rem;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: ${props => props.theme.colors.primary};
  }

  input:checked + span:before {
    transform: translateX(24px);
  }
`;

const AdminNotifications = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    posts: true,
    payments: true,
    urgent: true,
    employers: true
  });

  // Load notifications from API
  useEffect(() => {
    loadNotifications();
    
    // Poll every 10 seconds
    const interval = setInterval(loadNotifications, 10000);
    
    return () => clearInterval(interval);
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      const userId = 'admin';
      const role = 'admin';
      const notifs = await getNotifications(userId, role);
      
      console.log('📥 Loaded notifications:', notifs);
      setNotifications(notifs);
      setLoading(false);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead('admin', 'admin');
      await loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      if (!notification.read) {
        await markAsRead(notification.notificationId);
        await loadNotifications();
      }
      
      // Navigate to action URL
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  // Map notification type to icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'package_purchase_request':
        return Package;
      case 'package_approved':
        return CheckCircle;
      case 'employers':
        return Briefcase;
      case 'posts':
        return AlertCircle;
      case 'payments':
        return DollarSign;
      case 'urgent':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  // Format time from ISO string
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return language === 'vi' ? 'Vừa xong' : 'Just now';
    if (diffMins < 60) return language === 'vi' ? `${diffMins} phút trước` : `${diffMins} min ago`;
    if (diffHours < 24) return language === 'vi' ? `${diffHours} giờ trước` : `${diffHours} hours ago`;
    if (diffDays < 7) return language === 'vi' ? `${diffDays} ngày trước` : `${diffDays} days ago`;
    
    return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US');
  };

  const handleToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.type === 'package_purchase_request').length;

  // Helper function to parse time string to milliseconds for sorting
  const parseTimeToMs = (isoString) => {
    return new Date(isoString).getTime();
  };

  // Filter and sort notifications
  const displayNotifications = notifications
    .filter(notification => {
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const title = language === 'vi' ? notification.title : notification.titleEn;
        const message = language === 'vi' ? notification.message : notification.messageEn;
        if (!title?.toLowerCase().includes(searchLower) && !message?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // Filter by type
      if (filterType === 'all') return true;
      if (filterType === 'payments') return notification.type === 'package_purchase_request' || notification.type === 'package_approved';
      return notification.type === filterType;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return parseTimeToMs(b.createdAt) - parseTimeToMs(a.createdAt);
        case 'oldest':
          return parseTimeToMs(a.createdAt) - parseTimeToMs(b.createdAt);
        case 'unread':
          // Unread first, then by newest
          if (a.read === b.read) {
            return parseTimeToMs(b.createdAt) - parseTimeToMs(a.createdAt);
          }
          return a.read ? 1 : -1;
        default:
          return 0;
      }
    });

  return (
    <DashboardLayout role="admin" key={language}>
      <PageContainer>
        <PageHeader>
          <HeaderLeft>
            <Title>{language === 'vi' ? 'Thông Báo Hệ Thống' : 'System Notifications'}</Title>
            <Subtitle>{language === 'vi' ? 'Theo dõi và quản lý tất cả thông báo' : 'Track and manage all notifications'}</Subtitle>
          </HeaderLeft>
          <HeaderActions>
            <Button $variant="outline" onClick={handleMarkAllAsRead}>
              <Eye size={18} />
              {language === 'vi' ? 'Đánh dấu đã đọc tất cả' : 'Mark all as read'}
            </Button>
          </HeaderActions>
        </PageHeader>

        <StatsGrid>
          <StatCard $color="#1e40af">
            <StatLabel>{language === 'vi' ? 'Chưa đọc' : 'Unread'}</StatLabel>
            <StatValue>{unreadCount}</StatValue>
          </StatCard>
          <StatCard $color="#f59e0b">
            <StatLabel>{language === 'vi' ? 'Cần xử lý' : 'Action required'}</StatLabel>
            <StatValue>{actionRequiredCount}</StatValue>
          </StatCard>
          <StatCard $color="#10b981">
            <StatLabel>{language === 'vi' ? 'Đã xử lý' : 'Resolved'}</StatLabel>
            <StatValue>{notifications.filter(n => !n.unread && !n.actionRequired).length}</StatValue>
          </StatCard>
          <StatCard $color="#8b5cf6">
            <StatLabel>{language === 'vi' ? 'Tổng thông báo' : 'Total'}</StatLabel>
            <StatValue>{notifications.length}</StatValue>
          </StatCard>
        </StatsGrid>

        <Grid>
          <MainContent>
            <FilterBar>
              <SearchBox>
                <SearchIcon size={18} />
                <SearchInput 
                  placeholder={language === 'vi' ? 'Tìm kiếm thông báo...' : 'Search notifications...'} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchBox>
              <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">{language === 'vi' ? 'Tất cả' : 'All'}</option>
                <option value="package_purchase_request">{language === 'vi' ? 'Yêu cầu mua gói' : 'Purchase requests'}</option>
                <option value="package_approved">{language === 'vi' ? 'Gói đã duyệt' : 'Approved packages'}</option>
                <option value="posts">{language === 'vi' ? 'Tin chưa duyệt' : 'Pending posts'}</option>
                <option value="payments">{language === 'vi' ? 'Thanh toán' : 'Payments'}</option>
                <option value="urgent">{language === 'vi' ? 'Công việc Tuyển gấp' : 'Urgent jobs'}</option>
                <option value="employers">{language === 'vi' ? 'Duyệt NTD' : 'Employer approval'}</option>
              </Select>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">{language === 'vi' ? 'Mới nhất' : 'Newest'}</option>
                <option value="oldest">{language === 'vi' ? 'Cũ nhất' : 'Oldest'}</option>
                <option value="unread">{language === 'vi' ? 'Chưa đọc' : 'Unread'}</option>
              </Select>
            </FilterBar>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                  {language === 'vi' ? 'Đang tải thông báo...' : 'Loading notifications...'}
                </div>
              </div>
            ) : displayNotifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                <Bell size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {language === 'vi' ? 'Không có thông báo' : 'No notifications'}
                </div>
                <div style={{ fontSize: '14px' }}>
                  {language === 'vi' ? 'Bạn sẽ nhận được thông báo khi có hoạt động mới' : 'You will receive notifications when there are new activities'}
                </div>
              </div>
            ) : (
              <NotificationList>
                {displayNotifications.map(notification => {
                  const NotifIcon = getNotificationIcon(notification.type);
                  const title = language === 'vi' ? notification.title : notification.titleEn;
                  const message = language === 'vi' ? notification.message : notification.messageEn;
                  const actionText = language === 'vi' ? notification.actionText : notification.actionTextEn;
                  const isActionRequired = notification.type === 'package_purchase_request';
                  
                  return (
                    <NotificationItem 
                      key={notification.notificationId} 
                      $unread={!notification.read}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <NotificationHeader>
                        <NotificationIcon $color={notification.color}>
                          <NotifIcon size={24} />
                        </NotificationIcon>
                        <NotificationContent>
                          <NotificationTitle>
                            {!notification.read && <UnreadBadge />}
                            {title}
                          </NotificationTitle>
                          <NotificationMessage>{message}</NotificationMessage>
                          <NotificationMeta>
                            <span>{formatTime(notification.createdAt)}</span>
                            {isActionRequired && (
                              <span style={{ color: '#f59e0b', fontWeight: 500 }}>
                                • {language === 'vi' ? 'Cần xử lý' : 'Action required'}
                              </span>
                            )}
                          </NotificationMeta>
                        </NotificationContent>
                      </NotificationHeader>
                      {isActionRequired && (
                        <NotificationActions>
                          <ActionButton $variant="primary" onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notification);
                          }}>
                            <CheckCircle size={16} />
                            {actionText || (language === 'vi' ? 'Xử lý ngay' : 'Handle now')}
                          </ActionButton>
                        </NotificationActions>
                      )}
                    </NotificationItem>
                  );
                })}
              </NotificationList>
            )}
          </MainContent>

          <Sidebar>
            <SettingsCard>
              <SettingsTitle>
                <Settings size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                {language === 'vi' ? 'Cài Đặt Thông Báo' : 'Notification Settings'}
              </SettingsTitle>
              
              <SettingItem>
                <SettingLabel>{language === 'vi' ? 'Tin chưa được duyệt' : 'Pending posts'}</SettingLabel>
                <ToggleSwitch>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.posts}
                    onChange={() => handleToggle('posts')}
                  />
                  <span></span>
                </ToggleSwitch>
              </SettingItem>

              <SettingItem>
                <SettingLabel>{language === 'vi' ? 'Mua bài' : 'Package purchases'}</SettingLabel>
                <ToggleSwitch>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.payments}
                    onChange={() => handleToggle('payments')}
                  />
                  <span></span>
                </ToggleSwitch>
              </SettingItem>

              <SettingItem>
                <SettingLabel>{language === 'vi' ? 'Công việc Tuyển gấp' : 'Urgent jobs'}</SettingLabel>
                <ToggleSwitch>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.urgent}
                    onChange={() => handleToggle('urgent')}
                  />
                  <span></span>
                </ToggleSwitch>
              </SettingItem>

              <SettingItem>
                <SettingLabel>{language === 'vi' ? 'Duyệt nhà tuyển dụng' : 'Employer approval'}</SettingLabel>
                <ToggleSwitch>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.employers}
                    onChange={() => handleToggle('employers')}
                  />
                  <span></span>
                </ToggleSwitch>
              </SettingItem>
            </SettingsCard>
          </Sidebar>
        </Grid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default AdminNotifications;

