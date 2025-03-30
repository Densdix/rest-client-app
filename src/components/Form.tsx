'use client';

import { useState } from 'react';

interface Props {
  title: string;
  handleClick: (email: string, password: string) => void;
}

export const Form: React.FC<Props> = ({ title, handleClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
      <button
        onClick={() => {
          handleClick(email, password);
        }}
      >
        {title}
      </button>
    </div>
  );
};
