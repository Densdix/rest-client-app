import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="p-10">
        <h1 className="text-3xl font-bold">Добро пожаловать!</h1>

        <Link href="/signin">Войти</Link>
        <Link href="/signup">Регистрация</Link>
      </div>
    </>
  );
}
