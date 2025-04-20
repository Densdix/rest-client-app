'use client';

import { useState, useEffect } from 'react';
import { ContentRequest } from '../../restclient/_components/Content';
import { getMethodColor } from '@/utils/getMethodColor';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { replaceVariables } from '@/utils/localstorage/variablesLocal';

export default function ContentHistory() {
  const [history, setHistory] = useState<(ContentRequest & { timestamp?: number })[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedHistory = localStorage.getItem('requestHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const navigateToRestClient = (request: ContentRequest) => {
    localStorage.setItem('currentRequest', JSON.stringify(request));
    router.push('/restclient');
  };

  const getDisplayValue = (text: string) => {
    return replaceVariables(text);
  };

  return (
    <div className="w-full h-full p-8 flex flex-col justify-center align-middle items-center">
      <h1 className="text-2xl font-bold mb-4">История запросов</h1>
      <div className="w-full max-w-3xl grid gap-4">
        {history.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">История запросов пуста</p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Вы ещё не выполнили ни одного запроса</p>
            <Link href="/restclient" className="text-blue-500 hover:text-blue-700 font-medium">
              Перейти к Rest клиенту
            </Link>
          </div>
        ) : (
          history
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer"
                onClick={() => navigateToRestClient(item)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full mr-2 ${getMethodColor(item.method)}`}>
                      {item.method}
                    </span>
                    <h3 className="font-bold text-lg truncate">{getDisplayValue(item.url)}</h3>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : new Date().toLocaleString()}
                  </span>
                </div>

                <div className="mt-3">
                  {item.body && (
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Тело запроса:</h4>
                      <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded text-sm font-mono overflow-hidden overflow-ellipsis">
                        {getDisplayValue(item.body).length > 100
                          ? `${getDisplayValue(item.body).substring(0, 100)}...`
                          : getDisplayValue(item.body)}
                      </div>
                    </div>
                  )}

                  {item.headers && item.headers.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Заголовки:</h4>
                      <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded text-sm">
                        {item.headers
                          .filter((h) => h.isActive)
                          .map((header, i) => (
                            <div key={i} className="font-mono text-xs">
                              <span className="font-semibold">{header.name}:</span> {getDisplayValue(header.value)}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
