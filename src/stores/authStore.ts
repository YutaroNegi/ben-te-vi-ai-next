import { create } from "zustand";
import { AuthState } from "@/types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) =>
    set({ user, isAuthenticated: true, lastLogin: user.lastLogin }),
  logout: () => set({ user: null, isAuthenticated: false }),
  lastLogin: null,
}));
