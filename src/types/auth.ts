export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'clubAdmin' | 'superAdmin';
  major?: string;
  year?: string;
  residence?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  major?: string;
  year?: string;
  residence?: string;
}

export interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  
  // Role checks
  hasRole: (role: User['role']) => boolean;
  isAdmin: () => boolean;
  isClubAdmin: () => boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  field?: string;
}