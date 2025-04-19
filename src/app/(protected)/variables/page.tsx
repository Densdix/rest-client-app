import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function VariablesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="w-full h-full p-8 flex flex-col justify-center align-middle items-center">
      <div className="flex items-center space-x-4 my-10">Variables</div>
    </div>
  );
}
