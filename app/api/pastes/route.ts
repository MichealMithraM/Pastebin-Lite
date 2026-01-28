import { Redis } from '@upstash/redis';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import { getNow } from '@/lib/utils';

const kv = Redis.fromEnv();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    // Validation
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    const id = nanoid(10);
    const now = await getNow(); // Must await this
    const expires_at = ttl_seconds ? now + (ttl_seconds * 1000) : null;

    const pasteData = {
      content,
      max_views: max_views || null,
      remaining_views: max_views || null,
      expires_at,
    };

    // Store in Upstash
    await kv.set(`p:${id}`, pasteData);

    const host = req.headers.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    return NextResponse.json({
      id,
      url: `${protocol}://${host}/p/${id}`
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}