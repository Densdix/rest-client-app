interface Props {
  responseData: string | null;
  error: string | null;
  responseStatus: number | undefined;
}

export const ResponseBlock: React.FC<Props> = ({ responseData, error, responseStatus }) => {
  return (
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
  );
};
