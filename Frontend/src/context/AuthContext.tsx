import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthContextType, RegisterData } from '@/types';
import { userAPI } from '@/lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('healthcareUser');
    const token = localStorage.getItem('healthhub_token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('healthcareUser');
        localStorage.removeItem('healthhub_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const data = await userAPI.login(email, password);
      
      setUser(data.user);
      localStorage.setItem('healthcareUser', JSON.stringify(data.user));
      localStorage.setItem('healthhub_token', data.token);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await userAPI.register(data);
      
      setUser(response.user);
      localStorage.setItem('healthcareUser', JSON.stringify(response.user));
      localStorage.setItem('healthhub_token', response.token);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('healthcareUser');
    localStorage.removeItem('healthhub_token');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
