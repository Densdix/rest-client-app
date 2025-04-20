import { ContentRequest } from '@/app/(protected)/restclient/_components/Content';

export const recordRequest = (data: ContentRequest) => {
  const storedHistory = localStorage.getItem('requestHistory');

  let newHistory: ContentRequest[];
  if (storedHistory === null) {
    newHistory = [data];
  } else {
    newHistory = [data, ...JSON.parse(storedHistory)];
  }

  localStorage.setItem('requestHistory', JSON.stringify(newHistory));
};
