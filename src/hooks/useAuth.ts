"use client";

import { create } from "zustand";
import { authApi } from "@/lib/api/auth.api";
import { User, LoginPayload, RegisterPayload } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitializing: true,
  error: null,

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.login(payload);
      localStorage.setItem("legalbuddy_token", res.token);
      set({ user: res.user, token: res.token, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.register(payload);
      localStorage.setItem("legalbuddy_token", res.token);
      set({ user: res.user, token: res.token, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("legalbuddy_token");
    }
    set({ user: null, token: null, error: null });
  },

  fetchUser: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("legalbuddy_token") : null;
    if (!token) {
      set({ user: null, token: null, isInitializing: false });
      return;
    }

    try {
      const res = await authApi.getMe();
      set({ user: res.user, token, isInitializing: false });
    } catch (err) {
      localStorage.removeItem("legalbuddy_token");
      set({ user: null, token: null, isInitializing: false });
    }
  },

  clearError: () => set({ error: null }),
}));
