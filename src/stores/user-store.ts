import { create } from 'zustand';

import type { User } from '@/entities/user';

interface UserStore {
  user: User | null;
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  hydrate: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null, // Sempre começar com null no servidor
  isHydrated: false,
  setUser: (user) => {
    set({ user });
    // Salvar no localStorage apenas no cliente
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  },
  fetchUser: async () => {
    try {
      const res = await fetch('/me/account', { credentials: 'include' });
      if (!res.ok) throw new Error('Erro ao buscar usuário');
      const data = await res.json();
      get().setUser(data);
    } catch {
      get().setUser(null);
    }
  },
  hydrate: () => {
    // Só executar no cliente após a hidratação
    if (typeof window !== 'undefined' && !get().isHydrated) {
      try {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        set({ user, isHydrated: true });
      } catch {
        set({ user: null, isHydrated: true });
      }
    }
  },
}));
