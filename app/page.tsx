'use client';
import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('');
  const [views, setViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? parseInt(ttl) : undefined,
          max_views: views ? parseInt(views) : undefined
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Creation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-container">
      <h1 className="professional-title">PASTEBIN LITE</h1>
      
      <form onSubmit={handleCreate}>
        <textarea
          className="input-field h-40 resize-none"
          placeholder="Enter your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        
        <input 
          type="number" 
          placeholder="Expiry (Seconds)" 
          className="input-field"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
          min="1"
        />

        <input 
          type="number" 
          placeholder="Max Views" 
          className="input-field"
          value={views}
          onChange={(e) => setViews(e.target.value)}
          min="1"
        />

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Processing...' : 'Create Secure Link'}
        </button>
      </form>

      {result && (
        <div className="pre-view">
          <p className="mb-2 text-xs text-zinc-500 uppercase">Shareable URL:</p>
          <a href={result.url} target="_blank" className="text-sky-400 underline break-all">
            {result.url}
          </a>
        </div>
      )}
    </div>
  );
}