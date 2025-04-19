export const recordRequest = (url: string) => {
  const storedHistory = localStorage.getItem('requestHistory');

  let newHistory: string[];
  if (storedHistory === null) {
    newHistory = [url];
  } else {
    newHistory = [url, ...JSON.parse(storedHistory)];
  }

  localStorage.setItem('requestHistory', JSON.stringify(newHistory));
};
