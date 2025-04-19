import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ContentHistory from './_components/Content';

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="w-full h-full p-8 flex flex-col justify-center align-middle items-center">
      <ContentHistory />
    </div>
  );
}
