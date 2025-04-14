import Link from 'next/link';
import React from 'react';

export const Header = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow">
      <div className="p-4 w-full max-w-[1280px] mx-auto flex justify-between  align-middle items-center">
        <div>
          <Link href="/" className="">
            <img src="/logo.png" alt="app logo" className="w-22 h-22" />
          </Link>
        </div>
        <div>Lang</div>
        <div>Войти</div>
        <div>Регистрация</div>
      </div>
    </div>
  );
};
