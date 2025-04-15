import Link from 'next/link';
import React from 'react';
import { createClient } from '@/utils/supabase/server';

export const Header = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-white dark:bg-gray-800 shadow">
      <div className="p-4 w-full max-w-[1280px] mx-auto flex justify-between  align-middle items-center">
        <div>
          <Link href="/" className=" w-20 h-20 block bg-blue-600 hover:bg-blue-700 rounded-full">
            {/* <img src="/logo.png" alt="app logo" className="w-22 h-22" /> */}
          </Link>
        </div>
        <div>Lang</div>
        {user ? (
          <div>
            {user.email}
            <form action="/api/signout" method="post">
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" type="submit">
                Выйти
              </button>
            </form>
          </div>
        ) : (
          <>
            <Link href="/signin" className=" text-blue-600 hover:text-blue-700">
              Войти
            </Link>
            <Link href="/signup" className=" text-blue-600 hover:text-blue-700">
              Регистрация
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
