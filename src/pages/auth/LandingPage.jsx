import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Building2, Users, TrendingUp, ArrowRight, Sparkles, Globe } from 'lucide-react';
import { Button } from '../../components/FormElements';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../locales/translations';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow-x: hidden;
`;

const Header = styled(motion.header)`
  padding: 24px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(14, 57, 149, 0.15);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: 30px;
  font-weight: 800;
  background: linear-gradient(135deg, #0E3995 0%, #0055A5 50%, #0D3880 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(14, 57, 149, 0.35), 0 10px 40px rgba(0, 85, 165, 0.3);
  letter-spacing: -0.5px;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  
  a {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    font-size: 15px;
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
      color: #fff;
      text-shadow: 0 0 20px rgba(14, 57, 149, 0.6);
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #0E3995, #0055A5);
      transition: width 0.3s ease;
    }
    
    &:hover::after {
      width: 100%;
    }
  }
`;

const LanguageToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(14, 57, 149, 0.4);
    color: #fff;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const HeroSection = styled.section`
  max-width: 1440px;
  margin: 0 auto;
  padding: 200px 80px 150px;
  margin-top: 72px;
  text-align: center;
  position: relative;
  overflow: hidden;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(14, 57, 149, 0.25) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(0, 85, 165, 0.22) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(13, 56, 128, 0.15) 0%, transparent 50%);
    animation: gradientShift 20s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(14, 57, 149, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(14, 57, 149, 0.04) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridMove 30s linear infinite;
  }
  
  @keyframes gradientShift {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(-10%, -10%) rotate(180deg);
    }
  }
  
  @keyframes gridMove {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(50px, 50px);
    }
  }
`;

const AuroraLayer = styled(motion.div)`
  position: absolute;
  inset: -30%;
  background: conic-gradient(from 120deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.16), rgba(236, 72, 153, 0.16), rgba(99, 102, 241, 0.32));
  filter: blur(90px);
  opacity: 0.28;
  mix-blend-mode: screen;
  animation: auroraDrift 32s ease-in-out infinite alternate;
  will-change: transform, opacity;

  @keyframes auroraDrift {
    0% {
      transform: rotate(-6deg) scale(1);
    }
    50% {
      transform: rotate(12deg) scale(1.05);
    }
    100% {
      transform: rotate(-4deg) scale(1.02);
    }
  }
`;

const StarLayer = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.5), transparent 50%),
    radial-gradient(1px 1px at 60% 70%, rgba(255, 255, 255, 0.4), transparent 50%),
    radial-gradient(2px 2px at 80% 20%, rgba(236, 72, 153, 0.4), transparent 60%),
    radial-gradient(2px 2px at 35% 80%, rgba(99, 102, 241, 0.35), transparent 60%);
  background-size: 260px 260px, 340px 340px, 420px 420px, 360px 360px;
  opacity: 0.45;
  mix-blend-mode: screen;
  animation: starSlide 50s linear infinite;
  will-change: transform, opacity;

  @keyframes starSlide {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(-120px, -60px, 0);
    }
  }
`;

const NoiseLayer = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 35%),
    radial-gradient(circle at 70% 10%, rgba(255, 255, 255, 0.06) 0%, transparent 32%),
    radial-gradient(circle at 30% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 30%);
  background-size: 320px 320px, 420px 420px, 360px 360px;
  mix-blend-mode: screen;
  opacity: 0.18;
  animation: sparklePulse 24s ease-in-out infinite alternate;
  will-change: transform, opacity;

  @keyframes sparklePulse {
    0% {
      transform: scale(1) translateY(0);
      opacity: 0.18;
    }
    50% {
      transform: scale(1.04) translateY(-6px);
      opacity: 0.28;
    }
    100% {
      transform: scale(1.02) translateY(4px);
      opacity: 0.2;
    }
  }
`;

const Particle = styled(motion.span)`
  position: absolute;
  width: 10px;
  height: 10px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 65%);
  border-radius: 9999px;
  box-shadow: 0 0 14px rgba(255, 255, 255, 0.45), 0 0 26px rgba(99, 102, 241, 0.25);
  opacity: 0.7;
  mix-blend-mode: screen;
  will-change: transform, opacity;
`;

const FloatingShape = styled(motion.div)`
  position: absolute;
  background: ${props => props.gradient || props.theme.colors.gradientPrimary};
  opacity: ${props => props.opacity || 0.1};
  border-radius: ${props => props.rounded ? '50%' : props.theme.borderRadius.lg};
  filter: blur(40px);
  z-index: 0;
  will-change: transform, opacity;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 96px;
  font-weight: 900;
  line-height: 1.05;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #fff 0%, #E0E7FF 50%, #C7D2FE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -3px;
  text-shadow: 0 0 80px rgba(99, 102, 241, 0.5);
  
  @media (max-width: 1200px) {
    font-size: 72px;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 22px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 64px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  font-weight: 400;
  letter-spacing: 0.3px;
`;

const SearchContainer = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto 48px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  padding: 12px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  display: flex;
  gap: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 48px rgba(99, 102, 241, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.3) inset;
    border-color: rgba(99, 102, 241, 0.4);
  }
`;

const SearchInput = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:focus-within {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(99, 102, 241, 0.4);
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: rgba(255, 255, 255, 0.5);
  }
  
  input {
    flex: 1;
    border: none;
    background: none;
    font-size: 16px;
    color: #fff;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
    
    &:focus {
      outline: none;
    }
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
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 48px;
`;

const LogosGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 64px;
  flex-wrap: wrap;
`;

const CompanyLogo = styled(motion.div)`
  width: 140px;
  height: 70px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.2);
    color: rgba(255, 255, 255, 0.9);
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
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  padding: 40px 32px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(14, 57, 149, 0.12), rgba(0, 85, 165, 0.12));
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-12px);
    border-color: rgba(14, 57, 149, 0.4);
    box-shadow: 0 20px 60px rgba(14, 57, 149, 0.25);
    
    &::before {
      opacity: 1;
    }
  }
`;

const CategoryIcon = styled.div`
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #0E3995, #0055A5);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(14, 57, 149, 0.35);
  position: relative;
  z-index: 1;
  
  svg {
    width: 36px;
    height: 36px;
  }
`;

const CategoryTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #fff;
  position: relative;
  z-index: 1;
`;

const CategoryCount = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  position: relative;
  z-index: 1;
`;

const CTASection = styled.section`
  max-width: 1440px;
  margin: 0 auto;
  padding: 100px 80px;
`;

const CTACard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(14, 57, 149, 0.12), rgba(0, 85, 165, 0.12));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  padding: 100px 80px;
  border-radius: 24px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
    animation: pulse 15s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(10%, 10%) scale(1.1);
    }
  }
`;

const CTATitle = styled.h2`
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
  letter-spacing: -1px;
`;

const CTAText = styled.p`
  font-size: 20px;
  opacity: 0.8;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
`;

const Footer = styled.footer`
  background: rgba(10, 10, 15, 0.6);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 80px 80px 40px;
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
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #fff;
  }
  
  p {
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 12px;
    line-height: 1.6;
  }
  
  a {
    display: block;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 12px;
    transition: all 0.3s ease;
    
    &:hover {
      color: #fff;
      transform: translateX(4px);
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
`;

const SectionHeading = styled(motion.div)`
  text-align: center;
  margin-bottom: 64px;
  
  h2 {
    font-size: 56px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 16px;
    letter-spacing: -2px;
    line-height: 1.1;
  }
  
  p {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.6);
  }
`;

const particleConfigs = [
  { top: '12%', left: '18%', size: 9, duration: 18, delay: 0 },
  { top: '30%', left: '74%', size: 7, duration: 20, delay: 1 },
  { top: '58%', left: '62%', size: 8, duration: 19, delay: 1.6 },
  { top: '70%', left: '26%', size: 7, duration: 22, delay: 2.2 },
  { top: '82%', left: '46%', size: 9, duration: 20, delay: 1.2 },
  { top: '38%', left: '40%', size: 8, duration: 21, delay: 2.6 },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  const t = useTranslations(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const categories = [
    { icon: Briefcase, title: t.landing.categories.technology, count: `1,234 ${t.landing.categories.jobs}` },
    { icon: Users, title: t.landing.categories.marketing, count: `856 ${t.landing.categories.jobs}` },
    { icon: TrendingUp, title: t.landing.categories.finance, count: `642 ${t.landing.categories.jobs}` },
    { icon: Building2, title: t.landing.categories.design, count: `428 ${t.landing.categories.jobs}` },
    { icon: Sparkles, title: t.landing.categories.sales, count: `931 ${t.landing.categories.jobs}` },
    { icon: Briefcase, title: t.landing.categories.healthcare, count: `765 ${t.landing.categories.jobs}` },
    { icon: Users, title: t.landing.categories.education, count: `512 ${t.landing.categories.jobs}` },
    { icon: Building2, title: t.landing.categories.engineering, count: `1,089 ${t.landing.categories.jobs}` },
  ];

  const toggleLanguage = () => {
    changeLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <LandingContainer>
      <Header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Logo to="/">
          <img src="/images/logo.png" alt="Ốp Pờ" style={{ height: '40px', marginRight: '8px' }} />
          Ốp Pờ
        </Logo>
        <NavLinks>
          <Link to="/candidate/jobs">{t.nav.findJobs}</Link>
          <Link to="/employer/dashboard">{t.nav.forEmployers}</Link>
          <Link to="/login">{t.nav.login}</Link>
          <LanguageToggle onClick={toggleLanguage}>
            <Globe />
            {language === 'vi' ? 'VI' : 'EN'}
          </LanguageToggle>
          <Button as={Link} to="/register" $variant="primary" $size="small">
            {t.nav.signUp}
          </Button>
        </NavLinks>
      </Header>

      <HeroSection>
        <AnimatedBackground>
          <AuroraLayer
            initial={{ opacity: 0.25, scale: 1 }}
            animate={{ opacity: 0.4, scale: 1.04, rotate: [0, 4, -2] }}
            transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
          <StarLayer />
          <NoiseLayer />
          {particleConfigs.map((particle, index) => (
            <Particle
              key={`particle-${index}`}
              style={{
                top: particle.top,
                left: particle.left,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
              animate={{
                y: [0, -14, 0],
                x: [0, 10, -6],
                opacity: [0.4, 0.95, 0.5],
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: particle.delay,
              }}
            />
          ))}
          <FloatingShape
            rounded
            opacity={0.15}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '400px',
              height: '400px',
              top: '10%',
              left: '5%',
            }}
          />
          <FloatingShape
            rounded
            opacity={0.12}
            animate={{
              x: [0, -80, 0],
              y: [0, 80, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '350px',
              height: '350px',
              top: '50%',
              right: '5%',
            }}
          />
          <FloatingShape
            opacity={0.08}
            animate={{
              x: [0, 60, 0],
              y: [0, -60, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '250px',
              height: '250px',
              bottom: '10%',
              left: '50%',
            }}
          />
          <FloatingShape
            rounded
            gradient="linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)"
            opacity={0.1}
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '300px',
              height: '300px',
              top: '30%',
              right: '40%',
            }}
          />
        </AnimatedBackground>
        
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t.landing.hero.title}
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.landing.hero.subtitle}
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
                placeholder={t.landing.hero.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchInput>
          
          <SearchInput>
            <MapPin />
            <input
              type="text"
              placeholder={t.landing.hero.locationPlaceholder}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </SearchInput>
          
          <Button $variant="primary" onClick={() => navigate('/candidate/jobs')}>
            {t.landing.hero.searchButton}
          </Button>
        </SearchContainer>

        <CTAButtons
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button as={Link} to="/register/candidate" $variant="primary" $size="large">
            {t.landing.hero.findJobs}
            <ArrowRight />
          </Button>
          <Button as={Link} to="/register/employer" $variant="outline" $size="large">
            {t.landing.hero.postJob}
          </Button>
        </CTAButtons>
        </HeroContent>
      </HeroSection>

      <CompaniesSection>
        <SectionTitle>{t.landing.companies.title}</SectionTitle>
        <LogosGrid>
          {['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix'].map((company, index) => (
            <CompanyLogo 
              key={company}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {company}
            </CompanyLogo>
          ))}
        </LogosGrid>
      </CompaniesSection>

      <CategoriesSection>
        <SectionHeading
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>{t.landing.categories.title}</h2>
          <p>{t.landing.categories.subtitle}</p>
        </SectionHeading>
        
        <CategoriesGrid>
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <CategoryIcon>
                <category.icon />
              </CategoryIcon>
              <CategoryTitle>{category.title}</CategoryTitle>
              <CategoryCount>{category.count}</CategoryCount>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </CategoriesSection>

      <CTASection>
        <CTACard
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CTATitle>{t.landing.cta.title}</CTATitle>
          <CTAText>
            {t.landing.cta.subtitle}
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
            {t.landing.cta.button}
            <ArrowRight />
          </Button>
        </CTACard>
      </CTASection>

      <Footer>
        <FooterGrid>
          <FooterSection>
            <h3>Ốp Pờ</h3>
            <p>{t.landing.footer.aboutDesc}</p>
          </FooterSection>
          
          <FooterSection>
            <h3>{t.landing.footer.forCandidates}</h3>
            <Link to="/candidate/jobs">{t.landing.footer.browseJobs}</Link>
            <Link to="/register/candidate">{t.landing.footer.profile}</Link>
            <Link to="/candidate/saved-jobs">{t.landing.footer.savedJobs}</Link>
          </FooterSection>
          
          <FooterSection>
            <h3>{t.landing.footer.forEmployers}</h3>
            <Link to="/employer/post-job">{t.landing.footer.postJob}</Link>
            <Link to="/register/employer">{t.landing.footer.manageJobs}</Link>
            <Link to="/employer/subscription">{t.landing.footer.viewApplications}</Link>
          </FooterSection>
          
          <FooterSection>
            <h3>{t.landing.footer.support}</h3>
            <Link to="/">{t.landing.footer.helpCenter}</Link>
            <Link to="/">{t.landing.footer.contact}</Link>
            <Link to="/">{t.landing.footer.privacy}</Link>
          </FooterSection>
        </FooterGrid>
        
        <Copyright>
          {t.landing.footer.copyright}
        </Copyright>
      </Footer>
    </LandingContainer>
  );
};

export default LandingPage;
