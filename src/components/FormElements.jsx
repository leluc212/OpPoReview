import styled from 'styled-components';

export const Button = styled.button`
  padding: ${props => {
    if (props.$size === 'small') return '6px 12px';
    if (props.$size === 'large') return '12px 24px';
    return '10px 20px';
  }};
  font-size: ${props => props.$size === 'small' ? '13px' : '15px'};
  font-weight: 500;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.normal};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  
  ${props => props.$variant === 'primary' && `
    background: #60A5FA;
    color: white;
    box-shadow: 0 8px 24px rgba(96, 165, 250, 0.4);
    border: none;
    font-weight: 700;
    font-size: 16px;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 12px 36px rgba(96, 165, 250, 0.5);
      background: #3B82F6;
    }
    
    &:active:not(:disabled) {
      transform: translateY(0) scale(1);
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
    background: rgba(255, 255, 255, 1);
    color: #60A5FA;
    border: 2px solid #60A5FA;
    font-weight: 700;
    backdrop-filter: blur(10px);
    box-shadow: 0 6px 20px rgba(96, 165, 250, 0.2);
    
    &:hover:not(:disabled) {
      background: #EFF6FF;
      border-color: #3B82F6;
      color: #3B82F6;
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(59, 130, 246, 0.25);
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
  padding: 10px 14px;
  font-size: 15px;
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
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
  display: block;
`;

export const FormGroup = styled.div`
  margin-bottom: 14px;
`;

export const ErrorText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.error};
  margin-top: 3px;
  display: block;
`;
