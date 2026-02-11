import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import JobCard from '../../components/JobCard';
import { useNavigate } from 'react-router-dom';

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

  const savedJobs = [
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
      id: 3,
      title: 'Frontend Developer',
      company: 'Acme Inc.',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$90k - $120k',
      postedAt: '3 days ago',
      tags: ['Vue.js', 'JavaScript', 'CSS']
    }
  ];

  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <SavedJobsContainer>
        <PageHeader>
          <h1>Saved Jobs</h1>
          <p>Jobs you've bookmarked for later</p>
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
