
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  age: number;
  phoneNumber?: string;
  address?: string;
}

export interface AuthResponse {
  tokenType: string;
  expiresInSeconds: number;
  username: string;
  roles: string[];
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  age: number;
  phoneNumber: string | null;
  address: string | null;
  roles: string[];
  createdDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
  timestamp: string;
}
