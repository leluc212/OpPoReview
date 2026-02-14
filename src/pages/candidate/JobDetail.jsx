import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Button, TextArea, FormGroup, Label } from '../../components/FormElements';
import Modal from '../../components/Modal';
import { MapPin, Briefcase, DollarSign, Clock, Building2, Users, Bookmark, ArrowLeft, Send, Share2, UserPlus, Eye, Star } from 'lucide-react';

const JobDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  margin-bottom: 24px;
  background: none;
  transition: color ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const JobHeader = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 40px;
  margin-bottom: 32px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 24px;
`;

const CompanyLogo = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 32px;
  margin-right: 24px;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const JobTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.text};
`;

const CompanyName = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  
  h2 {
    font-size: 20px;
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
  }
  
  span {
    padding: 4px 12px;
    background: ${props => props.theme.colors.successBg};
    color: ${props => props.theme.colors.success};
    border-radius: ${props => props.theme.borderRadius.full};
    font-size: 12px;
    font-weight: 600;
  }
`;

const JobMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.textLight};
  font-size: 16px;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
`;

const MainSection = styled.div``;

const SidebarSection = styled.div``;

const Card = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    line-height: 1.8;
    margin-bottom: 12px;
  }
  
  ul {
    list-style: disc;
    padding-left: 20px;
    
    li {
      color: ${props => props.theme.colors.textLight};
      margin-bottom: 8px;
      line-height: 1.6;
    }
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  padding: 6px 16px;
  background: ${props => props.theme.colors.gradientPrimary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 14px;
  font-weight: 500;
`;

const CompanyInfo = styled.div`
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const job = {
    id: parseInt(id),
    title: 'Senior React Developer',
    company: 'FPT Software',
    location: 'Quận 1, TP.HCM',
    type: 'Full-time',
    salary: '120 - 150 triệu VND',
    postedAt: '2 ngày trước',
    applicants: 45,
    tags: ['React', 'TypeScript', 'Node.js', 'AWS'],
    description: 'We are looking for an experienced React Developer to join our growing team. You will be responsible for developing and maintaining high-quality web applications using modern technologies.',
    responsibilities: [
      'Develop new user-facing features using React.js',
      'Build reusable components and front-end libraries',
      'Translate designs and wireframes into high-quality code',
      'Optimize components for maximum performance',
      'Collaborate with team members and stakeholders'
    ],
    requirements: [
      '5+ years of experience with React and modern JavaScript',
      'Strong proficiency in TypeScript',
      'Experience with state management (Redux, MobX, or Context API)',
      'Familiarity with RESTful APIs and GraphQL',
      'Experience with version control (Git)'
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Flexible work hours and remote work options',
      'Professional development budget',
      'Unlimited PTO'
    ],
    companySize: '50-200 employees',
    industry: 'Technology',
    founded: '2015'
  };

  const handleApply = () => {
    // In real app, submit application
    console.log('Applying with cover letter:', coverLetter);
    setIsApplyModalOpen(false);
    alert('Application submitted successfully!');
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    alert(isSaved ? 'Job removed from saved' : 'Job saved successfully!');
  };

  const handleFollowEmployer = () => {
    setIsFollowing(!isFollowing);
    alert(isFollowing ? 'Unfollowed employer' : 'Following employer!');
  };

  const handleBoldJob = () => {
    setIsBold(!isBold);
    alert(isBold ? 'Job unmarked' : 'Job marked as important!');
  };

  const handleShareJob = () => {
    setShareModalOpen(true);
  };

  const handleCopyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    alert('Job link copied to clipboard!');
    setShareModalOpen(false);
  };

  const handleViewEmployerProfile = () => {
    navigate(`/candidate/employer/${job.company.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <DashboardLayout role="candidate">
      <JobDetailContainer>
        <BackButton onClick={() => navigate('/candidate/jobs')}>
          <ArrowLeft />
          Back to jobs
        </BackButton>

        <JobHeader>
          <HeaderTop>
            <div style={{ display: 'flex' }}>
              <CompanyLogo>
                {job.company.charAt(0).toUpperCase()}
              </CompanyLogo>
              <HeaderContent>
                <JobTitle>{job.title}</JobTitle>
                <CompanyName>
                  <h2>{job.company}</h2>
                  <span>Hiring</span>
                </CompanyName>
                <JobMeta>
                  <MetaItem>
                    <MapPin />
                    <span>{job.location}</span>
                  </MetaItem>
                  <MetaItem>
                    <Briefcase />
                    <span>{job.type}</span>
                  </MetaItem>
                  <MetaItem>
                    <DollarSign />
                    <span>{job.salary}</span>
                  </MetaItem>
                  <MetaItem>
                    <Clock />
                    <span>Posted {job.postedAt}</span>
                  </MetaItem>
                  <MetaItem>
                    <Users />
                    <span>{job.applicants} applicants</span>
                  </MetaItem>
                </JobMeta>
              </HeaderContent>
            </div>
            <ActionButtons>
              <Button 
                $variant="ghost" 
                onClick={handleBoldJob}
                title={isBold ? 'Unmark job' : 'Mark as important'}
              >
                <Star style={{ fill: isBold ? '#FFD700' : 'none', color: isBold ? '#FFD700' : 'currentColor' }} />
              </Button>
              <Button 
                $variant="ghost" 
                onClick={handleSaveJob}
                title={isSaved ? 'Unsave job' : 'Save job'}
              >
                <Bookmark style={{ fill: isSaved ? 'currentColor' : 'none' }} />
              </Button>
              <Button $variant="ghost" onClick={handleShareJob} title="Share job">
                <Share2 />
              </Button>
              <Button $variant="primary" $size="large" onClick={() => setIsApplyModalOpen(true)}>
                <Send />
                Apply Now
              </Button>
            </ActionButtons>
          </HeaderTop>

          <TagsContainer>
            {job.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagsContainer>
        </JobHeader>

        <Content>
          <MainSection>
            <Card>
              <h3>Job Description</h3>
              <p>{job.description}</p>
            </Card>

            <Card>
              <h3>Responsibilities</h3>
              <ul>
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3>Requirements</h3>
              <ul>
                {job.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3>Benefits</h3>
              <ul>
                {job.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </Card>
          </MainSection>

          <SidebarSection>
            <Card>
              <h3>About {job.company}</h3>
              <CompanyInfo>
                <InfoLabel>Industry</InfoLabel>
                <InfoValue>{job.industry}</InfoValue>
              </CompanyInfo>
              <CompanyInfo>
                <InfoLabel>Company Size</InfoLabel>
                <InfoValue>{job.companySize}</InfoValue>
              </CompanyInfo>
              <CompanyInfo>
                <InfoLabel>Founded</InfoLabel>
                <InfoValue>{job.founded}</InfoValue>
              </CompanyInfo>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <Button 
                  $variant="secondary" 
                  $fullWidth 
                  onClick={handleViewEmployerProfile}
                >
                  <Eye style={{ width: '18px', height: '18px' }} />
                  View Profile
                </Button>
                <Button 
                  $variant={isFollowing ? 'ghost' : 'secondary'} 
                  $fullWidth
                  onClick={handleFollowEmployer}
                >
                  <UserPlus style={{ width: '18px', height: '18px' }} />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>
            </Card>

            <Card>
              <Button $variant="primary" $fullWidth $size="large" onClick={() => setIsApplyModalOpen(true)}>
                Apply for this Position
              </Button>
            </Card>
          </SidebarSection>
        </Content>

        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title="Apply for this Position"
          footer={
            <>
              <Button $variant="secondary" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button $variant="primary" onClick={handleApply}>
                Submit Application
              </Button>
            </>
          }
        >
          <FormGroup>
            <Label>Cover Letter</Label>
            <TextArea
              placeholder="Tell us why you're a great fit for this role..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </FormGroup>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '16px' }}>
            Your resume and profile information will be automatically included with this application.
          </p>
        </Modal>

        <Modal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          title="Share this Job"
          footer={
            <Button $variant="primary" onClick={handleCopyLink}>
              Copy Link
            </Button>
          }
        >
          <p style={{ marginBottom: '16px', color: '#64748B' }}>
            Share this job opportunity with your network
          </p>
          <div style={{ 
            padding: '12px', 
            background: '#F1F5F9', 
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '14px',
            wordBreak: 'break-all'
          }}>
            {window.location.href}
          </div>
        </Modal>
      </JobDetailContainer>
    </DashboardLayout>
  );
};

export default JobDetail;
