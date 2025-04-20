'use client';

import dynamic from 'next/dynamic';

const ContentHistory = dynamic(() => import('./_components/Content').then((mod) => mod.default), { ssr: false });

export default function HistoryClientWrapper() {
  return <ContentHistory />;
}
