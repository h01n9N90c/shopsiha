import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserProfileFields } from '../types';
import { useServices } from './ServiceContext';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileFields: UserProfileFields) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { authService } = useServices();

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [authService]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
       const loggedInUser = await authService.login(email, pass);
       setUser(loggedInUser);
    } catch (e) {
       console.error("Login failed", e);
       throw e;
    } finally {
       setIsLoading(false);
    }
  };

  const register = async (email: string, name: string) => {
    setIsLoading(true);
    try {
      const newUser = await authService.register(email, name);
      setUser(newUser);
    } catch (e) {
      console.error("Registration failed", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = (profileFields: UserProfileFields) => {
    if (!user) return;
    try {
      const updatedUser = authService.updateProfile(user.id, profileFields);
      setUser(updatedUser);
    } catch (e) {
      console.error("Failed to update profile", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
