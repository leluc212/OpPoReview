import React from 'react';
import styled from 'styled-components';

const BadgeWrapper = styled.span`
  padding: 8px 18px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-transform: capitalize;
  
  ${props => props.$status === 'pending' && `
    background: ${props.theme.colors.warningBg};
    color: ${props.theme.colors.warning};
    border: 2px solid ${props.theme.colors.warning}40;
    box-shadow: 0 2px 8px ${props.theme.colors.warning}20;
  `}
  
  ${props => props.$status === 'approved' && `
    background: ${props.theme.colors.successBg};
    color: ${props.theme.colors.success};
    border: 2px solid ${props.theme.colors.success}40;
    box-shadow: 0 2px 8px ${props.theme.colors.success}20;
  `}
  
  ${props => props.$status === 'rejected' && `
    background: ${props.theme.colors.errorBg};
    color: ${props.theme.colors.error};
    border: 2px solid ${props.theme.colors.error}40;
    box-shadow: 0 2px 8px ${props.theme.colors.error}20;
  `}
  
  ${props => props.$status === 'reviewed' && `
    background: ${props.theme.colors.infoBg};
    color: ${props.theme.colors.info};
    border: 2px solid ${props.theme.colors.info}40;
    box-shadow: 0 2px 8px ${props.theme.colors.info}20;
  `}
  
  ${props => props.$status === 'active' && `
    background: ${props.theme.colors.infoBg};
    color: ${props.theme.colors.info};
    border: 2px solid ${props.theme.colors.info}40;
    box-shadow: 0 2px 8px ${props.theme.colors.info}20;
  `}
  
  ${props => props.$status === 'inactive' && `
    background: ${props.theme.colors.bgDark};
    color: ${props.theme.colors.textLight};
    border: 2px solid ${props.theme.colors.border};
  `}
  
  ${props => props.$status === 'completed' && `
    background: #dcfce7;
    color: #16a34a;
    border: 2px solid #16a34a40;
    box-shadow: 0 2px 8px #16a34a20;
  `}
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
`;

const StatusBadge = ({ status, showDot = true, children }) => {
  return (
    <BadgeWrapper $status={status}>
      {showDot && <StatusDot />}
      {children || status.charAt(0).toUpperCase() + status.slice(1)}
    </BadgeWrapper>
  );
};

export default StatusBadge;
