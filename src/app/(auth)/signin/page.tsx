import { login } from './actions';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Вход</h1>
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={login}>Log in</button>
      </form>

      <p>
        <Link href="/signup">Еще не зарегистрированы? Регистрация.</Link>
      </p>
    </main>
  );
}
