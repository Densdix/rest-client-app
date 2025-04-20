import React from 'react';
import { UseFormRegister, Control, UseFormSetValue, UseFormGetValues, FieldArrayWithId } from 'react-hook-form';
import { ContentRequest } from './Content';

interface Props {
  register: UseFormRegister<ContentRequest>;
  control: Control<ContentRequest>;
  setValue: UseFormSetValue<ContentRequest>;
  getValues: UseFormGetValues<ContentRequest>;
  fields: FieldArrayWithId<ContentRequest, 'paramNames', 'id'>[];
  append: (value: { name: string; value: string; isActive: boolean }) => void;
  remove: (index?: number | number[]) => void;
  handleAppend: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  createUrl: () => void;
}

export const QueryParamsBlock: React.FC<Props> = ({ register, fields, setValue, remove, handleAppend, createUrl }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
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
    </div>
  );
};
