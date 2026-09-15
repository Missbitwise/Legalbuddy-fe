export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  fullName?: string | null;
  role: UserRole;
  isVerified?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiErrorResponse {
  message: string;
}
