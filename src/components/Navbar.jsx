import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Bell, MessageSquare, Search, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavbarContainer = styled.nav`
  height: 72px;
  background: ${props => props.theme.colors.bgLight};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: ${props => props.theme.colors.bgLight}95;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
  
  input {
    width: 100%;
    padding: 10px 16px 10px 44px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.full};
    background: ${props => props.theme.colors.background};
    font-size: 14px;
    transition: all ${props => props.theme.transitions.fast};
    
    &:focus {
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
    }
    
    &::placeholder {
      color: ${props => props.theme.colors.textLight};
    }
  }
  
  svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: ${props => props.theme.colors.textLight};
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgDark};
  color: ${props => props.theme.colors.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.theme.colors.error};
  color: white;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgDark};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gradientPrimary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
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
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <NavbarContainer>
      <NavLeft>
        {showSearch && (
          <SearchBar>
            <Search />
            <input type="text" placeholder="Search jobs, companies..." />
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
            {user?.name?.charAt(0).toUpperCase() || 'U'}
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
