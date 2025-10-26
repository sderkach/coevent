# CoEvent - Modern Events Platform

A Next.js 15 application for discovering, creating, and managing local or online events.

## Hosted Version

CoEvent is live and hosted at: **[https://coevent.vercel.app/](https://coevent.vercel.app/)**

Visit the live application to explore events, create an account, and experience the full platform!

### Test User Credentials

You can use the following test account to explore the platform:
- **Email**: `test@example.com`
- **Password**: `QDkTb7z6GDC_ALA`

### Testing Payments

To test paid event registrations, use the following Stripe test card:
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: `08/28`
- **CVC**: `345`

Any future expiry date works, and no real charges are made.

## Features

- **Event Discovery**: Browse and search events with filters
- **Event Creation**: Authenticated users can create events
- **Payment Integration**: Support for free and paid events via Stripe
- **Google Calendar**: Add events directly to your Google Calendar
- **User Dashboard**: Manage created and joined events

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Shadcn/UI components
- Supabase (Auth, Database, Storage)
- Stripe (Payments)
- Google Calendar API

## Accessibility

CoEvent includes several accessibility features:

### Implemented Features

1. **Semantic HTML**: Uses proper semantic elements (`<header>`, `<main>`, `<nav>`, etc.)
2. **Keyboard Navigation**: All interactive elements are keyboard accessible
3. **Focus States**: Visible focus indicators on buttons, links, and form inputs
4. **Form Labels**: All form inputs have associated labels using Radix UI components
5. **Alt Text**: Images include descriptive alt text
6. **ARIA Attributes**: 
   - Form controls use `aria-invalid` for error states
   - Form descriptions linked via `aria-describedby`
   - Proper role attributes via Radix UI primitives
7. **Color Contrast**: WCAG-compliant color schemes for both light and dark modes
8. **Screen Reader Support**: Proper labeling and relationships between elements

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