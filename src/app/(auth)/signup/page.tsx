import { signup } from './actions';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Регистрация</h1>
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={signup}>Sign up</button>
      </form>

      <p>
        <Link href="/signin">Уже есть аккаунт? Вход.</Link>
      </p>
    </main>
  );
}
