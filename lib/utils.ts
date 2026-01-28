import { headers } from 'next/headers';

export async function getNow(): Promise<number> {
  if (process.env.TEST_MODE === '1') {
    const headerList = await headers(); // Headers is now a Promise
    const testTime = headerList.get('x-test-now-ms');
    if (testTime) return parseInt(testTime, 10);
  }
  return Date.now();
}