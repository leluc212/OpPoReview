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
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [notificationSettings, setNotificationSettings] = useState({
    posts: true,
    payments: true,
    urgent: true,
    employers: true
  });

  const notifications = [
    {
      id: 1,
      type: 'posts',
      icon: AlertCircle,
      color: '#f59e0b',
      title: language === 'vi' ? 'Tin tuyển dụng chưa được phê duyệt' : 'Job posts pending approval',
      message: language === 'vi' ? '8 tin tuyển dụng mới từ các nhà tuyển dụng đang chờ phê duyệt. Vui lòng kiểm tra và xác nhận.' : '8 new job posts from employers are pending approval. Please review and confirm.',
      time: language === 'vi' ? '30 phút trước' : '30 minutes ago',
      unread: true,
      actionRequired: true
    },
    {
      id: 2,
      type: 'payments',
      icon: DollarSign,
      color: '#10b981',
      title: language === 'vi' ? 'Mua bài' : 'Package purchase',
      message: language === 'vi' ? 'Chill Out Beer Club đã mua gói Quick Boost trị giá 245.000 VND cho 3 tin tuyển dụng.' : 'Chill Out Beer Club purchased Quick Boost package worth 245,000 VND for 3 job posts.',
      time: language === 'vi' ? '1 giờ trước' : '1 hour ago',
      unread: true,
      actionRequired: false
    },
    {
      id: 3,
      type: 'urgent',
      icon: AlertCircle,
      color: '#ef4444',
      title: language === 'vi' ? 'Duyệt đăng bài Job Gấp' : 'Urgent job approval',
      message: language === 'vi' ? 'Bia Sệt 123 yêu cầu duyệt gấp 2 tin tuyển nhân viên phục vụ ca tối. Cần xử lý trong 2 giờ.' : 'Bia Sệt 123 requests urgent approval for 2 evening shift server positions. Requires processing within 2 hours.',
      time: language === 'vi' ? '45 phút trước' : '45 minutes ago',
      unread: true,
      actionRequired: true
    },
    {
      id: 4,
      type: 'employers',
      icon: Briefcase,
      color: '#8b5cf6',
      title: language === 'vi' ? 'Duyệt nhà tuyển dụng' : 'Employer approval',
      message: language === 'vi' ? 'Urban Coffee và 2 nhà tuyển dụng khác đang chờ phê duyệt tài khoản. Vui lòng xác minh thông tin và điều khoản.' : 'Urban Coffee and 2 other employers are pending account approval. Please verify information and terms.',
      time: language === 'vi' ? '2 giờ trước' : '2 hours ago',
      unread: true,
      actionRequired: true
    },
    {
      id: 5,
      type: 'payments',
      icon: DollarSign,
      color: '#10b981',
      title: language === 'vi' ? 'Mua bài' : 'Package purchase',
      message: language === 'vi' ? 'Lẩu Bò Sài Gòn Vi Vu đã mua gói Hot Search trị giá 395.000 VND để tăng độ hiển thị.' : 'Lẩu Bò Sài Gòn Vi Vu purchased Hot Search package worth 395,000 VND to increase visibility.',
      time: language === 'vi' ? '3 giờ trước' : '3 hours ago',
      unread: false,
      actionRequired: false
    },
    {
      id: 6,
      type: 'posts',
      icon: CheckCircle,
      color: '#10b981',
      title: language === 'vi' ? 'Tin tuyển dụng chưa được phê duyệt' : 'Job posts pending approval',
      message: language === 'vi' ? '5 tin tuyển dụng từ Nướng Ngói Gia Bảo đang chờ phê duyệt. Đã kiểm tra sơ bộ, không có vấn đề.' : '5 job posts from Nướng Ngói Gia Bảo are pending approval. Preliminary check shows no issues.',
      time: language === 'vi' ? '4 giờ trước' : '4 hours ago',
      unread: false,
      actionRequired: true
    },
    {
      id: 7,
      type: 'urgent',
      icon: AlertCircle,
      color: '#ef4444',
      title: language === 'vi' ? 'Duyệt đăng bài Job Gấp' : 'Urgent job approval',
      message: language === 'vi' ? 'Beer Garden Phố cần tuyển gấp 4 nhân viên phục vụ cho ca tối hôm nay. Yêu cầu duyệt ngay.' : 'Beer Garden Phố urgently needs 4 servers for tonight shift. Immediate approval requested.',
      time: language === 'vi' ? '5 giờ trước' : '5 hours ago',
      unread: false,
      actionRequired: true
    },
    {
      id: 8,
      type: 'employers',
      icon: Briefcase,
      color: '#8b5cf6',
      title: language === 'vi' ? 'Duyệt nhà tuyển dụng' : 'Employer approval',
      message: language === 'vi' ? 'Draft Beer Sài Gòn đã hoàn tất xác thực 4 bước eKYC và chấp nhận điều khoản. Sẵn sàng phê duyệt.' : 'Draft Beer Sài Gòn completed 4-step eKYC verification and accepted terms. Ready for approval.',
      time: language === 'vi' ? '1 ngày trước' : '1 day ago',
      unread: false,
      actionRequired: true
    },
    {
      id: 9,
      type: 'payments',
      icon: DollarSign,
      color: '#10b981',
      title: language === 'vi' ? 'Mua bài' : 'Package purchase',
      message: language === 'vi' ? 'Phở Gia Truyền 1954 đã mua gói Spotlight Banner trị giá 745.000 VND cho chiến dịch tuyển dụng.' : 'Phở Gia Truyền 1954 purchased Spotlight Banner package worth 745,000 VND for recruitment campaign.',
      time: language === 'vi' ? '1 ngày trước' : '1 day ago',
      unread: false,
      actionRequired: false
    },
    {
      id: 10,
      type: 'posts',
      icon: AlertCircle,
      color: '#f59e0b',
      title: language === 'vi' ? 'Tin tuyển dụng chưa được phê duyệt' : 'Job posts pending approval',
      message: language === 'vi' ? '12 tin tuyển dụng mới từ 6 nhà tuyển dụng khác nhau đang chờ phê duyệt.' : '12 new job posts from 6 different employers are pending approval.',
      time: language === 'vi' ? '2 ngày trước' : '2 days ago',
      unread: false,
      actionRequired: true
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
    <DashboardLayout role="admin" key={language}>
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
                <SearchInput placeholder={language === 'vi' ? 'Tìm kiếm thông báo...' : 'Search notifications...'} />
              </SearchBox>
              <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">{language === 'vi' ? 'Tất cả' : 'All'}</option>
                <option value="posts">{language === 'vi' ? 'Tin chưa duyệt' : 'Pending posts'}</option>
                <option value="payments">{language === 'vi' ? 'Mua bài' : 'Purchases'}</option>
                <option value="urgent">{language === 'vi' ? 'Job gấp' : 'Urgent jobs'}</option>
                <option value="employers">{language === 'vi' ? 'Duyệt NTD' : 'Employer approval'}</option>
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
                <SettingLabel>{language === 'vi' ? 'Job gấp' : 'Urgent jobs'}</SettingLabel>
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

