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
  width: 260px;
  background: ${props => props.theme.colors.bgLight};
  border-right: 1px solid ${props => props.theme.colors.border};
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Logo = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  margin: 12px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
  
  h1 {
    font-size: 22px;
    font-weight: 700;
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 16px;
`;

const NavSection = styled.div`
  margin-bottom: 24px;
`;

const NavSectionTitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  padding: 0 12px;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textLight};
  background: ${props => props.$active ? `${props.theme.colors.primary}10` : 'transparent'};
  font-weight: ${props => props.$active ? 500 : 400};
  transition: all ${props => props.theme.transitions.fast};
  margin-bottom: 4px;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    background: ${props => props.theme.colors.bgDark};
    color: ${props => props.theme.colors.primary};
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
