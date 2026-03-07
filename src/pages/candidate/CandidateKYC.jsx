import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { Button, Input, FormGroup, Label } from '../../components/FormElements';
import { 
  CheckCircle, 
  Upload, 
  CreditCard, 
  Phone,
  Camera,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Mail,
  Shield
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const VerificationContainer = styled.div`
  width: 100%;
  max-width: min(900px, 100%);
  margin: 0 auto;
  padding: 0 clamp(12px, 3vw, 24px);
  box-sizing: border-box;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: clamp(28px, 5vw, 48px);
  
  .header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: clamp(52px, 7vw, 72px);
    height: clamp(52px, 7vw, 72px);
    background: ${props => props.theme.colors.primary};
    border-radius: 18px;
    margin-bottom: 16px;
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.25);
    animation: float 3s ease-in-out infinite;
    
    svg {
      width: clamp(24px, 3.5vw, 36px);
      height: clamp(24px, 3.5vw, 36px);
      color: white;
    }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  
  h1 {
    font-size: clamp(20px, 3.5vw, 32px);
    font-weight: 800;
    margin-bottom: 10px;
    color: ${props => props.theme.colors.text};
    letter-spacing: -0.5px;
  }
  
  p {
    font-size: clamp(13px, 1.6vw, 16px);
    color: ${props => props.theme.colors.textLight};
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.65;
  }
`;

const StepperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: clamp(28px, 5vw, 48px);
  position: relative;
  padding: 0 clamp(8px, 2vw, 20px);
  
  &::before {
    content: '';
    position: absolute;
    top: clamp(18px, 2.5vw, 28px);
    left: 12%;
    right: 12%;
    height: 3px;
    background: ${props => props.theme.colors.borderLight};
    z-index: 0;
    border-radius: 10px;
  }
`;

const ProgressLine = styled(motion.div)`
  position: absolute;
  top: clamp(18px, 2.5vw, 28px);
  left: 12%;
  height: 3px;
  background: ${props => props.theme.colors.primary};
  z-index: 0;
  border-radius: 10px;
  box-shadow: 0 0 16px rgba(30, 64, 175, 0.4);
`;

const Step = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex: 1;
  position: relative;
  z-index: 1;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: ${props => props.$clickable ? 'translateY(-4px)' : 'none'};
  }
  
  .step-circle {
    width: clamp(36px, 4.5vw, 52px);
    height: clamp(36px, 4.5vw, 52px);
    border-radius: 50%;
    background: ${props => {
      if (props.$completed) return props.theme.colors.success;
      if (props.$active) return props.theme.colors.primary;
      return props.theme.colors.bgLight;
    }};
    border: ${props => {
      if (props.$completed) return `2.5px solid ${props.theme.colors.success}`;
      if (props.$active) return `2.5px solid ${props.theme.colors.primary}`;
      return `2.5px solid ${props.theme.colors.border}`;
    }};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => (props.$completed || props.$active) ? 'white' : props.theme.colors.textLight};
    font-weight: 800;
    font-size: clamp(13px, 1.5vw, 17px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${props => {
      if (props.$completed || props.$active) {
        return `0 8px 24px ${props.$active ? 'rgba(30, 64, 175, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`;
      }
      return '0 2px 8px rgba(0, 0, 0, 0.05)';
    }};
    position: relative;
    
    svg {
      width: clamp(16px, 2vw, 24px);
      height: clamp(16px, 2vw, 24px);
    }
    
    ${props => props.$active && `
      animation: pulse 2s ease-in-out infinite;
    `}
  }
  
  @keyframes pulse {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 8px 24px rgba(30, 64, 175, 0.35);
    }
    50% { 
      transform: scale(1.05);
      box-shadow: 0 12px 32px rgba(30, 64, 175, 0.45);
    }
  }
  
  .step-label {
    font-size: clamp(10px, 1.2vw, 13px);
    font-weight: 700;
    color: ${props => {
      if (props.$completed) return props.theme.colors.success;
      if (props.$active) return props.theme.colors.primary;
      return props.theme.colors.textLight;
    }};
    text-align: center;
    transition: all 0.3s ease;
    max-width: clamp(60px, 10vw, 100px);
    line-height: 1.3;

    @media (max-width: 480px) {
      display: none;
    }
  }
`;

const FormCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: clamp(14px, 2vw, 22px);
  padding: clamp(20px, 4vw, 40px) clamp(16px, 4vw, 40px);
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.07);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.theme.colors.primary};
  }
`;

const FormTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  padding-bottom: 28px;
  border-bottom: 2px solid ${props => props.theme.colors.borderLight};
  position: relative;
  
  .icon {
    width: clamp(40px, 5vw, 52px);
    height: clamp(40px, 5vw, 52px);
    border-radius: 14px;
    background: ${props => props.theme.colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 6px 18px rgba(30, 64, 175, 0.25);
    flex-shrink: 0;
    
    svg {
      width: clamp(20px, 2.5vw, 26px);
      height: clamp(20px, 2.5vw, 26px);
    }
  }
  
  h2 {
    font-size: clamp(16px, 2.5vw, 22px);
    font-weight: 800;
    color: ${props => props.theme.colors.text};
    letter-spacing: -0.3px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(14px, 2.5vw, 24px);
  margin-bottom: clamp(14px, 2.5vw, 24px);
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
  
  .full-width {
    grid-column: 1 / -1;
  }
`;

const FileUploadArea = styled.div`
  border: 3px dashed ${props => props.$hasFile ? props.theme.colors.success : props.theme.colors.border};
  border-radius: 20px;
  padding: clamp(16px, 3vw, 28px) clamp(12px, 2.5vw, 20px);
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.$hasFile ? props.theme.colors.success + '08' : props.theme.colors.bgDark};
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}0a;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(30, 64, 175, 0.13);
    .upload-icon { transform: scale(1.08) translateY(-3px); }
  }
  
  &:active { transform: translateY(0); }
  
  .upload-icon {
    width: clamp(32px, 4vw, 44px);
    height: clamp(32px, 4vw, 44px);
    margin: 0 auto clamp(8px, 1.5vw, 14px);
    color: ${props => props.$hasFile ? props.theme.colors.success : props.theme.colors.primary};
    transition: all 0.3s ease;
  }
  
  .upload-text {
    font-size: clamp(12px, 1.4vw, 15px);
    font-weight: 700;
    color: ${props => props.$hasFile ? props.theme.colors.success : props.theme.colors.text};
    margin-bottom: 6px;
  }
  
  .upload-hint {
    font-size: clamp(11px, 1.2vw, 13px);
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
  }
  
  img {
    max-width: 100%;
    max-height: clamp(100px, 15vw, 160px);
    object-fit: contain;
    margin-top: 12px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.09);
  }
  
  input[type="file"] { display: none; }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: clamp(10px, 2vw, 16px);
  margin-top: clamp(20px, 3.5vw, 36px);
  
  button {
    flex: 1;
    min-height: clamp(42px, 5vw, 50px);
    font-size: clamp(13px, 1.5vw, 15px);
    font-weight: 700;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.14);
    }
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const InfoBox = styled(motion.div)`
  background: ${props => props.theme.colors.primary}08;
  border: 2px solid ${props => props.theme.colors.primary}30;
  border-left: 5px solid ${props => props.theme.colors.primary};
  padding: clamp(12px, 2vw, 18px) clamp(14px, 2.5vw, 22px);
  border-radius: 14px;
  margin-bottom: clamp(18px, 3vw, 28px);
  display: flex;
  gap: 12px;
  box-shadow: 0 3px 10px rgba(30, 64, 175, 0.07);
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.primary};
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .info-content {
    flex: 1;
    
    p {
      font-size: clamp(12px, 1.3vw, 14px);
      color: ${props => props.theme.colors.text};
      line-height: 1.65;
      margin-bottom: 6px;
      &:last-child { margin-bottom: 0; }
    }
    
    strong {
      font-weight: 700;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const VerifiedContainer = styled(motion.div)`
  text-align: center;
  padding: clamp(32px, 6vw, 56px) clamp(16px, 4vw, 40px);
  
  .verified-icon-wrapper {
    width: clamp(80px, 10vw, 110px);
    height: clamp(80px, 10vw, 110px);
    margin: 0 auto clamp(16px, 3vw, 24px);
    background: ${props => props.theme.colors.success}15;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      inset: -12px;
      border: 3px solid ${props => props.theme.colors.success}30;
      border-radius: 50%;
      animation: ripple 2s ease-out infinite;
    }
    
    svg {
      color: ${props => props.theme.colors.success};
      filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.3));
    }
  }
  
  @keyframes ripple {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
  
  h3 {
    font-size: clamp(16px, 2.5vw, 22px);
    font-weight: 800;
    color: ${props => props.theme.colors.success};
    margin-bottom: 10px;
    letter-spacing: -0.3px;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    max-width: 460px;
    margin: 0 auto;
    line-height: 1.65;
    font-size: clamp(13px, 1.4vw, 15px);
  }
`;

const CompletionCard = styled(motion.div)`
  background: ${props => props.theme.colors.success};
  border-radius: clamp(16px, 2.5vw, 24px);
  padding: clamp(40px, 7vw, 64px) clamp(20px, 5vw, 48px);
  text-align: center;
  color: white;
  box-shadow: 0 16px 48px rgba(16, 185, 129, 0.28);
  position: relative;
  overflow: hidden;
  
  .success-icon {
    width: clamp(64px, 9vw, 88px);
    height: clamp(64px, 9vw, 88px);
    margin: 0 auto clamp(20px, 3vw, 28px);
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    position: relative;
    animation: bounce 2s ease-in-out infinite;
    
    svg {
      width: 52px;
      height: 52px;
    }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  
  h2 {
    font-size: clamp(20px, 3.5vw, 32px);
    font-weight: 900;
    margin-bottom: 16px;
    letter-spacing: -0.5px;
  }
  
  p {
    font-size: clamp(13px, 1.6vw, 16px);
    opacity: 0.94;
    margin-bottom: clamp(24px, 4vw, 36px);
    line-height: 1.7;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }
  
  button {
    background: white;
    color: ${props => props.theme.colors.success};
    font-weight: 800;
    padding: clamp(12px, 1.5vw, 15px) clamp(24px, 4vw, 36px);
    border-radius: 12px;
    font-size: clamp(13px, 1.5vw, 15px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.14);
    transition: all 0.3s ease;
    &:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.18); }
  }
`;

const VideoWrapper = styled.div`
  width: 100%;
  max-width: min(420px, 100%);
  margin: 0 auto;
  border-radius: clamp(14px, 2vw, 20px);
  overflow: hidden;
  background: #1a1a2e;
  aspect-ratio: 4/3;
  position: relative;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.18);
  border: 3px solid ${props => props.theme.colors.border};
  
  video, img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const VerificationMethodButton = styled(motion.button)`
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary + '10' : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CandidateKYC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([0]);
  const videoRef = useRef(null);
  
  const [step1Data, setStep1Data] = useState({
    idNumber: '',
    idIssueDate: '',
    idIssuePlace: '',
    idFrontImage: null,
    idBackImage: null,
  });
  
  const [step2Data, setStep2Data] = useState({
    verificationValue: '',
    verificationCode: '',
    codeSent: false
  });
  
  const [step3Data, setStep3Data] = useState({
    facePhoto: null,
  });

  const steps = [
    {
      id: 0,
      label: language === 'vi' ? 'Xác minh Email' : 'Email Verification',
      icon: Mail
    },
    {
      id: 1,
      label: language === 'vi' ? 'Xác minh SĐT' : 'Phone Verification',
      icon: Phone
    },
    {
      id: 2,
      label: language === 'vi' ? 'Xác minh CCCD' : 'ID Verification',
      icon: CreditCard
    },
    {
      id: 3,
      label: language === 'vi' ? 'Xác minh khuôn mặt' : 'Face Verification',
      icon: Camera
    }
  ];

  const getProgress = () => {
    if (completedSteps.length === 0 && currentStep === 0) return 0;
    return (completedSteps.length / steps.length) * 100;
  };

  const handleFileUpload = (field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setStep1Data(prev => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      submitKYC();
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
        return true; // Already verified
      case 1:
        if (!step2Data.verificationValue || !step2Data.verificationCode) {
          alert(language === 'vi' 
            ? 'Vui lòng nhập số điện thoại và mã xác minh'
            : 'Please enter phone number and verification code');
          return false;
        }
        break;
      case 2:
        if (!step1Data.idNumber || !step1Data.idIssueDate || !step1Data.idIssuePlace || !step1Data.idFrontImage || !step1Data.idBackImage) {
          alert(language === 'vi' 
            ? 'Vui lòng điền đầy đủ thông tin CCCD/CMND và tải lên ảnh 2 mặt'
            : 'Please fill in all ID information and upload both front and back images');
          return false;
        }
        break;
      case 3:
        if (!step3Data.facePhoto) {
          alert(language === 'vi' 
            ? 'Vui lòng chụp ảnh khuôn mặt để xác minh'
            : 'Please capture a face photo for verification');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const submitKYC = () => {
    const kycData = {
      completed: true,
      formData: {
        ...step1Data,
        emailVerified: true,
        phoneVerified: true,
        phoneNumber: step2Data.verificationValue,
        facePhoto: step3Data.facePhoto
      },
      submittedAt: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('candidateKYC', JSON.stringify(kycData));
      setCompletedSteps([0, 1, 2, 3]);
      setCurrentStep(4); // Show completion screen
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        alert(language === 'vi'
          ? 'Lỗi: Dung lượng lưu trữ không đủ. Vui lòng sử dụng ảnh nhỏ hơn.'
          : 'Error: Storage quota exceeded. Please use smaller images.');
      } else {
        alert(language === 'vi'
          ? 'Đã xảy ra lỗi. Vui lòng thử lại.'
          : 'An error occurred. Please try again.');
      }
      console.error('Error saving KYC data:', error);
    }
  };

  const sendVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    setStep2Data(prev => ({ ...prev, codeSent: true }));
    alert(language === 'vi' 
      ? `Mã xác minh của bạn: ${code}` 
      : `Your verification code: ${code}`
    );
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      const video = document.getElementById('kycVideo');
      if (video) {
        video.srcObject = stream;
      }
    } catch (error) {
      alert(language === 'vi' ? 'Không thể truy cập camera' : 'Cannot access camera');
    }
  };

  const capturePhoto = () => {
    const video = document.getElementById('kycVideo');
    if (video && video.srcObject) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const photo = canvas.toDataURL('image/jpeg', 0.8);
      setStep3Data({ facePhoto: photo });
      // Stop camera
      video.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const goToProfile = () => {
    navigate('/candidate/profile');
  };

  // Completion screen
  if (currentStep === 4) {
    return (
      <DashboardLayout role="candidate">
        <VerificationContainer>
          <CompletionCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="success-icon">
              <CheckCircle />
            </div>
            <h2>{language === 'vi' ? '🎉 Xác Minh eKYC Hoàn Tất!' : '🎉 eKYC Verification Complete!'}</h2>
            <p>
              {language === 'vi' 
                ? 'Hồ sơ xác minh của bạn đã được gửi thành công. Tài khoản của bạn đã được xác minh và bạn có thể bắt đầu ứng tuyển các công việc.'
                : 'Your verification profile has been submitted successfully. Your account is now verified and you can start applying for jobs.'}
            </p>
            <Button onClick={goToProfile}>
              {language === 'vi' ? 'Về Hồ Sơ' : 'Go to Profile'}
            </Button>
          </CompletionCard>
        </VerificationContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="candidate">
      <VerificationContainer>
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-icon">
            <Shield />
          </div>
          <h1>
            {language === 'vi' ? 'Xác Minh eKYC' : 'eKYC Verification'}
          </h1>
          <p>{language === 'vi' 
            ? 'Hoàn tất 4 bước để xác minh danh tính và bắt đầu ứng tuyển công việc'
            : 'Complete 4 steps to verify your identity and start applying for jobs'}</p>
        </Header>

        <StepperContainer>
          <ProgressLine 
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          {steps.map((step, index) => (
            <Step
              key={step.id}
              $active={currentStep === index}
              $completed={completedSteps.includes(index)}
              $clickable={completedSteps.includes(index)}
              onClick={() => completedSteps.includes(index) && setCurrentStep(index)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={completedSteps.includes(index) ? { scale: 1.05 } : {}}
            >
              <motion.div 
                className="step-circle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2, type: "spring" }}
              >
                {completedSteps.includes(index) ? (
                  <CheckCircle size={24} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              <div className="step-label">{step.label}</div>
            </Step>
          ))}
        </StepperContainer>

        <AnimatePresence mode="wait">
          {/* Step 1: Email Verification */}
          {currentStep === 0 && (
            <FormCard
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormTitle>
                <div className="icon">
                  <Mail />
                </div>
                <h2>{language === 'vi' ? 'Xác Minh Email' : 'Email Verification'}</h2>
              </FormTitle>

              <VerifiedContainer
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="verified-icon-wrapper">
                  <CheckCircle size={72} />
                </div>
                <h3>
                  {language === 'vi' ? 'Email đã được xác minh!' : 'Email Verified!'}
                </h3>
                <p>
                  {language === 'vi' 
                    ? 'Email của bạn đã được xác minh tự động khi đăng ký tài khoản. Bạn có thể tiếp tục phần xác minh danh tính.' 
                    : 'Your email has been automatically verified during registration. You can proceed with identity verification.'}
                </p>
              </VerifiedContainer>

              <ButtonGroup>
                <Button $variant="secondary" onClick={() => navigate('/candidate/profile')}>
                  <ArrowLeft size={18} />
                  {language === 'vi' ? 'Về Hồ Sơ' : 'Back to Profile'}
                </Button>
                <Button $variant="primary" onClick={handleNext}>
                  {language === 'vi' ? 'Tiếp theo' : 'Next'}
                  <ArrowRight size={18} />
                </Button>
              </ButtonGroup>
            </FormCard>
          )}

          {/* Step 2: Phone Verification */}
          {currentStep === 1 && (
            <FormCard
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormTitle>
                <div className="icon">
                  <Phone />
                </div>
                <h2>{language === 'vi' ? 'Xác Minh Số Điện Thoại' : 'Phone Verification'}</h2>
              </FormTitle>

              <InfoBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <AlertCircle />
                <div className="info-content">
                  <p>{language === 'vi' 
                    ? 'Nhập số điện thoại của bạn, nhấn "Gửi mã" và điền mã 6 số nhận được để xác minh.'
                    : 'Enter your phone number, click "Send Code" and enter the 6-digit code to verify.'}</p>
                </div>
              </InfoBox>

              <FormGrid>
                <FormGroup className="full-width">
                  <Label>{language === 'vi' ? 'Số điện thoại' : 'Phone Number'} *</Label>
                  <Input
                    type="tel"
                    value={step2Data.verificationValue}
                    onChange={(e) => setStep2Data(prev => ({ ...prev, verificationValue: e.target.value }))}
                    placeholder="0912345678"
                    required
                  />
                </FormGroup>

                <FormGroup className="full-width">
                  <Label>{language === 'vi' ? 'Mã xác minh' : 'Verification Code'} *</Label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Input
                      value={step2Data.verificationCode}
                      onChange={(e) => setStep2Data(prev => ({ ...prev, verificationCode: e.target.value }))}
                      placeholder={language === 'vi' ? 'Nhập mã 6 số' : 'Enter 6-digit code'}
                      maxLength={6}
                      required
                      style={{ flex: 1 }}
                    />
                    <Button
                      $variant="secondary"
                      onClick={sendVerificationCode}
                      disabled={!step2Data.verificationValue}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <Mail size={16} />
                      {language === 'vi' ? 'Gửi mã' : 'Send Code'}
                    </Button>
                  </div>
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

          {/* Step 3: ID Verification */}
          {currentStep === 2 && (
            <FormCard
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormTitle>
                <div className="icon">
                  <CreditCard />
                </div>
                <h2>{language === 'vi' ? 'Xác Minh CCCD/CMND' : 'ID Card Verification'}</h2>
              </FormTitle>

              <InfoBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <AlertCircle />
                <div className="info-content">
                  <p><strong>{language === 'vi' ? 'Lưu ý:' : 'Note:'}</strong></p>
                  <p>{language === 'vi' 
                    ? '• Chụp rõ nét cả 2 mặt CCCD/CMND, không bị mờ, lóa, che khuất'
                    : '• Capture both sides of your ID card clearly, without blur, glare, or obstruction'}</p>
                  <p>{language === 'vi' 
                    ? '• Định dạng: JPG, PNG (tối đa 5MB)'
                    : '• Format: JPG, PNG (max 5MB)'}</p>
                </div>
              </InfoBox>

              <FormGrid>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Số CCCD/CMND' : 'ID Number'} *</Label>
                  <Input
                    type="text"
                    value={step1Data.idNumber}
                    onChange={(e) => setStep1Data({ ...step1Data, idNumber: e.target.value })}
                    placeholder="079202012345"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Ngày cấp' : 'Issue Date'} *</Label>
                  <Input
                    type="date"
                    value={step1Data.idIssueDate}
                    onChange={(e) => setStep1Data({ ...step1Data, idIssueDate: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup className="full-width">
                  <Label>{language === 'vi' ? 'Nơi cấp' : 'Issue Place'} *</Label>
                  <Input
                    type="text"
                    value={step1Data.idIssuePlace}
                    onChange={(e) => setStep1Data({ ...step1Data, idIssuePlace: e.target.value })}
                    placeholder={language === 'vi' ? 'VD: Cục Cảnh sát QLHC về TTXH' : 'E.g.: Police Department'}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Ảnh mặt trước CCCD' : 'ID Front Image'} *</Label>
                  <FileUploadArea 
                    $hasFile={!!step1Data.idFrontImage}
                    onClick={() => document.getElementById('idFrontFile').click()}
                  >
                    <Upload className="upload-icon" />
                    <div className="upload-text">
                      {step1Data.idFrontImage 
                        ? (language === 'vi' ? '✓ Đã tải ảnh mặt trước' : '✓ Front image uploaded')
                        : (language === 'vi' ? 'Nhấn để chọn ảnh mặt trước' : 'Click to upload front image')}
                    </div>
                    <div className="upload-hint">JPG, PNG (max 5MB)</div>
                    {step1Data.idFrontImage && (
                      <img src={step1Data.idFrontImage} alt="ID Front" />
                    )}
                    <input
                      id="idFrontFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('idFrontImage', e.target.files[0])}
                    />
                  </FileUploadArea>
                </FormGroup>

                <FormGroup>
                  <Label>{language === 'vi' ? 'Ảnh mặt sau CCCD' : 'ID Back Image'} *</Label>
                  <FileUploadArea 
                    $hasFile={!!step1Data.idBackImage}
                    onClick={() => document.getElementById('idBackFile').click()}
                  >
                    <Upload className="upload-icon" />
                    <div className="upload-text">
                      {step1Data.idBackImage 
                        ? (language === 'vi' ? '✓ Đã tải ảnh mặt sau' : '✓ Back image uploaded')
                        : (language === 'vi' ? 'Nhấn để chọn ảnh mặt sau' : 'Click to upload back image')}
                    </div>
                    <div className="upload-hint">JPG, PNG (max 5MB)</div>
                    {step1Data.idBackImage && (
                      <img src={step1Data.idBackImage} alt="ID Back" />
                    )}
                    <input
                      id="idBackFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('idBackImage', e.target.files[0])}
                    />
                  </FileUploadArea>
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

          {/* Step 4: Face Verification */}
          {currentStep === 3 && (
            <FormCard
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormTitle>
                <div className="icon">
                  <Camera />
                </div>
                <h2>{language === 'vi' ? 'Xác Minh Khuôn Mặt' : 'Face Verification'}</h2>
              </FormTitle>

              <InfoBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <AlertCircle />
                <div className="info-content">
                  <p><strong>{language === 'vi' ? 'Hướng dẫn:' : 'Instructions:'}</strong></p>
                  <p>{language === 'vi' 
                    ? '• Đảm bảo ánh sáng đầy đủ, khuôn mặt rõ ràng'
                    : '• Ensure sufficient lighting and clear face visibility'}</p>
                  <p>{language === 'vi' 
                    ? '• Nhìn thẳng vào camera, không đeo kính râm hoặc khẩu trang'
                    : '• Look directly at the camera, do not wear sunglasses or mask'}</p>
                  <p>{language === 'vi' 
                    ? '• Ảnh khuôn mặt sẽ được so sánh với ảnh trên CCCD/CMND'
                    : '• Face photo will be compared with your ID card photo'}</p>
                </div>
              </InfoBox>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                {!step3Data.facePhoto ? (
                  <>
                    <VideoWrapper>
                      <video id="kycVideo" ref={videoRef} autoPlay playsInline />
                    </VideoWrapper>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <Button $variant="secondary" onClick={startCamera}>
                        <Camera size={18} />
                        {language === 'vi' ? 'Bật Camera' : 'Start Camera'}
                      </Button>
                      <Button $variant="primary" onClick={capturePhoto}>
                        <CheckCircle size={18} />
                        {language === 'vi' ? 'Chụp Ảnh' : 'Capture Photo'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <VideoWrapper>
                      <img src={step3Data.facePhoto} alt="Face" />
                    </VideoWrapper>
                    <div style={{ marginTop: '16px' }}>
                      <Button 
                        $variant="secondary"
                        onClick={() => setStep3Data({ facePhoto: null })}
                      >
                        <Camera size={18} />
                        {language === 'vi' ? 'Chụp lại' : 'Retake'}
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <ButtonGroup>
                <Button $variant="secondary" onClick={handleBack}>
                  <ArrowLeft size={18} />
                  {language === 'vi' ? 'Quay lại' : 'Back'}
                </Button>
                <Button $variant="primary" onClick={handleNext}>
                  <Shield size={18} />
                  {language === 'vi' ? 'Hoàn Tất Xác Minh' : 'Complete Verification'}
                </Button>
              </ButtonGroup>
            </FormCard>
          )}
        </AnimatePresence>
      </VerificationContainer>
    </DashboardLayout>
  );
};

export default CandidateKYC;
