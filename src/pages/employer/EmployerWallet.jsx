import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
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
import { Button } from '../../components/FormElements';

const PageContainer = styled.div`
  animation: fadeIn 0.5s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 16px;
  }
`;

const BalanceCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 40px;
  margin-bottom: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.xl};
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.1);
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

const ActionButton = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
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

const Card = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 28px;
  
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

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background: ${props => props.theme.colors.bgDark};
    transform: translateX(4px);
  }
`;

const TransactionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$type === 'income' ? '#DCFCE7' : '#FEE2E2'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$type === 'income' ? '#16A34A' : '#DC2626'};
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
  font-weight: 700;
  color: ${props => props.$type === 'income' ? '#16A34A' : '#DC2626'};
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StatItem = styled.div`
  padding: 20px;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 4px solid ${props => props.$color || props.theme.colors.primary};
  
  .label {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .value {
    font-size: 24px;
    font-weight: 800;
    color: ${props => props.theme.colors.text};
  }
`;

const ReceiptsList = styled.div`
  display: grid;
  gap: 16px;
`;

const ReceiptItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

const ReceiptInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .icon {
    width: 40px;
    height: 40px;
    border-radius: ${props => props.theme.borderRadius.sm};
    background: ${props => props.theme.colors.primary}14;
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

const DownloadButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
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
  const [balance] = useState(125500000); // 125,500,000 VNĐ

  const transactions = [
    {
      id: 1,
      type: 'expense',
      title: 'Thanh toán gói Premium',
      date: '14/02/2026',
      amount: -5000000
    },
    {
      id: 2,
      type: 'expense',
      title: 'Đăng tin tuyển dụng',
      date: '12/02/2026',
      amount: -2000000
    },
    {
      id: 3,
      type: 'income',
      title: 'Nạp tiền vào ví',
      date: '10/02/2026',
      amount: 50000000
    },
    {
      id: 4,
      type: 'expense',
      title: 'Phí đăng tin urgent',
      date: '08/02/2026',
      amount: -3000000
    },
    {
      id: 5,
      type: 'income',
      title: 'Hoàn tiền dịch vụ',
      date: '05/02/2026',
      amount: 1500000
    }
  ];

  const receipts = [
    { id: 1, title: 'Hóa đơn #2026021401', date: '14/02/2026' },
    { id: 2, title: 'Hóa đơn #2026021201', date: '12/02/2026' },
    { id: 3, title: 'Hóa đơn #2026021001', date: '10/02/2026' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleDownloadReceipt = (receiptId) => {
    alert(`Tải xuống hóa đơn #${receiptId}`);
  };

  const handleWithdraw = () => {
    alert('Mở form rút tiền');
  };

  const handleDeposit = () => {
    alert('Mở form nạp tiền');
  };

  const handleLinkBank = () => {
    alert('Liên kết ngân hàng');
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
          <h1>Ví điện tử</h1>
          <p>Quản lý tài chính và giao dịch của bạn</p>
        </PageHeader>

        <BalanceCard>
          <BalanceContent>
            <BalanceLabel>
              <WalletIcon />
              Số dư khả dụng
            </BalanceLabel>
            <BalanceAmount>{formatCurrency(balance)}</BalanceAmount>
            <BalanceActions>
              <ActionButton onClick={handleDeposit}>
                <Plus size={18} />
                Nạp tiền
              </ActionButton>
              <ActionButton onClick={handleWithdraw}>
                <ArrowUpRight size={18} />
                Rút tiền
              </ActionButton>
              <ActionButton onClick={handleLinkBank}>
                <Building2 size={18} />
                Liên kết ngân hàng
              </ActionButton>
            </BalanceActions>
          </BalanceContent>
        </BalanceCard>

        <Grid>
          {/* Transactions */}
          <Card>
            <h3>
              <Calendar />
              Lịch sử giao dịch
            </h3>
            <TransactionList>
              {transactions.map(transaction => (
                <TransactionItem key={transaction.id}>
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
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </TransactionAmount>
                </TransactionItem>
              ))}
            </TransactionList>
          </Card>

          {/* Stats */}
          <Card>
            <h3>
              <TrendingUp />
              Thống kê
            </h3>
            <StatsList>
              <StatItem $color="#16A34A">
                <div className="label">Tổng tiền nạp</div>
                <div className="value">{formatCurrency(totalIncome)}</div>
              </StatItem>
              <StatItem $color="#DC2626">
                <div className="label">Tổng chi phí</div>
                <div className="value">{formatCurrency(totalExpense)}</div>
              </StatItem>
              <StatItem $color="#F59E0B">
                <div className="label">Số dư ví</div>
                <div className="value">{formatCurrency(balance)}</div>
              </StatItem>
            </StatsList>
          </Card>
        </Grid>

        {/* Receipts */}
        <Card>
          <h3>
            <Receipt />
            Hóa đơn & Biên lai
          </h3>
          <ReceiptsList>
            {receipts.map(receipt => (
              <ReceiptItem key={receipt.id}>
                <ReceiptInfo>
                  <div className="icon">
                    <Receipt />
                  </div>
                  <div className="details">
                    <div className="title">{receipt.title}</div>
                    <div className="date">{receipt.date}</div>
                  </div>
                </ReceiptInfo>
                <DownloadButton onClick={() => handleDownloadReceipt(receipt.id)}>
                  <Download />
                  Tải xuống
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
