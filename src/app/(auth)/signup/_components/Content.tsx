'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { signup } from '../actions';
import Link from 'next/link';

interface FormSignUp {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<FormSignUp>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Получаем значение пароля для валидации подтверждения пароля
  const password = watch('password');

  const onSubmit: SubmitHandler<FormSignUp> = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);

      const response = await signup(formData);

      if (response?.error) {
        setError('root', {
          type: 'server',
          message: response.error || 'Ошибка при регистрации. Попробуйте еще раз.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Создайте аккаунт</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email обязателен',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Некорректный формат email',
                  },
                })}
                className={`appearance-none relative block w-full px-3 py-2 border 
                  ${errors.email ? 'border-red-500' : 'border-gray-300'} 
                  dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 
                  text-gray-900 dark:text-white rounded-md focus:outline-none 
                  focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm 
                  bg-white dark:bg-gray-700`}
                placeholder="Email адрес"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register('password', {
                  required: 'Пароль обязателен',
                  minLength: {
                    value: 6,
                    message: 'Пароль должен содержать минимум 6 символов',
                  },
                })}
                className={`appearance-none relative block w-full px-3 py-2 border 
                  ${errors.password ? 'border-red-500' : 'border-gray-300'} 
                  dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 
                  text-gray-900 dark:text-white rounded-md focus:outline-none 
                  focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm 
                  bg-white dark:bg-gray-700`}
                placeholder="Пароль"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Подтвердите пароль
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword', {
                  required: 'Подтверждение пароля обязательно',
                  validate: (value) => value === password || 'Пароли не совпадают',
                })}
                className={`appearance-none relative block w-full px-3 py-2 border 
                  ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} 
                  dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 
                  text-gray-900 dark:text-white rounded-md focus:outline-none 
                  focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm 
                  bg-white dark:bg-gray-700`}
                placeholder="Подтвердите пароль"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {errors.root && <div className="text-center text-red-600 dark:text-red-400">{errors.root.message}</div>}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border 
                border-transparent text-sm font-medium rounded-md text-white 
                bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-blue-500
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Регистрация...
                </span>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/signin"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Уже есть аккаунт? Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
