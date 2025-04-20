import React from 'react';
import { UseFormRegister, Control, UseFormSetValue, FieldArrayWithId } from 'react-hook-form';
import { ContentRequest } from './Content';

interface Props {
  register: UseFormRegister<ContentRequest>;
  control: Control<ContentRequest>;
  setValue: UseFormSetValue<ContentRequest>;
  fields: FieldArrayWithId<ContentRequest, 'headers', 'id'>[];
  append: (value: { name: string; value: string; isActive: boolean }) => void;
  remove: (index?: number | number[]) => void;
  handleAppendHeader: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HeadersBlock: React.FC<Props> = ({ register, setValue, fields, remove, handleAppendHeader }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <div className="border-b dark:border-gray-700 mb-4">
        <div className="flex space-x-4 mb-2">
          <div className="px-3 py-1 border-b-2 border-blue-500 font-medium">Headers</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex flex-col items-center p-4 border ">
          {fields.map((field, index) => (
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
  );
};
