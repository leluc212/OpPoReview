/**
 * UnderDevelopmentModal Component
 * 
 * Modal hiển thị thông báo "Đang Phát Triển" cho các chức năng chưa hoàn thiện
 * 
 * Usage:
 * ```jsx
 * import UnderDevelopmentModal from './components/UnderDevelopmentModal';
 * 
 * function MyComponent() {
 *   const [showModal, setShowModal] = useState(false);
 * 
 *   return (
 *     <>
 *       <button onClick={() => setShowModal(true)}>
 *         Click me
 *       </button>
 *       
 *       <UnderDevelopmentModal 
 *         isOpen={showModal} 
 *         onClose={() => setShowModal(false)} 
 *       />
 *     </>
 *   );
 * }
 * ```
 */

import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Construction } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ModalOverlay = styled(motion.div)`
  position: fixed; 
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(6px);
  display: flex; 
  align-items: center; 
  justify-content: center;
  z-index: 9999; 
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 44px 40px 36px;
  max-width: 480px; 
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const ModalIconWrapper = styled.div`
  width: 80px; 
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #fff5e6 0%, #fef3e2 100%);
  border: 1px solid #fde2b7;
  border-radius: 50%;
  display: flex; 
  align-items: center; 
  justify-content: center;
  box-shadow: 0 6px 14px rgba(245, 158, 11, 0.12);
`;

const ModalTitle = styled.h3`
  font-size: 24px; 
  font-weight: 700;
  color: #1e293b; 
  margin-bottom: 12px;
  letter-spacing: -0.2px;
`;

const ModalText = styled.p`
  font-size: 15px; 
  line-height: 1.7;
  color: #64748b; 
  margin-bottom: 28px;
  max-width: 380px;
  margin-left: auto;
  margin-right: auto;
`;

const ModalButton = styled(motion.button)`
  width: 100%; 
  padding: 13px 24px;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white; 
  border: none; 
  border-radius: 11px;
  font-size: 15px; 
  font-weight: 600;
  cursor: pointer; 
  font-family: inherit;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(96, 165, 250, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const UnderDevelopmentModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalIconWrapper>
              <motion.div
                animate={{ y: [0, -1.2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Construction size={40} color="#f59e0b" strokeWidth={2.25} />
              </motion.div>
            </ModalIconWrapper>
            <ModalTitle>{t.underDevelopment.title}</ModalTitle>
            <ModalText>{t.underDevelopment.message}</ModalText>
            <ModalButton
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t.underDevelopment.button}
            </ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default UnderDevelopmentModal;
