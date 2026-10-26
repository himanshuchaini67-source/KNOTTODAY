# Wedding Event Management Platform

A premium Indian wedding planning platform that helps couples manage their complete wedding journey — from preparation to Vidai. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Dashboard** — Wedding countdown, stats, today's schedule, journey progress, upcoming events, booked services, and recent notifications
- **Wedding Journey** — 12-stage timeline from Bride Preparation to Vidai with status tracking
- **Events & Functions** — Add, edit, delete, and view wedding events with modal forms
- **Bride & Groom Pages** — Preparation checklists, appointments, and day schedules
- **Guest Management** — RSVP tracking, search, filters, add/edit/delete guests (table on desktop, cards on mobile)
- **Jewellery Rental** — Premium catalog with filters (Bride/Groom, category, price, availability), rental request modal with success confirmation
- **Clothes Rental** — Premium outfit catalog with filters (Bride/Groom, category, size, color, price, availability), rental request modal
- **Wedding Services** — Vendor directory across Makeup Artists, DJ/Music, Photography, Decoration, and Catering
- **Sangeet** — Manage dance performances with practice schedules and status tracking
- **Tasks** — Wedding checklist with priorities, status cycling, and progress tracking
- **Budget** — Visual budget tracking with planned vs spent amounts, progress bars, and add/remove items
- **Notifications** — Elegant notification cards with mark-as-read functionality
- **Language** — Multi-language support (English, Hindi, Kannada)
- **Support** — Support request form, FAQ, and emergency contact options

## Technology Stack

- **React 18** with TypeScript
- **Vite 5** for build tooling
- **Tailwind CSS 3** for styling
- **Lucide React** for icons
- **React Router DOM 6** for routing
- **Supabase JS** (prepared, not connected)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck

# Lint
npm run lint
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | No (uses mock data without it) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | No |
| `VITE_N8N_WEBHOOK_URL` | n8n webhook endpoint for automation | No |

The app works fully with mock data even without any environment variables configured.

## Supabase Setup

1. Create a Supabase project named `wedding-event-manager`
2. Go to Settings → API to get your project URL and anon key
3. Add them to `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run the schema SQL from `supabase/schema.sql` in the Supabase SQL editor
5. Enable Row Level Security and create policies as described in the schema file
6. Create storage buckets for images: `jewellery-images`, `clothing-images`, `vendor-images`, `photography-images`, `profile-images`, `documents`

## n8n Setup

n8n is used for optional automation workflows:

1. Set up an n8n instance (self-hosted or n8n Cloud)
2. Create a webhook node that accepts POST requests
3. Add the webhook URL to `.env`:
   ```
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/wedding
   ```
4. The app sends webhooks for these events:
   - New service booking
   - New jewellery rental request
   - New clothes rental request
   - Support request
5. If not configured, the app continues working normally

## GitHub Setup

```bash
# Initialize git repo
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Wedding Event Management Platform"

# Add remote and push
git remote add origin https://github.com/your-username/wedding-event-manager.git
git branch -M main
git push -u origin main
```

## Vercel Deployment

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel auto-detects Vite — no configuration needed
4. Add environment variables in Vercel Project Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_N8N_WEBHOOK_URL`
5. Deploy — Vercel builds with `npm run build` and serves the `dist` folder

## Project Structure

```
src/
  components/     # Reusable UI components
  pages/          # Page components
  data/           # Mock/demo data
  lib/            # Utilities (supabase client, i18n, webhook helper)
  types/          # TypeScript type definitions
  hooks/          # Custom React hooks
supabase/
  schema.sql      # Future database schema
.env.example      # Environment variable template
```

## Demo Data

The app uses fictional demo data:
- **Couple:** Aishwarya & Rohan
- **Wedding Date:** December 18, 2026
- **Location:** The Leela Palace, Udaipur, Rajasthan

All vendor names, contact numbers, and guest information are fictional.
