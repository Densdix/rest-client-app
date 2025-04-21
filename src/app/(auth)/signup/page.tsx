import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SignUpContent from './_components/Content';

export default async function SignOutPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/main');
  }

  return (
    <div className="w-full h-full">
      <SignUpContent />
    </div>
  );
}
