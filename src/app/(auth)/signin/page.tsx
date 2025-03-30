import { SignIn } from '@/components/SignIn';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Вход</h1>
      <SignIn />

      <p>
        <Link href="/signup">Регистрация</Link>
      </p>
    </main>
  );
}
