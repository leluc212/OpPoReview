import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Building2, Users, TrendingUp, ArrowRight, Sparkles, Globe, ChevronDown, Bookmark, FileText, ThumbsUp, Star, Upload, BookOpen, Edit3, Folder, Package, Heart, UserPlus, Shield, MessageCircle, Headphones } from 'lucide-react';
import { Button } from '../../components/FormElements';

const LandingContainer = styled.div`
  min-height: 80vh;
  background: #e3e7e9;
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: 'OP PO';
    position: absolute;
    top: 56%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 550px;
    font-weight: 900;
    line-height: 1;
    color: transparent;
    background: linear-gradient(
      135deg,
      #1a62ff 0%,
      #1a62ff 20%,
      #002e9d 20%,
      #002e9d 40%,
      #1a62ff 40%,
      #1a62ff 60%,
      #002e9d 60%,
      #002e9d 80%,
      #1a62ff 80%,
      #1a62ff 100%
    );
    background-size: 300px 300px;
    -webkit-background-clip: text;
    background-clip: text;
    opacity: 0.08;
    pointer-events: none;
    z-index: 0;
    white-space: nowrap;
  }
`;

const Header = styled(motion.header)`
  padding: 4px 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(146, 217, 248, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 24px #a4ddf8
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 900;
  color: #002e9d;
  text-decoration: none;
  letter-spacing: -0.5px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: scale(1.05);
    color: #002e9d;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  
  a {
    color: #000000;
    font-weight: 700;
    font-size: 15px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      color: #0EA5E9;
      transform: translateY(-2px);
    }
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #000000;
  font-weight: 700;
  font-size: 15px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    color: #0EA5E9;
    background: rgba(14, 165, 233, 0.05);
  }
  
  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(147, 197, 253, 0.25), 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 8px;
  min-width: 220px;
  z-index: 1000;
  border: 1px solid rgba(147, 197, 253, 0.3);
`;

const LargeDropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(147, 197, 253, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 16px;
  min-width: 800px;
  z-index: 1000;
  border: 1px solid rgba(147, 197, 253, 0.3);
  display: flex;
  gap: 20px;
`;

const DropdownSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DropdownSectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  padding: 0 8px;
`;

const GreenSectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: #002e9d;
  margin-bottom: 6px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const CVTemplateItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  color: #475569;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(14, 165, 233, 0.06);
    color: #0EA5E9;
    transform: translateX(2px);
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: #64748B;
  }
  
  &:hover svg {
    color: #0EA5E9;
  }
`;

const DropdownLeftColumn = styled.div`
  flex-shrink: 0;
  width: 200px;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  padding-right: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DropdownRightColumn = styled.div`
  flex: 1;
`;

const JobCategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  margin-top: 6px;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 6px 15px;
  color: #0F172A;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 6px;
  
  &:hover {
    background: rgba(14, 165, 233, 0.08);
    color: #0EA5E9;
    transform: translateX(4px);
  }
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: #64748B;
  }
  
  &:hover svg {
    color: #0EA5E9;
  }
`;

const JobCategoryItem = styled(Link)`
  display: block;
  padding: 7px 12px;
  color: #475569;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(14, 165, 233, 0.06);
    color: #0EA5E9;
    transform: translateX(2px);
  }
`;

const ProBadge = styled.span`
  background: linear-gradient(135deg, #FFA500, #FF8C00);
  color: white;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const LanguageToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(147, 197, 253, 0.4);
  border-radius: 10px;
  color: #000000;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(15px);
  box-shadow: 0 4px 16px rgba(147, 197, 253, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    border-color: #0EA5E9;
    color: #0EA5E9;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.3);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const HeroSection = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: 100px 50px 100px;
  text-align: center;
  position: relative;
  min-height: 95vh;
  display: flex;
  align-items: top;
  justify-content: center;
`;

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: #002e9d;
  
  &::after {
    content: '';
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(26, 98, 255, 0) 0%,
      rgba(26, 98, 255, 0.3) 50%,
      rgba(26, 98, 255, 0) 100%
    );
    animation: moveDown 8s ease-in-out infinite;
  }
  
  @keyframes moveDown {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(200%);
    }
    100% {
      transform: translateY(0);
    }
  }
  
  @keyframes gradientShift {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.3;
    }
    50% {
      transform: translate(-5%, -5%) scale(1.05);
      opacity: 0.25;
    }
  }
  
  @keyframes glowPulse {
    0%, 100% {
      opacity: 0.4;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(20px, -20px);
    }
  }
`;

const GradientGlow = styled(motion.div)`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(147, 197, 253, 0.25) 0%, rgba(251, 207, 232, 0.2) 30%, transparent 70%);
  filter: blur(60px);
  animation: glowPulse 8s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
`;

const GradientBlob = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  will-change: transform;
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
`;

const GlassmorphismLayer = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 50%, 
    rgba(255, 255, 255, 0.1) 100%);
  backdrop-filter: blur(1px);
  z-index: 3;
  pointer-events: none;
`;

const NoiseTexture = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.03;
  z-index: 2;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
`;

const AuroraLayer = styled(motion.div)`
  position: absolute;
  inset: -20%;
  background: 
    radial-gradient(circle at 25% 25%, rgba(147, 197, 253, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(251, 207, 232, 0.25) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(253, 242, 248, 0.2) 0%, transparent 60%);
  filter: blur(100px);
  opacity: 0.7;
  animation: auroraDrift 25s ease-in-out infinite alternate;
  will-change: transform;
  z-index: 0;

  @keyframes auroraDrift {
    0% {
      transform: rotate(-2deg) scale(1) translate(0, 0);
    }
    100% {
      transform: rotate(2deg) scale(1.08) translate(-3%, -2%);
    }
  }
`;

const StarLayer = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
`;

const Particle = styled(motion.span)`
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.2) 50%, transparent 70%);
  border-radius: 50%;
  opacity: 0.8;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.3);
`;

const FloatingShape = styled(motion.div)`
  position: absolute;
  background: ${props => props.gradient || 'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(37, 99, 235, 0.2))'};
  opacity: ${props => props.opacity || 0.15};
  border-radius: ${props => props.rounded ? '50%' : '40%'};
  filter: blur(${props => props.blur || '80'}px);
  z-index: 1;
  will-change: transform, opacity;
  animation: ${props => props.float ? 'float 20s ease-in-out infinite' : 'none'};
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 56px;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 24px;
  color: #ffffff;
  font-family: 'Bricolage Grotesque', sans-serif;
  letter-spacing: -2px;
  white-space: nowrap;
  
  span {
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  
  @media (max-width: 1200px) {
    font-size: 48px;
    white-space: normal;
  }
  
  @media (max-width: 768px) {
    font-size: 36px;
    white-space: normal;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 20px;
  color: #ffffff;
  font-family: 'Bricolage Grotesque', sans-serif;
  margin-bottom: 48px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-weight: 600;
  opacity: 0.9;
  
  span {
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const SearchContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto 40px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px);
  border: 2px solid rgba(147, 197, 253, 0.4);
  padding: 12px;
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(147, 197, 253, 0.25), 0 4px 16px rgba(251, 207, 232, 0.2);
  display: flex;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    box-shadow: 0 16px 64px rgba(147, 197, 253, 0.3), 0 8px 24px rgba(251, 207, 232, 0.25);
    border-color: #0EA5E9;
    transform: translateY(-3px);
  }
`;

const SearchInput = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  border: 2px solid rgba(147, 197, 253, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus-within {
    background: rgba(255, 255, 255, 1);
    border-color: #0EA5E9;
    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15), 0 4px 12px rgba(14, 165, 233, 0.2);
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: #0EA5E9;
  }
  
  input {
    flex: 1;
    border: none;
    background: none;
    font-size: 15px;
    color: #0F172A;
    font-weight: 500;
    
    &::placeholder {
      color: #64748B;
      font-weight: 500;
    }
    
    &:focus {
      outline: none;
    }
  }
`;

const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  margin: 20px auto 0;
  max-width: 1200px;
  padding: 0px 20px;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const MascotImage = styled.img`
  width: auto;
  height: 350px;
  object-fit: contain;
  mix-blend-mode: multiply;
  filter: contrast(1.1) brightness(1.05);
  flex-shrink: 0;
  
  @media (max-width: 968px) {
    height: 350px;
  }
`;

const MainBanner = styled.img`
  width: 700px;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(147, 197, 253, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
  
  @media (max-width: 968px) {
    width: 100%;
    max-width: 500px;
  }
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const CompaniesSection = styled.section`
  max-width: 1440px;
  margin: 0 auto;
  padding: 100px 80px;
  text-align: center;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
`;

const LogosGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 64px;
  flex-wrap: wrap;
`;

const CompanyLogo = styled(motion.div)`
  width: 200px;
  height: 100px;
  background: #FFFFFF;
  border: 1px solid rgba(147, 197, 253, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 24px;
  color: #64748B;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(147, 197, 253, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(147, 197, 253, 0.2), 0 2px 8px rgba(251, 207, 232, 0.15);
    border-color: #0EA5E9;
    color: #0EA5E9;
  }
`;

const CategoriesSection = styled.section`
  max-width: 1440px;
  margin: 0 auto;
  padding: 120px 80px;
  position: relative;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 48px;
`;

const CategoryCard = styled(motion.div)`
  background: #FFFFFF;
  padding: 32px 24px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border-color: rgba(37, 99, 235, 0.2);
  }
`;

const CategoryIcon = styled.div`
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #2563EB, #1E40AF);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  svg {
    width: 28px;
    height: 28px;
  }
  
  ${CategoryCard}:hover & {
    transform: scale(1.1);
  }
`;

const CategoryTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #0F172A;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${CategoryCard}:hover & {
    color: #2563EB;
  }
`;

const CategoryCount = styled.p`
  font-size: 14px;
  color: #64748B;
  font-weight: 400;
`;

const CTASection = styled.section`
  max-width: 1440px;
  margin: 0 auto;
  padding: 100px 80px;
`;

const CTACard = styled(motion.div)`
  background: linear-gradient(135deg, #dceaf9 0%, #ffffffb3 100%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 80px 60px;
  border-radius: 24px;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
`;

const CTATitle = styled.h2`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #0F172A;
  letter-spacing: -1px;
`;

const CTAText = styled.p`
  font-size: 18px;
  color: #64748B;
  margin-bottom: 32px;
  font-weight: 400;
`;

const Footer = styled.footer`
  background: #F8FAFC;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 64px 80px 32px;
  max-width: 1440px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 64px;
  margin-bottom: 48px;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #0F172A;
  }
  
  p {
    color: #64748B;
    margin-bottom: 12px;
    line-height: 1.6;
    font-size: 14px;
  }
  
  a {
    display: block;
    color: #64748B;
    margin-bottom: 12px;
    transition: all 0.3s ease;
    font-size: 14px;
    
    &:hover {
      color: #2563EB;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  color: #94A3B8;
  font-size: 14px;
`;

const StickyColumn = styled.div`
  position: fixed;
  right: 20px;
  top: 550px;
  transform: translateY(-50%);
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const StickyIconButton = styled(motion.a)`
  width: 46px;
  height: 46px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(147, 197, 253, 0.4);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #0EA5E9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(147, 197, 253, 0.15);
  text-decoration: none;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    border-color: #0EA5E9;
    transform: translateX(-8px) scale(1.05);
    box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
    
    &::after {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  &::after {
    content: attr(data-tooltip);
    position: absolute;
    right: calc(100% + 16px);
    background: rgba(15, 23, 42, 0.95);
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #EF4444, #DC2626);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  border: 2px solid white;
  min-width: 18px;
  text-align: center;
`;

const SectionHeading = styled(motion.div)`
  text-align: center;
  margin-bottom: 48px;
  
  h2 {
    font-size: 48px;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 12px;
    letter-spacing: -1px;
    line-height: 1.2;
  }
  
  p {
    font-size: 18px;
    color: #64748B;
    font-weight: 400;
  }
`;

const CompanyBannerSection = styled.section`
  background: linear-gradient(135deg, #F0F465 0%, #E8ED6F 50%, #C8D45A 100%);
  padding: 60px 80px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const CompanyBannerContent = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const CompanyBannerTitle = styled(motion.h2)`
  text-align: center;
  font-size: 42px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 50px;
  line-height: 1.3;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 30px;
  }
`;

const LogoCarouselWrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100px;
    z-index: 2;
    pointer-events: none;
  }
  
  &::before {
    left: 0;
    background: linear-gradient(to right, rgba(240, 244, 101, 1), rgba(240, 244, 101, 0));
  }
  
  &::after {
    right: 0;
    background: linear-gradient(to left, rgba(240, 244, 101, 1), rgba(240, 244, 101, 0));
  }
`;

const LogoCarousel = styled(motion.div)`
  display: flex;
  gap: 60px;
  align-items: center;
  width: fit-content;
`;

const BannerCompanyLogo = styled.div`
  background: white;
  padding: 16px 32px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  height: 80px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  img {
    max-width: 140px;
    max-height: 50px;
    object-fit: contain;
  }
`;

const particleConfigs = [
  { top: '8%', left: '15%', duration: 16, delay: 0 },
  { top: '22%', left: '78%', duration: 19, delay: 1.2 },
  { top: '35%', left: '42%', duration: 18, delay: 0.8 },
  { top: '48%', left: '68%', duration: 21, delay: 1.8 },
  { top: '62%', left: '25%', duration: 17, delay: 2.4 },
  { top: '75%', left: '55%', duration: 20, delay: 1.5 },
  { top: '18%', left: '88%', duration: 22, delay: 0.5 },
  { top: '85%', left: '12%', duration: 19, delay: 2.1 },
  { top: '42%', left: '8%', duration: 18, delay: 1.1 },
  { top: '68%', left: '82%', duration: 20, delay: 2.8 },
];

const companyLogos = [
  { name: 'F88', logo: 'F88' },
  { name: 'HOME CREDIT', logo: 'HOME CREDIT' },
  { name: 'MAERSK', logo: 'MAERSK' },
  { name: 'Masan', logo: 'Masan' },
  { name: 'MB', logo: 'MB' },
  { name: 'TECHCOMBANK', logo: 'TECHCOMBANK' },
  { name: 'THACO AUTO', logo: 'THACO AUTO' },
  { name: 'Vinamilk', logo: 'Vinamilk' },
  { name: 'VNPAY', logo: 'VNPAY' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('vi');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  
  const jobDropdownRef = useRef(null);
  const companyDropdownRef = useRef(null);

  const fullTitle = 'Tìm việc & Tuyển Dụng Nhanh Hơn';
  const fullSubtitle = 'Kết nối Ứng viên với cơ hội. Nền tảng tuyển dụng hiện đại.';

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  // Typewriter effect
  useEffect(() => {
    let titleIndex = 0;
    let subtitleIndex = 0;
    
    // Type title first
    const titleInterval = setInterval(() => {
      if (titleIndex < fullTitle.length) {
        setTitleText(fullTitle.substring(0, titleIndex + 1));
        titleIndex++;
      } else {
        clearInterval(titleInterval);
        // Start subtitle after title is done
        const subtitleInterval = setInterval(() => {
          if (subtitleIndex < fullSubtitle.length) {
            setSubtitleText(fullSubtitle.substring(0, subtitleIndex + 1));
            subtitleIndex++;
          } else {
            clearInterval(subtitleInterval);
            setShowCursor(false);
          }
        }, 50);
      }
    }, 80);

    return () => {
      clearInterval(titleInterval);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (jobDropdownRef.current && !jobDropdownRef.current.contains(event.target)) {
        setIsJobDropdownOpen(false);
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
        setIsCompanyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <LandingContainer>
      <StickyColumn>
        <StickyIconButton
          as={Link}
          to="/candidate/saved-jobs"
          data-tooltip="Việc làm đã lưu"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <Heart />
        </StickyIconButton>
        
        <StickyIconButton
          as={Link}
          to="/register"
          data-tooltip="Đăng ký"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <UserPlus />
        </StickyIconButton>
        
        <StickyIconButton
          as={Link}
          to="/login"
          data-tooltip="Đăng nhập an toàn"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <Shield />
        </StickyIconButton>
        
        <StickyIconButton
          href="#"
          data-tooltip="Góp ý"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <MessageCircle />
          <NotificationBadge>3</NotificationBadge>
        </StickyIconButton>
        
        <StickyIconButton
          href="#"
          data-tooltip="Hỗ trợ"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          <Headphones />
        </StickyIconButton>
      </StickyColumn>
      
      <Header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <LeftSection>
          <Logo to="/">
            <img src="/images/logo.png" alt="Ốp Pờ" style={{ height: '60px', marginRight: '5px' }} />
            Ốp Pờ
          </Logo>
          <NavLinks>
          <DropdownContainer ref={jobDropdownRef}>
            <DropdownButton
              onClick={() => setIsJobDropdownOpen(!isJobDropdownOpen)}
              $isOpen={isJobDropdownOpen}
            >
              Việc làm
              <ChevronDown />
            </DropdownButton>
            {isJobDropdownOpen && (
              <LargeDropdownMenu
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownLeftColumn>
                  <DropdownSection>
                    <GreenSectionTitle>
                      Việc làm
                      <ArrowRight />
                    </GreenSectionTitle>
                    <CVTemplateItem to="/candidate/jobs">
                      <Search />
                      Tìm việc làm
                    </CVTemplateItem>
                    <CVTemplateItem to="/candidate/saved-jobs">
                      <Bookmark />
                      Việc làm đã lưu
                    </CVTemplateItem>
                    <CVTemplateItem to="/candidate/applications">
                      <FileText />
                      Việc làm đã ứng tuyển
                    </CVTemplateItem>
                    <CVTemplateItem to="/candidate/jobs?recommended=true">
                      <ThumbsUp />
                      Việc làm phù hợp
                    </CVTemplateItem>
                  </DropdownSection>
                  
                  <DropdownSection>
                    <GreenSectionTitle>
                      Nhà tuyển dụng
                      <ArrowRight />
                    </GreenSectionTitle>
                    <CVTemplateItem to="/companies">
                      <Building2 />
                      Danh sách nhà tuyển dụng
                    </CVTemplateItem>
                    <CVTemplateItem to="/companies/top-companies">
                      <Star />
                      Nhà tuyển dụng
                    </CVTemplateItem>
                  </DropdownSection>
                </DropdownLeftColumn>
                
                <DropdownRightColumn>
                  <GreenSectionTitle>
                    Việc làm theo vị trí
                    <ArrowRight />
                  </GreenSectionTitle>
                  <JobCategoriesGrid>
                    <JobCategoryItem to="/candidate/jobs?category=sales">Nhân viên pha chế</JobCategoryItem>
                    <JobCategoryItem to="/candidate/jobs?category=labor">Nhân viên thu ngân</JobCategoryItem>
                    <JobCategoryItem to="/candidate/jobs?category=accountant">Nhân viên phụ bếp</JobCategoryItem>
                    <JobCategoryItem to="/candidate/jobs?type=senior">Nhân viên phục vụ</JobCategoryItem>
                    <JobCategoryItem to="/candidate/jobs?category=marketing">Nhân viên kho</JobCategoryItem>
                    <JobCategoryItem to="/candidate/jobs?category=engineer">Nhân viên kỹ thuật</JobCategoryItem>
                  </JobCategoriesGrid>
                </DropdownRightColumn>
              </LargeDropdownMenu>
            )}
          </DropdownContainer>
          
          <DropdownContainer ref={companyDropdownRef}>
            <DropdownButton
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              $isOpen={isCompanyDropdownOpen}
            >
              Tạo CV
              <ChevronDown />
            </DropdownButton>
            {isCompanyDropdownOpen && (
              <LargeDropdownMenu
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownLeftColumn>
                  <DropdownSection>
                    <GreenSectionTitle>
                      Mẫu CV theo style
                      <ArrowRight />
                    </GreenSectionTitle>
                    <CVTemplateItem to="/cv/templates/simple">
                      <Package />
                      Mẫu CV Đơn giản
                    </CVTemplateItem>
                    <CVTemplateItem to="/cv/templates/impressive">
                      <Star />
                      Mẫu CV Ấn tượng
                    </CVTemplateItem>
                  </DropdownSection>
                  
                  <DropdownSection>
                    <GreenSectionTitle>
                      Tạo CV bằng AI
                      <ArrowRight />
                    </GreenSectionTitle>
                    <CVTemplateItem to="/cv/templates/sales">
                      <Briefcase />
                      Nhân viên pha chế
                    </CVTemplateItem>
                    <CVTemplateItem to="/cv/templates/programmer">
                      <Briefcase />
                      Lập trình viên
                    </CVTemplateItem>
                    <CVTemplateItem to="/cv/templates/accountant">
                      <Briefcase />
                      Nhân viên kế toán
                    </CVTemplateItem>
                    <CVTemplateItem to="/cv/templates/marketing">
                      <Briefcase />
                      Chuyên viên marketing
                    </CVTemplateItem>
                  </DropdownSection>
                </DropdownLeftColumn>
                
                <DropdownRightColumn>
                  <DropdownSection>
                    <DropdownItem to="/candidate/cv/manage">
                      <Folder />
                      Quản lý CV
                    </DropdownItem>
                    <DropdownItem to="/candidate/cv/upload">
                      <Upload />
                      Tải CV lên
                    </DropdownItem>
                    <DropdownItem to="/candidate/cover-letter/manage">
                      <Edit3 />
                      Quản lý Cover Letter
                    </DropdownItem>
                    <DropdownItem to="/cover-letter/templates">
                      <FileText />
                      Mẫu Cover Letter
                    </DropdownItem>
                  </DropdownSection>
                </DropdownRightColumn>
              </LargeDropdownMenu>
            )}
          </DropdownContainer>
          </NavLinks>
        </LeftSection>
        
        <RightSection>
          <LanguageToggle onClick={toggleLanguage}>
            <Globe />
            {language === 'vi' ? 'VI' : 'EN'}
          </LanguageToggle>
          <Button as={Link} to="/login" $variant="primary" $size="small">
            Đăng Nhập
          </Button>
          <Button as={Link} to="/register" $variant="primary" $size="small">
            Đăng Ký
          </Button>
        </RightSection>
      </Header>

      <HeroSection>
        <AnimatedBackground>
          {/* Aurora ambient light layer */}
          <AuroraLayer />
          
          {/* Grid pattern */}
          <GridPattern />
          
          {/* Noise texture for premium feel */}
          <NoiseTexture />
          
          {/* Central gradient glow behind hero text */}
          <GradientGlow
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          
          {/* Large gradient blobs - premium floating shapes */}
          <GradientBlob
            rounded
            opacity={0.25}
            blur={100}
            animate={{
              x: [0, 80, 0],
              y: [0, -60, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '600px',
              height: '600px',
              top: '5%',
              left: '-5%',
              background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.2))',
            }}
          />
          
          <GradientBlob
            rounded
            opacity={0.2}
            blur={120}
            animate={{
              x: [0, -70, 0],
              y: [0, 80, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 26,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '700px',
              height: '700px',
              top: '40%',
              right: '-10%',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(30, 64, 175, 0.15))',
            }}
          />
          
          <GradientBlob
            rounded
            opacity={0.18}
            blur={90}
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '500px',
              height: '500px',
              bottom: '5%',
              left: '25%',
              background: 'linear-gradient(135deg, rgba(147, 197, 253, 0.3), rgba(96, 165, 250, 0.2))',
            }}
          />
          
          {/* Smaller accent blobs */}
          <GradientBlob
            rounded
            opacity={0.22}
            blur={70}
            float
            style={{
              width: '350px',
              height: '350px',
              top: '15%',
              right: '20%',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.15))',
            }}
          />
          
          <GradientBlob
            rounded
            opacity={0.2}
            blur={80}
            float
            style={{
              width: '400px',
              height: '400px',
              bottom: '15%',
              right: '35%',
              background: 'radial-gradient(circle, rgba(96, 165, 250, 0.28), rgba(59, 130, 246, 0.12))',
            }}
          />
          
          {/* Floating particles */}
          {particleConfigs.map((particle, index) => (
            <Particle
              key={`particle-${index}`}
              style={{
                top: particle.top,
                left: particle.left,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 15, 0],
                opacity: [0.3, 0.8, 0.4],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: particle.delay,
              }}
            />
          ))}
          
          {/* Glassmorphism overlay */}
          <GlassmorphismLayer />
        </AnimatedBackground>
        
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {titleText}
            {showCursor && titleText.length < fullTitle.length && <span style={{ opacity: 0.7 }}>|</span>}
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitleText}
            {showCursor && subtitleText.length > 0 && subtitleText.length < fullSubtitle.length && <span style={{ opacity: 0.7 }}>|</span>}
          </HeroSubtitle>

          <SearchContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SearchInput>
              <Search />
              <input
                type="text"
                placeholder="Vị trí công việc hoặc từ khóa"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchInput>
          
          <SearchInput>
            <MapPin />
            <input
              type="text"
              placeholder="Địa điểm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </SearchInput>
          
          <Button $variant="primary" onClick={() => navigate('/candidate/jobs')}>
            Tìm việc
          </Button>
        </SearchContainer>
        
        <BannerContainer>
          <MascotImage
            src="/images/mascot.png"
            alt="Mascot"
          />
          <MainBanner
            src="/images/banner2.png"
            alt="Banner"
          />
        </BannerContainer>
        </HeroContent>
      </HeroSection>

      <CompanyBannerSection>
        <CompanyBannerContent>
          <CompanyBannerTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Nhiều doanh nghiệp đang tìm "tân binh" giỏi – giống bạn đó!
          </CompanyBannerTitle>
          
          <LogoCarouselWrapper>
            <LogoCarousel
              animate={{
                x: [0, -1800],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {[...companyLogos, ...companyLogos, ...companyLogos].map((company, index) => (
                <BannerCompanyLogo key={`${company.name}-${index}`}>
                  <span style={{ 
                    fontSize: '20px', 
                    fontWeight: '700',
                    color: '#1F2937',
                    whiteSpace: 'nowrap'
                  }}>
                    {company.logo}
                  </span>
                </BannerCompanyLogo>
              ))}
            </LogoCarousel>
          </LogoCarouselWrapper>
        </CompanyBannerContent>
      </CompanyBannerSection>

      <CTASection>
        <CTACard
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CTATitle>Sẵn Sàng Tuyển Ứng viên Hàng Đầu?</CTATitle>
          <CTAText>
            Đăng công việc và kết nối với ứng viên chất lượng ngay hôm nay
          </CTAText>
          <Button 
            as={Link} 
            to="/register/employer" 
            $variant="secondary" 
            $size="large" 
            style={{ 
              background: 'white', 
              color: '#0E3995', 
              position: 'relative',
              zIndex: 2,
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)'
            }}
          >
            Bắt Đầu Miễn Phí
            <ArrowRight />
          </Button>
        </CTACard>
      </CTASection>

      <Footer>
        <FooterGrid>
          <FooterSection>
            <h3>Ốp Pờ</h3>
            <p>Ốp Pờ là nền tảng tuyển dụng hiện đại giúp kết nối nhà tuyển dụng với ứng viên tài năng.</p>
          </FooterSection>
          
          <FooterSection>
            <h3>Dành Cho Ứng Viên</h3>
          </FooterSection>
          
          <FooterSection>
            <h3>Dành Cho Nhà Tuyển Dụng</h3>
          </FooterSection>
          
          <FooterSection>
            <h3>Hỗ Trợ</h3>
          </FooterSection>
        </FooterGrid>
        
        <Copyright>
          © 2026 Ốp Pờ. Tất cả quyền được bảo lưu.
        </Copyright>
      </Footer>
    </LandingContainer>
  );
};

export default LandingPage;
