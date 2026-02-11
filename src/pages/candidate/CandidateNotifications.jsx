import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import { Bell, Briefcase, CheckCircle, MessageSquare } from 'lucide-react';

const NotificationsContainer = styled.div`
  max-width: 900px;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
  }
`;

const NotificationCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 24px;
  margin-bottom: 16px;
  border: 1px solid ${props => props.$unread ? props.theme.colors.primary : props.theme.colors.border};
  border-left: 4px solid ${props => props.$unread ? props.theme.colors.primary : props.theme.colors.border};
  display: flex;
  gap: 16px;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const NotificationIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.$color || props.theme.colors.infoBg};
  color: ${props => props.$iconColor || props.theme.colors.info};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const NotificationContent = styled.div`
  flex: 1;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 8px;
  }
  
  time {
    font-size: 12px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const CandidateNotifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'application',
      icon: Briefcase,
      color: '#DBEAFE',
      iconColor: '#3B82F6',
      title: 'Application Viewed',
      message: 'TechCorp viewed your application for Senior React Developer',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'message',
      icon: MessageSquare,
      color: '#FEF3C7',
      iconColor: '#F59E0B',
      title: 'New Message',
      message: 'You have a new message from StartupXYZ',
      time: '5 hours ago',
      unread: true
    },
    {
      id: 3,
      type: 'success',
      icon: CheckCircle,
      color: '#D1FAE5',
      iconColor: '#10B981',
      title: 'Application Accepted',
      message: 'Your application for Frontend Developer at Acme Inc. has been accepted',
      time: '1 day ago',
      unread: false
    }
  ];

  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <NotificationsContainer>
        <PageHeader>
          <h1>Notifications</h1>
        </PageHeader>

        {notifications.map(notif => (
          <NotificationCard key={notif.id} $unread={notif.unread}>
            <NotificationIcon $color={notif.color} $iconColor={notif.iconColor}>
              <notif.icon />
            </NotificationIcon>
            <NotificationContent>
              <h3>{notif.title}</h3>
              <p>{notif.message}</p>
              <time>{notif.time}</time>
            </NotificationContent>
          </NotificationCard>
        ))}
      </NotificationsContainer>
    </DashboardLayout>
  );
};

export default CandidateNotifications;
