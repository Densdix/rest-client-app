import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Получаем данные текущего пользователя
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // Если произошла ошибка или пользователь не найден
    if (error || !user) {
      return NextResponse.json(
        {
          error: 'Пользователь не аутентифицирован',
          message: error?.message || 'Необходима авторизация',
        },
        { status: 401 }
      );
    }

    // Возвращаем данные пользователя (без чувствительной информации)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        lastSignInAt: user.last_sign_in_at,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
