import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import JobCard from '../../components/JobCard';
import { Filter, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, FormGroup, Label, Button } from '../../components/FormElements';

const JobListingContainer = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
`;

const FilterSidebar = styled.aside`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  height: fit-content;
  position: sticky;
  top: 104px;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.primary};
  }
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  
  input {
    cursor: pointer;
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MainContent = styled.div``;

const ContentHeader = styled.div`
  margin-bottom: 24px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
  }
`;

const JobsGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const JobListing = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);

  const jobs = [
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
    },
    {
      id: 4,
      title: 'Backend Developer',
      company: 'Tech Solutions',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$110k - $140k',
      postedAt: '5 days ago',
      tags: ['Python', 'Django', 'PostgreSQL']
    },
    {
      id: 5,
      title: 'UI/UX Designer',
      company: 'Design Co.',
      location: 'Remote',
      type: 'Contract',
      salary: '$80k - $100k',
      postedAt: '1 week ago',
      tags: ['Figma', 'UI Design', 'Prototyping']
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'Cloud Systems',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$130k - $160k',
      postedAt: '4 days ago',
      tags: ['AWS', 'Docker', 'Kubernetes']
    }
  ];

  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <DashboardLayout role="candidate">
      <JobListingContainer>
        <FilterSidebar>
          <FilterHeader>
            <Filter />
            <h2>Filters</h2>
          </FilterHeader>

          <FilterSection>
            <FilterTitle>Job Type</FilterTitle>
            <CheckboxGroup>
              <CheckboxLabel>
                <input type="checkbox" />
                Full-time
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                Part-time
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                Contract
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                Freelance
              </CheckboxLabel>
            </CheckboxGroup>
          </FilterSection>

          <FilterSection>
            <FilterTitle>Experience Level</FilterTitle>
            <CheckboxGroup>
              <CheckboxLabel>
                <input type="checkbox" />
                Entry Level
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                Mid Level
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                Senior Level
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                Lead/Manager
              </CheckboxLabel>
            </CheckboxGroup>
          </FilterSection>

          <FilterSection>
            <FilterTitle>Salary Range</FilterTitle>
            <CheckboxGroup>
              <CheckboxLabel>
                <input type="checkbox" />
                $0 - $50k
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                $50k - $100k
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                $100k - $150k
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                $150k+
              </CheckboxLabel>
            </CheckboxGroup>
          </FilterSection>

          <Button $variant="primary" $fullWidth style={{ marginTop: '24px' }}>
            Apply Filters
          </Button>
        </FilterSidebar>

        <MainContent>
          <ContentHeader>
            <h1>Find Your Dream Job</h1>
            <p>Showing {jobs.length} available positions</p>
          </ContentHeader>

          <JobsGrid>
            {jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                saved={savedJobs.includes(job.id)}
                onClick={(id) => navigate(`/candidate/jobs/${id}`)}
                onSave={handleSaveJob}
              />
            ))}
          </JobsGrid>
        </MainContent>
      </JobListingContainer>
    </DashboardLayout>
  );
};

export default JobListing;
