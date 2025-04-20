import React from 'react';
import { UseFormRegister, UseFormGetValues } from 'react-hook-form';
import { ContentRequest } from './Content';
import { Variable, replaceVariables } from '@/utils/localstorage/variablesLocal';

interface Props {
  register: UseFormRegister<ContentRequest>;
  getValues: UseFormGetValues<ContentRequest>;
  isMounted: boolean;
  variables: Variable[];
}

export const UrlBlock: React.FC<Props> = ({ register, getValues, isMounted, variables }) => {
  const getPreviewUrl = () => {
    const url = getValues('url');
    if (!url) return url;

    return replaceVariables(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <select
            id="method"
            {...register('method')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mr-2 bg-white dark:bg-gray-700"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>

          <input
            id="url"
            {...register('url')}
            type="text"
            placeholder="Enter request URL"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mr-2 bg-white dark:bg-gray-700"
          />

          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" type="submit">
            Send
          </button>
        </div>

        {/* Предпросмотр URL с переменными - только после монтирования */}
        {isMounted && variables.length > 0 && getValues('url') && (
          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            <div>URL с переменными:</div>
            <div className="font-mono bg-gray-100 dark:bg-gray-900 p-1 rounded overflow-x-auto">{getPreviewUrl()}</div>
          </div>
        )}
      </div>
    </div>
  );
};
