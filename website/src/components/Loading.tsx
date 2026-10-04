import React from 'react';
import { Spinner } from '@heroui/react';

export function Loading() {
  return (
    <div className="flex grow items-center justify-center h-25">
      <Spinner size="xl" />
    </div>
  );
}
