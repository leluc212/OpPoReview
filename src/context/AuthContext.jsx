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
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Check Cognito session on mount and after refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Checking authentication...');
        
        // Try to get current Cognito user
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        
        console.log('✅ Cognito user found:', currentUser);
        console.log('✅ Session tokens:', session.tokens ? 'Present' : 'Missing');
        
        if (currentUser && session.tokens) {
          // User is authenticated with Cognito
          const savedUser = localStorage.getItem('user');
          
          if (savedUser) {
            // Use saved user data from localStorage
            const userData = JSON.parse(savedUser);
            console.log('✅ Restored user from localStorage:', userData.email, 'Role:', userData.role);
            setUser(userData);
            setIsAuthenticated(true);
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
              userId: currentUser.userId,
              email: session.tokens.idToken.payload.email,
              role: userRole,
              approved: true
            };
            console.log('✅ Created user from Cognito:', userData.email, 'Role:', userData.role);
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } else {
          // No valid Cognito session
          console.log('❌ No valid Cognito session');
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.log('❌ No authenticated user:', error.name, error.message);
        // No authenticated user, clear state
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
        console.log('✅ Auth check complete. Authenticated:', isAuthenticated);
      }
    };

    checkAuth();
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
