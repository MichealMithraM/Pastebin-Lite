import { kv } from '@vercel/kv';
import { getNow } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const key = `p:${params.id}`;
  const paste: any = await kv.get(key);

  if (!paste) return NextResponse.json({ error: "Not Found" }, { status: 404 });

  const now = getNow();
  if (paste.expires_at && now >= paste.expires_at) {
    await kv.del(key);
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.max_views !== null) {
    if (paste.remaining_views <= 0) {
      await kv.del(key);
      return NextResponse.json({ error: "Limit reached" }, { status: 404 });
    }
    paste.remaining_views -= 1;
    paste.remaining_views === 0 ? await kv.del(key) : await kv.set(key, paste);
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at ? new Date(paste.expires_at).toISOString() : null
  });
}