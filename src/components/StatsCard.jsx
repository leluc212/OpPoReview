import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CardWrapper = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.hover};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$color || props.theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const CardValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const ChangeIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.$positive ? props.theme.colors.success : props.theme.colors.error};
  font-weight: 500;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ChangeText = styled.span`
  color: ${props => props.theme.colors.textLight};
`;

const StatsCard = ({ title, value, change, changeText, icon: Icon, color, positive = true }) => {
  return (
    <CardWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {Icon && (
          <IconWrapper $color={color}>
            <Icon />
          </IconWrapper>
        )}
      </CardHeader>
      
      <CardValue>{value}</CardValue>
      
      {change && (
        <CardFooter>
          <ChangeIndicator $positive={positive}>
            {positive ? <TrendingUp /> : <TrendingDown />}
            <span>{change}</span>
          </ChangeIndicator>
          <ChangeText>{changeText}</ChangeText>
        </CardFooter>
      )}
    </CardWrapper>
  );
};

export default StatsCard;
