import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Button, Input, TextArea, Select, FormGroup, Label } from '../../components/FormElements';
import { Save, ArrowLeft } from 'lucide-react';

const PostJobContainer = styled.div`
  max-width: 900px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  margin-bottom: 24px;
  background: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const FormCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 40px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const FormHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
`;

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Posting job:', formData);
    alert('Job posted successfully!');
    navigate('/employer/jobs');
  };

  return (
    <DashboardLayout role="employer" showSearch={false}>
      <PostJobContainer>
        <BackButton onClick={() => navigate('/employer/dashboard')}>
          <ArrowLeft /> Back to Dashboard
        </BackButton>

        <FormCard>
          <FormHeader>
            <h1>Post a New Job</h1>
            <p>Fill in the details to create a job listing</p>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label>Job Title *</Label>
                <Input name="title" placeholder="e.g. Senior React Developer" value={formData.title} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label>Department</Label>
                <Input name="department" placeholder="e.g. Engineering" value={formData.department} onChange={handleChange} />
              </FormGroup>

              <FormGroup>
                <Label>Location *</Label>
                <Input name="location" placeholder="e.g. Remote, San Francisco" value={formData.location} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label>Job Type *</Label>
                <Select name="jobType" value={formData.jobType} onChange={handleChange} required>
                  <option value="">Select Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Experience Level *</Label>
                <Select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} required>
                  <option value="">Select Level</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead/Manager</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Salary Range (Optional)</Label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Input name="salaryMin" placeholder="Min" value={formData.salaryMin} onChange={handleChange} />
                  <Input name="salaryMax" placeholder="Max" value={formData.salaryMax} onChange={handleChange} />
                </div>
              </FormGroup>
            </FormGrid>

            <FormGroup style={{ marginTop: '24px' }}>
              <Label>Job Description *</Label>
              <TextArea name="description" placeholder="Describe the role..." value={formData.description} onChange={handleChange} required />
            </FormGroup>

            <FormGroup>
              <Label>Responsibilities</Label>
              <TextArea name="responsibilities" placeholder="List key responsibilities..." value={formData.responsibilities} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>Requirements</Label>
              <TextArea name="requirements" placeholder="List requirements and qualifications..." value={formData.requirements} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>Benefits</Label>
              <TextArea name="benefits" placeholder="List benefits and perks..." value={formData.benefits} onChange={handleChange} />
            </FormGroup>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <Button type="button" $variant="secondary" onClick={() => navigate('/employer/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="large">
                <Save /> Post Job
              </Button>
            </div>
          </form>
        </FormCard>
      </PostJobContainer>
    </DashboardLayout>
  );
};

export default PostJob;
