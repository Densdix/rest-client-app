import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Variable } from '@/utils/localstorage/variablesLocal';
import { ContentRequest } from './Content';

interface Props {
  variables: Variable[];
  register: UseFormRegister<ContentRequest>;
  isMounted: boolean;
}

export const RequestBodyBlock: React.FC<Props> = ({ variables, register, isMounted }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <h3 className="font-medium mb-2">Request Body</h3>
      <textarea
        id="body"
        {...register('body')}
        className="w-full h-60 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
        placeholder="Enter request body"
      ></textarea>

      {isMounted && variables.length > 0 && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <p>Вы можете использовать переменные в формате {'{{{имя_переменной}}}'}</p>
          <p>Доступные переменные: {variables.map((v) => `{{${v.name}}}`).join(', ')}</p>
        </div>
      )}
    </div>
  );
};
