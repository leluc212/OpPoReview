import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import { Button, Input, TextArea, Select, FormGroup, Label } from '../../components/FormElements';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import jobPostService from '../../services/jobPostService';
import { fetchAuthSession } from 'aws-amplify/auth';

const PostJobContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748B;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 32px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px 12px;
  border-radius: 8px;
  
  &:hover {
    color: #1e40af;
    background: #EFF6FF;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const FormCard = styled.div`
  background: #FFFFFF;
  border-radius: 20px;
  padding: 48px;
  border: 2px solid #E8EFFF;
  box-shadow: 0 4px 20px rgba(30, 64, 175, 0.08);
  
  @media (max-width: 768px) {
    padding: 32px 24px;
    border-radius: 16px;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 2px solid #F1F5F9;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 8px;
    color: #1E293B;
    letter-spacing: -0.5px;
    
    @media (max-width: 768px) {
      font-size: 26px;
    }
  }
  
  p {
    color: #64748B;
    font-size: 15px;
    font-weight: 500;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const SalaryInputWrapper = styled.div`
  position: relative;
  flex: 1;
  
  input {
    padding-right: 70px;
  }
  
  &::after {
    content: 'VNĐ/h';
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #1e40af;
    font-weight: 700;
    font-size: 13px;
    pointer-events: none;
    background: #EFF6FF;
    padding: 4px 10px;
    border-radius: 6px;
  }
`;

const VerificationWarning = styled.div`
  background: #FEF3C7;
  border: 2px solid #FCD34D;
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 32px;
  color: #92400E;
  display: flex;
  align-items: start;
  gap: 16px;
  
  svg {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    color: #D97706;
  }
  
  .content {
    flex: 1;
    
    h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #78350F;
    }
    
    p {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 16px;
      color: #92400E;
    }
    
    button {
      background: #1e40af;
      color: white;
      font-weight: 700;
      padding: 10px 20px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      
      &:hover {
        background: #1e3a8a;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
      }
    }
  }
`;

const VerificationModalContent = styled.div`
  text-align: center;
  padding: 32px 24px;
  
  .icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    border-radius: 50%;
    background: #FEF3C7;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #D97706;
    border: 3px solid #FCD34D;
    
    svg {
      width: 40px;
      height: 40px;
    }
  }
  
  h3 {
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 16px;
    color: #1E293B;
  }
  
  p {
    font-size: 15px;
    color: #64748B;
    line-height: 1.7;
    margin-bottom: 28px;
  }
  
  .button-group {
    display: flex;
    gap: 12px;
    justify-content: center;
    
    button {
      flex: 1;
      max-width: 200px;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14px;
      transition: all 0.2s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
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
    location: '',
    jobType: '',
    workDays: '',
    workHours: '',
    salary: '',
    tags: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: ''
  });
  
  // Check verification status on mount
  useEffect(() => {
    const status = localStorage.getItem('companyVerificationStatus') || 'not_started';
    
    // AUTO-APPROVE for development: Automatically approve if pending or not started
    // TODO: Remove this in production - verification should be done by admin
    if (status === 'pending' || status === 'not_started') {
      console.log('🚀 AUTO-APPROVE: Setting verification status to approved for development');
      localStorage.setItem('companyVerificationStatus', 'approved');
      setVerificationStatus('approved');
    } else {
      setVerificationStatus(status);
    }
    
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
        location: editingJob.location || '',
        jobType: editingJob.jobType || '',
        workDays: editingJob.workDays || '',
        workHours: editingJob.workHours || '',
        salary: editingJob.salary || '',
        tags: editingJob.tags || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔥🔥🔥 SUBMIT BUTTON CLICKED');
    console.log('📦 Form data:', formData);
    console.log('📝 Is editing:', isEditing);
    console.log('📝 Editing job:', editingJob);
    
    try {
      if (isEditing) {
        // Update existing job in DynamoDB
        const jobId = editingJob.idJob || editingJob.id;
        console.log('🔄 Updating job with ID:', jobId);
        
        if (!jobId) {
          throw new Error('Job ID not found');
        }
        
        await jobPostService.updateJobPost(jobId, formData);
        console.log('✅ Job post updated successfully');
      } else {
        // Get authenticated user info
        const session = await fetchAuthSession();
        let employerId = 'anonymous';
        let employerEmail = 'anonymous@example.com';
        let employerName = 'Công ty';
        
        if (session && session.tokens) {
          const idTokenPayload = session.tokens.idToken?.payload;
          employerId = idTokenPayload?.sub || 'anonymous';
          employerEmail = idTokenPayload?.email || 'anonymous@example.com';
          
          // Try to get company name from EmployerProfile
          try {
            const employerProfileService = (await import('../../services/employerProfileService')).default;
            const profile = await employerProfileService.getMyProfile();
            if (profile && profile.companyName) {
              employerName = profile.companyName;
              console.log('✅ Got company name from profile:', employerName);
            } else {
              // Fallback to email username
              employerName = employerEmail.split('@')[0];
              console.log('⚠️ No company name in profile, using email username');
            }
          } catch (error) {
            console.warn('⚠️ Could not load employer profile:', error);
            employerName = employerEmail.split('@')[0];
          }
          
          console.log('✅ User authenticated:', { employerId, employerEmail, employerName });
        } else {
          console.warn('⚠️ No authentication session - using anonymous');
        }
        
        // Generate job ID
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let randomStr = '';
        for (let i = 0; i < 5; i++) {
          randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const jobId = `JOB-${year}${month}${day}-${randomStr}`;
        
        const payload = {
          idJob: jobId,
          employerId: employerId,
          employerEmail: employerEmail,
          employerName: employerName,
          ...formData,
          status: 'active',
          applicants: 0,
          views: 0,
          responseRate: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log('📤 Sending request with employer info:', payload);
        
        // Use direct API (CORS is fixed)
        const apiUrl = 'https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod/jobs';
        
        console.log('🔗 API URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload),
          mode: 'cors'
        });
        
        console.log('📥 Response status:', response.status);
        
        const result = await response.json();
        console.log('📥 Response data:', result);
        
        if (response.ok) {
          console.log('✅ Job post created successfully with ID:', result.data.idJob);
        } else {
          throw new Error('API request failed: ' + response.status);
        }
      }
      
      // Navigate back to standard jobs page
      navigate('/employer/standard-jobs');
    } catch (error) {
      console.error('❌ Error saving job post:', error);
      alert(language === 'vi' 
        ? 'Có lỗi xảy ra khi lưu tin tuyển dụng. Vui lòng thử lại.' 
        : 'Error saving job post. Please try again.');
    }
  };

  return (
    <DashboardLayout role="employer" showSearch={false} key={language}>
      <PostJobContainer>
        <BackButton onClick={() => navigate('/employer/dashboard')}>
          <ArrowLeft /> {language === 'vi' ? 'Quay lại trang chủ' : 'Back to main page'}
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
                <Input name="title" placeholder={language === 'vi' ? 'Nhân viên dọn đẹp' : 'e.g., Waiter'} value={formData.title} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Địa điểm *' : 'Location *'}</Label>
                <Input name="location" placeholder={language === 'vi' ? 'Quận Cam' : 'e.g., District Cam'} value={formData.location} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Loại hình công việc *' : 'Job Type *'}</Label>
                <Select name="jobType" value={formData.jobType} onChange={handleChange} required>
                  <option value="">{language === 'vi' ? 'Chọn loại hình' : 'Select type'}</option>
                  <option value="part-time">{language === 'vi' ? 'Bán thời gian' : 'Part-time'}</option>
                  <option value="full-time">{language === 'vi' ? 'Toàn thời gian' : 'Full-time'}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Ngày làm *' : 'Work Date *'}</Label>
                <Input 
                  name="workDays" 
                  type="date"
                  placeholder={language === 'vi' ? 'Chọn ngày' : 'Select date'} 
                  value={formData.workDays} 
                  onChange={handleChange} 
                  required 
                />
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Giờ làm *' : 'Work Hours *'}</Label>
                <Input 
                  name="workHours" 
                  placeholder={language === 'vi' ? 'Ví dụ: 8:00 - 17:00' : 'e.g., 8:00 - 17:00'} 
                  value={formData.workHours} 
                  onChange={handleChange} 
                  required 
                />
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Mức lương (Không bắt buộc)' : 'Salary (Optional)'}</Label>
                <SalaryInputWrapper>
                  <Input 
                    name="salary" 
                    type="number"
                    placeholder={language === 'vi' ? 'Ví dụ: 25000' : 'e.g., 25000'} 
                    value={formData.salary} 
                    onChange={handleChange} 
                  />
                </SalaryInputWrapper>
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Đặc điểm (Không bắt buộc)' : 'Tags (Optional)'}</Label>
                <Input 
                  name="tags" 
                  placeholder={language === 'vi' ? 'Pha chế, F&B, Coffee (phân cách bằng dấu phẩy)' : 'Barista, F&B, Coffee (comma separated)'} 
                  value={formData.tags} 
                  onChange={handleChange} 
                />
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px' }}>
                  {language === 'vi' 
                    ? 'Nhập các đặc điểm và phân cách bằng dấu phẩy. Ví dụ: Pha chế, F&B, Coffee' 
                    : 'Enter tags separated by commas. Example: Barista, F&B, Coffee'}
                </p>
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
