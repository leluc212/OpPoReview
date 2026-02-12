import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import JobCard from '../../components/JobCard';
import { 
  Filter, MapPin, Briefcase, DollarSign, ClipboardList, BadgeCheck, Activity, Clock3, BookmarkCheck, Building2, UserPlus 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, FormGroup, Label, Button } from '../../components/FormElements';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

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

const Tabs = styled.div`
  display: inline-flex;
  background: ${props => props.theme.colors.bgLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 6px;
  gap: 6px;
  margin-bottom: 16px;
`;

const TabButton = styled.button`
  padding: 10px 14px;
  border-radius: ${props => props.theme.borderRadius.md};
  border: none;
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? '#fff' : props.theme.colors.text};
  font-weight: 700;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  box-shadow: ${props => props.$active ? '0 10px 30px rgba(99,102,241,0.25)' : 'none'};
`;

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

const ActionsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  background: ${props => props.theme.colors.bgLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: ${props => props.theme.borderRadius.sm};
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.bgDark};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  font-weight: 600;

  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.theme.colors.primary};
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  }
`;

const JobListing = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [followedEmployers, setFollowedEmployers] = useState([]);
  const [tab, setTab] = useState('standard');
  const { language } = useLanguage();
  const t = useTranslations(language);

  const jobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'FPT Software',
      employerId: 'FPT Software',
      location: 'Quận 1, TP.HCM',
      type: 'Full-time',
      category: 'standard',
      salary: '120 - 150 triệu VND',
      postedAt: '2 days ago',
      tags: ['React', 'TypeScript', 'Hybrid']
    },
    {
      id: 2,
      title: 'Thu ngân',
      company: 'Hồng Trà Ngô Gia',
      employerId: 'Hồng Trà Ngô Gia',
      location: 'Quận 3, TP.HCM',
      type: 'Full-time',
      category: 'standard',
      salary: '100 - 140 triệu VND',
      postedAt: '1 week ago',
      tags: ['Node.js', 'React', 'AWS']
    },
    {
      id: 3,
      title: 'Nhân viên',
      company: 'Highlands',
      employerId: 'acme',
      location: 'Phú Nhuận, TP.HCM',
      type: 'Full-time',
      category: 'standard',
      salary: '90 - 120 triệu VND',
      postedAt: '3 days ago',
      tags: ['Vue.js', 'JavaScript', 'CSS']
    },
    {
      id: 4,
      title: 'Nhân viên phục vụ',
      company: 'Le moments',
      employerId: 'techsolutions',
      location: 'Thủ Đức, TP.HCM',
      type: 'Full-time',
      category: 'standard',
      salary: '110 - 140 triệu VND',
      postedAt: '5 days ago',
      tags: ['Python', 'Django', 'PostgreSQL']
    },
    {
      id: 5,
      title: 'Nhân viên pha chế',
      company: 'Suncha',
      employerId: 'designco',
      location: 'Bình Thạnh, TP.HCM',
      type: 'Contract',
      category: 'standard',
      salary: '80 - 100 triệu VND',
      postedAt: '1 week ago',
      tags: ['Figma', 'UI Design', 'Prototyping']
    },
    {
      id: 6,
      title: 'Nhân viên pha chế',
      company: 'Trà Tam Hảo',
      employerId: 'cloudsystems',
      location: 'Quận 7, TP.HCM',
      type: 'Full-time',
      category: 'standard',
      salary: '130 - 160 triệu VND',
      postedAt: '4 days ago',
      tags: ['AWS', 'Docker', 'Kubernetes']
    },
    {
      id: 7,
      title: 'Shift Supervisor',
      company: 'NightOwl Logistics',
      employerId: 'nightowl',
      location: 'TP.HCM (Ca đêm)',
      type: 'Shift',
      category: 'shift',
      salary: '750k - 1 triệu/giờ',
      postedAt: '1 day ago',
      tags: ['Shift', 'Logistics', 'Night']
    },
    {
      id: 8,
      title: 'Ca sáng - Nhân viên kho',
      company: 'FastMove',
      employerId: 'fastmove',
      location: 'Tân Bình, TP.HCM',
      type: 'Shift',
      category: 'shift',
      salary: '200k - 300k/ca',
      postedAt: '3 days ago',
      tags: ['Shift', 'Kho vận']
    }
  ];

  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleFollow = (employerId) => {
    setFollowedEmployers(prev => prev.includes(employerId)
      ? prev.filter(id => id !== employerId)
      : [...prev, employerId]
    );
  };

  const filteredJobs = useMemo(() => {
    if (tab === 'saved') {
      return jobs.filter(j => savedJobs.includes(j.id));
    }
    return jobs.filter(j => j.category === tab);
  }, [jobs, tab, savedJobs]);

  return (
    <DashboardLayout role="candidate">
      <JobListingContainer>
        <FilterSidebar>
          <FilterHeader>
            <Filter />
            <h2>{t.jobs.filterBy || 'Filters'}</h2>
          </FilterHeader>

          <FilterSection>
            <FilterTitle>{t.jobs.jobType}</FilterTitle>
            <CheckboxGroup>
              <CheckboxLabel>
                <input type="checkbox" />
                {t.jobs.fullTime}
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                {t.jobs.partTime}
              </CheckboxLabel>
            </CheckboxGroup>
          </FilterSection>

          <FilterSection>
            <FilterTitle>{t.jobs.experience}</FilterTitle>
            <CheckboxGroup>
              <CheckboxLabel>
                <input type="checkbox" />
                {t.jobs.entry}
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                {t.jobs.mid}
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                {t.jobs.senior}
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                Lead/Manager
              </CheckboxLabel>
            </CheckboxGroup>
          </FilterSection>

          <FilterSection>
            <FilterTitle>{t.jobs.salary}</FilterTitle>
            <CheckboxGroup>
              <CheckboxLabel>
                <input type="checkbox" />
                0 - 50k
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                50k - 100k
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                100k - 150k
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" />
                150k+
              </CheckboxLabel>
            </CheckboxGroup>
          </FilterSection>

          <Button $variant="primary" $fullWidth style={{ marginTop: '24px' }}>
            {t.jobs.filterBy || 'Apply Filters'}
          </Button>
        </FilterSidebar>

        <MainContent>
          <ContentHeader>
            <h1>{t.jobs.posts}</h1>
            <p>{`${t.jobs.showing} ${filteredJobs.length} ${t.jobs.postsLabel}`}</p>
          </ContentHeader>

          <Tabs>
            <TabButton $active={tab === 'standard'} onClick={() => setTab('standard')}>
              {t.jobs.standardJobs}
            </TabButton>
            <TabButton $active={tab === 'shift'} onClick={() => setTab('shift')}>
              {t.jobs.shiftJobs}
            </TabButton>
            <TabButton $active={tab === 'saved'} onClick={() => setTab('saved')}>
              {t.jobs.savedTab}
            </TabButton>
          </Tabs>

          <JobsGrid>
            {filteredJobs.map(job => (
              <div key={job.id}>
                <JobCard
                  job={job}
                  saved={savedJobs.includes(job.id)}
                  onClick={(id) => navigate(`/candidate/jobs/${id}`)}
                  onSave={handleSaveJob}
                />
                <ActionsBar style={{ marginTop: '10px' }}>
                  <ActionButton type="button" onClick={() => navigate(`/employer/profile/${job.employerId || job.company}`)}>
                    <Building2 />
                    <span>{t.jobs.viewEmployerProfile}</span>
                  </ActionButton>
                  <ActionButton type="button" onClick={() => handleFollow(job.employerId || job.company)}>
                    <UserPlus />
                    <span>{followedEmployers.includes(job.employerId || job.company) ? 'Đang theo dõi' : t.jobs.followEmployer}</span>
                  </ActionButton>
                  <ActionButton type="button" onClick={() => handleSaveJob(job.id)}>
                    <BookmarkCheck />
                    <span>{savedJobs.includes(job.id) ? t.jobs.saved : t.jobs.save}</span>
                  </ActionButton>
                </ActionsBar>
              </div>
            ))}
          </JobsGrid>
        </MainContent>
      </JobListingContainer>
    </DashboardLayout>
  );
};

export default JobListing;
