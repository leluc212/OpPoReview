import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Wallet as WalletIcon, 
  TrendingUp, 
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
  AlertCircle
} from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
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
    width: 24px;
    height: 24px;
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

const BalanceCard = styled(motion.div)`
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px ${props => props.theme.colors.primary}30;
  border: 2px solid rgba(255, 255, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }
`;

const BalanceContent = styled.div`
  position: relative;
  z-index: 1;
`;

const BalanceLabel = styled.div`
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const BalanceAmountWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const BalanceAmount = styled.div`
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -1px;
`;

const EyeButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }
  
  svg {
    width: 22px;
    height: 22px;
  }
`;

const BalanceActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)`
  padding: 14px 24px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.04);
  transition: all 0.22s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.12);
    border-color: #BFDBFE;
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
      color: #1e40af;
    }
  }
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TransactionItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  background: #ffffff;
  border-radius: 16px;
  border: 1.5px solid #E8EFFF;
  transition: all 0.22s ease;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.04);
  
  &:hover {
    background: #f8fafc;
    border-color: ${props => props.$type === 'income' ? '#86efac' : '#fca5a5'};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
`;

const TransactionIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: ${props => props.$type === 'income' ? '#dcfce7' : '#fee2e2'};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${props => props.$type === 'income' ? '#bbf7d0' : '#fecaca'};
  
  svg {
    width: 22px;
    height: 22px;
    color: ${props => props.$type === 'income' ? '#16a34a' : '#ef4444'};
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const TransactionDetails = styled.div`
  .title {
    font-size: 15px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
  }
  
  .date {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const TransactionAmount = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: ${props => props.$type === 'income' ? props.theme.colors.success : props.theme.colors.error};
  background: ${props => props.$type === 'income' ? props.theme.colors.successBg : props.theme.colors.errorBg};
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid ${props => props.$type === 'income' ? props.theme.colors.success + '30' : props.theme.colors.error + '30'};
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StatItem = styled(motion.div)`
  padding: 24px;
  background: ${props => props.theme.colors.bgLight};
  border-radius: 16px;
  border-left: 5px solid ${props => props.$color || props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(6px);
    box-shadow: ${props => props.theme.shadows.md};
    border-left-width: 8px;
  }
  
  .label {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 8px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .value {
    font-size: 24px;
    font-weight: 900;
    color: ${props => props.theme.colors.text};
  }
`;

const ReceiptsList = styled.div`
  display: grid;
  gap: 16px;
`;

const ReceiptItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  border: 1.5px solid #E8EFFF;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.04);
  transition: all 0.22s ease;
  
  &:hover {
    border-color: #BFDBFE;
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.12);
    transform: translateY(-2px);
  }
`;

const ReceiptInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
    .icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #EFF6FF;
    border: 1.5px solid #BFDBFE;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 20px;
      height: 20px;
      color: #1e40af;
    }
  }
  
  .details {
    .title {
      font-size: 14px;
      font-weight: 600;
      color: ${props => props.theme.colors.text};
      margin-bottom: 2px;
    }
    
    .date {
      font-size: 12px;
      color: ${props => props.theme.colors.textLight};
    }
  }
`;

const DownloadButton = styled(motion.button)`
  padding: 10px 20px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px ${props => props.theme.colors.primary}30;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${props => props.theme.colors.primary}40;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.textLight};
  
  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
    opacity: 0.3;
  }
  
  p {
    font-size: 14px;
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
    { id: 1, title: language === 'vi' ? 'Hóa đơn #2026021401' : 'Invoice #2026021401', date: '14/02/2026' },
    { id: 2, title: language === 'vi' ? 'Hóa đơn #2026021201' : 'Invoice #2026021201', date: '12/02/2026' },
    { id: 3, title: language === 'vi' ? 'Hóa đơn #2026021001' : 'Invoice #2026021001', date: '10/02/2026' }
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

  return (
    <DashboardLayout role="employer" key={language}>
      <PageContainer>
        <PageHeader>
          <PageTitleGroup>
            <PageIconBox>
              <WalletIcon />
            </PageIconBox>
            <PageTitleText>
              <h1>{language === 'vi' ? 'Ví điện tử' : 'Wallet'}</h1>
              <p>{language === 'vi' ? 'Quản lý tài chính và giao dịch của bạn' : 'Manage your finances and transactions'}</p>
            </PageTitleText>
          </PageTitleGroup>
        </PageHeader>

        <BalanceCard
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BalanceContent>
            <BalanceLabel>
              <WalletIcon />
              {language === 'vi' ? 'Số dư khả dụng' : 'Available balance'}
            </BalanceLabel>
            <BalanceAmountWrapper>
              <BalanceAmount>{showBalance ? formatCurrency(balance) : '******** VND'}</BalanceAmount>
              <EyeButton onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? <EyeOff /> : <Eye />}
              </EyeButton>
            </BalanceAmountWrapper>
            <BalanceActions>
              <ActionButton 
                onClick={handleDeposit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={18} />
                {language === 'vi' ? 'Nạp tiền' : 'Deposit'}
              </ActionButton>
              <ActionButton 
                onClick={handleWithdraw}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowUpRight size={18} />
                {language === 'vi' ? 'Rút tiền' : 'Withdraw'}
              </ActionButton>
              <ActionButton 
                onClick={handleLinkBank}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Building2 size={18} />
                {language === 'vi' ? 'Liên kết ngân hàng' : 'Link bank'}
              </ActionButton>
            </BalanceActions>
          </BalanceContent>
        </BalanceCard>

        <Grid>
          {/* Transactions */}
          <Card
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3>
              <Calendar />
              {language === 'vi' ? 'Lịch sử giao dịch' : 'Transaction History'}
            </h3>
            <TransactionList>
              {transactions.map((transaction, index) => (
                <TransactionItem 
                  key={transaction.id}
                  $type={transaction.type === 'debit' ? 'expense' : (transaction.type === 'credit' ? 'income' : transaction.type)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + (index * 0.05) }}
                >
                  <TransactionInfo>
                    <TransactionIcon $type={transaction.type === 'debit' ? 'expense' : (transaction.type === 'credit' ? 'income' : transaction.type)}>
                      {(transaction.type === 'income' || transaction.type === 'credit') ? (
                        <ArrowDownLeft />
                      ) : (
                        <ArrowUpRight />
                      )}
                    </TransactionIcon>
                    <TransactionDetails>
                      <div className="title">{transaction.description || transaction.title}</div>
                      <div className="date">
                        {transaction.date 
                          ? new Date(transaction.date).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : ''}
                      </div>
                    </TransactionDetails>
                  </TransactionInfo>
                  <TransactionAmount $type={transaction.type === 'debit' ? 'expense' : (transaction.type === 'credit' ? 'income' : transaction.type)}>
                    {(transaction.type === 'income' || transaction.type === 'credit') ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </TransactionAmount>
                </TransactionItem>
              ))}
            </TransactionList>
          </Card>

          {/* Stats */}
          <Card
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3>
              <TrendingUp />
              {language === 'vi' ? 'Thống kê' : 'Statistics'}
            </h3>
            <StatsList>
              <StatItem 
                $color="#10B981"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="label">{language === 'vi' ? 'Tổng tiền nạp' : 'Total Deposits'}</div>
                <div className="value">{formatCurrency(totalIncome)}</div>
              </StatItem>
              <StatItem 
                $color="#EF4444"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="label">{language === 'vi' ? 'Tổng chi phí' : 'Total Expenses'}</div>
                <div className="value">{formatCurrency(totalExpense)}</div>
              </StatItem>

            </StatsList>
          </Card>
        </Grid>

        {/* Receipts */}
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3>
            <Receipt />
            {language === 'vi' ? 'Hóa đơn & Biên lai' : 'Invoices & Receipts'}
          </h3>
          <ReceiptsList>
            {receipts.map((receipt, index) => (
              <ReceiptItem 
                key={receipt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                whileHover={{ scale: 1.01 }}
              >
                <ReceiptInfo>
                  <div className="icon">
                    <Receipt />
                  </div>
                  <div className="details">
                    <div className="title">{receipt.title}</div>
                    <div className="date">{receipt.date}</div>
                  </div>
                </ReceiptInfo>
                <DownloadButton 
                  onClick={() => handleDownloadReceipt(receipt.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download />
                  {language === 'vi' ? 'Tải xuống' : 'Download'}
                </DownloadButton>
              </ReceiptItem>
            ))}
          </ReceiptsList>
        </Card>
      </PageContainer>

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
