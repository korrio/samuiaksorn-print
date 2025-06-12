# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Architecture Overview

This is a Next.js 15 application using the App Router that serves as a CRM/Lead management frontend for an Odoo 16 ERP system. The application focuses on print job management with responsive designs for desktop and mobile.

### Key Architectural Decisions

1. **App Router with Server Components**: Uses Next.js 15 App Router (`app/` directory). Components are Server Components by default, with Client Components explicitly marked with "use client".

2. **Responsive Component Strategy**: Separate components for desktop (`PrintJobPage`) and mobile (`PrintJobPageNew`) experiences, with responsive utilities controlling visibility.

3. **API Integration Pattern**: 
   - Base API: `https://api.erpsamuiaksorn.com`
   - Custom hook `useFetchLeadById` for data fetching
   - Supports fetching by both ID and job number
   - Uses axios for HTTP requests

4. **UI Component Library**: Uses shadcn/ui components built on Radix UI primitives, located in `components/ui/`. These components use class-variance-authority for variant management.

5. **Styling System**: Tailwind CSS with CSS variables for theming. Dark mode support is configured. Chart colors (chart-1 through chart-5) are defined for data visualization with recharts.

### Project Structure

- `/app` - Next.js App Router pages and layouts
  - `/crm/dashboard` - CRM dashboard functionality
  - `/crm/dashboard/new` - New lead creation
  - `/crm/dashboard/mock` - Mock data testing
- `/components` - Shared components including print job views and QR code generation
- `/components/ui` - shadcn/ui component library
- `/hooks` - Custom React hooks for data fetching
- `/lib` - Utilities including cn() for className merging

### Important Context

- The application connects to an Odoo 16 ERP system for lead/CRM data
- Print functionality is a core feature with dedicated print job pages
- QR code generation is used for lead/job tracking
- The project uses TypeScript with strict mode enabled
- Path alias `@/*` is configured for imports from project root