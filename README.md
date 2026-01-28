# Pastebin-Lite

Pastebin-Lite is a simple Pastebin-like web application where users can create text pastes and share a URL to view them.  
Each paste can optionally expire based on time (TTL) or number of views.

This project was built as a take-home assignment and is designed to pass automated functional and robustness tests.

---

## 🚀 Deployed URL

https://pastebin-lite-kd96.vercel.app

---

## 🛠 Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Backend: Next.js API Routes
- Persistence: Upstash Redis (KV store)
- Deployment: Vercel

---

## ✨ Features

- Create a paste with arbitrary text
- Generate a shareable URL
- View a paste via `/p/:id`
- Optional constraints:
  - Time-based expiry (TTL)
  - View-count limit
- Deterministic time support for testing
- Safe rendering (no script execution)
- Clear UI for expired or unavailable pastes

---

## 📦 API Routes

### Health Check

**GET /api/healthz**

Returns HTTP 200 and JSON indicating the service is healthy and persistence is accessible.

Example response:
```json
{ "ok": true }