import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthContextType, LoginCredentials, RegisterCredentials, AuthResponse, ApiError } from '@/types/auth';

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
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
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// API utility functions
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

// In-memory access token storage (secure against XSS)
let accessToken: string | null = null;

const apiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
    credentials: 'include', // Include httpOnly cookies
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message || 'An error occurred',
      status: response.status,
      field: data.field,
    } as ApiError;
  }

  return data;
};

// Context
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Try to get user data (this will use httpOnly refresh token)
      const response = await apiRequest('/auth/me');
      accessToken = response.accessToken;
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Authentication failed' });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response: AuthResponse = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      accessToken = response.accessToken;
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ type: 'AUTH_ERROR', payload: apiError.message });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response: AuthResponse = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      accessToken = response.accessToken;
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ type: 'AUTH_ERROR', payload: apiError.message });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if API call fails
    } finally {
      accessToken = null;
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const response = await apiRequest('/auth/refresh', { method: 'POST' });
      accessToken = response.accessToken;
      
      if (response.user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      }
    } catch (error) {
      // Refresh failed, log user out
      accessToken = null;
      dispatch({ type: 'AUTH_LOGOUT' });
      throw error;
    }
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

    const userLevel = roleHierarchy[state.user.role];
    const requiredLevel = roleHierarchy[role];

    return userLevel >= requiredLevel;
  };

  const isAdmin = (): boolean => {
    return hasRole('clubAdmin');
  };

  const isClubAdmin = (): boolean => {
    return hasRole('clubAdmin');
  };

  // Set up automatic token refresh (13 minutes, before 15-minute expiry)
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const interval = setInterval(() => {
      refreshToken().catch(() => {
        // Token refresh failed, user will be logged out
        console.log('Auto token refresh failed');
      });
    }, 13 * 60 * 1000); // 13 minutes

    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

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