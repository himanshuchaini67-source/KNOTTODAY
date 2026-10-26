# Vercel Deployment Guide - Knot Today Wedding Platform

This project is fully configured and ready for 1-click or automated deployment on [Vercel](https://vercel.com).

---

## 🛠️ Configurations Prepared

1. **`vercel.json` (SPA Routing & Performance)**:
   - Client-side routing rewrites (`/(.*)` -> `/index.html`) so navigating directly or refreshing pages (`/login`, `/journey`, `/services`, etc.) never returns a 404 error.
   - Cache control headers for static production assets (`/assets/*`).
   - Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).
2. **Favicon & Brand Assets**:
   - `public/favicon.svg` created using the official Knot Today vector emblem.
   - Referenced in `index.html` via `/favicon.svg` for seamless production serving.
3. **Verified Production Build**:
   - Production bundle compiled cleanly to `dist/` with code splitting, optimized CSS, and tree-shaking.

---

## 🚀 Deployment Options

### Option 1: Deploy via Vercel Web Dashboard (Recommended)

1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Open [Vercel Dashboard](https://vercel.com/new).
3. Click **"Import Project"** and select your wedding repository.
4. **Project Settings**:
   - **Framework Preset**: `Vite` (Auto-detected)
   - **Root Directory**:
     - If your Git repo root is `project/`, leave as `./`.
     - If your Git repo contains the parent folder (`wedding-event-manager-main`), click **Edit** next to Root Directory and select `project`.
   - **Build Command**: `npm run build` (Default)
   - **Output Directory**: `dist` (Default)
   - **Install Command**: `npm install` (Default)
5. Click **"Deploy"**! Vercel will build and assign you a live production URL (e.g., `https://knot-today.vercel.app`).

---

### Option 2: Deploy via Vercel CLI

From your terminal inside the `project` directory:

```bash
# 1. Install Vercel CLI globally (if not already installed)
npm install -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy directly to preview
vercel

# 4. Deploy to production
vercel --prod
```

---

## 🔐 Environment Variables (Optional)

The application includes an internal IndexedDB / localStorage database engine (`KnotTodayAuthDB`) and mock datasets, so **no environment variables are strictly required** to run live in production!

If you wish to connect Supabase or n8n webhooks in the future, add them under **Project Settings → Environment Variables** on Vercel:

| Variable | Description | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | Optional |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anonymous key | Optional |
| `VITE_N8N_WEBHOOK_URL` | n8n automation webhook URL | Optional |
