import React, { useState } from 'react';
import { UseFormGetValues } from 'react-hook-form';
import { ContentRequest } from './Content';
import { generateRequestCode } from '@/utils/generateRequestCode';
import { Variable } from '@/utils/localstorage/variablesLocal';

interface Props {
  getValues: UseFormGetValues<ContentRequest>;
  variables?: Variable[];
}

export const CodeBlock: React.FC<Props> = ({ getValues, variables = [] }) => {
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
  const [activeTab, setActiveTab] = useState<CodeTabKey>('curl');

  const environment = variables.reduce(
    (acc, variable) => {
      acc[variable.name] = variable.value;
      return acc;
    },
    {} as Record<string, string>
  );

  const values = getValues();
  const valuesWithEnvironment = {
    ...values,
    environment,
  };

  const generatedCode = generateRequestCode(valuesWithEnvironment);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
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
  );
};
