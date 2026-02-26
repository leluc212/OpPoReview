import { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  color: white;
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
  border-left: 4px solid ${props => props.$color};
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
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s;

  &:hover {
    box-shadow: ${props => props.theme.shadows.sm};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TransactionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$type === 'income' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.$type === 'income' ? '#15803d' : '#dc2626'};
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
  color: ${props => props.$type === 'income' ? '#15803d' : '#dc2626'};
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
      case 'completed': return '#dcfce7';
      case 'pending': return '#fef3c7';
      case 'failed': return '#fee2e2';
      default: return '#e0e7ff';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'completed': return '#15803d';
      case 'pending': return '#ca8a04';
      case 'failed': return '#dc2626';
      default: return '#4338ca';
    }
  }};
`;

const AdminWallet = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const transactions = [
    {
      id: 1,
      type: 'income',
      title: 'Thanh toán gói Premium - Công ty ABC',
      amount: 5000000,
      date: '15/02/2024',
      time: '14:30',
      status: 'completed',
      method: 'Chuyển khoản'
    },
    {
      id: 2,
      type: 'expense',
      title: 'Hoàn tiền cho ứng viên Nguyễn Văn A',
      amount: 500000,
      date: '14/02/2024',
      time: '10:15',
      status: 'completed',
      method: 'Ví điện tử'
    },
    {
      id: 3,
      type: 'income',
      title: 'Phí dịch vụ quảng cáo - Công ty XYZ',
      amount: 2500000,
      date: '14/02/2024',
      time: '09:00',
      status: 'completed',
      method: 'PayPal'
    },
    {
      id: 4,
      type: 'income',
      title: 'Thanh toán gói Basic - Công ty DEF',
      amount: 1500000,
      date: '13/02/2024',
      time: '16:45',
      status: 'pending',
      method: 'Chuyển khoản'
    },
    {
      id: 5,
      type: 'expense',
      title: 'Chi phí vận hành hệ thống',
      amount: 10000000,
      date: '13/02/2024',
      time: '08:00',
      status: 'completed',
      method: 'Chuyển khoản'
    },
    {
      id: 6,
      type: 'income',
      title: 'Phí đăng tin - Nhiều nhà tuyển dụng',
      amount: 8500000,
      date: '12/02/2024',
      time: '15:20',
      status: 'completed',
      method: 'Ví điện tử'
    },
    {
      id: 7,
      type: 'expense',
      title: 'Hoàn tiền do lỗi hệ thống',
      amount: 1200000,
      date: '12/02/2024',
      time: '11:30',
      status: 'failed',
      method: 'Chuyển khoản'
    },
    {
      id: 8,
      type: 'income',
      title: 'Gia hạn gói Premium - Công ty GHI',
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
          <Title>Ví Điện Tử Nền Tảng</Title>
          <Subtitle>Quản lý tài chính và giao dịch của toàn bộ nền tảng</Subtitle>
        </PageHeader>

        <Grid>
          <BalanceCard>
            <BalanceLabel>Tổng Số Dư Nền Tảng</BalanceLabel>
            <BalanceAmount>2,458,750,000đ</BalanceAmount>
            <ActionButtons>
              <ActionButton>
                <Download size={18} />
                Xuất Báo Cáo
              </ActionButton>
              <ActionButton>
                <CreditCard size={18} />
                Cài Đặt Thanh Toán
              </ActionButton>
              <ActionButton>
                <DollarSign size={18} />
                Rút Tiền
              </ActionButton>
            </ActionButtons>
          </BalanceCard>

          <StatsGrid>
            <StatCard $color="#10b981">
              <StatLabel>Tổng Thu Nhập (Tháng này)</StatLabel>
              <StatValue>325,500,000đ</StatValue>
            </StatCard>
            <StatCard $color="#ef4444">
              <StatLabel>Tổng Chi Phí (Tháng này)</StatLabel>
              <StatValue>187,250,000đ</StatValue>
            </StatCard>
            <StatCard $color="#6366f1">
              <StatLabel>Lợi Nhuận Ròng</StatLabel>
              <StatValue>138,250,000đ</StatValue>
            </StatCard>
          </StatsGrid>
        </Grid>

        <TransactionSection>
          <SectionHeader>
            <SectionTitle>Lịch Sử Giao Dịch</SectionTitle>
            <FilterBar>
              <SearchBox>
                <SearchIcon size={18} />
                <SearchInput placeholder="Tìm kiếm giao dịch..." />
              </SearchBox>
              <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">Tất cả loại</option>
                <option value="income">Thu nhập</option>
                <option value="expense">Chi phí</option>
              </Select>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                <option value="completed">Hoàn thành</option>
                <option value="pending">Đang xử lý</option>
                <option value="failed">Thất bại</option>
              </Select>
              <Button>
                <Download size={18} />
                Xuất Excel
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
                      {transaction.status === 'completed' && 'Hoàn thành'}
                      {transaction.status === 'pending' && 'Đang xử lý'}
                      {transaction.status === 'failed' && 'Thất bại'}
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
