import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import HistoryClientWrapper from './ClientComponent';

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="w-full h-full">
      <HistoryClientWrapper />
    </div>
  );
}
