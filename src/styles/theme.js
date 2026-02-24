import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: #f8fafc;
    background-attachment: fixed;
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: 1.2;
    font-weight: 600;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.bgLight};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textLight};
  }
`;

export const theme = {
  colors: {
    // Primary colors
    primary: '#0E3995',
    primaryDark: '#0D3880',
    primaryLight: '#0055A5',
    
    // Secondary colors
    secondary: '#0055A5',
    secondaryDark: '#0E3995',
    secondaryLight: '#0D3880',
    
    // Background
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    bgLight: '#FFFFFF',
    bgDark: '#F1F5F9',
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    
    // Text
    text: '#1E293B',
    textLight: '#64748B',
    textDark: '#0F172A',
    
    // Borders
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    
    // Status
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0055A5',
    
    // Status light backgrounds
    successBg: '#D1FAE5',
    warningBg: '#FEF3C7',
    errorBg: '#FEE2E2',
    infoBg: '#DBEAFE',
    
    // Gradients - Rich and Modern
    gradientPrimary: 'linear-gradient(135deg, #0E3995 0%, #0055A5 100%)',
    gradientSecondary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientHero: 'linear-gradient(135deg, #0D3880 0%, #0055A5 100%)',
    gradientSuccess: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    gradientWarning: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    gradientInfo: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    gradientPurple: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    gradientOrange: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 90%, #2BFF88 100%)',
    
    // Overlay
    overlay: 'rgba(15, 23, 42, 0.5)',
    glassEffect: 'rgba(255, 255, 255, 0.1)',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    hover: '0 20px 40px rgba(14, 57, 149, 0.25)',
    card: '0 4px 16px rgba(0, 0, 0, 0.08)',
    glow: '0 0 30px rgba(14, 57, 149, 0.3)',
    intense: '0 25px 50px -12px rgba(14, 57, 149, 0.35)',
  },
  
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1440px',
  },
  
  fonts: {
    sizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '60px',
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
};
