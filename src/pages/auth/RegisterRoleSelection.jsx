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
  background: #FFFFFF;
  padding: 40px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background: radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(30, 64, 175, 0.05) 0%, transparent 40%);
    pointer-events: none;
  }
`;

const GridPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(37, 99, 235, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.03) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
  opacity: 0.5;
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
  background: radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(59, 130, 246, 0.06) 30%, transparent 70%);
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
  font-weight: 700;
  color: #0F172A;
  text-decoration: none;
  letter-spacing: -0.5px;
  margin-bottom: 48px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    opacity: 0.8;
  }
`;

const Header = styled.div`
  margin-bottom: 64px;
  
  h1 {
    font-size: 56px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #0F172A;
    letter-spacing: -2px;
    line-height: 1.1;
  }
  
  p {
    font-size: 20px;
    color: #64748B;
    font-weight: 400;
    line-height: 1.6;
  }
`;

const RoleCards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-bottom: 40px;
`;

const RoleCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 48px 36px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  
  &:hover {
    border-color: rgba(37, 99, 235, 0.3);
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(37, 99, 235, 0.15);
    background: rgba(255, 255, 255, 0.9);
  }
`;

const RoleIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

const RoleTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #0F172A;
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
      color: #2563EB;
      font-weight: 700;
      font-size: 16px;
    }
  }
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
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
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
  }
  
  &:active {
    transform: translateY(0) scale(1);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const LoginPrompt = styled.div`
  color: #64748B;
  font-size: 15px;
  
  a {
    color: #2563EB;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      color: #1E40AF;
      text-decoration: underline;
    }
  }
`;

const RegisterRoleSelection = () => {
  const navigate = useNavigate();

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
          <img src="/images/logo.png" alt="Ốp Pờ" style={{ height: '36px', marginRight: '8px' }} />
          Ốp Pờ
        </Logo>
        
        <Header>
          <h1>Tham Gia Ốp Pờ</h1>
          <p>Chọn loại tài khoản để bắt đầu</p>
        </Header>

        <RoleCards>
          <RoleCard
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/register/candidate')}
          >
            <RoleIcon>
              <Users />
            </RoleIcon>
            <RoleTitle>Tôi là Ứng Viên</RoleTitle>
            <RoleDescription>
              Đang tìm kiếm cơ hội nghề nghiệp hấp dẫn
            </RoleDescription>
            <RoleFeatures>
              <li>Duyệt hàng nghìn công việc</li>
              <li>Ứng tuyển chỉ với một cú nhấp chuột</li>
              <li>Theo dõi hồ sơ ứng tuyển</li>
              <li>Nhận gợi ý công việc phù hợp</li>
            </RoleFeatures>
            <SelectButton>
              Tạo Tài Khoản Ứng Viên
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
            <RoleTitle>Tôi là Nhà Tuyển Dụng</RoleTitle>
            <RoleDescription>
              Sẵn sàng tuyển dụng nhân tài cho công ty
            </RoleDescription>
            <RoleFeatures>
              <li>Đăng tin tuyển dụng không giới hạn</li>
              <li>Truy cập cơ sở dữ liệu ứng viên</li>
              <li>Quản lý hồ sơ dễ dàng</li>
              <li>Nhắn tin trực tiếp với ứng viên</li>
            </RoleFeatures>
            <SelectButton>
              Tạo Tài Khoản Nhà Tuyển Dụng
              <ArrowRight />
            </SelectButton>
          </RoleCard>
        </RoleCards>

        <LoginPrompt>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </LoginPrompt>
      </ContentWrapper>
    </SelectionContainer>
  );
};

export default RegisterRoleSelection;
