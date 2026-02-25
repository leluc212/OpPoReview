import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button, Input, FormGroup, Label, ErrorText } from '../../components/FormElements';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    animation: float 20s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    animation: float 15s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(30px, -30px) rotate(5deg);
    }
  }
`;

const LoginLeft = styled(motion.div)`
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

const LoginRight = styled(motion.div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
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
    margin-bottom: 24px;
    line-height: 1.2;
    letter-spacing: -1px;
  }
  
  p {
    font-size: 18px;
    opacity: 0.95;
    line-height: 1.7;
    margin-bottom: 32px;
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
      
      svg {
        width: 24px;
        height: 24px;
        color: #10B981;
        flex-shrink: 0;
      }
    }
  }
`;

const LoginForm = styled.div`
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const FormHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;
  
  .logo-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
    
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
    color: ${props => props.theme.colors.text};
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 14px;
    
    a {
      color: ${props => props.theme.colors.primary};
      font-weight: 600;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const SocialButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
`;

const SocialButton = styled(motion.button)`
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  background: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    border-color: ${props => props.$color || props.theme.colors.primary};
    background: ${props => props.$color || props.theme.colors.primary}05;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  img {
    width: 20px;
    height: 20px;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: ${props => props.theme.colors.textLight};
  font-size: 13px;
  font-weight: 500;
  
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
  gap: 10px;
  margin-bottom: 24px;
  padding: 6px;
  background: ${props => props.theme.colors.bgDark};
  border-radius: 12px;
`;

const RoleButton = styled(motion.button)`
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: ${props => props.$selected ? 'white' : 'transparent'};
  color: ${props => props.$selected ? props.theme.colors.primary : props.theme.colors.textLight};
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s;
  cursor: pointer;
  box-shadow: ${props => props.$selected ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
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
    color: ${props => props.theme.colors.textLight};
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
    color: ${props => props.theme.colors.textLight};
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
    
    svg {
      position: relative;
      left: 0;
      top: 0;
      transform: none;
    }
  }
`;

const ForgotPassword = styled(Link)`
  color: ${props => props.theme.colors.primary};
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
  margin-top: 8px;
  
  &:hover {
    text-decoration: underline;
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
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
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

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);
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
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
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

    // Mock login
    const userData = {
      name: role === 'admin' ? 'Quản Trị Viên' : formData.email.split('@')[0],
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

  const handleSocialLogin = (provider) => {
    // Mock social login
    alert(`Đăng nhập bằng ${provider} (chức năng đang phát triển)`);
  };

  return (
    <LoginContainer>
      <LoginLeft
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroContent>
          <h1>Chào mừng bạn quay lại Ốp Pờ</h1>
          <p>Đăng nhập để tiếp tục hành trình tìm việc mơ ước hoặc tuyển dụng ứng viên tài năng.</p>
          
          <div className="features">
            <div className="feature-item">
              <CheckCircle />
              <span>Kết nối với hàng ngàn cơ hội việc làm</span>
            </div>
            <div className="feature-item">
              <CheckCircle />
              <span>Tìm kiếm ứng viên chất lượng cao</span>
            </div>
            <div className="feature-item">
              <CheckCircle />
              <span>Quản lý hồ sơ dễ dàng và nhanh chóng</span>
            </div>
          </div>
        </HeroContent>
      </LoginLeft>

      <LoginRight
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <LoginForm>
          <FormHeader>
            <div className="logo-section">
              <img src="/images/logo.png" alt="Ốp Pờ" />
              <div className="logo-text">Ốp Pờ</div>
            </div>
            <h2>Đăng Nhập</h2>
            <p>
              Người dùng mới? <Link to="/register">Tạo tài khoản miễn phí</Link>
            </p>
          </FormHeader>

          <SocialButtons>
            <SocialButton
              type="button"
              onClick={() => handleSocialLogin('Google')}
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
              onClick={() => handleSocialLogin('Facebook')}
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

          <Divider>hoặc đăng nhập bằng email</Divider>

          <RoleSelector>
            <RoleButton
              type="button"
              $selected={role === 'candidate'}
              onClick={() => setRole('candidate')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ứng Viên
            </RoleButton>
            <RoleButton
              type="button"
              $selected={role === 'employer'}
              onClick={() => setRole('employer')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Nhà Tuyển Dụng
            </RoleButton>
            <RoleButton
              type="button"
              $selected={role === 'admin'}
              onClick={() => setRole('admin')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Quản Trị
            </RoleButton>
          </RoleSelector>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <InputWrapper>
                <Mail />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="lucltse184288@fpt.edu.vn"
                  value={formData.email}
                  onChange={handleChange}
                  $error={errors.email}
                />
              </InputWrapper>
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Mật khẩu</Label>
              <InputWrapper>
                <Lock />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
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
              <ForgotPassword to="/forgot-password">Quên mật khẩu?</ForgotPassword>
            </FormGroup>

            <SubmitButton type="submit" $variant="primary" $fullWidth $size="large">
              Đăng Nhập
              <ArrowRight />
            </SubmitButton>
          </form>
        </LoginForm>
      </LoginRight>
    </LoginContainer>
  );
};

export default LoginPage;
