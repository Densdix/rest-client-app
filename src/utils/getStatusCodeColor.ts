export const getStatusCodeColor = (statusCode: number): string => {
  switch (true) {
    case statusCode >= 200 && statusCode < 300:
      return 'text-green-500 font-medium';
    case statusCode >= 400 && statusCode < 500:
      return 'text-yellow-500 font-medium';
    case statusCode >= 500 && statusCode < 600:
      return 'text-red-500 font-medium';
    default:
      return 'text-gray-500 font-medium';
  }
};
