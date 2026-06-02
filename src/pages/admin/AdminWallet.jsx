import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Button, Input } from '../../components/FormElements';
import {
  Wallet as WalletIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Calendar,
  Settings,
  Receipt,
  FileText,
  BarChart3,
  Eye,
  EyeOff
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
    flex-wrap: wrap;
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

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
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
      success: props.theme.colors.success,
      error: props.theme.colors.error,
      warning: props.theme.colors.warning,
      primary: props.theme.colors.primary
    };
    return colorMap[props.$color] || props.theme.colors.primary;
  }};

  &:hover {
    border-color: ${props => {
      const colorMap = {
        success: props.theme.colors.success,
        error: props.theme.colors.error,
        warning: props.theme.colors.warning,
        primary: props.theme.colors.primary
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
          success: props.theme.colors.successBg,
          error: props.theme.colors.errorBg,
          warning: props.theme.colors.warningBg,
          primary: props.theme.colors.primary + '15'
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
            success: props.theme.colors.success,
            error: props.theme.colors.error,
            warning: props.theme.colors.warning,
            primary: props.theme.colors.primary
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
        font-size: 20px;
        font-weight: 800;
        color: ${props => props.theme.colors.text};
        letter-spacing: -0.5px;
      }
    }
  }

  .stat-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .stat-change {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: ${props => props.$positive ? props.theme.colors.success : props.theme.colors.error};
      background: ${props => props.$positive ? props.theme.colors.successBg : props.theme.colors.errorBg};
      padding: 6px 10px;
      border-radius: ${props => props.theme.borderRadius.full};
      font-weight: 600;
      white-space: nowrap;

      svg {
        width: 12px;
        height: 12px;
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
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;

  .filter-group {
    display: flex;
    gap: 8px;
    flex: 1;
    flex-wrap: wrap;
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
    min-width: 0;

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
        font-size: 15px;
        font-weight: 700;
        color: ${props => props.theme.colors.text};
        margin-bottom: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        font-size: 13px;
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
    margin-left: 16px;

    .amount {
      font-size: 18px;
      font-weight: 800;
      color: ${props => props.$type === 'income' ? props.theme.colors.success : props.theme.colors.error};
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 3px 10px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'completed': return props.theme.colors.successBg;
      case 'pending':   return props.theme.colors.warningBg;
      case 'failed':    return props.theme.colors.errorBg;
      default:          return props.theme.colors.infoBg;
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'completed': return props.theme.colors.success;
      case 'pending':   return props.theme.colors.warning;
      case 'failed':    return props.theme.colors.error;
      default:          return props.theme.colors.info;
    }
  }};
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

const AdminWallet = () => {
  const { language } = useLanguage();
  const [balance, setBalance] = useState(2458750000);
  const [transactions, setTransactions] = useState([]);
  const [showBalance, setShowBalance] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  useEffect(() => {
    const savedWallet = localStorage.getItem('admin_wallet');
    const defaultTx = [
      {
        id: 1,
        type: 'income',
        title: language === 'vi' ? 'Thanh toán gói Premium - Bamos chi nhánh Thủ Đức' : 'Premium package - Bamos Thu Duc Branch',
        meta: language === 'vi' ? 'Chuyển khoản' : 'Bank transfer',
        amount: 5000000,
        date: '15/02/2026',
        time: '14:30',
        status: 'completed'
      },
      {
        id: 2,
        type: 'expense',
        title: language === 'vi' ? 'Hoàn tiền cho ứng viên Nguyễn Thị Mỹ Chi' : 'Refund to candidate Nguyen Thi My Chi',
        meta: language === 'vi' ? 'Ví điện tử' : 'E-wallet',
        amount: 500000,
        date: '14/02/2026',
        time: '10:15',
        status: 'completed'
      },
      {
        id: 3,
        type: 'income',
        title: language === 'vi' ? 'Phí dịch vụ quảng cáo - Highlands quận 9' : 'Ad service fee - Highlands Q9',
        meta: 'PayPal',
        amount: 2500000,
        date: '14/02/2026',
        time: '09:00',
        status: 'completed'
      },
      {
        id: 4,
        type: 'income',
        title: language === 'vi' ? 'Thanh toán gói Basic - Katinat quận 8' : 'Basic package - Katinat Q8',
        meta: language === 'vi' ? 'Chuyển khoản' : 'Bank transfer',
        amount: 1500000,
        date: '13/02/2026',
        time: '16:45',
        status: 'pending'
      },
      {
        id: 5,
        type: 'expense',
        title: language === 'vi' ? 'Chi phí vận hành hệ thống' : 'System operation cost',
        meta: language === 'vi' ? 'Chuyển khoản' : 'Bank transfer',
        amount: 10000000,
        date: '13/02/2026',
        time: '08:00',
        status: 'completed'
      },
      {
        id: 6,
        type: 'income',
        title: language === 'vi' ? 'Phí đăng tin - Nhiều nhà tuyển dụng' : 'Job posting fee - Multiple employers',
        meta: language === 'vi' ? 'Ví điện tử' : 'E-wallet',
        amount: 8500000,
        date: '12/02/2026',
        time: '15:20',
        status: 'completed'
      },
      {
        id: 7,
        type: 'expense',
        title: language === 'vi' ? 'Hoàn tiền do lỗi hệ thống' : 'Refund due to system error',
        meta: language === 'vi' ? 'Chuyển khoản' : 'Bank transfer',
        amount: 1200000,
        date: '12/02/2026',
        time: '11:30',
        status: 'failed'
      },
      {
        id: 8,
        type: 'income',
        title: language === 'vi' ? 'Gia hiện gói Premium - Công ty GHI' : 'Premium renewal - GHI Company',
        meta: 'PayPal',
        amount: 5000000,
        date: '11/02/2026',
        time: '13:00',
        status: 'completed'
      }
    ];

    if (savedWallet) {
      try {
        const parsed = JSON.parse(savedWallet);
        setBalance(parsed.balance !== undefined ? parsed.balance : 2458750000);
        setTransactions(parsed.transactions || defaultTx);
      } catch (e) {
        setTransactions(defaultTx);
      }
    } else {
      localStorage.setItem('admin_wallet', JSON.stringify({
        balance: 2458750000,
        transactions: defaultTx
      }));
      setTransactions(defaultTx);
    }
  }, [language]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const stats = [
    {
      label: language === 'vi' ? 'Tổng Thu Nhập (Tháng này)' : 'Total Income (This Month)',
      value: '325,500,000 VND',
      icon: TrendingUp,
      color: 'success',
      change: '+18.5%',
      positive: true
    },
    {
      label: language === 'vi' ? 'Tổng Chi Phí (Tháng này)' : 'Total Expenses (This Month)',
      value: '187,250,000 VND',
      icon: TrendingDown,
      color: 'error',
      change: '+5.2%',
      positive: false
    },
    {
      label: language === 'vi' ? 'Lợi Nhuận Ròng' : 'Net Profit',
      value: '138,250,000 VND',
      icon: DollarSign,
      color: 'primary',
      change: '+32.1%',
      positive: true
    },
    {
      label: language === 'vi' ? 'Số Giao Dịch' : 'Transactions',
      value: '8',
      icon: BarChart3,
      color: 'warning',
      change: '+3',
      positive: true
    }
  ];

  const receipts = [
    { id: 1, title: language === 'vi' ? 'H\u00f3a \u0111\u01a1n #INV-2026-001' : 'Invoice #INV-2026-001', date: '15/02/2026', amount: '5,000,000 VND' },
    { id: 2, title: language === 'vi' ? 'H\u00f3a \u0111\u01a1n #INV-2026-002' : 'Invoice #INV-2026-002', date: '14/02/2026', amount: '2,500,000 VND' },
    { id: 3, title: language === 'vi' ? 'H\u00f3a \u0111\u01a1n #INV-2026-003' : 'Invoice #INV-2026-003', date: '13/02/2026', amount: '1,500,000 VND' },
    { id: 4, title: language === 'vi' ? 'H\u00f3a \u0111\u01a1n #INV-2026-004' : 'Invoice #INV-2026-004', date: '12/02/2026', amount: '8,500,000 VND' }
  ];

  const filtered = filterType === 'all'
    ? transactions
    : transactions.filter(t => t.type === filterType);

  const statusLabel = (status) => {
    const map = {
      completed: language === 'vi' ? 'Ho\u00e0n th\u00e0nh' : 'Completed',
      pending:   language === 'vi' ? '\u0110ang x\u1eed l\u00fd' : 'Pending',
      failed:    language === 'vi' ? 'Th\u1ea5t b\u1ea1i' : 'Failed'
    };
    return map[status] || status;
  };

  return (
    <DashboardLayout role="admin" key={language}>
      <WalletContainer>

        <Header>
          <h1>
            <WalletIcon />
            {language === 'vi' ? 'V\u00ed \u0110i\u1ec7n T\u1eed N\u1ec1n T\u1ea3ng' : 'Platform E-Wallet'}
          </h1>
          <div className="header-actions">
            <Button
              $variant="secondary"
              $size="small"
              onClick={() => setIsDevModalOpen(true)}
            >
              <Settings style={{ width: '18px', height: '18px' }} />
              {language === 'vi' ? 'C\u00e0i \u0110\u1eb7t Thanh To\u00e1n' : 'Payment Settings'}
            </Button>
            <Button
              $variant="primary"
              $size="small"
              onClick={() => setIsDevModalOpen(true)}
            >
              <Download style={{ width: '18px', height: '18px' }} />
              {language === 'vi' ? 'Xu\u1ea5t B\u00e1o C\u00e1o' : 'Export Report'}
            </Button>
          </div>
        </Header>

        <BalanceCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="balance-header">
            <div className="balance-info">
              <div className="label">
                {language === 'vi' ? 'T\u1ed5ng S\u1ed1 D\u01b0 N\u1ec1n T\u1ea3ng' : 'Total Platform Balance'}
              </div>
              <div className="amount-wrapper">
                <div className="amount">
                  {showBalance ? formatCurrency(balance) : '••••••••••••'}
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
                {language === 'vi' ? 'C\u1eadp nh\u1eadt l\u1ea7n cu\u1ed1i: H\u00f4m nay, 14:30' : 'Last updated: Today, 14:30'}
              </div>
            </div>
            <WalletIcon className="wallet-icon" />
          </div>

          <div className="balance-actions">
            <ActionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDevModalOpen(true)}
            >
              <ArrowUpRight />
              {language === 'vi' ? 'R\u00fat Ti\u1ec1n' : 'Withdraw'}
            </ActionButton>
            <ActionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDevModalOpen(true)}
            >
              <CreditCard />
              {language === 'vi' ? 'C\u00e0i \u0110\u1eb7t Thanh To\u00e1n' : 'Payment Config'}
            </ActionButton>
          </div>
        </BalanceCard>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              $color={stat.color}
              $positive={stat.positive}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="stat-left">
                <div className="icon">
                  <stat.icon />
                </div>
                <div className="stat-info">
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value">{stat.value}</div>
                </div>
              </div>
              <div className="stat-right">
                <div className="stat-change">
                  {stat.positive ? <TrendingUp /> : <TrendingDown />}
                  {stat.change}
                </div>
              </div>
            </StatCard>
          ))}
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
                  {language === 'vi' ? 'L\u1ecbch S\u1eed Giao D\u1ecbch' : 'Transaction History'}
                </h2>
                <div className="header-action">
                  <Button
                    $variant="secondary"
                    $size="small"
                    onClick={() => setIsDevModalOpen(true)}
                  >
                    <Download style={{ width: '16px', height: '16px' }} />
                    {language === 'vi' ? 'Xu\u1ea5t Excel' : 'Export Excel'}
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
                    {language === 'vi' ? 'T\u1ea5t C\u1ea3' : 'All'}
                  </FilterButton>
                  <FilterButton
                    $active={filterType === 'income'}
                    onClick={() => setFilterType('income')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {language === 'vi' ? 'Thu Nh\u1eadp' : 'Income'}
                  </FilterButton>
                  <FilterButton
                    $active={filterType === 'expense'}
                    onClick={() => setFilterType('expense')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {language === 'vi' ? 'Chi Ph\u00ed' : 'Expense'}
                  </FilterButton>
                </div>
                <Input
                  type="date"
                  style={{ width: 'auto', padding: '10px 16px' }}
                />
              </FilterBar>

              <TransactionList>
                {filtered.map((tx, index) => (
                  <TransactionItem
                    key={tx.id}
                    $type={tx.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="transaction-info">
                      <div className="icon">
                        {tx.type === 'income'
                          ? <ArrowDownLeft />
                          : <ArrowUpRight />}
                      </div>
                      <div className="details">
                        <h4>{tx.title}</h4>
                        <p>
                          <CreditCard style={{ width: '14px', height: '14px' }} />
                          {tx.meta}
                          {' \u2022 '}
                          <Clock style={{ width: '14px', height: '14px' }} />
                          {tx.date} {tx.time}
                        </p>
                      </div>
                    </div>
                    <div className="transaction-amount">
                      <div className="amount">
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </div>
                      <StatusBadge $status={tx.status}>
                        {statusLabel(tx.status)}
                      </StatusBadge>
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
                  {language === 'vi' ? 'H\u00f3a \u0110\u01a1n N\u1ec1n T\u1ea3ng' : 'Platform Invoices'}
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
                      onClick={() => setIsDevModalOpen(true)}
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
                onClick={() => setIsDevModalOpen(true)}
              >
                {language === 'vi' ? 'Xem T\u1ea5t C\u1ea3 H\u00f3a \u0110\u01a1n' : 'View All Invoices'}
              </Button>
            </Card>
          </div>

        </ContentSection>
      </WalletContainer>
    </DashboardLayout>
  );
};

export default AdminWallet;
