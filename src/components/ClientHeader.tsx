'use client';

import Link from 'next/link';
import React, { useState, useEffect, FC } from 'react';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';

export const ClientHeader: FC<{ user: User | null }> = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'bg-white/95 dark:bg-cyan-900/95 shadow-md py-2' : 'bg-white dark:bg-gray-800 shadow py-4'
      }`}
    >
      <div className="px-8 w-full max-w-[1280px] mx-auto flex justify-between align-middle items-center">
        <div>
          <Link href="/" className="block bg-gray-400 hover:bg-gray-500 rounded-full transition-all duration-300">
            <Image
              src="/logo.jpg"
              alt="app logo"
              width={512}
              height={512}
              className="w-22 h-22 rounded-full object-cover"
            />
          </Link>
        </div>
        <div className="text-gray-400 cursor-pointer hover:text-gray-500 transition-colors">
          <button>RU / EN</button>
        </div>
        {user ? (
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4 mr-30">
              <Link
                href="/history"
                className={`cursor-pointer ${isScrolled ? 'text-white' : 'text-gray-400'} hover:text-gray-500 transition-colors`}
              >
                История
              </Link>
              <Link
                href="/restclient"
                className={`cursor-pointer ${isScrolled ? 'text-white' : 'text-gray-400'} hover:text-gray-500 transition-colors`}
              >
                Rest client
              </Link>
              <Link
                href="/variables"
                className={`cursor-pointer ${isScrolled ? 'text-white' : 'text-gray-400'} hover:text-gray-500 transition-colors`}
              >
                Переменные
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">{user.email}</span>
              <form action="/api/signout" method="post">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer ml-4 transition-colors"
                  type="submit"
                >
                  Выйти
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            <Link href="/signin" className="text-gray-400 hover:text-gray-500 transition-colors">
              Войти
            </Link>
            <Link href="/signup" className="text-gray-400 hover:text-gray-500 transition-colors">
              Регистрация
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
