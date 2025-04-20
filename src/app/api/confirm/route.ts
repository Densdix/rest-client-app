import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

// Creating a handler to a GET request to route /api/confirm
//TODO: https://brianhhough.com/howto/how-to-fix-this-nextjs-error-no-http-methods-exported-in-export-a-named-export-for-each-http-method-instead
//fix with try catch for No HTTP methods exported for development
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;
    const next = '/main';

    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = next;
    redirectTo.searchParams.delete('token_hash');
    redirectTo.searchParams.delete('type');

    if (token_hash && type) {
      const supabase = await createClient();

      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });
      if (!error) {
        redirectTo.searchParams.delete('next');
        return NextResponse.redirect(redirectTo);
      }
    }

    redirectTo.pathname = '/error';
    return NextResponse.redirect(redirectTo);
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
