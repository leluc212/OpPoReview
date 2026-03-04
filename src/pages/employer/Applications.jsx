import React, { useState, useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import TableFilter from '../../components/TableFilter';
import Modal from '../../components/Modal';
import { Eye, CheckCircle, Star, Mail, Phone, MapPin, Calendar, Award, Briefcase, FileText, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Mock data generator (language-aware)
const getInitialApplications = (language) => [
  { 
    id: 1, 
    candidate: language === 'vi' ? 'Hiếu sàn' : 'Hieu san', 
    job: 'Senior React Developer', 
    applied: language === 'vi' ? '2 giờ trước' : '2 hours ago', 
    status: 'pending', 
    completed: false, 
    marked: false, 
    messagesDeleted: false,
    email: 'hieuseu@example.com',
    phone: '0123 456 789',
    location: language === 'vi' ? 'Hà Nội' : 'Hanoi',
    experience: language === 'vi' ? '5 năm' : '5 years',
    education: language === 'vi' ? 'Đại học Bách Khoa' : 'Hanoi University of Science and Technology',
    skills: language === 'vi' ? ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'] : ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
    bio: language === 'vi' ? 'Tôi là một Senior Developer với 5 năm kinh nghiệm trong phát triển web. Đam mê công nghệ và luôn học hỏi những điều mới.' : 'I am a Senior Developer with 5 years of experience in web development. Passionate about technology and continuously learning.'
  },
  { 
    id: 2, 
    candidate: language === 'vi' ? 'Duy sàn' : 'Duy san', 
    job: language === 'vi' ? 'Thu ngân' : 'Cashier', 
    applied: language === 'vi' ? '5 giờ trước' : '5 hours ago', 
    status: 'pending', 
    completed: false, 
    marked: false, 
    messagesDeleted: false,
    email: 'duuyseu@example.com',
    phone: '0987 654 321',
    location: language === 'vi' ? 'TP. Hồ Chí Minh' : 'HCMC',
    experience: language === 'vi' ? '2 năm' : '2 years',
    education: language === 'vi' ? 'Cao đẳng Kinh tế' : 'College of Economics',
    skills: language === 'vi' ? ['Kế toán', 'Excel', 'Giao tiếp', 'Quản lý tiền mặt'] : ['Accounting', 'Excel', 'Communication', 'Cash handling'],
    bio: language === 'vi' ? 'Có kinh nghiệm làm việc tại các cửa hàng bán lẻ và nhà hàng. Cẩn thận, chính xác và trung thực.' : 'Experienced in retail and restaurant roles. Detail-oriented, accurate and honest.'
  },
  { 
    id: 3, 
    candidate: 'Nheo', 
    job: language === 'vi' ? 'Nhân viên pha chế' : 'Barista', 
    applied: language === 'vi' ? '1 ngày trước' : '1 day ago', 
    status: 'approved', 
    completed: false, 
    marked: false, 
    messagesDeleted: false,
    email: 'nheo@example.com',
    phone: '0909 123 456',
    location: language === 'vi' ? 'Đà Nẵng' : 'Da Nang',
    experience: language === 'vi' ? '3 năm' : '3 years',
    education: language === 'vi' ? 'Trung cấp Ẩm thực' : 'Vocational Culinary School',
    skills: language === 'vi' ? ['Pha chế cà phê', 'Trà sữa', 'Cocktail', 'Latte Art', 'Phục vụ khách hàng'] : ['Coffee brewing', 'Bubble tea', 'Cocktail', 'Latte Art', 'Customer service'],
    bio: language === 'vi' ? 'Đam mê nghệ thuật pha chế và tạo ra những ly đồ uống hoàn hảo. Có chứng chỉ Barista quốc tế.' : 'Passionate about beverage crafting and creating perfect drinks. Holds an international Barista certificate.'
  },
  { 
    id: 4, 
    candidate: 'Gemmin', 
    job: 'Senior React Developer', 
    applied: language === 'vi' ? '2 ngày trước' : '2 days ago', 
    status: 'rejected', 
    completed: false, 
    marked: false, 
    messagesDeleted: false,
    email: 'gemminseu@example.com',
    phone: '0901 234 567',
    location: language === 'vi' ? 'Hải Phòng' : 'Hai Phong',
    experience: language === 'vi' ? '4 năm' : '4 years',
    education: language === 'vi' ? 'Đại học FPT' : 'FPT University',
    skills: ['React', 'Vue.js', 'JavaScript', 'CSS', 'REST API'],
    bio: language === 'vi' ? 'Full-stack Developer với kinh nghiệm phát triển nhiều dự án lớn. Làm việc nhóm tốt và có khả năng giải quyết vấn đề.' : 'Full-stack Developer experienced in large projects. Strong teamwork and problem-solving skills.'
  },
  { 
    id: 5, 
    candidate: 'Zun', 
    job: language === 'vi' ? 'Nhân viên phục vụ' : 'Waiter/Server', 
    applied: language === 'vi' ? '1 tuần trước' : '1 week ago', 
    status: 'pending', 
    completed: false, 
    marked: false, 
    messagesDeleted: false,
    email: 'zunseu@example.com',
    phone: '0912 345 678',
    location: language === 'vi' ? 'Cần Thơ' : 'Can Tho',
    experience: language === 'vi' ? '1 năm' : '1 year',
    education: language === 'vi' ? 'Trung học phổ thông' : 'High School',
    skills: language === 'vi' ? ['Phục vụ bàn', 'Giao tiếp', 'Nhanh nhẹn', 'Làm việc nhóm'] : ['Table service', 'Communication', 'Fast-paced', 'Teamwork'],
    bio: language === 'vi' ? 'Nhiệt tình, vui vẻ và luôn sẵn sàng học hỏi. Có kinh nghiệm làm việc tại các nhà hàng buffet.' : 'Enthusiastic, friendly and eager to learn. Experienced in buffet restaurant service.'
  },
];

const FILTER_OPTIONS = (language) => ([
  { value: 'pending', label: language === 'vi' ? 'Chờ duyệt' : 'Pending' },
  { value: 'approved', label: language === 'vi' ? 'Chấp nhận' : 'Approved' },
  { value: 'rejected', label: language === 'vi' ? 'Từ chối' : 'Rejected' },
  { value: 'completed', label: language === 'vi' ? 'Hoàn thành' : 'Completed' },
  { value: 'marked', label: language === 'vi' ? 'Đã đánh dấu' : 'Marked' },
]);

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
  background: ${props => props.$variant === 'success' ? props.theme.colors.success : 
              props.$variant === 'danger' ? props.theme.colors.error : 
              props.$variant === 'warning' ? props.theme.colors.warning :
              props.$variant === 'secondary' ? props.theme.colors.textLight :
              props.theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
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
  background: ${props => props.theme.colors.warningBg};
  color: ${props => props.theme.colors.warning};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const TimeDisplay = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 14px;
  padding: 6px 12px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  
  svg {
    width: 14px;
    height: 14px;
    color: ${props => props.theme.colors.primary};
    opacity: 0.8;
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
const ProfileDetailModal = React.memo(({ candidate, onClose }) => {
  const { language } = useLanguage();

  return (
    <>
      <ProfileHeader>
        <h2>{candidate.candidate}</h2>
        <p>{language === 'vi' ? 'Ứng tuyển vị trí:' : 'Applied for:'} {candidate.job}</p>
      </ProfileHeader>

      <ProfileContent>
        <ProfileSection>
          <h3><FileText /> {language === 'vi' ? 'Thông tin liên hệ' : 'Contact Information'}</h3>
          <InfoGrid>
            <InfoItem>
              <Mail />
              <div>
                <div className="label">{language === 'vi' ? 'Email' : 'Email'}</div>
                <div className="value">{candidate.email}</div>
              </div>
            </InfoItem>
            <InfoItem>
              <Phone />
              <div>
                <div className="label">{language === 'vi' ? 'Điện thoại' : 'Phone'}</div>
                <div className="value">{candidate.phone}</div>
              </div>
            </InfoItem>
            <InfoItem>
              <MapPin />
              <div>
                <div className="label">{language === 'vi' ? 'Địa điểm' : 'Location'}</div>
                <div className="value">{candidate.location}</div>
              </div>
            </InfoItem>
            <InfoItem>
              <Calendar />
              <div>
                <div className="label">{language === 'vi' ? 'Thời gian ứng tuyển' : 'Applied'}</div>
                <div className="value">{candidate.applied}</div>
              </div>
            </InfoItem>
          </InfoGrid>
        </ProfileSection>

        <ProfileSection>
          <h3><Award /> {language === 'vi' ? 'Học vấn & Kinh nghiệm' : 'Education & Experience'}</h3>
          <InfoGrid>
            <InfoItem>
              <Award />
              <div>
                <div className="label">{language === 'vi' ? 'Trình độ học vấn' : 'Education'}</div>
                <div className="value">{candidate.education}</div>
              </div>
            </InfoItem>
            <InfoItem>
              <Briefcase />
              <div>
                <div className="label">{language === 'vi' ? 'Kinh nghiệm' : 'Experience'}</div>
                <div className="value">{candidate.experience}</div>
              </div>
            </InfoItem>
          </InfoGrid>
        </ProfileSection>

        <ProfileSection>
          <h3><Briefcase /> {language === 'vi' ? 'Kỹ năng' : 'Skills'}</h3>
          <div>
            {candidate.skills.map((skill, index) => (
              <SkillTag key={index}>{skill}</SkillTag>
            ))}
          </div>
        </ProfileSection>

        <ProfileSection>
          <h3><FileText /> {language === 'vi' ? 'Giới thiệu bản thân' : 'About'}</h3>
          <p style={{ lineHeight: '1.6', color: '#CBD5E1', fontSize: '14px', margin: 0 }}>
            {candidate.bio}
          </p>
        </ProfileSection>
      </ProfileContent>
    </>
  );
});

ProfileDetailModal.displayName = 'ProfileDetailModal';

// Application Row Component

const ApplicationRow = React.memo(({ 
  app, 
  onViewProfile, 
  onCompleteJob, 
  onMarkCandidate 
}) => {
  const { language } = useLanguage();

  return (
    <tr>
      <td style={{ fontWeight: 600 }}>
        {app.candidate}
        {app.marked && (
          <MarkedBadge style={{ marginLeft: '8px' }}>
            <Star /> {language === 'vi' ? 'Đã đánh dấu' : 'Marked'}
          </MarkedBadge>
        )}
      </td>
      <td>{app.job}</td>
      <td>
        <TimeDisplay>
          <Clock />
          {app.applied}
        </TimeDisplay>
      </td>
      <td>
        <StatusBadge status={app.completed ? 'completed' : app.status} />
      </td>
      <td>
        <ActionButton onClick={() => onViewProfile(app)}>
          <Eye /> {language === 'vi' ? 'Xem Hồ Sơ' : 'View Profile'}
        </ActionButton>
        
        {!app.completed && app.status === 'approved' && (
          <ActionButton 
            $variant="success"
            onClick={() => onCompleteJob(app.id)}
          >
            <CheckCircle /> {language === 'vi' ? 'Hoàn thành' : 'Complete'}
          </ActionButton>
        )}
        
        {app.completed && (
          <ActionButton 
            $variant="warning"
            onClick={() => onMarkCandidate(app.id)}
          >
            <Star /> {app.marked ? (language === 'vi' ? 'Bỏ đánh dấu' : 'Unmark') : (language === 'vi' ? 'Đánh dấu' : 'Mark')}
          </ActionButton>
        )}
      </td>
    </tr>
  );
});

ApplicationRow.displayName = 'ApplicationRow';

const Applications = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [applications, setApplications] = useState(() => getInitialApplications(language));

  useEffect(() => {
    setApplications(getInitialApplications(language));
  }, [language]);

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
          <h1>{language === 'vi' ? 'Hồ Sơ Ứng Tuyển' : 'Applications'}</h1>
          <p style={{ color: '#94A3B8' }}>
            {language === 'vi' ? 'Xem và quản lý hồ sơ ứng viên' : 'View and manage candidate applications'}
          </p>
        </PageHeader>

        <TableFilter
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={FILTER_OPTIONS(language)}
          activeFilters={statusFilters}
          onFilterToggle={handleFilterToggle}
          searchPlaceholder={language === 'vi' ? 'Tìm kiếm theo ứng viên hoặc vị trí...' : 'Search by candidate or position...'}
        />

        <Table>
          <thead>
            <tr>
              <th>{language === 'vi' ? 'Ứng Viên' : 'Candidate'}</th>
              <th>{language === 'vi' ? 'Vị Trí' : 'Position'}</th>
              <th>{language === 'vi' ? 'Thời Gian Ứng Tuyển' : 'Applied'}</th>
              <th>{language === 'vi' ? 'Trạng Thái' : 'Status'}</th>
              <th>{language === 'vi' ? 'Thao Tác' : 'Actions'}</th>
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
