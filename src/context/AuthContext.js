import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    console.log('🔐 AuthContext: Attempting login with:', { email });
    
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;
    
    console.log('✅ AuthContext: Login successful:', user);
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    return user;
  };

  const register = async (userData) => {
    console.log('📝 AuthContext: Attempting registration with:', userData);
    
    // ✅ IMPORTANT: Envoyer les données correctement
    const response = await authAPI.register({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role
    });
    
    const { token, user } = response.data;
    
    console.log('✅ AuthContext: Registration successful:', user);
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    return user;
  };

  const logout = () => {
    console.log('👋 AuthContext: Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isEmployer = () => user?.role === 'employer';
  const isSeeker = () => user?.role === 'seeker';

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isEmployer,
    isSeeker,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};