import { notFound } from 'next/navigation';
import { headers as getHeaders } from 'next/headers';

export default async function ViewPaste({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await params for Next.js 16 build compatibility
  const { id } = await params;
  
  const headers = await getHeaders();
  const host = headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  // Fetching from your internal API to ensure all constraints (TTL/Views) are checked
  const res = await fetch(`${protocol}://${host}/api/pastes/${id}`, {
    cache: 'no-store',
    headers: Object.fromEntries(headers.entries()),
  });

  if (!res.ok) {
    notFound(); // This triggers the standard Next.js 404 if the paste is unavailable
  }

  const data = await res.json();

  return (
    /* This container uses your custom navy/blur styling from globals.css */
    <div className="card-container max-w-4xl">
      <header className="mb-6 border-b border-white/10 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
            Paste ID: {id}
          </h2>
          <h1 className="text-white text-xl font-bold tracking-tight">Secure Content</h1>
        </div>
        
        <div className="text-right text-[10px] font-mono text-zinc-400 space-y-1">
          {data.remaining_views !== null && (
            <div className="text-sky-400 font-bold">Views Left: {data.remaining_views}</div>
          )}
          {data.expires_at && (
            <div>Expires: {new Date(data.expires_at).toLocaleString()}</div>
          )}
        </div>
      </header>

      <div className="pre-view">
        <pre className="whitespace-pre-wrap break-all leading-relaxed">
          <code>{data.content}</code>
        </pre>
      </div>

      <div className="mt-8 text-center">
        <a 
          href="/" 
          className="text-[10px] font-bold text-zinc-500 hover:text-sky-400 uppercase tracking-[0.2em] transition-colors"
        >
          ← Create New Paste
        </a>
      </div>
    </div>
  );
}