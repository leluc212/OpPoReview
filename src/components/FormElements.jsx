import styled from 'styled-components';

export const Button = styled.button`
  padding: ${props => {
    if (props.$size === 'small') return '8px 16px';
    if (props.$size === 'large') return '16px 32px';
    return '12px 24px';
  }};
  font-size: ${props => props.$size === 'small' ? '14px' : '16px'};
  font-weight: 500;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.normal};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  
  ${props => props.$variant === 'primary' && `
    background: ${props.theme.colors.gradientPrimary};
    color: white;
    box-shadow: ${props.theme.shadows.sm};
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.hover};
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `}
  
  ${props => props.$variant === 'secondary' && `
    background: ${props.theme.colors.bgLight};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover:not(:disabled) {
      border-color: ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};
    }
  `}
  
  ${props => props.$variant === 'outline' && `
    background: transparent;
    color: ${props.theme.colors.primary};
    border: 2px solid ${props.theme.colors.primary};
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.primary};
      color: white;
    }
  `}
  
  ${props => props.$variant === 'ghost' && `
    background: transparent;
    color: ${props.theme.colors.textLight};
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.bgDark};
      color: ${props.theme.colors.text};
    }
  `}
  
  ${props => props.$variant === 'danger' && `
    background: ${props.theme.colors.error};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.error};
      opacity: 0.9;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.$fullWidth && `
    width: 100%;
  `}
`;

export const Input = styled.input`
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.fast};
  width: 100%;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.bgDark};
    cursor: not-allowed;
  }
  
  ${props => props.$error && `
    border-color: ${props.theme.colors.error};
  `}
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.fast};
  width: 100%;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

export const Select = styled.select`
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.fast};
  width: 100%;
  cursor: pointer;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  display: block;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const ErrorText = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.error};
  margin-top: 4px;
  display: block;
`;
