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
    <>
      <h1 className="text-2xl font-bold">GraphQL API</h1>
      <h1 className="text-2xl font-bold">{user?.email}</h1>
      <form action="/api/signout" method="post">
        <button className="button block" type="submit" style={{ cursor: 'pointer', backgroundColor: 'red' }}>
          Sign out
        </button>
      </form>
    </>
  );
}
