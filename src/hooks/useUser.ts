import { useEffect } from 'react';
import { useUserStore } from '@/stores/user-store';

export function useUser() {
  const user = useUserStore((s) => s.user);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const fetchUser = useUserStore((s) => s.fetchUser);
  const setUser = useUserStore((s) => s.setUser);
  const hydrate = useUserStore((s) => s.hydrate);

  // Hidratar o store quando o componente montar no cliente
  useEffect(() => {
    if (!isHydrated) {
      hydrate();
    }
  }, [isHydrated, hydrate]);

  return { user, fetchUser, setUser, isHydrated };
}
