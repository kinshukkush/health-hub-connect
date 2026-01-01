import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthContextType, RegisterData } from '@/types';
import { mockUsers } from '@/data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('healthcareUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('healthcareUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock authentication - in production, this would be an API call
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      localStorage.setItem('healthcareUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `p${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role || 'patient',
      phone: data.phone,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('healthcareUser', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('healthcareUser');
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
