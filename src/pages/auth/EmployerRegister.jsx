import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button, Input, FormGroup, Label, ErrorText, TextArea, Select } from '../../components/FormElements';
import { ArrowLeft } from 'lucide-react';

const RegisterContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 40px;
`;

const RegisterWrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;
  margin-bottom: 32px;
  transition: color ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const FormCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 48px;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const FormHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const EmployerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyEmail: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyEmail) newErrors.companyEmail = 'Company email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Navigate to OTP verification and then to pending approval
    navigate('/verify-otp', { state: { email: formData.companyEmail, role: 'employer' } });
  };

  return (
    <RegisterContainer>
      <RegisterWrapper>
        <BackButton to="/register">
          <ArrowLeft />
          Back to role selection
        </BackButton>

        <FormCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FormHeader>
            <h1>Create Employer Account</h1>
            <p>Create your account now, complete company details when posting jobs</p>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="companyEmail">Company Email *</Label>
              <Input
                id="companyEmail"
                name="companyEmail"
                type="email"
                placeholder="hr@yourcompany.com"
                value={formData.companyEmail}
                onChange={handleChange}
                $error={errors.companyEmail}
              />
              {errors.companyEmail && <ErrorText>{errors.companyEmail}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                $error={errors.password}
              />
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                $error={errors.confirmPassword}
              />
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
            </FormGroup>

            <Button type="submit" $variant="primary" $fullWidth $size="large" style={{ marginTop: '24px' }}>
              Create Account
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', color: '#64748B' }}>
            Already have an account? <Link to="/login" style={{ color: '#0E3995', fontWeight: 500 }}>Sign in</Link>
          </div>
        </FormCard>
      </RegisterWrapper>
    </RegisterContainer>
  );
};

export default EmployerRegister;
