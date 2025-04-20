import { ContentRequest } from '@/app/(protected)/restclient/_components/Content';

export const recordRequest = (data: ContentRequest) => {
  const storedHistory = localStorage.getItem('requestHistory');

  const requestWithTimestamp = {
    ...data,
    timestamp: Date.now(),
  };

  let newHistory: (ContentRequest & { timestamp: number })[];
  if (storedHistory === null) {
    newHistory = [requestWithTimestamp];
  } else {
    newHistory = [requestWithTimestamp, ...JSON.parse(storedHistory)];
  }

  localStorage.setItem('requestHistory', JSON.stringify(newHistory));
};
