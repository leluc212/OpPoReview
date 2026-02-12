import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import JobCard from '../../components/JobCard';
import { Briefcase, FileText, Eye, Star, TrendingUp } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const DashboardContainer = styled.div``;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 48px;
`;

const Section = styled.section`
  margin-bottom: 48px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    font-size: 24px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
`;

const ActivityCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 16px;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
`;

const ActivityTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const ActivityMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
`;

const ActivityStatus = styled.span`
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
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
`;

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);

  const recommendedJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp',
      location: 'Remote',
      type: 'Full-time',
      salary: '$120k - $150k',
      postedAt: '2 days ago',
      tags: ['React', 'TypeScript', 'Remote']
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$100k - $140k',
      postedAt: '1 week ago',
      tags: ['Node.js', 'React', 'AWS']
    }
  ];

  const recentApplications = [
    { id: 1, title: 'Frontend Developer', company: 'Acme Inc.', appliedDate: '2 days ago', status: 'pending' },
    { id: 2, title: 'UI/UX Designer', company: 'Design Co.', appliedDate: '5 days ago', status: 'reviewed' },
    { id: 3, title: 'Product Manager', company: 'Tech Solutions', appliedDate: '1 week ago', status: 'accepted' },
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
            color="linear-gradient(135deg, #667EEA 0%, #764BA2 100%)"
            positive
          />
          <StatsCard
            title={t.dashboard.candidate.stats.profileViews}
            value="156"
            change="+23%"
            changeText={language === 'vi' ? 'từ tuần trước' : 'from last week'}
            icon={Eye}
            color="linear-gradient(135deg, #F093FB 0%, #F5576C 100%)"
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
