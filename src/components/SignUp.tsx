'use client';

import { useAppDispatch } from '@/hooks/redux.hook';
import { useRouter } from 'next/navigation';
import { Form } from './Form';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { login } from '@/store/authSlice';

export const SignUp = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignUp = (email: string, password: string) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
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
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);
        switch (error.code) {
          case 'auth/invalid-credential':
            alert('Неверный email или пароль');
            break;
          case 'auth/user-not-found':
            alert('Пользователь не найден');
            break;
          case 'auth/wrong-password':
            alert('Неверный пароль');
            break;
          default:
            alert('Произошла ошибка при входе');
        }
      });
  };

  return <Form title="Регистрация" handleClick={handleSignUp} />;
};
