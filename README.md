# Prismo - Social Media Dashboard

A comprehensive social media management platform built with Next.js 14, enabling multi-platform posting, content scheduling, analytics tracking, and engagement monitoring.

## Features

- **Multi-Platform Integration**: Connect and manage Twitter, Facebook, Instagram, LinkedIn, and TikTok accounts
- **Content Management**: Rich text editor with media upload and platform-specific validation
- **Scheduling System**: Schedule posts across time zones with automated publishing
- **Analytics Dashboard**: Track performance metrics and engagement across all platforms
- **Engagement Monitoring**: Real-time notifications and response management
- **Team Collaboration**: Content approval workflows and team member management
- **Responsive Design**: Mobile-optimized interface with accessibility features

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM (to be implemented)
- **Authentication**: NextAuth.js with OAuth providers (to be implemented)
- **Deployment**: Vercel-ready configuration

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   └── ui/             # shadcn/ui components
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Implementation Status

✅ **Task 1 Complete**: Project foundation and core infrastructure
- Next.js 14 with TypeScript and App Router
- Tailwind CSS with shadcn/ui setup
- ESLint and Prettier configuration
- Basic folder structure and type definitions

## Next Steps

Continue with Task 2: Configure database and ORM setup to begin implementing the data layer.

## Contributing

This project follows a spec-driven development approach. See the `.kiro/specs/prismo-dashboard/` directory for detailed requirements, design, and implementation tasks.
