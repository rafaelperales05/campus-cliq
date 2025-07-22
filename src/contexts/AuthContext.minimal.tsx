import React, { createContext, useContext, ReactNode } from 'react';

// Minimal auth context for debugging
interface MinimalUser {
  name: string;
  role: string;
}

interface MinimalAuthContext {
  user: MinimalUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<MinimalAuthContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  console.log("✅ AuthProvider rendering...");
  
  const mockUser: MinimalUser = {
    name: "John Doe",
    role: "student"
  };

  const value: MinimalAuthContext = {
    user: mockUser,
    isAuthenticated: true,
    isLoading: false,
    logout: () => console.log("Logout clicked"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): MinimalAuthContext => {
  console.log("✅ useAuth called...");
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};