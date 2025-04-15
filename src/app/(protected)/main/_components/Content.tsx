'use client';

import { User } from '@supabase/supabase-js';
// import { User } from '@/types/User';
import React from 'react';
import { useState } from 'react';

export const Content: React.FC<{ user: User }> = ({ user }) => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  // const [response] = useState<unknown | null>(null);
  const [status] = useState('');
  const [size] = useState('');
  const [time] = useState('');

  return (
    <div>
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

                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={() => {}}>
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
                {/* {response && <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
