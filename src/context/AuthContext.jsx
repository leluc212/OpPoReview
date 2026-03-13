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
        
        // Try to get current Cognito user
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        
        if (currentUser && session.tokens) {
          // User is authenticated with Cognito
          const savedUser = localStorage.getItem('user');
          
          if (savedUser) {
            // Use saved user data from localStorage
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Create user data from Cognito
            const userData = {
              username: currentUser.username,
              userId: currentUser.userId,
              email: session.tokens.idToken.payload.email,
              role: session.tokens.idToken.payload['custom:role'] || 'candidate'
            };
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } else {
          // No valid Cognito session
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.log('No authenticated user:', error);
        // No authenticated user, clear state
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
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
