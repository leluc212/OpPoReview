import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { 
  Briefcase, 
  Users, 
  Eye, 
  TrendingUp, 
  Plus, 
  FileText, 
  Calendar, 
  MessageSquare,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Award,
  Zap,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const DashboardContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

const WelcomeBanner = styled(motion.div)`
  background: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 40px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px ${props => props.theme.colors.primary}30;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    right: 20%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
  color: white;
  flex: 1;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 16px;
    opacity: 0.95;
    margin-bottom: 24px;
    font-weight: 500;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled(motion.button)`
  padding: 14px 28px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.$variant === 'primary' ? 'white' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.$variant === 'primary' ? props.theme.colors.primary : 'white'};
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 2px solid ${props => props.$variant === 'primary' ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const IllustrationContainer = styled.div`
  position: relative;
  z-index: 1;
  
  svg {
    width: 200px;
    height: 200px;
    animation: ${float} 3s ease-in-out infinite;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
`;

const Section = styled(motion.section)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 28px;
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary}30;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  
  h2 {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg {
      width: 24px;
      height: 24px;
      color: ${props => props.theme.colors.primary};
    }
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.3s ease;
    
    &:hover {
      gap: 8px;
    }
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const ApplicationCard = styled(motion.div)`
  padding: 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateX(8px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const ApplicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CandidateInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 6px;
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
  }
`;

const ApplicationMeta = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 13px;
  color: ${props => props.theme.colors.textLight};
  
  span {
    display: flex;
    align-items: center;
    gap: 6px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const ActivityFeed = styled.div``;

const ActivityItem = styled(motion.div)`
  display: flex;
  gap: 16px;
  padding: 16px;
  border-left: 3px solid ${props => props.$color || props.theme.colors.border};
  margin-bottom: 12px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: 0 ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.bgLight};
    transform: translateX(8px);
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$color || props.theme.colors.primary}15;
  color: ${props => props.$color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ActivityContent = styled.div`
  flex: 1;
  
  h5 {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
  }
  
  p {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 32px;
`;

const PerformanceCard = styled(motion.div)`
  padding: 24px;
  background: ${props => props.theme.colors.bgLight};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.$color || props.theme.colors.primary};
    transform: translateY(-4px);
    box-shadow: 0 12px 40px ${props => props.$color || props.theme.colors.primary}20;
  }
`;

const PerformanceIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: ${props => props.$color || props.theme.colors.primary}15;
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 32px;
    height: 32px;
    color: ${props => props.$color || props.theme.colors.primary};
  }
`;

const PerformanceValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const PerformanceLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 600;
`;
const EmployerDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const recentApplications = [
    { 
      id: 1,
      candidate: 'Nguyễn Văn Hiếu', 
      job: 'Senior React Developer', 
      applied: '2 giờ trước', 
      status: 'pending',
      avatar: 'H'
    },
    { 
      id: 2,
      candidate: 'Trần Minh Duy', 
      job: 'Thu ngân', 
      applied: '5 giờ trước', 
      status: 'reviewed',
      avatar: 'D'
    },
    { 
      id: 3,
      candidate: 'Lê Thị Nheo', 
      job: 'Nhân viên pha chế', 
      applied: '1 ngày trước', 
      status: 'approved',
      avatar: 'N'
    },
  ];

  const activities = [
    {
      type: 'application',
      icon: Users,
      color: '#0E3995',
      title: '3 ứng viên mới ứng tuyển',
      time: '30 phút trước'
    },
    {
      type: 'job',
      icon: Briefcase,
      color: '#10B981',
      title: 'Tin "Senior React Developer" đã được duyệt',
      time: '2 giờ trước'
    },
    {
      type: 'message',
      icon: MessageSquare,
      color: '#F59E0B',
      title: 'Bạn có 5 tin nhắn mới',
      time: '4 giờ trước'
    },
    {
      type: 'hired',
      icon: CheckCircle,
      color: '#10B981',
      title: 'Đã tuyển thành công "Thu ngân"',
      time: '1 ngày trước'
    },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <DashboardLayout role="employer">
      <DashboardContainer>
        {/* Welcome Banner */}
        <WelcomeBanner
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WelcomeContent>
            <h1>{getGreeting()}, Nhà Tuyển Dụng! 👋</h1>
            <p>Hôm nay bạn có 3 ứng viên mới và 5 tin nhắn cần xem</p>
            <QuickActions>
              <ActionButton
                as={Link}
                to="/employer/jobs"
                $variant="primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus />
                Đăng Tin Mới
              </ActionButton>
              <ActionButton
                as={Link}
                to="/employer/applications"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileText />
                Xem Hồ Sơ
              </ActionButton>
            </QuickActions>
          </WelcomeContent>
          <IllustrationContainer>
            <BarChart3 size={200} color="rgba(255,255,255,0.3)" />
          </IllustrationContainer>
        </WelcomeBanner>

        {/* Stats Overview */}
        <StatsGrid>
          <StatsCard
            title="Tin Đang Tuyển"
            value="12"
            change="+3"
            changeText="so với tháng trước"
            icon={Briefcase}
            color="#0E3995"
            positive
          />
          <StatsCard
            title="Tổng Hồ Sơ"
            value="248"
            change="+45%"
            changeText="so với tháng trước"
            icon={Users}
            color="#F59E0B"
            positive
          />
          <StatsCard
            title="Lượt Xem"
            value="1,234"
            change="+12%"
            changeText="so với tuần trước"
            icon={Eye}
            color="#10B981"
            positive
          />
          <StatsCard
            title="Đã Tuyển"
            value="8"
            change="+2"
            changeText="tháng này"
            icon={TrendingUp}
            color="#8B5CF6"
            positive
          />
        </StatsGrid>

        {/* Main Content Grid */}
        <ContentGrid>
          {/* Recent Applications */}
          <Section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SectionHeader>
              <h2>
                <Users />
                Hồ Sơ Ứng Tuyển Mới Nhất
              </h2>
              <Link to="/employer/applications">
                Xem tất cả
                <ArrowUpRight />
              </Link>
            </SectionHeader>
            
            {recentApplications.map((app, index) => (
              <ApplicationCard
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <ApplicationHeader>
                  <CandidateInfo>
                    <h4>{app.candidate}</h4>
                    <p>{app.job}</p>
                  </CandidateInfo>
                  <StatusBadge status={app.status} />
                </ApplicationHeader>
                <ApplicationMeta>
                  <span>
                    <Clock />
                    {app.applied}
                  </span>
                  <span>
                    <Download />
                    Tải CV
                  </span>
                </ApplicationMeta>
              </ApplicationCard>
            ))}
          </Section>

          {/* Activity Feed */}
          <Section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SectionHeader>
              <h2>
                <Calendar />
                Hoạt Động Gần Đây
              </h2>
            </SectionHeader>
            
            <ActivityFeed>
              {activities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <ActivityItem
                    key={index}
                    $color={activity.color}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <ActivityIcon $color={activity.color}>
                      <IconComponent />
                    </ActivityIcon>
                    <ActivityContent>
                      <h5>{activity.title}</h5>
                      <p>{activity.time}</p>
                    </ActivityContent>
                  </ActivityItem>
                );
              })}
            </ActivityFeed>
          </Section>
        </ContentGrid>

        {/* Performance Metrics */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SectionHeader>
            <h2>
              <BarChart3 />
              Hiệu Suất Tuyển Dụng
            </h2>
          </SectionHeader>
          
          <PerformanceGrid>
            <PerformanceCard
              $color="#0E3995"
              whileHover={{ scale: 1.05 }}
            >
              <PerformanceIcon $color="#0E3995">
                <Target />
              </PerformanceIcon>
              <PerformanceValue>85%</PerformanceValue>
              <PerformanceLabel>Tỷ Lệ Phản Hồi</PerformanceLabel>
            </PerformanceCard>

            <PerformanceCard
              $color="#10B981"
              whileHover={{ scale: 1.05 }}
            >
              <PerformanceIcon $color="#10B981">
                <Award />
              </PerformanceIcon>
              <PerformanceValue>4.8/5</PerformanceValue>
              <PerformanceLabel>Đánh Giá Công Ty</PerformanceLabel>
            </PerformanceCard>

            <PerformanceCard
              $color="#F59E0B"
              whileHover={{ scale: 1.05 }}
            >
              <PerformanceIcon $color="#F59E0B">
                <Zap />
              </PerformanceIcon>
              <PerformanceValue>12 ngày</PerformanceValue>
              <PerformanceLabel>Thời Gian Tuyển TB</PerformanceLabel>
            </PerformanceCard>

            <PerformanceCard
              $color="#8B5CF6"
              whileHover={{ scale: 1.05 }}
            >
              <PerformanceIcon $color="#8B5CF6">
                <TrendingUp />
              </PerformanceIcon>
              <PerformanceValue>+32%</PerformanceValue>
              <PerformanceLabel>Tăng Trưởng Tháng Này</PerformanceLabel>
            </PerformanceCard>
          </PerformanceGrid>
        </Section>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
