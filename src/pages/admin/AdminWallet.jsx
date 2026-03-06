import { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  CreditCard,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const BalanceCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 20px 60px ${props => props.theme.colors.primary}30;
  color: white;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.1);
`;

const BalanceLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
`;

const BalanceAmount = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${props => props.theme.borderRadius.md};
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border-left: 4px solid ${props => {
    const colorMap = {
      'success': props.theme.colors.success,
      'error': props.theme.colors.error,
      'primary': props.theme.colors.primary,
      'warning': props.theme.colors.warning,
      'info': props.theme.colors.info
    };
    return colorMap[props.$color] || props.$color || props.theme.colors.primary;
  }};
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const TransactionSection = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 2px solid ${props => props.theme.colors.border};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.9rem;
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.25rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgLight};
  transition: all 0.2s;

  &:hover {
    box-shadow: ${props => props.theme.shadows.sm};
    border-color: ${props => props.theme.colors.primary};
    transform: translateX(4px);
  }
`;

const TransactionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$type === 'income' ? props.theme.colors.successBg : props.theme.colors.errorBg};
  color: ${props => props.$type === 'income' ? props.theme.colors.success : props.theme.colors.error};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TransactionDetails = styled.div`
  flex: 1;
`;

const TransactionTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const TransactionMeta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const TransactionAmount = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.$type === 'income' ? props.theme.colors.success : props.theme.colors.error};
  text-align: right;
`;

const TransactionStatus = styled.div`
  margin-top: 0.25rem;
  font-size: 0.85rem;
  text-align: right;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch(props.$status) {
      case 'completed': return props.theme.colors.successBg;
      case 'pending': return props.theme.colors.warningBg;
      case 'failed': return props.theme.colors.errorBg;
      default: return props.theme.colors.infoBg;
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'completed': return props.theme.colors.success;
      case 'pending': return props.theme.colors.warning;
      case 'failed': return props.theme.colors.error;
      default: return props.theme.colors.info;
    }
  }};
`;

const AdminWallet = () => {
  const { language } = useLanguage();
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const formatCurrency = (amount) => {
    // Format with VND instead of ₫ symbol
    const formatted = new Intl.NumberFormat('vi-VN').format(amount);
    return formatted + ' VND';
  };

  const transactions = [
    {
      id: 1,
      type: 'income',
      title: language === 'vi' ? 'Thanh toán gói Premium - Công ty ABC' : 'Premium package payment - ABC Company',
      amount: 5000000,
      date: '15/02/2024',
      time: '14:30',
      status: 'completed',
      method: language === 'vi' ? 'Chuyển khoản' : 'Bank transfer'
    },
    {
      id: 2,
      type: 'expense',
      title: language === 'vi' ? 'Hoàn tiền cho ứng viên Nguyễn Văn A' : 'Refund to candidate Nguyen Van A',
      amount: 500000,
      date: '14/02/2024',
      time: '10:15',
      status: 'completed',
      method: language === 'vi' ? 'Ví điện tử' : 'E-wallet'
    },
    {
      id: 3,
      type: 'income',
      title: language === 'vi' ? 'Phí dịch vụ quảng cáo - Công ty XYZ' : 'Advertising service fee - XYZ Company',
      amount: 2500000,
      date: '14/02/2024',
      time: '09:00',
      status: 'completed',
      method: 'PayPal'
    },
    {
      id: 4,
      type: 'income',
      title: language === 'vi' ? 'Thanh toán gói Basic - Công ty DEF' : 'Basic package payment - DEF Company',
      amount: 1500000,
      date: '13/02/2024',
      time: '16:45',
      status: 'pending',
      method: language === 'vi' ? 'Chuyển khoản' : 'Bank transfer'
    },
    {
      id: 5,
      type: 'expense',
      title: language === 'vi' ? 'Chi phí vận hành hệ thống' : 'System operation cost',
      amount: 10000000,
      date: '13/02/2024',
      time: '08:00',
      status: 'completed',
      method: language === 'vi' ? 'Chuyển khoản' : 'Bank transfer'
    },
    {
      id: 6,
      type: 'income',
      title: language === 'vi' ? 'Phí đăng tin - Nhiều nhà tuyển dụng' : 'Job posting fee - Multiple employers',
      amount: 8500000,
      date: '12/02/2024',
      time: '15:20',
      status: 'completed',
      method: language === 'vi' ? 'Ví điện tử' : 'E-wallet'
    },
    {
      id: 7,
      type: 'expense',
      title: language === 'vi' ? 'Hoàn tiền do lỗi hệ thống' : 'Refund due to system error',
      amount: 1200000,
      date: '12/02/2024',
      time: '11:30',
      status: 'failed',
      method: language === 'vi' ? 'Chuyển khoản' : 'Bank transfer'
    },
    {
      id: 8,
      type: 'income',
      title: language === 'vi' ? 'Gia hạn gói Premium - Công ty GHI' : 'Premium package renewal - GHI Company',
      amount: 5000000,
      date: '11/02/2024',
      time: '13:00',
      status: 'completed',
      method: 'PayPal'
    }
  ];

  return (
    <DashboardLayout role="admin">
      <PageContainer>
        <PageHeader>
          <Title>{language === 'vi' ? 'Ví Điện Tử Nền Tảng' : 'Platform E-Wallet'}</Title>
          <Subtitle>{language === 'vi' ? 'Quản lý tài chính và giao dịch của toàn bộ nền tảng' : 'Manage finances and transactions for the entire platform'}</Subtitle>
        </PageHeader>

        <Grid>
          <BalanceCard>
            <BalanceLabel>{language === 'vi' ? 'Tổng Số Dư Nền Tảng' : 'Total Platform Balance'}</BalanceLabel>
            <BalanceAmount>2,458,750,000 VND</BalanceAmount>
            <ActionButtons>
              <ActionButton>
                <Download size={18} />
                {language === 'vi' ? 'Xuất Báo Cáo' : 'Export Report'}
              </ActionButton>
              <ActionButton>
                <CreditCard size={18} />
                {language === 'vi' ? 'Cài Đặt Thanh Toán' : 'Payment Settings'}
              </ActionButton>
              <ActionButton>
                <DollarSign size={18} />
                {language === 'vi' ? 'Rút Tiền' : 'Withdraw'}
              </ActionButton>
            </ActionButtons>
          </BalanceCard>

          <StatsGrid>
            <StatCard $color="success">
              <StatLabel>{language === 'vi' ? 'Tổng Thu Nhập (Tháng này)' : 'Total Income (This Month)'}</StatLabel>
              <StatValue>325,500,000 VND</StatValue>
            </StatCard>
            <StatCard $color="error">
              <StatLabel>{language === 'vi' ? 'Tổng Chi Phí (Tháng này)' : 'Total Expenses (This Month)'}</StatLabel>
              <StatValue>187,250,000 VND</StatValue>
            </StatCard>
            <StatCard $color="primary">
              <StatLabel>{language === 'vi' ? 'Lợi Nhuận Ròng' : 'Net Profit'}</StatLabel>
              <StatValue>138,250,000 VND</StatValue>
            </StatCard>
          </StatsGrid>
        </Grid>

        <TransactionSection>
          <SectionHeader>
            <SectionTitle>{language === 'vi' ? 'Lịch Sử Giao Dịch' : 'Transaction History'}</SectionTitle>
            <FilterBar>
              <SearchBox>
                <SearchIcon size={18} />
                <SearchInput placeholder={language === 'vi' ? 'Tìm kiếm giao dịch...' : 'Search transactions...'} />
              </SearchBox>
              <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">{language === 'vi' ? 'Tất cả loại' : 'All types'}</option>
                <option value="income">{language === 'vi' ? 'Thu nhập' : 'Income'}</option>
                <option value="expense">{language === 'vi' ? 'Chi phí' : 'Expenses'}</option>
              </Select>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">{language === 'vi' ? 'Tất cả trạng thái' : 'All statuses'}</option>
                <option value="completed">{language === 'vi' ? 'Hoàn thành' : 'Completed'}</option>
                <option value="pending">{language === 'vi' ? 'Đang xử lý' : 'Pending'}</option>
                <option value="failed">{language === 'vi' ? 'Thất bại' : 'Failed'}</option>
              </Select>
              <Button>
                <Download size={18} />
                {language === 'vi' ? 'Xuất Excel' : 'Export Excel'}
              </Button>
            </FilterBar>
          </SectionHeader>

          <TransactionList>
            {transactions.map(transaction => (
              <TransactionItem key={transaction.id}>
                <TransactionIcon $type={transaction.type}>
                  {transaction.type === 'income' ? 
                    <ArrowDownLeft size={24} /> : 
                    <ArrowUpRight size={24} />
                  }
                </TransactionIcon>
                <TransactionDetails>
                  <TransactionTitle>{transaction.title}</TransactionTitle>
                  <TransactionMeta>
                    <MetaItem>
                      <Clock size={14} />
                      {transaction.date} • {transaction.time}
                    </MetaItem>
                    <MetaItem>
                      <CreditCard size={14} />
                      {transaction.method}
                    </MetaItem>
                  </TransactionMeta>
                </TransactionDetails>
                <div>
                  <TransactionAmount $type={transaction.type}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </TransactionAmount>
                  <TransactionStatus>
                    <StatusBadge $status={transaction.status}>
                      {transaction.status === 'completed' && (language === 'vi' ? 'Hoàn thành' : 'Completed')}
                      {transaction.status === 'pending' && (language === 'vi' ? 'Đang xử lý' : 'Pending')}
                      {transaction.status === 'failed' && (language === 'vi' ? 'Thất bại' : 'Failed')}
                    </StatusBadge>
                  </TransactionStatus>
                </div>
              </TransactionItem>
            ))}
          </TransactionList>
        </TransactionSection>
      </PageContainer>
    </DashboardLayout>
  );
};

export default AdminWallet;
