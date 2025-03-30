import { useAppSelector } from '@/hooks/redux.hook';

interface RootState {
  auth: {
    email: string | null;
    token: string | null;
    id: string | null;
  };
}

export function useAuth() {
  const { email, token, id } = useAppSelector((state: RootState) => state.auth);

  return {
    isAuth: !!email,
    email,
    token,
    id,
  };
}
