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
import { UrlBlock } from './UrlBlock';

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
  }, []);

  const { register, handleSubmit, control, setValue, getValues } = useForm<ContentRequest>({
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
      .filter((field) => field.isActive && field.name)
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
      const processedData = replaceVariablesInContentRequest(data);

      const res = await sendRequest(processedData);

      setResponseData(res.data);
      setResponseStatus(res.status);
      setError(res.error || null);

      recordRequest(processedData.url);
    } catch {
      setError('Ошибка при обработке запроса с переменными');
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(handleSubmitRequest)}>
        <div className="flex flex-1 p-4">
          <div className="w-1/2 pr-2">
            <UrlBlock register={register} getValues={getValues} isMounted={isMounted} variables={variables} />

            <QueryParamsBlock
              register={register}
              control={control}
              setValue={setValue}
              getValues={getValues}
              fields={fields}
              append={append}
              remove={remove}
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
