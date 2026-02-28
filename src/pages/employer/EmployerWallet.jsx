import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
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
  Users
} from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 15px;
    font-weight: 500;
  }
`;

const BalanceCard = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
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

const BalanceAmount = styled.div`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -1px;
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
  background: ${props => props.theme.colors.bgLight};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
    border-color: ${props => props.theme.colors.primary}40;
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
  gap: 16px;
`;

const TransactionItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  background: ${props => props.theme.colors.bgLight};
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: ${props => props.theme.colors.bgDark};
    border-color: ${props => props.$type === 'income' ? '#10B981' : '#EF4444'};
    transform: translateX(6px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
`;

const TransactionIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: ${props => props.$type === 'income' 
    ? 'linear-gradient(135deg, #10B98120 0%, #10B98130 100%)' 
    : 'linear-gradient(135deg, #EF444420 0%, #EF444430 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.$type === 'income' ? '#10B98140' : '#EF444440'};
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$type === 'income' ? '#10B981' : '#EF4444'};
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
  color: ${props => props.$type === 'income' ? '#10B981' : '#EF4444'};
  background: ${props => props.$type === 'income' ? '#10B98110' : '#EF444410'};
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid ${props => props.$type === 'income' ? '#10B98130' : '#EF444430'};
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StatItem = styled(motion.div)`
  padding: 24px;
  background: linear-gradient(135deg, ${props => props.theme.colors.bgLight} 0%, white 100%);
  border-radius: 16px;
  border-left: 5px solid ${props => props.$color || props.theme.colors.primary};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(6px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
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
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  background: ${props => props.theme.colors.bgLight};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.15);
    transform: translateY(-3px);
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
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}20 0%, ${props => props.theme.colors.primary}10 100%);
    border: 2px solid ${props => props.theme.colors.primary}30;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => props.theme.colors.primary};
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
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

const EmployerWallet = () => {
  const { language } = useLanguage();
  const [balance] = useState(125500000); // 125,500,000 VND

  const transactions = [
    {
      id: 1,
      type: 'expense',
      title: language === 'vi' ? 'Thanh toán gói Premium' : 'Premium plan payment',
      date: '14/02/2026',
      amount: -5000000
    },
    {
      id: 2,
      type: 'expense',
      title: language === 'vi' ? 'Đăng tin tuyển dụng' : 'Job posting fee',
      date: '12/02/2026',
      amount: -2000000
    },
    {
      id: 3,
      type: 'income',
      title: language === 'vi' ? 'Nạp tiền vào ví' : 'Wallet deposit',
      date: '10/02/2026',
      amount: 50000000
    },
    {
      id: 4,
      type: 'expense',
      title: language === 'vi' ? 'Phí đăng tin urgent' : 'Urgent posting fee',
      date: '08/02/2026',
      amount: -3000000
    },
    {
      id: 5,
      type: 'income',
      title: language === 'vi' ? 'Hoàn tiền dịch vụ' : 'Service refund',
      date: '05/02/2026',
      amount: 1500000
    }
  ];

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
    alert(language === 'vi' ? 'Mở form rút tiền' : 'Open withdrawal form');
  };

  const handleDeposit = () => {
    alert(language === 'vi' ? 'Mở form nạp tiền' : 'Open deposit form');
  };

  const handleLinkBank = () => {
    alert(language === 'vi' ? 'Liên kết ngân hàng' : 'Link bank account');
  };

  // Calculate stats
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <DashboardLayout role="employer">
      <PageContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Ví điện tử' : 'Wallet'}</h1>
          <p>{language === 'vi' ? 'Quản lý tài chính và giao dịch của bạn' : 'Manage your finances and transactions'}</p>
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
            <BalanceAmount>{formatCurrency(balance)}</BalanceAmount>
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
                  $type={transaction.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + (index * 0.05) }}
                >
                  <TransactionInfo>
                    <TransactionIcon $type={transaction.type}>
                      {transaction.type === 'income' ? (
                        <ArrowDownLeft />
                      ) : (
                        <ArrowUpRight />
                      )}
                    </TransactionIcon>
                    <TransactionDetails>
                      <div className="title">{transaction.title}</div>
                      <div className="date">{transaction.date}</div>
                    </TransactionDetails>
                  </TransactionInfo>
                  <TransactionAmount $type={transaction.type}>
                    {transaction.type === 'income' ? '+' : ''}
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
              <StatItem 
                $color="#F59E0B"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="label">{language === 'vi' ? 'Số dư ví' : 'Wallet Balance'}</div>
                <div className="value">{formatCurrency(balance)}</div>
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
    </DashboardLayout>
  );
};

export default EmployerWallet;
