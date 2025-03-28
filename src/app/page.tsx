import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Входная страница</h1>

      <Link href="/login">Войти</Link>
      <Link href="/register">Регистрация</Link>
    </main>
  );
}
