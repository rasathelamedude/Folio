import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile } from "~/types/user";

interface UserStore {
  isAuthLoading: boolean;
  user: UserProfile | null;
  setIsAuthLoading: (isAuthLoading: boolean) => void;
  setUser: (user: UserProfile | null) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isAuthLoading: true,
      user: null,

      setIsAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "folio-user",
      storage: createJSONStorage(() => sessionStorage),

      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);
