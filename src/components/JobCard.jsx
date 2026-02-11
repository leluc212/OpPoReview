import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, Bookmark } from 'lucide-react';

const CardWrapper = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 24px;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.hover};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CompanyLogo = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 20px;
  flex-shrink: 0;
`;

const CardContent = styled.div`
  flex: 1;
  margin-left: 16px;
`;

const JobTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const CompanyName = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 12px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tag = styled.span`
  padding: 4px 12px;
  background: ${props => props.theme.colors.bgDark};
  color: ${props => props.theme.colors.textLight};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 500;
`;

const JobDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const BookmarkButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$saved ? props.theme.colors.primary : props.theme.colors.bgDark};
  color: ${props => props.$saved ? 'white' : props.theme.colors.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.theme.transitions.fast};
  flex-shrink: 0;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const JobCard = ({ job, onClick, onSave, saved = false }) => {
  const handleSaveClick = (e) => {
    e.stopPropagation();
    onSave && onSave(job.id);
  };

  return (
    <CardWrapper
      onClick={() => onClick && onClick(job.id)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader>
        <div style={{ display: 'flex', flex: 1 }}>
          <CompanyLogo>
            {job.company.charAt(0).toUpperCase()}
          </CompanyLogo>
          <CardContent>
            <JobTitle>{job.title}</JobTitle>
            <CompanyName>{job.company}</CompanyName>
            <TagsContainer>
              {job.tags && job.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer>
          </CardContent>
        </div>
        <BookmarkButton onClick={handleSaveClick} $saved={saved}>
          <Bookmark fill={saved ? 'white' : 'none'} />
        </BookmarkButton>
      </CardHeader>
      
      <JobDetails>
        <DetailItem>
          <MapPin />
          <span>{job.location}</span>
        </DetailItem>
        <DetailItem>
          <Briefcase />
          <span>{job.type}</span>
        </DetailItem>
        <DetailItem>
          <DollarSign />
          <span>{job.salary}</span>
        </DetailItem>
        <DetailItem>
          <Clock />
          <span>{job.postedAt}</span>
        </DetailItem>
      </JobDetails>
    </CardWrapper>
  );
};

export default JobCard;
