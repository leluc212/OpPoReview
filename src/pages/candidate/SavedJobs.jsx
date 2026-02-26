import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import JobCard from '../../components/JobCard';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

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
  const { language } = useLanguage();
  const navigate = useNavigate();

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
          <h1>{language === 'vi' ? 'Tin Đã Lưu' : 'Saved Jobs'}</h1>
          <p>{language === 'vi' ? 'Các tin tuyển dụng bạn đã lưu để xem sau' : 'Job postings you saved for later'}</p>
        </PageHeader>

        <JobsGrid>
          {savedJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              saved={true}
              onSave={(id) => console.log('Unsaved job:', id)}
            />
          ))}
        </JobsGrid>
      </SavedJobsContainer>
    </DashboardLayout>
  );
};

export default SavedJobs;
