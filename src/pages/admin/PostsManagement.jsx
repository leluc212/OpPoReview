import { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { 
  FileText, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Flag,
  Search,
  Filter,
  MoreVertical,
  Ban,
  Trash2
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border-left: 4px solid ${props => props.$color};
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => `${props.$color}15`};
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  overflow-x: auto;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  margin-bottom: -2px;
  transition: all 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const TabBadge = styled.span`
  padding: 0.25rem 0.5rem;
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  color: ${props => props.$active ? 'white' : props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
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

const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PostCard = styled.div`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  padding: 1.5rem;
  border-left: 4px solid ${props => {
    switch(props.$status) {
      case 'pending': return '#f59e0b';
      case 'flagged': return '#ef4444';
      case 'approved': return '#10b981';
      default: return props.theme.colors.border;
    }
  }};
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const PostAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const PostMeta = styled.div`
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

const PostActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const PostTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.75rem;
`;

const PostContent = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const FlaggedContent = styled.div`
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  margin-bottom: 1rem;
`;

const FlaggedTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #92400e;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FlaggedText = styled.div`
  color: #92400e;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch(props.$status) {
      case 'pending': return '#fef3c7';
      case 'flagged': return '#fee2e2';
      case 'approved': return '#dcfce7';
      case 'rejected': return '#f3f4f6';
      default: return '#e0e7ff';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'pending': return '#ca8a04';
      case 'flagged': return '#dc2626';
      case 'approved': return '#15803d';
      case 'rejected': return '#6b7280';
      default: return '#4338ca';
    }
  }};
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => {
    switch(props.$variant) {
      case 'success':
        return `
          background: #10b981;
          color: white;
          &:hover {
            background: #059669;
          }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          &:hover {
            background: #dc2626;
          }
        `;
      case 'warning':
        return `
          background: #f59e0b;
          color: white;
          &:hover {
            background: #d97706;
          }
        `;
      default:
        return `
          background: ${props.theme.colors.background};
          color: ${props.theme.colors.text};
          &:hover {
            background: ${props.theme.colors.border};
          }
        `;
    }
  }}
`;

const PostsManagement = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('pending');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const mockPosts = [
    {
      id: 1,
      status: 'pending',
      author: language === 'vi' ? 'Công ty ABC Tech' : 'ABC Tech Company',
      authorType: language === 'vi' ? 'Nhà tuyển dụng' : 'Employer',
      avatar: 'AB',
      title: language === 'vi' ? 'Tuyển Frontend Developer (React)' : 'Hiring Frontend Developer (React)',
      content: language === 'vi' ? 'Công ty chúng tôi đang tìm kiếm Frontend Developer có kinh nghiệm với React, TypeScript. Mức lương hấp dẫn, môi trường năng động...' : 'We are looking for a Frontend Developer with experience in React and TypeScript. Competitive salary and dynamic environment...',
      category: language === 'vi' ? 'Việc làm toàn thời gian' : 'Full-time jobs',
      date: '15/02/2024',
      time: '14:30',
      views: 245,
      flagged: false
    },
    {
      id: 2,
      status: 'flagged',
      author: language === 'vi' ? 'Công ty XYZ Corp' : 'XYZ Corp',
      authorType: language === 'vi' ? 'Nhà tuyển dụng' : 'Employer',
      avatar: 'XY',
      title: language === 'vi' ? 'Tuyển nhân viên sale - Lương cao' : 'Hiring sales staff - high salary',
      content: language === 'vi' ? 'Tuyển gấp nhân viên kinh doanh. Lương cơ bản 50 triệu, hoa hồng không giới hạn. Liên hệ ngay!!!' : 'Urgent hiring for sales staff. Base salary 50 million, unlimited commission. Contact now!!!',
      category: language === 'vi' ? 'Việc làm ca' : 'Shift jobs',
      date: '14/02/2024',
      time: '16:20',
      views: 892,
      flagged: true,
      flagReason: language === 'vi' ? 'Nội dung có dấu hiệu spam, sử dụng nhiều dấu chấm than, mức lương không hợp lý' : 'Content appears spammy: excessive exclamation marks and unrealistic salary claim'
    },
    {
      id: 3,
      status: 'pending',
      author: language === 'vi' ? 'Nhà Hàng DEF' : 'DEF Restaurant',
      authorType: language === 'vi' ? 'Nhà tuyển dụng' : 'Employer',
      avatar: 'DE',
      title: language === 'vi' ? 'Tuyển phục vụ nhà hàng Part-time' : 'Hiring part-time restaurant server',
      content: language === 'vi' ? 'Nhà hàng cần tuyển nhân viên phục vụ làm part-time, ca tối từ 18h-22h. Yêu cầu nhiệt tình, hoạt bát.' : 'Restaurant needs part-time service staff for evening shift 18:00-22:00. Enthusiastic and active preferred.',
      category: language === 'vi' ? 'Việc làm ca' : 'Shift jobs',
      date: '14/02/2024',
      time: '10:15',
      views: 156,
      flagged: false
    },
    {
      id: 4,
      status: 'approved',
      author: 'Tech Startup GHI',
      authorType: language === 'vi' ? 'Nhà tuyển dụng' : 'Employer',
      avatar: 'GH',
      title: 'Backend Developer - NodeJS',
      content: language === 'vi' ? 'Startup công nghệ đang tìm Backend Developer có kinh nghiệm với NodeJS, MongoDB. Cơ hội phát triển sự nghiệp...' : 'Tech startup is looking for a Backend Developer with NodeJS and MongoDB experience. Great growth opportunities...',
      category: language === 'vi' ? 'Việc làm toàn thời gian' : 'Full-time jobs',
      date: '13/02/2024',
      time: '09:00',
      views: 423,
      flagged: false
    }
  ];

  const stats = {
    pending: 48,
    flagged: 12,
    approved: 234,
    rejected: 18
  };

  const filteredPosts = mockPosts
    .filter(post => {
      if (activeTab === 'all') return true;
      return post.status === activeTab;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'newest': {
          // Parse DD/MM/YYYY and time HH:MM
          const dateA = a.date.split('/').reverse().join('') + a.time.replace(':', '');
          const dateB = b.date.split('/').reverse().join('') + b.time.replace(':', '');
          return dateB.localeCompare(dateA); // Newer first
        }
        case 'oldest': {
          const dateA = a.date.split('/').reverse().join('') + a.time.replace(':', '');
          const dateB = b.date.split('/').reverse().join('') + b.time.replace(':', '');
          return dateA.localeCompare(dateB); // Older first
        }
        case 'most-viewed':
          return b.views - a.views; // Higher views first
        default:
          return 0;
      }
    });

  return (
    <DashboardLayout role="admin">
      <PageContainer>
        <PageHeader>
          <Title>{language === 'vi' ? 'Quản Lý Bài Đăng' : 'Post Management'}</Title>
          <Subtitle>{language === 'vi' ? 'Kiểm duyệt và quản lý tất cả bài đăng tuyển dụng' : 'Moderate and manage all job posts'}</Subtitle>
        </PageHeader>

        <StatsGrid>
          <StatCard $color="#f59e0b">
            <StatHeader>
              <StatLabel>{language === 'vi' ? 'Chờ duyệt' : 'Pending'}</StatLabel>
              <StatIcon $color="#f59e0b">
                <Clock size={20} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.pending}</StatValue>
          </StatCard>

          <StatCard $color="#ef4444">
            <StatHeader>
              <StatLabel>{language === 'vi' ? 'Bị cảnh báo' : 'Flagged'}</StatLabel>
              <StatIcon $color="#ef4444">
                <Flag size={20} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.flagged}</StatValue>
          </StatCard>

          <StatCard $color="#10b981">
            <StatHeader>
              <StatLabel>{language === 'vi' ? 'Đã duyệt' : 'Approved'}</StatLabel>
              <StatIcon $color="#10b981">
                <CheckCircle size={20} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.approved}</StatValue>
          </StatCard>

          <StatCard $color="#6b7280">
            <StatHeader>
              <StatLabel>{language === 'vi' ? 'Đã từ chối' : 'Rejected'}</StatLabel>
              <StatIcon $color="#6b7280">
                <XCircle size={20} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.rejected}</StatValue>
          </StatCard>
        </StatsGrid>

        <TabContainer>
          <Tab $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
            {language === 'vi' ? 'Tất cả' : 'All'}
            <TabBadge $active={activeTab === 'all'}>{mockPosts.length}</TabBadge>
          </Tab>
          <Tab $active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
            {language === 'vi' ? 'Chờ duyệt' : 'Pending'}
            <TabBadge $active={activeTab === 'pending'}>{stats.pending}</TabBadge>
          </Tab>
          <Tab $active={activeTab === 'flagged'} onClick={() => setActiveTab('flagged')}>
            {language === 'vi' ? 'Bị cảnh báo' : 'Flagged'}
            <TabBadge $active={activeTab === 'flagged'}>{stats.flagged}</TabBadge>
          </Tab>
          <Tab $active={activeTab === 'approved'} onClick={() => setActiveTab('approved')}>
            {language === 'vi' ? 'Đã duyệt' : 'Approved'}
            <TabBadge $active={activeTab === 'approved'}>{stats.approved}</TabBadge>
          </Tab>
          <Tab $active={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')}>
            {language === 'vi' ? 'Đã từ chối' : 'Rejected'}
            <TabBadge $active={activeTab === 'rejected'}>{stats.rejected}</TabBadge>
          </Tab>
        </TabContainer>

        <FilterBar>
          <SearchBox>
            <SearchIcon size={18} />
            <SearchInput placeholder={language === 'vi' ? 'Tìm kiếm bài đăng...' : 'Search posts...'} />
          </SearchBox>
          <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">{language === 'vi' ? 'Tất cả danh mục' : 'All categories'}</option>
            <option value="fulltime">{language === 'vi' ? 'Việc làm toàn thời gian' : 'Full-time jobs'}</option>
            <option value="parttime">{language === 'vi' ? 'Việc làm ca' : 'Shift jobs'}</option>
          </Select>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">{language === 'vi' ? 'Mới nhất' : 'Newest'}</option>
            <option value="oldest">{language === 'vi' ? 'Cũ nhất' : 'Oldest'}</option>
            <option value="most-viewed">{language === 'vi' ? 'Nhiều lượt xem' : 'Most viewed'}</option>
          </Select>
        </FilterBar>

        <PostsGrid>
          {filteredPosts.map(post => (
            <PostCard key={post.id} $status={post.status}>
              <PostHeader>
                <PostAuthor>
                  <Avatar>{post.avatar}</Avatar>
                  <AuthorInfo>
                    <AuthorName>{post.author}</AuthorName>
                    <PostMeta>
                      <MetaItem>{post.authorType}</MetaItem>
                      <MetaItem>
                        <Clock size={14} />
                        {post.date} • {post.time}
                      </MetaItem>
                      <MetaItem>
                        <Eye size={14} />
                        {post.views} {language === 'vi' ? 'lượt xem' : 'views'}
                      </MetaItem>
                    </PostMeta>
                  </AuthorInfo>
                </PostAuthor>
                <PostActions>
                  <IconButton>
                    <Eye size={18} />
                  </IconButton>
                  <IconButton>
                    <MoreVertical size={18} />
                  </IconButton>
                </PostActions>
              </PostHeader>

              <PostTitle>{post.title}</PostTitle>
              <PostContent>{post.content}</PostContent>

              {post.flagged && (
                <FlaggedContent>
                  <FlaggedTitle>
                    <AlertCircle size={18} />
                    {language === 'vi' ? 'Nội dung bị cảnh báo' : 'Flagged content'}
                  </FlaggedTitle>
                  <FlaggedText>{post.flagReason}</FlaggedText>
                </FlaggedContent>
              )}

              <PostFooter>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <StatusBadge $status={post.status}>
                    {post.status === 'pending' && (language === 'vi' ? 'Chờ duyệt' : 'Pending')}
                    {post.status === 'flagged' && (language === 'vi' ? 'Bị cảnh báo' : 'Flagged')}
                    {post.status === 'approved' && (language === 'vi' ? 'Đã duyệt' : 'Approved')}
                    {post.status === 'rejected' && (language === 'vi' ? 'Đã từ chối' : 'Rejected')}
                  </StatusBadge>
                  <StatusBadge>{post.category}</StatusBadge>
                </div>

                {post.status === 'pending' || post.status === 'flagged' ? (
                  <ActionButtons>
                    <Button $variant="success">
                      <CheckCircle size={16} />
                      {language === 'vi' ? 'Phê duyệt' : 'Approve'}
                    </Button>
                    <Button $variant="danger">
                      <XCircle size={16} />
                      {language === 'vi' ? 'Từ chối' : 'Reject'}
                    </Button>
                    {post.status === 'flagged' && (
                      <Button $variant="warning">
                        <Ban size={16} />
                        {language === 'vi' ? 'Chặn tác giả' : 'Block author'}
                      </Button>
                    )}
                  </ActionButtons>
                ) : (
                  <ActionButtons>
                    <Button>
                      <Eye size={16} />
                      {language === 'vi' ? 'Xem chi tiết' : 'View details'}
                    </Button>
                    <Button $variant="danger">
                      <Trash2 size={16} />
                      {language === 'vi' ? 'Xóa' : 'Delete'}
                    </Button>
                  </ActionButtons>
                )}
              </PostFooter>
            </PostCard>
          ))}
        </PostsGrid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default PostsManagement;
