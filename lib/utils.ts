import { headers } from 'next/headers';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Change this to an async function
export async function getNow(): Promise<number> {
  if (process.env.TEST_MODE === '1') {
    // Await the headers promise
    const headerList = await headers(); 
    const testTime = headerList.get('x-test-now-ms');
    if (testTime) return parseInt(testTime, 10);
  }
  return Date.now();
}