'use client';

import Link from 'next/link';
import { useAppDispatch } from '@/hooks/redux.hook';
import { logout } from '@/store/authSlice';

import { useAuth } from '@/hooks/auth.hook';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Home() {
  const dispatch = useAppDispatch();
  const { isAuth } = useAuth();

  return (
    <main className="min-h-screen p-8">
      <Header />
      {isAuth ? (
        <div>
          <div className="w-100 h-100 m-auto border border-sky-500">Наше приложение</div>
          <button onClick={() => dispatch(logout())}>Разлогиниться</button>
        </div>
      ) : (
        <div className="p-10">
          <h1 className="text-3xl font-bold">Добро пожаловать!</h1>

          <Link href="/signin">Войти</Link>
          <Link href="/signup">Регистрация</Link>
        </div>
      )}
      <Footer />
    </main>
  );
}
