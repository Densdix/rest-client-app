'use client';

import { useState, useEffect } from 'react';
import { ContentRequest } from '../../restclient/_components/Content';
import { getMethodColor } from '@/utils/getMethodColor';

export default function ContentHistory() {
  const [history, setHistory] = useState<ContentRequest[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('requestHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  return (
    <div className="w-full h-full p-8 flex flex-col justify-center align-middle items-center">
      <h1 className="text-2xl font-bold mb-4">История запросов</h1>
      <div className="w-full max-w-3xl grid gap-4">
        {history.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">История запросов пуста</p>
          </div>
        ) : (
          history.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full mr-2 ${getMethodColor(item.method)}`}>
                    {item.method}
                  </span>
                  <h3 className="font-bold text-lg truncate">{item.url}</h3>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString()}</span>
              </div>

              <div className="mt-3">
                {item.body && (
                  <div className="mb-2">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Тело запроса:</h4>
                    <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded text-sm font-mono overflow-hidden overflow-ellipsis">
                      {item.body.length > 100 ? `${item.body.substring(0, 100)}...` : item.body}
                    </div>
                  </div>
                )}

                {item.headers && item.headers.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Заголовки:</h4>
                    <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded text-sm">
                      {item.headers.map((header, i) => (
                        <div key={i} className="font-mono text-xs">
                          <span className="font-semibold">{header.name}:</span> {header.value}
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
