import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { Button, Input, TextArea, Select, FormGroup, Label } from '../../components/FormElements';
import { Save, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
  const { language } = useLanguage();
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
          <ArrowLeft /> {language === 'vi' ? 'Quay lại Dashboard' : 'Back to Dashboard'}
        </BackButton>

        <FormCard>
          <FormHeader>
            <h1>{language === 'vi' ? 'Đăng Tin Tuyển Dụng Mới' : 'Post New Job'}</h1>
            <p>{language === 'vi' ? 'Điền thông tin để tạo tin tuyển dụng' : 'Fill in the details to create a job posting'}</p>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label>{language === 'vi' ? 'Tiêu đề công việc *' : 'Job Title *'}</Label>
                <Input name="title" placeholder={language === 'vi' ? 'Ví dụ: Lập trình viên React cấp cao' : 'e.g., Senior React Developer'} value={formData.title} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Phòng ban' : 'Department'}</Label>
                <Input name="department" placeholder={language === 'vi' ? 'Ví dụ: Kỹ thuật' : 'e.g., Engineering'} value={formData.department} onChange={handleChange} />
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Địa điểm *' : 'Location *'}</Label>
                <Input name="location" placeholder={language === 'vi' ? 'Ví dụ: Từ xa, Hà Nội' : 'e.g., Remote, Hanoi'} value={formData.location} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Loại hình công việc *' : 'Job Type *'}</Label>
                <Select name="jobType" value={formData.jobType} onChange={handleChange} required>
                  <option value="">{language === 'vi' ? 'Chọn loại hình' : 'Select type'}</option>
                  <option value="full-time">{language === 'vi' ? 'Toàn thời gian' : 'Full-time'}</option>
                  <option value="part-time">{language === 'vi' ? 'Bán thời gian' : 'Part-time'}</option>
                  <option value="contract">{language === 'vi' ? 'Hợp đồng' : 'Contract'}</option>
                  <option value="freelance">{language === 'vi' ? 'Tự do' : 'Freelance'}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Cấp độ kinh nghiệm *' : 'Experience Level *'}</Label>
                <Select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} required>
                  <option value="">{language === 'vi' ? 'Chọn cấp độ' : 'Select level'}</option>
                  <option value="entry">{language === 'vi' ? 'Mới vào nghề' : 'Entry Level'}</option>
                  <option value="mid">{language === 'vi' ? 'Trung cấp' : 'Mid Level'}</option>
                  <option value="senior">{language === 'vi' ? 'Cấp cao' : 'Senior'}</option>
                  <option value="lead">{language === 'vi' ? 'Trưởng phòng/Quản lý' : 'Lead/Manager'}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Mức lương (Không bắt buộc)' : 'Salary Range (Optional)'}</Label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Input name="salaryMin" placeholder={language === 'vi' ? 'Tối thiểu' : 'Minimum'} value={formData.salaryMin} onChange={handleChange} />
                  <Input name="salaryMax" placeholder={language === 'vi' ? 'Tối đa' : 'Maximum'} value={formData.salaryMax} onChange={handleChange} />
                </div>
              </FormGroup>
            </FormGrid>

            <FormGroup style={{ marginTop: '24px' }}>
              <Label>{language === 'vi' ? 'Mô tả công việc *' : 'Job Description *'}</Label>
              <TextArea name="description" placeholder={language === 'vi' ? 'Mô tả vị trí công việc...' : 'Describe the position...'} value={formData.description} onChange={handleChange} required />
            </FormGroup>

            <FormGroup>
              <Label>{language === 'vi' ? 'Trách nhiệm' : 'Responsibilities'}</Label>
              <TextArea name="responsibilities" placeholder={language === 'vi' ? 'Liệt kê các trách nhiệm chính...' : 'List key responsibilities...'} value={formData.responsibilities} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>{language === 'vi' ? 'Yêu cầu' : 'Requirements'}</Label>
              <TextArea name="requirements" placeholder={language === 'vi' ? 'Liệt kê yêu cầu và trình độ...' : 'List requirements and qualifications...'} value={formData.requirements} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <Label>{language === 'vi' ? 'Quyền lợi' : 'Benefits'}</Label>
              <TextArea name="benefits" placeholder={language === 'vi' ? 'Liệt kê quyền lợi và phúc lợi...' : 'List benefits and perks...'} value={formData.benefits} onChange={handleChange} />
            </FormGroup>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <Button type="button" $variant="secondary" onClick={() => navigate('/employer/dashboard')}>
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </Button>
              <Button type="submit" $variant="primary" $size="large">
                <Save /> {language === 'vi' ? 'Đăng Tin' : 'Post Job'}
              </Button>
            </div>
          </form>
        </FormCard>
      </PostJobContainer>
    </DashboardLayout>
  );
};

export default PostJob;
