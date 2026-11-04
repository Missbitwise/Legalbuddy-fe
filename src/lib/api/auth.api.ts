import { apiClient } from "./client";
import { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/auth.types";

export const authApi = {
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>("/auth/forgot-password", { email });
    return data;
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>("/auth/reset-password", { token, password });
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async getMe(): Promise<{ user: User }> {
    const { data } = await apiClient.get<{ user: User }>("/auth/me");
    return data;
  },
};
