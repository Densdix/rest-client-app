'use client';

import React, { useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

export const Content: React.FC = () => {
  const lastInput = useRef<EventTarget & HTMLInputElement>(null);

  const { register, handleSubmit, control, setValue, getValues } = useForm<{
    url: string;
    method: string;
    body: string;
    paramNames: { name: string; value: string }[];
  }>({
    defaultValues: {
      url: '',
      paramNames: [{ name: '', value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'paramNames',
  });

  useEffect(() => {
    lastInput.current?.focus();
  }, [fields]);

  function createUrl() {
    const currentUrl = getValues('url').includes('?') ? getValues('url').split('?')[0] : getValues('url');

    const params = getValues('paramNames')
      .filter((field) => field.value && field.name)
      .map((field) => {
        return `${field.name}=${field.value}`;
      })
      .join('&');

    const newUrl = params ? `${currentUrl}?${params}` : currentUrl;
    if (newUrl !== getValues('url')) {
      setValue('url', newUrl);
    }
  }

  function handleAppend(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const fieldName = e.target.name.split('.').pop();
    const value = e.target.value;

    if (fieldName === 'name') {
      setValue(`paramNames.${index}.name`, value);
    } else if (fieldName === 'value') {
      setValue(`paramNames.${index}.value`, value);
    }

    createUrl();

    if (fields.length - 1 === index) {
      append({ name: '', value: '' });
      lastInput.current = e.target;
    }
  }

  return (
    <div>
      <div className="p-4">
        <form onSubmit={handleSubmit((data) => console.log(data))}>
          <div className="flex flex-1 p-4">
            <div className="w-1/2 pr-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
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

                <div className="border-b dark:border-gray-700 mb-4">
                  <div className="flex space-x-4 mb-2">
                    <button className="px-3 py-1 border-b-2 border-blue-500 font-medium">Query Params</button>
                    <button className="px-3 py-1 text-gray-500 dark:text-gray-400">Headers</button>
                    <button className="px-3 py-1 text-gray-500 dark:text-gray-400">Auth</button>
                    <button className="px-3 py-1 text-gray-500 dark:text-gray-400">Body</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col items-center p-4 border ">
                    {fields.map((field, index) => (
                      <div className="flex" key={field.id}>
                        <input type="checkbox" className="mr-2" />
                        <input
                          className="border border-gray-300 dark:border-gray-600 rounded-md mr-2 bg-white dark:bg-gray-700"
                          {...register(`paramNames.${index}.name`)}
                          onChange={(e) => handleAppend(index, e)}
                        />
                        <input
                          className="border border-gray-300 dark:border-gray-600 rounded-md mr-2 bg-white dark:bg-gray-700"
                          {...register(`paramNames.${index}.value`)}
                          onChange={(e) => handleAppend(index, e)}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (fields.length > 1) remove(index);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="font-medium mb-2">Request Body</h3>
                <textarea
                  id="body"
                  {...register('body')}
                  className="w-full h-60 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  placeholder="Enter request body"
                ></textarea>
              </div>
            </div>

            <div className="w-1/2 pl-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-full">
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
        </form>
      </div>
    </div>
  );
};
