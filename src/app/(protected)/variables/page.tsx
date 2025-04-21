import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { VariablesClientWrapper } from './ClientComponent';

export default async function VariablesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="w-full">
      <VariablesClientWrapper />
    </div>
  );
}
