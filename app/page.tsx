'use client';
import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({ content: '', ttl: '', views: '' });
  const [result, setResult] = useState<{ url: string } | null>(null);

  const create = async () => {
    const res = await fetch('/api/pastes', {
      method: 'POST',
      body: JSON.stringify({
        content: form.content,
        ttl_seconds: form.ttl ? parseInt(form.ttl) : undefined,
        max_views: form.views ? parseInt(form.views) : undefined
      })
    });
    if (res.ok) setResult(await res.json());
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Pastebin <span className="text-blue-600">Lite</span></h1>
          <p className="text-slate-500">Create ephemeral text pastes with precise constraints.</p>
        </header>

        <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4">
          <textarea
            className="w-full h-64 p-4 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
            placeholder="Paste your content here..."
            value={form.content}
            onChange={e => setForm({...form, content: e.target.value})}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Expiry (Seconds)</label>
              <input type="number" className="w-full p-2 bg-slate-50 rounded-md border" 
                placeholder="Never" value={form.ttl} onChange={e => setForm({...form, ttl: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Max Views</label>
              <input type="number" className="w-full p-2 bg-slate-50 rounded-md border" 
                placeholder="Unlimited" value={form.views} onChange={e => setForm({...form, views: e.target.value})} />
            </div>
          </div>

          <button onClick={create} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all">
            Generate Secure Link
          </button>
        </div>

        {result && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
            <code className="text-blue-700 text-sm truncate">{result.url}</code>
            <button onClick={() => navigator.clipboard.writeText(result.url)} className="text-xs font-bold text-blue-600 px-3 py-1 border border-blue-200 rounded hover:bg-white">Copy</button>
          </div>
        )}
      </div>
    </div>
  );
}