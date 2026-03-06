import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

/* ═══════════════════════════════════════════════════
   KEYFRAMES
═══════════════════════════════════════════════════ */
const gradShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const orbDrift = keyframes`
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(28px,-28px) scale(1.06); }
  66%      { transform: translate(-18px,16px) scale(0.95); }
`;
const scanY = keyframes`
  0%   { top: 0; opacity: 0.7; }
  100% { top: 100%; opacity: 0; }
`;
const twinkle = keyframes`
  0%,100% { opacity:0.2; transform:scale(0.85) rotate(0deg); }
  50%      { opacity:1;   transform:scale(1.2) rotate(15deg); }
`;
const roleSlide = keyframes`
  from { opacity:0; transform: translateY(8px); }
  to   { opacity:1; transform: translateY(0); }
`;
const btnPulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(14,57,149,0.4); }
  50%      { box-shadow: 0 0 0 10px rgba(14,57,149,0); }
`;

/* Icon paths inline */
const IcoMail = () => <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IcoLock = () => <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const IcoEye = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const IcoEyeOff = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;
const IcoArrow = () => <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>;

/* role config */
const ROLES = {
  candidate: {
    label: '',  // filled from translation
    color: '#2563eb',
    grad: 'linear-gradient(135deg, #0E3995, #2563eb, #3b82f6)',
    bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
    hero: {
      eyebrow: 'Chào mừng ứng viên',
      h1: ['Tìm việc', 'part-time', 'lý tưởng'],
      grad: ['#93c5fd', '#c4b5fd', '#fbcfe8'],
      sub: 'Đăng nhập để nhận gợi ý việc làm cá nhân hoá, theo dõi đơn ứng tuyển và kết nối với nhà tuyển dụng.',
      features: ['Hàng ngàn việc làm part-time đang chờ', 'Ứng tuyển 1-click — không cần CV rườm rà', 'Dashboard theo dõi trạng thái hồ sơ real-time'],
      stats: [{ n: '50K+', l: 'Ứng viên' }, { n: '12K+', l: 'Việc làm' }, { n: '98%', l: 'Hài lòng' }],
    },
  },
  employer: {
    label: '',
    color: '#2563eb',
    grad: 'linear-gradient(135deg, #0E3995, #2563eb, #3b82f6)',
    bg: 'linear-gradient(135deg, #f0f4ff, #dbeafe)',
    hero: {
      eyebrow: 'Dành cho nhà tuyển dụng',
      h1: ['Tuyển dụng', 'nhanh hơn', 'thông minh hơn'],
      grad: ['#60a5fa', '#a5f3fc', '#bfdbfe'],
      sub: 'Đăng nhập vào dashboard quản lý — xem hồ sơ ứng viên, đăng tin tuyển dụng và phân tích chiến dịch ngay.',
      features: ['Quản lý tin tuyển dụng tập trung', 'AI gợi ý ứng viên phù hợp nhất', 'Báo cáo & phân tích chiến dịch chi tiết'],
      stats: [{ n: '8K+', l: 'Doanh nghiệp' }, { n: '200K+', l: 'Hồ sơ' }, { n: '4.9⭐', l: 'Đánh giá' }],
    },
  },
  admin: {
    label: '',
    color: '#2563eb',
    grad: 'linear-gradient(135deg, #0E3995, #2563eb, #3b82f6)',
    bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
    hero: {
      eyebrow: 'Khu vực quản trị',
      h1: ['Quản trị', 'hệ thống', 'toàn diện'],
      grad: ['#c4b5fd', '#f9a8d4', '#fde68a'],
      sub: 'Truy cập bảng điều khiển quản trị với toàn quyền kiểm soát người dùng, phê duyệt và phân tích nền tảng.',
      features: ['Quản lý toàn bộ người dùng & doanh nghiệp', 'Phê duyệt nhà tuyển dụng & nội dung', 'Analytics & báo cáo doanh thu nền tảng'],
      stats: [{ n: '58K+', l: 'Users' }, { n: '8K+', l: 'Companies' }, { n: '99.9%', l: 'Uptime' }],
    },
  },
};

/* ═══════════════════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════════════════ */
const Root = styled.div`
  min-height: 100vh;
  display: flex;
  background: #f0f4ff;
  font-family: 'Inter', sans-serif !important;
  color-scheme: light;

  * {
    font-family: inherit !important;
  }
  overflow: hidden;
  position: relative;
`;

/* ── LEFT PANEL ── */
const Left = styled(motion.div)`
  width: 47%;
  min-height: 100vh;
  background: ${p => p.$grad};
  background-size: 220% 220%;
  animation: ${gradShift} 10s ease infinite;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 56px 52px;
  position: relative;
  overflow: hidden;
  transition: background 0.6s ease;

  @media (max-width: 960px) { display: none; }
`;

const DotGrid = styled.div`
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.11) 1px, transparent 1px);
  background-size: 26px 26px;
  pointer-events: none;
`;

const Orb = styled.div`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, ${p => p.$c} 0%, transparent 70%);
  width: ${p => p.$s}px; height: ${p => p.$s}px;
  top: ${p => p.$t || 'auto'}; left: ${p => p.$l || 'auto'};
  right: ${p => p.$r || 'auto'}; bottom: ${p => p.$b || 'auto'};
  animation: ${orbDrift} ${p => p.$dur}s ease-in-out infinite;
  animation-delay: ${p => p.$d || 0}s;
  pointer-events: none;
  filter: blur(${p => p.$blur || 0}px);
`;

const Scan = styled.div`
  position: absolute; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: ${scanY} 8s linear infinite;
  pointer-events: none;
`;

const Star = styled.div`
  position: absolute;
  color: rgba(255,255,255,0.75);
  font-size: ${p => p.$s || 14}px;
  top: ${p => p.$t}; left: ${p => p.$l};
  animation: ${twinkle} ${p => p.$dur || 3}s ease-in-out infinite;
  animation-delay: ${p => p.$d || 0}s;
  pointer-events: none;
`;

const BrandRow = styled.div`
  display: inline-flex;
  align-self: flex-start;
  align-items: center; justify-content: center;
  background: #ffffff;
  padding: 10px 24px;
  border-radius: 16px;
  margin-bottom: 44px; position: relative; z-index: 2;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
`;
const BrandImg = styled.img`
  height: 48px;
  object-fit: contain;
`;
const BrandTxt = styled.span`
  display: none;
`;

const HeroWrap = styled.div`
  position: relative; z-index: 2;
`;

const Eyebrow = styled.div`
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 999px; padding: 6px 14px;
  font-size: 11.5px; font-weight: 700;
  color: rgba(255,255,255,0.88);
  text-transform: uppercase; letter-spacing: 0.8px;
  margin-bottom: 20px;
`;

const HeroH1 = styled.h1`
  font-size: clamp(30px, 3.2vw, 44px);
  font-weight: 900; letter-spacing: -1.5px; line-height: 1.3;
  padding: 8px 0;
  color: #fff; margin-top: 16px; margin-bottom: 16px;

  .g {
    background: linear-gradient(90deg, ${p => p.$c1}, ${p => p.$c2}, ${p => p.$c3}, ${p => p.$c1});
    background-size: 300%;
    animation: ${gradShift} 5s ease infinite;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSub = styled.p`
  font-size: 14.5px; color: rgba(255,255,255,0.66);
  line-height: 1.75; max-width: 370px; margin-bottom: 32px;
`;

const FeatureList = styled.ul`
  list-style: none; padding: 0; margin: 0 0 36px;
  display: flex; flex-direction: column; gap: 13px;
`;
const FItem = styled.li`
  display: flex; align-items: center; gap: 11px;
  font-size: 14px; color: rgba(255,255,255,0.88); font-weight: 500;
  &::before {
    content: '✓';
    width: 22px; height: 22px; border-radius: 7px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; color: #fff;
    flex-shrink: 0;
  }
`;

const StatsRow = styled.div`
  display: flex; gap: 0;
  border-top: 1px solid rgba(255,255,255,0.12);
  padding-top: 28px;
`;
const Stat = styled.div`
  flex: 1; text-align: center;
  border-right: 1px solid rgba(255,255,255,0.1);
  &:last-child { border-right: none; }
  .n { font-size: 24px; font-weight: 900; color: #fff; letter-spacing: -1px; }
  .l { font-size: 10.5px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3px; }
`;

/* ── RIGHT PANEL ── */
const Right = styled.div`
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  padding: 40px 28px; position: relative; overflow-y: auto;

  &::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse at 18% 85%, rgba(14,57,149,0.07) 0%, transparent 50%),
      radial-gradient(ellipse at 82% 5%,  rgba(59,130,246,0.06) 0%, transparent 50%);
    pointer-events: none; z-index: 0;
  }
  @media (max-width: 960px) {
    background: ${p => p.$grad};
    background-size: 220% 220%;
    animation: ${gradShift} 10s ease infinite;
    &::before { display: none; }
  }
`;

const Card = styled(motion.div)`
  background: #fff; border-radius: 26px;
  padding: 38px 36px 32px; width: 100%; max-width: 430px;
  position: relative; z-index: 1;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(14,57,149,0.1), 0 28px 56px rgba(14,57,149,0.12);

  &::before {
    content: '';
    position: absolute; top: 0; left: 30px; right: 30px; height: 3px;
    background: ${p => p.$grad};
    border-radius: 0 0 4px 4px;
    transition: background 0.5s ease;
  }
`;

/* Card header */
const CardLogoRow = styled.div`
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px;
`;
const CLogoImg = styled.img` 
  height: 64px; 
  object-fit: contain; 
`;
const CLogoTxt = styled.span`
  display: none;
`;
const CardTitle = styled.h2`
  font-size: 20px; font-weight: 800; color: #0f172a;
  text-align: center; margin-bottom: 4px; letter-spacing: -0.4px;
`;
const CardSub = styled.p`
  font-size: 12.5px; color: #94a3b8; text-align: center; margin-bottom: 22px;
  a { color: #0E3995; font-weight: 700; text-decoration: none;
      &:hover { text-decoration: underline; } }
`;

<<<<<<< HEAD
/* Role tabs */
const RoleTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background: #f1f5f9;
  border-radius: 14px;
  padding: 4px;
  margin-bottom: 20px;
=======
const LoginRight = styled(motion.div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 1024px) {
    flex: 1;
    width: 100%;
  }
`;

const HeroContent = styled.div`
  max-width: 500px;
  
  h1 {
    font-size: 38px;
    font-weight: 800;
    margin-bottom: 16px;
    line-height: 1.2;
    letter-spacing: -1px;
  }
  
  p {
    font-size: 16px;
    opacity: 0.95;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  
  .features {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      
      svg {
        width: 20px;
        height: 20px;
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
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const FormHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;
  
  .logo-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 16px;
    
    img {
      height: 52px;
    }
    
    .logo-text {
      font-size: 26px;
      font-weight: 800;
      background: #002e9d;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 6px;
    color: #1E293B;
  }
  
  p {
    color: #64748B;
    font-size: 13px;
    
    a {
      color: #1e40af;
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
  gap: 10px;
  margin-bottom: 16px;
`;

const SocialButton = styled(motion.button)`
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  background: white;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #1E293B;
  
  &:hover {
    border-color: ${props => props.$color || '#1e40af'};
    background: ${props => props.$color ? `${props.$color}05` : '#1e40af05'};
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
  gap: 12px;
  margin: 16px 0;
  color: #64748B;
  font-size: 12px;
  font-weight: 500;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #E2E8F0;
  }
`;

const RoleSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 16px;
  padding: 5px;
  background: #F1F5F9;
  border-radius: 10px;
>>>>>>> 8ed761b33c0c943034121fbd278c350e649e5007
`;

const RoleTab = styled(motion.button)`
  padding: 10px 6px;
  border-radius: 11px;
  border: none;
  background: ${p => p.$on ? '#fff' : 'transparent'};
  color: ${p => p.$on ? p.$c : '#94a3b8'};
  font-weight: ${p => p.$on ? 700 : 600};
  font-size: 12.5px;
  cursor: pointer;
  font-family: inherit;
  display: flex; flex-direction: column;
  align-items: center; gap: 4px;
  transition: all 0.25s ease;
  box-shadow: ${p => p.$on ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'};

  .emoji { font-size: 17px; line-height: 1; transition: transform 0.25s; }
  &:hover .emoji { transform: scale(1.2) rotate(-5deg); }
`;

/* Social buttons */
const SocialRow = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-bottom: 14px;
`;
const SocialBtn = styled(motion.button)`
  padding: 10px 12px;
  border-radius: 11px; border: 1.5px solid #e8edf2;
  background: #fafafa; font-size: 12.5px; font-weight: 600;
  color: #334155; cursor: pointer; display: flex;
  align-items: center; justify-content: center; gap: 7px;
  font-family: inherit;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  &:hover {
<<<<<<< HEAD
    border-color: ${p => p.$c};
    background: ${p => p.$c}0a;
    box-shadow: 0 3px 10px ${p => p.$c}20;
=======
    color: #1e40af;
>>>>>>> 8ed761b33c0c943034121fbd278c350e649e5007
  }
`;

/* Divider */
const OrDiv = styled.div`
  display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  span { font-size: 11px; font-weight: 700; color: #d1d9e0;
    text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
  &::before, &::after { content: ''; flex: 1; height: 1px; background: #f0f4f8; }
`;

/* Floating input */
const FieldWrap = styled.div` position: relative; margin-bottom: 12px; `;
const FLabel = styled.label`
  position: absolute;
  left: ${p => p.$ic ? '44px' : '15px'};
  top: 50%; transform: translateY(-50%);
  font-size: 14px; color: #b8c4ce; font-weight: 500;
  pointer-events: none;
  transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
  background: transparent; line-height: 1;

  ${p => p.$up && css`
    top: 0; left: ${p.$ic ? '38px' : '12px'};
    font-size: 10px; font-weight: 700;
    color: ${p.$err ? '#ef4444' : p.$ac || '#0E3995'};
    background: #fff; padding: 0 4px;
    transform: translateY(-50%);
    text-transform: uppercase; letter-spacing: 0.5px;
  `}
`;
const FIconL = styled.div`
  position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
  pointer-events: none; display: flex;
  color: ${p => p.$on ? p.$c || '#0E3995' : '#c4cdd5'}; transition: color 0.22s;
`;
const FIconR = styled.button`
  position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; padding: 4px;
  display: flex; color: #b8c4ce; transition: color 0.2s;
  &:hover { color: ${p => p.$c || '#0E3995'}; }
`;
const FInput = styled.input`
  width: 100%; height: 50px;
  padding: ${p => p.$ic ? '14px 44px 0 44px' : '14px 15px 0 15px'};
  ${p => p.$ir && 'padding-right: 42px;'}
  font-size: 14px; font-weight: 600; font-family: inherit; color: #0f172a;
  border: 1.5px solid ${p => p.$err ? '#ef4444' : p.$on ? p.$ac || '#0E3995' : '#eaeff4'};
  border-radius: 12px;
  background: ${p => p.$on ? '#f8faff' : '#fafbfc'};
  outline: none;
  transition: border-color 0.22s, background 0.22s, box-shadow 0.22s;
  ${p => p.$on && !p.$err && css`box-shadow: 0 0 0 3px ${p.$ac || 'rgba(14,57,149,0.1)'};`}
  ${p => p.$err && css`box-shadow: 0 0 0 3px rgba(239,68,68,0.1);`}
  &::placeholder { color: transparent; }
`;
const FErr = styled.p`
  font-size: 11.5px; color: #ef4444; margin-top: 4px; font-weight: 500;
`;

/* Forgot */
const ForgotBtn = styled(Link)`
  display: block; text-align: right; font-size: 12px;
  font-weight: 700; color: ${p => p.$c || '#0E3995'}; text-decoration: none;
  margin-top: 5px; transition: color 0.2s;
  &:hover { text-decoration: underline; }
`;

/* Submit */
const SubmitBtn = styled(motion.button)`
  width: 100%; height: 52px; border: none; border-radius: 14px;
  background: ${p => p.$grad};
  background-size: 200%;
  animation: ${gradShift} 6s ease infinite;
  color: #fff; font-size: 15px; font-weight: 700; letter-spacing: -0.2px;
  cursor: pointer; font-family: inherit;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin-top: 14px; margin-bottom: 14px;
  position: relative; overflow: hidden;
  transition: box-shadow 0.25s;

  &::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    pointer-events: none;
  }
<<<<<<< HEAD
  &:hover { box-shadow: 0 8px 28px ${p => p.$shadow}; }

  svg { transition: transform 0.25s; }
  &:hover svg { transform: translateX(4px); }
`;

const FootRow = styled.div`
  display: flex; align-items: center; justify-content: center;
  gap: 20px;
`;
const FootNote = styled.p`
  font-size: 12px; color: #c0cad4; text-align: center;
  a { color: #0E3995; font-weight: 600; text-decoration: none;
      &:hover { text-decoration: underline; } }
`;

/* Floating label input component */
function FI({ id, name, type = 'text', label, value, onChange, error, iconL, iconR, onToggle, accent }) {
  const [focused, setFocused] = useState(false);
  const up = focused || !!value;
  return (
    <FieldWrap>
      {iconL && <FIconL $on={focused} $c={accent}>{iconL}</FIconL>}
      <FInput
        id={id} name={name} type={type}
        value={value} onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        $ic={!!iconL} $ir={!!iconR}
        $on={focused} $err={!!error} $ac={accent ? `${accent}22` : undefined}
        autoComplete="off"
      />
      <FLabel htmlFor={id} $up={up} $ic={!!iconL} $err={!!error} $ac={accent}>{label}</FLabel>
      {iconR && <FIconR type="button" onClick={onToggle} $c={accent}>{iconR}</FIconR>}
      {error && <FErr>{error}</FErr>}
    </FieldWrap>
  );
}
=======
  
  input {
    padding-left: 44px;
    background: #FFFFFF;
    color: #1E293B !important;
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
    color: #64748B;
    
    &:hover {
      color: #1e40af;
    }
    
    svg {
      position: relative;
      left: 0;
      top: 0;
      transform: none;
    }
  }
`;

const ForgotPassword = styled.span`
  color: #002e9d;
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
  margin-top: 8px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  margin-bottom: 0;
  background: #002e9d;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(30, 64, 175, 0.4);
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
>>>>>>> 8ed761b33c0c943034121fbd278c350e649e5007

/* Google SVG */
const GoogleSVG = () => (
  <svg viewBox="0 0 24 24" width="17" height="17">
    <path fill="#EA4335" d="M5.266 9.765C6.199 6.939 8.854 4.91 12 4.91c1.69 0 3.218.6 4.418 1.582l3.491-3.491C17.782 1.146 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z" />
    <path fill="#34A853" d="M16.04 18.013C14.951 18.716 13.566 19.09 12 19.09c-3.134 0-5.78-2.014-6.723-4.823l-4.04 3.067C3.193 21.294 7.265 24 12 24c2.933 0 5.735-1.043 7.834-3.001l-3.794-2.986z" />
    <path fill="#4A90E2" d="M19.834 21C22.03 18.952 23.455 15.904 23.455 12c0-.71-.091-1.472-.273-2.182H12v4.636h6.436c-.319 1.56-1.17 2.767-2.396 3.559L19.834 21z" />
    <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.91 12c0-.782.135-1.533.367-2.235L1.24 6.65A11.945 11.945 0 000 12c0 1.92.444 3.73 1.237 5.335l4.04-3.067z" />
  </svg>
);

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [role, setRole] = useState('candidate');
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* Sync i18n labels */
  ROLES.candidate.label = t.login.roleCandidate;
  ROLES.employer.label = t.login.roleEmployer;
  ROLES.admin.label = t.login.roleAdmin;

  useEffect(() => {
    const p = new URLSearchParams(location.search).get('role');
    if (p && ROLES[p]) setRole(p);
  }, [location.search]);

<<<<<<< HEAD
  const rc = ROLES[role];

  const onChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = t.login.requiredEmail;
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ';
    if (!form.password) e.password = t.login.requiredPassword;
    else if (form.password.length < 6) e.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    return e;
=======
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
    
    // Auto-detect admin role based on email
    if (e.target.name === 'email' && e.target.value.endsWith('@admin')) {
      setRole('admin');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (role === 'admin') {
      // Admin email validation
      if (!formData.email.endsWith('@admin')) {
        newErrors.email = 'Email admin phải có đuôi @admin';
      }
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      // Regular email validation for candidate/employer
      newErrors.email = 'Email không hợp lệ';
    }
    
    // Prevent non-admin from accessing admin
    if (formData.email.endsWith('@admin') && role !== 'admin') {
      setRole('admin');
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return newErrors;
>>>>>>> 8ed761b33c0c943034121fbd278c350e649e5007
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate

    login({ name: role === 'admin' ? 'Quản Trị Viên' : form.email.split('@')[0], email: form.email, role, approved: true });

    const sp = new URLSearchParams(location.search);
    const rd = sp.get('redirect');
    if (rd) {
      if ((role === 'candidate' && rd.startsWith('/candidate/')) ||
        (role === 'employer' && rd.startsWith('/employer/')) ||
        (role === 'admin' && rd.startsWith('/admin/'))) {
        navigate(rd); return;
      }
    }
    navigate(role === 'admin' ? '/admin/dashboard' : role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard');
  };

  const handleSocial = p => alert(`Đăng nhập bằng ${p} (đang phát triển)`);

  const panelVariants = {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <Root>
      {/* ══ LEFT PANEL ══ */}
      <AnimatePresence mode="wait">
        <Left
          key={role}
          $grad={rc.grad}
          variants={panelVariants}
          initial="initial"
          animate="animate"
        >
          <DotGrid />
          <Scan />
          <Orb $s={520} $t="-20%" $r="-14%" $c="rgba(255,255,255,0.18)" $dur={20} $blur={40} />
          <Orb $s={340} $b="-12%" $l="-8%" $c="rgba(255,255,255,0.12)" $dur={16} $d={-4} $blur={24} />
          <Orb $s={160} $t="46%" $l="10%" $c="rgba(255,255,255,0.1)" $dur={12} $d={-6} $blur={12} />
          <Star $s={14} $t="9%" $l="8%" $dur={2.6} $d={0}>✦</Star>
          <Star $s={10} $t="20%" $l="91%" $dur={3.8} $d={1}>✦</Star>
          <Star $s={8} $t="68%" $l="5%" $dur={4} $d={0.5}>✦</Star>
          <Star $s={12} $t="86%" $l="86%" $dur={2.4} $d={1.5}>✦</Star>
          <BrandRow>
            <BrandImg src="/images/logo.png" alt="Ốp Pờ" onError={e => { e.target.style.display = 'none'; }} />
          </BrandRow>

          <HeroWrap>
            <Eyebrow>{rc.hero.eyebrow}</Eyebrow>
            <HeroH1 $c1={rc.hero.grad[0]} $c2={rc.hero.grad[1]} $c3={rc.hero.grad[2]}>
              {rc.hero.h1[0]}<br />
              <span className="g">{rc.hero.h1[1]}</span><br />
              {rc.hero.h1[2]}
            </HeroH1>
            <HeroSub>{rc.hero.sub}</HeroSub>
            <FeatureList>
              {rc.hero.features.map((f, i) => <FItem key={i}>{f}</FItem>)}
            </FeatureList>
            <StatsRow>
              {rc.hero.stats.map(s => (
                <Stat key={s.l}>
                  <div className="n">{s.n}</div>
                  <div className="l">{s.l}</div>
                </Stat>
              ))}
            </StatsRow>
          </HeroWrap>
        </Left>
      </AnimatePresence>

      {/* ══ RIGHT PANEL ══ */}
      <Right $grad={rc.grad}>
        <Card
          key="card"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          $grad={rc.grad}
        >
          {/* Header */}
          <CardLogoRow>
            <CLogoImg src="/images/logo.png" alt="Ốp Pờ" onError={e=>{e.target.style.display='none';}} />
          </CardLogoRow>
          <CardTitle>Đăng nhập</CardTitle>
          <CardSub>
            {t.login.newUser}{' '}
            <Link to="/register">{t.login.createAccount}</Link>
          </CardSub>

          {/* Role tabs */}
          <RoleTabs>
            {Object.entries(ROLES).map(([key, r]) => (
              <RoleTab
                key={key}
                type="button"
                $on={role === key}
                $c={r.color}
                onClick={() => { setRole(key); setErrors({}); }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="emoji">{r.emoji}</span>
                {r.label}
              </RoleTab>
            ))}
          </RoleTabs>

          {/* Social — only for candidate & employer */}
          {role !== 'admin' && (
            <>
              <SocialRow>
                <SocialBtn type="button" $c="#EA4335"
                  onClick={() => handleSocial('Google')}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <GoogleSVG /> Google
                </SocialBtn>
                <SocialBtn type="button" $c="#1877F2"
                  onClick={() => handleSocial('Facebook')}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </SocialBtn>
              </SocialRow>
              <OrDiv><span>hoặc đăng nhập bằng email</span></OrDiv>
            </>
          )}

          {/* Admin notice */}
          {role === 'admin' && (
            <div style={{
              background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
              border: '1px solid #c4b5fd',
              borderRadius: 12, padding: '12px 14px',
              marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>🛡️</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#7c3aed' }}>Khu vực quản trị</div>
                <div style={{ fontSize: 11.5, color: '#8b5cf6', marginTop: 2 }}>Chỉ dành cho tài khoản được cấp quyền Admin</div>
              </div>
            </div>
          )}

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={role}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <FI
                id="email" name="email" type="email"
                label={`${t.login.email} *`}
                value={form.email} onChange={onChange}
                error={errors.email}
                iconL={<IcoMail />}
                accent={rc.color}
              />

              <FI
                id="password" name="password"
                type={showPw ? 'text' : 'password'}
                label={`${t.login.password} *`}
                value={form.password} onChange={onChange}
                error={errors.password}
                iconL={<IcoLock />}
                iconR={showPw ? <IcoEyeOff /> : <IcoEye />}
                onToggle={() => setShowPw(p => !p)}
                accent={rc.color}
              />

<<<<<<< HEAD
              <ForgotBtn to="/forgot-password" $c={rc.color}>
                {t.login.forgotPassword}
              </ForgotBtn>
=======
          <RoleSelector>
            <RoleButton
              type="button"
              $selected={role === 'candidate'}
              onClick={() => setRole('candidate')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.login.roleCandidate}
            </RoleButton>
            <RoleButton
              type="button"
              $selected={role === 'employer'}
              onClick={() => setRole('employer')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.login.roleEmployer}
            </RoleButton>
            {/* Admin tab hidden - auto-detected via @admin email */}
          </RoleSelector>
>>>>>>> 8ed761b33c0c943034121fbd278c350e649e5007

              <SubmitBtn
                type="submit"
                $grad={rc.grad}
                $shadow={`${rc.color}55`}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                    style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                ) : (
                  <>{t.login.signIn} <IcoArrow /></>
                )}
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </SubmitBtn>
            </motion.form>
          </AnimatePresence>

<<<<<<< HEAD
          <FootRow>
            <FootNote>
              <Link to="/">← Về trang chủ</Link>
            </FootNote>
            <span style={{ color: '#e2e8f0', fontSize: 12 }}>|</span>
            <FootNote>
              <a href="#">Gặp sự cố?</a>
            </FootNote>
          </FootRow>
        </Card>
      </Right>
    </Root>
=======
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
              <ForgotPassword onClick={() => alert('Chức năng đang phát triển')}>Quên mật khẩu?</ForgotPassword>
            </FormGroup>

            <SubmitButton type="submit" $variant="primary" $fullWidth $size="large">
              Đăng Nhập
              <ArrowRight />
            </SubmitButton>
          </form>
        </LoginForm>
      </LoginRight>
    </LoginContainer>
>>>>>>> 8ed761b33c0c943034121fbd278c350e649e5007
  );
};

export default LoginPage;
