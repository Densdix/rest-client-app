import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function MainPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="w-full h-full p-8 flex flex-col justify-center align-middle items-center">
      <div className="flex items-center space-x-4 my-10">
        <span className="text-gray-400">{user.email}</span>
        <form action="/api/signout" method="post">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer ml-4"
            type="submit"
          >
            Выйти
          </button>
        </form>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/history" className=" cursor-pointer  text-gray-400 hover:text-gray-500">
          История
        </Link>
        <Link href="/restclient" className=" cursor-pointer  text-gray-400 hover:text-gray-500">
          Rest client
        </Link>
        <Link href="/variables" className=" cursor-pointer  text-gray-400 hover:text-gray-500">
          Переменные
        </Link>
      </div>
    </div>
  );
}
