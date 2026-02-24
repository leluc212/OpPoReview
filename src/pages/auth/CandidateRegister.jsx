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
    email: '',
    password: '',
    confirmPassword: '',
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
    if (!formData.email) newErrors.email = 'Vui lòng nhập email';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
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
          Quay lại chọn vai trò
        </BackButton>

        <FormCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FormHeader>
            <h1>Tạo Tài Khoản Ứng Viên</h1>
            <p>Tạo tài khoản ngay, hoàn thiện hồ sơ sau</p>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Địa Chỉ Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email.cua.ban@gmail.com"
                value={formData.email}
                onChange={handleChange}
                $error={errors.email}
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Mật Khẩu *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={formData.password}
                onChange={handleChange}
                $error={errors.password}
              />
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                $error={errors.confirmPassword}
              />
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
            </FormGroup>

            <Button type="submit" $variant="primary" $fullWidth $size="large" style={{ marginTop: '24px' }}>
              Tạo Tài Khoản
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', color: '#64748B' }}>
            Đã có tài khoản? <Link to="/login" style={{ color: '#0E3995', fontWeight: 500 }}>Đăng nhập</Link>
          </div>
        </FormCard>
      </RegisterWrapper>
    </RegisterContainer>
  );
};

export default CandidateRegister;
