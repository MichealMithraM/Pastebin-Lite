import { notFound } from 'next/navigation';

export default async function View({ params }: { params: { id: string } }) {
  const host = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  const res = await fetch(`${host}/api/pastes/${params.id}`, { cache: 'no-store' });

  if (!res.ok) notFound();
  const data = await res.json();

  return (
    <div className="min-h-screen bg-white p-6 md:p-20">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex justify-between items-end border-b pb-4">
          <h2 className="text-slate-400 font-mono text-sm uppercase tracking-widest">Paste: {params.id}</h2>
          <div className="text-right text-xs text-slate-400">
            {data.remaining_views !== null && <div>Views left: {data.remaining_views}</div>}
            {data.expires_at && <div>Expires: {new Date(data.expires_at).toLocaleString()}</div>}
          </div>
        </div>
        <pre className="p-6 bg-slate-50 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed text-slate-800 border">
          {data.content}
        </pre>
      </div>
    </div>
  );
}