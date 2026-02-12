import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Bell, 
  Settings,
  FileText,
  Star,
  CreditCard,
  CheckCircle,
  BarChart3,
  Package,
  MapPin,
  ToggleLeft,
  ShieldCheck,
  HelpCircle,
  Wallet,
  LogOut
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../locales/translations';

const SidebarContainer = styled.aside`
  width: 280px;
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
  border-right: 1px solid ${props => props.theme.colors.border};
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.md};
`;

const Logo = styled.div`
  padding: 28px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: ${props => props.theme.colors.bgLight};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: ${props => props.theme.colors.gradientPrimary};
    border-radius: 2px;
  }
  
  h1 {
    font-size: 26px;
    font-weight: 800;
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 20px 16px;
`;

const NavSection = styled.div`
  margin-bottom: 32px;
`;

const NavSectionTitle = styled.p`
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  padding: 0 16px;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.$active ? 'white' : props.theme.colors.textLight};
  background: ${props => props.$active ? props.theme.colors.gradientPrimary : 'transparent'};
  font-weight: ${props => props.$active ? 600 : 500};
  transition: all ${props => props.theme.transitions.normal};
  margin-bottom: 6px;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.$active ? props.theme.shadows.md : 'none'};
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 0;
    background: ${props => props.theme.colors.primary};
    transition: height ${props => props.theme.transitions.normal};
    border-radius: 0 2px 2px 0;
  }
  
  svg {
    width: 22px;
    height: 22px;
    transition: transform ${props => props.theme.transitions.fast};
  }
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.gradientPrimary : `${props.theme.colors.primary}08`};
    color: ${props => props.$active ? 'white' : props.theme.colors.primary};
    transform: translateX(4px);
    
    &::before {
      height: ${props => props.$active ? '0' : '24px'};
    }
    
    svg {
      transform: scale(1.1);
    }
  }
`;

const Sidebar = ({ role }) => {
  const location = useLocation();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const candidateLinks = [
    { section: t.sidebar.main, items: [
      { to: '/candidate/dashboard', icon: LayoutDashboard, label: t.sidebar.dashboard },
      { to: '/candidate/jobs', icon: Briefcase, label: t.sidebar.findJobs },
    ]},
    { section: t.sidebar.communication, items: [
      { to: '/candidate/messages', icon: MessageSquare, label: t.sidebar.messages },
      { to: '/candidate/notifications', icon: Bell, label: t.sidebar.notifications },
    ]},
    { section: t.sidebar.account, items: [
      { to: '/candidate/profile', icon: Users, label: t.sidebar.myProfile },
      { to: '/candidate/settings', icon: Settings, label: t.sidebar.settings },
    ]},
    { section: t.sidebar.utilities, items: [
      { to: '#', icon: MapPin, label: t.sidebar.location },
      { to: '#', icon: ToggleLeft, label: t.sidebar.availability },
      { to: '#', icon: FileText, label: t.sidebar.policyTerms },
      { to: '#', icon: ShieldCheck, label: t.sidebar.loginSecurity },
      { to: '#', icon: Wallet, label: t.sidebar.digitalWallet },
      { to: '#', icon: HelpCircle, label: t.sidebar.support },
      { to: '#', icon: LogOut, label: t.sidebar.signOut },
    ]}
  ];
  
  const employerLinks = [
    { section: t.sidebar.main, items: [
      { to: '/employer/dashboard', icon: LayoutDashboard, label: t.sidebar.dashboard },
      { to: '/employer/jobs', icon: Briefcase, label: t.sidebar.myJobs },
      { to: '/employer/applications', icon: FileText, label: t.sidebar.applications },
    ]},
    { section: t.sidebar.communication, items: [
      { to: '/employer/messages', icon: MessageSquare, label: t.sidebar.messages },
      { to: '/employer/notifications', icon: Bell, label: t.sidebar.notifications },
    ]},
    { section: t.sidebar.account, items: [
      { to: '/employer/profile', icon: Users, label: t.sidebar.companyProfile },
      { to: '/employer/subscription', icon: CreditCard, label: t.sidebar.subscription },
    ]}
  ];
  
  const adminLinks = [
    { section: t.sidebar.main, items: [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: t.sidebar.dashboard },
      { to: '/admin/users', icon: Users, label: t.sidebar.userManagement },
      { to: '/admin/employers', icon: CheckCircle, label: t.sidebar.employerApproval },
    ]},
    { section: t.sidebar.platform, items: [
      { to: '/admin/packages', icon: Package, label: t.sidebar.packages },
      { to: '/admin/reports', icon: BarChart3, label: t.sidebar.reports },
      { to: '/admin/settings', icon: Settings, label: t.sidebar.settings },
    ]}
  ];
  
  const links = role === 'candidate' ? candidateLinks 
    : role === 'employer' ? employerLinks 
    : adminLinks;
  
  return (
    <SidebarContainer>
      <Logo>
        <img src="/images/logo.png" alt="Ốp Pờ" style={{ height: '32px', marginBottom: '4px' }} />
        <h1>Ốp Pờ</h1>
      </Logo>
      
      <Nav>
        {links.map((section, idx) => (
          <NavSection key={idx}>
            <NavSectionTitle>{section.section}</NavSectionTitle>
            {section.items.map((link, linkIdx) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={linkIdx}
                  to={link.to}
                  $active={location.pathname === link.to}
                >
                  <Icon />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </NavSection>
        ))}
      </Nav>
    </SidebarContainer>
  );
};

export default Sidebar;
