import React from 'react';
import styled from 'styled-components';

const BadgeWrapper = styled.span`
  padding: 6px 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  
  ${props => props.$status === 'pending' && `
    background: ${props.theme.colors.warningBg};
    color: ${props.theme.colors.warning};
  `}
  
  ${props => props.$status === 'approved' && `
    background: ${props.theme.colors.successBg};
    color: ${props.theme.colors.success};
  `}
  
  ${props => props.$status === 'rejected' && `
    background: ${props.theme.colors.errorBg};
    color: ${props.theme.colors.error};
  `}
  
  ${props => props.$status === 'active' && `
    background: ${props.theme.colors.infoBg};
    color: ${props.theme.colors.info};
  `}
  
  ${props => props.$status === 'inactive' && `
    background: ${props.theme.colors.bgDark};
    color: ${props.theme.colors.textLight};
  `}
`;

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
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
