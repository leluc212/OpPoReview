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
    companyName: '',
    companyEmail: '',
    companyWebsite: '',
    industry: '',
    companySize: '',
    contactPerson: '',
    contactPhone: '',
    password: '',
    confirmPassword: '',
    description: '',
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
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.companyEmail) newErrors.companyEmail = 'Email is required';
    if (!formData.contactPerson) newErrors.contactPerson = 'Contact person is required';
    if (!formData.contactPhone) newErrors.contactPhone = 'Phone is required';
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
            <p>Register your company to start hiring</p>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Highlands"
                  value={formData.companyName}
                  onChange={handleChange}
                  $error={errors.companyName}
                />
                {errors.companyName && <ErrorText>{errors.companyName}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="companyEmail">Company Email *</Label>
                <Input
                  id="companyEmail"
                  name="companyEmail"
                  type="email"
                  placeholder="hr@acme.com"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  $error={errors.companyEmail}
                />
                {errors.companyEmail && <ErrorText>{errors.companyEmail}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  name="companyWebsite"
                  type="url"
                  placeholder="https://acme.com"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="industry">Industry</Label>
                <Select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  <option value="">Select Industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="companySize">Company Size</Label>
                <Select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  type="text"
                  placeholder="Jane Smith"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  $error={errors.contactPerson}
                />
                {errors.contactPerson && <ErrorText>{errors.contactPerson}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  $error={errors.contactPhone}
                />
                {errors.contactPhone && <ErrorText>{errors.contactPhone}</ErrorText>}
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
            </FormGrid>

            <FormGroup style={{ marginTop: '20px' }}>
              <Label htmlFor="description">Company Description</Label>
              <TextArea
                id="description"
                name="description"
                placeholder="Tell us about your company..."
                value={formData.description}
                onChange={handleChange}
              />
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
