# PaperFans IOTA - Setup Instructions

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to your project settings and copy the following:
   - Project URL
   - Anon (public) key

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` into the editor
4. Run the SQL script to create the database schema and sample data

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── projects/      # Project-related API endpoints
│   ├── about/             # About page
│   ├── docs/              # Documentation page
│   ├── project/[id]/      # Dynamic project detail pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── not-found.tsx      # 404 page
│   └── providers.tsx      # Client-side providers
├── components/            # Reusable components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── navbar.tsx        # Navigation component
│   ├── project-card.tsx  # Project card component
│   └── funding-progress.tsx # Funding progress component
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client configuration
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
└── hooks/                # Custom React hooks
```

## API Endpoints

### Projects
- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Fetch a specific project
- `PATCH /api/projects/[id]` - Update a project

### Funding
- `POST /api/projects/[id]/fund` - Fund a project
- `GET /api/projects/[id]/funding-tiers` - Get funding tiers for a project
- `POST /api/projects/[id]/funding-tiers` - Create funding tiers for a project

## Database Schema

### Tables

1. **projects** - Main project information
2. **funding_tiers** - Different funding levels and benefits
3. **funding_contributions** - Individual funding contributions

### Key Features

- Row Level Security (RLS) enabled
- Automatic timestamps
- JSONB fields for flexible data (timeline, recent_activity)
- Foreign key relationships
- Performance indexes

## Features

- ✅ Responsive design with dark/light mode
- ✅ Project listing with search and filtering
- ✅ Project detail pages with funding functionality
- ✅ Real-time funding updates
- ✅ Funding tiers and benefits
- ✅ Supabase integration with proper security
- ✅ TypeScript support
- ✅ Modern UI with shadcn/ui components

## Next Steps

1. Add user authentication
2. Implement wallet integration
3. Add project creation form
4. Add admin dashboard
5. Implement real-time updates with Supabase subscriptions
6. Add image upload functionality
7. Implement email notifications 