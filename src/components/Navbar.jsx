import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Bell, Search, LogOut, User, Users, Briefcase, DollarSign, AlertCircle, Settings, Eye, CheckCircle, Star, UserPlus, History, Building2, Tag as TagIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import candidateProfileService from '../services/candidateProfileService';
import employerProfileService from '../services/employerProfileService';
import jobPostService from '../services/jobPostService';

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
  overflow: visible;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  flex: 1;
  overflow: visible;
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 500px;
  width: 100%;
  overflow: visible;
  
  input {
    width: 100%;
    padding: 14px 20px 14px 52px;
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.full};
    background: ${props => props.theme.colors.bgLight};
    color: ${props => props.theme.colors.text};
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
  
  > svg {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.primary};
    opacity: 0.7;
    cursor: pointer;
    transition: all ${props => props.theme.transitions.normal};
    
    &:hover {
      color: ${props => props.theme.colors.primary};
      opacity: 1;
      transform: translateY(-50%) scale(1.1);
    }
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchSuggestionDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.bgLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 12px 40px rgba(0,0,0,0.18);
  z-index: 9999;
  max-height: 320px;
  overflow-y: auto;
  padding: 8px 0;
  animation: slideDown 0.15s ease-out;

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 2px;
  }
`;

const SearchSuggestionItem = styled.div`
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  transition: background 0.15s;

  &:hover {
    background: ${props => props.theme.colors.bgDark};
    color: ${props => props.theme.colors.primary};
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.colors.textLight};
    flex-shrink: 0;
  }

  .sub {
    font-size: 11px;
    color: ${props => props.theme.colors.textLight};
    margin-left: auto;
  }
`;

const SearchSuggestionHeader = styled.div`
  padding: 4px 16px 6px;
  font-size: 10px;
  font-weight: 800;
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const IconButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.bgDark};
  color: ${props => props.theme.colors.text};
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
  top: 4px;
  right: 4px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 10px;
  background: #e41e3f;
  color: white;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.theme.colors.bgLight};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1;
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 400px;
  max-height: 600px;
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  z-index: 1000;
  animation: slideDown 0.2s ease-out;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const NotificationHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
  
  button {
    color: ${props => props.theme.colors.primary};
    font-size: 14px;
    font-weight: 600;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.colors.bgDark};
    }
  }
`;

const NotificationTabs = styled.div`
  display: flex;
  padding: 8px 12px;
  gap: 8px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const NotificationTab = styled.button`
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bgDark};
  }
`;

const NotificationList = styled.div`
  max-height: 480px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.bgDark};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.colors.textLight};
    }
  }
`;

const NotificationItem = styled.div`
  padding: 16px 20px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.$unread ? props.theme.colors.bgDark : 'transparent'};
  
  &:hover {
    background: ${props => props.theme.colors.bgDark};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.$color || props.theme.colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$color || props.theme.colors.primary};
  }
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
  
  .title {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 4px;
  }
  
  .message {
    font-size: 13px;
    color: ${props => props.theme.colors.textLight};
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .time {
    font-size: 12px;
    color: ${props => props.theme.colors.primary};
    margin-top: 4px;
    font-weight: 600;
  }
`;

const NotificationDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  flex-shrink: 0;
  margin-top: 4px;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState(() => JSON.parse(localStorage.getItem('jobSearchHistory') || '[]'));
  const [allJobTitles, setAllJobTitles] = useState([]);
  const searchBarRef = useRef(null);
  const [companyLogo, setCompanyLogo] = useState(() => localStorage.getItem('companyLogo') || '/OpPoReview/images/katinatlogo.jpg');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationTab, setNotificationTab] = useState('all');
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [employerProfile, setEmployerProfile] = useState(null);
  const notificationRef = useRef(null);

  // Load job titles for suggestions
  useEffect(() => {
    if (user?.role !== 'candidate') return;
    jobPostService.getAllActiveJobs().then(jobs => {
      const titles = [];
      const companies = [];
      const seen = new Set();
      jobs.forEach(j => {
        if (j.title && !seen.has(j.title)) { titles.push({ label: j.title, type: 'job' }); seen.add(j.title); }
        if (j.employerName && !seen.has(j.employerName)) { companies.push({ label: j.employerName, type: 'company' }); seen.add(j.employerName); }
      });
      setAllJobTitles([...titles, ...companies]);
    }).catch(() => {});
  }, [user]);

  // Generate suggestions when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      const history = JSON.parse(localStorage.getItem('jobSearchHistory') || '[]');
      setSearchHistory(history);
      setSearchSuggestions(history.slice(0, 6).map(h => ({ label: h, type: 'history' })));
      return;
    }
    const q = searchQuery.toLowerCase();
    const matched = allJobTitles.filter(s => s.label.toLowerCase().includes(q)).slice(0, 7);
    setSearchSuggestions(matched);
  }, [searchQuery, allJobTitles]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Get notifications based on user role
  const getNotifications = () => {
    if (user?.role === 'admin') {
      return [
        {
          id: 1,
          icon: Users,
          color: '#8b5cf6',
          title: 'Người dùng mới đăng ký',
          message: '15 ứng viên và 3 nhà tuyển dụng mới đã đăng ký trong 24h qua',
          time: '2 giờ trước',
          unread: true
        },
        {
          id: 2,
          icon: Briefcase,
          color: '#f59e0b',
          title: 'Yêu cầu phê duyệt nhà tuyển dụng',
          message: 'Katinat chi nhánh quận 8 đang chờ phê duyệt',
          time: '3 giờ trước',
          unread: true
        },
        {
          id: 3,
          icon: AlertCircle,
          color: '#ef4444',
          title: 'Bài đăng bị cảnh báo',
          message: '5 bài đăng tuyển nhân viên phục vụ bị cảnh báo',
          time: '5 giờ trước',
          unread: true
        },
        {
          id: 4,
          icon: DollarSign,
          color: '#10b981',
          title: 'Thanh toán mới',
          message: 'The Coffee House đã thanh toán gói Banner nổi bật 2',
          time: '1 ngày trước',
          unread: false
        },
      ];
    } else if (user?.role === 'employer') {
      return [
        {
          id: 1,
          icon: User,
          color: '#1e40af',
          title: 'Ứng viên mới ứng tuyển',
          message: 'Nguyễn Hùng Anh đã ứng tuyển',
          jobTitle: 'Nhân viên Bán Hàng',
          time: '5 phút trước',
          unread: true
        },
        {
          id: 2,
          icon: User,
          color: '#1e40af',
          title: 'Ứng viên mới ứng tuyển',
          message: 'Trương Tú Phương đã ứng tuyển',
          jobTitle: 'Nhân viên Hành Chính',
          time: '15 phút trước',
          unread: true
        },
        {
          id: 3,
          icon: AlertCircle,
          color: '#f59e0b',
          title: 'Gói sắp hết hạn',
          message: 'Gói Banner Nổi Bật của bạn sẽ hết hạn vào 20/03/2026',
          time: '1 ngày trước',
          unread: true
        },
        // Rating notification removed from navbar
      ];
    } else if (user?.role === 'candidate') {
      // Only show quick-job related application/receive notifications
      return [
        {
          id: 1,
          icon: Briefcase,
          color: '#1e40af',
          title: 'Nhà tuyển dụng đã xem hồ sơ',
          message: 'Highlands Coffee đã xem hồ sơ ứng tuyển của bạn',
          time: '2 giờ trước',
          unread: true,
          isQuickJob: true,
          type: 'application'
        },
        {
          id: 2,
          icon: AlertCircle,
          color: '#10B981',
          title: 'Hồ sơ được chấp nhận',
          message: 'Hồ sơ ứng tuyển tại Katinat Quận 8 đã được chấp nhận',
          time: '1 ngày trước',
          unread: true,
          isQuickJob: true,
          type: 'success'
        }
      ];
    }
    return [];
  };

  const notifications = getNotifications();
  const filteredNotifications = notifications;

  useEffect(() => {
    const handleLogoChange = () => {
      setCompanyLogo(localStorage.getItem('companyLogo') || '/OpPoReview/images/katinatlogo.jpg');
    };
    window.addEventListener('logoChanged', handleLogoChange);
    return () => window.removeEventListener('logoChanged', handleLogoChange);
  }, []);

  // Fetch candidate profile if user is a candidate
  useEffect(() => {
    const fetchCandidateProfile = async () => {
      if (user?.role === 'candidate') {
        try {
          const profile = await candidateProfileService.getMyProfile();
          setCandidateProfile(profile);
        } catch (error) {
          console.error('Error fetching candidate profile:', error);
        }
      }
    };

    fetchCandidateProfile();
  }, [user]);

  // Fetch employer profile if user is an employer
  useEffect(() => {
    const fetchEmployerProfile = async () => {
      if (user?.role === 'employer') {
        try {
          const profile = await employerProfileService.getMyProfile();
          setEmployerProfile(profile);
        } catch (error) {
          console.error('Error fetching employer profile:', error);
        }
      }
    };

    fetchEmployerProfile();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const getRoleTranslation = (role) => {
    if (role === 'candidate') return t.login.roleCandidate;
    if (role === 'employer') return t.login.roleEmployer;
    if (role === 'admin') return t.login.roleAdmin;
    return role;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
  };

  const handleNotificationItemClick = () => {
    setShowNotifications(false);
    if (user?.role === 'candidate') {
      navigate('/candidate/notifications');
    } else if (user?.role === 'employer') {
      navigate('/employer/notifications');
    } else if (user?.role === 'admin') {
      navigate('/admin/notifications');
    }
  };

  const handleSettingsClick = () => {
    if (user?.role === 'candidate') {
      navigate('/candidate/settings');
    } else if (user?.role === 'employer') {
      navigate('/employer/settings');
    } else if (user?.role === 'admin') {
      navigate('/admin/settings');
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const history = JSON.parse(localStorage.getItem('jobSearchHistory') || '[]');
      const updated = [searchQuery.trim(), ...history.filter(h => h !== searchQuery.trim())].slice(0, 5);
      localStorage.setItem('jobSearchHistory', JSON.stringify(updated));
      setShowSearchSuggestions(false);
      navigate('/candidate/jobs', { state: { searchKeyword: searchQuery } });
    }
  };

  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      const history = JSON.parse(localStorage.getItem('jobSearchHistory') || '[]');
      const updated = [searchQuery.trim(), ...history.filter(h => h !== searchQuery.trim())].slice(0, 5);
      localStorage.setItem('jobSearchHistory', JSON.stringify(updated));
      setShowSearchSuggestions(false);
      navigate('/candidate/jobs', { state: { searchKeyword: searchQuery } });
    }
  };

  const handleProfileClick = () => {
    if (user?.role === 'candidate') {
      navigate('/candidate/profile');
    } else if (user?.role === 'employer') {
      navigate('/employer/profile');
    } else if (user?.role === 'admin') {
      navigate('/admin/profile');
    }
  };

  return (
    <NavbarContainer>
      <NavLeft>
        {showSearch && (
          <SearchBar ref={searchBarRef}>
            <Search onClick={handleSearchIconClick} style={{ cursor: 'pointer' }} />
            <input
              type="text"
              placeholder={language === 'vi' ? 'Tìm việc, công ty...' : 'Search jobs, companies...'}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearchSuggestions(true); }}
              onFocus={() => setShowSearchSuggestions(true)}
              onKeyPress={handleSearch}
            />
            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <SearchSuggestionDropdown>
                {!searchQuery.trim() && searchSuggestions.some(s => s.type === 'history') && (
                  <SearchSuggestionHeader>{language === 'vi' ? 'Tìm kiếm gần đây' : 'Recent Searches'}</SearchSuggestionHeader>
                )}
                {searchQuery.trim() && (
                  <SearchSuggestionHeader>{language === 'vi' ? 'Gợi ý' : 'Suggestions'}</SearchSuggestionHeader>
                )}
                {searchSuggestions.map((s, i) => (
                  <SearchSuggestionItem
                    key={i}
                    onMouseDown={() => {
                      setSearchQuery(s.label);
                      setShowSearchSuggestions(false);
                      const history = JSON.parse(localStorage.getItem('jobSearchHistory') || '[]');
                      const updated = [s.label, ...history.filter(h => h !== s.label)].slice(0, 5);
                      localStorage.setItem('jobSearchHistory', JSON.stringify(updated));
                      navigate('/candidate/jobs', { state: { searchKeyword: s.label } });
                    }}
                  >
                    {s.type === 'history' ? <History /> : s.type === 'company' ? <Building2 /> : <Search />}
                    <span>{s.label}</span>
                    {s.type === 'company' && <span className="sub">{language === 'vi' ? 'Công ty' : 'Company'}</span>}
                  </SearchSuggestionItem>
                ))}
              </SearchSuggestionDropdown>
            )}
          </SearchBar>
        )}
      </NavLeft>

      <NavRight>
        <div style={{ position: 'relative' }} ref={notificationRef}>
          <IconButton onClick={toggleNotifications}>
            <Bell />
            <Badge>{filteredNotifications.filter(n => n.unread).length}</Badge>
          </IconButton>

          {showNotifications && (
            <NotificationDropdown>
              <NotificationHeader>
                <h3>Thông báo</h3>
                <button onClick={handleNotificationItemClick}>Xem tất cả</button>
              </NotificationHeader>

              <NotificationTabs>
                <NotificationTab
                  $active={notificationTab === 'all'}
                  onClick={() => setNotificationTab('all')}
                >
                  Tất cả
                </NotificationTab>
                <NotificationTab
                  $active={notificationTab === 'unread'}
                  onClick={() => setNotificationTab('unread')}
                >
                  Chưa đọc
                </NotificationTab>
              </NotificationTabs>

              <NotificationList>
                {filteredNotifications
                  .filter(n => notificationTab === 'all' || n.unread)
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      $unread={notification.unread}
                      onClick={handleNotificationItemClick}
                    >
                      <NotificationIcon $color={notification.color}>
                        <notification.icon />
                      </NotificationIcon>
                      <NotificationContent>
                        <div className="title">{notification.title}</div>
                        <div className="message">
                          {notification.message}
                          {notification.jobTitle && (
                            <span> — {notification.jobTitle}</span>
                          )}
                        </div>
                        <div className="time">{notification.time}</div>
                      </NotificationContent>
                      {notification.unread && <NotificationDot />}
                    </NotificationItem>
                  ))}
              </NotificationList>
            </NotificationDropdown>
          )}
        </div>

        <IconButton onClick={handleSettingsClick} title="Cài đặt">
          <Settings />
        </IconButton>

        <UserMenu onClick={handleProfileClick}>
          <Avatar>
            {user?.role === 'employer' ? (
              employerProfile?.companyLogo ? (
                <img src={employerProfile.companyLogo} alt="Company Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <img src={companyLogo} alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              )
            ) : user?.role === 'candidate' && candidateProfile?.profileImage ? (
              <img src={candidateProfile.profileImage} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              (candidateProfile?.fullName?.charAt(0) || user?.name?.charAt(0) || 'U').toUpperCase()
            )}
          </Avatar>
          <UserInfo>
            <span>{user?.role === 'employer' ? (employerProfile?.companyName || 'Chưa cập nhật tên công ty') : (candidateProfile?.fullName || user?.name || 'User')}</span>
            <span>{getRoleTranslation(user?.role) || 'Role'}</span>
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

