import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { ClientHeader } from './ClientHeader';

export const Header = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ClientHeader user={user} />;
};
