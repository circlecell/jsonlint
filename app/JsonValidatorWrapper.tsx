'use client';

import { useSearchParams } from 'next/navigation';
import { JsonValidator } from '@/components/JsonValidator';

export function JsonValidatorWrapper() {
  const searchParams = useSearchParams();
  const json = searchParams.get('json') || undefined;
  const url = searchParams.get('url') || undefined;

  return <JsonValidator initialJson={json} initialUrl={url} />;
}
