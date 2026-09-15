import { apiClient } from "./client";
import { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/auth.types";

export const authApi = {
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
