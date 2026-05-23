# Smart Interview Evaluation Assistant — Frontend

React + Vite + Tailwind UI for signing in, generating AI evaluation reports, reviewing records, updating hiring verdicts, deleting evaluations, and exporting PDFs.

## Setup

```powershell
npm install
```

Create a `.env` file in this folder (not committed to Git), or rely on the built-in default:

```env
VITE_API_BASE=http://127.0.0.1:8000/api
```

If `.env` is missing, the app defaults to `http://127.0.0.1:8000/api`.

```powershell
npm run dev
```

App: http://127.0.0.1:5173

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build

## Deploy (Vercel)

1. Import this repo on [Vercel](https://vercel.com).
2. Framework preset: **Vite** — build `npm run build`, output `dist`.
3. Environment variable: `VITE_API_BASE=https://YOUR-RENDER-API.onrender.com/api`
4. `vercel.json` is included for React Router (`/signin`, etc.).

## Related repo

Backend: [Smart-Interview-Evaluation-Assistant-Backend](https://github.com/CodewithHassan1/Smart-Interview-Evaluation-Assistant-Backend)
