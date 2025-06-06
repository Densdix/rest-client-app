import Link from 'next/link';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/main');
  }

  return (
    <>
      <div className="">
        <div className="flex flex-col justify-between align-middle items-center">
          <div className="pt-10 pb-10">
            <h4 className="text-3xl font-bold">Добро пожаловать!</h4>
          </div>
          <div className="flex w-50 justify-between">
            <Link href="/signin" className="block text-blue-600 hover:text-blue-700">
              Войти
            </Link>
            <Link href="/signup" className="block text-blue-600 hover:text-blue-700">
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
