import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  TrendingUp, 
  MessageSquare, 
  Heart, 
  Share2, 
  MoreVertical,
  Plus,
  Filter,
  Search,
  Bookmark,
  Users,
  Calendar
} from 'lucide-react';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled(motion.button)`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
    }
  ` : `
    background: white;
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.background};
    }
  `}
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const SearchInput = styled.div`
  flex: 1;
  position: relative;
  
  input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #1e40af;
      box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
    }
  }
  
  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.textSecondary};
    width: 18px;
    height: 18px;
  }
`;

const FilterButton = styled(Button)`
  padding: 12px 20px;
`;

const PostsGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const PostCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #1e40af;
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e40af 0%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
`;

const PostAuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MoreButton = styled.button`
  padding: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  color: ${props => props.theme.colors.textSecondary};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.background};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const PostContent = styled.div`
  margin-bottom: 16px;
`;

const PostTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

const PostText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const PostTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
`;

const Tag = styled.span`
  padding: 4px 12px;
  background: rgba(30, 64, 175, 0.1);
  color: #1e40af;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
  
  ${props => props.$active && `
    color: #1e40af;
    
    &:hover {
      color: #1e40af;
    }
  `}
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const CandidatePosts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data
  const posts = [
    {
      id: 1,
      author: 'Nguyễn Văn An',
      avatar: 'NVA',
      position: 'Nhân viên pha chế',
      location: 'TP. Hồ Chí Minh',
      time: '2 giờ trước',
      title: 'Tìm việc nhân viên pha chế - Có kinh nghiệm 2 năm',
      content: 'Mình có 2 năm kinh nghiệm làm việc tại các quán cafe lớn, thành thạo các loại máy pha, có khả năng latte art tốt. Mong muốn tìm được một môi trường làm việc chuyên nghiệp và lâu dài.',
      tags: ['Pha chế', 'Cafe', 'Toàn thời gian', 'TP.HCM'],
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      isSaved: false
    },
    {
      id: 2,
      author: 'Trần Thị Bình',
      avatar: 'TTB',
      position: 'Nhân viên phục vụ',
      location: 'Hà Nội',
      time: '5 giờ trước',
      title: 'Tìm việc bán thời gian - Nhân viên phục vụ',
      content: 'Sinh viên năm 3, muốn tìm công việc bán thời gian vào buổi tối và cuối tuần. Có kinh nghiệm 6 tháng làm việc tại nhà hàng, nhiệt tình, thân thiện.',
      tags: ['Phục vụ', 'Bán thời gian', 'Nhà hàng', 'Hà Nội'],
      likes: 15,
      comments: 5,
      shares: 2,
      isLiked: true,
      isSaved: true
    },
    {
      id: 3,
      author: 'Lê Minh Châu',
      avatar: 'LMC',
      position: 'Nhân viên kho',
      location: 'Đà Nẵng',
      time: '1 ngày trước',
      title: 'Tìm việc nhân viên kho - Có bằng lái xe máy',
      content: 'Có kinh nghiệm làm việc tại kho hàng, sắp xếp hàng hóa, kiểm kê. Có bằng lái xe máy, có thể giao hàng. Sẵn sàng làm ca tối và cuối tuần.',
      tags: ['Kho hàng', 'Giao hàng', 'Ca tối', 'Đà Nẵng'],
      likes: 32,
      comments: 12,
      shares: 5,
      isLiked: false,
      isSaved: false
    }
  ];

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader>
          <HeaderTop>
            <Title>Bảng tin việc làm</Title>
            <ActionButtons>
              <Button $variant="secondary">
                <Filter />
                Lọc
              </Button>
              <Button 
                $variant="primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus />
                Đăng bài tìm việc
              </Button>
            </ActionButtons>
          </HeaderTop>
          
          <SearchBar>
            <SearchInput>
              <Search />
              <input 
                type="text" 
                placeholder="Tìm kiếm bài đăng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchInput>
          </SearchBar>
        </PageHeader>

        <PostsGrid>
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostHeader>
                <Avatar>{post.avatar}</Avatar>
                <PostAuthorInfo>
                  <AuthorName>{post.author}</AuthorName>
                  <PostMeta>
                    <MetaItem>
                      <Users />
                      {post.position}
                    </MetaItem>
                    <MetaItem>•</MetaItem>
                    <MetaItem>{post.location}</MetaItem>
                    <MetaItem>•</MetaItem>
                    <MetaItem>
                      <Calendar />
                      {post.time}
                    </MetaItem>
                  </PostMeta>
                </PostAuthorInfo>
                <MoreButton>
                  <MoreVertical />
                </MoreButton>
              </PostHeader>

              <PostContent>
                <PostTitle>{post.title}</PostTitle>
                <PostText>{post.content}</PostText>
              </PostContent>

              <PostTags>
                {post.tags.map((tag, i) => (
                  <Tag key={i}>{tag}</Tag>
                ))}
              </PostTags>

              <PostActions>
                <ActionButton $active={post.isLiked}>
                  <Heart fill={post.isLiked ? 'currentColor' : 'none'} />
                  {post.likes} Thích
                </ActionButton>
                <ActionButton>
                  <MessageSquare />
                  {post.comments} Bình luận
                </ActionButton>
                <ActionButton>
                  <Share2 />
                  {post.shares} Chia sẻ
                </ActionButton>
                <ActionButton $active={post.isSaved} style={{ marginLeft: 'auto' }}>
                  <Bookmark fill={post.isSaved ? 'currentColor' : 'none'} />
                  {post.isSaved ? 'Đã lưu' : 'Lưu'}
                </ActionButton>
              </PostActions>
            </PostCard>
          ))}
        </PostsGrid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default CandidatePosts;
