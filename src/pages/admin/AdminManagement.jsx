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
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Settings
} from 'lucide-react';

const PageContainer = styled.div`
  animation: fadeIn 0.5s ease-in;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
    
    @media (max-width: 768px) {
      font-size: 24px;
    }
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 16px;
    
    @media (max-width: 768px) {
      font-size: 14px;
    }
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
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.$color || props.theme.colors.primary};
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
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$color};
  }
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 250px;
  position: relative;
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
  
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
    transition: all 0.2s;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
    
    &::placeholder {
      color: ${props => props.theme.colors.textLight};
    }
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
  }
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
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
    font-size: 12px;
    padding: 8px 12px;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
  
  svg {
    width: 16px;
    height: 16px;
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
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
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
  
  @media (max-width: 768px) {
    min-width: 800px;
  }
  
  th {
    text-align: left;
    padding: 16px 20px;
    background: ${props => props.theme.colors.bgDark};
    font-weight: 700;
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid ${props => props.theme.colors.border};
    white-space: nowrap;
    
    @media (max-width: 768px) {
      padding: 12px 10px;
      font-size: 11px;
    }
  }
  
  td {
    padding: 16px 20px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    font-size: 14px;
    
    @media (max-width: 768px) {
      padding: 12px 10px;
      font-size: 12px;
    }
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
  
  tbody tr {
    transition: all 0.2s;
    
    &:hover {
      background: ${props => props.theme.colors.bgDark};
    }
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
    if (props.$role === 'moderator') return '#10b981';
    return '#6b7280';
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
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${props => {
    if (props.$variant === 'approve') return '#10b981';
    if (props.$variant === 'reject') return '#ef4444';
    if (props.$variant === 'view') return '#3b82f6';
    if (props.$variant === 'edit') return '#f59e0b';
    if (props.$variant === 'delete') return '#ef4444';
    return '#6b7280';
  }};
  color: white;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const ModalContent = styled.div`
  padding: 24px;
`;

const ModalHeader = styled.div`
  margin-bottom: 24px;
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 14px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.primary};
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const PermissionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PermissionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: ${props => props.$enabled ? '#dcfce7' : '#fee2e2'};
  border-radius: ${props => props.theme.borderRadius.md};
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.$enabled ? '#15803d' : '#dc2626'};
  }
  
  span {
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.$enabled ? '#15803d' : '#dc2626'};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  background: ${props => props.theme.colors.bgDark};
  color: ${props => props.theme.colors.text};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const Button = styled.button`
  padding: 10px 24px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    width: 100%;
  }
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const PrimaryButton = styled(Button)`
  background: ${props => props.theme.colors.primary};
  color: white;
`;

const SecondaryButton = styled(Button)`
  background: ${props => props.theme.colors.bgDark};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
`;

const DangerButton = styled(Button)`
  background: #ef4444;
  color: white;
`;

const AdminManagement = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Sample admin data
  const admins = [
    {
      id: 1,
      name: 'Nguyễn Thị Anh Thư',
      email: 'admin1@opcareer.vn',
      phone: '0901234567',
      role: 'super_admin',
      status: 'approved',
      joinDate: '2026-01-15',
      reviewDate: '2026-01-16',
      location: 'TP.HCM',
      permissions: {
        manageUsers: true,
        managePosts: true,
        managePackages: true,
        viewReports: true,
        manageAdmins: false,
        systemSettings: false
      }
    },
    {
      id: 2,
      name: 'Nguyễn Hoàng Ngọc Minh',
      email: 'admin2@opcareer.vn',
      phone: '0912345678',
      role: 'moderator',
      status: 'approved',
      joinDate: '2026-02-10',
      reviewDate: '2026-02-11',
      location: 'Hà Nội',
      permissions: {
        manageUsers: false,
        managePosts: true,
        managePackages: false,
        viewReports: true,
        manageAdmins: false,
        systemSettings: false
      }
    },
    {
      id: 3,
      name: 'Lê Tấn Lực',
      email: 'admin3@opcareer.vn',
      phone: '0923456789',
      role: 'admin',
      status: 'pending',
      joinDate: '2026-07-01',
      reviewDate: null,
      location: 'Đà Nẵng',
      permissions: {
        manageUsers: true,
        managePosts: true,
        managePackages: true,
        viewReports: true,
        manageAdmins: false,
        systemSettings: false
      }
    },
    {
      id: 4,
      name: 'Phạm Lê Duy',
      email: 'admin4@opcareer.vn',
      phone: '0934567890',
      role: 'moderator',
      status: 'rejected',
      joinDate: '2026-06-28',
      reviewDate: '2026-07-02',
      location: 'Cần Thơ',
      permissions: {
        manageUsers: false,
        managePosts: true,
        managePackages: false,
        viewReports: true,
        manageAdmins: false,
        systemSettings: false
      }
    },
    {
      id: 5,
      name: 'Đỗ Hoàng Hiếu',
      email: 'admin5@opcareer.vn',
      phone: '0945678901',
      role: 'admin',
      status: 'approved',
      joinDate: '2025-12-01',
      reviewDate: '2025-12-01',
      location: 'TP.HCM',
      permissions: {
        manageUsers: true,
        managePosts: true,
        managePackages: true,
        viewReports: true,
        manageAdmins: true,
        systemSettings: true
      }
    },
    {
      id: 6,
      name: 'Nguyễn Thị Thùy Dung',
      email: 'admin6@opcareer.vn',
      phone: '0945678901',
      role: 'super_admin',
      status: 'approved',
      joinDate: '2025-12-01',
      reviewDate: '2025-12-01',
      location: 'TP.HCM',
      permissions: {
        manageUsers: true,
        managePosts: true,
        managePackages: true,
        viewReports: true,
        manageAdmins: true,
        systemSettings: true
      }
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
    if (role === 'super_admin') return language === 'vi' ? 'Super Admin' : 'Super Admin';
    if (role === 'admin') return language === 'vi' ? 'Admin' : 'Admin';
    if (role === 'moderator') return language === 'vi' ? 'Moderator' : 'Moderator';
    return role;
  };

  const getStatusText = (status) => {
    if (status === 'approved') return language === 'vi' ? 'Đã duyệt' : 'Approved';
    if (status === 'rejected') return language === 'vi' ? 'Từ chối' : 'Rejected';
    if (status === 'pending') return language === 'vi' ? 'Chờ duyệt' : 'Pending';
    return status;
  };

  const handleApprove = (admin) => {
    console.log('Approve admin:', admin);
    alert(`${language === 'vi' ? 'Đã duyệt' : 'Approved'}: ${admin.name}`);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert(language === 'vi' ? 'Vui lòng nhập lý do từ chối' : 'Please enter rejection reason');
      return;
    }
    console.log('Reject admin:', selectedAdmin, 'Reason:', rejectReason);
    alert(`${language === 'vi' ? 'Đã từ chối' : 'Rejected'}: ${selectedAdmin.name}`);
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedAdmin(null);
  };

  const handleDelete = (admin) => {
    if (window.confirm(`${language === 'vi' ? 'Xác nhận xóa' : 'Confirm delete'}: ${admin.name}?`)) {
      console.log('Delete admin:', admin);
      alert(`${language === 'vi' ? 'Đã xóa' : 'Deleted'}: ${admin.name}`);
    }
  };

  const getPermissionText = (key) => {
    const permissions = {
      manageUsers: language === 'vi' ? 'Quản lý người dùng' : 'Manage Users',
      managePosts: language === 'vi' ? 'Quản lý bài đăng' : 'Manage Posts',
      managePackages: language === 'vi' ? 'Quản lý gói dịch vụ' : 'Manage Packages',
      viewReports: language === 'vi' ? 'Xem báo cáo' : 'View Reports',
      manageAdmins: language === 'vi' ? 'Quản lý admin' : 'Manage Admins',
      systemSettings: language === 'vi' ? 'Cài đặt hệ thống' : 'System Settings'
    };
    return permissions[key] || key;
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
            <StatIcon $color="#667eea">
              <Users />
            </StatIcon>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>{language === 'vi' ? 'Tổng Admin' : 'Total Admins'}</StatLabel>
          </StatCard>
          <StatCard $color="#10b981">
            <StatIcon $color="#10b981">
              <UserCheck />
            </StatIcon>
            <StatValue>{stats.approved}</StatValue>
            <StatLabel>{language === 'vi' ? 'Đã Duyệt' : 'Approved'}</StatLabel>
          </StatCard>
          <StatCard $color="#f59e0b">
            <StatIcon $color="#f59e0b">
              <Clock />
            </StatIcon>
            <StatValue>{stats.pending}</StatValue>
            <StatLabel>{language === 'vi' ? 'Chờ Duyệt' : 'Pending'}</StatLabel>
          </StatCard>
          <StatCard $color="#ef4444">
            <StatIcon $color="#ef4444">
              <UserX />
            </StatIcon>
            <StatValue>{stats.rejected}</StatValue>
            <StatLabel>{language === 'vi' ? 'Từ Chối' : 'Rejected'}</StatLabel>
          </StatCard>
        </StatsGrid>

        <ControlBar>
          <SearchBox>
            <Search />
            <input
              type="text"
              placeholder={language === 'vi' ? 'Tìm kiếm theo tên hoặc email...' : 'Search by name or email...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          
          <FilterGroup>
            <Filter size={18} />
            <FilterButton
              $active={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
            >
              {language === 'vi' ? 'Tất cả' : 'All'}
            </FilterButton>
            <FilterButton
              $active={statusFilter === 'approved'}
              onClick={() => setStatusFilter('approved')}
            >
              {language === 'vi' ? 'Đã duyệt' : 'Approved'}
            </FilterButton>
            <FilterButton
              $active={statusFilter === 'pending'}
              onClick={() => setStatusFilter('pending')}
            >
              {language === 'vi' ? 'Chờ duyệt' : 'Pending'}
            </FilterButton>
            <FilterButton
              $active={statusFilter === 'rejected'}
              onClick={() => setStatusFilter('rejected')}
            >
              {language === 'vi' ? 'Từ chối' : 'Rejected'}
            </FilterButton>
          </FilterGroup>

          <AddButton>
            <Plus />
            {language === 'vi' ? 'Thêm Admin' : 'Add Admin'}
          </AddButton>
        </ControlBar>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>{language === 'vi' ? 'Tên' : 'Name'}</th>
                <th>{language === 'vi' ? 'Email' : 'Email'}</th>
                <th>{language === 'vi' ? 'Vai trò' : 'Role'}</th>
                <th>{language === 'vi' ? 'Trạng thái' : 'Status'}</th>
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
                  <td>
                    <RoleBadge $role={admin.role}>
                      {getRoleText(admin.role)}
                    </RoleBadge>
                  </td>
                  <td>
                    <StatusBadge $status={admin.status}>
                      {getStatusText(admin.status)}
                    </StatusBadge>
                  </td>
                  <td>{admin.joinDate}</td>
                  <td>
                    {admin.reviewDate ? (
                      admin.reviewDate
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                        {language === 'vi' ? 'Chưa có' : 'Not set'}
                      </span>
                    )}
                  </td>
                  <td>
                    <ActionButtons>
                      <ActionButton 
                        $variant="view"
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setShowViewModal(true);
                        }}
                      >
                        <Eye />
                        {language === 'vi' ? 'Xem' : 'View'}
                      </ActionButton>
                      {admin.status === 'pending' && (
                        <>
                          <ActionButton 
                            $variant="approve"
                            onClick={() => handleApprove(admin)}
                          >
                            <CheckCircle />
                            {language === 'vi' ? 'Duyệt' : 'Approve'}
                          </ActionButton>
                          <ActionButton 
                            $variant="reject"
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setShowRejectModal(true);
                            }}
                          >
                            <XCircle />
                            {language === 'vi' ? 'Từ chối' : 'Reject'}
                          </ActionButton>
                        </>
                      )}
                      {admin.status === 'approved' && admin.role !== 'super_admin' && (
                        <>
                          <ActionButton $variant="edit">
                            <Edit />
                            {language === 'vi' ? 'Sửa' : 'Edit'}
                          </ActionButton>
                          <ActionButton 
                            $variant="delete"
                            onClick={() => handleDelete(admin)}
                          >
                            <Trash2 />
                            {language === 'vi' ? 'Xóa' : 'Delete'}
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

        {/* View Admin Modal */}
        {showViewModal && selectedAdmin && (
          <Modal
            isOpen={showViewModal}
            onClose={() => {
              setShowViewModal(false);
              setSelectedAdmin(null);
            }}
            title={language === 'vi' ? 'Chi Tiết Admin' : 'Admin Details'}
          >
            <ModalContent>
              <ModalHeader>
                <h2>{selectedAdmin.name}</h2>
                <p>
                  <RoleBadge $role={selectedAdmin.role}>
                    {getRoleText(selectedAdmin.role)}
                  </RoleBadge>
                  {' '}
                  <StatusBadge $status={selectedAdmin.status}>
                    {getStatusText(selectedAdmin.status)}
                  </StatusBadge>
                </p>
              </ModalHeader>

              <InfoGrid>
                <InfoItem>
                  <Mail />
                  <div>
                    <InfoLabel>{language === 'vi' ? 'Email' : 'Email'}</InfoLabel>
                    <InfoValue>{selectedAdmin.email}</InfoValue>
                  </div>
                </InfoItem>
                <InfoItem>
                  <Phone />
                  <div>
                    <InfoLabel>{language === 'vi' ? 'Số điện thoại' : 'Phone'}</InfoLabel>
                    <InfoValue>{selectedAdmin.phone}</InfoValue>
                  </div>
                </InfoItem>
                <InfoItem>
                  <MapPin />
                  <div>
                    <InfoLabel>{language === 'vi' ? 'Địa điểm' : 'Location'}</InfoLabel>
                    <InfoValue>{selectedAdmin.location}</InfoValue>
                  </div>
                </InfoItem>
                <InfoItem>
                  <Calendar />
                  <div>
                    <InfoLabel>{language === 'vi' ? 'Ngày tham gia' : 'Join Date'}</InfoLabel>
                    <InfoValue>{selectedAdmin.joinDate}</InfoValue>
                  </div>
                </InfoItem>
              </InfoGrid>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={20} />
                  {language === 'vi' ? 'Quyền Hạn' : 'Permissions'}
                </h3>
                <PermissionsGrid>
                  {Object.entries(selectedAdmin.permissions).map(([key, value]) => (
                    <PermissionItem key={key} $enabled={value}>
                      {value ? <CheckCircle /> : <XCircle />}
                      <span>{getPermissionText(key)}</span>
                    </PermissionItem>
                  ))}
                </PermissionsGrid>
              </div>

              <ModalActions>
                <SecondaryButton onClick={() => {
                  setShowViewModal(false);
                  setSelectedAdmin(null);
                }}>
                  {language === 'vi' ? 'Đóng' : 'Close'}
                </SecondaryButton>
                {selectedAdmin.status === 'pending' && (
                  <>
                    <DangerButton onClick={() => {
                      setShowViewModal(false);
                      setShowRejectModal(true);
                    }}>
                      <XCircle size={16} />
                      {language === 'vi' ? 'Từ chối' : 'Reject'}
                    </DangerButton>
                    <PrimaryButton onClick={() => {
                      handleApprove(selectedAdmin);
                      setShowViewModal(false);
                      setSelectedAdmin(null);
                    }}>
                      <CheckCircle size={16} />
                      {language === 'vi' ? 'Duyệt' : 'Approve'}
                    </PrimaryButton>
                  </>
                )}
              </ModalActions>
            </ModalContent>
          </Modal>
        )}

        {/* Reject Admin Modal */}
        {showRejectModal && selectedAdmin && (
          <Modal
            isOpen={showRejectModal}
            onClose={() => {
              setShowRejectModal(false);
              setSelectedAdmin(null);
              setRejectReason('');
            }}
            title={language === 'vi' ? 'Từ Chối Admin' : 'Reject Admin'}
          >
            <ModalContent>
              <ModalHeader>
                <h2>{language === 'vi' ? 'Xác nhận từ chối' : 'Confirm Rejection'}</h2>
                <p>{language === 'vi' ? `Bạn có chắc muốn từ chối admin: ${selectedAdmin.name}?` : `Are you sure you want to reject admin: ${selectedAdmin.name}?`}</p>
              </ModalHeader>

              <FormGroup>
                <Label>
                  {language === 'vi' ? 'Lý do từ chối' : 'Rejection Reason'} <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <TextArea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={language === 'vi' ? 'Nhập lý do từ chối...' : 'Enter rejection reason...'}
                  required
                />
              </FormGroup>

              <ModalActions>
                <SecondaryButton onClick={() => {
                  setShowRejectModal(false);
                  setSelectedAdmin(null);
                  setRejectReason('');
                }}>
                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                </SecondaryButton>
                <DangerButton onClick={handleReject}>
                  <XCircle size={16} />
                  {language === 'vi' ? 'Xác nhận từ chối' : 'Confirm Reject'}
                </DangerButton>
              </ModalActions>
            </ModalContent>
          </Modal>
        )}
      </PageContainer>
    </DashboardLayout>
  );
};

export default AdminManagement;
