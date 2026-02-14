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
  Settings,
  Receipt,
  DollarSign,
  Calendar,
  Filter
} from 'lucide-react';
import { Button, Input, FormGroup, Label } from '../../components/FormElements';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const WalletContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
`;

const BalanceCard = styled.div`
  background: linear-gradient(135deg, #0E3995 0%, #0055A5 100%);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 40px;
  margin-bottom: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.intense};
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  
  .balance-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
    
    h2 {
      font-size: 16px;
      font-weight: 500;
      opacity: 0.9;
      margin-bottom: 8px;
    }
    
    .amount {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .last-updated {
      font-size: 14px;
      opacity: 0.8;
    }
  }
  
  .balance-actions {
    display: flex;
    gap: 12px;
    position: relative;
    z-index: 1;
  }
`;

const ActionButton = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  
  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .icon {
      width: 48px;
      height: 48px;
      border-radius: ${props => props.theme.borderRadius.md};
      background: ${props => props.$color || props.theme.colors.primary}15;
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        width: 24px;
        height: 24px;
        color: ${props => props.$color || props.theme.colors.primary};
      }
    }
  }
  
  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
  }
  
  .stat-change {
    font-size: 12px;
    color: ${props => props.$positive ? '#10B981' : '#EF4444'};
    font-weight: 600;
    margin-top: 8px;
  }
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 32px;
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 24px;
  
  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
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
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  .transaction-info {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: ${props => props.$type === 'income' ? '#10B98115' : '#EF444415'};
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        width: 20px;
        height: 20px;
        color: ${props => props.$type === 'income' ? '#10B981' : '#EF4444'};
      }
    }
    
    .details {
      h4 {
        font-size: 16px;
        font-weight: 600;
        color: ${props => props.theme.colors.text};
        margin-bottom: 4px;
      }
      
      p {
        font-size: 14px;
        color: ${props => props.theme.colors.textLight};
      }
    }
  }
  
  .transaction-amount {
    text-align: right;
    
    .amount {
      font-size: 18px;
      font-weight: 700;
      color: ${props => props.$type === 'income' ? '#10B981' : '#EF4444'};
      margin-bottom: 4px;
    }
    
    .date {
      font-size: 12px;
      color: ${props => props.theme.colors.textLight};
    }
  }
`;

const ReceiptCard = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 12px;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    cursor: pointer;
  }
  
  .receipt-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    h4 {
      font-size: 16px;
      font-weight: 600;
      color: ${props => props.theme.colors.text};
    }
    
    .download-btn {
      color: ${props => props.theme.colors.primary};
      cursor: pointer;
      
      &:hover {
        opacity: 0.7;
      }
    }
  }
  
  .receipt-info {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const Wallet = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [balance] = useState(15750000);

  const transactions = [
    {
      id: 1,
      type: 'income',
      title: 'Nhận tiền từ FPT Software',
      description: 'Thanh toán cho công việc #12345',
      amount: 2500000,
      date: '2026-02-13'
    },
    {
      id: 3,
      type: 'income',
      title: 'Nhận tiền từ Viettel',
      description: 'Thanh toán cho công việc #12344',
      amount: 3000000,
      date: '2026-02-10'
    },
    {
      id: 4,
      type: 'expense',
      title: 'Rút tiền về ngân hàng',
      description: 'Chuyển về tài khoản VCB',
      amount: -5000000,
      date: '2026-02-08'
    }
  ];

  const receipts = [
    { id: 1, title: 'Hóa đơn #INV-2026-001', date: '13/02/2026', amount: '2,500,000đ' },
    { id: 2, title: 'Hóa đơn #INV-2026-002', date: '10/02/2026', amount: '3,000,000đ' },
    { id: 3, title: 'Hóa đơn #INV-2026-003', date: '05/02/2026', amount: '1,800,000đ' }
  ];

  return (
    <DashboardLayout role="candidate" showSearch={false}>
      <WalletContainer>
        <Header>
          <h1>Ví Điện Tử</h1>
        </Header>

        <BalanceCard>
          <div className="balance-header">
            <div>
              <h2>Số Dư Khả Dụng</h2>
              <div className="amount">{balance.toLocaleString('vi-VN')}đ</div>
              <div className="last-updated">Cập nhật lần cuối: Hôm nay, 14:30</div>
            </div>
            <WalletIcon style={{ width: '64px', height: '64px', opacity: 0.2 }} />
          </div>
          <div className="balance-actions">
            <ActionButton>
              <ArrowUpRight style={{ width: '18px', height: '18px' }} />
              Rút Tiền
            </ActionButton>
            <ActionButton>
              <CreditCard style={{ width: '18px', height: '18px' }} />
              Liên Kết Ngân Hàng
            </ActionButton>
          </div>
        </BalanceCard>

        <ContentSection>
          <div>
            <Card>
              <h2>
                <Calendar />
                Lịch Sử Giao Dịch
              </h2>
              <FilterBar>
                <Button $variant="secondary" $size="small">
                  <Filter style={{ width: '16px', height: '16px' }} />
                  Lọc
                </Button>
                <Input type="date" style={{ width: 'auto' }} />
              </FilterBar>
              <TransactionList>
                {transactions.map(transaction => (
                  <TransactionItem key={transaction.id} $type={transaction.type}>
                    <div className="transaction-info">
                      <div className="icon">
                        {transaction.type === 'income' ? <ArrowDownLeft /> : <ArrowUpRight />}
                      </div>
                      <div className="details">
                        <h4>{transaction.title}</h4>
                        <p>{transaction.description}</p>
                      </div>
                    </div>
                    <div className="transaction-amount">
                      <div className="amount">
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('vi-VN')}đ
                      </div>
                      <div className="date">{new Date(transaction.date).toLocaleDateString('vi-VN')}</div>
                    </div>
                  </TransactionItem>
                ))}
              </TransactionList>
            </Card>
          </div>

          <div>
            <Card>
              <h2>
                <Receipt />
                Hóa Đơn Điện Tử
              </h2>
              {receipts.map(receipt => (
                <ReceiptCard key={receipt.id}>
                  <div className="receipt-header">
                    <h4>{receipt.title}</h4>
                    <Download className="download-btn" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div className="receipt-info">
                    <span>{receipt.date}</span>
                    <span>{receipt.amount}</span>
                  </div>
                </ReceiptCard>
              ))}
              <Button $variant="ghost" $fullWidth style={{ marginTop: '16px' }}>
                Xem Tất Cả
              </Button>
            </Card>
          </div>
        </ContentSection>
      </WalletContainer>
    </DashboardLayout>
  );
};

export default Wallet;
