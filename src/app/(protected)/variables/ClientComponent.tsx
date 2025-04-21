'use client';

import dynamic from 'next/dynamic';

const VariablesComponent = dynamic(
  () => import('./_components/VariablesComponent').then((mod) => mod.VariablesComponent),
  { ssr: false }
);

export function VariablesClientWrapper() {
  return <VariablesComponent />;
}

export default VariablesClientWrapper;
