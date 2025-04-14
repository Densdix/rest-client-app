import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="h-100">
        <div className="flex flex-col justify-center align-middle items-center">
          <h1 className="text-3xl font-bold">Добро пожаловать!</h1>
          <div>
            <Link href="/signin" className=" text-blue-600 hover:text-blue-700">
              Войти
            </Link>
            <Link href="/signup" className=" text-blue-600 hover:text-blue-700">
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
