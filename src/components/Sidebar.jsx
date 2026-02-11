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
  Package
} from 'lucide-react';

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
  
  h1 {
    font-size: 20px;
    font-weight: 700;
    background: ${props => props.theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
  
  const candidateLinks = [
    { section: 'Main', items: [
      { to: '/candidate/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/candidate/jobs', icon: Briefcase, label: 'Find Jobs' },
      { to: '/candidate/saved-jobs', icon: Star, label: 'Saved Jobs' },
    ]},
    { section: 'Communication', items: [
      { to: '/candidate/messages', icon: MessageSquare, label: 'Messages' },
      { to: '/candidate/notifications', icon: Bell, label: 'Notifications' },
    ]},
    { section: 'Account', items: [
      { to: '/candidate/profile', icon: Users, label: 'My Profile' },
      { to: '/candidate/settings', icon: Settings, label: 'Settings' },
    ]}
  ];
  
  const employerLinks = [
    { section: 'Main', items: [
      { to: '/employer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/employer/jobs', icon: Briefcase, label: 'My Jobs' },
      { to: '/employer/applications', icon: FileText, label: 'Applications' },
    ]},
    { section: 'Communication', items: [
      { to: '/employer/messages', icon: MessageSquare, label: 'Messages' },
      { to: '/employer/notifications', icon: Bell, label: 'Notifications' },
    ]},
    { section: 'Account', items: [
      { to: '/employer/profile', icon: Users, label: 'Company Profile' },
      { to: '/employer/subscription', icon: CreditCard, label: 'Subscription' },
    ]}
  ];
  
  const adminLinks = [
    { section: 'Main', items: [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/admin/users', icon: Users, label: 'User Management' },
      { to: '/admin/employers', icon: CheckCircle, label: 'Employer Approval' },
    ]},
    { section: 'Platform', items: [
      { to: '/admin/packages', icon: Package, label: 'Packages' },
      { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
      { to: '/admin/settings', icon: Settings, label: 'Settings' },
    ]}
  ];
  
  const links = role === 'candidate' ? candidateLinks 
    : role === 'employer' ? employerLinks 
    : adminLinks;
  
  return (
    <SidebarContainer>
      <Logo>
        <h1>JobMarket</h1>
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
