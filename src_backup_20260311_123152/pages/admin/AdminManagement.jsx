import { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users,
  UserCheck,
  UserX,
  Clock,
  Shield,
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

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
    font-weight: 700;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
  }
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.$color};
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.$color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  svg { width: 24px; height: 24px; color: ${props => props.$color}; }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 600;
`;

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 250px;
  position: relative;
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.textLight};
    width: 18px;
    height: 18px;
  }
  input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    font-size: 14px;
    background: ${props => props.theme.colors.bgDark};
    color: ${props => props.theme.colors.text};
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const FilterButton = styled.button`
  padding: 10px 16px;
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgDark};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;

const TableWrapper = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  box-shadow: ${props => props.theme.shadows.card};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
  th {
    text-align: left;
    padding: 16px 20px;
    background: ${props => props.theme.colors.bgDark};
    font-weight: 700;
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    text-transform: uppercase;
    border-bottom: 2px solid ${props => props.theme.colors.border};
  }
  td {
    padding: 16px 20px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    font-size: 14px;
  }
  tbody tr:hover {
    background: ${props => props.theme.colors.bgDark};
  }
`;

const RoleBadge = styled.span`
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.$role === 'super_admin') return '#8b5cf6';
    if (props.$role === 'admin') return '#3b82f6';
    return '#10b981';
  }};
  color: white;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.$status === 'approved') return '#dcfce7';
    if (props.$status === 'rejected') return '#fee2e2';
    return '#fef3c7';
  }};
  color: ${props => {
    if (props.$status === 'approved') return '#15803d';
    if (props.$status === 'rejected') return '#dc2626';
    return '#ca8a04';
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 10px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${props => {
    if (props.$variant === 'approve') return '#10b981';
    if (props.$variant === 'reject') return '#ef4444';
    if (props.$variant === 'view') return '#3b82f6';
    return '#6b7280';
  }};
  color: white;
  &:hover { opacity: 0.8; }
  svg { width: 14px; height: 14px; }
`;

const AdminManagement = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const admins = [
    {
      id: 1,
      name: 'Root',
      email: 'root@opcareer.vn',
      role: 'super_admin',
      joinDate: '2026-01-15',
      reviewDate: '2026-01-16'
    },
    {
      id: 2,
      name: 'Nguyễn Hoàng Ngọc Minh',
      email: 'admin2@opcareer.vn',
      role: 'admin',
      status: 'approved',
      joinDate: '2026-03-15',
      reviewDate: '2026-03-16'
    }, 
    {
      id: 3,
      name: 'Lê Tấn Lực',
      email: 'admin3@opcareer.vn',
      role: 'admin',
      status: 'approved',
      joinDate: '2026-03-15',
      reviewDate: '2026-03-16'
    }, 
    {
      id: 4,
      name: 'Nguyễn Thị Thùy Dung',
      email: 'admin4@opcareer.vn',
      role: 'admin',
      status: 'approved',
      joinDate: '2026-03-15',
      reviewDate: '2026-03-16'
    }, 
    {
      id: 5,
      name: 'Đỗ Hoàng Hiếu',
      email: 'admin5@opcareer.vn',
      role: 'admin',
      status: 'approved',
      joinDate: '2026-03-15',
      reviewDate: '2026-03-16'
    }, 
    {
      id: 6,
      name: 'Phạm Lê Duy',
      email: 'admin6@opcareer.vn',
      role: 'admin',
      status: 'approved',
      joinDate: '2026-03-15',
      reviewDate: '2026-03-16'
    }, 
    {
      id: 7,
      name: 'Nguyễn Thị Anh Thư',
      email: 'admin7@opcareer.vn',
      role: 'admin',
      status: 'approved',
      joinDate: '2026-03-15',
      reviewDate: '2026-03-16'
    }, 

  ];

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: admins.length,
    approved: admins.filter(a => a.status === 'approved').length,
    pending: admins.filter(a => a.status === 'pending').length,
    rejected: admins.filter(a => a.status === 'rejected').length,
  };

  const getRoleText = (role) => {
    if (role === 'super_admin') return 'Super Admin';
    if (role === 'admin') return language === 'vi' ? 'Admin' : 'Admin';
    return language === 'vi' ? 'Moderator' : 'Moderator';
  };

  const getStatusText = (status) => {
    if (status === 'approved') return language === 'vi' ? 'Đã duyệt' : 'Approved';
    if (status === 'rejected') return language === 'vi' ? 'Từ chối' : 'Rejected';
    return language === 'vi' ? 'Chờ duyệt' : 'Pending';
  };

  return (
    <DashboardLayout role="admin" key={language}>
      <PageContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Quản Lý Admin' : 'Admin Management'}</h1>
          <p>{language === 'vi' ? 'Quản lý phân quyền và duyệt admin dưới cấp' : 'Manage permissions and approve sub-admins'}</p>
        </PageHeader>

        <StatsGrid>
          <StatCard $color="#667eea">
            <StatIcon $color="#667eea"><Users /></StatIcon>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>{language === 'vi' ? 'Tổng Admin' : 'Total Admins'}</StatLabel>
          </StatCard>
          <StatCard $color="#10b981">
            <StatIcon $color="#10b981"><UserCheck /></StatIcon>
            <StatValue>{stats.approved}</StatValue>
            <StatLabel>{language === 'vi' ? 'Đã Duyệt' : 'Approved'}</StatLabel>
          </StatCard>
          <StatCard $color="#f59e0b">
            <StatIcon $color="#f59e0b"><Clock /></StatIcon>
            <StatValue>{stats.pending}</StatValue>
            <StatLabel>{language === 'vi' ? 'Chờ Duyệt' : 'Pending'}</StatLabel>
          </StatCard>
          <StatCard $color="#ef4444">
            <StatIcon $color="#ef4444"><UserX /></StatIcon>
            <StatValue>{stats.rejected}</StatValue>
            <StatLabel>{language === 'vi' ? 'Từ Chối' : 'Rejected'}</StatLabel>
          </StatCard>
        </StatsGrid>

        <ControlBar>
          <SearchBox>
            <Search />
            <input
              type="text"
              placeholder={language === 'vi' ? 'Tìm kiếm...' : 'Search...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>

          <AddButton><Plus />{language === 'vi' ? 'Thêm Admin' : 'Add Admin'}</AddButton>
        </ControlBar>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>{language === 'vi' ? 'Tên' : 'Name'}</th>
                <th>{language === 'vi' ? 'Email' : 'Email'}</th>
                <th>{language === 'vi' ? 'Vai trò' : 'Role'}</th>
                <th>{language === 'vi' ? 'Ngày tham gia' : 'Join Date'}</th>
                <th>{language === 'vi' ? 'Ngày xét duyệt' : 'Review Date'}</th>
                <th>{language === 'vi' ? 'Thao tác' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin.id}>
                  <td style={{ fontWeight: 600 }}>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td><RoleBadge $role={admin.role}>{getRoleText(admin.role)}</RoleBadge></td>
                  <td>{admin.joinDate}</td>
                  <td>{admin.reviewDate || (language === 'vi' ? 'Chưa có' : 'N/A')}</td>
                  <td>
                    <ActionButtons>
                      <ActionButton $variant="view" onClick={() => {
                        setSelectedAdmin(admin);
                        setShowViewModal(true);
                      }}>
                        <Eye />{language === 'vi' ? 'Xem' : 'View'}
                      </ActionButton>
                      {admin.status === 'pending' && (
                        <>
                          <ActionButton $variant="approve">
                            <CheckCircle />{language === 'vi' ? 'Duyệt' : 'Approve'}
                          </ActionButton>
                          <ActionButton $variant="reject">
                            <XCircle />{language === 'vi' ? 'Từ chối' : 'Reject'}
                          </ActionButton>
                        </>
                      )}
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </PageContainer>
    </DashboardLayout>
  );
};

export default AdminManagement;
