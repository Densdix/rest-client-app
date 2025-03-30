import { SignUp } from '@/components/SignUp';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Регистрация</h1>
      <SignUp />

      <p>
        <Link href="/signin">Вход</Link>
      </p>
    </main>
  );
}
