import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CardWrapper = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 32px;
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.card};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$color || props.theme.colors.primary};
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200px;
    height: 200px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 20px 60px ${props => props.$color ? `${props.$color}30` : `${props.theme.colors.primary}30`},
      0 0 0 1px ${props => props.theme.colors.primary}20;
    border-color: transparent;
    
    &::before {
      opacity: 0.08;
    }
    
    &::after {
      opacity: 1;
      top: -20%;
      right: -20%;
    }
  }
  
  &:active {
    transform: translateY(-6px) scale(1.01);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 1.2px;
`;

const IconWrapper = styled(motion.div)`
  width: 64px;
  height: 64px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.$color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 
    0 8px 24px ${props => props.$color ? `${props.$color}40` : `${props.theme.colors.primary}40`},
    0 0 0 4px ${props => props.$color ? `${props.$color}15` : `${props.theme.colors.primary}15`};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  svg {
    width: 28px;
    height: 28px;
  }
  
  ${CardWrapper}:hover & {
    transform: rotate(10deg) scale(1.1);
    box-shadow: 
      0 12px 32px ${props => props.$color ? `${props.$color}50` : `${props.theme.colors.primary}50`},
      0 0 0 6px ${props => props.$color ? `${props.$color}20` : `${props.theme.colors.primary}20`};
  }
`;

const CardValue = styled(motion.div)`
  font-size: 48px;
  font-weight: 900;
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;
  line-height: 1;
  letter-spacing: -1px;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
`;

const ChangeIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => props.$positive ? props.theme.colors.success : props.theme.colors.error};
  font-weight: 700;
  padding: 6px 12px;
  background: ${props => props.$positive ? `${props.theme.colors.success}15` : `${props.theme.colors.error}15`};
  border-radius: ${props => props.theme.borderRadius.full};
  border: 1px solid ${props => props.$positive ? `${props.theme.colors.success}30` : `${props.theme.colors.error}30`};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ChangeText = styled.span`
  color: ${props => props.theme.colors.textLight};
  font-weight: 600;
`;

const StatsCard = ({ title, value, change, changeText, icon: Icon, color, positive = true }) => {
  return (
    <CardWrapper
      $color={color}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {Icon && (
          <IconWrapper 
            $color={color}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon />
          </IconWrapper>
        )}
      </CardHeader>
      
      <CardValue
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {value}
      </CardValue>
      
      {change && (
        <CardFooter>
          <ChangeIndicator 
            $positive={positive}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
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
