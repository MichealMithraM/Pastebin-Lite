import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server';

const kv = Redis.fromEnv();

export async function GET() {
  try {
    await kv.ping();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}