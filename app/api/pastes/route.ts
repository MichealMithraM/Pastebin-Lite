import { Redis } from '@upstash/redis'
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

const kv = Redis.fromEnv();

export async function POST(req: NextRequest) {
  try {
    const { content, ttl_seconds, max_views } = await req.json();

    if (!content || typeof content !== 'string') 
      return NextResponse.json({ error: "Content is required" }, { status: 400 });

    const id = nanoid(10);
    const expires_at = ttl_seconds ? Date.now() + (ttl_seconds * 1000) : null;

    const data = { content, max_views: max_views || null, remaining_views: max_views || null, expires_at };

    // Set with a buffer TTL for Redis cleanup, though logic is deterministic
    await kv.set(`p:${id}`, data, { ex: ttl_seconds ? ttl_seconds + 3600 : 604800 });

    const host = req.headers.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    return NextResponse.json({
      id,
      url: `${protocol}://${host}/p/${id}`
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}