import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { Button, Input, TextArea, FormGroup, Label } from '../../components/FormElements';
import { 
  CheckCircle, 
  Circle, 
  Upload, 
  FileText, 
  Building, 
  User, 
  Phone,
  ArrowRight,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const VerificationContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 12px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: 16px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const StepperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.theme.colors.border};
    z-index: 0;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex: 1;
  position: relative;
  z-index: 1;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  
  .step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => {
      if (props.$completed) return props.theme.colors.success;
      if (props.$active) return props.theme.colors.primary;
      return props.theme.colors.bgLight;
    }};
    border: 2px solid ${props => {
      if (props.$completed) return props.theme.colors.success;
      if (props.$active) return props.theme.colors.primary;
      return props.theme.colors.border;
    }};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => (props.$completed || props.$active) ? 'white' : props.theme.colors.textLight};
    font-weight: 700;
    transition: all 0.3s;
  }
  
  .step-label {
    font-size: 14px;
    font-weight: 600;
    color: ${props => {
      if (props.$active) return props.theme.colors.text;
      return props.theme.colors.textLight;
    }};
    text-align: center;
  }
`;

const FormCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 40px;
  box-shadow: ${props => props.theme.shadows.md};
`;

const FormTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  
  .icon {
    width: 48px;
    height: 48px;
    border-radius: ${props => props.theme.borderRadius.md};
    background: ${props => props.theme.colors.primary}20;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors.primary};
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed ${props => props.$hasFile ? props.theme.colors.success : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.$hasFile ? props.theme.colors.success + '10' : props.theme.colors.bgDark};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }
  
  .upload-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px;
    color: ${props => props.$hasFile ? props.theme.colors.success : props.theme.colors.textLight};
  }
  
  .upload-text {
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
  }
  
  .upload-hint {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
  }
  
  input[type="file"] {
    display: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  
  button {
    flex: 1;
  }
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.info}15;
  border-left: 4px solid ${props => props.theme.colors.info};
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 24px;
  
  display: flex;
  gap: 12px;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.info};
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .info-content {
    p {
      font-size: 14px;
      color: ${props => props.theme.colors.text};
      line-height: 1.6;
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    strong {
      font-weight: 600;
    }
  }
`;

const CompletionCard = styled(motion.div)`
  background: linear-gradient(135deg, ${props => props.theme.colors.success} 0%, ${props => props.theme.colors.success}dd 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 64px 40px;
  text-align: center;
  color: white;
  
  .success-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 48px;
      height: 48px;
    }
  }
  
  h2 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 16px;
    opacity: 0.9;
    margin-bottom: 32px;
    line-height: 1.6;
  }
  
  button {
    background: white;
    color: ${props => props.theme.colors.success};
    font-weight: 700;
    padding: 14px 32px;
    border-radius: ${props => props.theme.borderRadius.md};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    }
  }
`;

const SuccessMessage = styled(motion.div)`
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

const CompanyVerification = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(null); // Track which file was uploaded
  
  const [step1Data, setStep1Data] = useState({
    businessLicense: null,
    licenseNumber: '',
    issueDate: '',
    expiryDate: '',
    issuingAuthority: ''
  });
  
  const [step2Data, setStep2Data] = useState({
    companyName: '',
    companyNameEn: '',
    taxCode: '',
    foundedYear: '',
    industry: '',
    companySize: '',
    website: '',
    description: ''
  });
  
  const [step3Data, setStep3Data] = useState({
    representativeName: '',
    position: '',
    idNumber: '',
    idFrontImage: null,
    idBackImage: null,
    authorizationLetter: null
  });
  
  const [step4Data, setStep4Data] = useState({
    address: '',
    city: '',
    district: '',
    ward: '',
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const steps = [
    {
      id: 0,
      label: language === 'vi' ? 'Giấy phép KD' : 'Business License',
      icon: FileText
    },
    {
      id: 1,
      label: language === 'vi' ? 'Thông tin DN' : 'Company Info',
      icon: Building
    },
    {
      id: 2,
      label: language === 'vi' ? 'Người đại diện' : 'Representative',
      icon: User
    },
    {
      id: 3,
      label: language === 'vi' ? 'Liên hệ' : 'Contact',
      icon: Phone
    }
  ];

  // Compress image before storing
  const compressImage = (file, maxWidth = 1200, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        // For non-image files (PDF, etc), read as is but with size limit
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if image is too large
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (field, file, step) => {
    if (!file) return;
    
    try {
      // Compress image before storing
      const compressedDataUrl = await compressImage(file);
      
      // Store both file name and compressed data
      const fileData = {
        name: file.name,
        data: compressedDataUrl,
        size: file.size,
        type: file.type
      };
      
      if (step === 0) {
        setStep1Data({ ...step1Data, [field]: fileData });
      } else if (step === 2) {
        setStep3Data({ ...step3Data, [field]: fileData });
      }
      
      // Show success message for this specific field
      setUploadSuccess(field);
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Lỗi khi xử lý file. Vui lòng thử lại với file có kích thước nhỏ hơn.');
    }
  };

  const handleNext = () => {
    // Validate current step
    if (!validateStep(currentStep)) {
      return;
    }
    
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps completed
      submitVerification();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!step1Data.businessLicense || !step1Data.licenseNumber || !step1Data.issueDate) {
          alert(language === 'vi' 
            ? 'Vui lòng điền đầy đủ thông tin và tải lên giấy phép kinh doanh'
            : 'Please fill in all required fields and upload business license');
          return false;
        }
        break;
      case 1:
        if (!step2Data.companyName || !step2Data.taxCode || !step2Data.industry) {
          alert(language === 'vi' 
            ? 'Vui lòng điền đầy đủ thông tin doanh nghiệp'
            : 'Please fill in all required company information');
          return false;
        }
        break;
      case 2:
        if (!step3Data.representativeName || !step3Data.idNumber || !step3Data.idFrontImage) {
          alert(language === 'vi' 
            ? 'Vui lòng điền đầy đủ thông tin người đại diện'
            : 'Please fill in all required representative information');
          return false;
        }
        break;
      case 3:
        if (!step4Data.address || !step4Data.phone || !step4Data.email) {
          alert(language === 'vi' 
            ? 'Vui lòng điền đầy đủ thông tin liên hệ'
            : 'Please fill in all required contact information');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const submitVerification = () => {
    const verificationData = {
      step1: step1Data,
      step2: step2Data,
      step3: step3Data,
      step4: step4Data,
      submittedAt: new Date().toISOString()
    };
    
    console.log('Verification submitted:', verificationData);
    
    try {
      // Save to localStorage (in production, send to API)
      localStorage.setItem('companyVerificationStatus', 'pending');
      localStorage.setItem('companyVerificationData', JSON.stringify(verificationData));
      
      // Mark all steps as completed
      setCompletedSteps([0, 1, 2, 3]);
      setCurrentStep(4); // Show completion screen
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        alert(language === 'vi'
          ? 'Lỗi: Dung lượng lưu trữ không đủ. Vui lòng sử dụng ảnh có kích thước nhỏ hơn hoặc xóa dữ liệu cũ.'
          : 'Error: Storage quota exceeded. Please use smaller images or clear old data.');
      } else {
        alert(language === 'vi'
          ? 'Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.'
          : 'An error occurred while saving data. Please try again.');
      }
      console.error('Error saving verification data:', error);
    }
  };

  const goToDashboard = () => {
    navigate('/employer/dashboard');
  };

  if (currentStep === 4) {
    return (
      <DashboardLayout role="employer">
        <VerificationContainer>
          <CompletionCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="success-icon">
              <CheckCircle />
            </div>
            <h2>{language === 'vi' ? '🎉 Hoàn Tất Xác Thực!' : '🎉 Verification Complete!'}</h2>
            <p>
              {language === 'vi' 
                ? 'Hồ sơ công ty của bạn đã được gửi thành công. Chúng tôi sẽ xem xét và phê duyệt trong vòng 24-48 giờ. Sau khi được phê duyệt, bạn có thể bắt đầu đăng tin tuyển dụng.'
                : 'Your company profile has been submitted successfully. We will review and approve within 24-48 hours. Once approved, you can start posting job listings.'}
            </p>
            <Button onClick={goToDashboard}>
              {language === 'vi' ? 'Về trang chủ' : 'Go to Dashboard'}
            </Button>
          </CompletionCard>
        </VerificationContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employer" key={language}>
      <VerificationContainer>
        <Header>
          <h1>{language === 'vi' ? 'Xác Thực Hồ Sơ Công Ty' : 'Company Verification'}</h1>
          <p>{language === 'vi' 
            ? 'Hoàn tất 4 bước để xác thực công ty và bắt đầu đăng tin tuyển dụng'
            : 'Complete 4 steps to verify your company and start posting jobs'}</p>
        </Header>

        <StepperContainer>
          {steps.map((step, index) => (
            <Step
              key={step.id}
              $active={currentStep === index}
              $completed={completedSteps.includes(index)}
              $clickable={completedSteps.includes(index)}
              onClick={() => completedSteps.includes(index) && setCurrentStep(index)}
            >
              <div className="step-circle">
                {completedSteps.includes(index) ? (
                  <CheckCircle size={20} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="step-label">{step.label}</div>
            </Step>
          ))}
        </StepperContainer>

        <AnimatePresence mode="wait">
          {/* Step 1: Business License */}
          {currentStep === 0 && (
            <FormCard
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormTitle>
                <div className="icon">
                  <FileText />
                </div>
                <h2>{language === 'vi' ? 'Giấy Phép Kinh Doanh' : 'Business License'}</h2>
              </FormTitle>

              <InfoBox>
                <AlertCircle />
                <div className="info-content">
                  <p><strong>{language === 'vi' ? 'Lưu ý:' : 'Note:'}</strong></p>
                  <p>{language === 'vi' 
                    ? '• Tải lên bản scan rõ nét của Giấy phép ĐKKD hoặc Giấy chứng nhận đăng ký doanh nghiệp'
                    : '• Upload a clear scan of your Business Registration Certificate'}</p>
                  <p>{language === 'vi' 
                    ? '• Định dạng: PDF, JPG, PNG (tối đa 5MB)'
                    : '• Format: PDF, JPG, PNG (max 5MB)'}</p>
                </div>
              </InfoBox>

              <FormGroup>
                <Label>{language === 'vi' ? 'Tải lên Giấy phép kinh doanh' : 'Upload Business License'} *</Label>
                <FileUploadArea 
                  $hasFile={!!step1Data.businessLicense}
                  onClick={() => document.getElementById('businessLicenseFile').click()}
                >
                  <Upload className="upload-icon" />
                  <div className="upload-text">
                    {step1Data.businessLicense?.name
                      ? `✓ ${step1Data.businessLicense.name}`
                      : (language === 'vi' ? 'Nhấn để chọn file' : 'Click to select file')}
                  </div>
                  <div className="upload-hint">PDF, JPG, PNG (max 5MB)</div>
                  <input
                    id="businessLicenseFile"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('businessLicense', e.target.files[0], 0)}
                  />
                </FileUploadArea>
                <AnimatePresence>
                  {uploadSuccess === 'businessLicense' && (
                    <SuccessMessage
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <CheckCircle />
                      {language === 'vi' ? 'Tải file thành công!' : 'File uploaded successfully!'}
                    </SuccessMessage>
                  )}
                </AnimatePresence>
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Số giấy phép' : 'License Number'} *</Label>
                <Input
                  type="text"
                  value={step1Data.licenseNumber}
                  onChange={(e) => setStep1Data({ ...step1Data, licenseNumber: e.target.value })}
                  placeholder={language === 'vi' ? 'Nhập số giấy phép' : 'Enter license number'}
                  required
                />
              </FormGroup>

              <FormGrid>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Ngày cấp' : 'Issue Date'} *</Label>
                  <Input
                    type="date"
                    value={step1Data.issueDate}
                    onChange={(e) => setStep1Data({ ...step1Data, issueDate: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Ngày hết hạn (nếu có)' : 'Expiry Date (if any)'}</Label>
                  <Input
                    type="date"
                    value={step1Data.expiryDate}
                    onChange={(e) => setStep1Data({ ...step1Data, expiryDate: e.target.value })}
                  />
                </FormGroup>
              </FormGrid>

              <FormGroup>
                <Label>{language === 'vi' ? 'Cơ quan cấp' : 'Issuing Authority'} *</Label>
                <Input
                  type="text"
                  value={step1Data.issuingAuthority}
                  onChange={(e) => setStep1Data({ ...step1Data, issuingAuthority: e.target.value })}
                  placeholder={language === 'vi' ? 'VD: Sở KH&ĐT TP.HCM' : 'E.g.: Department of Planning and Investment'}
                  required
                />
              </FormGroup>

              <ButtonGroup>
                <Button $variant="secondary" onClick={() => navigate('/employer/dashboard')}>
                  <ArrowLeft size={18} />
                  {language === 'vi' ? 'Về trang chủ' : 'Back to Dashboard'}
                </Button>
                <Button $variant="primary" onClick={handleNext}>
                  {language === 'vi' ? 'Tiếp theo' : 'Next'}
                  <ArrowRight size={18} />
                </Button>
              </ButtonGroup>
            </FormCard>
          )}

          {/* Step 2: Company Information */}
          {currentStep === 1 && (
            <FormCard
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormTitle>
                <div className="icon">
                  <Building />
                </div>
                <h2>{language === 'vi' ? 'Thông Tin Doanh Nghiệp' : 'Company Information'}</h2>
              </FormTitle>

              <FormGrid>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Tên công ty (Tiếng Việt)' : 'Company Name (Vietnamese)'} *</Label>
                  <Input
                    type="text"
                    value={step2Data.companyName}
                    onChange={(e) => setStep2Data({ ...step2Data, companyName: e.target.value })}
                    placeholder={language === 'vi' ? 'Công ty TNHH ABC' : 'ABC Company Ltd.'}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Tên công ty (Tiếng Anh)' : 'Company Name (English)'}</Label>
                  <Input
                    type="text"
                    value={step2Data.companyNameEn}
                    onChange={(e) => setStep2Data({ ...step2Data, companyNameEn: e.target.value })}
                    placeholder="ABC Company Limited"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Mã số thuế' : 'Tax Code'} *</Label>
                  <Input
                    type="text"
                    value={step2Data.taxCode}
                    onChange={(e) => setStep2Data({ ...step2Data, taxCode: e.target.value })}
                    placeholder="0123456789"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Năm thành lập' : 'Founded Year'} *</Label>
                  <Input
                    type="number"
                    value={step2Data.foundedYear}
                    onChange={(e) => setStep2Data({ ...step2Data, foundedYear: e.target.value })}
                    placeholder="2020"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Ngành nghề' : 'Industry'} *</Label>
                  <Input
                    type="text"
                    value={step2Data.industry}
                    onChange={(e) => setStep2Data({ ...step2Data, industry: e.target.value })}
                    placeholder={language === 'vi' ? 'Công nghệ thông tin' : 'Information Technology'}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Quy mô công ty' : 'Company Size'} *</Label>
                  <Input
                    type="text"
                    value={step2Data.companySize}
                    onChange={(e) => setStep2Data({ ...step2Data, companySize: e.target.value })}
                    placeholder={language === 'vi' ? '50-200 nhân viên' : '50-200 employees'}
                    required
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <Label>{language === 'vi' ? 'Website' : 'Website'}</Label>
                  <Input
                    type="url"
                    value={step2Data.website}
                    onChange={(e) => setStep2Data({ ...step2Data, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <Label>{language === 'vi' ? 'Mô tả công ty' : 'Company Description'} *</Label>
                  <TextArea
                    value={step2Data.description}
                    onChange={(e) => setStep2Data({ ...step2Data, description: e.target.value })}
                    placeholder={language === 'vi' 
                      ? 'Mô tả ngắn gọn về công ty, lĩnh vực hoạt động, sản phẩm/dịch vụ chính...'
                      : 'Brief description about your company, business field, main products/services...'}
                    rows={5}
                    required
                  />
                </FormGroup>
              </FormGrid>

              <ButtonGroup>
                <Button $variant="secondary" onClick={handleBack}>
                  <ArrowLeft size={18} />
                  {language === 'vi' ? 'Quay lại' : 'Back'}
                </Button>
                <Button $variant="primary" onClick={handleNext}>
                  {language === 'vi' ? 'Tiếp theo' : 'Next'}
                  <ArrowRight size={18} />
                </Button>
              </ButtonGroup>
            </FormCard>
          )}

          {/* Step 3: Representative Information */}
          {currentStep === 2 && (
            <FormCard
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormTitle>
                <div className="icon">
                  <User />
                </div>
                <h2>{language === 'vi' ? 'Thông Tin Người Đại Diện' : 'Representative Information'}</h2>
              </FormTitle>

              <InfoBox>
                <AlertCircle />
                <div className="info-content">
                  <p><strong>{language === 'vi' ? 'Yêu cầu:' : 'Requirements:'}</strong></p>
                  <p>{language === 'vi' 
                    ? '• Người đại diện phải là Giám đốc hoặc được ủy quyền hợp pháp'
                    : '• Representative must be Director or legally authorized'}</p>
                  <p>{language === 'vi' 
                    ? '• Tải lên ảnh CMND/CCCD 2 mặt và giấy ủy quyền (nếu có)'
                    : '• Upload ID card (both sides) and authorization letter (if applicable)'}</p>
                </div>
              </InfoBox>

              <FormGrid>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Họ và tên' : 'Full Name'} *</Label>
                  <Input
                    type="text"
                    value={step3Data.representativeName}
                    onChange={(e) => setStep3Data({ ...step3Data, representativeName: e.target.value })}
                    placeholder={language === 'vi' ? 'Nguyễn Hùng Anh' : 'John Doe'}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Chức vụ' : 'Position'} *</Label>
                  <Input
                    type="text"
                    value={step3Data.position}
                    onChange={(e) => setStep3Data({ ...step3Data, position: e.target.value })}
                    placeholder={language === 'vi' ? 'Giám đốc' : 'Director'}
                    required
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <Label>{language === 'vi' ? 'Số CMND/CCCD' : 'ID Number'} *</Label>
                  <Input
                    type="text"
                    value={step3Data.idNumber}
                    onChange={(e) => setStep3Data({ ...step3Data, idNumber: e.target.value })}
                    placeholder="012345678901"
                    required
                  />
                </FormGroup>
              </FormGrid>

              <FormGroup>
                <Label>{language === 'vi' ? 'Ảnh CMND/CCCD mặt trước' : 'ID Card Front Image'} *</Label>
                <FileUploadArea 
                  $hasFile={!!step3Data.idFrontImage}
                  onClick={() => document.getElementById('idFrontImage').click()}
                >
                  <Upload className="upload-icon" />
                  <div className="upload-text">
                    {step3Data.idFrontImage?.name
                      ? `✓ ${step3Data.idFrontImage.name}`
                      : (language === 'vi' ? 'Tải lên mặt trước CMND/CCCD' : 'Upload ID card front')}
                  </div>
                  <div className="upload-hint">JPG, PNG (max 5MB)</div>
                  <input
                    id="idFrontImage"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('idFrontImage', e.target.files[0], 2)}
                  />
                </FileUploadArea>
                <AnimatePresence>
                  {uploadSuccess === 'idFrontImage' && (
                    <SuccessMessage
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <CheckCircle />
                      {language === 'vi' ? 'Tải ảnh thành công!' : 'Image uploaded successfully!'}
                    </SuccessMessage>
                  )}
                </AnimatePresence>
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Ảnh CMND/CCCD mặt sau' : 'ID Card Back Image'} *</Label>
                <FileUploadArea 
                  $hasFile={!!step3Data.idBackImage}
                  onClick={() => document.getElementById('idBackImage').click()}
                >
                  <Upload className="upload-icon" />
                  <div className="upload-text">
                    {step3Data.idBackImage?.name
                      ? `✓ ${step3Data.idBackImage.name}`
                      : (language === 'vi' ? 'Tải lên mặt sau CMND/CCCD' : 'Upload ID card back')}
                  </div>
                  <div className="upload-hint">JPG, PNG (max 5MB)</div>
                  <input
                    id="idBackImage"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('idBackImage', e.target.files[0], 2)}
                  />
                </FileUploadArea>
                <AnimatePresence>
                  {uploadSuccess === 'idBackImage' && (
                    <SuccessMessage
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <CheckCircle />
                      {language === 'vi' ? 'Tải ảnh thành công!' : 'Image uploaded successfully!'}
                    </SuccessMessage>
                  )}
                </AnimatePresence>
              </FormGroup>

              <FormGroup>
                <Label>{language === 'vi' ? 'Giấy ủy quyền (nếu có)' : 'Authorization Letter (if any)'}</Label>
                <FileUploadArea 
                  $hasFile={!!step3Data.authorizationLetter}
                  onClick={() => document.getElementById('authorizationLetter').click()}
                >
                  <Upload className="upload-icon" />
                  <div className="upload-text">
                    {step3Data.authorizationLetter?.name
                      ? `✓ ${step3Data.authorizationLetter.name}`
                      : (language === 'vi' ? 'Tải lên giấy ủy quyền' : 'Upload authorization letter')}
                  </div>
                  <div className="upload-hint">PDF, JPG, PNG (max 5MB)</div>
                  <input
                    id="authorizationLetter"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('authorizationLetter', e.target.files[0], 2)}
                  />
                </FileUploadArea>
                <AnimatePresence>
                  {uploadSuccess === 'authorizationLetter' && (
                    <SuccessMessage
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <CheckCircle />
                      {language === 'vi' ? 'Tải file thành công!' : 'File uploaded successfully!'}
                    </SuccessMessage>
                  )}
                </AnimatePresence>
              </FormGroup>

              <ButtonGroup>
                <Button $variant="secondary" onClick={handleBack}>
                  <ArrowLeft size={18} />
                  {language === 'vi' ? 'Quay lại' : 'Back'}
                </Button>
                <Button $variant="primary" onClick={handleNext}>
                  {language === 'vi' ? 'Tiếp theo' : 'Next'}
                  <ArrowRight size={18} />
                </Button>
              </ButtonGroup>
            </FormCard>
          )}

          {/* Step 4: Contact Information */}
          {currentStep === 3 && (
            <FormCard
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormTitle>
                <div className="icon">
                  <Phone />
                </div>
                <h2>{language === 'vi' ? 'Thông Tin Liên Hệ' : 'Contact Information'}</h2>
              </FormTitle>

              <FormGroup style={{ gridColumn: '1 / -1' }}>
                <Label>{language === 'vi' ? 'Địa chỉ trụ sở chính' : 'Head Office Address'} *</Label>
                <TextArea
                  value={step4Data.address}
                  onChange={(e) => setStep4Data({ ...step4Data, address: e.target.value })}
                  placeholder={language === 'vi' 
                    ? '123 Đường ABC, Phường XYZ'
                    : '123 ABC Street, XYZ Ward'}
                  rows={3}
                  required
                />
              </FormGroup>

              <FormGrid>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Tỉnh/Thành phố' : 'City/Province'} *</Label>
                  <Input
                    type="text"
                    value={step4Data.city}
                    onChange={(e) => setStep4Data({ ...step4Data, city: e.target.value })}
                    placeholder={language === 'vi' ? 'TP. Hồ Chí Minh' : 'Ho Chi Minh City'}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Quận/Huyện' : 'District'} *</Label>
                  <Input
                    type="text"
                    value={step4Data.district}
                    onChange={(e) => setStep4Data({ ...step4Data, district: e.target.value })}
                    placeholder={language === 'vi' ? 'Quận 1' : 'District 1'}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Phường/Xã' : 'Ward'} *</Label>
                  <Input
                    type="text"
                    value={step4Data.ward}
                    onChange={(e) => setStep4Data({ ...step4Data, ward: e.target.value })}
                    placeholder={language === 'vi' ? 'Phường Bến Nghé' : 'Ben Nghe Ward'}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Số điện thoại' : 'Phone Number'} *</Label>
                  <Input
                    type="tel"
                    value={step4Data.phone}
                    onChange={(e) => setStep4Data({ ...step4Data, phone: e.target.value })}
                    placeholder="028 1234 5678"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Email liên hệ' : 'Contact Email'} *</Label>
                  <Input
                    type="email"
                    value={step4Data.email}
                    onChange={(e) => setStep4Data({ ...step4Data, email: e.target.value })}
                    placeholder="hr@company.com"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Người liên hệ khẩn cấp' : 'Emergency Contact'}</Label>
                  <Input
                    type="text"
                    value={step4Data.emergencyContact}
                    onChange={(e) => setStep4Data({ ...step4Data, emergencyContact: e.target.value })}
                    placeholder={language === 'vi' ? 'Nguyễn Văn B' : 'Jane Doe'}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'SĐT khẩn cấp' : 'Emergency Phone'}</Label>
                  <Input
                    type="tel"
                    value={step4Data.emergencyPhone}
                    onChange={(e) => setStep4Data({ ...step4Data, emergencyPhone: e.target.value })}
                    placeholder="090 123 4567"
                  />
                </FormGroup>
              </FormGrid>

              <ButtonGroup>
                <Button $variant="secondary" onClick={handleBack}>
                  <ArrowLeft size={18} />
                  {language === 'vi' ? 'Quay lại' : 'Back'}
                </Button>
                <Button $variant="success" onClick={handleNext}>
                  <CheckCircle size={18} />
                  {language === 'vi' ? 'Hoàn tất & Gửi xác thực' : 'Complete & Submit'}
                </Button>
              </ButtonGroup>
            </FormCard>
          )}
        </AnimatePresence>
      </VerificationContainer>
    </DashboardLayout>
  );
};

export default CompanyVerification;
