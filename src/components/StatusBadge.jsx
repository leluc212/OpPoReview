import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useLanguage } from '../context/LanguageContext';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
`;

const BadgeWrapper = styled.span`
  padding: ${props => props.$size === 'sm' ? '4px 10px' : '8px 18px'};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.$size === 'sm' ? '11px' : '13px'};
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: ${props => props.$size === 'sm' ? '5px' : '8px'};
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
    background: ${props.theme.colors.successBg};
    color: ${props.theme.colors.success};
    border: 2px solid ${props.theme.colors.success}40;
    box-shadow: 0 2px 8px ${props.theme.colors.success}20;
  `}
  
  ${props => props.$status === 'urgent' && `
    background: ${props.theme.colors.errorBg};
    color: ${props.theme.colors.error};
    border: 2px solid ${props.theme.colors.error}40;
    box-shadow: 0 2px 8px ${props.theme.colors.error}20;
  `}
`;

const StatusDot = styled.span`
  width: ${props => props.$size === 'sm' ? '6px' : '8px'};
  height: ${props => props.$size === 'sm' ? '6px' : '8px'};
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
  
  ${props => props.$pulse && css`
    animation: ${pulse} 1.5s ease-in-out infinite;
  `}
`;

const StatusBadge = ({ status, showDot = true, children, size = 'md' }) => {
  const { language } = useLanguage();
  
  // Map status sang tiếng Việt và tiếng Anh
  const statusText = {
    vi: {
      'pending': 'Chờ duyệt',
      'approved': 'Chấp nhận',
      'rejected': 'Từ chối',
      'reviewed': 'Đã xem',
      'active': 'Hoạt động',
      'inactive': 'Không hoạt động',
      'completed': 'Hoàn thành',
      'urgent': 'Tuyển gấp'
    },
    en: {
      'pending': 'Pending',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'reviewed': 'Reviewed',
      'active': 'Active',
      'inactive': 'Inactive',
      'completed': 'Completed',
      'urgent': 'Urgent'
    }
  };
  
  return (
    <BadgeWrapper $status={status} $size={size}>
      {showDot && <StatusDot $pulse={status === 'urgent'} $size={size} />}
      {children || statusText[language][status] || status}
    </BadgeWrapper>
  );
};

export default StatusBadge;
