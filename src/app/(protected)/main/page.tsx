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
          <div className="w-100 h-100 m-auto border border-sky-500 p-6">
            <h1 className="text-2xl font-bold mb-4">Наше приложение</h1>
            <div className="flex flex-col space-y-4">
              <Link href="/(protected)/main" className="text-blue-500 hover:text-blue-700 underline">
                Открыть REST клиент
              </Link>
              <button
                onClick={() => dispatch(logout())}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-fit"
              >
                Разлогиниться
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10">
          <h1 className="text-3xl font-bold">Добро пожаловать!</h1>

          <Link href="/signin" className="text-blue-500 hover:text-blue-700 mr-4">
            Войти
          </Link>
          <Link href="/signup" className="text-blue-500 hover:text-blue-700">
            Регистрация
          </Link>
        </div>
      )}
      <Footer />
    </main>
  );
}
