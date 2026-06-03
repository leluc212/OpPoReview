import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import RelativeTime from '../../components/RelativeTime';
import { 
  Bell, 
  BellOff,
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
  Package,
  Clock,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';

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

const PageContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

const PageHeader = styled.div`
  margin-bottom: 28px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
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
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
  border: 1.5px solid #BFDBFE;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;

  svg {
    width: 24px;
    height: 24px;
    color: #1e40af;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.15);
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
  flex-wrap: wrap;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 320px;
  }

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div``;

const Sidebar = styled.div`
  @media (max-width: 968px) {
    order: -1;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 16px;
  border: 1.5px solid #F1F5F9;
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #F1F5F9;
    border-top-color: #1e40af;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 20px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .text {
    font-size: 16px;
    font-weight: 600;
    color: #64748B;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
`;

const StatCard = styled.div`
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.04);
  border: 1.5px solid #F1F5F9;
  border-left: 4px solid ${props => props.$color};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.12);
    border-color: #BFDBFE;
  }
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #64748B;
  margin-bottom: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #1E293B;
  line-height: 1;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 280px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  background: #ffffff;
  color: #1E293B;
  transition: all 0.2s ease;
  font-weight: 500;

  &::placeholder {
    color: #94A3B8;
  }

  &:focus {
    outline: none;
    border-color: #1e40af;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748B;
  width: 18px;
  height: 18px;
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  color: #1E293B;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 160px;

  &:focus {
    outline: none;
    border-color: #1e40af;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }

  &:hover {
    border-color: #93C5FD;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
  }
`;

const NotificationList = styled.div`
  display: grid;
  gap: 16px;
`;

const NotificationItem = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid ${props => props.$unread ? '#BFDBFE' : '#F1F5F9'};
  border-radius: 16px;
  padding: 20px 24px;
  transition: all 0.22s ease;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.04);
  position: relative;
  overflow: hidden;
  display: flex;
  gap: 16px;
  align-items: start;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    border-radius: 16px 0 0 16px;
    background: ${props => props.$color || '#1e40af'};
    opacity: ${props => props.$unread ? '0.8' : '0.2'};
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
  background: ${props => props.$color ? `${props.$color}15` : '#EFF6FF'};
  color: ${props => props.$color || '#1e40af'};
  border: 1.5px solid ${props => props.$color ? `${props.$color}40` : '#BFDBFE'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  
  ${NotificationItem}:hover & {
    transform: scale(1.05);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 6px;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  background: #1e40af;
  border-radius: 50%;
  flex-shrink: 0;
`;

const NotificationMessage = styled.div`
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
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1.5px solid #F1F5F9;
`;

const ActionButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => {
    switch(props.$variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(30, 64, 175, 0.35);
          }
        `;
      case 'danger':
        return `
          background: #FEF2F2;
          color: #EF4444;
          border: 1.5px solid #FECACA;
          &:hover {
            background: #FEE2E2;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
          }
        `;
      default:
        return `
          background: #F1F5F9;
          color: #475569;
          border: 1.5px solid #E2E8F0;
          &:hover {
            background: #E2E8F0;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0);
  }
`;

const SettingsCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.04);
  border: 1.5px solid #F1F5F9;
  padding: 24px;
  margin-bottom: 20px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.08);
    border-color: #BFDBFE;
  }
`;

const SettingsTitle = styled.h3`
  font-size: 17px;
  font-weight: 800;
  color: #1E293B;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: #1e40af;
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1.5px solid #F1F5F9;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

const SettingLabel = styled.div`
  font-size: 14px;
  color: #475569;
  font-weight: 600;
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
    background-color: #cbd5e1;
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
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }

  input:checked + span {
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  }

  input:checked + span:before {
    transform: translateX(24px);
  }

  &:hover span {
    opacity: 0.9;
  }
`;

const StyledButton = styled(motion.button)`
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
  background: #ffffff;
  color: #1E293B;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #93C5FD;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
    }
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
    
    // Poll every 3 seconds for faster updates
    const interval = setInterval(loadNotifications, 3000);
    
    // Listen for storage events (triggered when new notification is created)
    const handleStorageChange = () => {
      console.log('🔄 Storage event detected - reloading notifications...');
      loadNotifications();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
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
      case 'candidate_withdrawal_request':
        return DollarSign;
      case 'urgent':
        return AlertCircle;
      default:
        return Bell;
    }
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
      if (filterType === 'payments') return notification.type === 'package_purchase_request' || notification.type === 'package_approved' || notification.type === 'candidate_withdrawal_request';
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
          <PageTitleGroup>
            <PageIconBox>
              <Bell />
            </PageIconBox>
            <PageTitleText>
              <h1>{language === 'vi' ? 'Thông Báo Hệ Thống' : 'System Notifications'}</h1>
              <p>{language === 'vi' ? 'Theo dõi và quản lý tất cả thông báo' : 'Track and manage all notifications'}</p>
            </PageTitleText>
          </PageTitleGroup>
          <HeaderActions>
            <StyledButton 
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye size={18} />
              {language === 'vi' ? 'Đánh dấu đã đọc tất cả' : 'Mark all as read'}
            </StyledButton>
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
              <LoadingContainer>
                <div className="spinner"></div>
                <div className="text">
                  {language === 'vi' ? 'Đang tải thông báo...' : 'Loading notifications...'}
                </div>
              </LoadingContainer>
            ) : displayNotifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
                <BellOff size={80} style={{ opacity: 0.4, marginBottom: '20px', color: '#1e40af' }} />
                <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '10px', color: '#1E293B' }}>
                  {language === 'vi' ? 'Không có thông báo' : 'No notifications'}
                </div>
                <div style={{ fontSize: '15px', color: '#64748B' }}>
                  {language === 'vi' ? 'Bạn sẽ nhận được thông báo khi có hoạt động mới' : 'You will receive notifications when there are new activities'}
                </div>
              </div>
            ) : (
              <NotificationList>
                {displayNotifications.map((notification, index) => {
                  const NotifIcon = getNotificationIcon(notification.type);
                  const title = language === 'vi' ? notification.title : notification.titleEn;
                  const message = language === 'vi' ? notification.message : notification.messageEn;
                  const actionText = language === 'vi' ? notification.actionText : notification.actionTextEn;
                  const isActionRequired = notification.type === 'package_purchase_request';
                  
                  // Determine color based on notification type
                  const getNotificationColor = (type) => {
                    switch (type) {
                      case 'package_purchase_request':
                        return '#f59e0b';
                      case 'package_approved':
                        return '#10b981';
                      case 'employers':
                        return '#1e40af';
                      case 'posts':
                        return '#ef4444';
                      case 'payments':
                        return '#8b5cf6';
                      case 'candidate_withdrawal_request':
                        return '#3b82f6';
                      case 'urgent':
                        return '#f59e0b';
                      default:
                        return '#1e40af';
                    }
                  };
                  
                  return (
                    <NotificationItem 
                      key={notification.notificationId} 
                      $unread={!notification.read}
                      $color={getNotificationColor(notification.type)}
                      onClick={() => handleNotificationClick(notification)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <NotificationIcon $color={getNotificationColor(notification.type)}>
                        <NotifIcon />
                      </NotificationIcon>
                      
                      <NotificationContent>
                        <NotificationTitle>
                          {!notification.read && <UnreadDot />}
                          {title}
                        </NotificationTitle>
                        <NotificationMessage>{message}</NotificationMessage>
                        <NotificationMeta>
                          <div className="meta-item">
                            <Clock />
                            <RelativeTime timestamp={notification.createdAt} language={language} />
                          </div>
                          {isActionRequired && (
                            <div className="meta-item" style={{ color: '#f59e0b', fontWeight: 700 }}>
                              • {language === 'vi' ? 'Cần xử lý' : 'Action required'}
                            </div>
                          )}
                        </NotificationMeta>
                        
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
                      </NotificationContent>
                    </NotificationItem>
                  );
                })}
              </NotificationList>
            )}
          </MainContent>

          <Sidebar>
            <SettingsCard>
              <SettingsTitle>
                <Settings size={20} />
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

