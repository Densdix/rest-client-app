'use client';

import { recordRequest } from '@/utils/localstorage/recordRequest';
import React, { useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { sendRequest } from './action';
import { Variable, getVariablesFromStorage, replaceVariables } from '@/utils/localstorage/variablesLocal';
import { ResponseBlock } from './ResponseBlock';
import { RequestBodyBlock } from './RequestBodyBlock';
import { QueryParamsBlock } from './QueryParamsBlock';
import { HeadersBlock } from './HeadersBlock';
import { CodeBlock } from './CodeBlock';

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
      lastInputHeader.current = e.target;
    }
  }

  const currentUrl = watch('url');
  useEffect(() => {
    if (currentUrl && variables.length > 0 && isMounted) {
      console.log('Current URL:', currentUrl);
      console.log('URL with replaced variables:', replaceVariables(currentUrl));
    }
  }, [currentUrl, variables, isMounted]);

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

  return (
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
            </div>

            <QueryParamsBlock
              register={register}
              control={control}
              setValue={setValue}
              getValues={getValues}
              fields={fields}
              append={append}
              remove={remove}
              lastInput={lastInput}
              handleAppend={handleAppend}
              createUrl={createUrl}
            />

            <HeadersBlock
              register={register}
              control={control}
              setValue={setValue}
              fields={headerFields}
              append={appendHeader}
              remove={removeHeader}
              lastInputHeader={lastInputHeader}
              handleAppendHeader={handleAppendHeader}
            />

            <CodeBlock getValues={getValues} />

            <RequestBodyBlock register={register} variables={variables} isMounted={isMounted} />
          </div>

          <ResponseBlock responseData={responseData} error={error} responseStatus={responseStatus} />
        </div>
      </form>
    </div>
  );
};
