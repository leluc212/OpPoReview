import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatsCard from '../../components/StatsCard';
import { useLanguage } from '../../context/LanguageContext';
import { Users, Briefcase, Building2, DollarSign, CheckSquare, XSquare, Shield, Calendar, ArrowRight } from 'lucide-react';

const DashboardContainer = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 48px;
  
  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    position: relative;
    padding-left: 16px;
    
    @media (max-width: 768px) {
      font-size: 20px;
      padding-left: 12px;
    }
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 28px;
      background: ${props => props.theme.colors.gradientPrimary};
      border-radius: 3px;
      
      @media (max-width: 768px) {
        width: 4px;
        height: 22px;
      }
    }
  }
`;

const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  &:hover {
    opacity: 0.9;
    transform: translateX(4px);
  }
  
  svg {
    width: 16px;
    height: 16px;
    
    @media (max-width: 768px) {
      width: 14px;
      height: 14px;
    }
  }
`;

const TableWrapper = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  box-shadow: ${props => props.theme.shadows.card};
  
  @media (max-width: 768px) {
    border-radius: ${props => props.theme.borderRadius.md};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  
  @media (max-width: 768px) {
    min-width: 600px;
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
    cursor: pointer;
    
    &:hover {
      background: ${props => props.theme.colors.bgDark};
    }
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

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Sample data for recent candidates
  const recentCandidates = [
    { 
      id: 1,
      name: 'Nguyễn Văn A', 
      email: 'nguyenvana@example.com', 
      ekycVerified: true,
      approvalStatus: 'approved',
      joined: '2024-03-05',
      interviewDate: '2024-03-15',
    },
    { 
      id: 2,
      name: 'Trần Thị B', 
      email: 'tranthib@example.com', 
      ekycVerified: true,
      approvalStatus: 'pending',
      joined: '2024-03-04',
      interviewDate: '2024-03-12',
    },
    { 
      id: 3,
      name: 'Lê Văn C', 
      email: 'levanc@example.com', 
      ekycVerified: false,
      approvalStatus: 'pending',
      joined: '2024-03-03',
      interviewDate: '2024-03-10',
    },
    { 
      id: 4,
      name: 'Phạm Thị D', 
      email: 'phamthid@example.com', 
      ekycVerified: true,
      approvalStatus: 'approved',
      joined: '2024-03-02',
      interviewDate: '2024-03-08',
    },
    { 
      id: 5,
      name: 'Hoàng Văn E', 
      email: 'hoangvane@example.com', 
      ekycVerified: false,
      approvalStatus: 'rejected',
      joined: '2024-03-01',
      interviewDate: null,
    },
  ];

  // Sample data for recent employers
  const recentEmployers = [
    { 
      id: 1,
      name: 'Highlands Coffee', 
      email: 'hr@highlandscoffee.com', 
      verified: true,
      approvalStatus: 'approved',
      joined: '2024-03-06',
      interviewDate: '2024-03-14',
    },
    { 
      id: 2,
      name: 'Phúc Long Coffee & Tea', 
      email: 'recruit@phuclong.com', 
      verified: true,
      approvalStatus: 'approved',
      joined: '2024-03-05',
      interviewDate: '2024-03-13',
    },
    { 
      id: 3,
      name: 'Katinat Saigon Kafe', 
      email: 'hr@katinat.com', 
      verified: true,
      approvalStatus: 'pending',
      joined: '2024-03-04',
      interviewDate: '2024-03-11',
    },
    { 
      id: 4,
      name: 'The Coffee House', 
      email: 'jobs@thecoffeehouse.com', 
      verified: false,
      approvalStatus: 'pending',
      joined: '2024-03-03',
      interviewDate: '2024-03-09',
    },
    { 
      id: 5,
      name: 'Starbucks Vietnam', 
      email: 'careers@starbucks.vn', 
      verified: true,
      approvalStatus: 'approved',
      joined: '2024-03-02',
      interviewDate: '2024-03-07',
    },
  ];
  
  const recentActivity = [
    { user: 'Abc', action: t.adminDashboard.activityRegisteredEmployer, time: t.adminDashboard.time2h },
    { user: 'xyz', action: t.adminDashboard.activityApplied, time: t.adminDashboard.time3h },
    { user: 'Design Inc.', action: t.adminDashboard.activityPostedJob, time: t.adminDashboard.time5h },
  ];

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

  return (
    <DashboardLayout role="admin" key={language}>
      <DashboardContainer>
        <StatsGrid>
          <StatsCard
            title={language === 'vi' ? 'Tổng Người Dùng' : 'Total Users'}
            value="2,458"
            change="+12%"
            changeText={language === 'vi' ? 'sơ với tháng trước' : 'vs last month'}
            icon={Users}
            color="linear-gradient(135deg, #1e40af 0%, #1e40af 100%)"
            positive
          />
          <StatsCard
            title={language === 'vi' ? 'Tin Đang Tuyển' : 'Active Jobs'}
            value="345"
            change="+8%"
            changeText={language === 'vi' ? 'sơ với tuần trước' : 'vs last week'}
            icon={Briefcase}
            color="linear-gradient(135deg, #F093FB 0%, #F5576C 100%)"
            positive
          />
          <StatsCard
            title={language === 'vi' ? 'Công Ty' : 'Companies'}
            value="156"
            change="+15"
            changeText={language === 'vi' ? 'đang chờ duyệt' : 'pending approval'}
            icon={Building2}
            color="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
            positive
          />
          <StatsCard
            title={language === 'vi' ? 'Doanh Thu' : 'Revenue'}
            value={language === 'vi' ? '24.5 tỷ VND' : '$1.05M USD'}
            change="+23%"
            changeText={language === 'vi' ? 'sơ với tháng trước' : 'vs last month'}
            icon={DollarSign}
            color="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
            positive
          />
        </StatsGrid>

        <Section>
          <SectionHeader>
            <h2>{language === 'vi' ? 'Hoạt Động Gần Đây' : 'Recent Activity'}</h2>
          </SectionHeader>
          
          <Table>
            <thead>
              <tr>
                <th>{language === 'vi' ? 'Người Dùng' : 'User'}</th>
                <th>{language === 'vi' ? 'Hành Động' : 'Action'}</th>
                <th>{language === 'vi' ? 'Thời Gian' : 'Time'}</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 600 }}>{activity.user}</td>
                  <td>{activity.action}</td>
                  <td style={{ color: '#E2E8F0', fontWeight: 500 }}>{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>

        <Section>
          <SectionHeader>
            <h2>{language === 'vi' ? 'Ứng Viên Gần Đây' : 'Recent Candidates'}</h2>
            <ViewAllButton onClick={() => navigate('/admin/candidates')}>
              {language === 'vi' ? 'Xem tất cả' : 'View All'}
              <ArrowRight />
            </ViewAllButton>
          </SectionHeader>
          
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>{language === 'vi' ? 'Tên ứng viên' : 'Candidate Name'}</th>
                  <th>{language === 'vi' ? 'Email' : 'Email'}</th>
                  <th>{language === 'vi' ? 'eKYC (4 bước)' : 'eKYC (4 steps)'}</th>
                  <th>{language === 'vi' ? 'Trạng thái duyệt' : 'Approval Status'}</th>
                  <th>{language === 'vi' ? 'Ngày tham gia' : 'Join Date'}</th>
                  <th>{language === 'vi' ? 'Ngày xét duyệt' : 'Review Date'}</th>
                </tr>
              </thead>
              <tbody>
                {recentCandidates.map((candidate) => (
                  <tr key={candidate.id} onClick={() => navigate('/admin/candidates')}>
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
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </Section>

        <Section>
          <SectionHeader>
            <h2>{language === 'vi' ? 'Nhà Tuyển Dụng Gần Đây' : 'Recent Employers'}</h2>
            <ViewAllButton onClick={() => navigate('/admin/employers')}>
              {language === 'vi' ? 'Xem tất cả' : 'View All'}
              <ArrowRight />
            </ViewAllButton>
          </SectionHeader>
          
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>{language === 'vi' ? 'Tên nhà tuyển dụng' : 'Employer Name'}</th>
                  <th>{language === 'vi' ? 'Email' : 'Email'}</th>
                  <th>{language === 'vi' ? 'Trạng thái phê duyệt' : 'Approval Status'}</th>
                  <th>{language === 'vi' ? 'Ngày tham gia' : 'Join Date'}</th>
                  <th>{language === 'vi' ? 'Ngày xác nhận' : 'Confirm Date'}</th>
                  <th>{language === 'vi' ? 'Đã xác thực' : 'Verified'}</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployers.map((employer) => (
                  <tr key={employer.id} onClick={() => navigate('/admin/employers')}>
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
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </Section>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default AdminDashboard;
