import { useState, useMemo } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import TableFilter from '../../components/TableFilter';
import { useLanguage } from '../../context/LanguageContext';
import { Users, Building2, CheckSquare, XSquare, Shield, Calendar, Eye, CheckCircle, Ban, Trash2 } from 'lucide-react';

const UserManagementContainer = styled.div``;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 16px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textLight};
  font-weight: ${props => props.$active ? '600' : '500'};
  font-size: 15px;
  cursor: pointer;
  border-bottom: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  margin-bottom: -2px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.bgDark};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatBox = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 20px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border-left: 4px solid ${props => props.$color || props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.sm};
  
  h3 {
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  p {
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
`;

const TableWrapper = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 16px;
    background: ${props => props.theme.colors.bgDark};
    font-weight: 600;
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    border-bottom: 2px solid ${props => props.theme.colors.border};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  td {
    padding: 16px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    font-size: 14px;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const IconButton = styled.button`
  padding: 8px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$variant === 'danger' ? '#fee2e2' : props.$variant === 'success' ? '#dcfce7' : '#e0e7ff'};
  color: ${props => props.$variant === 'danger' ? '#dc2626' : props.$variant === 'success' ? '#15803d' : '#4338ca'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const VerificationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$verified ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.$verified ? '#15803d' : '#dc2626'};
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.$status === 'success') return '#dcfce7';
    if (props.$status === 'danger') return '#fee2e2';
    return '#fef3c7';
  }};
  color: ${props => {
    if (props.$status === 'success') return '#15803d';
    if (props.$status === 'danger') return '#dc2626';
    return '#ca8a04';
  }};
`;

const DateText = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  display: block;
  
  &.interview {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
  }
`;

const VerificationModal = styled.div`
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
`;

const VerificationSection = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  label {
    display: block;
    font-size: 12px;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 4px;
    font-weight: 600;
  }
  
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    font-weight: 500;
  }
`;

const DocumentLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const RejectReasonBox = styled.div`
  margin-top: 16px;
  
  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
  }
  
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    background: ${props => props.theme.colors.bgLight};
    color: ${props => props.theme.colors.text};
    font-size: 14px;
    resize: vertical;
    min-height: 100px;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: #10b981;
        color: white;
        &:hover { background: #059669; }
      `;
    }
    if (props.$variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        &:hover { background: #dc2626; }
      `;
    }
    return `
      background: ${props.theme.colors.bgDark};
      color: ${props.theme.colors.text};
      &:hover { background: ${props.theme.colors.border}; }
    `;
  }}
`;

const UserManagement = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('candidates');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Dữ liệu ứng viên
  const [candidates] = useState([
    { 
      id: 1,
      name: 'Nguyễn Hùng Anh', 
      email: 'anhhung@gmail.com', 
      ekycVerified: true,
      approvalStatus: 'approved',
      joined: '2025-01-15',
      interviewDate: '2025-02-20',
    },
    { 
      id: 2,
      name: 'Trương Tú Phương', 
      email: 'truongphuong@gmail.com', 
      ekycVerified: true,
      approvalStatus: 'pending',
      joined: '2025-01-20',
      interviewDate: '2025-02-25',
    },
    { 
      id: 3,
      name: 'Lê Thành', 
      email: 'lethanh2327@gmail.com', 
      ekycVerified: false,
      approvalStatus: 'rejected',
      joined: '2025-01-05',
      interviewDate: null,
    },
    { 
      id: 4,
      name: 'Phạm Lê Duy', 
      email: 'phamduy@gmail.com', 
      ekycVerified: true,
      approvalStatus: 'approved',
      joined: '2025-02-01',
      interviewDate: '2025-03-05',
    },
    { 
      id: 5,
      name: 'Hoàng Trúc Anh', 
      email: 'anhht@gmail.com', 
      ekycVerified: false,
      approvalStatus: 'pending',
      joined: '2025-02-10',
      interviewDate: '2025-03-01',
    },
  ]);

  // Dữ liệu nhà tuyển dụng
  const [employers] = useState([
    { 
      id: 1,
      name: 'FPT Software', 
      email: 'hr@fpt.com', 
      verified: true,
      approvalStatus: 'approved',
      joined: '2025-01-10',
      interviewDate: '2025-02-15',
    },
    { 
      id: 2,
      name: 'Viettel Group', 
      email: 'recruit@viettel.com', 
      verified: true,
      approvalStatus: 'approved',
      joined: '2025-01-05',
      interviewDate: '2025-02-18',
    },
    { 
      id: 3,
      name: 'Công ty TNHH ABC', 
      email: 'contact@abc.com', 
      verified: false,
      approvalStatus: 'pending',
      joined: '2025-02-01',
      interviewDate: '2025-03-10',
    },
    { 
      id: 4,
      name: 'VinGroup', 
      email: 'hr@vingroup.com', 
      verified: true,
      approvalStatus: 'approved',
      joined: '2025-01-20',
      interviewDate: '2025-02-22',
    },
    { 
      id: 5,
      name: 'Shopee Vietnam', 
      email: 'talent@shopee.vn', 
      verified: false,
      approvalStatus: 'rejected',
      joined: '2025-01-25',
      interviewDate: null,
    },
  ]);

  const getApprovalStatusText = (status) => {
    if (status === 'approved') return language === 'vi' ? 'Đã duyệt' : 'Approved';
    if (status === 'rejected') return language === 'vi' ? 'Không duyệt' : 'Rejected';
    if (status === 'pending') return language === 'vi' ? 'Chờ duyệt' : 'Pending';
    return status;
  };

  const getApprovalStatusVariant = (status) => {
    if (status === 'approved') return 'success';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  const filterOptions = [
    { value: 'approved', label: language === 'vi' ? 'Đã duyệt' : 'Approved' },
    { value: 'pending', label: language === 'vi' ? 'Chờ duyệt' : 'Pending' },
    { value: 'rejected', label: language === 'vi' ? 'Không duyệt' : 'Rejected' },
    { value: 'verified', label: language === 'vi' ? 'Đã xác thực' : 'Verified' },
    { value: 'unverified', label: language === 'vi' ? 'Chưa xác thực' : 'Unverified' },
  ];

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = searchTerm === '' || 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = filters.length === 0 || 
        filters.includes(candidate.approvalStatus) ||
        (filters.includes('verified') && candidate.ekycVerified) ||
        (filters.includes('unverified') && !candidate.ekycVerified);
      
      return matchesSearch && matchesFilters;
    });
  }, [candidates, searchTerm, filters]);

  const filteredEmployers = useMemo(() => {
    return employers.filter(employer => {
      const matchesSearch = searchTerm === '' || 
        employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = filters.length === 0 || 
        filters.includes(employer.approvalStatus) ||
        (filters.includes('verified') && employer.verified) ||
        (filters.includes('unverified') && !employer.verified);
      
      return matchesSearch && matchesFilters;
    });
  }, [employers, searchTerm, filters]);

  const handleFilterToggle = (filterValue) => {
    setFilters(prev => 
      prev.includes(filterValue) 
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  const candidateStats = {
    total: candidates.length,
    approved: candidates.filter(c => c.approvalStatus === 'approved').length,
    pending: candidates.filter(c => c.approvalStatus === 'pending').length,
    verified: candidates.filter(c => c.ekycVerified).length,
  };

  const employerStats = {
    total: employers.length,
    approved: employers.filter(e => e.approvalStatus === 'approved').length,
    pending: employers.filter(e => e.approvalStatus === 'pending').length,
    verified: employers.filter(e => e.verified).length,
  };

  const pendingStats = {
    total: pendingEmployers.length,
    highScore: pendingEmployers.filter(e => e.verificationScore >= 80).length,
    lowRisk: pendingEmployers.filter(e => e.riskLevel === 'low').length,
    complete: pendingEmployers.filter(e => e.documentsComplete).length,
  };

  const handleViewVerification = (employer) => {
    setSelectedEmployer(employer);
    setShowVerificationModal(true);
  };

  const handleApprove = (employerId) => {
    alert(`Đã phê duyệt nhà tuyển dụng ID: ${employerId}`);
    setShowVerificationModal(false);
  };

  const handleReject = (employerId) => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    alert(`Đã từ chối nhà tuyển dụng ID: ${employerId}\nLý do: ${rejectReason}`);
    setShowVerificationModal(false);
    setRejectReason('');
  };

  const handleRequestMoreInfo = (employerId) => {
    alert(`Đã gửi yêu cầu bổ sung thông tin cho nhà tuyển dụng ID: ${employerId}`);
    setShowVerificationModal(false);
  };

  const getRiskLevelColor = (level) => {
    if (level === 'low') return '#10b981';
    if (level === 'medium') return '#f59e0b';
    return '#ef4444';
  };

  const getRiskLevelText = (level) => {
    if (level === 'low') return language === 'vi' ? 'Thấp' : 'Low';
    if (level === 'medium') return language === 'vi' ? 'Trung bình' : 'Medium';
    return language === 'vi' ? 'Cao' : 'High';
  };

  return (
    <DashboardLayout role="admin">
      <UserManagementContainer>
        <PageHeader>
          <h1>{language === 'vi' ? 'Quản Lý Người Dùng' : 'User Management'}</h1>
          <p>{language === 'vi' ? 'Quản lý ứng viên và nhà tuyển dụng trên nền tảng' : 'Manage candidates and employers on the platform'}</p>
        </PageHeader>

        <TabContainer>
          <Tab 
            $active={activeTab === 'candidates'} 
            onClick={() => {
              setActiveTab('candidates');
              setSearchTerm('');
              setFilters([]);
            }}
          >
            <Users />
            {language === 'vi' ? 'Ứng Viên' : 'Candidates'}
            <span style={{ 
              marginLeft: '4px', 
              padding: '2px 8px', 
              background: activeTab === 'candidates' ? '#1e40af' : '#64748b',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {candidates.length}
            </span>
          </Tab>
          <Tab 
            $active={activeTab === 'employers'} 
            onClick={() => {
              setActiveTab('employers');
              setSearchTerm('');
              setFilters([]);
            }}
          >
            <Building2 />
            {language === 'vi' ? 'Nhà Tuyển Dụng' : 'Employers'}
            <span style={{ 
              marginLeft: '4px', 
              padding: '2px 8px', 
              background: activeTab === 'employers' ? '#1e40af' : '#64748b',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {employers.length}
            </span>
          </Tab>
          <Tab 
            $active={activeTab === 'pending'} 
            onClick={() => {
              setActiveTab('pending');
              setSearchTerm('');
              setFilters([]);
            }}
          >
            <Clock />
            {language === 'vi' ? 'Duyệt NTD' : 'Approve Employers'}
            <span style={{ 
              marginLeft: '4px', 
              padding: '2px 8px', 
              background: activeTab === 'pending' ? '#f59e0b' : '#64748b',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {pendingEmployers.length}
            </span>
          </Tab>
        </TabContainer>

        {activeTab === 'candidates' && (
          <>
            <StatsRow>
              <StatBox $color="#1e40af">
                <h3>{language === 'vi' ? 'Tổng ứng viên' : 'Total Candidates'}</h3>
                <p>{candidateStats.total}</p>
              </StatBox>
              <StatBox $color="#10b981">
                <h3>{language === 'vi' ? 'Đã duyệt' : 'Approved'}</h3>
                <p>{candidateStats.approved}</p>
              </StatBox>
              <StatBox $color="#f59e0b">
                <h3>{language === 'vi' ? 'Chờ duyệt' : 'Pending'}</h3>
                <p>{candidateStats.pending}</p>
              </StatBox>
              <StatBox $color="#8b5cf6">
                <h3>{language === 'vi' ? 'Đã xác thực eKYC' : 'eKYC Verified'}</h3>
                <p>{candidateStats.verified}</p>
              </StatBox>
            </StatsRow>

            <TableFilter 
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filterOptions={filterOptions}
              activeFilters={filters}
              onFilterToggle={handleFilterToggle}
              searchPlaceholder={language === 'vi' ? 'Tìm kiếm ứng viên...' : 'Search candidates...'}
            />

            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>{language === 'vi' ? 'Tên ứng viên' : 'Candidate Name'}</th>
                    <th>{language === 'vi' ? 'Email' : 'Email'}</th>
                    <th>{language === 'vi' ? 'eKYC (4 bước)' : 'eKYC (4 steps)'}</th>
                    <th>{language === 'vi' ? 'Trạng thái duyệt' : 'Approval Status'}</th>
                    <th>{language === 'vi' ? 'Ngày tham gia' : 'Join Date'}</th>
                    <th>{language === 'vi' ? 'Ngày phỏng vấn' : 'Interview Date'}</th>
                    <th>{language === 'vi' ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td style={{ fontWeight: 600 }}>{candidate.name}</td>
                      <td>{candidate.email}</td>
                      <td>
                        <VerificationBadge $verified={candidate.ekycVerified}>
                          {candidate.ekycVerified ? <CheckSquare /> : <XSquare />}
                          {candidate.ekycVerified 
                            ? (language === 'vi' ? 'Đã xác thực' : 'Verified')
                            : (language === 'vi' ? 'Chưa xác thực' : 'Unverified')
                          }
                        </VerificationBadge>
                      </td>
                      <td>
                        <StatusBadge $status={getApprovalStatusVariant(candidate.approvalStatus)}>
                          {getApprovalStatusText(candidate.approvalStatus)}
                        </StatusBadge>
                      </td>
                      <td>
                        <DateText>{candidate.joined}</DateText>
                      </td>
                      <td>
                        {candidate.interviewDate ? (
                          <DateText className="interview">
                            <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            {candidate.interviewDate}
                          </DateText>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                            {language === 'vi' ? 'Chưa có' : 'Not set'}
                          </span>
                        )}
                      </td>
                      <td>
                        <ActionButtons>
                          <IconButton title={language === 'vi' ? 'Xem chi tiết' : 'View details'}>
                            <Eye size={16} />
                          </IconButton>
                          {candidate.approvalStatus === 'pending' && (
                            <>
                              <IconButton $variant="success" title={language === 'vi' ? 'Phê duyệt' : 'Approve'}>
                                <CheckCircle size={16} />
                              </IconButton>
                              <IconButton $variant="danger" title={language === 'vi' ? 'Từ chối' : 'Reject'}>
                                <Ban size={16} />
                              </IconButton>
                            </>
                          )}
                          <IconButton $variant="danger" title={language === 'vi' ? 'Xóa' : 'Delete'}>
                            <Trash2 size={16} />
                          </IconButton>
                        </ActionButtons>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </>
        )}

        {activeTab === 'employers' && (
          <>
            <StatsRow>
              <StatBox $color="#1e40af">
                <h3>{language === 'vi' ? 'Tổng nhà tuyển dụng' : 'Total Employers'}</h3>
                <p>{employerStats.total}</p>
              </StatBox>
              <StatBox $color="#10b981">
                <h3>{language === 'vi' ? 'Đã duyệt' : 'Approved'}</h3>
                <p>{employerStats.approved}</p>
              </StatBox>
              <StatBox $color="#f59e0b">
                <h3>{language === 'vi' ? 'Chờ duyệt' : 'Pending'}</h3>
                <p>{employerStats.pending}</p>
              </StatBox>
              <StatBox $color="#8b5cf6">
                <h3>{language === 'vi' ? 'Đã xác thực' : 'Verified'}</h3>
                <p>{employerStats.verified}</p>
              </StatBox>
            </StatsRow>

            <TableFilter 
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filterOptions={filterOptions}
              activeFilters={filters}
              onFilterToggle={handleFilterToggle}
              searchPlaceholder={language === 'vi' ? 'Tìm kiếm nhà tuyển dụng...' : 'Search employers...'}
            />

            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>{language === 'vi' ? 'Tên nhà tuyển dụng' : 'Employer Name'}</th>
                    <th>{language === 'vi' ? 'Email' : 'Email'}</th>
                    <th>{language === 'vi' ? 'Trạng thái phê duyệt' : 'Approval Status'}</th>
                    <th>{language === 'vi' ? 'Ngày tham gia' : 'Join Date'}</th>
                    <th>{language === 'vi' ? 'Ngày xét duyệt' : 'Approve Date'}</th>
                    <th>{language === 'vi' ? 'Đã xác thực' : 'Verified'}</th>
                    <th>{language === 'vi' ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployers.map((employer) => (
                    <tr key={employer.id}>
                      <td style={{ fontWeight: 600 }}>{employer.name}</td>
                      <td>{employer.email}</td>
                      <td>
                        <StatusBadge $status={getApprovalStatusVariant(employer.approvalStatus)}>
                          {getApprovalStatusText(employer.approvalStatus)}
                        </StatusBadge>
                      </td>
                      <td>
                        <DateText>{employer.joined}</DateText>
                      </td>
                      <td>
                        {employer.interviewDate ? (
                          <DateText className="interview">
                            <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            {employer.interviewDate}
                          </DateText>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                            {language === 'vi' ? 'Chưa có' : 'Not set'}
                          </span>
                        )}
                      </td>
                      <td>
                        <VerificationBadge $verified={employer.verified}>
                          {employer.verified ? <Shield /> : <XSquare />}
                          {employer.verified 
                            ? (language === 'vi' ? 'Đã xác thực' : 'Verified')
                            : (language === 'vi' ? 'Chưa xác thực' : 'Unverified')
                          }
                        </VerificationBadge>
                      </td>
                      <td>
                        <ActionButtons>
                          <IconButton title={language === 'vi' ? 'Xem chi tiết' : 'View details'}>
                            <Eye size={16} />
                          </IconButton>
                          {employer.approvalStatus === 'pending' && (
                            <>
                              <IconButton $variant="success" title={language === 'vi' ? 'Phê duyệt' : 'Approve'}>
                                <CheckCircle size={16} />
                              </IconButton>
                              <IconButton $variant="danger" title={language === 'vi' ? 'Từ chối' : 'Reject'}>
                                <Ban size={16} />
                              </IconButton>
                            </>
                          )}
                          <IconButton $variant="danger" title={language === 'vi' ? 'Xóa' : 'Delete'}>
                            <Trash2 size={16} />
                          </IconButton>
                        </ActionButtons>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </>
        )}
      </UserManagementContainer>
    </DashboardLayout>
  );
};

export default UserManagement;


