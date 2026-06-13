import { create } from "zustand";
import type { User } from "../types/User";

interface UserStore {
  isAuthLoading: boolean;
  user: User | null;
  setIsAuthLoading: (isAuthLoading: boolean) => void;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  isAuthLoading: true,
  user: null,
  setIsAuthLoading: (isAuthLoading: boolean) => set({ isAuthLoading }),
  setUser: (user: User | null) => set({ user }),
}));
