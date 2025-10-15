# AI Staffing Directory - Local Version

This is a local version of the AI Staffing Directory that runs entirely on your machine without any external dependencies like Supabase, Vercel, or GitHub.

## Features

- ✅ Browse AI-powered recruitment tools
- ✅ Search and filter tools by category
- ✅ View detailed tool information
- ✅ Local storage for data persistence
- ✅ No external API dependencies
- ✅ Fully functional offline

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## What's Changed

### Removed External Dependencies
- ❌ Supabase database
- ❌ Vercel deployment
- ❌ GitHub integration
- ❌ External email services

### Local Storage Implementation
- ✅ All data stored in browser's localStorage
- ✅ Mock APIs for compatibility
- ✅ Local analytics tracking
- ✅ Offline functionality

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
├── lib/
│   ├── localStorage.ts  # Local storage utilities
│   ├── data.ts         # Tool data (149 tools)
│   └── analytics.ts    # Local analytics
└── types/              # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Data

The app comes pre-loaded with 149 AI recruitment tools across categories like:
- ATS (Applicant Tracking Systems)
- Sourcing & Search
- Interviewing
- Analytics
- Communication
- Sales & Marketing
- And more...

## Local Development

All data is stored locally in your browser. The app will work completely offline once loaded. No internet connection required for browsing tools.

## Building for Production

```bash
npm run build
npm run start
```

The built app can be deployed to any static hosting service or run locally.

## Notes

- All external service integrations have been removed
- Email functionality is disabled
- Admin features work with mock data
- Analytics are stored locally in browser storage
- No user authentication required

Enjoy exploring AI recruitment tools locally! 🚀