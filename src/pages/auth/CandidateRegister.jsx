import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button, Input, FormGroup, Label, ErrorText, TextArea } from '../../components/FormElements';
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
  
  & > div:last-child {
    grid-column: 1 / -1;
  }
`;

const CandidateRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    resume: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
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

    // Navigate to OTP verification
    navigate('/verify-otp', { state: { email: formData.email, role: 'candidate' } });
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
            <h1>Create Candidate Account</h1>
            <p>Fill in your details to get started</p>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  $error={errors.fullName}
                />
                {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  $error={errors.email}
                />
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  $error={errors.phone}
                />
                {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
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
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  $error={errors.confirmPassword}
                />
                {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="resume">Upload Resume (Optional)</Label>
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                />
              </FormGroup>
            </FormGrid>

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

export default CandidateRegister;
