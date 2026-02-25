import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button, Input, FormGroup, Label, ErrorText } from '../../components/FormElements';
import { Mail, Lock, Eye, EyeOff, CheckCircle, ArrowRight, Building2 } from 'lucide-react';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(20px, -20px) rotate(90deg); }
    50% { transform: translate(-20px, 20px) rotate(180deg); }
    75% { transform: translate(20px, 20px) rotate(270deg); }
  }

  &::before {
    content: '';
    position: absolute;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    border-radius: 50%;
    top: -400px;
    right: -200px;
    animation: float 20s infinite ease-in-out;
  }

  &::after {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
    border-radius: 50%;
    bottom: -300px;
    left: -150px;
    animation: float 15s infinite ease-in-out reverse;
  }
`;

const RegisterLeft = styled(motion.div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
  color: white;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const RegisterRight = styled(motion.div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    flex: 1;
    width: 100%;
  }
`;

const HeroContent = styled.div`
  max-width: 550px;

  h1 {
    font-size: 52px;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 24px;
    letter-spacing: -1px;
  }

  p {
    font-size: 18px;
    line-height: 1.7;
    margin-bottom: 40px;
    opacity: 0.95;
  }

  .features {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 16px;
      font-weight: 500;

      svg {
        width: 24px;
        height: 24px;
        color: #10B981;
        flex-shrink: 0;
      }
    }
  }
`;

const RegisterForm = styled.div`
  background: white;
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;

  .logo-section {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    gap: 12px;

    img {
      height: 40px;
    }

    .logo-text {
      font-size: 32px;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  h2 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #1E293B;
  }

  p {
    font-size: 14px;
    color: #64748B;

    a {
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const SocialButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

const SocialButton = styled(motion.button)`
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  background: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
  color: #334155;

  &:hover {
    border-color: ${props => props.$color};
    background: ${props => props.$color}05;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.$color}30;
  }

  svg, img {
    width: 20px;
    height: 20px;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: #94A3B8;
  margin: 24px 0;
  font-weight: 500;
  font-size: 13px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #E2E8F0;
  }

  &::before {
    margin-right: 16px;
  }

  &::after {
    margin-left: 16px;
  }
`;

const InputWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #94A3B8;
    pointer-events: none;
  }

  input {
    padding-left: 44px;
  }

  .password-toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    color: #94A3B8;
    transition: color 0.3s;

    &:hover {
      color: #667eea;
    }

    svg {
      position: static;
      transform: none;
      width: 18px;
      height: 18px;
    }
  }
`;

const SubmitButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  }

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.3s;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #667eea;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    gap: 8px;
    color: #764ba2;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const EmployerRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyEmail) {
      newErrors.companyEmail = 'Vui lòng nhập email công ty';
    } else if (!/\S+@\S+\.\S+/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
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

    // Navigate to OTP verification and then to pending approval
    navigate('/verify-otp', { state: { email: formData.companyEmail, role: 'employer' } });
  };

  const handleSocialRegister = (provider) => {
    // Mock social registration
    alert(`Đăng ký bằng ${provider} (chức năng đang phát triển)`);
  };

  return (
    <RegisterContainer>
      <RegisterLeft
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroContent>
          <h1>Tìm kiếm ứng viên cho doanh nghiệp</h1>
          <p>Tạo tài khoản nhà tuyển dụng miễn phí và tiếp cận hàng triệu ứng viên tiềm năng trên nền tảng Ốp Pờ.</p>
          
          <div className="features">
            <div className="feature-item">
              <CheckCircle />
              <span>Đăng tin tuyển dụng không giới hạn</span>
            </div>
            <div className="feature-item">
              <CheckCircle />
              <span>Truy cập cơ sở dữ liệu ứng viên chất lượng</span>
            </div>
            <div className="feature-item">
              <CheckCircle />
              <span>Quản lý hồ sơ ứng tuyển hiệu quả</span>
            </div>
            <div className="feature-item">
              <CheckCircle />
              <span>Đáp ứng nhu cầu tuyển dụng nhanh chóng</span>
            </div>
          </div>
        </HeroContent>
      </RegisterLeft>

      <RegisterRight
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <RegisterForm>
          <FormHeader>
            <div className="logo-section">
              <img src="/images/logo.png" alt="Ốp Pờ" />
              <div className="logo-text">Ốp Pờ</div>
            </div>
            <h2>Tạo Tài Khoản Nhà Tuyển Dụng</h2>
            <p>
              Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </p>
          </FormHeader>

          <SocialButtons>
            <SocialButton
              type="button"
              onClick={() => handleSocialRegister('Google')}
              $color="#EA4335"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
              </svg>
              Google
            </SocialButton>
            
            <SocialButton
              type="button"
              onClick={() => handleSocialRegister('Facebook')}
              $color="#1877F2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </SocialButton>
          </SocialButtons>

          <Divider>hoặc đăng ký bằng email</Divider>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="companyEmail">Email công ty *</Label>
              <InputWrapper>
                <Mail />
                <Input
                  id="companyEmail"
                  name="companyEmail"
                  type="email"
                  placeholder="hr@congtyban.com"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  $error={errors.companyEmail}
                />
              </InputWrapper>
              {errors.companyEmail && <ErrorText>{errors.companyEmail}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Mật khẩu *</Label>
              <InputWrapper>
                <Lock />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 6 ký tự"
                  value={formData.password}
                  onChange={handleChange}
                  $error={errors.password}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </InputWrapper>
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
              <InputWrapper>
                <Lock />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  $error={errors.confirmPassword}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </InputWrapper>
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
            </FormGroup>

            <SubmitButton type="submit" $variant="primary" $fullWidth $size="large">
              Tạo Tài Khoản
              <ArrowRight />
            </SubmitButton>

            <BackLink to="/register">
              ← Quay lại chọn vai trò
            </BackLink>
          </form>
        </RegisterForm>
      </RegisterRight>
    </RegisterContainer>
  );
};

export default EmployerRegister;
