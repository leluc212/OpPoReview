import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Building2, Users, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../components/FormElements';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const Header = styled.header`
  padding: 24px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.colors.bgLight};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
  
  a {
    color: ${props => props.theme.colors.textLight};
    font-weight: 500;
    transition: color ${props => props.theme.transitions.fast};
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const HeroSection = styled.section`
  max-width: 1440px;
  margin: 0 auto;
  padding: 120px 80px;
  text-align: center;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 72px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 24px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 48px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchContainer = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto 32px;
  background: ${props => props.theme.colors.bgLight};
  padding: 12px;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  display: flex;
  gap: 12px;
`;

const SearchInput = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.textLight};
  }
  
  input {
    flex: 1;
    border: none;
    background: none;
    font-size: 16px;
    color: ${props => props.theme.colors.text};
    
    &::placeholder {
      color: ${props => props.theme.colors.textLight};
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
  padding: 80px 80px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 32px;
`;

const LogosGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 64px;
  flex-wrap: wrap;
`;

const CompanyLogo = styled.div`
  width: 120px;
  height: 60px;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${props => props.theme.colors.textLight};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const CategoriesSection = styled.section`
  max-width: 1440px;
  margin: 0 auto;
  padding: 80px 80px;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 48px;
`;

const CategoryCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgLight};
  padding: 32px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadows.hover};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CategoryIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: ${props => props.theme.colors.gradientPrimary};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const CategoryTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text};
`;

const CategoryCount = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
`;

const CTASection = styled.section`
  max-width: 1440px;
  margin: 0 auto;
  padding: 80px 80px;
`;

const CTACard = styled.div`
  background: ${props => props.theme.colors.gradientHero};
  padding: 80px;
  border-radius: ${props => props.theme.borderRadius.xl};
  text-align: center;
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const CTAText = styled.p`
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 32px;
`;

const Footer = styled.footer`
  background: ${props => props.theme.colors.bgLight};
  border-top: 1px solid ${props => props.theme.colors.border};
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
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 8px;
  }
  
  a {
    display: block;
    color: ${props => props.theme.colors.textLight};
    margin-bottom: 8px;
    transition: color ${props => props.theme.transitions.fast};
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textLight};
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const categories = [
    { icon: Briefcase, title: 'Technology', count: '1,234 jobs' },
    { icon: Users, title: 'Marketing', count: '856 jobs' },
    { icon: TrendingUp, title: 'Finance', count: '642 jobs' },
    { icon: Building2, title: 'Design', count: '428 jobs' },
    { icon: Sparkles, title: 'Sales', count: '931 jobs' },
    { icon: Briefcase, title: 'Healthcare', count: '765 jobs' },
    { icon: Users, title: 'Education', count: '512 jobs' },
    { icon: Building2, title: 'Engineering', count: '1,089 jobs' },
  ];

  return (
    <LandingContainer>
      <Header>
        <Logo to="/">JobMarket</Logo>
        <NavLinks>
          <Link to="/candidate/jobs">Find Jobs</Link>
          <Link to="/employer/dashboard">For Employers</Link>
          <Link to="/login">Login</Link>
          <Button as={Link} to="/register" $variant="primary" $size="small">
            Sign Up
          </Button>
        </NavLinks>
      </Header>

      <HeroSection>
        <HeroTitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Find Jobs & Hire Faster
        </HeroTitle>
        
        <HeroSubtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Connect talent with opportunity. The modern marketplace for recruitment.
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
              placeholder="Job title or keyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
          
          <SearchInput>
            <MapPin />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </SearchInput>
          
          <Button $variant="primary" onClick={() => navigate('/candidate/jobs')}>
            Search Jobs
          </Button>
        </SearchContainer>

        <CTAButtons
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button as={Link} to="/register/candidate" $variant="primary" $size="large">
            Find Jobs
            <ArrowRight />
          </Button>
          <Button as={Link} to="/register/employer" $variant="outline" $size="large">
            Post a Job
          </Button>
        </CTAButtons>
      </HeroSection>

      <CompaniesSection>
        <SectionTitle>Trusted by Leading Companies</SectionTitle>
        <LogosGrid>
          {['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix'].map((company) => (
            <CompanyLogo key={company}>{company}</CompanyLogo>
          ))}
        </LogosGrid>
      </CompaniesSection>

      <CategoriesSection>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <HeroTitle style={{ fontSize: '48px' }}>Browse by Category</HeroTitle>
          <HeroSubtitle style={{ fontSize: '18px' }}>
            Find the perfect role in your industry
          </HeroSubtitle>
        </div>
        
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
        <CTACard>
          <CTATitle>Ready to Hire Top Talent?</CTATitle>
          <CTAText>
            Post your jobs and connect with qualified candidates today
          </CTAText>
          <Button as={Link} to="/register/employer" $variant="secondary" $size="large" style={{ background: 'white', color: '#6366F1' }}>
            Get Started - It's Free
            <ArrowRight />
          </Button>
        </CTACard>
      </CTASection>

      <Footer>
        <FooterGrid>
          <FooterSection>
            <h3>JobMarket</h3>
            <p>The modern recruitment marketplace connecting talent with opportunity.</p>
          </FooterSection>
          
          <FooterSection>
            <h3>For Candidates</h3>
            <Link to="/candidate/jobs">Browse Jobs</Link>
            <Link to="/register/candidate">Create Profile</Link>
            <Link to="/candidate/saved-jobs">Saved Jobs</Link>
          </FooterSection>
          
          <FooterSection>
            <h3>For Employers</h3>
            <Link to="/employer/post-job">Post a Job</Link>
            <Link to="/register/employer">Register Company</Link>
            <Link to="/employer/subscription">Pricing</Link>
          </FooterSection>
          
          <FooterSection>
            <h3>Company</h3>
            <Link to="/">About Us</Link>
            <Link to="/">Contact</Link>
            <Link to="/">Privacy Policy</Link>
          </FooterSection>
        </FooterGrid>
        
        <Copyright>
          © 2026 JobMarket. All rights reserved.
        </Copyright>
      </Footer>
    </LandingContainer>
  );
};

export default LandingPage;
