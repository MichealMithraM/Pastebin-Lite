import { notFound } from 'next/navigation';
import { headers as getHeaders } from 'next/headers';

export default async function ViewPaste({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Await params
  const { id } = await params;
  
  // 2. Dynamic fetch to your own API
  const headers = await getHeaders();
  const host = headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/pastes/${id}`, {
    cache: 'no-store',
    headers: Object.fromEntries(headers.entries()),
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-10 font-sans">
       <div className="max-w-3xl mx-auto border border-zinc-800 rounded-xl p-8 bg-zinc-900/30">
        <header className="mb-6 border-b border-zinc-800 pb-4">
          <h1 className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Paste: {id}</h1>
        </header>
        <pre className="text-zinc-200 font-mono text-sm whitespace-pre-wrap break-all leading-relaxed">
          {data.content}
        </pre>
      </div>
    </main>
  );
}