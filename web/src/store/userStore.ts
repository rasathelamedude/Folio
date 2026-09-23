import { create } from "zustand";
import type { UserProfile } from "~/types/user";

interface UserStore {
  isAuthLoading: boolean;
  user: UserProfile | null;
  setIsAuthLoading: (isAuthLoading: boolean) => void;
  setUser: (user: UserProfile | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  isAuthLoading: true,
  user: null,
  setIsAuthLoading: (isAuthLoading: boolean) => set({ isAuthLoading }),
  setUser: (user: UserProfile | null) => set({ user }),
}));
