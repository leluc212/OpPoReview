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
      location: language === 'vi' ? 'Quận 1, TP.HCM' : 'District 1, HCMC',
      type: language === 'vi' ? 'Toàn thời gian' : 'Full-time',
      salary: language === 'vi' ? '120 - 150 triệu VND' : '120 - 150 million VND',
      postedAt: language === 'vi' ? '2 ngày trước' : '2 days ago',
      tags: ['React', 'TypeScript', 'Remote']
    },
    {
      id: 3,
      title: language === 'vi' ? 'Nhân viên' : 'Staff',
      company: 'Highlands',
      location: language === 'vi' ? 'Phú Nhuận, TP.HCM' : 'Phu Nhuan, HCMC',
      type: language === 'vi' ? 'Toàn thời gian' : 'Full-time',
      salary: language === 'vi' ? '90 - 120 triệu VND' : '90 - 120 million VND',
      postedAt: language === 'vi' ? '3 ngày trước' : '3 days ago',
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
