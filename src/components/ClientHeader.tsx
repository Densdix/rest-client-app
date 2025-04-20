'use client';

import Link from 'next/link';
import React, { useState, useEffect, FC, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';

export const ClientHeader: FC<{ user: User | null }> = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = useCallback(() => {
    const newLanguage = language === 'en' ? 'ru' : 'en';
    changeLanguage(newLanguage);
  }, [language, changeLanguage]);

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
          <button
            onClick={handleLanguageChange}
            className="px-2 py-1 border border-gray-300 rounded min-w-[48px] text-center"
          >
            {language === 'en' ? 'RU' : 'EN'}
          </button>
        </div>
        {user ? (
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4 mr-30">
              <Link
                href="/history"
                className={`cursor-pointer ${isScrolled ? 'text-white' : 'text-gray-400'} hover:text-gray-500 transition-colors min-w-[80px] text-center`}
              >
                {t('common.history')}
              </Link>
              <Link
                href="/restclient"
                className={`cursor-pointer ${isScrolled ? 'text-white' : 'text-gray-400'} hover:text-gray-500 transition-colors min-w-[100px] text-center`}
              >
                {t('common.restClient')}
              </Link>
              <Link
                href="/variables"
                className={`cursor-pointer ${isScrolled ? 'text-white' : 'text-gray-400'} hover:text-gray-500 transition-colors min-w-[90px] text-center`}
              >
                {t('common.variables')}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">{user.email}</span>
              <form action="/api/signout" method="post">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer ml-4 transition-colors min-w-[80px]"
                  type="submit"
                >
                  {t('common.logout')}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex space-x-6">
            <Link
              href="/signin"
              className="text-gray-400 hover:text-gray-500 transition-colors min-w-[60px] text-center"
            >
              {t('common.login')}
            </Link>
            <Link
              href="/signup"
              className="text-gray-400 hover:text-gray-500 transition-colors min-w-[60px] text-center"
            >
              {t('common.signup')}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
