'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ResponseData = {
  message: string;
  about: string;
  createdBy: string;
  launched: number;
  features: {
    git: string;
    themes: string;
    data: string;
    testing: string;
    local: string;
  };
  supports?: {
    graphql?: boolean;
    codeSnippet?: boolean;
    requestChaining?: boolean;
    scripting?: boolean;
  };
};

export default function MainPage() {
  const router = useRouter();
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [status, setStatus] = useState('');
  const [size, setSize] = useState('');
  const [time, setTime] = useState('');
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/user');
        if (!res.ok) {
          router.push('/signin');
          return;
        }

        const userData = await res.json();
        setUser(userData.user);
      } catch (error) {
        console.error('Ошибка проверки аутентификации:', error);
        router.push('/signin');
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const handleSend = async () => {
    try {
      const startTime = Date.now();

      // Имитация запроса или реальный запрос
      // В реальном приложении здесь был бы fetch к указанному URL
      setStatus('200 OK');

      // Имитация ответа
      const mockResponse = {
        message: 'Welcome to REST Client',
        about: 'Lightweight Rest API Client for Next.js',
        createdBy: 'Your Name',
        launched: 2023,
        features: {
          git: 'Save data to Git Workspace',
          themes: 'Supports Dark/Light Themes',
          data: 'Collections & Environment Variables',
          testing: 'Scriptless Testing',
          local: 'Local Storage & Works Offline',
        },
        supports: {
          graphql: true,
          codeSnippet: true,
          requestChaining: true,
          scripting: true,
        },
      };

      // Рассчитываем размер и время
      const responseText = JSON.stringify(mockResponse);
      setSize(`${responseText.length} Bytes`);
      setTime(`${Date.now() - startTime} ms`);
      setResponse(mockResponse);
    } catch (error) {
      console.error('Error sending request:', error);
      setStatus('Error');
      setResponse(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">REST/GraphQL API</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">{user?.email}</span>
          <form action="/api/signout" method="post">
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" type="submit">
              Выйти
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-1 p-4">
        {/* Левая панель - параметры запроса */}
        <div className="w-1/2 pr-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
            <div className="flex items-center mb-4">
              <select
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mr-2 bg-white dark:bg-gray-700"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>

              <input
                type="text"
                placeholder="Enter request URL"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mr-2 bg-white dark:bg-gray-700"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleSend}>
                Send
              </button>
            </div>

            <div className="border-b dark:border-gray-700 mb-4">
              <div className="flex space-x-4 mb-2">
                <button className="px-3 py-1 border-b-2 border-blue-500 font-medium">Query Params</button>
                <button className="px-3 py-1 text-gray-500 dark:text-gray-400">Headers</button>
                <button className="px-3 py-1 text-gray-500 dark:text-gray-400">Auth</button>
                <button className="px-3 py-1 text-gray-500 dark:text-gray-400">Body</button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <input
                  type="text"
                  placeholder="Parameter name"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mr-2 bg-white dark:bg-gray-700"
                />
                <input
                  type="text"
                  placeholder="Value"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-medium mb-2">Request Body</h3>
            <textarea
              className="w-full h-60 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              placeholder="Enter request body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Правая панель - ответ */}
        <div className="w-1/2 pl-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-full">
            <div className="flex justify-between items-center mb-4 text-sm">
              <div className="text-green-500 font-medium">Status: {status}</div>
              <div className="text-gray-500">Size: {size}</div>
              <div className="text-gray-500">Time: {time}</div>
            </div>

            <div className="border-b dark:border-gray-700 mb-4">
              <div className="flex space-x-4 mb-2">
                <button className="px-3 py-1 border-b-2 border-blue-500 font-medium">Response</button>
                <button className="px-3 py-1 text-gray-500 dark:text-gray-400">Headers</button>
                <button className="px-3 py-1 text-gray-500 dark:text-gray-400">Cookies</button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 p-4 h-96 overflow-y-auto">
              {response && <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
