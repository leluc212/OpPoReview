import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import { Button, Input, TextArea, FormGroup, Label } from '../../components/FormElements';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Upload, 
  Save, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Link as LinkIcon,
  CreditCard,
  Camera,
  Edit2,
  FileText,
  Calendar,
  Globe,
  Shield,
  Award,
  Star,
  CheckCircle,
} from 'lucide-react';

// Custom Zalo Icon Component - Based on official Zalo logo
const ZaloIcon = ({ size = 24, color = "#0068FF", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="zaloGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#1890FF', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: color, stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="22" fill="url(#zaloGradient)"/>
    {/* Letter Z - simplified design */}
    <path 
      d="M15 15L33 15L33 19L22 28H33V33H15V29L26 20H15V15Z" 
      fill="white"
    />
  </svg>
);

const ProfileContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const ProfileHeader = styled(motion.div)`
  background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 48px;
  margin-bottom: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
    border-radius: 50%;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 32px;
    position: relative;
    z-index: 1;
  }
  
  .header-actions {
    position: absolute;
    top: 24px;
    right: 24px;
    display: flex;
    gap: 12px;
    z-index: 1;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Avatar = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 56px;
  font-weight: 700;
  border: 5px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const AvatarUpload = styled.label`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.primary};
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  }
  
  input {
    display: none;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  bottom: 8px;
  left: 8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #EF4444;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  }
`;

const HeaderInfo = styled.div`
  flex: 1;
  
  h1 {
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }
  
  .title {
    font-size: 18px;
    opacity: 0.9;
    margin-bottom: 16px;
    font-weight: 500;
  }
  
  .info-row {
    display: flex;
    gap: 32px;
    margin-top: 20px;
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      opacity: 0.95;
      
      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
`;

const HeaderButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const ProgressSection = styled.div`
  margin-top: 24px;
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .label {
      font-size: 14px;
      font-weight: 600;
      opacity: 0.9;
    }
    
    .percentage {
      font-size: 16px;
      font-weight: 700;
    }
  }
  
  .progress-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: ${props => props.theme.borderRadius.full};
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: white;
      border-radius: ${props => props.theme.borderRadius.full};
      transition: width 0.5s ease;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 32px;
  border: 1px solid ${props => props.theme.colors.border};
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    
    h2 {
      font-size: 20px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
      display: flex;
      align-items: center;
      gap: 12px;
      
      svg {
        width: 22px;
        height: 22px;
        color: ${props => props.theme.colors.primary};
      }
    }
    
    .edit-btn {
      background: ${props => props.theme.colors.primary}10;
      color: ${props => props.theme.colors.primary};
      border: none;
      padding: 8px 16px;
      border-radius: ${props => props.theme.borderRadius.md};
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
      
      svg {
        width: 14px;
        height: 14px;
      }
      
      &:hover {
        background: ${props => props.theme.colors.primary}20;
      }
    }
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  .full-width {
    grid-column: 1 / -1;
  }
`;

const InfoCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  .info-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    
    .icon {
      width: 40px;
      height: 40px;
      border-radius: ${props => props.theme.borderRadius.lg};
      background: ${props => props.$color || props.theme.colors.primary}15;
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        width: 20px;
        height: 20px;
        color: ${props => props.$color || props.theme.colors.primary};
      }
    }
    
    .label {
      font-size: 13px;
      color: ${props => props.theme.colors.textLight};
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
  }
  
  &:hover .icon {
    transform: scale(1.1) rotate(-5deg);
  }
  
  .value {
    font-size: 17px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    padding-left: 62px;
    line-height: 1.5;
  }
`;

const SkillTag = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.primary}1A;
  color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 14px;
  font-weight: 600;
  border: 1px solid ${props => props.theme.colors.primary}33;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primary}26;
    transform: translateY(-2px);
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.colors.primary};
  }
`;

const SkillsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 16px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  
  .stat-value {
    font-size: 28px;
    font-weight: 800;
    color: ${props => props.$color || props.theme.colors.primary};
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    font-weight: 600;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  max-width: 900px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const KYCStepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${props => props.$completed ? props.theme.colors.success + '10' : props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.$completed ? props.theme.colors.success : props.theme.colors.border};
  transition: all 0.3s;
  cursor: ${props => props.$completed ? 'default' : 'pointer'};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: ${props => props.$completed ? 'none' : 'translateX(4px)'};
    border-color: ${props => props.$completed ? props.theme.colors.success : props.theme.colors.primary};
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: ${props => props.$completed 
      ? props.theme.colors.success 
      : props.theme.colors.primary}15;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    svg {
      width: 24px;
      height: 24px;
      color: ${props => props.$completed ? props.theme.colors.success : props.theme.colors.primary};
    }
  }

  .content {
    flex: 1;
    
    .title {
      font-size: 15px;
      font-weight: 600;
      color: ${props => props.theme.colors.text};
      margin-bottom: 4px;
    }
    
    .description {
      font-size: 13px;
      color: ${props => props.theme.colors.textLight};
    }
  }

  .check-icon {
    width: 24px;
    height: 24px;
    color: ${props => props.theme.colors.success};
    opacity: ${props => props.$completed ? 1 : 0};
    transition: opacity 0.3s;
  }
`;



const KYCButton = styled(motion.button)`
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.3px;
  
  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
    
    svg:last-child {
      transform: translateX(4px);
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ModalFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  .full-width {
    grid-column: 1 / -1;
  }
`;

const UploadArea = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.$hasFile ? `${props.theme.colors.primary}10` : props.theme.colors.bgDark};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => `${props.theme.colors.primary}15`};
  }

  input {
    display: none;
  }

  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    margin-top: 12px;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background: #000;

  video {
    width: 100%;
    display: block;
  }

  img {
    width: 100%;
    display: block;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-top: 24px;
`;

const CandidateProfile = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('profileImage') || null;
  });
  
  // Default profile data
  const defaultFormData = {
    fullName: 'Lực Thứ Hai',
    email: 'lucthuhai@gmail.com',
    phone: '+84 379784509',
    location: 'Thủ Đức, TP.HCM',
    cccd: '',
    dateOfBirth: '',
    title: 'Senior React Developer',
    bio: 'Passionate developer with 5+ years of experience in building modern web applications. Specialized in React, Node.js, and cloud technologies.',
    // Đã loại bỏ các trường mạng xã hội khác ngoài Google
  };
  
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('candidateProfile');
    return savedData ? JSON.parse(savedData) : defaultFormData;
  });
  
  const [originalFormData, setOriginalFormData] = useState(formData);

  // Track if CCCD and DOB are locked (can only be set once)
  const [isLockedFields, setIsLockedFields] = useState(() => {
    const saved = localStorage.getItem('lockedProfileFields');
    return saved ? JSON.parse(saved) : { cccd: false, dateOfBirth: false };
  });

  const defaultSkills = [
    'React', 'Node.js', 'TypeScript', 'JavaScript', 'HTML/CSS',
    'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git'
  ];
  
  const [skills, setSkills] = useState(() => {
    const savedSkills = localStorage.getItem('candidateSkills');
    return savedSkills ? JSON.parse(savedSkills) : defaultSkills;
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [isEditingSkills, setIsEditingSkills] = useState(false);

  // KYC State
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [kycFormData, setKycFormData] = useState({
    idNumber: '',
    idIssueDate: '',
    idIssuePlace: '',
    idFrontImage: null,
    idBackImage: null,
    verificationMethod: 'phone', // 'phone' or 'email'
    verificationValue: '', // phone number or email
    verificationCode: '',
    facePhoto: null,
  });

  const [kycCompleted, setKycCompleted] = useState(() => {
    const savedKYC = localStorage.getItem('candidateKYC');
    if (savedKYC) {
      const parsed = JSON.parse(savedKYC);
      if (parsed.formData) {
        setKycFormData(parsed.formData);
      }
      return parsed.completed || false;
    }
    return false;
  });

  const kycSteps = [
    {
      id: 'cccd',
      icon: CreditCard,
      title: language === 'vi' ? 'Xác Minh CCCD' : 'ID Card Verification',
      description: language === 'vi' ? 'Tải ảnh CCCD/CMND' : 'Upload ID card',
    },
    {
      id: 'contact',
      icon: Phone,
      title: language === 'vi' ? 'Xác Minh Liên Hệ' : 'Contact Verification',
      description: language === 'vi' ? 'Xác minh SĐT hoặc Email' : 'Verify phone or email',
    },
    {
      id: 'face',
      icon: Camera,
      title: language === 'vi' ? 'Xác Định Khuôn Mặt' : 'Face Verification',
      description: language === 'vi' ? 'Chụp ảnh khuôn mặt' : 'Capture face photo',
    },
  ];
  
  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completion = 0;
    
    // Basic info (50% total)
    if (formData.fullName && formData.fullName.trim()) completion += 10;
    if (formData.email && formData.email.trim()) completion += 10;
    if (formData.phone && formData.phone.trim()) completion += 10;
    if (formData.cccd && formData.cccd.trim()) completion += 10;
    if (formData.dateOfBirth && formData.dateOfBirth.trim()) completion += 10;
    
    // Professional info (30% total)
    if (formData.location && formData.location.trim()) completion += 10;
    if (formData.title && formData.title.trim()) completion += 10;
    if (formData.bio && formData.bio.trim()) completion += 10;
    
    // Profile image (15%)
    if (profileImage) completion += 15;
    
    // Social links (not counted towards completion)
    // Đã loại bỏ các completion mạng xã hội khác ngoài Google
    
    // Skills (5%)
    if (skills && skills.length >= 3) completion += 5;
    
    return completion;
  };
  
  const profileCompletion = calculateProfileCompletion();

  const stats = [
    { label: language === 'vi' ? 'Công việc hoàn thành' : 'Completed Jobs', value: '23', color: '#10B981' },
    { label: language === 'vi' ? 'Đánh giá' : 'Rating', value: '4.8', color: '#F59E0B' },
    { label: language === 'vi' ? 'Tỷ lệ thành công' : 'Success Rate', value: '95%', color: '#1e40af' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setProfileImage(compressedBase64);
          localStorage.setItem('profileImage', compressedBase64);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    localStorage.removeItem('profileImage');
  };

  const handleSave = () => {
    // Check if CCCD or DOB are being set for the first time
    const newLockedFields = { ...isLockedFields };
    
    if (formData.cccd && formData.cccd.trim() && !isLockedFields.cccd) {
      newLockedFields.cccd = true;
    }
    
    if (formData.dateOfBirth && formData.dateOfBirth.trim() && !isLockedFields.dateOfBirth) {
      newLockedFields.dateOfBirth = true;
    }
    
    // Save locked state
    if (newLockedFields.cccd !== isLockedFields.cccd || newLockedFields.dateOfBirth !== isLockedFields.dateOfBirth) {
      setIsLockedFields(newLockedFields);
      localStorage.setItem('lockedProfileFields', JSON.stringify(newLockedFields));
    }
    
    localStorage.setItem('candidateProfile', JSON.stringify(formData));
    setOriginalFormData(formData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setFormData(originalFormData);
    setIsEditing(false);
  };
  
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      localStorage.setItem('candidateSkills', JSON.stringify(updatedSkills));
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    localStorage.setItem('candidateSkills', JSON.stringify(updatedSkills));
  };

  const openKYCModal = () => {
    setShowKYCModal(true);
  };

  const handleKYCFormChange = (field, value) => {
    setKycFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleKYCFileUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setKycFormData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateKYCForm = () => {
    return kycFormData.idNumber && 
           kycFormData.idIssueDate && 
           kycFormData.idIssuePlace && 
           kycFormData.idFrontImage && 
           kycFormData.idBackImage &&
           kycFormData.verificationValue &&
           kycFormData.verificationCode &&
           kycFormData.facePhoto;
  };

  const handleKYCSubmit = () => {
    if (!validateKYCForm()) {
      alert(language === 'vi' ? 'Vui lòng điền đầy đủ thông tin và tải lên tất cả ảnh bắt buộc' : 'Please fill all required fields and upload all required photos');
      return;
    }

    // Save KYC data
    localStorage.setItem('candidateKYC', JSON.stringify({
      completed: true,
      formData: kycFormData
    }));
    
    setKycCompleted(true);
    setShowKYCModal(false);
    alert(language === 'vi' ? '✅ Xác minh eKYC hoàn tất!' : '✅ eKYC verification completed!');
  };

  const resetKYC = () => {
    setKycCompleted(false);
    setKycFormData({
      idNumber: '',
      idIssueDate: '',
      idIssuePlace: '',
      idFrontImage: null,
      idBackImage: null,
      verificationMethod: 'phone',
      verificationValue: '',
      verificationCode: '',
      facePhoto: null,
    });
    localStorage.setItem('candidateKYC', JSON.stringify({ completed: false }));
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
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const photoData = canvas.toDataURL('image/jpeg');
    setKycFormData(prev => ({ ...prev, facePhoto: photoData }));
    
    // Stop camera
    const stream = video.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
  };

  return (
    <DashboardLayout role="candidate" showSearch={false} key={language}>
      <ProfileContainer>
        <ProfileHeader
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="header-actions">
            <HeaderButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            >
              <Edit2 />
              {isEditing ? (language === 'vi' ? 'Hủy' : 'Cancel') : (language === 'vi' ? 'Chỉnh Sửa' : 'Edit')}
            </HeaderButton>
          </div>

          <div className="header-content">
            <AvatarWrapper>
              <Avatar>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  'JD'
                )}
              </Avatar>
              {profileImage && (
                <DeleteButton onClick={handleDeleteImage}>
                  <X />
                </DeleteButton>
              )}
              <AvatarUpload>
                <Camera />
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </AvatarUpload>
            </AvatarWrapper>

            <HeaderInfo>
              <h1>{formData.fullName}</h1>
              <div className="title">{formData.title}</div>
              
              <div className="info-row">
                <div className="info-item">
                  <Mail />
                  {formData.email}
                </div>
                <div className="info-item">
                  <Phone />
                  {formData.phone}
                </div>
                <div className="info-item">
                  <MapPin />
                  {formData.location}
                </div>
              </div>

              <ProgressSection>
                <div className="progress-header">
                  <div className="label">{language === 'vi' ? 'Hoàn thiện hồ sơ' : 'Profile Completion'}</div>
                  <div className="percentage">{profileCompletion}%</div>
                </div>
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill" 
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompletion}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </ProgressSection>
            </HeaderInfo>
          </div>
        </ProfileHeader>

        <ContentGrid>
          <MainContent>
            <Card
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="card-header">
                <h2>
                  <User />
                  {language === 'vi' ? 'Thông Tin Cá Nhân' : 'Personal Information'}
                </h2>
              </div>

              {isEditing ? (
                <FormGrid>
                  <FormGroup>
                    <Label>{t.profile.fullName}</Label>
                    <Input name="fullName" value={formData.fullName} onChange={handleChange} />
                  </FormGroup>

                  <FormGroup>
                    <Label>{t.profile.email}</Label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} />
                  </FormGroup>

                  <FormGroup>
                    <Label>{t.profile.phone}</Label>
                    <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                  </FormGroup>

                  <FormGroup>
                    <Label>{t.profile.location}</Label>
                    <Input name="location" value={formData.location} onChange={handleChange} />
                  </FormGroup>

                  <FormGroup>
                    <Label>{language === 'vi' ? 'Số CCCD' : 'Citizen ID'}</Label>
                    <Input 
                      name="cccd" 
                      value={formData.cccd} 
                      onChange={handleChange} 
                      placeholder="079202012345"
                      disabled={isLockedFields.cccd}
                      style={isLockedFields.cccd ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>{language === 'vi' ? 'Ngày sinh' : 'Date of Birth'}</Label>
                    <Input 
                      name="dateOfBirth" 
                      type="date" 
                      value={formData.dateOfBirth} 
                      onChange={handleChange}
                      disabled={isLockedFields.dateOfBirth}
                      style={isLockedFields.dateOfBirth ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                    />
                  </FormGroup>

                  <FormGroup className="full-width">
                    <Label>{t.profile.professionalTitle}</Label>
                    <Input name="title" value={formData.title} onChange={handleChange} />
                  </FormGroup>

                  <FormGroup className="full-width">
                    <Label>{t.profile.bio}</Label>
                    <TextArea name="bio" value={formData.bio} onChange={handleChange} rows={4} />
                  </FormGroup>
                </FormGrid>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <InfoCard
                    $color="#1e40af"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="info-header">
                      <div className="icon">
                        <User />
                      </div>
                      <div className="label">{language === 'vi' ? 'Họ và Tên' : 'Full Name'}</div>
                    </div>
                    <div className="value">{formData.fullName}</div>
                  </InfoCard>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <InfoCard
                      $color="#10B981"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="info-header">
                        <div className="icon">
                          <Mail />
                        </div>
                        <div className="label">Email</div>
                      </div>
                      <div className="value" style={{ fontSize: '14px' }}>{formData.email}</div>
                    </InfoCard>

                    <InfoCard
                      $color="#F59E0B"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="info-header">
                        <div className="icon">
                          <Phone />
                        </div>
                        <div className="label">{language === 'vi' ? 'Điện Thoại' : 'Phone'}</div>
                      </div>
                      <div className="value">{formData.phone}</div>
                    </InfoCard>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <InfoCard
                      $color="#1e40af"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="info-header">
                        <div className="icon">
                          <FileText />
                        </div>
                        <div className="label">{language === 'vi' ? 'Số CCCD' : 'Citizen ID'}</div>
                      </div>
                      <div className="value">{formData.cccd || (language === 'vi' ? 'Chưa cập nhật' : 'Not updated')}</div>
                    </InfoCard>

                    <InfoCard
                      $color="#EC4899"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="info-header">
                        <div className="icon">
                          <Calendar />
                        </div>
                        <div className="label">{language === 'vi' ? 'Ngày sinh' : 'Date of Birth'}</div>
                      </div>
                      <div className="value">
                        {formData.dateOfBirth 
                          ? new Date(formData.dateOfBirth).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : (language === 'vi' ? 'Chưa cập nhật' : 'Not updated')
                        }
                      </div>
                    </InfoCard>
                  </div>

                  <InfoCard
                    $color="#EF4444"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="info-header">
                      <div className="icon">
                        <MapPin />
                      </div>
                      <div className="label">{language === 'vi' ? 'Địa Điểm' : 'Location'}</div>
                    </div>
                    <div className="value">{formData.location}</div>
                  </InfoCard>

                  <InfoCard
                    $color="#1e40af"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="info-header">
                      <div className="icon">
                        <Briefcase />
                      </div>
                      <div className="label">{language === 'vi' ? 'Chức Danh' : 'Title'}</div>
                    </div>
                    <div className="value">{formData.title}</div>
                  </InfoCard>

                  <InfoCard
                    $color="#06B6D4"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="info-header">
                      <div className="icon">
                        <FileText />
                      </div>
                      <div className="label">{language === 'vi' ? 'Giới Thiệu' : 'Bio'}</div>
                    </div>
                    <div className="value" style={{ lineHeight: '1.6' }}>{formData.bio}</div>
                  </InfoCard>
                </div>
              )}
            </Card>

            <Card
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card-header">
                <h2>
                  <LinkIcon />
                  {language === 'vi' ? 'Liên Kết Mạng Xã Hội' : 'Social Links'}
                </h2>
              </div>

              {isEditing ? (
                <FormGrid>
                  {/* Đã loại bỏ các trường mạng xã hội khác ngoài Google */}
                </FormGrid>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Đã loại bỏ các InfoCard mạng xã hội khác ngoài Google */}

                  {/* Đã loại bỏ Facebook */}

                  {formData.zalo && formData.zalo.trim() && (
                    <InfoCard $color="#0068FF" whileHover={{ scale: 1.01 }}>
                      <div className="info-header">
                        <div className="icon">
                          <ZaloIcon size={20} color="#0068FF" />
                        </div>
                        <div className="label">Zalo</div>
                      </div>
                      <div className="value">{formData.zalo}</div>
                    </InfoCard>
                  )}

                  {formData.website && formData.website.trim() && (
                    <InfoCard $color="#1e40af" whileHover={{ scale: 1.01 }}>
                      <div className="info-header">
                        <div className="icon">
                          <Globe />
                        </div>
                        <div className="label">Website</div>
                      </div>
                      <div className="value">{formData.website}</div>
                    </InfoCard>
                  )}

                  {!formData.linkedin?.trim() && !formData.github?.trim() && !formData.zalo?.trim() && !formData.website?.trim() && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                      <LinkIcon size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
                      <p style={{ fontSize: '14px', fontWeight: '600' }}>
                        {language === 'vi' ? 'Chưa có liên kết mạng xã hội nào' : 'No social links added yet'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </MainContent>

          <Sidebar>
            <Card
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="card-header">
                <h2>
                  <Shield />
                  {language === 'vi' ? 'Xác Minh eKYC' : 'eKYC Verification'}
                </h2>
              </div>

              {kycCompleted ? (
                <div style={{ 
                  marginTop: '16px', 
                  padding: '16px', 
                  background: '#10B98115',
                  borderRadius: '12px',
                  border: '2px solid #10B981',
                  textAlign: 'center'
                }}>
                  <CheckCircle size={40} style={{ color: '#10B981', marginBottom: '8px' }} />
                  <div style={{ fontWeight: 600, color: '#10B981', marginBottom: '4px' }}>
                    {language === 'vi' ? 'Đã Xác Minh' : 'Verified'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#059669' }}>
                    {language === 'vi' ? 'Tài khoản của bạn đã được xác minh' : 'Your account has been verified'}
                  </div>
                </div>
              ) : (
                <KYCButton
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/candidate/kyc')}
                >
                  <Shield size={18} />
                  {language === 'vi' ? 'Bắt Đầu Xác Minh' : 'Start Verification'}
                  <ArrowRight size={18} />
                </KYCButton>
              )}
            </Card>

            <Card
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card-header">
                <h2>
                  <Award />
                  {language === 'vi' ? 'Thống Kê' : 'Statistics'}
                </h2>
              </div>

              <StatsGrid>
                {stats.map((stat, index) => (
                  <StatItem key={index} $color={stat.color}>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </StatItem>
                ))}
              </StatsGrid>
            </Card>

            <Card
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card-header">
                <h2>
                  <Star />
                  {t.profile.skills}
                </h2>
                <button className="edit-btn" onClick={() => setIsEditingSkills(!isEditingSkills)}>
                  <Edit2 />
                  {isEditingSkills ? (language === 'vi' ? 'Xong' : 'Done') : (language === 'vi' ? 'Chỉnh Sửa' : 'Edit')}
                </button>
              </div>

              {isEditingSkills && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Input 
                      value={newSkill} 
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      placeholder={language === 'vi' ? 'Thêm kỹ năng mới' : 'Add new skill'}
                      style={{ flex: 1 }}
                    />
                    <Button onClick={handleAddSkill}>
                      {language === 'vi' ? 'Thêm' : 'Add'}
                    </Button>
                  </div>
                </div>
              )}

              <SkillsGrid>
                {skills.map((skill, index) => (
                  <SkillTag
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    style={{ position: 'relative' }}
                  >
                    <CheckCircle />
                    {skill}
                    {isEditingSkills && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#EF4444',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        ×
                      </button>
                    )}
                  </SkillTag>
                ))}
              </SkillsGrid>
            </Card>

            <Card
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="card-header">
                <h2>
                  <Calendar />
                  {language === 'vi' ? 'Hoạt Động Gần Đây' : 'Recent Activity'}
                </h2>
              </div>

              <div style={{ fontSize: '14px', color: 'black', lineHeight: '1.8' }}>
                <div style={{ padding: '12px 0', borderBottom: '1px solid #77ace8' }}>
                  ✅ {language === 'vi' ? 'Hoàn thành việc tuyển gấp cho Katinat' : 'Completed urgent hiring for Katinat'}
                </div>
                <div style={{ padding: '12px 0', borderBottom: '1px solid #77ace8' }}>
                  📝 {language === 'vi' ? 'Cập nhật hồ sơ' : 'Updated profile'}
                </div>
                <div style={{ padding: '12px 0' }}>
                  ⭐ {language === 'vi' ? 'Nhận đánh giá 5 sao từ Highlands Coffee' : 'Received 5-star rating from Highlands Coffee'}
                </div>
              </div>
            </Card>
          </Sidebar>
        </ContentGrid>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              position: 'sticky', 
              bottom: '24px', 
              zIndex: 10,
              display: 'flex',
              justifyContent: 'center',
              marginTop: '24px'
            }}
          >
            <Button 
              $variant="primary" 
              $size="large" 
              onClick={handleSave}
              style={{ 
                boxShadow: '0 10px 40px rgba(30, 64, 175, 0.3)',
                minWidth: '200px'
              }}
            >
              <Save /> {language === 'vi' ? 'Lưu Thay Đổi' : 'Save Changes'}
            </Button>
          </motion.div>
        )}

        {/* KYC Modal */}
        <Modal
          isOpen={showKYCModal}
          onClose={() => setShowKYCModal(false)}
          title={language === 'vi' ? 'Xác Minh eKYC' : 'eKYC Verification'}
          size="large"
        >
          <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}>
            {/* Section 1: ID Verification */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                marginBottom: '20px', 
                fontSize: '18px', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#1e40af'
              }}>
                <CreditCard size={20} />
                {language === 'vi' ? 'Xác Minh CCCD/CMND' : 'ID Card Verification'}
              </h3>
              <ModalFormGrid>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Số CCCD/CMND *' : 'ID Number *'}</Label>
                  <Input
                    value={kycFormData.idNumber}
                    onChange={(e) => handleKYCFormChange('idNumber', e.target.value)}
                    placeholder="079202012345"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Ngày cấp *' : 'Issue Date *'}</Label>
                  <Input
                    type="date"
                    value={kycFormData.idIssueDate}
                    onChange={(e) => handleKYCFormChange('idIssueDate', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup className="full-width">
                  <Label>{language === 'vi' ? 'Nơi cấp *' : 'Issue Place *'}</Label>
                  <Input
                    value={kycFormData.idIssuePlace}
                    onChange={(e) => handleKYCFormChange('idIssuePlace', e.target.value)}
                    placeholder={language === 'vi' ? 'Cục Cảnh sát...' : 'Police Department...'}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Ảnh mặt trước *' : 'Front Image *'}</Label>
                  <UploadArea $hasFile={kycFormData.idFrontImage}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleKYCFileUpload('idFrontImage', e.target.files[0])}
                    />
                    <Upload size={32} style={{ marginBottom: '8px', color: '#6366F1' }} />
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>
                      {kycFormData.idFrontImage ? '✓ Đã tải ảnh' : (language === 'vi' ? 'Tải ảnh mặt trước' : 'Upload front image')}
                    </div>
                    {kycFormData.idFrontImage && (
                      <img src={kycFormData.idFrontImage} alt="ID Front" />
                    )}
                  </UploadArea>
                </FormGroup>
                <FormGroup>
                  <Label>{language === 'vi' ? 'Ảnh mặt sau *' : 'Back Image *'}</Label>
                  <UploadArea $hasFile={kycFormData.idBackImage}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleKYCFileUpload('idBackImage', e.target.files[0])}
                    />
                    <Upload size={32} style={{ marginBottom: '8px', color: '#6366F1' }} />
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>
                      {kycFormData.idBackImage ? '✓ Đã tải ảnh' : (language === 'vi' ? 'Tải ảnh mặt sau' : 'Upload back image')}
                    </div>
                    {kycFormData.idBackImage && (
                      <img src={kycFormData.idBackImage} alt="ID Back" />
                    )}
                  </UploadArea>
                </FormGroup>
              </ModalFormGrid>
            </div>

            {/* Section 2: Phone/Email Verification */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                marginBottom: '20px', 
                fontSize: '18px', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#1e40af'
              }}>
                <Phone size={20} />
                {language === 'vi' ? 'Xác Minh Liên Hệ' : 'Contact Verification'}
              </h3>
              
              {/* Verification Method Selection */}
              <div style={{ marginBottom: '20px' }}>
                <Label>{language === 'vi' ? 'Chọn phương thức xác minh *' : 'Select verification method *'}</Label>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <Button
                    type="button"
                    variant={kycFormData.verificationMethod === 'phone' ? 'primary' : 'secondary'}
                    onClick={() => handleKYCFormChange('verificationMethod', 'phone')}
                    style={{ flex: 1 }}
                  >
                    <Phone size={18} />
                    {language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                  </Button>
                  <Button
                    type="button"
                    variant={kycFormData.verificationMethod === 'email' ? 'primary' : 'secondary'}
                    onClick={() => handleKYCFormChange('verificationMethod', 'email')}
                    style={{ flex: 1 }}
                  >
                    <Mail size={18} />
                    {language === 'vi' ? 'Email' : 'Email'}
                  </Button>
                </div>
              </div>

              <ModalFormGrid>
                <FormGroup className="full-width">
                  <Label>
                    {kycFormData.verificationMethod === 'phone' 
                      ? (language === 'vi' ? 'Số điện thoại *' : 'Phone Number *')
                      : (language === 'vi' ? 'Địa chỉ Email *' : 'Email Address *')
                    }
                  </Label>
                  <Input
                    type={kycFormData.verificationMethod === 'phone' ? 'tel' : 'email'}
                    value={kycFormData.verificationValue}
                    onChange={(e) => handleKYCFormChange('verificationValue', e.target.value)}
                    placeholder={kycFormData.verificationMethod === 'phone' ? '0912345678' : 'email@example.com'}
                    required
                  />
                </FormGroup>
                <FormGroup className="full-width">
                  <Label>{language === 'vi' ? 'Mã xác minh *' : 'Verification Code *'}</Label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Input
                      value={kycFormData.verificationCode}
                      onChange={(e) => handleKYCFormChange('verificationCode', e.target.value)}
                      placeholder={language === 'vi' ? 'Nhập mã 6 số' : 'Enter 6-digit code'}
                      maxLength={6}
                      required
                      style={{ flex: 1 }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        const code = Math.floor(100000 + Math.random() * 900000);
                        alert(language === 'vi' 
                          ? `Mã xác minh của bạn: ${code}` 
                          : `Your verification code: ${code}`
                        );
                      }}
                    >
                      {language === 'vi' ? 'Gửi mã' : 'Send Code'}
                    </Button>
                  </div>
                </FormGroup>
              </ModalFormGrid>
            </div>

            {/* Section 3: Face Verification */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                marginBottom: '20px', 
                fontSize: '18px', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#1e40af'
              }}>
                <Camera size={20} />
                {language === 'vi' ? 'Xác Minh Khuôn Mặt' : 'Face Verification'}
              </h3>
              <div style={{ textAlign: 'center' }}>
                {!kycFormData.facePhoto ? (
                  <>
                    <VideoWrapper>
                      <video id="kycVideo" autoPlay playsInline />
                    </VideoWrapper>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <Button onClick={startCamera}>
                        <Camera size={18} />
                        {language === 'vi' ? 'Bật Camera' : 'Start Camera'}
                      </Button>
                      <Button onClick={capturePhoto}>
                        <CheckCircle size={18} />
                        {language === 'vi' ? 'Chụp Ảnh' : 'Capture'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <VideoWrapper>
                    <img src={kycFormData.facePhoto} alt="Face" />
                    <Button 
                      onClick={() => setKycFormData(prev => ({ ...prev, facePhoto: null }))}
                      style={{ marginTop: '16px' }}
                    >
                      {language === 'vi' ? 'Chụp lại' : 'Retake'}
                    </Button>
                  </VideoWrapper>
                )}
              </div>
            </div>
          </div>

          <ModalButtons>
            <Button variant="secondary" onClick={() => setShowKYCModal(false)}>
              {language === 'vi' ? 'Hủy' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleKYCSubmit}
              disabled={!validateKYCForm()}
              style={{ marginLeft: 'auto' }}
            >
              <Shield size={18} />
              {language === 'vi' ? 'Hoàn Tất Xác Minh' : 'Complete Verification'}
            </Button>
          </ModalButtons>
        </Modal>
      </ProfileContainer>
    </DashboardLayout>
  );
};

export default CandidateProfile;
