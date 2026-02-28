import { useState } from 'react';
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
  Send
} from 'lucide-react';
import { Button } from '../../components/FormElements';
import { useLanguage } from '../../context/LanguageContext';

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
  background: #3b82f6;
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
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [notificationSettings, setNotificationSettings] = useState({
    users: true,
    employers: true,
    posts: true,
    payments: true,
    system: false
  });

  const notifications = [
    {
      id: 1,
      type: 'users',
      icon: Users,
      color: '#6366f1',
      title: language === 'vi' ? 'Người dùng mới đăng ký' : 'New user registrations',
      message: language === 'vi' ? '15 ứng viên và 3 nhà tuyển dụng mới đã đăng ký trong 24h qua' : '15 candidates and 3 employers registered in the last 24 hours',
      time: language === 'vi' ? '2 giờ trước' : '2 hours ago',
      unread: true,
      actionRequired: false
    },
    {
      id: 2,
      type: 'employers',
      icon: Briefcase,
      color: '#f59e0b',
      title: language === 'vi' ? 'Yêu cầu phê duyệt nhà tuyển dụng' : 'Employer approval request',
      message: language === 'vi' ? 'Công ty ABC Tech đang chờ phê duyệt. Vui lòng kiểm tra thông tin và xác minh.' : 'ABC Tech is pending approval. Please review and verify the information.',
      time: language === 'vi' ? '3 giờ trước' : '3 hours ago',
      unread: true,
      actionRequired: true
    },
    {
      id: 3,
      type: 'posts',
      icon: AlertCircle,
      color: '#ef4444',
      title: language === 'vi' ? 'Bài đăng bị cảnh báo' : 'Flagged posts',
      message: language === 'vi' ? '5 bài đăng mới bị hệ thống tự động cảnh báo về nội dung vi phạm. Cần kiểm duyệt thủ công.' : '5 new posts were automatically flagged for policy violations and require manual review.',
      time: language === 'vi' ? '5 giờ trước' : '5 hours ago',
      unread: true,
      actionRequired: true
    },
    {
      id: 4,
      type: 'payments',
      icon: DollarSign,
      color: '#10b981',
      title: language === 'vi' ? 'Thanh toán mới' : 'New payment',
      message: language === 'vi' ? 'Công ty XYZ đã thanh toán gói Premium trị giá 5.000.000 VND' : 'XYZ company paid for the Premium package worth 5,000,000 VND',
      time: language === 'vi' ? '1 ngày trước' : '1 day ago',
      unread: false,
      actionRequired: false
    },
    {
      id: 5,
      type: 'system',
      icon: Info,
      color: '#8b5cf6',
      title: language === 'vi' ? 'Cập nhật hệ thống' : 'System update',
      message: language === 'vi' ? 'Hệ thống sẽ bảo trì vào 23:00 ngày 16/02/2024. Thời gian dự kiến: 2 giờ.' : 'System maintenance is scheduled at 23:00 on 16/02/2024. Estimated duration: 2 hours.',
      time: language === 'vi' ? '2 ngày trước' : '2 days ago',
      unread: false,
      actionRequired: false
    }
  ];

  const handleToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const unreadCount = notifications.filter(n => n.unread).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length;

  // Helper function to parse time string to hours
  const parseTimeToHours = (timeStr) => {
    const match = timeStr.match(/(\d+)/);
    if (!match) return 999999;
    
    const num = parseInt(match[1]);
    
    if (timeStr.includes('giờ') || timeStr.includes('hour')) {
      return num;
    } else if (timeStr.includes('ngày') || timeStr.includes('day')) {
      return num * 24;
    } else if (timeStr.includes('tuần') || timeStr.includes('week')) {
      return num * 24 * 7;
    }
    
    return 999999;
  };

  // Filter and sort notifications
  const displayNotifications = notifications
    .filter(notification => filterType === 'all' || notification.type === filterType)
    .sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return parseTimeToHours(a.time) - parseTimeToHours(b.time);
        case 'oldest':
          return parseTimeToHours(b.time) - parseTimeToHours(a.time);
        case 'unread':
          // Unread first, then by newest
          if (a.unread === b.unread) {
            return parseTimeToHours(a.time) - parseTimeToHours(b.time);
          }
          return a.unread ? -1 : 1;
        default:
          return 0;
      }
    });

  return (
    <DashboardLayout role="admin">
      <PageContainer>
        <PageHeader>
          <HeaderLeft>
            <Title>{language === 'vi' ? 'Thông Báo Hệ Thống' : 'System Notifications'}</Title>
            <Subtitle>{language === 'vi' ? 'Theo dõi và quản lý tất cả thông báo' : 'Track and manage all notifications'}</Subtitle>
          </HeaderLeft>
          <HeaderActions>
            <Button $variant="outline">
              <Eye size={18} />
              {language === 'vi' ? 'Đánh dấu đã đọc tất cả' : 'Mark all as read'}
            </Button>
            <Button $variant="primary">
              <Send size={18} />
              {language === 'vi' ? 'Gửi thông báo mới' : 'Send new notification'}
            </Button>
          </HeaderActions>
        </PageHeader>

        <StatsGrid>
          <StatCard $color="#3b82f6">
            <StatLabel>{language === 'vi' ? 'Chưa đọc' : 'Unread'}</StatLabel>
            <StatValue>{unreadCount}</StatValue>
          </StatCard>
          <StatCard $color="#f59e0b">
            <StatLabel>{language === 'vi' ? 'Cần xử lý' : 'Action required'}</StatLabel>
            <StatValue>{actionRequiredCount}</StatValue>
          </StatCard>
          <StatCard $color="#10b981">
            <StatLabel>{language === 'vi' ? 'Hôm nay' : 'Today'}</StatLabel>
            <StatValue>18</StatValue>
          </StatCard>
          <StatCard $color="#8b5cf6">
            <StatLabel>{language === 'vi' ? 'Tuần này' : 'This week'}</StatLabel>
            <StatValue>127</StatValue>
          </StatCard>
        </StatsGrid>

        <Grid>
          <MainContent>
            <FilterBar>
              <SearchBox>
                <SearchIcon size={18} />
                <SearchInput placeholder={language === 'vi' ? 'Tìm kiếm thông báo...' : 'Search notifications...'} />
              </SearchBox>
              <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">{language === 'vi' ? 'Tất cả' : 'All'}</option>
                <option value="users">{language === 'vi' ? 'Người dùng' : 'Users'}</option>
                <option value="employers">{language === 'vi' ? 'Nhà tuyển dụng' : 'Employers'}</option>
                <option value="posts">{language === 'vi' ? 'Bài đăng' : 'Posts'}</option>
                <option value="payments">{language === 'vi' ? 'Thanh toán' : 'Payments'}</option>
                <option value="system">{language === 'vi' ? 'Hệ thống' : 'System'}</option>
              </Select>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">{language === 'vi' ? 'Mới nhất' : 'Newest'}</option>
                <option value="oldest">{language === 'vi' ? 'Cũ nhất' : 'Oldest'}</option>
                <option value="unread">{language === 'vi' ? 'Chưa đọc' : 'Unread'}</option>
              </Select>
            </FilterBar>

            <NotificationList>
              {displayNotifications.map(notification => (
                <NotificationItem key={notification.id} $unread={notification.unread}>
                  <NotificationHeader>
                    <NotificationIcon $color={notification.color}>
                      <notification.icon size={24} />
                    </NotificationIcon>
                    <NotificationContent>
                      <NotificationTitle>
                        {notification.unread && <UnreadBadge />}
                        {notification.title}
                      </NotificationTitle>
                      <NotificationMessage>{notification.message}</NotificationMessage>
                      <NotificationMeta>
                        <span>{notification.time}</span>
                        {notification.actionRequired && (
                          <span style={{ color: '#f59e0b', fontWeight: 500 }}>
                            • {language === 'vi' ? 'Cần xử lý' : 'Action required'}
                          </span>
                        )}
                      </NotificationMeta>
                    </NotificationContent>
                  </NotificationHeader>
                  {notification.actionRequired && (
                    <NotificationActions>
                      <ActionButton $variant="primary">
                        <CheckCircle size={16} />
                        {language === 'vi' ? 'Xử lý ngay' : 'Handle now'}
                      </ActionButton>
                      <ActionButton>
                        <Eye size={16} />
                        {language === 'vi' ? 'Xem chi tiết' : 'View details'}
                      </ActionButton>
                    </NotificationActions>
                  )}
                </NotificationItem>
              ))}
            </NotificationList>
          </MainContent>

          <Sidebar>
            <SettingsCard>
              <SettingsTitle>
                <Settings size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                {language === 'vi' ? 'Cài Đặt Thông Báo' : 'Notification Settings'}
              </SettingsTitle>
              
              <SettingItem>
                <SettingLabel>{language === 'vi' ? 'Người dùng mới' : 'New users'}</SettingLabel>
                <ToggleSwitch>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.users}
                    onChange={() => handleToggle('users')}
                  />
                  <span></span>
                </ToggleSwitch>
              </SettingItem>

              <SettingItem>
                <SettingLabel>{language === 'vi' ? 'Nhà tuyển dụng' : 'Employers'}</SettingLabel>
                <ToggleSwitch>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.employers}
                    onChange={() => handleToggle('employers')}
                  />
                  <span></span>
                </ToggleSwitch>
              </SettingItem>

              <SettingItem>
                <SettingLabel>{language === 'vi' ? 'Bài đăng' : 'Posts'}</SettingLabel>
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
                <SettingLabel>{language === 'vi' ? 'Thanh toán' : 'Payments'}</SettingLabel>
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
                <SettingLabel>{language === 'vi' ? 'Cập nhật hệ thống' : 'System updates'}</SettingLabel>
                <ToggleSwitch>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.system}
                    onChange={() => handleToggle('system')}
                  />
                  <span></span>
                </ToggleSwitch>
              </SettingItem>
            </SettingsCard>

            <SettingsCard>
              <SettingsTitle>{language === 'vi' ? 'Thao Tác Nhanh' : 'Quick Actions'}</SettingsTitle>
              <Button $variant="primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
                <Send size={18} />
                {language === 'vi' ? 'Gửi thông báo' : 'Send notification'}
              </Button>
              <Button $variant="outline" style={{ width: '100%' }}>
                <Trash2 size={18} />
                {language === 'vi' ? 'Xóa đã đọc' : 'Delete read'}
              </Button>
            </SettingsCard>
          </Sidebar>
        </Grid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default AdminNotifications;
