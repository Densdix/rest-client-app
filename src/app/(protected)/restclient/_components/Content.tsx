'use client';

import { recordRequest } from '@/utils/localstorage/recordRequest';
import React, { useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { sendRequest } from './action';
import { generateRequestCode } from '@/utils/generateRequestCode';
import { Variable, getVariablesFromStorage, replaceVariables } from '@/utils/localstorage/variablesLocal';

export interface ContentRequest {
  url: string;
  method: string;
  body: string;
  headers?: { name: string; value: string; isActive: boolean }[];
  paramNames: { name: string; value: string; isActive: boolean }[];
}

export const Content: React.FC = () => {
  const lastInput = useRef<EventTarget & HTMLInputElement>(null);
  const lastInputHeader = useRef<EventTarget & HTMLInputElement>(null);
  const [responseData, setResponseData] = React.useState(null);
  const [responseStatus, setResponseStatus] = React.useState<number | undefined>(undefined);
  const [error, setError] = React.useState<string | null>(null);
  const [variables, setVariables] = React.useState<Variable[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
    const loadedVariables = getVariablesFromStorage();
    setVariables(loadedVariables);
    console.log('Variables loaded in Content component:', loadedVariables);
  }, []);

  const { register, handleSubmit, control, setValue, getValues, watch } = useForm<ContentRequest>({
    defaultValues: {
      url: '',
      paramNames: [{ name: '', value: '', isActive: true }],
      headers: [{ name: '', value: '', isActive: true }],
    },
  });

  const currentUrl = watch('url');
  useEffect(() => {
    if (currentUrl && variables.length > 0 && isMounted) {
      console.log('Current URL:', currentUrl);
      console.log('URL with replaced variables:', replaceVariables(currentUrl));
    }
  }, [currentUrl, variables, isMounted]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'paramNames',
  });

  const {
    fields: headerFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control,
    name: 'headers',
  });

  useEffect(() => {
    lastInput.current?.focus();
  }, [fields]);

  useEffect(() => {
    lastInputHeader.current?.focus();
  }, [headerFields]);

  function createUrl() {
    const url = getValues('url');
    const currentUrl = url.includes('?') ? url.split('?')[0] : url;

    const params = getValues('paramNames')
      .filter((field) => field.isActive)
      .map((field) => {
        return `${field.name}=${field.value}`;
      })
      .join('&');

    const newUrl = params ? `${currentUrl}?${params}` : currentUrl;
    if (newUrl !== url) {
      setValue('url', newUrl);
    }
  }

  function handleAppend(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    createUrl();

    if (fields.length - 1 === index) {
      append({ name: '', value: '', isActive: true });
      lastInput.current = e.target;
    }
  }

  function handleAppendHeader(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    if (headerFields.length - 1 === index) {
      appendHeader({ name: '', value: '', isActive: true });
      console.log('lastInputHeader', lastInputHeader.current);
      lastInputHeader.current = e.target;
    }
  }

  const replaceVariablesInContentRequest = (data: ContentRequest): ContentRequest => {
    return {
      ...data,
      url: replaceVariables(data.url),
      body: data.body ? replaceVariables(data.body) : '',
      headers: data.headers?.map((header) => ({
        ...header,
        name: replaceVariables(header.name),
        value: replaceVariables(header.value),
      })),
      paramNames: data.paramNames?.map((param) => ({
        ...param,
        name: replaceVariables(param.name),
        value: replaceVariables(param.value),
      })),
    };
  };

  const handleSubmitRequest = async (data: ContentRequest) => {
    try {
      console.log('Form data before processing:', data);
      console.log('Available variables:', getVariablesFromStorage());

      const processedData = replaceVariablesInContentRequest(data);

      console.log('Processed request data with variables:', processedData);
      console.log('Original URL:', data.url);
      console.log('Processed URL:', processedData.url);

      const res = await sendRequest(processedData);

      setResponseData(res.data);
      setResponseStatus(res.status);
      setError(res.error || null);

      recordRequest(processedData.url);
    } catch (err) {
      console.error('Error processing request with variables:', err);
      setError('Ошибка при обработке запроса с переменными');
    }
  };

  const getPreviewUrl = () => {
    const url = getValues('url');
    if (!url) return url;

    return replaceVariables(url);
  };

  const generatedCode = generateRequestCode(getValues());

  const codeTabs = [
    { key: 'curl', label: 'cURL' },
    { key: 'jsFetch', label: 'JavaScript (Fetch)' },
    { key: 'jsXHR', label: 'JavaScript (XHR)' },
    { key: 'node', label: 'NodeJS' },
    { key: 'py', label: 'Python' },
    { key: 'java', label: 'Java' },
    { key: 'csharp', label: 'C#' },
    { key: 'go', label: 'Go' },
  ] as const;

  type CodeTabKey = (typeof codeTabs)[number]['key'];
  const [activeTab, setActiveTab] = React.useState<CodeTabKey>('curl');

  return (
    <div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleSubmitRequest)}>
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

                {/* Предпросмотр URL с переменными - только после монтирования */}
                {isMounted && variables.length > 0 && getValues('url') && (
                  <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>URL с переменными:</div>
                    <div className="font-mono bg-gray-100 dark:bg-gray-900 p-1 rounded overflow-x-auto">
                      {getPreviewUrl()}
                    </div>
                  </div>
                )}

                <div className="border-b dark:border-gray-700 mb-4">
                  <div className="flex space-x-4 mb-2">
                    <div className="px-3 py-1 border-b-2 border-blue-500 font-medium">Query Params</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col items-center p-4 border ">
                    {fields.map((field, index) => (
                      <div className="flex" key={field.id}>
                        <input
                          type="checkbox"
                          className="mr-2"
                          {...register(`paramNames.${index}.isActive`)}
                          onChange={(e) => {
                            setValue(`paramNames.${index}.isActive`, e.target.checked);
                            createUrl();
                          }}
                        />
                        <input
                          className="border border-gray-300 dark:border-gray-600 rounded-md mr-2 bg-white dark:bg-gray-700"
                          {...register(`paramNames.${index}.name`)}
                          onChange={(e) => {
                            setValue(`paramNames.${index}.name`, e.target.value);
                            handleAppend(index, e);
                          }}
                        />
                        <input
                          className="border border-gray-300 dark:border-gray-600 rounded-md mr-2 bg-white dark:bg-gray-700"
                          {...register(`paramNames.${index}.value`)}
                          onChange={(e) => {
                            setValue(`paramNames.${index}.value`, e.target.value);
                            handleAppend(index, e);
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (fields.length > 1) remove(index);
                            createUrl();
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-b dark:border-gray-700 mb-4 mt-4">
                  <div className="flex space-x-4 mb-2">
                    <div className="px-3 py-1 border-b-2 border-blue-500 font-medium">Headers</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col items-center p-4 border ">
                    {headerFields.map((field, index) => (
                      <div className="flex" key={field.id}>
                        <input type="checkbox" className="mr-2" {...register(`headers.${index}.isActive`)} />
                        <input
                          className="border border-gray-300 dark:border-gray-600 rounded-md mr-2 bg-white dark:bg-gray-700"
                          {...register(`headers.${index}.name`)}
                          placeholder="Header name"
                          onChange={(e) => {
                            setValue(`headers.${index}.name`, e.target.value);
                            handleAppendHeader(index, e);
                          }}
                        />
                        <input
                          className="border border-gray-300 dark:border-gray-600 rounded-md mr-2 bg-white dark:bg-gray-700"
                          {...register(`headers.${index}.value`)}
                          placeholder="Header value"
                          onChange={(e) => {
                            setValue(`headers.${index}.value`, e.target.value);
                            handleAppendHeader(index, e);
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (headerFields.length > 1) removeHeader(index);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Generated request code section with tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="font-medium mb-2">Generated request code</h3>
                {typeof generatedCode === 'string' ? (
                  <div className="text-gray-500">{generatedCode}</div>
                ) : (
                  <div>
                    <div className="flex mb-2 border-b dark:border-gray-700">
                      {codeTabs.map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          className={`px-3 py-1 mr-2 font-semibold border-b-2 ${
                            activeTab === tab.key
                              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'border-transparent text-gray-600 dark:text-gray-300'
                          } focus:outline-none`}
                          onClick={() => setActiveTab(tab.key)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-900 rounded p-2 overflow-x-auto">
                      {generatedCode[activeTab]}
                    </pre>
                  </div>
                )}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="font-medium mb-2">Request Body</h3>
                <textarea
                  id="body"
                  {...register('body')}
                  className="w-full h-60 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  placeholder="Enter request body"
                ></textarea>

                {/* Подсказка о поддержке переменных - только после монтирования */}
                {isMounted && variables.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>Вы можете использовать переменные в формате {'{{{имя_переменной}}}'}</p>
                    <p>Доступные переменные: {variables.map((v) => `{{${v.name}}}`).join(', ')}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="w-1/2 pl-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-full">
                <div className="border-b dark:border-gray-700 mb-4">
                  <div className="flex space-x-4 mb-2 justify-between">
                    <div className="px-3 font-medium">Response</div>
                    <div className="text-green-500 font-medium">Status: {responseStatus}</div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 p-4 h-96 overflow-y-auto">
                  {responseData && !error ? (
                    <pre className="text-sm">{JSON.stringify(responseData, null, 2)}</pre>
                  ) : (
                    <div className="text-red-500">{error}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
