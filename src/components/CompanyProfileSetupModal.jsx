import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Building2, Users, TrendingUp, X } from 'lucide-react';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled(motion.div)`
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  border-radius: 24px;
  padding: 0;
  max-width: 480px;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ModalHeader = styled.div`
  text-align: center;
  padding: 48px 32px 32px;
  color: white;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  
  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
`;

const ModalTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 12px;
  line-height: 1.2;
`;

const ModalSubtitle = styled.p`
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.5;
  margin: 0;
`;

const ModalContent = styled.div`
  background: white;
  padding: 32px;
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #F8FAFC;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F1F5F9;
    border-color: #CBD5E1;
    transform: translateY(-2px);
  }
`;

const BenefitIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const BenefitContent = styled.div`
  flex: 1;
  
  h4 {
    font-size: 16px;
    font-weight: 700;
    color: #1E293B;
    margin: 0 0 8px 0;
  }
  
  p {
    font-size: 14px;
    color: #64748B;
    margin: 0;
    line-height: 1.5;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  
  ${props => props.$primary ? `
    background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
    color: white;
    box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);
    
    &:hover {
      box-shadow: 0 12px 32px rgba(79, 70, 229, 0.4);
      transform: translateY(-2px);
    }
  ` : `
    background: #F8FAFC;
    color: #64748B;
    border: 1px solid #E2E8F0;
    
    &:hover {
      background: #F1F5F9;
      border-color: #CBD5E1;
    }
  `}
`;

const CompanyProfileSetupModal = ({ isOpen, onClose, profileCompletion = 0 }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleSetupProfile = () => {
    onClose();
    navigate('/employer/profile');
  };

  const benefits = [
    {
      icon: Users,
      title: language === 'vi' ? 'Ứng viên tìm thấy dễ dàng hơn' : 'Candidates find you easier',
      description: language === 'vi' 
        ? 'Hồ sơ đầy đủ giúp bạn nổi bật trong kết quả tìm kiếm của ứng viên'
        : 'Complete profile helps you stand out in candidate search results'
    },
    {
      icon: TrendingUp,
      title: language === 'vi' ? 'Đăng tin tuyển dụng hiệu quả' : 'Post jobs more effectively',
      description: language === 'vi'
        ? 'Tin tuyển dụng từ công ty có hồ sơ đầy đủ nhận được nhiều ứng viên hơn'
        : 'Job posts from companies with complete profiles receive more applications'
    },
    {
      icon: Building2,
      title: language === 'vi' ? 'Tăng độ uy tín' : 'Increase credibility',
      description: language === 'vi'
        ? 'Xây dựng thông tin công ty để tăng mức độ tin cậy với ứng viên'
        : 'Build company information to increase trust with candidates'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
            
            <ModalHeader>
              <IconWrapper>
                <Building2 />
              </IconWrapper>
              <ModalTitle>
                {language === 'vi' ? 'Thiết lập hồ sơ công ty!' : 'Set up company profile!'}
              </ModalTitle>
              <ModalSubtitle>
                {language === 'vi' 
                  ? 'Hồ sơ công ty đầy đủ giúp ứng viên tìm thấy và tin tưởng bạn hơn'
                  : 'A complete company profile helps candidates find and trust you more'}
              </ModalSubtitle>
            </ModalHeader>

            <ModalContent>
              <BenefitsList>
                {benefits.map((benefit, index) => (
                  <BenefitItem key={index}>
                    <BenefitIcon>
                      <benefit.icon />
                    </BenefitIcon>
                    <BenefitContent>
                      <h4>{benefit.title}</h4>
                      <p>{benefit.description}</p>
                    </BenefitContent>
                  </BenefitItem>
                ))}
              </BenefitsList>

              <ModalActions>
                <ActionButton
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {language === 'vi' ? 'Bỏ qua, tôi sẽ làm sau' : 'Skip, I\'ll do it later'}
                </ActionButton>
                <ActionButton
                  $primary
                  onClick={handleSetupProfile}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {language === 'vi' ? 'Thiết lập hồ sơ công ty' : 'Set up company profile'}
                </ActionButton>
              </ModalActions>
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default CompanyProfileSetupModal;