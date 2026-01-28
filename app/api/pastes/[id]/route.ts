import { Redis } from '@upstash/redis';
import { getNow } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

const kv = Redis.fromEnv();

// In Next.js 16, context.params is a Promise
export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } 
) {
  // 1. Await the params to get the ID
  const { id } = await params;
  const key = `p:${id}`;

  try {
    const paste: any = await kv.get(key);

    if (!paste) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    // 2. Await your custom getNow() utility
    const now = await getNow();

    // Check TTL Constraint
    if (paste.expires_at && now >= paste.expires_at) {
      await kv.del(key);
      return NextResponse.json({ error: "Expired" }, { status: 404 });
    }

    // Check View Count Constraint
    if (paste.max_views !== null) {
      if (paste.remaining_views <= 0) {
        await kv.del(key);
        return NextResponse.json({ error: "Limit reached" }, { status: 404 });
      }

      paste.remaining_views -= 1;

      if (paste.remaining_views === 0) {
        await kv.del(key);
      } else {
        await kv.set(key, paste);
      }
    }

    return NextResponse.json({
      content: paste.content,
      remaining_views: paste.remaining_views,
      expires_at: paste.expires_at ? new Date(paste.expires_at).toISOString() : null
    });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}