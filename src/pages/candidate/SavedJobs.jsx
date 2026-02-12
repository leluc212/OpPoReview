import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import JobCard from '../../components/JobCard';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const SavedJobsContainer = styled.div``;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
  }
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
`;

const SavedJobs = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);

  const savedJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'FPT Software',
      location: 'Quận 1, TP.HCM',
      type: 'Toàn thời gian',
      salary: '120 - 150 triệu VND',
      postedAt: '2 ngày trước',
      tags: ['React', 'TypeScript', 'Remote']
    },
    {
      id: 3,
      title: 'Nhân viên',
      company: 'Highlands',
      location: 'Phú Nhuận, TP.HCM',
      type: 'Toàn thời gian',
      salary: '90 - 120 triệu VND',
      postedAt: '3 ngày trước',
      tags: ['Vue.js', 'JavaScript', 'CSS']
    }
  ];

  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <SavedJobsContainer>
        <PageHeader>
          <h1>{t.jobs.savedJobsTitle}</h1>
          <p>{t.jobs.savedJobsSubtitle}</p>
        </PageHeader>

        <JobsGrid>
          {savedJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              saved={true}
              onClick={(id) => navigate(`/candidate/jobs/${id}`)}
              onSave={(id) => console.log('Unsaved job:', id)}
            />
          ))}
        </JobsGrid>
      </SavedJobsContainer>
    </DashboardLayout>
  );
};

export default SavedJobs;
