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
  background: white;
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
  background: white;
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
  background: ${props => props.$unread ? '#f0f9ff' : 'white'};
  border: 1px solid ${props => props.$unread ? '#bfdbfe' : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.25rem;
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-2px);
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
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const NotificationMessage = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;

const NotificationMeta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
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
  background: white;
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
  const [filterType, setFilterType] = useState('all');
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
      title: 'Người dùng mới đăng ký',
      message: '15 ứng viên và 3 nhà tuyển dụng mới đã đăng ký trong 24h qua',
      time: '2 giờ trước',
      unread: true,
      actionRequired: false
    },
    {
      id: 2,
      type: 'employers',
      icon: Briefcase,
      color: '#f59e0b',
      title: 'Yêu cầu phê duyệt nhà tuyển dụng',
      message: 'Công ty ABC Tech đang chờ phê duyệt. Vui lòng kiểm tra thông tin và xác minh.',
      time: '3 giờ trước',
      unread: true,
      actionRequired: true
    },
    {
      id: 3,
      type: 'posts',
      icon: AlertCircle,
      color: '#ef4444',
      title: 'Bài đăng bị cảnh báo',
      message: '5 bài đăng mới bị hệ thống tự động cảnh báo về nội dung vi phạm. Cần kiểm duyệt thủ công.',
      time: '5 giờ trước',
      unread: true,
      actionRequired: true
    },
    {
      id: 4,
      type: 'payments',
      icon: DollarSign,
      color: '#10b981',
      title: 'Thanh toán mới',
      message: 'Công ty XYZ đã thanh toán gói Premium trị giá 5.000.000đ',
      time: '1 ngày trước',
      unread: false,
      actionRequired: false
    },
    {
      id: 5,
      type: 'system',
      icon: Info,
      color: '#8b5cf6',
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống sẽ bảo trì vào 23:00 ngày 16/02/2024. Thời gian dự kiến: 2 giờ.',
      time: '2 ngày trước',
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

  return (
    <DashboardLayout role="admin">
      <PageContainer>
        <PageHeader>
          <HeaderLeft>
            <Title>Thông Báo Hệ Thống</Title>
            <Subtitle>Theo dõi và quản lý tất cả thông báo</Subtitle>
          </HeaderLeft>
          <HeaderActions>
            <Button $variant="outline">
              <Eye size={18} />
              Đánh dấu đã đọc tất cả
            </Button>
            <Button $variant="primary">
              <Send size={18} />
              Gửi thông báo mới
            </Button>
          </HeaderActions>
        </PageHeader>

        <StatsGrid>
          <StatCard $color="#3b82f6">
            <StatLabel>Chưa đọc</StatLabel>
            <StatValue>{unreadCount}</StatValue>
          </StatCard>
          <StatCard $color="#f59e0b">
            <StatLabel>Cần xử lý</StatLabel>
            <StatValue>{actionRequiredCount}</StatValue>
          </StatCard>
          <StatCard $color="#10b981">
            <StatLabel>Hôm nay</StatLabel>
            <StatValue>18</StatValue>
          </StatCard>
          <StatCard $color="#8b5cf6">
            <StatLabel>Tuần này</StatLabel>
            <StatValue>127</StatValue>
          </StatCard>
        </StatsGrid>

        <Grid>
          <MainContent>
            <FilterBar>
              <SearchBox>
                <SearchIcon size={18} />
                <SearchInput placeholder="Tìm kiếm thông báo..." />
              </SearchBox>
              <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="users">Người dùng</option>
                <option value="employers">Nhà tuyển dụng</option>
                <option value="posts">Bài đăng</option>
                <option value="payments">Thanh toán</option>
                <option value="system">Hệ thống</option>
              </Select>
              <Select>
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="unread">Chưa đọc</option>
              </Select>
            </FilterBar>

            <NotificationList>
              {notifications.map(notification => (
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
                            • Cần xử lý
                          </span>
                        )}
                      </NotificationMeta>
                    </NotificationContent>
                  </NotificationHeader>
                  {notification.actionRequired && (
                    <NotificationActions>
                      <ActionButton $variant="primary">
                        <CheckCircle size={16} />
                        Xử lý ngay
                      </ActionButton>
                      <ActionButton>
                        <Eye size={16} />
                        Xem chi tiết
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
                Cài Đặt Thông Báo
              </SettingsTitle>
              
              <SettingItem>
                <SettingLabel>Người dùng mới</SettingLabel>
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
                <SettingLabel>Nhà tuyển dụng</SettingLabel>
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
                <SettingLabel>Bài đăng</SettingLabel>
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
                <SettingLabel>Thanh toán</SettingLabel>
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
                <SettingLabel>Cập nhật hệ thống</SettingLabel>
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
              <SettingsTitle>Thao Tác Nhanh</SettingsTitle>
              <Button $variant="primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
                <Send size={18} />
                Gửi thông báo
              </Button>
              <Button $variant="outline" style={{ width: '100%' }}>
                <Trash2 size={18} />
                Xóa đã đọc
              </Button>
            </SettingsCard>
          </Sidebar>
        </Grid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default AdminNotifications;
