import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import JobCard from '../../components/JobCard';
import { Briefcase, FileText, Star, TrendingUp } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const DashboardContainer = styled.div`
  animation: fadeIn 0.5s ease-in;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PageHeader = styled.div`
  margin-bottom: 40px;
  
  h1 {
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 12px;
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 17px;
    font-weight: 500;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 48px;
`;

const Section = styled.section`
  margin-bottom: 56px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  
  h2 {
    font-size: 26px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    position: relative;
    padding-left: 16px;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 28px;
      background: ${props => props.theme.colors.gradientPrimary};
      border-radius: 3px;
    }
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
    font-size: 15px;
    transition: all ${props => props.theme.transitions.fast};
    
    &:hover {
      text-decoration: underline;
      transform: translateX(4px);
      display: inline-block;
    }
  }
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 28px;
  border: 2px solid ${props => props.theme.colors.border};
  margin-bottom: 16px;
  transition: all ${props => props.theme.transitions.normal};
  box-shadow: ${props => props.theme.shadows.card};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    background: ${props => props.theme.colors.gradientPrimary};
    opacity: 0;
    transition: opacity ${props => props.theme.transitions.normal};
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateX(8px);
    box-shadow: ${props => props.theme.shadows.hover};
    
    &::before {
      opacity: 1;
    }
  }
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 16px;
`;

const ActivityTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const ActivityMeta = styled.div`
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  
  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const ActivityStatus = styled.span`
  padding: 8px 18px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 13px;
  font-weight: 700;
  text-transform: capitalize;
  background: ${props => {
    if (props.$status === 'pending') return props.theme.colors.warningBg;
    if (props.$status === 'reviewed') return props.theme.colors.infoBg;
    if (props.$status === 'accepted') return props.theme.colors.successBg;
    return props.theme.colors.bgDark;
  }};
  color: ${props => {
    if (props.$status === 'pending') return props.theme.colors.warning;
    if (props.$status === 'reviewed') return props.theme.colors.info;
    if (props.$status === 'accepted') return props.theme.colors.success;
    return props.theme.colors.textLight;
  }};
  border: 2px solid ${props => {
    if (props.$status === 'pending') return `${props.theme.colors.warning}40`;
    if (props.$status === 'reviewed') return `${props.theme.colors.info}40`;
    if (props.$status === 'accepted') return `${props.theme.colors.success}40`;
    return props.theme.colors.border;
  }};
  box-shadow: 0 2px 8px ${props => {
    if (props.$status === 'pending') return `${props.theme.colors.warning}20`;
    if (props.$status === 'reviewed') return `${props.theme.colors.info}20`;
    if (props.$status === 'accepted') return `${props.theme.colors.success}20`;
    return 'transparent';
  }};
`;

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);

  const recommendedJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'FPT Software',
      location: 'Quận 1, TP.HCM',
      type: 'Full-time',
      salary: '120 - 150 triệu VND',
      postedAt: '2 ngày trước',
      tags: ['React', 'TypeScript', 'Hybrid']
    },
    {
      id: 2,
      title: 'Thu ngân',
      company: 'Hồng Trà Ngô Gia',
      location: 'Quận 3, TP.HCM',
      type: 'Full-time',
      salary: '100 - 140 triệu VND',
      postedAt: '1 tuần trước',
      tags: ['Node.js', 'React', 'AWS']
    }
  ];

  const recentApplications = [
    { id: 1, title: 'Nhân viên', company: 'Highlands', appliedDate: '2 days ago', status: 'pending' },
    { id: 2, title: 'Nhân viên pha chế', company: 'Suncha', appliedDate: '5 days ago', status: 'reviewed' },
    { id: 3, title: 'Product Manager', company: 'Le moments', appliedDate: '1 week ago', status: 'accepted' },
  ];

  return (
    <DashboardLayout role="candidate">
      <DashboardContainer>
        <PageHeader>
          <h1>{t.dashboard.candidate.welcome}, Candidate!</h1>
          <p>{language === 'vi' ? 'Đây là những gì đang diễn ra với tìm kiếm việc làm của bạn' : "Here's what's happening with your job search"}</p>
        </PageHeader>

        <StatsGrid>
          <StatsCard
            title={t.dashboard.candidate.stats.applications}
            value="24"
            change="+12%"
            changeText={language === 'vi' ? 'từ tháng trước' : 'from last month'}
            icon={FileText}
            color="linear-gradient(135deg, #0E3995 0%, #0055A5 100%)"
            positive
          />
          <StatsCard
            title={t.dashboard.candidate.stats.savedJobs}
            value="18"
            icon={Star}
            color="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
          />
          <StatsCard
            title={t.dashboard.candidate.stats.interviews}
            value="5"
            change="+2"
            changeText={language === 'vi' ? 'tuần này' : 'this week'}
            icon={TrendingUp}
            color="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
            positive
          />
        </StatsGrid>

        <Section>
          <SectionHeader>
            <h2>{t.dashboard.candidate.recommendedJobs}</h2>
            <Link to="/candidate/jobs">{t.dashboard.candidate.viewAll} →</Link>
          </SectionHeader>
          <JobsGrid>
            {recommendedJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onClick={(id) => navigate(`/candidate/jobs/${id}`)}
                onSave={(id) => console.log('Saved job:', id)}
              />
            ))}
          </JobsGrid>
        </Section>

        <Section>
          <SectionHeader>
            <h2>{t.dashboard.candidate.recentApplications}</h2>
            <a href="/candidate/applications">{t.dashboard.candidate.viewAll} →</a>
          </SectionHeader>
          {recentApplications.map(app => (
            <ActivityCard key={app.id}>
              <ActivityHeader>
                <div>
                  <ActivityTitle>{app.title}</ActivityTitle>
                  <ActivityMeta>
                    <span>{app.company}</span>
                    <span>Applied {app.appliedDate}</span>
                  </ActivityMeta>
                </div>
                <ActivityStatus $status={app.status}>
                  {app.status}
                </ActivityStatus>
              </ActivityHeader>
            </ActivityCard>
          ))}
        </Section>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default CandidateDashboard;
