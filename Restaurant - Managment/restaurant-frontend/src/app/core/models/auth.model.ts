export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  password: string;
  age: number;
  phoneNumber?: string;
  address?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresInSeconds: number;
  username: string;
  roles: string[];
}

export interface UserResponse {
  id: number;
  username: string;
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
