'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import {
  Variable,
  addVariable,
  deleteVariable,
  getVariablesFromStorage,
  updateVariable,
} from '@/utils/localstorage/variablesLocal';

interface VariableFormValues {
  name: string;
  value: string;
}

export const VariablesComponent: React.FC = () => {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedVariables = getVariablesFromStorage();
    setVariables(storedVariables);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue: setFormValue,
    formState: { errors },
  } = useForm<VariableFormValues>({
    defaultValues: {
      name: '',
      value: '',
    },
  });

  const resetForm = () => {
    reset();
    setEditId(null);
    setError(null);
  };

  const handleEdit = (id: string, name: string, value: string) => {
    setEditId(id);
    setFormValue('name', name);
    setFormValue('value', value);
  };

  const onSubmit = (data: VariableFormValues) => {
    if (!editId && variables.some((v) => v.name === data.name)) {
      setError(`Переменная с именем ${data.name} уже существует`);
      return;
    }

    try {
      if (editId) {
        const updatedVariable = updateVariable(editId, data.name, data.value);
        if (updatedVariable) {
          setVariables((prev) => prev.map((v) => (v.id === editId ? updatedVariable : v)));
        }
      } else {
        const newVariable = addVariable(data.name, data.value);
        setVariables((prev) => [...prev, newVariable]);
      }

      resetForm();
    } catch {
      setError('Ошибка при сохранении переменной');
    }
  };

  const handleDelete = (id: string) => {
    try {
      deleteVariable(id);
      setVariables((prev) => prev.filter((v) => v.id !== id));
    } catch {
      setError('Ошибка при удалении переменной');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Переменные</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? 'Редактировать переменную' : 'Добавить новую переменную'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block mb-2 font-medium">
                Имя переменной
              </label>
              <input
                id="name"
                {...register('name', {
                  required: 'Имя переменной не может быть пустым',
                })}
                placeholder="Например: API_KEY"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="value" className="block mb-2 font-medium">
                Значение
              </label>
              <input
                id="value"
                {...register('value')}
                placeholder="Значение переменной"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {editId ? 'Сохранить' : 'Добавить'}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Список переменных</h2>

        {variables.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">Нет сохраненных переменных</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Имя
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Значение
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Использование
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {variables.map((variable) => (
                  <tr key={variable.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{variable.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{variable.value}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {`{{${variable.name}}}`}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleEdit(variable.id, variable.name, variable.value)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(variable.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Как использовать переменные:</h3>
          <p className="mb-2">
            Используйте синтаксис <code className="bg-gray-200 dark:bg-gray-600 px-1">{'{{имя_переменной}}'}</code> в:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              URL запроса:{' '}
              <code className="bg-gray-200 dark:bg-gray-600 px-1">
                {'https://api.example.com/{{API_VERSION}}/users'}
              </code>
            </li>
            <li>
              Заголовках: <code className="bg-gray-200 dark:bg-gray-600 px-1">{'Authorization: Bearer {{TOKEN}}'}</code>
            </li>
            <li>
              Теле JSON-запроса:{' '}
              <code className="bg-gray-200 dark:bg-gray-600 px-1">{'{ "api_key": "{{API_KEY}}" }'}</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
