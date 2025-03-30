'use client';

import { useAppDispatch } from '@/hooks/redux.hook';
import { useRouter } from 'next/navigation';
import { Form } from './Form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { login } from '@/store/authSlice';

export const SignIn = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignIn = (email: string, password: string) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const token = await userCredential.user.getIdToken();
        dispatch(
          login({
            email: userCredential.user.email,
            token,
            id: userCredential.user.uid,
          })
        );
        router.push('/');
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  };

  return <Form title="Вход" handleClick={handleSignIn} />;
};
