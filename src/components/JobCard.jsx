import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, Bookmark } from 'lucide-react';

const CardWrapper = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px solid transparent;
  padding: 28px;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  box-shadow: ${props => props.theme.shadows.card};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.colors.gradientPrimary};
    opacity: 0;
    transition: opacity ${props => props.theme.transitions.normal};
    z-index: 0;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadows.intense};
    border-color: ${props => props.theme.colors.primary};
    
    &::before {
      opacity: 0.03;
    }
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const CompanyLogo = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const CardContent = styled.div`
  flex: 1;
  margin-left: 20px;
`;

const JobTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
  line-height: 1.3;
`;

const CompanyName = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 16px;
  font-weight: 500;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const Tag = styled.span`
  padding: 6px 14px;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 13px;
  font-weight: 600;
  border: 1px solid ${props => props.theme.colors.primary}30;
`;

const JobDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.theme.colors.primary};
  }
`;

const BookmarkButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$saved ? props.theme.colors.gradientPrimary : props.theme.colors.bgDark};
  color: ${props => props.$saved ? 'white' : props.theme.colors.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.theme.transitions.fast};
  flex-shrink: 0;
  box-shadow: ${props => props.$saved ? props.theme.shadows.md : 'none'};
  
  &:hover {
    background: ${props => props.theme.colors.gradientPrimary};
    color: white;
    transform: scale(1.1);
    box-shadow: ${props => props.theme.shadows.lg};
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
