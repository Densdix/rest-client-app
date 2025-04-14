import Link from 'next/link';
import React from 'react';

export const Header = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow">
      <div className="p-4 w-full max-w-[1280px] mx-auto flex justify-between  align-middle items-center">
        <div>
          <Link href="/" className=" w-20 h-20 block bg-blue-600 hover:bg-blue-700 rounded-full">
            {/* <img src="/logo.png" alt="app logo" className="w-22 h-22" /> */}
          </Link>
        </div>
        <div>Lang</div>
        <Link href="/signin" className=" text-blue-600 hover:text-blue-700">
          Войти
        </Link>
        <Link href="/signup" className=" text-blue-600 hover:text-blue-700">
          Регистрация
        </Link>
      </div>
    </div>
  );
};
