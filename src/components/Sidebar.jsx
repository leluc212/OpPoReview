import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  LogOut,
  UsersRound,
  User
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
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Optimize scrolling - prevent auto-scroll */
  scroll-behavior: auto !important;
  overscroll-behavior: contain;
  scroll-snap-type: none;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.theme.colors.primary};
    }
  }
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

const NavLink = styled.div`
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
  cursor: pointer;
  user-select: none;
  outline: none;
  
  /* Prevent focus scroll */
  &:focus {
    outline: none;
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
  
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
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const navRef = useRef(null);
  const isNavigatingRef = useRef(false);
  
  // Save scroll position to sessionStorage whenever it changes
  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;
    
    const handleScroll = () => {
      if (!isNavigatingRef.current) {
        sessionStorage.setItem('sidebarScrollPos', navElement.scrollTop.toString());
      }
    };
    
    navElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => navElement.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Restore scroll position from sessionStorage after navigation
  useLayoutEffect(() => {
    const savedScrollPos = sessionStorage.getItem('sidebarScrollPos');
    
    if (navRef.current && savedScrollPos !== null) {
      const scrollPos = parseInt(savedScrollPos, 10);
      
      // Set scroll immediately
      navRef.current.scrollTop = scrollPos;
      
      // Double check after a small delay
      const timeoutId = setTimeout(() => {
        if (navRef.current) {
          navRef.current.scrollTop = scrollPos;
        }
        isNavigatingRef.current = false;
      }, 10);
      
      return () => clearTimeout(timeoutId);
    }
    
    isNavigatingRef.current = false;
  }, [location.pathname]);
  
  const handleNavClick = (path) => {
    if (path === '#') return;
    
    isNavigatingRef.current = true;
    
    // Save current scroll position before navigation
    if (navRef.current) {
      sessionStorage.setItem('sidebarScrollPos', navRef.current.scrollTop.toString());
    }
    
    navigate(path);
  };
  
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
      { to: '/candidate/availability', icon: ToggleLeft, label: t.sidebar.availability },
      { to: '/candidate/wallet', icon: Wallet, label: t.sidebar.digitalWallet },
      { to: '/candidate/support', icon: HelpCircle, label: t.sidebar.support },
      { to: '#', icon: LogOut, label: t.sidebar.signOut },
    ]}
  ];
  
  const employerLinks = [
    { section: t.sidebar.main, items: [
      { to: '/employer/dashboard', icon: LayoutDashboard, label: t.sidebar.dashboard },
      { to: '/employer/jobs', icon: Briefcase, label: t.sidebar.myJobs },
      { to: '/employer/applications', icon: FileText, label: t.sidebar.applications },
      { to: '/employer/hr-management', icon: UsersRound, label: 'Quản lý nhân sự' },
    ]},
    { section: t.sidebar.communication, items: [
      { to: '/employer/messages', icon: MessageSquare, label: t.sidebar.messages },
      { to: '/employer/notifications', icon: Bell, label: t.sidebar.notifications },
    ]},
    { section: t.sidebar.account, items: [
      { to: '/employer/profile', icon: Users, label: t.sidebar.companyProfile },
      { to: '/employer/subscription', icon: CreditCard, label: t.sidebar.subscription },
      { to: '/employer/settings', icon: Settings, label: t.sidebar.settings },
    ]},
    { section: t.sidebar.utilities, items: [
      { to: '/employer/analytics', icon: BarChart3, label: 'Phân tích' },
      { to: '/employer/wallet', icon: Wallet, label: t.sidebar.digitalWallet },
      { to: '/employer/support', icon: HelpCircle, label: t.sidebar.support },
      { to: '#', icon: LogOut, label: t.sidebar.signOut },
    ]}
  ];
  
  const adminLinks = [
    { section: t.sidebar.main, items: [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: t.sidebar.dashboard },
      { to: '/admin/users', icon: Users, label: t.sidebar.userManagement },
      { to: '/admin/employers', icon: CheckCircle, label: t.sidebar.employerApproval },
    ]},
    { section: 'Quản Lý', items: [
      { to: '/admin/posts', icon: FileText, label: 'Quản lý bài đăng' },
      { to: '/admin/packages', icon: Package, label: t.sidebar.packages },
    ]},
    { section: 'Phân Tích', items: [
      { to: '/admin/analytics', icon: BarChart3, label: 'Phân tích dữ liệu' },
      { to: '/admin/reports', icon: BarChart3, label: t.sidebar.reports },
    ]},
    { section: 'Tiện Ích', items: [
      { to: '/admin/wallet', icon: Wallet, label: 'Ví điện tử' },
      { to: '/admin/notifications', icon: Bell, label: t.sidebar.notifications },
      { to: '/admin/profile', icon: User, label: 'Hồ sơ' },
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
      
      <Nav ref={navRef}>
        {links.map((section, idx) => (
          <NavSection key={idx}>
            <NavSectionTitle>{section.section}</NavSectionTitle>
            {section.items.map((link, linkIdx) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={linkIdx}
                  $active={location.pathname === link.to}
                  onClick={() => handleNavClick(link.to)}
                  onMouseDown={(e) => e.preventDefault()}
                  tabIndex={0}
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
