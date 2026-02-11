import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Users, Building2, ArrowRight } from 'lucide-react';

const SelectionContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  padding: 40px;
`;

const ContentWrapper = styled(motion.div)`
  max-width: 900px;
  width: 100%;
  text-align: center;
`;

const Logo = styled(Link)`
  font-size: 28px;
  font-weight: 700;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 48px;
  display: inline-block;
`;

const Header = styled.div`
  margin-bottom: 64px;
  
  h1 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 16px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: 20px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const RoleCards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-bottom: 32px;
`;

const RoleCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 48px 32px;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadows.hover};
  }
`;

const RoleIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: ${props => props.theme.colors.gradientPrimary};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

const RoleTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.text};
`;

const RoleDescription = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 24px;
  line-height: 1.6;
`;

const RoleFeatures = styled.ul`
  text-align: left;
  margin-bottom: 32px;
  
  li {
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 8px;
    padding-left: 24px;
    position: relative;
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: ${props => props.theme.colors.success};
      font-weight: 700;
    }
  }
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 14px 24px;
  background: ${props => props.theme.colors.gradientPrimary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.hover};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const LoginPrompt = styled.div`
  color: ${props => props.theme.colors.textLight};
  
  a {
    color: ${props => props.theme.colors.primary};
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterRoleSelection = () => {
  const navigate = useNavigate();

  return (
    <SelectionContainer>
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Logo to="/">JobMarket</Logo>
        
        <Header>
          <h1>Join JobMarket</h1>
          <p>Choose your account type to get started</p>
        </Header>

        <RoleCards>
          <RoleCard
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/register/candidate')}
          >
            <RoleIcon>
              <Users />
            </RoleIcon>
            <RoleTitle>I'm a Candidate</RoleTitle>
            <RoleDescription>
              Looking for exciting career opportunities
            </RoleDescription>
            <RoleFeatures>
              <li>Browse thousands of jobs</li>
              <li>Apply with one click</li>
              <li>Track your applications</li>
              <li>Get personalized recommendations</li>
            </RoleFeatures>
            <SelectButton>
              Create Candidate Account
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
            <RoleTitle>I'm an Employer</RoleTitle>
            <RoleDescription>
              Ready to hire top talent for my company
            </RoleDescription>
            <RoleFeatures>
              <li>Post unlimited jobs</li>
              <li>Access candidate database</li>
              <li>Manage applications easily</li>
              <li>Direct messaging with candidates</li>
            </RoleFeatures>
            <SelectButton>
              Create Employer Account
              <ArrowRight />
            </SelectButton>
          </RoleCard>
        </RoleCards>

        <LoginPrompt>
          Already have an account? <Link to="/login">Sign in</Link>
        </LoginPrompt>
      </ContentWrapper>
    </SelectionContainer>
  );
};

export default RegisterRoleSelection;
