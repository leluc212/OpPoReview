import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Users, Building2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SelectionContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #002e9d;
  padding: 40px;
  position: relative;
  overflow: hidden;
  color-scheme: light;

  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(20px, -20px) rotate(90deg); }
    50% { transform: translate(-20px, 20px) rotate(180deg); }
    75% { transform: translate(20px, 20px) rotate(270deg); }
  }

  &::before {
    content: '';
    position: absolute;
    width: 900px;
    height: 900px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    border-radius: 50%;
    top: -450px;
    right: -250px;
    animation: float 20s infinite ease-in-out;
  }

  &::after {
    content: '';
    position: absolute;
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
    border-radius: 50%;
    bottom: -350px;
    left: -200px;
    animation: float 15s infinite ease-in-out reverse;
  }
`;

const GridPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
  opacity: 0.3;
  z-index: 0;
  pointer-events: none;
`;

const GradientGlow = styled(motion.div)`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 30%, transparent 70%);
  filter: blur(60px);
  animation: glowPulse 8s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
  
  @keyframes glowPulse {
    0%, 100% {
      opacity: 0.4;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
`;

const ContentWrapper = styled(motion.div)`
  max-width: 1100px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 10;
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 800;
  color: #002e9d;
  text-decoration: none;
  letter-spacing: -0.5px;
  margin-bottom: 48px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  padding: 16px 32px;
  border-radius: 16px;
  border: 2px solid rgba(55, 69, 219, 0.55);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.3) inset;
  
  &:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.35);
    box-shadow: 
      0 12px 48px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  }
  
  img {
    height: 52px;
  }
`;

const Header = styled.div`
  margin-bottom: 64px;
  
  h1 {
    font-size: 56px;
    font-weight: 800;
    margin-bottom: 16px;
    color: white;
    letter-spacing: -2px;
    line-height: 1.1;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  }
  
  p {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 400;
    line-height: 1.6;
  }
`;

const RoleCards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RoleCard = styled(motion.div)`
  background: white;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 48px 36px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  }
`;

const RoleIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: #002e9d;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

const RoleTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1E293B;
  letter-spacing: -0.5px;
`;

const RoleDescription = styled.p`
  font-size: 16px;
  color: #64748B;
  margin-bottom: 28px;
  line-height: 1.6;
  font-weight: 400;
`;

const RoleFeatures = styled.ul`
  text-align: left;
  margin-bottom: 32px;
  
  li {
    color: #64748B;
    margin-bottom: 12px;
    padding-left: 28px;
    position: relative;
    font-size: 15px;
    line-height: 1.5;
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #667eea;
      font-weight: 700;
      font-size: 16px;
    }
  }
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 16px 32px;
  background: #002e9d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
`;

const LoginPrompt = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  
  a {
    color: white;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 4px 8px;
    border-radius: 6px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.35);
      text-decoration: none;
    }
  }
`;

const RegisterRoleSelection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <SelectionContainer>
      <GridPattern />
      <GradientGlow
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Logo to="/">
          <img src="/images/logo.png" alt="Ốp Pờ" />
          Ốp Pờ
        </Logo>
        
        <Header>
          <h1>{t.register.joinTitle}</h1>
          <p>{t.register.joinSubtitle}</p>
        </Header>

        <RoleCards>
          <RoleCard
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/register/candidate')}
          >
            <RoleIcon>
              <Users />
            </RoleIcon>
            <RoleTitle>{t.register.candidateTitle}</RoleTitle>
            <RoleDescription>
              {t.register.candidateDescription}
            </RoleDescription>
            <RoleFeatures>
              <li>{t.register.candidateFeature1}</li>
              <li>{t.register.candidateFeature2}</li>
              <li>{t.register.candidateFeature3}</li>
              <li>{t.register.candidateFeature4}</li>
            </RoleFeatures>
            <SelectButton>
              {t.register.candidateButton}
              <ArrowRight />
            </SelectButton>
          </RoleCard>

          <RoleCard
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/register/employer')}
          >
            <RoleIcon>
              <Building2 />
            </RoleIcon>
            <RoleTitle>{t.register.employerTitle}</RoleTitle>
            <RoleDescription>
              {t.register.employerDescription}
            </RoleDescription>
            <RoleFeatures>
              <li>{t.register.employerFeature1}</li>
              <li>{t.register.employerFeature2}</li>
              <li>{t.register.employerFeature3}</li>
              <li>{t.register.employerFeature4}</li>
            </RoleFeatures>
            <SelectButton>
              {t.register.employerButton}
              <ArrowRight />
            </SelectButton>
          </RoleCard>
        </RoleCards>

        <LoginPrompt>
          {t.register.haveAccount} <Link to="/login">{t.register.signIn}</Link>
        </LoginPrompt>
      </ContentWrapper>
    </SelectionContainer>
  );
};

export default RegisterRoleSelection;
