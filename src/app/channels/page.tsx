/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Suspense } from 'react';

import ChannelsPageInner from './ChannelsPageInner';

export default function ChannelsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">加载频道中…</div>}>
      <ChannelsPageInner />
    </Suspense>
  );
}
