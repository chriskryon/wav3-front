import { create } from 'zustand';

import type { User } from "@/entities/user";

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

const initialUser = typeof window !== "undefined"
  ? (() => {
      try {
        return JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        return null;
      }
    })()
  : null;

export const useUserStore = create<UserStore>((set) => ({
  user: initialUser,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    try {
      const res = await fetch('/me/account', { credentials: 'include' });
      if (!res.ok) throw new Error('Erro ao buscar usuário');
      const data = await res.json();
      console.log("Fetched user data:", data);
      set({ user: data });
    } catch {
      set({ user: null });
    }
  },
}));
