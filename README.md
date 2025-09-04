# AI Staffing Tools Directory

A premium, curated directory application for AI-powered staffing and recruitment tools built with Next.js, Tailwind CSS, and shadcn/ui components.

## Features

### Public Directory
- **Search Functionality**: Live-filtering search across tool names, descriptions, and tags
- **Category Filters**: Filter tools by Resume Screening, Candidate Sourcing, Interview Prep, and ATS Integrations
- **Tool Cards**: Clean card-based layout displaying tool information with hover animations
- **Responsive Design**: Fully mobile-responsive with 3-column desktop and 1-column mobile layout
- **Tool Submission**: Public users can submit new tools for review

### Admin Dashboard
- **Password Protection**: Secure admin access (demo password: `admin123`)
- **Submission Review**: View and manage pending tool submissions
- **Approval System**: Approve or reject submitted tools
- **Detailed View**: Review complete submission details before making decisions

## Design System

- **Color Scheme**: Monochrome base with white/gray space and minimalist Scandinavian design
- **Accent Color**: `#F26B21` for all interactive elements (buttons, links, hover states)
- **Typography**: Clean, modern typography with ample whitespace
- **Animations**: Subtle hover effects and smooth transitions using Framer Motion

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design tokens
- **Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **TypeScript**: Full type safety

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Public Users
1. Browse the directory of AI staffing tools
2. Use the search bar to find specific tools
3. Filter by category using the tab navigation
4. Click "Submit Tool" to add new tools for review
5. Click "Visit Tool" to go to the tool's website

### Admin Access
1. Navigate to `/admin`
2. Enter the admin password: `admin123`
3. Review pending submissions in the dashboard
4. Click the eye icon to view submission details
5. Use the check/X buttons to approve or reject submissions

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   ├── globals.css           # Global styles and Tailwind
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main directory page
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── SubmissionForm.tsx    # Tool submission form
└── lib/
    └── utils.ts              # Utility functions
```

## Customization

The application is built with modularity in mind:

- **Colors**: Update the accent color in `tailwind.config.js`
- **Categories**: Modify the categories array in both `page.tsx` and `SubmissionForm.tsx`
- **Mock Data**: Replace `mockTools` and `mockSubmissions` with real API calls
- **Authentication**: Implement proper authentication for the admin panel

## Production Considerations

- Replace mock data with a real database (PostgreSQL, MongoDB, etc.)
- Implement proper authentication and authorization
- Add form validation and error handling
- Set up file upload for tool logos
- Add email notifications for submissions
- Implement proper SEO optimization
- Add analytics and monitoring

## License

MIT License - feel free to use this project as a starting point for your own directory application.