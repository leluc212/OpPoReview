import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Bell, MessageSquare, Search, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const NavbarContainer = styled.nav`
  height: 80px;
  background: ${props => props.theme.colors.bgLight};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  background: ${props => props.theme.colors.bgLight}98;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  flex: 1;
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 500px;
  width: 100%;
  
  input {
    width: 100%;
    padding: 14px 20px 14px 52px;
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.full};
    background: ${props => props.theme.colors.bgLight};
    font-size: 15px;
    font-weight: 500;
    transition: all ${props => props.theme.transitions.normal};
    
    &:focus {
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}15, 0 8px 16px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }
    
    &::placeholder {
      color: ${props => props.theme.colors.textLight};
    }
  }
  
  svg {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.textLight};
    cursor: pointer;
    transition: all ${props => props.theme.transitions.normal};
    
    &:hover {
      color: ${props => props.theme.colors.primary};
      transform: translateY(-50%) scale(1.1);
    }
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.bgDark};
  color: ${props => props.theme.colors.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all ${props => props.theme.transitions.normal};
  border: 2px solid transparent;
  
  &:hover {
    background: ${props => props.theme.colors.gradientPrimary};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => props.theme.colors.primary};
  }
  
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  background: ${props => props.theme.colors.error};
  color: white;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: ${props => props.theme.shadows.md};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gradientPrimary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  text-transform: uppercase;
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all ${props => props.theme.transitions.normal};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 20px;
  margin-left: 12px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.bgDark};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  border: 2px solid transparent;
  
  &:hover {
    background: ${props => props.theme.colors.gradientPrimary};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.intense};
    border-color: ${props => props.theme.colors.primary};
    
    ${Avatar} {
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  span:first-child {
    font-size: 14px;
    font-weight: 500;
  }
  
  span:last-child {
    font-size: 12px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const Navbar = ({ showSearch = true }) => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  
  useEffect(() => {
    const loadImage = () => {
      if (user?.role === 'candidate') {
        setProfileImage(localStorage.getItem('profileImage'));
      } else if (user?.role === 'employer') {
        setProfileImage(localStorage.getItem('companyLogo'));
      } else if (user?.role === 'admin') {
        setProfileImage(localStorage.getItem('adminProfileImage'));
      }
    };
    
    loadImage();
    const interval = setInterval(loadImage, 1000);
    
    return () => clearInterval(interval);
  }, [user?.role]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate('/candidate/jobs', { state: { searchKeyword: searchValue } });
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <NavbarContainer>
      <NavLeft>
        {showSearch && (
          <SearchBar>
            <Search onClick={handleSearch} />
            <input 
              type="text" 
              placeholder={language === 'vi' ? 'Tìm việc, công ty...' : 'Search jobs, companies...'}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </SearchBar>
        )}
      </NavLeft>
      
      <NavRight>
        <IconButton>
          <Bell />
          <Badge>3</Badge>
        </IconButton>
        
        <IconButton>
          <MessageSquare />
          <Badge>5</Badge>
        </IconButton>
        
        <UserMenu>
          <Avatar>
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </Avatar>
          <UserInfo>
            <span>{user?.name || 'User'}</span>
            <span>{user?.role || 'Role'}</span>
          </UserInfo>
        </UserMenu>
        
        <IconButton onClick={handleLogout}>
          <LogOut />
        </IconButton>
      </NavRight>
    </NavbarContainer>
  );
};

export default Navbar;
