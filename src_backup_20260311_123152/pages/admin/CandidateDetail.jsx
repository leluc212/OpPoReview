import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Edit
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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.bgDark};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;
  
  &:hover {
    background: ${props => props.theme.colors.border};
    transform: translateX(-4px);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 32px;
  margin-bottom: 24px;
  color: white;
  box-shadow: ${props => props.theme.shadows.card};
`;

const CandidateHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const CandidateAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  color: white;
  border: 4px solid rgba(255, 255, 255, 0.3);
  position: relative;
  
  .edit-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 32px;
    height: 32px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    
    svg {
      width: 16px;
      height: 16px;
      color: #1e40af;
    }
  }
`;

const CandidateInfo = styled.div`
  flex: 1;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  .id {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 12px;
  }
  
  .contact {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
      justify-content: center;
    }
    
    .item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 20px;
  text-align: center;
  
  .label {
    font-size: 13px;
    opacity: 0.9;
    margin-bottom: 8px;
  }
  
  .value {
    font-size: 28px;
    font-weight: 700;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  padding-bottom: 2px;
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  border: none;
  border-bottom: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  border-radius: ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0 0;
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgDark};
  }
`;

const ContentSection = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  .label {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 6px;
    font-weight: 500;
  }
  
  .value {
    font-size: 16px;
    color: ${props => props.theme.colors.text};
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    width: 22px;
    height: 22px;
    color: ${props => props.theme.colors.primary};
  }
`;

const ActionButtonsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButton = styled.button`
  padding: 14px 20px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  background: ${props => {
    if (props.$variant === 'success') return '#10b981';
    if (props.$variant === 'danger') return '#ef4444';
    if (props.$variant === 'warning') return '#f59e0b';
    return props.theme.colors.primary;
  }};
  
  color: white;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const WorkAreaTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  padding: 6px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const VerificationCard = styled.div`
  background: ${props => props.$verified ? '#dcfce7' : '#fef3c7'};
  border-left: 4px solid ${props => props.$verified ? '#10b981' : '#f59e0b'};
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$verified ? '#10b981' : '#f59e0b'};
  }
  
  .content {
    flex: 1;
    
    .title {
      font-weight: 600;
      font-size: 15px;
      color: ${props => props.$verified ? '#15803d' : '#92400e'};
      margin-bottom: 4px;
    }
    
    .desc {
      font-size: 13px;
      color: ${props => props.$verified ? '#166534' : '#78350f'};
    }
  }
`;

const ViolationCard = styled.div`
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 12px;
  
  .date {
    font-size: 12px;
    color: #92400e;
    margin-bottom: 6px;
    font-weight: 600;
  }
  
  .content {
    font-size: 14px;
    color: #78350f;
    font-weight: 500;
  }
`;

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('info');

  // Sample data - trong thực tế sẽ fetch từ API dựa trên id
  const candidatesData = {
    1: {
      id: 1,
      name: 'Mai Thanh Tuấn',
      email: 'Tuanmaytinh@gmail.com',
      phone: '0938 678 209',
      dob: '12/05/2001',
      gender: 'Nam',
      address: 'Quận 1 - TP.HCM',
      ekycVerified: true,
      approvalStatus: 'approved',
      joined: '10/01/2026',
      jobsCompleted: 32,
      rating: 4.6,
      totalEarned: '1,250,000',
      violations: [],
      workAreas: ['Quận 1', 'Quận 3', 'Bình Thạnh']
    },
    2: {
      id: 2,
      name: 'Trần Thị Thu Chi',
      email: 'thuchi12795@gmail.com',
      phone: '0912 345 678',
      dob: '15/08/1999',
      gender: 'Nữ',
      address: 'Quận 3 - TP.HCM',
      ekycVerified: true,
      approvalStatus: 'pending',
      joined: '15/01/2026',
      jobsCompleted: 28,
      rating: 4.8,
      totalEarned: '980,000',
      violations: [],
      workAreas: ['Quận 3', 'Quận 10']
    },
    3: {
      id: 3,
      name: 'Ngô Thanh Sơn',
      email: 'Alibaba05623@gmail.com',
      phone: '0909 876 543',
      dob: '20/03/2000',
      gender: 'Nam',
      address: 'Quận 8 - TP.HCM',
      ekycVerified: false,
      approvalStatus: 'pending',
      joined: '20/01/2026',
      jobsCompleted: 15,
      rating: 4.2,
      totalEarned: '520,000',
      violations: [
        { date: '10/3', content: 'Job cafe ABC - Đến muộn 15 phút' },
        { date: '16/3', content: 'Job Coffee House - Không hoàn thành công việc' }
      ],
      workAreas: ['Quận 8']
    },
    4: {
      id: 4,
      name: 'Phạm Thị Thu Thao',
      email: 'thuthao123@gmail.com',
      phone: '0987 654 321',
      dob: '05/11/1998',
      gender: 'Nữ',
      address: 'Quận 7 - TP.HCM',
      ekycVerified: true,
      approvalStatus: 'approved',
      joined: '25/01/2026',
      jobsCompleted: 45,
      rating: 4.9,
      totalEarned: '1,850,000',
      violations: [],
      workAreas: ['Quận 7', 'Quận 4', 'Bình Thạnh']
    },
    5: {
      id: 5,
      name: 'Hoàng Yến Vy',
      email: 'dori.hyv@gmail.com',
      phone: '0901 234 567',
      dob: '18/07/2002',
      gender: 'Nữ',
      address: 'Thủ Đức - TP.HCM',
      ekycVerified: false,
      approvalStatus: 'rejected',
      joined: '30/01/2026',
      jobsCompleted: 5,
      rating: 3.2,
      totalEarned: '180,000',
      violations: [
        { date: '5/3', content: 'Job Starbucks - Vi phạm quy định trang phục' },
        { date: '7/3', content: 'Job Highlands - Thái độ không tốt với khách hàng' },
        { date: '8/3', content: 'Job Phúc Long - Không đến làm việc' }
      ],
      workAreas: ['Thủ Đức']
    }
  };

  const candidate = candidatesData[id] || candidatesData[1];

  return (
    <DashboardLayout role="admin" key={language}>
      <PageContainer>
        <BackButton onClick={() => navigate('/admin/candidates')}>
          <ArrowLeft />
          {language === 'vi' ? 'Quay lại' : 'Back'}
        </BackButton>

        <HeaderSection>
          <CandidateHeader>
            <CandidateAvatar>
              {candidate.name.charAt(0)}
              <div className="edit-icon">
                <Edit />
              </div>
            </CandidateAvatar>
            <CandidateInfo>
              <h1>{candidate.name}</h1>
              <div className="id">ID: UV{candidate.id.toString().padStart(4, '0')}</div>
              <div className="contact">
                <div className="item">
                  <Mail />
                  {candidate.email}
                </div>
                <div className="item">
                  <Phone />
                  {candidate.phone}
                </div>
                <div className="item">
                  <MapPin />
                  {candidate.address}
                </div>
                <div className="item">
                  <Calendar />
                  {candidate.joined}
                </div>
              </div>
            </CandidateInfo>
          </CandidateHeader>

          <StatsRow>
            <StatCard>
              <div className="label">{language === 'vi' ? 'Job Gấp đã làm' : 'Jobs Completed'}</div>
              <div className="value">{candidate.jobsCompleted}</div>
            </StatCard>
            <StatCard>
              <div className="label">{language === 'vi' ? 'Trust score' : 'Trust Score'}</div>
              <div className="value">4.6 / 5</div>
            </StatCard>
          </StatsRow>
        </HeaderSection>

        <TabsContainer>
          <Tab $active={activeTab === 'info'} onClick={() => setActiveTab('info')}>
            {language === 'vi' ? 'Thông tin cá nhân' : 'Personal Info'}
          </Tab>
          <Tab $active={activeTab === 'career'} onClick={() => setActiveTab('career')}>
            {language === 'vi' ? 'Lịch sử việc làm' : 'Career History'}
          </Tab>
          <Tab $active={activeTab === 'activity'} onClick={() => setActiveTab('activity')}>
            {language === 'vi' ? 'Hoạt động Job Gấp' : 'Job Activity'}
          </Tab>
          <Tab $active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>
            {language === 'vi' ? 'Đánh giá' : 'Reviews'}
          </Tab>
          <Tab $active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')}>
            {language === 'vi' ? 'Ví ứng viên' : 'Wallet'}
          </Tab>
          <Tab $active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
            {language === 'vi' ? 'Lịch sử vi phạm' : 'Violation History'}
          </Tab>
        </TabsContainer>

        <ContentSection>
          {activeTab === 'info' && (
            <>
              <SectionTitle>{language === 'vi' ? 'Thông tin chi tiết' : 'Detailed Information'}</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <div className="label">{language === 'vi' ? 'Họ và tên:' : 'Full Name:'}</div>
                  <div className="value">{candidate.name}</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">{language === 'vi' ? 'Ngày sinh:' : 'Date of Birth:'}</div>
                  <div className="value">{candidate.dob}</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">{language === 'vi' ? 'Giới tính:' : 'Gender:'}</div>
                  <div className="value">{candidate.gender}</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">Email:</div>
                  <div className="value">
                    <Mail size={16} />
                    {candidate.email}
                  </div>
                </InfoItem>
                <InfoItem>
                  <div className="label">{language === 'vi' ? 'Điện thoại:' : 'Phone:'}</div>
                  <div className="value">
                    <Phone size={16} />
                    {candidate.phone}
                  </div>
                </InfoItem>
                <InfoItem>
                  <div className="label">{language === 'vi' ? 'Địa chỉ:' : 'Address:'}</div>
                  <div className="value">
                    <MapPin size={16} />
                    {candidate.address}
                  </div>
                </InfoItem>
              </InfoGrid>

              <SectionTitle style={{ marginTop: '32px' }}>
                {language === 'vi' ? 'Khu vực có thể làm việc:' : 'Work Areas:'}
              </SectionTitle>
              <WorkAreaTags>
                {candidate.workAreas.map((area, index) => (
                  <Tag key={index}>
                    <MapPin size={14} />
                    {area}
                  </Tag>
                ))}
              </WorkAreaTags>

              <SectionTitle style={{ marginTop: '32px' }}>
                {language === 'vi' ? 'Xác minh hồ sơ' : 'Profile Verification'}
              </SectionTitle>
              <VerificationCard $verified={candidate.ekycVerified}>
                {candidate.ekycVerified ? <Shield /> : <AlertTriangle />}
                <div className="content">
                  <div className="title">
                    {candidate.ekycVerified 
                      ? (language === 'vi' ? 'Đã xác minh hồ sơ' : 'Profile Verified')
                      : (language === 'vi' ? 'Chưa xác minh hồ sơ' : 'Profile Not Verified')
                    }
                  </div>
                  <div className="desc">
                    {language === 'vi' ? 'eKYC - 4 bước xác thực' : 'eKYC - 4-step verification'}
                  </div>
                </div>
                {candidate.ekycVerified ? <CheckCircle size={20} /> : <XCircle size={20} />}
              </VerificationCard>

            </>
          )}

          {activeTab === 'wallet' && (
            <>
              <SectionTitle>{language === 'vi' ? 'Ví ứng viên' : 'Candidate Wallet'}</SectionTitle>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', marginBottom: '24px' }}>
                {candidate.totalEarned} VND
              </div>
              <InfoGrid>
                <InfoItem>
                  <div className="label">{language === 'vi' ? 'Số dư hiện tại:' : 'Current Balance:'}</div>
                  <div className="value">{candidate.totalEarned} VND</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">{language === 'vi' ? 'Tổng tiền đã nhận:' : 'Total Earned:'}</div>
                  <div className="value">8,500,000 VND</div>
                </InfoItem>
              </InfoGrid>
            </>
          )}

          {activeTab === 'activity' && (
            <>
              <SectionTitle>{language === 'vi' ? 'Hoạt động Job Gấp' : 'Job Activity'}</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <div className="label">{language === 'vi' ? 'Job đã hoàn thành:' : 'Jobs Completed:'}</div>
                  <div className="value">{candidate.jobsCompleted}</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">Rating:</div>
                  <div className="value">{candidate.rating} / 5</div>
                </InfoItem>
              </InfoGrid>
            </>
          )}

          {activeTab === 'reviews' && (
            <>
              <SectionTitle>{language === 'vi' ? 'Đánh giá từ nhà tuyển dụng' : 'Employer Reviews'}</SectionTitle>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {language === 'vi' ? 'Chưa có đánh giá nào' : 'No reviews yet'}
              </div>
            </>
          )}

          {activeTab === 'career' && (
            <>
              <SectionTitle>{language === 'vi' ? 'Lịch sử việc làm' : 'Career history'}</SectionTitle>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {language === 'vi' ? 'Chưa có thông tin nghề nghiệp' : 'No career information yet'}
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <>
              <SectionTitle>
                <AlertTriangle />
                {language === 'vi' ? 'Lịch sử vi phạm' : 'Violation History'}
              </SectionTitle>
              {candidate.violations.length > 0 ? (
                candidate.violations.map((violation, index) => (
                  <ViolationCard key={index}>
                    <div className="date">{violation.date}</div>
                    <div className="content">{violation.content}</div>
                  </ViolationCard>
                ))
              ) : (
                <div style={{ fontSize: '14px', color: '#10b981', fontWeight: '600' }}>
                  {language === 'vi' ? '✓ Không có vi phạm nào' : '✓ No violations'}
                </div>
              )}
            </>
          )}
        </ContentSection>
      </PageContainer>
    </DashboardLayout>
  );
};

export default CandidateDetail;
