import { createClient } from '@/utils/supabase/server';
import { Content } from './_components/Content';
import { redirect } from 'next/navigation';

export default async function RestClientPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  return <Content />;
}
