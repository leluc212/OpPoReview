import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import TableFilter from '../../components/TableFilter';
import Modal from '../../components/Modal';
import { Eye, CheckCircle, Star, Mail, Phone, MapPin, Calendar, Award, Briefcase, FileText } from 'lucide-react';

// Mock data
const INITIAL_APPLICATIONS = [
  { 
    id: 1, 
    candidate: 'Hiếu sàn', 
    job: 'Senior React Developer', 
    applied: '2 giờ trước', 
    status: 'pending', 
    completed: false, 
    marked: false, 
    messagesDeleted: false,
    email: 'hieuseu@example.com',
    phone: '0123 456 789',
    location: 'Hà Nội',
    experience: '5 năm',
    education: 'Đại học Bách Khoa',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
    bio: 'Tôi là một Senior Developer với 5 năm kinh nghiệm trong phát triển web. Đam mê công nghệ và luôn học hỏi những điều mới.'
  },
  { 
    id: 2, 
    candidate: 'Duy sàn', 
    job: 'Thu ngân', 
    applied: '5 giờ trước', 
    status: 'pending', 
    completed: false, 
    marked: false, 
    messagesDeleted: false,
    email: 'duuyseu@example.com',
    phone: '0987 654 321',
    location: 'TP. Hồ Chí Minh',
    experience: '2 năm',
    education: 'Cao đẳng Kinh tế',
    skills: ['Kế toán', 'Excel', 'Giao tiếp', 'Quản lý tiền mặt'],
    bio: 'Có kinh nghiệm làm việc tại các cửa hàng bán lẻ và nhà hàng. Cẩn thận, chính xác và trung thực.'
  },
  { 
    id: 3, 
    candidate: 'Nheo', 
    job: 'Nhân viên pha chế', 
    applied: '1 ngày trước', 
    status: 'approved', 
    completed: false, 
    marked: false, 
    messagesDeleted: false,
    email: 'nheo@example.com',
    phone: '0909 123 456',
    location: 'Đà Nẵng',
    experience: '3 năm',
    education: 'Trung cấp Ẩm thực',
    skills: ['Pha chế cà phê', 'Trà sữa', 'Cocktail', 'Latte Art', 'Phục vụ khách hàng'],
    bio: 'Đam mê nghệ thuật pha chế và tạo ra những ly đồ uống hoàn hảo. Có chứng chỉ Barista quốc tế.'
  },
  { 
    id: 4, 
    candidate: 'Gemmin', 
    job: 'Senior React Developer', 
    applied: '2 ngày trước', 
    status: 'rejected', 
    completed: false, 
    marked: false, 
    messagesDeleted: false,
    email: 'gemminseu@example.com',
    phone: '0901 234 567',
    location: 'Hải Phòng',
    experience: '4 năm',
    education: 'Đại học FPT',
    skills: ['React', 'Vue.js', 'JavaScript', 'CSS', 'REST API'],
    bio: 'Full-stack Developer với kinh nghiệm phát triển nhiều dự án lớn. Làm việc nhóm tốt và có khả năng giải quyết vấn đề.'
  },
  { 
    id: 5, 
    candidate: 'Zun', 
    job: 'Nhân viên phục vụ', 
    applied: '1 tuần trước', 
    status: 'pending', 
    completed: false, 
    marked: false, 
    messagesDeleted: false,
    email: 'zunseu@example.com',
    phone: '0912 345 678',
    location: 'Cần Thơ',
    experience: '1 năm',
    education: 'Trung học phổ thông',
    skills: ['Phục vụ bàn', 'Giao tiếp', 'Nhanh nhẹn', 'Làm việc nhóm'],
    bio: 'Nhiệt tình, vui vẻ và luôn sẵn sàng học hỏi. Có kinh nghiệm làm việc tại các nhà hàng buffet.'
  },
];

const FILTER_OPTIONS = [
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Chấp nhận' },
  { value: 'rejected', label: 'Từ chối' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'marked', label: 'Đã đánh dấu' },
];

const ApplicationsContainer = styled.div``;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
  }
`;

const Table = styled.table`
  width: 100%;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 16px;
    background: ${props => props.theme.colors.bgDark};
    font-weight: 600;
    font-size: 14px;
    color: ${props => props.theme.colors.textLight};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  td {
    padding: 16px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover {
    background: ${props => props.theme.colors.bgDark};
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$variant === 'success' ? '#10b981' : 
              props.$variant === 'danger' ? '#ef4444' : 
              props.$variant === 'warning' ? '#f59e0b' :
              props.$variant === 'secondary' ? '#64748b' :
              props.theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 8px;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MarkedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #fef3c7;
  color: #d97706;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;



const ProfileHeader = styled.div`
  background: ${props => props.theme.colors.gradientPrimary};
  padding: 40px;
  color: white;
  
  h2 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 16px;
    opacity: 0.9;
  }
`;

const ProfileContent = styled.div`
  padding: 24px;
`;

const ProfileSection = styled.div`
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: start;
  gap: 10px;
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.theme.colors.primary};
    margin-top: 2px;
  }
  
  div {
    flex: 1;
    
    .label {
      font-size: 12px;
      color: ${props => props.theme.colors.textLight};
      margin-bottom: 4px;
    }
    
    .value {
      font-size: 14px;
      color: ${props => props.theme.colors.text};
      font-weight: 500;
    }
  }
`;

const SkillTag = styled.span`
  display: inline-block;
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  margin-right: 8px;
  margin-bottom: 8px;
`;

// Profile Detail Modal Component
const ProfileDetailModal = React.memo(({ candidate, onClose }) => (
  <>
    <ProfileHeader>
      <h2>{candidate.candidate}</h2>
      <p>Ứng tuyển vị trí: {candidate.job}</p>
    </ProfileHeader>

    <ProfileContent>
      <ProfileSection>
        <h3><FileText /> Thông tin liên hệ</h3>
        <InfoGrid>
          <InfoItem>
            <Mail />
            <div>
              <div className="label">Email</div>
              <div className="value">{candidate.email}</div>
            </div>
          </InfoItem>
          <InfoItem>
            <Phone />
            <div>
              <div className="label">Điện thoại</div>
              <div className="value">{candidate.phone}</div>
            </div>
          </InfoItem>
          <InfoItem>
            <MapPin />
            <div>
              <div className="label">Địa điểm</div>
              <div className="value">{candidate.location}</div>
            </div>
          </InfoItem>
          <InfoItem>
            <Calendar />
            <div>
              <div className="label">Thời gian ứng tuyển</div>
              <div className="value">{candidate.applied}</div>
            </div>
          </InfoItem>
        </InfoGrid>
      </ProfileSection>

      <ProfileSection>
        <h3><Award /> Học vấn & Kinh nghiệm</h3>
        <InfoGrid>
          <InfoItem>
            <Award />
            <div>
              <div className="label">Trình độ học vấn</div>
              <div className="value">{candidate.education}</div>
            </div>
          </InfoItem>
          <InfoItem>
            <Briefcase />
            <div>
              <div className="label">Kinh nghiệm</div>
              <div className="value">{candidate.experience}</div>
            </div>
          </InfoItem>
        </InfoGrid>
      </ProfileSection>

      <ProfileSection>
        <h3><Briefcase /> Kỹ năng</h3>
        <div>
          {candidate.skills.map((skill, index) => (
            <SkillTag key={index}>{skill}</SkillTag>
          ))}
        </div>
      </ProfileSection>

      <ProfileSection>
        <h3><FileText /> Giới thiệu bản thân</h3>
        <p style={{ lineHeight: '1.6', color: '#64748B', fontSize: '14px', margin: 0 }}>
          {candidate.bio}
        </p>
      </ProfileSection>
    </ProfileContent>
  </>
));

ProfileDetailModal.displayName = 'ProfileDetailModal';

// Application Row Component
const ApplicationRow = React.memo(({ 
  app, 
  onViewProfile, 
  onCompleteJob, 
  onMarkCandidate 
}) => (
  <tr>
    <td style={{ fontWeight: 600 }}>
      {app.candidate}
      {app.marked && (
        <MarkedBadge style={{ marginLeft: '8px' }}>
          <Star /> Đã đánh dấu
        </MarkedBadge>
      )}
    </td>
    <td>{app.job}</td>
    <td style={{ color: '#64748B' }}>{app.applied}</td>
    <td>
      <StatusBadge status={app.completed ? 'completed' : app.status} />
    </td>
    <td>
      <ActionButton onClick={() => onViewProfile(app)}>
        <Eye /> Xem Hồ Sơ
      </ActionButton>
      
      {!app.completed && app.status === 'approved' && (
        <ActionButton 
          $variant="success"
          onClick={() => onCompleteJob(app.id)}
        >
          <CheckCircle /> Hoàn thành
        </ActionButton>
      )}
      
      {app.completed && (
        <ActionButton 
          $variant="warning"
          onClick={() => onMarkCandidate(app.id)}
        >
          <Star /> {app.marked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
        </ActionButton>
      )}
    </td>
  </tr>
));

ApplicationRow.displayName = 'ApplicationRow';

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);

  // Memoized filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = !searchTerm || 
        app.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilters.length === 0 || 
        statusFilters.includes(app.status) ||
        (statusFilters.includes('marked') && app.marked);
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilters]);

  // Optimized handlers with useCallback
  const handleFilterToggle = useCallback((filterValue) => {
    setStatusFilters(prev => 
      prev.includes(filterValue) 
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  }, []);

  const handleCompleteJob = useCallback((id) => {
    setApplications(prev => prev.map(app => 
      app.id === id 
        ? { ...app, completed: true, status: 'completed', messagesDeleted: true } 
        : app
    ));
  }, []);

  const handleMarkCandidate = useCallback((id) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, marked: !app.marked } : app
    ));
  }, []);

  const handleViewProfile = useCallback((candidate) => {
    setSelectedCandidate(candidate);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setSelectedCandidate(null);
  }, []);

  return (
    <DashboardLayout role="employer">
      <ApplicationsContainer>
        <PageHeader>
          <h1>Hồ Sơ Ứng Tuyển</h1>
          <p style={{ color: '#64748B' }}>Xem và quản lý hồ sơ ứng viên</p>
        </PageHeader>

        <TableFilter 
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={FILTER_OPTIONS}
          activeFilters={statusFilters}
          onFilterToggle={handleFilterToggle}
          searchPlaceholder="Tìm kiếm theo ứng viên hoặc vị trí..."
        />

        <Table>
          <thead>
            <tr>
              <th>Ứng Viên</th>
              <th>Vị Trí</th>
              <th>Thời Gian Ứng Tuyển</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <ApplicationRow
                key={app.id}
                app={app}
                onViewProfile={handleViewProfile}
                onCompleteJob={handleCompleteJob}
                onMarkCandidate={handleMarkCandidate}
              />
            ))}
          </tbody>
        </Table>
      </ApplicationsContainer>

      {selectedCandidate && (
        <Modal 
          isOpen={true} 
          onClose={handleCloseProfile}
          size="large"
          noPadding={true}
        >
          <ProfileDetailModal 
            candidate={selectedCandidate} 
            onClose={handleCloseProfile} 
          />
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Applications;
