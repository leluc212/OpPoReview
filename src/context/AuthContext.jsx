import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = (userData) => {
    console.log('🔐 Login called with:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('🚪 Logout called');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    sessionStorage.clear(); // Clear session khi đăng xuất
  };

  const updateUser = (userData) => {
    console.log('📝 Update user called with:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Check Cognito session on mount and after refresh
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        console.log('🔍 [AuthContext] Starting authentication check...');
        
        // Try to get current Cognito user
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        
        if (!isMounted) {
          console.log('⚠️ Component unmounted, skipping auth update');
          return;
        }
        
        console.log('✅ [AuthContext] Cognito user found:', currentUser.username);
        console.log('✅ [AuthContext] Session tokens:', session.tokens ? 'Present' : 'Missing');
        
        if (currentUser && session.tokens) {
          // User is authenticated with Cognito
          const userIdFromToken = session.tokens.idToken.payload.sub; // Always get userId from token
          const emailFromToken = session.tokens.idToken.payload.email;
          const savedUser = localStorage.getItem('user');
          
          if (savedUser) {
            // Use saved user data from localStorage but ensure userId and email are from token
            const userData = JSON.parse(savedUser);
            userData.userId = userIdFromToken; // Override with token userId
            userData.email = emailFromToken; // Override with token email
            userData.username = currentUser.username; // Override with current username
            
            console.log('✅ [AuthContext] Restored user from localStorage:', userData.email, 'Role:', userData.role, 'UserId:', userData.userId);
            
            if (isMounted) {
              setUser(userData);
              setIsAuthenticated(true);
              // Update localStorage with userId
              localStorage.setItem('user', JSON.stringify(userData));
            }
          } else {
            // Create user data from Cognito tokens
            const userGroups = session.tokens.accessToken.payload['cognito:groups'] || [];
            let userRole = 'candidate'; // default
            
            if (userGroups.includes('Admin')) {
              userRole = 'admin';
            } else if (userGroups.includes('Employer')) {
              userRole = 'employer';
            } else if (userGroups.includes('Candidate')) {
              userRole = 'candidate';
            }
            
            const userData = {
              username: currentUser.username,
              userId: session.tokens.idToken.payload.sub, // Use 'sub' from token as userId
              email: session.tokens.idToken.payload.email,
              role: userRole,
              approved: true
            };
            console.log('✅ [AuthContext] Created user from Cognito:', userData.email, 'Role:', userData.role, 'UserId:', userData.userId);
            
            if (isMounted) {
              setUser(userData);
              setIsAuthenticated(true);
              localStorage.setItem('user', JSON.stringify(userData));
            }
          }
        } else {
          // No valid Cognito session
          console.log('❌ [AuthContext] No valid Cognito session');
          if (isMounted) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.log('❌ [AuthContext] No authenticated user:', error.name, error.message);
        // No authenticated user, clear state
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          console.log('✅ [AuthContext] Auth check complete');
        }
      }
    };

    checkAuth();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
