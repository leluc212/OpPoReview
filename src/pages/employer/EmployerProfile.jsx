import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { Input, TextArea, Button, Label, FormGroup } from '../../components/FormElements';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Users, 
  FileText, 
  Upload,
  Camera,
  Save,
  Edit3,
  Check,
  X,
  ShieldCheck,
  File,
  Trash2,
  Download,
  Eye,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ProfileContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

const PageHeader = styled.div`
  margin-bottom: 28px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const PageTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PageIconBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 15px;
  background: #EFF6FF;
  border: 1.5px solid #BFDBFE;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 22px;
    height: 22px;
    color: #1e40af;
  }
`;

const PageTitleText = styled.div`
  h1 {
    font-size: 26px;
    font-weight: 800;
    color: ${props => props.theme.colors.text};
    letter-spacing: -0.5px;
    line-height: 1.2;
    margin-bottom: 4px;
  }

  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 13.5px;
    font-weight: 500;
  }
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SidePanel = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CompanyLogoCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  transition: all 0.22s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.13);
    border-color: #BFDBFE;
  }
`;

const LogoUploadArea = styled.div`
  width: 160px;
  height: 160px;
  margin: 0 auto 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(30, 64, 175, 0.3);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadButton = styled(motion.label)`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #EFF6FF;
  border: 1.5px solid #BFDBFE;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.1);
  transition: all 0.22s ease;
  
  &:hover {
    transform: scale(1.05);
    background: #DBEAFE;
    border-color: #93C5FD;
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: #1e40af;
  }
  
  input {
    display: none;
  }
`;

const DeleteLogoButton = styled(motion.button)`
  position: absolute;
  bottom: 8px;
  left: 8px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #FEF2F2;
  color: #EF4444;
  border: 1.5px solid #FECACA;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
  transition: all 0.22s ease;
  
  &:hover {
    transform: scale(1.05);
    background: #FEE2E2;
    border-color: #FCA5A5;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const CompanyName = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const CompanyType = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
`;

const StatsCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  transition: all 0.22s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.13);
    border-color: #BFDBFE;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const VerifyActionCard = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  transition: all 0.22s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.13);
    border-color: #BFDBFE;
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    background: #EFF6FF;
    color: #1e40af;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
  
  h4 {
    font-size: 16px;
    font-weight: 700;
    color: #1E293B;
    margin: 0;
  }
  
  p {
    font-size: 13.5px;
    color: #64748B;
    margin: 0;
    line-height: 1.5;
  }
  
  button {
    width: 100%;
    padding: 12px;
    background: #EFF6FF;
    color: #1e40af;
    border: 1.5px solid #BFDBFE;
    border-radius: 10px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 4px;
    
    &:hover {
      background: #1e40af;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2);
    }
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 16px;
  background: #EFF6FF;
  border: 1.5px solid transparent;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ffffff;
    border-color: #BFDBFE;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.08);
  }
  
  .value {
    font-size: 24px;
    font-weight: 800;
    color: #1e40af;
    display: block;
    margin-bottom: 4px;
    transition: color 0.3s ease;
  }
  
  .label {
    font-size: 12px;
    color: #475569;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: color 0.3s ease;
  }
`;

const MainPanel = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  transition: all 0.22s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.13);
    border-color: #BFDBFE;
  }
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    width: 22px;
    height: 22px;
    color: #1e40af;
    background: #EFF6FF;
    padding: 6px;
    border-radius: 8px;
    width: 34px;
    height: 34px;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$columns || '1fr'};
  gap: 20px;
  margin-bottom: 24px;
`;

const InputWrapper = styled.div`
  position: relative;
  
  svg.input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #1e40af;
    opacity: 0.7;
    pointer-events: none;
    transition: all 0.2s ease;
  }
  
  input, textarea {
    padding-left: 46px;
    border-radius: 12px;
    border: 1.5px solid #E8EFFF;
    background: #ffffff;
    transition: all 0.2s ease;
    
    &:focus {
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
  
  &:focus-within svg.input-icon {
    opacity: 1;
    color: #3B82F6;
  }
`;

const SaveButton = styled(motion.button)`
  padding: 14px 32px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
  color: white;
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  box-shadow: 0 8px 24px rgba(30, 64, 175, 0.35);
  transition: all 0.3s ease;
  cursor: pointer;
  margin-top: 24px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(30, 64, 175, 0.45);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SuccessMessage = styled(motion.div)`
  padding: 16px 20px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const DocumentsSection = styled.div`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 2px solid #E8EFFF;
`;

const VerificationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  margin-left: 12px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const VerificationDocumentCard = styled(motion.div)`
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
  border: 2px solid #93C5FD;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
  }
  
  &:hover {
    border-color: #3B82F6;
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
    transform: translateY(-4px);
  }
  
  .verified-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const DocumentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const DocumentCard = styled(motion.div)`
  background: #ffffff;
  border: 2px solid #E8EFFF;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #BFDBFE;
    box-shadow: 0 4px 16px rgba(30, 64, 175, 0.1);
    transform: translateY(-2px);
  }
`;

const DocumentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const DocumentIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
  border: 1.5px solid #BFDBFE;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 22px;
    height: 22px;
    color: #1e40af;
  }
`;

const DocumentInfo = styled.div`
  flex: 1;
  min-width: 0;
  
  .doc-name {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
    word-break: break-word;
  }
  
  .doc-date {
    font-size: 12px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const DocumentActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const DocumentButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1.5px solid;
  
  ${props => props.$variant === 'danger' ? `
    background: #FEE2E2;
    border-color: #FCA5A5;
    color: #DC2626;
    
    &:hover {
      background: #FEF2F2;
      border-color: #EF4444;
    }
  ` : `
    background: #EFF6FF;
    border-color: #BFDBFE;
    color: #1e40af;
    
    &:hover {
      background: #DBEAFE;
      border-color: #93C5FD;
    }
  `}
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const DocumentUploadButton = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
  transition: all 0.2s ease;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
  }
`;

const EmptyDocuments = styled.div`
  text-align: center;
  padding: 48px 20px;
  background: #F8FAFC;
  border-radius: 12px;
  border: 2px dashed #E2E8F0;
  
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const InfoBox = styled.div`
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #E8EFFF;
  background: #F8FAFC;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .info-content {
    flex: 1;
    
    p {
      font-size: 14px;
      line-height: 1.6;
      color: ${props => props.theme.colors.text};
      margin: 0;
    }
  }
`;

const getInitialFormData = (language) => ({
  companyName: language === 'vi' ? 'Katinat Quận 8' : 'Katinat District 8',
  email: 'contact@katinat.vn',
  phone: '0379784509',
  address: language === 'vi' ? 'Quận 8, TP.HCM' : 'District 8, HCMC',
  website: 'https://katinat.vn',
  description: language === 'vi' ? 'Hệ thống cửa hàng cà phê và trà Katinat.' : 'Katinat Coffee and Tea Store Chain.',
  industry: 'F&B',
  size: language === 'vi' ? '50-100 nhân viên' : '50-100 employees',
  foundedYear: '2020'
});

const EmployerProfile = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(() => {
    return localStorage.getItem('companyLogo') || '/OpPoReview/images/katinatlogo.jpg';
  });
  
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('companyDocuments');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [verificationDocuments, setVerificationDocuments] = useState(() => {
    const verificationData = localStorage.getItem('companyVerificationData');
    if (!verificationData) return [];
    
    try {
      const parsed = JSON.parse(verificationData);
      const docs = [];
      
      // Step 1: Business License
      if (parsed.step1?.businessLicense) {
        docs.push({
          id: 'business-license',
          name: language === 'vi' ? 'Giấy phép kinh doanh' : 'Business License',
          type: 'verification',
          uploadDate: parsed.submittedAt ? new Date(parsed.submittedAt).toLocaleDateString('vi-VN') : 'N/A',
          fileData: parsed.step1.businessLicense,
          metadata: {
            licenseNumber: parsed.step1.licenseNumber,
            issueDate: parsed.step1.issueDate,
            expiryDate: parsed.step1.expiryDate
          }
        });
      }
      
      // Step 3: ID Front
      if (parsed.step3?.idFrontImage) {
        docs.push({
          id: 'id-front',
          name: language === 'vi' ? 'CCCD/CMND mặt trước' : 'ID Card (Front)',
          type: 'verification',
          uploadDate: parsed.submittedAt ? new Date(parsed.submittedAt).toLocaleDateString('vi-VN') : 'N/A',
          fileData: parsed.step3.idFrontImage,
          metadata: {
            representativeName: parsed.step3.representativeName,
            idNumber: parsed.step3.idNumber
          }
        });
      }
      
      // Step 3: ID Back
      if (parsed.step3?.idBackImage) {
        docs.push({
          id: 'id-back',
          name: language === 'vi' ? 'CCCD/CMND mặt sau' : 'ID Card (Back)',
          type: 'verification',
          uploadDate: parsed.submittedAt ? new Date(parsed.submittedAt).toLocaleDateString('vi-VN') : 'N/A',
          fileData: parsed.step3.idBackImage,
          metadata: {
            representativeName: parsed.step3.representativeName,
            idNumber: parsed.step3.idNumber
          }
        });
      }
      
      // Step 3: Authorization Letter
      if (parsed.step3?.authorizationLetter) {
        docs.push({
          id: 'authorization-letter',
          name: language === 'vi' ? 'Giấy ủy quyền' : 'Authorization Letter',
          type: 'verification',
          uploadDate: parsed.submittedAt ? new Date(parsed.submittedAt).toLocaleDateString('vi-VN') : 'N/A',
          fileData: parsed.step3.authorizationLetter
        });
      }
      
      return docs;
    } catch (e) {
      console.error('Error parsing verification data:', e);
      return [];
    }
  });
  
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('employerProfile');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.companyName === 'Công Ty TNHH Một Mình Tui' || parsed.companyName === 'Solo Company LLC') {
          return getInitialFormData(language);
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing saved data:', e);
        return getInitialFormData(language);
      }
    }
    return getInitialFormData(language);
  });
  
  const [originalFormData, setOriginalFormData] = useState(formData);

  useEffect(() => {
    const savedData = localStorage.getItem('employerProfile');
    if (!savedData) {
      const initialData = getInitialFormData(language);
      setFormData(initialData);
      setOriginalFormData(initialData);
      // Save initial data to localStorage so it's always available
      localStorage.setItem('employerProfile', JSON.stringify(initialData));
    }
    
    // Reload verification documents when language changes
    const verificationData = localStorage.getItem('companyVerificationData');
    if (verificationData) {
      try {
        const parsed = JSON.parse(verificationData);
        const docs = [];
        
        // Step 1: Business License
        if (parsed.step1?.businessLicense) {
          docs.push({
            id: 'business-license',
            name: language === 'vi' ? 'Giấy phép kinh doanh' : 'Business License',
            type: 'verification',
            uploadDate: parsed.submittedAt ? new Date(parsed.submittedAt).toLocaleDateString('vi-VN') : 'N/A',
            fileData: parsed.step1.businessLicense,
            metadata: {
              licenseNumber: parsed.step1.licenseNumber,
              issueDate: parsed.step1.issueDate,
              expiryDate: parsed.step1.expiryDate
            }
          });
        }
        
        // Step 3: ID Front
        if (parsed.step3?.idFrontImage) {
          docs.push({
            id: 'id-front',
            name: language === 'vi' ? 'CCCD/CMND mặt trước' : 'ID Card (Front)',
            type: 'verification',
            uploadDate: parsed.submittedAt ? new Date(parsed.submittedAt).toLocaleDateString('vi-VN') : 'N/A',
            fileData: parsed.step3.idFrontImage,
            metadata: {
              representativeName: parsed.step3.representativeName,
              idNumber: parsed.step3.idNumber
            }
          });
        }
        
        // Step 3: ID Back
        if (parsed.step3?.idBackImage) {
          docs.push({
            id: 'id-back',
            name: language === 'vi' ? 'CCCD/CMND mặt sau' : 'ID Card (Back)',
            type: 'verification',
            uploadDate: parsed.submittedAt ? new Date(parsed.submittedAt).toLocaleDateString('vi-VN') : 'N/A',
            fileData: parsed.step3.idBackImage,
            metadata: {
              representativeName: parsed.step3.representativeName,
              idNumber: parsed.step3.idNumber
            }
          });
        }
        
        // Step 3: Authorization Letter
        if (parsed.step3?.authorizationLetter) {
          docs.push({
            id: 'authorization-letter',
            name: language === 'vi' ? 'Giấy ủy quyền' : 'Authorization Letter',
            type: 'verification',
            uploadDate: parsed.submittedAt ? new Date(parsed.submittedAt).toLocaleDateString('vi-VN') : 'N/A',
            fileData: parsed.step3.authorizationLetter
          });
        }
        
        setVerificationDocuments(docs);
      } catch (e) {
        console.error('Error parsing verification data:', e);
      }
    }
  }, [language]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    localStorage.setItem('employerProfile', JSON.stringify(formData));
    setOriginalFormData(formData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setFormData(originalFormData);
    setIsEditing(false);
  };

  const handleLogoUpload = (e) => {
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
          setCompanyLogo(compressedBase64);
          localStorage.setItem('companyLogo', compressedBase64);
          window.dispatchEvent(new Event('logoChanged'));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteLogo = () => {
    setCompanyLogo('/OpPoReview/images/katinatlogo.jpg');
    localStorage.removeItem('companyLogo');
    window.dispatchEvent(new Event('logoChanged'));
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      uploadDate: new Date().toLocaleDateString('vi-VN'),
      size: (file.size / 1024).toFixed(2) + ' KB'
    }));
    
    const updated = [...documents, ...newDocuments];
    setDocuments(updated);
    localStorage.setItem('companyDocuments', JSON.stringify(updated));
  };

  const handleDeleteDocument = (docId) => {
    const updated = documents.filter(doc => doc.id !== docId);
    setDocuments(updated);
    localStorage.setItem('companyDocuments', JSON.stringify(updated));
  };

  const handleViewVerificationDocument = (doc) => {
    if (doc.fileData) {
      // Open the image/document in a new window
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${doc.name}</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  display: flex; 
                  flex-direction: column;
                  align-items: center; 
                  justify-content: center; 
                  background: #1e293b;
                  font-family: system-ui, -apple-system, sans-serif;
                }
                img { 
                  max-width: 100%; 
                  height: auto; 
                  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                  border-radius: 8px;
                }
                .info {
                  background: white;
                  padding: 16px 24px;
                  border-radius: 8px;
                  margin-bottom: 16px;
                  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
                }
                .info h2 {
                  margin: 0 0 12px 0;
                  color: #1e293b;
                  font-size: 20px;
                }
                .info p {
                  margin: 4px 0;
                  color: #64748b;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="info">
                <h2>${doc.name}</h2>
                <p><strong>${language === 'vi' ? 'Ngày tải lên' : 'Upload Date'}:</strong> ${doc.uploadDate}</p>
                ${doc.metadata ? Object.entries(doc.metadata).map(([key, value]) => 
                  value ? `<p><strong>${key}:</strong> ${value}</p>` : ''
                ).join('') : ''}
              </div>
              <img src="${doc.fileData}" alt="${doc.name}" />
            </body>
          </html>
        `);
      }
    }
  };

  return (
    <DashboardLayout role="employer" key={language}>
      <ProfileContainer>
        <PageHeader>
          <PageTitleGroup>
            <PageIconBox>
              <Building2 />
            </PageIconBox>
            <PageTitleText>
              <h1>{language === 'vi' ? 'Hồ Sơ Công Ty' : 'Company Profile'}</h1>
              <p>{language === 'vi' ? 'Quản lý thông tin công ty' : 'Manage your company information'}</p>
            </PageTitleText>
          </PageTitleGroup>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: isEditing ? '#6B7280' : '#1e40af',
              color: 'white',
              border: 'none',
              fontWeight: '700',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: isEditing ? 'none' : '0 4px 12px rgba(30, 64, 175, 0.2)'
            }}
          >
            <Edit3 size={18} />
            {isEditing ? (language === 'vi' ? 'Hủy' : 'Cancel') : (language === 'vi' ? 'Chỉnh Sửa' : 'Edit')}
          </motion.button>
        </PageHeader>

        <ProfileContent>
          <SidePanel
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CompanyLogoCard>
              <LogoUploadArea>
                {companyLogo ? (
                  <img src={companyLogo} alt="Company Logo" />
                ) : (
                  <Building2 size={64} color="white" />
                )}
                {companyLogo && companyLogo !== '/OpPoReview/images/katinatlogo.jpg' && (
                  <DeleteLogoButton
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteLogo}
                  >
                    <X />
                  </DeleteLogoButton>
                )}
                <UploadButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera />
                  <input type="file" accept="image/*" onChange={handleLogoUpload} />
                </UploadButton>
              </LogoUploadArea>
              <CompanyName>{formData.companyName}</CompanyName>
              <CompanyType>{formData.industry}</CompanyType>
            </CompanyLogoCard>

            <StatsCard>
              <StatGrid>
                <StatItem>
                  <span className="value">24</span>
                  <span className="label">{language === 'vi' ? 'Tin tuyển dụng' : 'Job posts'}</span>
                </StatItem>
                <StatItem>
                  <span className="value">156</span>
                  <span className="label">{language === 'vi' ? 'Ứng viên' : 'Candidates'}</span>
                </StatItem>
                <StatItem>
                  <span className="value">89</span>
                  <span className="label">{language === 'vi' ? 'Đã tuyển' : 'Hired'}</span>
                </StatItem>
                <StatItem>
                  <span className="value">4.5</span>
                  <span className="label">{language === 'vi' ? 'Đánh giá' : 'Rating'}</span>
                </StatItem>
              </StatGrid>
            </StatsCard>

            <VerifyActionCard>
              <div className="icon-wrapper">
                <ShieldCheck />
              </div>
              <h4>{language === 'vi' ? 'Xác Thực Doanh Nghiệp' : 'Verify Company'}</h4>
              <p>{language === 'vi' ? 'Xác thực hồ sơ để tăng mức độ uy tín và thu hút ứng viên.' : 'Verify your profile to increase trust and attract more candidates.'}</p>
              <button type="button" onClick={() => navigate('/employer/verification')}>
                {language === 'vi' ? 'Đi tới Xác thực ngay' : 'Go to Verify Now'}
              </button>
            </VerifyActionCard>
          </SidePanel>

          <MainPanel
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <form onSubmit={(e) => e.preventDefault()}>
              <SectionTitle>
                <Building2 />
                {language === 'vi' ? 'Thông Tin Công Ty' : 'Company Information'}
              </SectionTitle>

              <FormRow $columns="1fr">
                <FormGroup>
                  <Label htmlFor="companyName">{language === 'vi' ? 'Tên công ty' : 'Company name'}</Label>
                  <InputWrapper>
                    <Building2 className="input-icon" />
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder={language === 'vi' ? 'Nhập tên công ty' : 'Enter company name'}
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow $columns="1fr 1fr">
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <InputWrapper>
                    <Mail className="input-icon" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@company.com"
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="phone">{language === 'vi' ? 'Số điện thoại' : 'Phone number'}</Label>
                  <InputWrapper>
                    <Phone className="input-icon" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123456789"
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow $columns="1fr">
                <FormGroup>
                  <Label htmlFor="address">{language === 'vi' ? 'Địa chỉ' : 'Address'}</Label>
                  <InputWrapper>
                    <MapPin className="input-icon" />
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={language === 'vi' ? 'Địa chỉ công ty' : 'Company address'}
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow $columns="1fr">
                <FormGroup>
                  <Label htmlFor="website">Website</Label>
                  <InputWrapper>
                    <Globe className="input-icon" />
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow $columns="1fr 1fr 1fr">
                <FormGroup>
                  <Label htmlFor="industry">{language === 'vi' ? 'Lĩnh vực' : 'Industry'}</Label>
                  <InputWrapper>
                    <FileText className="input-icon" />
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      placeholder={language === 'vi' ? 'Lĩnh vực hoạt động' : 'Business industry'}
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="size">{language === 'vi' ? 'Quy mô' : 'Company size'}</Label>
                  <InputWrapper>
                    <Users className="input-icon" />
                    <Input
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      placeholder={language === 'vi' ? 'Số lượng nhân viên' : 'Number of employees'}
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="foundedYear">{language === 'vi' ? 'Năm thành lập' : 'Founded Year'}</Label>
                  <InputWrapper>
                    <FileText className="input-icon" />
                    <Input
                      id="foundedYear"
                      name="foundedYear"
                      value={formData.foundedYear}
                      onChange={handleChange}
                      placeholder="2015"
                      disabled={!isEditing}
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>

              <FormRow $columns="1fr">
                <FormGroup>
                  <Label htmlFor="description">{language === 'vi' ? 'Mô tả công ty' : 'Company description'}</Label>
                  <TextArea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={language === 'vi' ? 'Giới thiệu về công ty...' : 'Introduce your company...'}
                    rows={5}
                    disabled={!isEditing}
                  />
                </FormGroup>
              </FormRow>

              {isEditing && (
                <SaveButton
                  type="button"
                  onClick={handleSave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save />
                  {language === 'vi' ? 'Lưu Thay Đổi' : 'Save Changes'}
                </SaveButton>
              )}

              {/* Documents Section - Combined Verification & Regular Documents */}
              <DocumentsSection>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <SectionTitle style={{ marginBottom: 0 }}>
                    <File />
                    {language === 'vi' ? 'Hồ Sơ & Tài Liệu' : 'Documents & Files'}
                  </SectionTitle>
                  <label htmlFor="doc-upload" style={{ cursor: 'pointer' }}>
                    <input
                      id="doc-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload}
                      style={{ display: 'none' }}
                    />
                    <DocumentUploadButton
                      as={motion.span}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus />
                      {language === 'vi' ? 'Tải lên tài liệu' : 'Upload Documents'}
                    </DocumentUploadButton>
                  </label>
                </div>

                {verificationDocuments.length === 0 && documents.length === 0 ? (
                  <EmptyDocuments>
                    <div className="icon">📄</div>
                    <h3>{language === 'vi' ? 'Chưa có tài liệu nào' : 'No documents yet'}</h3>
                    <p>{language === 'vi' ? 'Tải lên hồ sơ công ty, giấy phép kinh doanh và các tài liệu liên quan' : 'Upload company profile, business license and related documents'}</p>
                  </EmptyDocuments>
                ) : (
                  <>
                    <DocumentsGrid>
                      {/* Verification Documents */}
                      {verificationDocuments.map((doc) => (
                        <VerificationDocumentCard
                          key={doc.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <div className="verified-badge">
                            <ShieldCheck />
                            {language === 'vi' ? 'Xác thực' : 'Verified'}
                          </div>
                          <DocumentHeader>
                            <DocumentIconBox style={{ 
                              background: 'linear-gradient(135deg, #3B82F6 0%, #1e40af 100%)',
                              borderColor: '#1e40af'
                            }}>
                              <FileText style={{ color: 'white' }} />
                            </DocumentIconBox>
                            <DocumentInfo>
                              <div className="doc-name">{doc.name}</div>
                              <div className="doc-date" style={{ color: '#1e40af', fontWeight: 600 }}>
                                {language === 'vi' ? 'Tải lên: ' : 'Uploaded: '}{doc.uploadDate}
                              </div>
                              {doc.metadata && (
                                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                                  {Object.entries(doc.metadata).slice(0, 2).map(([key, value]) => 
                                    value ? <div key={key}>{key}: {value}</div> : null
                                  )}
                                </div>
                              )}
                            </DocumentInfo>
                          </DocumentHeader>
                          <DocumentActions>
                            <DocumentButton 
                              onClick={() => handleViewVerificationDocument(doc)}
                              style={{ 
                                background: 'linear-gradient(135deg, #3B82F6 0%, #1e40af 100%)',
                                color: 'white',
                                borderColor: '#1e40af'
                              }}
                            >
                              <Eye />
                              {language === 'vi' ? 'Xem' : 'View'}
                            </DocumentButton>
                          </DocumentActions>
                        </VerificationDocumentCard>
                      ))}

                      {/* Regular Documents */}
                      {documents.map((doc) => (
                        <DocumentCard
                          key={doc.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <DocumentHeader>
                            <DocumentIconBox>
                              <File />
                            </DocumentIconBox>
                            <DocumentInfo>
                              <div className="doc-name">{doc.name}</div>
                              <div className="doc-date">{language === 'vi' ? 'Tải lên: ' : 'Uploaded: '}{doc.uploadDate}</div>
                            </DocumentInfo>
                          </DocumentHeader>
                          <DocumentActions>
                            <DocumentButton>
                              <Eye />
                              {language === 'vi' ? 'Xem' : 'View'}
                            </DocumentButton>
                            <DocumentButton $variant="danger" onClick={() => handleDeleteDocument(doc.id)}>
                              <Trash2 />
                              {language === 'vi' ? 'Xóa' : 'Delete'}
                            </DocumentButton>
                          </DocumentActions>
                        </DocumentCard>
                      ))}
                    </DocumentsGrid>

                    {verificationDocuments.length > 0 && (
                      <InfoBox style={{ marginTop: '20px', background: '#EFF6FF', borderColor: '#3B82F6' }}>
                        <AlertCircle style={{ color: '#3B82F6' }} />
                        <div className="info-content">
                          <p>
                            {language === 'vi' 
                              ? 'Các tài liệu xác thực này đã được gửi đến OpPo để xem xét. Bạn không thể chỉnh sửa hoặc xóa các tài liệu này. Nếu cần cập nhật, vui lòng liên hệ bộ phận hỗ trợ.'
                              : 'These verification documents have been submitted to OpPo for review. You cannot edit or delete these documents. If you need to update them, please contact support.'}
                          </p>
                        </div>
                      </InfoBox>
                    )}
                  </>
                )}
              </DocumentsSection>
            </form>
          </MainPanel>
        </ProfileContent>
      </ProfileContainer>
    </DashboardLayout>
  );
};

export default EmployerProfile;

