// 'use client';

import { createClient } from '@/utils/supabase/server';
// import { useRouter } from 'next/navigation';
import { Content } from './_components/Content';
import { redirect } from 'next/navigation';

// type ResponseData = {
//   message: string;
//   about: string;
//   createdBy: string;
//   launched: number;
//   features: {
//     git: string;
//     themes: string;
//     data: string;
//     testing: string;
//     local: string;
//   };
//   supports?: {
//     graphql?: boolean;
//     codeSnippet?: boolean;
//     requestChaining?: boolean;
//     scripting?: boolean;
//   };
// };

export default async function MainPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('user111: ', user);

  // const router = useRouter();

  // async function checkAuth() {
  //   try {
  //     const res = await fetch('/api/user');
  //     if (!res.ok) {
  //       router.push('/signin');
  //       return;
  //     }

  //     const userData = await res.json();
  //     setUser(userData.user);
  //   } catch (error) {
  //     console.error('Ошибка проверки аутентификации:', error);
  //     router.push('/signin');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // const handleSend = async () => {
  //   try {
  //     const startTime = Date.now();

  //     // Имитация запроса или реальный запрос
  //     // В реальном приложении здесь был бы fetch к указанному URL
  //     setStatus('200 OK');

  //     // Имитация ответа
  //     const mockResponse = {
  //       message: 'Welcome to REST Client',
  //       about: 'Lightweight Rest API Client for Next.js',
  //       createdBy: 'Your Name',
  //       launched: 2023,
  //       features: {
  //         git: 'Save data to Git Workspace',
  //         themes: 'Supports Dark/Light Themes',
  //         data: 'Collections & Environment Variables',
  //         testing: 'Scriptless Testing',
  //         local: 'Local Storage & Works Offline',
  //       },
  //       supports: {
  //         graphql: true,
  //         codeSnippet: true,
  //         requestChaining: true,
  //         scripting: true,
  //       },
  //     };

  // Рассчитываем размер и время
  //     const responseText = JSON.stringify(mockResponse);
  //     setSize(`${responseText.length} Bytes`);
  //     setTime(`${Date.now() - startTime} ms`);
  //     setResponse(mockResponse);
  //   } catch (error) {
  //     console.error('Error sending request:', error);
  //     setStatus('Error');
  //     setResponse(null);
  //   }
  // };
  if (!user) {
    console.log('no user');
    console.log({ user });
    // revalidatePath('/', 'layout');
    redirect('/signin');
  }

  return <Content user={user} />;
}
