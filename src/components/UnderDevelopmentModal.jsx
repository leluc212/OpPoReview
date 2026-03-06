import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import Modal from './Modal';
import { useLanguage } from '../context/LanguageContext';

const DevMessage = styled(motion.div)`
  text-align: center;
  padding: 32px 24px;
  
  .icon-wrapper {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 146, 60, 0.15) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 2s ease-in-out infinite;
    position: relative;
    
    svg {
      width: 40px;
      height: 40px;
      color: #F59E0B;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
    }
  }
  
  h3 {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 12px;
  }
  
  p {
    font-size: 15px;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.6;
    margin-bottom: 8px;
  }
`;

const Button = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 14px 24px;
  background: #4A90E2;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #3A7BC8;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(74, 144, 226, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const UnderDevelopmentModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="small"
    >
      <DevMessage
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="icon-wrapper">
          <Construction />
        </div>
        <h3>{t.underDevelopment.title}</h3>
        <p>{t.underDevelopment.message}</p>
        <Button
          type="button"
          onClick={onClose}
        >
          {t.underDevelopment.button}
        </Button>
      </DevMessage>
    </Modal>
  );
};

export default UnderDevelopmentModal;
