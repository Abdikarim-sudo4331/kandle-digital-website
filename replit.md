# Kandle Digital - Agency Website

## Overview

Kandle Digital is a digital marketing agency website built to showcase services, capture leads, and convert visitors. The project is a full-stack TypeScript application with a React frontend and Express backend, designed for a Kenyan digital marketing agency targeting SMEs and global brands.

The site focuses on conversion optimization with a clean, modern design inspired by high-converting agency sites like Vercel, Stripe, and Linear. Key pages include Home, Services, About, and Contact, with a contact form that submits inquiries to a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for smooth page transitions and micro-interactions
- **State Management**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for type-safe contracts
- **Build**: esbuild for server bundling, Vite for client

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines tables using Drizzle's pgTable syntax
- **Migrations**: Drizzle Kit handles schema migrations (`drizzle-kit push`)

### Project Structure
```
client/           # React frontend
  src/
    components/   # Reusable components (Navbar, Footer, WhatsAppButton)
    components/ui/# shadcn/ui primitives
    pages/        # Route pages (Home, Services, About, Contact)
    hooks/        # Custom hooks (use-contact, use-toast)
    lib/          # Utilities (queryClient, utils)
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route handlers
  storage.ts      # Database access layer
  db.ts           # Drizzle database connection
shared/           # Shared code between client/server
  schema.ts       # Drizzle table definitions
  routes.ts       # API contract definitions with Zod
```

### Design System
- **Typography**: Inter for body text, Poppins for display/headlines
- **Colors**: Warm amber/orange primary (#F97316), dark charcoal foreground (#111827)
- **Layout**: max-w-7xl container, responsive grid layouts
- **Components**: Cards with subtle borders, rounded corners (0.75rem radius)

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Frontend Libraries
- **@tanstack/react-query**: Async state management for API calls
- **framer-motion**: Animation library for smooth transitions
- **react-icons**: Icon library (used for WhatsApp button)
- **embla-carousel-react**: Carousel component
- **react-day-picker**: Calendar/date picker component

### UI Framework
- **Radix UI**: Headless component primitives (dialog, dropdown, popover, etc.)
- **class-variance-authority**: Component variant styling
- **tailwind-merge**: Utility class merging

### Development Tools
- **Vite**: Frontend dev server and bundler
- **esbuild**: Server-side bundling for production
- **tsx**: TypeScript execution for development

### Fonts (External CDN)
- Google Fonts: Inter, Poppins, DM Sans, Fira Code, Geist Mono