import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import { Button, Input, TextArea, Select, FormGroup, Label } from '../../components/FormElements';
import { Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
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

const SalaryInputWrapper = styled.div`
  position: relative;
  flex: 1;
  
  input {
    padding-right: 50px;
  }
  
  &::after {
    content: 'VND';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.textLight};
    font-weight: 600;
    font-size: 14px;
    pointer-events: none;
  }
`;

const VerificationWarning = styled.div`
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 32px;
  margin-bottom: 32px;
  color: white;
  display: flex;
  align-items: start;
  gap: 20px;
  
  svg {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }
  
  .content {
    flex: 1;
    
    h3 {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    p {
      font-size: 15px;
      opacity: 0.95;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    
    button {
      background: white;
      color: #D97706;
      font-weight: 600;
      padding: 12px 24px;
      border-radius: ${props => props.theme.borderRadius.md};
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
    }
  }
`;

const VerificationModalContent = styled.div`
  text-align: center;
  padding: 20px;
  
  .icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    border-radius: 50%;
    background: ${props => props.theme.colors.warning}20;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors.warning};
    
    svg {
      width: 40px;
      height: 40px;
    }
  }
  
  h3 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 16px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: 16px;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.6;
    margin-bottom: 24px;
  }
  
  .button-group {
    display: flex;
    gap: 12px;
    justify-content: center;
    
    button {
      flex: 1;
      max-width: 200px;
    }
  }
`;

const PostJob = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const editingJob = location.state?.job; // Get job data if editing
  const isEditing = !!editingJob;
  
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  
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
  
  // Check verification status on mount
  useEffect(() => {
    const status = localStorage.getItem('companyVerificationStatus') || 'not_started';
    setVerificationStatus(status);
    
    // If not verified and not editing, show modal
    if (status !== 'approved' && !isEditing) {
      setShowVerificationModal(true);
    }
  }, [isEditing]);
  
  // Pre-fill form if editing
  useEffect(() => {
    if (editingJob) {
      setFormData({
        title: editingJob.title || '',
        department: editingJob.department || '',
        location: editingJob.location || '',
        jobType: editingJob.jobType || '',
        experienceLevel: editingJob.experienceLevel || '',
        salaryMin: editingJob.salaryMin || '',
        salaryMax: editingJob.salaryMax || '',
        description: editingJob.description || '',
        responsibilities: editingJob.responsibilities || '',
        requirements: editingJob.requirements || '',
        benefits: editingJob.benefits || ''
      });
    }
  }, [editingJob]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get existing jobs from localStorage
    const existingJobs = JSON.parse(localStorage.getItem('employerJobs') || '[]');
    
    if (isEditing) {
      // Update existing job
      const updatedJobs = existingJobs.map(job => 
        job.id === editingJob.id 
          ? { ...job, ...formData }
          : job
      );
      localStorage.setItem('employerJobs', JSON.stringify(updatedJobs));
    } else {
      // Create new job with unique ID and metadata
      const newJob = {
        id: Date.now(),
        ...formData,
        applicants: 0,
        status: 'active',
        posted: language === 'vi' ? 'Vừa xong' : 'Just now',
        views: 0,
        responseRate: 0,
        createdAt: new Date().toISOString()
      };
      
      // Add new job to beginning of array
      const updatedJobs = [newJob, ...existingJobs];
      localStorage.setItem('employerJobs', JSON.stringify(updatedJobs));
    }
    
    // Navigate to jobs page
    navigate('/employer/jobs');
  };

  return (
    <DashboardLayout role="employer" showSearch={false} key={language}>
      <PostJobContainer>
        <BackButton onClick={() => navigate('/employer/dashboard')}>
          <ArrowLeft /> {language === 'vi' ? 'Quay lại Dashboard' : 'Back to Dashboard'}
        </BackButton>

        {/* Verification Warning */}
        {verificationStatus !== 'approved' && !isEditing && (
          <VerificationWarning>
            <AlertCircle />
            <div className="content">
              <h3>{language === 'vi' ? '⚠️ Yêu cầu xác thực hồ sơ công ty' : '⚠️ Company Verification Required'}</h3>
              <p>
                {language === 'vi'
                  ? 'Bạn cần hoàn tất xác thực hồ sơ công ty trước khi đăng tin tuyển dụng. Quá trình xác thực bao gồm 4 bước: Giấy phép kinh doanh, Thông tin doanh nghiệp, Người đại diện, và Thông tin liên hệ.'
                  : 'You need to complete company verification before posting jobs. The verification process includes 4 steps: Business License, Company Information, Representative, and Contact Information.'}
              </p>
              {verificationStatus === 'pending' ? (
                <p style={{ fontWeight: '600', marginBottom: 0 }}>
                  {language === 'vi'
                    ? '✓ Hồ sơ đang được xem xét. Chúng tôi sẽ phê duyệt trong vòng 24-48 giờ.'
                    : '✓ Your profile is under review. We will approve within 24-48 hours.'}
                </p>
              ) : (
                <button onClick={() => navigate('/employer/verification')}>
                  {language === 'vi' ? 'Bắt đầu xác thực ngay' : 'Start Verification Now'}
                </button>
              )}
            </div>
          </VerificationWarning>
        )}

        <FormCard>
          <FormHeader>
            <h1>{isEditing 
              ? (language === 'vi' ? 'Chỉnh Sửa Tin Tuyển Dụng' : 'Edit Job Posting')
              : (language === 'vi' ? 'Đăng Tin Tuyển Dụng Mới' : 'Post New Job')}
            </h1>
            <p>{isEditing
              ? (language === 'vi' ? 'Cập nhật thông tin tin tuyển dụng' : 'Update job posting details')
              : (language === 'vi' ? 'Điền thông tin để tạo tin tuyển dụng' : 'Fill in the details to create a job posting')}
            </p>
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
                  <SalaryInputWrapper>
                    <Input name="salaryMin" placeholder={language === 'vi' ? 'Tối thiểu' : 'Minimum'} value={formData.salaryMin} onChange={handleChange} />
                  </SalaryInputWrapper>
                  <SalaryInputWrapper>
                    <Input name="salaryMax" placeholder={language === 'vi' ? 'Tối đa' : 'Maximum'} value={formData.salaryMax} onChange={handleChange} />
                  </SalaryInputWrapper>
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
                <Save /> {isEditing 
                  ? (language === 'vi' ? 'Cập Nhật' : 'Update Job')
                  : (language === 'vi' ? 'Đăng Tin' : 'Post Job')}
              </Button>
            </div>
          </form>
        </FormCard>
      </PostJobContainer>

      {/* Verification Required Modal */}
      <Modal
        isOpen={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false);
          if (verificationStatus !== 'approved') {
            navigate('/employer/dashboard');
          }
        }}
        title={language === 'vi' ? 'Xác Thực Hồ Sơ Công Ty' : 'Company Verification'}
        size="medium"
      >
        <VerificationModalContent>
          <div className="icon">
            <AlertCircle />
          </div>
          <h3>{language === 'vi' ? 'Yêu cầu xác thực hồ sơ' : 'Verification Required'}</h3>
          <p>
            {verificationStatus === 'pending' 
              ? (language === 'vi'
                  ? 'Hồ sơ công ty của bạn đang được xem xét. Vui lòng chờ phê duyệt trước khi đăng tin tuyển dụng. Thời gian xử lý: 24-48 giờ.'
                  : 'Your company profile is under review. Please wait for approval before posting jobs. Processing time: 24-48 hours.')
              : (language === 'vi'
                  ? 'Để đăng tin tuyển dụng, bạn cần hoàn tất 4 bước xác thực hồ sơ công ty: Giấy phép kinh doanh, Thông tin doanh nghiệp, Người đại diện và Thông tin liên hệ.'
                  : 'To post jobs, you need to complete 4 steps of company verification: Business License, Company Information, Representative, and Contact Information.')}
          </p>
          <div className="button-group">
            <Button 
              $variant="secondary" 
              onClick={() => {
                setShowVerificationModal(false);
                navigate('/employer/dashboard');
              }}
            >
              {language === 'vi' ? 'Để sau' : 'Later'}
            </Button>
            {verificationStatus !== 'pending' && (
              <Button 
                $variant="primary" 
                onClick={() => navigate('/employer/verification')}
              >
                {language === 'vi' ? 'Xác thực ngay' : 'Verify Now'}
              </Button>
            )}
          </div>
        </VerificationModalContent>
      </Modal>
    </DashboardLayout>
  );
};

export default PostJob;
