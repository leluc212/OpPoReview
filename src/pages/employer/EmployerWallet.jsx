import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Button, Input } from '../../components/FormElements';
import { 
  Wallet as WalletIcon, 
  TrendingUp, 
  TrendingDown,
  Download, 
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  DollarSign,
  Calendar,
  Plus,
  Building2,
  Users,
  Eye,
  EyeOff,
  X,
  CheckCircle,
  Zap,
  Banknote,
  Send,
  AlertCircle,
  Clock,
  BarChart3,
  FileText
} from 'lucide-react';

const WalletContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 12px;
    
    svg {
      width: 36px;
      height: 36px;
      color: ${props => props.theme.colors.primary};
    }
  }
  
  .header-actions {
    display: flex;
    gap: 12px;
  }
`;

const BalanceCard = styled(motion.div)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 48px;
  margin-bottom: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px -10px ${props => props.theme.colors.primary}40;
  
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
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }
  
  .balance-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
    
    .balance-info {
      flex: 1;
      
      .label {
        font-size: 14px;
        font-weight: 500;
        opacity: 0.85;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .amount-wrapper {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 12px;
        
        .amount {
          font-size: 52px;
          font-weight: 800;
          letter-spacing: -1px;
          line-height: 1;
        }
        
        .toggle-balance {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          
          &:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
          }
        }
      }
      
      .last-updated {
        font-size: 13px;
        opacity: 0.75;
        display: flex;
        align-items: center;
        gap: 6px;
        
        svg {
          width: 14px;
          height: 14px;
        }
      }
    }
    
    .wallet-icon {
      width: 80px;
      height: 80px;
      opacity: 0.15;
    }
  }
  
  .balance-actions {
    display: flex;
    gap: 12px;
    position: relative;
    z-index: 1;
  }
`;

const ActionButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  padding: 12px 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 20px 24px;
  border: 2px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s;
  box-shadow: ${props => props.theme.shadows.sm};
  border-left: 3px solid ${props => {
    const colorMap = {
      'success': props.theme.colors.success,
      'error': props.theme.colors.error,
      'warning': props.theme.colors.warning,
      'primary': props.theme.colors.primary
    };
    return colorMap[props.$color] || props.theme.colors.primary;
  }};
  
  &:hover {
    border-color: ${props => {
      const colorMap = {
        'success': props.theme.colors.success,
        'error': props.theme.colors.error,
        'warning': props.theme.colors.warning,
        'primary': props.theme.colors.primary
      };
      return colorMap[props.$color] || props.theme.colors.primary;
    }};
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  .stat-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    
    .icon {
      width: 48px;
      height: 48px;
      border-radius: ${props => props.theme.borderRadius.lg};
      background: ${props => {
        const colorMap = {
          'success': props.theme.colors.successBg,
          'error': props.theme.colors.errorBg,
          'warning': props.theme.colors.warningBg,
          'primary': props.theme.colors.primary + '15'
        };
        return colorMap[props.$color] || props.theme.colors.primary + '15';
      }};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      svg {
        width: 24px;
        height: 24px;
        color: ${props => {
          const colorMap = {
            'success': props.theme.colors.success,
            'error': props.theme.colors.error,
            'warning': props.theme.colors.warning,
            'primary': props.theme.colors.primary
          };
          return colorMap[props.$color] || props.theme.colors.primary;
        }};
      }
    }
    
    .stat-info {
      flex: 1;
      min-width: 0;
      
      .stat-label {
        font-size: 13px;
        color: ${props => props.theme.colors.textLight};
        font-weight: 500;
        margin-bottom: 6px;
      }
      
      .stat-value {
        font-size: 24px;
        font-weight: 800;
        color: ${props => props.theme.colors.text};
        letter-spacing: -0.5px;
      }
    }
  }
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  
  .filter-group {
    display: flex;
    gap: 8px;
    flex: 1;
  }
`;

const FilterButton = styled(motion.button)`
  padding: 10px 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgDark};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  box-shadow: ${props => props.$active ? props.theme.shadows.sm : 'none'};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 32px;
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary}30;
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    
    h2 {
      font-size: 22px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
      display: flex;
      align-items: center;
      gap: 12px;
      
      svg {
        width: 24px;
        height: 24px;
        color: ${props => props.theme.colors.primary};
      }
    }
    
    .header-action {
      display: flex;
      gap: 8px;
    }
  }
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 24px;
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
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.bgDark};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.theme.colors.primary};
    }
  }
`;

const TransactionItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  transition: all 0.3s;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover {
    border-color: ${props => props.$type === 'income' ? props.theme.colors.success : props.theme.colors.error};
    transform: translateX(8px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  .transaction-info {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    
    .icon {
      width: 52px;
      height: 52px;
      border-radius: ${props => props.theme.borderRadius.lg};
      background: ${props => props.$type === 'income' ? props.theme.colors.successBg : props.theme.colors.errorBg};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      svg {
        width: 24px;
        height: 24px;
        color: ${props => props.$type === 'income' ? props.theme.colors.success : props.theme.colors.error};
      }
    }
    
    .details {
      flex: 1;
      min-width: 0;
      
      h4 {
        font-size: 16px;
        font-weight: 700;
        color: ${props => props.theme.colors.text};
        margin-bottom: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      p {
        font-size: 14px;
        color: ${props => props.theme.colors.textLight};
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
  }
  
  .transaction-amount {
    text-align: right;
    flex-shrink: 0;
    
    .amount {
      font-size: 20px;
      font-weight: 800;
      color: ${props => props.$type === 'income' ? props.theme.colors.success : props.theme.colors.error};
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }
    
    .date {
      font-size: 13px;
      color: ${props => props.theme.colors.textLight};
      display: flex;
      align-items: center;
      gap: 4px;
      justify-content: flex-end;
      
      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
`;

const ReceiptCard = styled(motion.div)`
  padding: 20px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  margin-bottom: 12px;
  transition: all 0.3s;
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
    cursor: pointer;
  }
  
  .receipt-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    
    h4 {
      font-size: 15px;
      font-weight: 700;
      color: ${props => props.theme.colors.text};
      display: flex;
      align-items: center;
      gap: 8px;
      
      svg {
        width: 18px;
        height: 18px;
        color: ${props => props.theme.colors.primary};
      }
    }
    
    .download-btn {
      color: ${props => props.theme.colors.primary};
      cursor: pointer;
      padding: 8px;
      border-radius: ${props => props.theme.borderRadius.md};
      background: ${props => props.theme.colors.primary}10;
      transition: all 0.2s;
      
      &:hover {
        background: ${props => props.theme.colors.primary}20;
        transform: scale(1.1);
      }
    }
  }
  
  .receipt-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    
    .amount {
      font-weight: 700;
      color: ${props => props.theme.colors.text};
      font-size: 15px;
    }
  }
`;

// ── Deposit Modal Styled Components ──────────────────────────────────────────

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(10, 18, 40, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalBox = styled(motion.div)`
  background: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 460px;
  box-shadow:
    0 32px 64px -12px rgba(14, 57, 149, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.08);
  overflow: hidden;
`;

const ModalHead = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  padding: 28px 28px 24px;
  position: relative;
  color: white;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 180px;
    height: 180px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }
`;

const ModalHeadIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;

  svg { width: 26px; height: 26px; }
`;

const ModalHeadTitle = styled.div`
  position: relative;
  z-index: 1;
  h2 {
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 4px;
  }
  p {
    font-size: 13px;
    opacity: 0.8;
  }
`;

const ModalCloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 2;

  &:hover { background: rgba(255, 255, 255, 0.28); transform: scale(1.1); }
  svg { width: 18px; height: 18px; }
`;

const ModalBody = styled.div`
  padding: 24px 28px 8px;
`;

const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #94a3b8;
  margin-bottom: 12px;
`;

const QuickAmountsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 20px;
`;

const QuickAmountBtn = styled.button`
  padding: 11px 6px;
  border: 2px solid ${props => props.$selected ? '#1e40af' : '#e2e8f0'};
  background: ${props => props.$selected ? '#EFF6FF' : '#f8fafc'};
  color: ${props => props.$selected ? '#1e40af' : '#475569'};
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;

  &:hover {
    border-color: #1e40af;
    background: #EFF6FF;
    color: #1e40af;
    transform: translateY(-1px);
  }
`;

const AmountInputWrapper = styled.div`
  position: relative;
  margin-bottom: 8px;
`;

const CurrencyLabel = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: 700;
  color: #94a3b8;
  pointer-events: none;
`;

const DepositInput = styled.input`
  width: 100%;
  padding: 14px 60px 14px 18px;
  border: 2px solid ${props => props.$invalid ? '#ef4444' : '#e2e8f0'};
  border-radius: 14px;
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
  letter-spacing: 0.5px;

  &:focus {
    border-color: #1e40af;
    box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.1);
  }

  &::placeholder {
    color: #cbd5e1;
    font-weight: 500;
    font-size: 16px;
  }
`;

const AmountPreview = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-bottom: 20px;
  min-height: 18px;
  padding-left: 4px;
`;

const ModalFooter = styled.div`
  padding: 16px 28px 28px;
  display: flex;
  gap: 12px;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 14px;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #e2e8f0; color: #475569; }
`;

const ConfirmBtn = styled(motion.button)`
  flex: 2;
  padding: 14px;
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.35);
  transition: box-shadow 0.2s;

  &:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; }
  &:not(:disabled):hover { box-shadow: 0 8px 24px rgba(30, 64, 175, 0.5); }
  svg { width: 18px; height: 18px; }
`;

const SuccessState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 28px 48px;
  text-align: center;

  svg {
    width: 64px;
    height: 64px;
    color: #10b981;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 22px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 8px;
  }

  p {
    font-size: 15px;
    color: #64748b;
  }

  .amount-text {
    font-size: 28px;
    font-weight: 900;
    color: #10b981;
    margin: 8px 0 4px;
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;
  border-radius: 50%;
`;

// ── Withdraw Modal Extra Components ───────────────────────────────────────────

const WithdrawModalHead = styled(ModalHead)`
  background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
`;

const WithdrawConfirmBtn = styled(ConfirmBtn)`
  background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
  box-shadow: 0 4px 16px rgba(180, 83, 9, 0.35);
  &:not(:disabled):hover { box-shadow: 0 8px 24px rgba(180, 83, 9, 0.5); }
`;

const WithdrawInput = styled.input`
  width: 100%;
  padding: 13px 18px;
  border: 2px solid ${props => props.$invalid ? '#ef4444' : '#e2e8f0'};
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
  background: #ffffff;
  &:focus {
    border-color: #b45309;
    box-shadow: 0 0 0 4px rgba(180, 83, 9, 0.1);
  }
  &::placeholder { color: #cbd5e1; font-weight: 400; }
`;

const WithdrawAmountInput = styled(DepositInput)`
  &:focus {
    border-color: #b45309;
    box-shadow: 0 0 0 4px rgba(180, 83, 9, 0.1);
  }
`;

const WithdrawQuickBtn = styled(QuickAmountBtn)`
  ${props => props.$selected && `
    border-color: #b45309 !important;
    background: #FEF3C7 !important;
    color: #b45309 !important;
  `}
  &:hover {
    border-color: #b45309;
    background: #FEF3C7;
    color: #b45309;
  }
`;

const BalanceHint = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: ${props => props.$error ? '#ef4444' : '#64748b'};
  margin-bottom: 16px;
  padding: 8px 12px;
  background: ${props => props.$error ? '#fef2f2' : '#f8fafc'};
  border-radius: 10px;
  border: 1px solid ${props => props.$error ? '#fecaca' : '#e2e8f0'};
  svg { width: 14px; height: 14px; flex-shrink: 0; }
`;

const Divider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0 20px;
`;

const WithdrawSuccessState = styled(SuccessState)`
  svg { color: #b45309; }
  .amount-text { color: #b45309; }
`;

const EmployerWallet = () => {
  const { language } = useLanguage();
  
  // Initialize wallet if not exists
  const initializeWallet = () => {
    const walletData = localStorage.getItem('employer_wallet');
    if (!walletData) {
      const initialWallet = {
        balance: 500000, // 500,000 VNĐ số dư ban đầu
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('employer_wallet', JSON.stringify(initialWallet));
      return initialWallet.balance;
    }
    return JSON.parse(walletData).balance;
  };

  const [balance, setBalance] = useState(() => initializeWallet());
  const [showBalance, setShowBalance] = useState(false);
  const [filterType, setFilterType] = useState('all');

  // Deposit modal state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositRawAmount, setDepositRawAmount] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const depositInputRef = useRef(null);

  // Withdraw modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawRawAmount, setWithdrawRawAmount] = useState('');
  const [withdrawBankName, setWithdrawBankName] = useState('');
  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState('');
  const [withdrawAccountName, setWithdrawAccountName] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const withdrawInputRef = useRef(null);

  const QUICK_AMOUNTS = [100000, 200000, 500000, 1000000, 2000000, 5000000];

  const formatQuickAmount = (n) => {
    if (n >= 1000000) return (n / 1000000) + 'M';
    return (n / 1000) + 'K';
  };

  const parsedDepositAmount = parseInt(depositRawAmount.replace(/\D/g, '') || '0');
  const formattedDepositPreview = parsedDepositAmount > 0
    ? parsedDepositAmount.toLocaleString('vi-VN') + ' VND'
    : '';

  const parsedWithdrawAmount = parseInt(withdrawRawAmount.replace(/\D/g, '') || '0');
  const withdrawExceedsBalance = parsedWithdrawAmount > balance;
  const withdrawFormValid =
    parsedWithdrawAmount > 0 &&
    !withdrawExceedsBalance;

  // Load transactions from localStorage
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('employer_transactions');
    if (saved) {
      return JSON.parse(saved);
    }
    // Mock data fallback
    return [
      {
        id: 1,
        type: 'income',
        description: language === 'vi' ? 'Nạp tiền ban đầu' : 'Initial deposit',
        amount: 500000,
        date: new Date().toISOString(),
        balanceAfter: 500000
      }
    ];
  });

  // Reload balance from localStorage
  const reloadBalance = () => {
    const walletData = localStorage.getItem('employer_wallet');
    if (walletData) {
      const balance = JSON.parse(walletData).balance;
      setBalance(balance);
    }
  };

  // Reload transactions from localStorage
  const reloadTransactions = () => {
    const saved = localStorage.getItem('employer_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  };

  // Auto-reload when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        reloadBalance();
        reloadTransactions();
      }
    };

    const handleFocus = () => {
      reloadBalance();
      reloadTransactions();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const receipts = [
    { id: 1, title: language === 'vi' ? 'Hóa đơn #2026021401' : 'Invoice #2026021401', date: '14/02/2026', amount: '2,500,000 VND' },
    { id: 2, title: language === 'vi' ? 'Hóa đơn #2026021201' : 'Invoice #2026021201', date: '12/02/2026', amount: '3,000,000 VND' },
    { id: 3, title: language === 'vi' ? 'Hóa đơn #2026021001' : 'Invoice #2026021001', date: '10/02/2026', amount: '1,800,000 VND' }
  ];

  const formatCurrency = (amount) => {
    // Always use vi-VN locale for VND currency with VND text instead of symbol
    const formatted = new Intl.NumberFormat('vi-VN').format(amount);
    return formatted + ' VND';
  };

  const handleDownloadReceipt = (receiptId) => {
    alert(language === 'vi' ? `Tải xuống hóa đơn #${receiptId}` : `Download invoice #${receiptId}`);
  };

  const handleWithdraw = () => {
    setWithdrawRawAmount('');
    setWithdrawBankName('');
    setWithdrawAccountNumber('');
    setWithdrawAccountName('');
    setWithdrawSuccess(false);
    setWithdrawLoading(false);
    setShowWithdrawModal(true);
    setTimeout(() => withdrawInputRef.current?.focus(), 120);
  };

  const handleConfirmWithdraw = () => {
    if (!withdrawFormValid) return;
    setWithdrawLoading(true);
    setTimeout(() => {
      const walletData = JSON.parse(localStorage.getItem('employer_wallet') || '{"balance": 0}');
      const newBalance = (walletData.balance || 0) - parsedWithdrawAmount;
      walletData.balance = newBalance;
      localStorage.setItem('employer_wallet', JSON.stringify(walletData));

      const transaction = {
        id: Date.now(),
        type: 'debit',
        amount: parsedWithdrawAmount,
        description: language === 'vi'
          ? `Rút tiền → ${withdrawBankName} (${withdrawAccountNumber})`
          : `Withdraw → ${withdrawBankName} (${withdrawAccountNumber})`,
        date: new Date().toISOString(),
        balanceAfter: newBalance
      };

      const savedTxs = JSON.parse(localStorage.getItem('employer_transactions') || '[]');
      savedTxs.unshift(transaction);
      localStorage.setItem('employer_transactions', JSON.stringify(savedTxs));

      setBalance(newBalance);
      reloadTransactions();
      setWithdrawLoading(false);
      setWithdrawSuccess(true);

      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawSuccess(false);
      }, 2400);
    }, 900);
  };

  const handleWithdrawAmountInput = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setWithdrawRawAmount(raw);
  };

  const handleDeposit = () => {
    setDepositRawAmount('');
    setDepositSuccess(false);
    setDepositLoading(false);
    setShowDepositModal(true);
    setTimeout(() => depositInputRef.current?.focus(), 120);
  };

  const handleConfirmDeposit = () => {
    const amount = parseInt(depositRawAmount.replace(/\D/g, '') || '0');
    if (!amount || amount <= 0) return;

    setDepositLoading(true);

    setTimeout(() => {
      const walletData = JSON.parse(localStorage.getItem('employer_wallet') || '{"balance": 0}');
      const newBalance = (walletData.balance || 0) + amount;
      walletData.balance = newBalance;
      localStorage.setItem('employer_wallet', JSON.stringify(walletData));

      const transaction = {
        id: Date.now(),
        type: 'credit',
        amount: amount,
        description: language === 'vi' ? 'Nạp tiền vào ví' : 'Wallet deposit',
        date: new Date().toISOString(),
        balanceAfter: newBalance
      };

      const savedTxs = JSON.parse(localStorage.getItem('employer_transactions') || '[]');
      savedTxs.unshift(transaction);
      localStorage.setItem('employer_transactions', JSON.stringify(savedTxs));

      setBalance(newBalance);
      reloadTransactions();
      setDepositLoading(false);
      setDepositSuccess(true);

      setTimeout(() => {
        setShowDepositModal(false);
        setDepositSuccess(false);
      }, 2200);
    }, 900);
  };

  const handleDepositAmountInput = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setDepositRawAmount(raw);
  };

  const handleLinkBank = () => {
    alert(language === 'vi' ? 'Liên kết ngân hàng' : 'Link bank account');
  };

  // Calculate stats
  const totalIncome = transactions
    .filter(t => t.type === 'income' || t.type === 'credit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense' || t.type === 'debit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Filter transactions based on filter type
  const filteredTransactions = filterType === 'all' 
    ? transactions 
    : transactions.filter(t => {
        if (filterType === 'income') return t.type === 'income' || t.type === 'credit';
        if (filterType === 'expense') return t.type === 'expense' || t.type === 'debit';
        return true;
      });

  return (
    <DashboardLayout role="employer" key={language}>
      <WalletContainer>
        <Header>
          <h1>
            <WalletIcon />
            {language === 'vi' ? 'Ví Điện Tử' : 'E-Wallet'}
          </h1>
        </Header>

        <BalanceCard
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="balance-header">
            <div className="balance-info">
              <div className="label">{language === 'vi' ? 'Số Dư Khả Dụng' : 'Available Balance'}</div>
              <div className="amount-wrapper">
                <div className="amount">
                  {showBalance ? formatCurrency(balance) : '••••••••'}
                </div>
                <button 
                  className="toggle-balance"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <div className="last-updated">
                <Clock />
                {language === 'vi' ? 'Cập nhật lần cuối: Hôm nay' : 'Last updated: Today'}
              </div>
            </div>
            <WalletIcon className="wallet-icon" />
          </div>
          <div className="balance-actions">
            <ActionButton 
              onClick={handleDeposit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={18} />
              {language === 'vi' ? 'Nạp Tiền' : 'Deposit'}
            </ActionButton>
            <ActionButton 
              onClick={handleWithdraw}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowUpRight size={18} />
              {language === 'vi' ? 'Rút Tiền' : 'Withdraw'}
            </ActionButton>
            <ActionButton 
              onClick={handleLinkBank}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Building2 size={18} />
              {language === 'vi' ? 'Liên Kết Ngân Hàng' : 'Link Bank'}
            </ActionButton>
          </div>
        </BalanceCard>

        <StatsGrid>
          <StatCard 
            $color="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="stat-left">
              <div className="icon">
                <TrendingUp />
              </div>
              <div className="stat-info">
                <div className="stat-label">{language === 'vi' ? 'Tổng tiền nạp' : 'Total Deposits'}</div>
                <div className="stat-value">{formatCurrency(totalIncome)}</div>
              </div>
            </div>
          </StatCard>
          
          <StatCard 
            $color="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="stat-left">
              <div className="icon">
                <TrendingDown />
              </div>
              <div className="stat-info">
                <div className="stat-label">{language === 'vi' ? 'Đã Rút Trong Tháng' : 'Total Expenses'}</div>
                <div className="stat-value">{formatCurrency(totalExpense)}</div>
              </div>
            </div>
          </StatCard>
          
          <StatCard 
            $color="primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="stat-left">
              <div className="icon">
                <BarChart3 />
              </div>
              <div className="stat-info">
                <div className="stat-label">{language === 'vi' ? 'Số lượng giao dịch' : 'Transactions'}</div>
                <div className="stat-value">{transactions.length}</div>
              </div>
            </div>
          </StatCard>
          
          <StatCard 
            $color="warning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="stat-left">
              <div className="icon">
                <FileText />
              </div>
              <div className="stat-info">
                <div className="stat-label">{language === 'vi' ? 'Hóa đơn' : 'Invoices'}</div>
                <div className="stat-value">{receipts.length}</div>
              </div>
            </div>
          </StatCard>
        </StatsGrid>

        <ContentSection>
          <div>
            <Card
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card-header">
                <h2>
                  <Calendar />
                  {language === 'vi' ? 'Lịch Sử Giao Dịch' : 'Transaction History'}
                </h2>
                <div className="header-action">
                  <Button 
                    $variant="secondary" 
                    $size="small"
                  >
                    <Download style={{ width: '16px', height: '16px' }} />
                    {language === 'vi' ? 'Xuất' : 'Export'}
                  </Button>
                </div>
              </div>
              
              <FilterBar>
                <div className="filter-group">
                  <FilterButton 
                    $active={filterType === 'all'}
                    onClick={() => setFilterType('all')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {language === 'vi' ? 'Tất Cả' : 'All'}
                  </FilterButton>
                  <FilterButton 
                    $active={filterType === 'income'}
                    onClick={() => setFilterType('income')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {language === 'vi' ? 'Nạp tiền' : 'Deposits'}
                  </FilterButton>
                  <FilterButton 
                    $active={filterType === 'expense'}
                    onClick={() => setFilterType('expense')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {language === 'vi' ? 'Rút tiền' : 'Withdrawals'}
                  </FilterButton>
                </div>
                <Input 
                  type="date" 
                  style={{ width: 'auto', padding: '10px 16px' }} 
                />
              </FilterBar>
              
              <TransactionList>
                {filteredTransactions.map((transaction, index) => (
                  <TransactionItem 
                    key={transaction.id} 
                    $type={transaction.type === 'debit' ? 'expense' : (transaction.type === 'credit' ? 'income' : transaction.type)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="transaction-info">
                      <div className="icon">
                        {(transaction.type === 'income' || transaction.type === 'credit') ? <ArrowDownLeft /> : <ArrowUpRight />}
                      </div>
                      <div className="details">
                        <h4>{transaction.description || transaction.title}</h4>
                        <p>
                          <Receipt style={{ width: '14px', height: '14px' }} />
                          {transaction.description}
                        </p>
                      </div>
                    </div>
                    <div className="transaction-amount">
                      <div className="amount">
                        {(transaction.type === 'income' || transaction.type === 'credit') ? '+' : '-'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </div>
                      <div className="date">
                        <Calendar />
                        {transaction.date 
                          ? new Date(transaction.date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')
                          : ''}
                      </div>
                    </div>
                  </TransactionItem>
                ))}
              </TransactionList>
            </Card>
          </div>

          <div>
            <Card
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="card-header">
                <h2>
                  <Receipt />
                  {language === 'vi' ? 'Hóa Đơn Điện Tử' : 'Electronic Invoices'}
                </h2>
              </div>
              
              {receipts.map((receipt, index) => (
                <ReceiptCard 
                  key={receipt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="receipt-header">
                    <h4>
                      <FileText />
                      {receipt.title}
                    </h4>
                    <Download 
                      className="download-btn" 
                      style={{ width: '18px', height: '18px' }}
                      onClick={() => handleDownloadReceipt(receipt.id)}
                    />
                  </div>
                  <div className="receipt-info">
                    <span>{receipt.date}</span>
                    <span className="amount">{receipt.amount}</span>
                  </div>
                </ReceiptCard>
              ))}
              
              <Button 
                $variant="ghost" 
                $fullWidth 
                style={{ marginTop: '16px' }}
              >
                {language === 'vi' ? 'Xem Tất Cả Hóa Đơn' : 'View All Invoices'}
              </Button>
            </Card>
          </div>
        </ContentSection>
      </WalletContainer>

      {/* ── Withdraw Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showWithdrawModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget && !withdrawLoading) setShowWithdrawModal(false); }}
          >
            <ModalBox
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 380 }}
            >
              {withdrawSuccess ? (
                <WithdrawSuccessState
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', damping: 16, stiffness: 260 }}
                  >
                    <CheckCircle />
                  </motion.div>
                  <h3>{language === 'vi' ? 'Yêu cầu rút tiền thành công!' : 'Withdrawal Submitted!'}</h3>
                  <div className="amount-text">
                    -{parsedWithdrawAmount.toLocaleString('vi-VN')} VND
                  </div>
                  <p>{language === 'vi' ? 'Tiền sẽ được chuyển về tài khoản của bạn trong 1–3 ngày làm việc.' : 'Funds will be transferred within 1–3 business days.'}</p>
                </WithdrawSuccessState>
              ) : (
                <>
                  <WithdrawModalHead>
                    <ModalCloseBtn onClick={() => !withdrawLoading && setShowWithdrawModal(false)}>
                      <X />
                    </ModalCloseBtn>
                    <ModalHeadIcon>
                      <Send />
                    </ModalHeadIcon>
                    <ModalHeadTitle>
                      <h2>{language === 'vi' ? 'Rút tiền' : 'Withdraw Funds'}</h2>
                      <p>{language === 'vi' ? 'Chuyển tiền về tài khoản ngân hàng' : 'Transfer funds to your bank account'}</p>
                    </ModalHeadTitle>
                  </WithdrawModalHead>

                  <ModalBody>
                    {/* Amount */}
                    <SectionLabel>{language === 'vi' ? 'Chọn nhanh' : 'Quick select'}</SectionLabel>
                    <QuickAmountsGrid>
                      {QUICK_AMOUNTS.map(amt => (
                        <WithdrawQuickBtn
                          key={amt}
                          $selected={parsedWithdrawAmount === amt}
                          onClick={() => setWithdrawRawAmount(String(amt))}
                        >
                          {formatQuickAmount(amt)}
                        </WithdrawQuickBtn>
                      ))}
                    </QuickAmountsGrid>

                    <SectionLabel>{language === 'vi' ? 'Số tiền rút' : 'Withdraw amount'}</SectionLabel>
                    <AmountInputWrapper>
                      <WithdrawAmountInput
                        ref={withdrawInputRef}
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={withdrawRawAmount ? parseInt(withdrawRawAmount).toLocaleString('vi-VN') : ''}
                        onChange={handleWithdrawAmountInput}
                        $invalid={withdrawRawAmount !== '' && (parsedWithdrawAmount <= 0 || withdrawExceedsBalance)}
                      />
                      <CurrencyLabel>VND</CurrencyLabel>
                    </AmountInputWrapper>

                    <BalanceHint $error={withdrawExceedsBalance}>
                      {withdrawExceedsBalance ? (
                        <><AlertCircle />{language === 'vi' ? 'Vượt số dư khả dụng!' : 'Exceeds available balance!'}</>
                      ) : (
                        <><AlertCircle />{language === 'vi' ? `Số dư khả dụng: ${balance.toLocaleString('vi-VN')} VND` : `Available: ${balance.toLocaleString('vi-VN')} VND`}</>
                      )}
                    </BalanceHint>

                  </ModalBody>

                  <ModalFooter>
                    <CancelBtn onClick={() => !withdrawLoading && setShowWithdrawModal(false)}>
                      {language === 'vi' ? 'Hủy' : 'Cancel'}
                    </CancelBtn>
                    <WithdrawConfirmBtn
                      onClick={handleConfirmWithdraw}
                      disabled={withdrawLoading || !withdrawFormValid}
                      whileTap={{ scale: 0.97 }}
                    >
                      {withdrawLoading ? (
                        <LoadingSpinner
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
                        />
                      ) : (
                        <>
                          <Send />
                          {language === 'vi' ? 'Xác nhận rút tiền' : 'Confirm Withdrawal'}
                        </>
                      )}
                    </WithdrawConfirmBtn>
                  </ModalFooter>
                </>
              )}
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* ── Deposit Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDepositModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget && !depositLoading) setShowDepositModal(false); }}
          >
            <ModalBox
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 380 }}
            >
              {depositSuccess ? (
                <SuccessState
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', damping: 16, stiffness: 260 }}
                  >
                    <CheckCircle />
                  </motion.div>
                  <h3>{language === 'vi' ? 'Nạp tiền thành công!' : 'Deposit Successful!'}</h3>
                  <div className="amount-text">
                    +{parsedDepositAmount.toLocaleString('vi-VN')} VND
                  </div>
                  <p>{language === 'vi' ? 'Số dư ví của bạn đã được cập nhật.' : 'Your wallet balance has been updated.'}</p>
                </SuccessState>
              ) : (
                <>
                  {/* Header */}
                  <ModalHead>
                    <ModalCloseBtn onClick={() => !depositLoading && setShowDepositModal(false)}>
                      <X />
                    </ModalCloseBtn>
                    <ModalHeadIcon>
                      <Banknote />
                    </ModalHeadIcon>
                    <ModalHeadTitle>
                      <h2>{language === 'vi' ? 'Nạp tiền vào ví' : 'Deposit to Wallet'}</h2>
                      <p>{language === 'vi' ? 'Chọn hoặc nhập số tiền muốn nạp' : 'Select or enter the amount to deposit'}</p>
                    </ModalHeadTitle>
                  </ModalHead>

                  {/* Body */}
                  <ModalBody>
                    <SectionLabel>{language === 'vi' ? 'Chọn nhanh' : 'Quick select'}</SectionLabel>
                    <QuickAmountsGrid>
                      {QUICK_AMOUNTS.map(amt => (
                        <QuickAmountBtn
                          key={amt}
                          $selected={parseInt(depositRawAmount.replace(/\D/g, '') || '0') === amt}
                          onClick={() => setDepositRawAmount(String(amt))}
                        >
                          {formatQuickAmount(amt)}
                        </QuickAmountBtn>
                      ))}
                    </QuickAmountsGrid>

                    <SectionLabel>{language === 'vi' ? 'Nhập số tiền' : 'Enter amount'}</SectionLabel>
                    <AmountInputWrapper>
                      <DepositInput
                        ref={depositInputRef}
                        type="text"
                        inputMode="numeric"
                        placeholder={language === 'vi' ? '0' : '0'}
                        value={depositRawAmount ? parseInt(depositRawAmount).toLocaleString('vi-VN') : ''}
                        onChange={handleDepositAmountInput}
                        $invalid={depositRawAmount !== '' && parsedDepositAmount <= 0}
                      />
                      <CurrencyLabel>VND</CurrencyLabel>
                    </AmountInputWrapper>
                    <AmountPreview>
                      {formattedDepositPreview
                        ? `≈ ${formattedDepositPreview}`
                        : (language === 'vi' ? 'Tối thiểu 1.000 VND' : 'Minimum 1,000 VND')}
                    </AmountPreview>
                  </ModalBody>

                  {/* Footer */}
                  <ModalFooter>
                    <CancelBtn onClick={() => !depositLoading && setShowDepositModal(false)}>
                      {language === 'vi' ? 'Huỷ' : 'Cancel'}
                    </CancelBtn>
                    <ConfirmBtn
                      onClick={handleConfirmDeposit}
                      disabled={depositLoading || parsedDepositAmount <= 0}
                      whileTap={{ scale: 0.97 }}
                    >
                      {depositLoading ? (
                        <LoadingSpinner
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
                        />
                      ) : (
                        <>
                          <Zap />
                          {language === 'vi' ? 'Xác nhận nạp tiền' : 'Confirm Deposit'}
                        </>
                      )}
                    </ConfirmBtn>
                  </ModalFooter>
                </>
              )}
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default EmployerWallet;
