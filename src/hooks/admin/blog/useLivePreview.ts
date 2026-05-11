import { useState } from 'react';

export function useLivePreview(initialValue: string = ''): [string, (v: string) => void] {
  const [value, setValue] = useState(initialValue);  
  return [value, setValue];
}