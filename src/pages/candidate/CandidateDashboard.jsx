import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import JobCard from '../../components/JobCard';
import StatusBadge from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  FileText, 
  Star, 
  TrendingUp, 
  Search, 
  CheckCircle, 
  Clock, 
  Calendar,
  Target,
  Award,
  Bell,
  ArrowUpRight,
  Eye,
  MapPin,
  DollarSign,
  Users,
  Upload,
  Edit3,
  Sparkles
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

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

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;


const DashboardContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

const WelcomeBanner = styled(motion.div)`
  background: linear-gradient(135deg, #0E3995 0%, #0055A5 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 40px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(14, 57, 149, 0.3);
  
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
    width: 180px;
    height: 180px;
    animation: ${float} 3s ease-in-out infinite;
  }
`;

const ProfileCompletionBanner = styled(motion.div)`
  background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 24px 32px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  p {
    font-size: 14px;
    opacity: 0.95;
  }
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
  margin-top: 8px;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.$progress || 0}%;
    height: 100%;
    background: white;
    border-radius: ${props => props.theme.borderRadius.full};
    transition: width 0.5s ease;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  
  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 1fr;
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

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
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

const ApplicationInfo = styled.div`
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

const RecommendedJobCard = styled(motion.div)`
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
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const JobHeader = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const CompanyLogo = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 20px;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
`;

const JobInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
  }
`;

const JobDetails = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  
  span {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
    
    svg {
      width: 16px;
      height: 16px;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const JobTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  
  span {
    padding: 6px 14px;
    background: ${props => props.theme.colors.primary}12;
    color: ${props => props.theme.colors.primary};
    border-radius: ${props => props.theme.borderRadius.full};
    font-size: 12px;
    font-weight: 700;
    border: 1px solid ${props => props.theme.colors.primary}25;
  }
`;

const CandidateDashboard = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime] = useState(new Date());
  const [profileCompletion] = useState(75);

  // Translation helper functions
  const translateSalary = (salaryStr) => {
    if (language === 'vi') return salaryStr;
    return salaryStr
      .replace(/triệu/g, 'million')
      .replace(/\/ca/g, '/shift')
      .replace(/\/giờ/g, '/hour');
  };

  const translateLocation = (locationStr) => {
    if (language === 'vi') return locationStr;
    return locationStr
      .replace(/Quận/g, 'District')
      .replace(/TP\.HCM/g, 'HCMC')
      .replace(/Hà Nội/g, 'Hanoi')
      .replace(/Đà Nẵng/g, 'Da Nang')
      .replace(/Tân Bình/g, 'Tan Binh')
      .replace(/Phú Nhuận/g, 'Phu Nhuan');
  };

  const recommendedJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'FPT Software',
      location: 'Quận 1, TP.HCM',
      type: 'Full-time',
      salary: '20-30 triệu',
      postedAt: '2 ngày trước',
      tags: ['React', 'TypeScript', 'Remote']
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'VNG Corporation',  
      location: 'Quận 7, TP.HCM',
      type: 'Full-time',
      salary: '15-25 triệu',
      postedAt: '3 ngày trước',
      tags: ['Vue.js', 'JavaScript']
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      company: 'Tiki',
      location: 'Tân Bình, TP.HCM',
      type: 'Full-time',
      salary: '12-18 triệu',
      postedAt: '1 tuần trước',
      tags: ['Figma', 'Adobe XD']
    }
  ];

  const recentApplications = [
    { 
      id: 1, 
      title: 'Product Designer', 
      company: 'Shopee', 
      appliedDate: '2 ngày trước', 
      status: 'reviewed' 
    },
    { 
      id: 2, 
      title: 'Backend Developer', 
      company: 'Grab', 
      appliedDate: '5 ngày trước', 
      status: 'pending' 
    },
    { 
      id: 3, 
      title: 'Full Stack Engineer', 
      company: 'Sendo', 
      appliedDate: '1 tuần trước', 
      status: 'approved' 
    },
  ];

  const activities = [
    {
      type: 'view',
      icon: Eye,
      color: '#0E3995',
      title: '12 nhà tuyển dụng đã xem CV của bạn',
      time: 'Hôm nay'
    },
    {
      type: 'interview',
      icon: Calendar,
      color: '#10B981',
      title: 'Lịch phỏng vấn với FPT Software',
      time: 'Ngày mai, 10:00 AM'
    },
    {
      type: 'message',
      icon: Bell,
      color: '#F59E0B',
      title: 'Bạn có 3 phản hồi CV mới từ nhà tuyển dụng',
      time: '2 giờ trước'
    },
    {
      type: 'match',
      icon: Target,
      color: '#8B5CF6',
      title: '5 công việc mới phù hợp với bạn',
      time: '4 giờ trước'
    },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();    if (language === 'en') {
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    }    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <DashboardLayout role="candidate">
      <DashboardContainer>
        {/* Welcome Banner */}
        <WelcomeBanner
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WelcomeContent>
            <h1>{getGreeting()}, Ứng Viên! 👋</h1>
            <p>Bạn có 12 nhà tuyển dụng đã xem hồ sơ và 5 công việc mới phù hợp</p>
            <QuickActions>
              <ActionButton
                as={Link}
                to="/candidate/jobs"
                $variant="primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Search />
                {language === 'vi' ? 'Tìm Việc Làm' : 'Find Jobs'}
              </ActionButton>
              <ActionButton
                as={Link}
                to="/candidate/profile"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit3 />
                {language === 'vi' ? 'Cập Nhật CV' : 'Update CV'}
              </ActionButton>
            </QuickActions>
          </WelcomeContent>
          <IllustrationContainer>
            <Briefcase size={180} color="rgba(255,255,255,0.3)" />
          </IllustrationContainer>
        </WelcomeBanner>

        {/* Profile Completion Banner */}
        {profileCompletion < 100 && (
          <ProfileCompletionBanner
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <h3>
                <Sparkles />
                {language === 'vi' ? 'Hoàn thiện hồ sơ để tăng cơ hội được tuyển dụng' : 'Complete your profile to increase hiring chances'}
              </h3>
              <p>{language === 'vi' ? `Hồ sơ của bạn đã hoàn thành ${profileCompletion}%` : `Your profile is ${profileCompletion}% complete`}</p>
              <ProgressBar $progress={profileCompletion} />
            </div>
            <ActionButton
              as={Link}
              to="/candidate/profile"
              $variant="primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload />
              {language === 'vi' ? 'Hoàn Thiện Ngay' : 'Complete Now'}
            </ActionButton>
          </ProfileCompletionBanner>
        )}

        {/* Stats Overview */}
        <StatsGrid>
          <StatsCard
            title={language === 'vi' ? 'Hồ Sơ Đã Nộp' : 'Applications'}
            value="24"
            change="+12%"
            changeText={language === 'vi' ? 'từ tháng trước' : 'from last month'}
            icon={FileText}
            color="#0E3995"
            positive
          />
          <StatsCard
            title={language === 'vi' ? 'Việc Đã Lưu' : 'Saved Jobs'}
            value="18"
            change="+3"
            changeText={language === 'vi' ? 'tuần này' : 'this week'}
            icon={Star}
            color="#F59E0B"
            positive
          />
          <StatsCard
            title={language === 'vi' ? 'Lượt Xem Hồ Sơ' : 'Profile Views'}
            value="156"
            change="+28%"
            changeText={language === 'vi' ? 'từ tuần trước' : 'from last week'}
            icon={Eye}
            color="#10B981"
            positive
          />
          <StatsCard
            title={language === 'vi' ? 'Phỏng Vấn' : 'Interviews'}
            value="5"
            change="+2"
            changeText={language === 'vi' ? 'tuần này' : 'this week'}
            icon={Calendar}
            color="#8B5CF6"
            positive
          />
        </StatsGrid>

        {/* Main Content Grid */}
        <ContentGrid>
          {/* Recommended Jobs */}
          <Section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SectionHeader>
              <h2>
                <Target />
                {language === 'vi' ? 'Việc Làm Phù Hợp Với Bạn' : 'Recommended Jobs'}
              </h2>
              <Link to="/candidate/jobs">
                {language === 'vi' ? 'Xem tất cả' : 'View all'}
                <ArrowUpRight />
              </Link>
            </SectionHeader>
            
            <JobsGrid>
              {recommendedJobs.map((job, index) => (
                <RecommendedJobCard
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <JobHeader>
                    <CompanyLogo>
                      {job.company.charAt(0)}
                    </CompanyLogo>
                    <JobInfo>
                      <h4>{job.title}</h4>
                      <p>{job.company}</p>
                    </JobInfo>
                  </JobHeader>
                  <JobDetails>
                    <span>
                      <MapPin />
                      {translateLocation(job.location)}
                    </span>
                    <span>
                      <DollarSign />
                      {translateSalary(job.salary)}
                    </span>
                    <span>
                      <Clock />
                      {job.postedAt}
                    </span>
                  </JobDetails>
                  <JobTags>
                    {job.tags.map((tag, idx) => (
                      <span key={idx}>{tag}</span>
                    ))}
                  </JobTags>
                </RecommendedJobCard>
              ))}
            </JobsGrid>
          </Section>

          {/* Activity Feed */}
          <Section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SectionHeader>
              <h2>
                <Bell />
                {language === 'vi' ? 'Hoạt Động' : 'Activity'}
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
                    transition={{ delay: 0.5 + index * 0.1 }}
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

        {/* Recent Applications */}
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <SectionHeader>
            <h2>
              <FileText />
              {language === 'vi' ? 'Đơn Ứng Tuyển Gần Đây' : 'Recent Applications'}
            </h2>
            <Link to="/candidate/applications">
              {language === 'vi' ? 'Xem tất cả' : 'View all'}
              <ArrowUpRight />
            </Link>
          </SectionHeader>

          {recentApplications.map((app, index) => (
            <ApplicationCard
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <ApplicationHeader>
                <ApplicationInfo>
                  <h4>{app.title}</h4>
                  <p>{app.company}</p>
                </ApplicationInfo>
                <StatusBadge status={app.status} />
              </ApplicationHeader>
              <ApplicationMeta>
                <span>
                  <Clock />
                  {app.appliedDate}
                </span>
                <span>
                  <Eye />
                  {language === 'vi' ? 'Xem chi tiết' : 'View details'}
                </span>
              </ApplicationMeta>
            </ApplicationCard>
          ))}
        </Section>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default CandidateDashboard;
