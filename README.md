# CoEvent - Modern Events Platform

A Next.js 14 application for discovering, creating, and managing local or online events.

## Features

- **Event Discovery**: Browse and search events with filters
- **Event Creation**: Authenticated users can create events
- **Payment Integration**: Support for free and paid events via Stripe
- **Google Calendar**: Add events directly to your Google Calendar
- **User Dashboard**: Manage created and joined events

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Shadcn/UI components
- Supabase (Auth, Database, Storage)
- Stripe (Payments)
- Google Calendar API

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Configure your environment variables in `.env.local`:
   - Supabase project URL and anon key
   - Stripe secret and publishable keys
   - Google Calendar API credentials
   - Site URL

4. Set up the database:
   - Run the SQL scripts in `/scripts` folder in your Supabase SQL editor

5. Run the development server:
```bash
npm run dev
```

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `GOOGLE_REDIRECT_URI`: Google OAuth redirect URI
- `NEXT_PUBLIC_SITE_URL`: Your site URL

## Deployment

Deploy to Vercel with all environment variables configured.