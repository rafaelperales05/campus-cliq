import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, AuthState, AuthContextType, LoginCredentials, RegisterCredentials } from '@/types/auth';

// Development mode - set to true to bypass authentication
const DEV_MODE = true;

// Mock user for development
const mockUser: User = {
  id: '1',
  email: 'john.doe@university.edu',
  name: 'John Doe',
  role: 'student',
  major: 'Computer Science',
  year: 'Junior',
  residence: 'North Campus',
  avatar: '/placeholder.svg',
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Initial state
const initialState: AuthState = {
  user: DEV_MODE ? mockUser : null,
  isAuthenticated: DEV_MODE,
  isLoading: false, // Changed from !DEV_MODE to false to avoid loading issues
  error: null,
};

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false, error: null };
    case 'AUTH_ERROR':
      return { ...state, user: null, isAuthenticated: false, isLoading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isLoading: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// Context
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Simplified functions for dev mode
  const login = async (credentials: LoginCredentials): Promise<void> => {
    if (DEV_MODE) {
      console.log('🚀 Dev mode login:', credentials.email);
      dispatch({ type: 'AUTH_SUCCESS', payload: mockUser });
      return;
    }
    // TODO: Real login implementation
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    if (DEV_MODE) {
      console.log('🚀 Dev mode register:', credentials.email);
      const newUser = { ...mockUser, ...credentials };
      dispatch({ type: 'AUTH_SUCCESS', payload: newUser });
      return;
    }
    // TODO: Real register implementation
  };

  const logout = async (): Promise<void> => {
    console.log('🚪 Logout');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const refreshToken = async (): Promise<void> => {
    // No-op in dev mode
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Role checking utilities
  const hasRole = (role: User['role']): boolean => {
    if (!state.user) return false;
    const roleHierarchy: Record<User['role'], number> = {
      student: 0,
      clubAdmin: 1,
      superAdmin: 2,
    };
    return roleHierarchy[state.user.role] >= roleHierarchy[role];
  };

  const isAdmin = (): boolean => {
    return hasRole('clubAdmin');
  };

  const isClubAdmin = (): boolean => {
    return hasRole('clubAdmin');
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    refreshToken,
    clearError,
    hasRole,
    isAdmin,
    isClubAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};