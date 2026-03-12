import React, { useRef } from 'react';
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
  cursor: pointer;
  border: none;
  
  ${props => props.$variant === 'primary' && `
    background: #60A5FA;
    color: white;
    box-shadow: 0 8px 24px rgba(96, 165, 250, 0.4);
    font-weight: 700;
    font-size: 16px;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 12px 36px rgba(96, 165, 250, 0.5);
      background: #1e40af;
    }
    
    &:active:not(:disabled) {
      transform: translateY(0) scale(1);
    }
  `}
  
  ${props => props.$variant === 'secondary' && `
    background: ${props.theme.colors.bgLight};
    color: ${props.theme.colors.text};
    border: 2px solid ${props.theme.colors.border};
    font-weight: 600;
    
    &:hover:not(:disabled) {
      border-color: ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};
      background: ${props.theme.colors.bgLight};
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
      border-color: #1e40af;
      color: #1e40af;
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(30, 64, 175, 0.25);
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
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.fast};
  width: 100%;
  font-weight: 600;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
    background: ${props => props.theme.colors.bgLight};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textLight};
    font-weight: 400;
  }
  
  &:disabled {
    background: ${props => props.theme.colors.bgDark};
    color: ${props => props.theme.colors.textDark};
    cursor: not-allowed;
    opacity: 1;
    font-weight: 700;
  }
  
  ${props => props.$error && `
    border-color: ${props.theme.colors.error};
  `}

  &[type="date"]::-webkit-datetime-edit {
    display: flex;
  }
  &[type="date"]::-webkit-datetime-edit-day-field { order: 1; }
  &[type="date"]::-webkit-datetime-edit-text:first-of-type { order: 2; }
  &[type="date"]::-webkit-datetime-edit-month-field { order: 3; }
  &[type="date"]::-webkit-datetime-edit-text:last-of-type { order: 4; }
  &[type="date"]::-webkit-datetime-edit-year-field { order: 5; }
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.fast};
  width: 100%;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  font-weight: 600;
  line-height: 1.6;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
    background: ${props => props.theme.colors.bgLight};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textLight};
    font-weight: 400;
  }
  
  &:disabled {
    background: ${props => props.theme.colors.bgDark};
    color: ${props => props.theme.colors.textDark};
    cursor: not-allowed;
    opacity: 1;
    font-weight: 700;
  }
`;

export const Select = styled.select`
  padding: 10px 14px;
  font-size: 15px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgLight};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.fast};
  width: 100%;
  cursor: pointer;
  font-weight: 600;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
    background: ${props => props.theme.colors.bgLight};
  }
  
  /* Style for empty/placeholder option */
  &:invalid,
  option[value=""] {
    color: ${props => props.theme.colors.textLight};
    font-weight: 400;
  }
  
  option {
    background: ${props => props.theme.colors.bgLight};
    color: ${props => props.theme.colors.text};
    font-weight: 600;
  }
  
  option[value=""] {
    color: ${props => props.theme.colors.textLight};
    font-weight: 400;
  }
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 800;
  color: ${props => props.theme.colors.textDark};
  margin-bottom: 8px;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

// ── DateInput component ──────────────────────────────────────────────────────
const DateInputWrapper = styled.div`
  position: relative;
  width: 100%;

  input[type="text"] {
    padding-right: 40px;
  }

  input[type="date"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 1px;
    height: 1px;
    top: 0;
    left: 0;
  }

  .cal-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #64748B;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: color 0.15s;
    &:hover { color: #2563EB; }
  }
`;

const maskDate = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  let out = '';
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) out += '/';
    out += digits[i];
  }
  return out;
};

// Convert dd/mm/yyyy ↔ yyyy-mm-dd
const toNative = (dmy) => {
  const p = dmy.split('/');
  if (p.length !== 3 || p[2].length !== 4) return '';
  return `${p[2]}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}`;
};
const fromNative = (ymd) => {
  if (!ymd) return '';
  const [y, m, d] = ymd.split('-');
  return `${d}/${m}/${y}`;
};

export const DateInput = ({ value, onChange, required, style, $error, placeholder = 'dd/mm/yyyy' }) => {
  const nativeRef = useRef(null);

  const handleText = (e) => {
    onChange(maskDate(e.target.value));
  };

  const handleNative = (e) => {
    onChange(fromNative(e.target.value));
  };

  const openPicker = () => {
    const el = nativeRef.current;
    if (!el) return;
    el.value = toNative(value || '');
    el.showPicker?.();
  };

  return (
    <DateInputWrapper>
      <Input
        type="text"
        value={value || ''}
        onChange={handleText}
        placeholder={placeholder}
        required={required}
        style={style}
        $error={$error}
        inputMode="numeric"
        maxLength={10}
      />
      <input
        ref={nativeRef}
        type="date"
        onChange={handleNative}
        tabIndex={-1}
        aria-hidden="true"
      />
      <button type="button" className="cal-btn" onClick={openPicker} tabIndex={-1}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>
    </DateInputWrapper>
  );
};
