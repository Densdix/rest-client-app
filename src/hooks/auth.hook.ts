import { useAppSelector } from '@/hooks/redux.hook';

interface RootState {
  auth: {
    email: string | undefined;
    token: string | undefined;
    id: string | undefined;
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
