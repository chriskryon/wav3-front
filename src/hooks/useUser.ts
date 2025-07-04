import { useUserStore } from '@/stores/user-store';

export function useUser() {
  const user = useUserStore((s: { user: any }) => s.user);
  const fetchUser = useUserStore((s: { fetchUser: any }) => s.fetchUser);
  const setUser = useUserStore((s: { setUser: any }) => s.setUser);

  return { user, fetchUser, setUser };
}
