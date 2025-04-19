'use client';

import { useState, useEffect } from 'react';

export default function ContentHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('requestHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  return (
    <div className="w-full h-full p-8 flex flex-col justify-center align-middle items-center">
      <h1 className="text-2xl font-bold mb-4">История запросов</h1>
      {history.map((url, index) => (
        <p key={index} className="mb-2">
          {url}
        </p>
      ))}
    </div>
  );
}
