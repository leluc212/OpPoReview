import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button, Input, FormGroup, Label, ErrorText } from '../../components/FormElements';
import { useAuth } from '../../context/AuthContext';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: ${props => props.theme.colors.background};
`;

const LoginLeft = styled.div`
  flex: 1;
  background: ${props => props.theme.colors.gradientHero};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
  color: white;
`;

const LoginRight = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
`;

const HeroContent = styled(motion.div)`
  max-width: 500px;
  
  h1 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 24px;
    line-height: 1.2;
  }
  
  p {
    font-size: 20px;
    opacity: 0.9;
    line-height: 1.6;
  }
`;

const LoginForm = styled(motion.div)`
  width: 100%;
  max-width: 440px;
`;

const FormHeader = styled.div`
  margin-bottom: 40px;
  
  h2 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    
    a {
      color: ${props => props.theme.colors.primary};
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: ${props => props.theme.colors.textLight};
  font-size: 14px;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.border};
  }
`;

const RoleSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

const RoleButton = styled.button`
  padding: 12px;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 2px solid ${props => props.$selected ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$selected ? `${props.theme.colors.primary}10` : props.theme.colors.bgLight};
  color: ${props => props.$selected ? props.theme.colors.primary : props.theme.colors.textLight};
  font-weight: 500;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const ForgotPassword = styled(Link)`
  color: ${props => props.theme.colors.primary};
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  margin-top: 8px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('candidate');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Mock login - in real app, this would call an API
    const userData = {
      name: role === 'admin' ? 'Admin User' : formData.email.split('@')[0],
      email: formData.email,
      role: role,
      approved: true
    };

    login(userData);

    // Redirect based on role
    if (role === 'candidate') {
      navigate('/candidate/dashboard');
    } else if (role === 'employer') {
      navigate('/employer/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  return (
    <LoginContainer>
      <LoginLeft>
        <HeroContent
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Welcome Back to JobMarket</h1>
          <p>
            Sign in to access your dashboard and continue your journey in finding the perfect job or hiring top talent.
          </p>
        </HeroContent>
      </LoginLeft>

      <LoginRight>
        <LoginForm
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Logo to="/">JobMarket</Logo>
          
          <FormHeader>
            <h2>Sign In</h2>
            <p>
              New user? <Link to="/register">Create an account</Link>
            </p>
          </FormHeader>

          <RoleSelector>
            <RoleButton
              type="button"
              $selected={role === 'candidate'}
              onClick={() => setRole('candidate')}
            >
              Candidate
            </RoleButton>
            <RoleButton
              type="button"
              $selected={role === 'employer'}
              onClick={() => setRole('employer')}
            >
              Employer
            </RoleButton>
            <RoleButton
              type="button"
              $selected={role === 'admin'}
              onClick={() => setRole('admin')}
            >
              Admin
            </RoleButton>
          </RoleSelector>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                $error={errors.email}
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                $error={errors.password}
              />
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
              <ForgotPassword to="/forgot-password">Forgot password?</ForgotPassword>
            </FormGroup>

            <Button type="submit" $variant="primary" $fullWidth $size="large">
              Sign In
            </Button>
          </form>

          <Divider>or continue with</Divider>

          <Button $variant="secondary" $fullWidth>
            Continue as Guest
          </Button>
        </LoginForm>
      </LoginRight>
    </LoginContainer>
  );
};

export default LoginPage;
