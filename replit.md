# Bitcoin Ordinals API Project Architecture

## Overview

This project is a full-stack web application for creating Bitcoin Ordinals and Collections using Taproot transactions. It provides an API for storing metadata and images on-chain, with client-side transaction signing for security. The application is built with a React frontend and an Express backend, using Drizzle ORM for database access.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with these core components:

1. **Frontend**: React-based SPA with client-side routing
2. **Backend**: Express.js API server
3. **Database**: PostgreSQL with Drizzle ORM
4. **Authentication**: Client-side Bitcoin private key signatures

The application is structured in three main directories:
- `client/`: Contains all frontend React code
- `server/`: Houses the Express.js API
- `shared/`: Includes shared types, schemas, and utilities used by both client and server

### Development and Production Workflow

- Development: `npm run dev` uses tsx to run the server with hot reloading
- Production: `npm run build` compiles both client and server, then `npm run start` runs the production build

## Key Components

### Frontend

1. **UI Framework**: Custom components built on Radix UI primitives with a consistent design system
2. **Routing**: Uses Wouter for lightweight client-side routing
3. **State Management**: React Query for server state and local React state
4. **Styling**: TailwindCSS for utility-first styling

### Backend

1. **API Server**: Express.js with JSON middleware
2. **Database Access**: Drizzle ORM for type-safe database queries
3. **Bitcoin Integration**: Bitcoin.js library for transaction creation and signing
4. **File Handling**: Support for embedding images and metadata in Bitcoin transactions

### Data Layer

1. **Schema**: Defined in `shared/schema.ts` using Drizzle schema definitions
2. **Validation**: Zod schemas for request validation
3. **Database Tables**:
   - `collections`: Stores Bitcoin collection information
   - `ordinals`: Stores individual ordinal NFTs, can be linked to collections

## Data Flow

1. **Client Requests**:
   - User inputs data (name, description, image, etc.)
   - Client validates input
   - Client makes API request to appropriate endpoint

2. **Server Processing**:
   - Express routes receive requests
   - Validate request data using Zod schemas
   - Process Bitcoin transactions using the Bitcoin.js library
   - Store transaction data in database
   - Return response to client

3. **Bitcoin Transaction Flow**:
   - Generate appropriate transaction with metadata
   - Sign transaction using client-provided private key
   - Broadcast transaction to Bitcoin network
   - Update database with transaction details

## External Dependencies

### Frontend Dependencies
- React ecosystem: React, React DOM
- UI components: Radix UI, Shadcn UI components
- State management: @tanstack/react-query
- HTTP requests: axios
- Routing: wouter

### Backend Dependencies
- Server: Express
- Bitcoin: bitcoinjs-lib, tiny-secp256k1, ecpair
- Database: drizzle-orm, @neondatabase/serverless
- Validation: zod, drizzle-zod

### Development Dependencies
- Bundling: Vite, esbuild
- TypeScript execution: tsx
- Styling: TailwindCSS, PostCSS, Autoprefixer

## Deployment Strategy

The application is configured for deployment on Replit, with the following considerations:

1. **Database**: Expecting a PostgreSQL database connection via `DATABASE_URL` environment variable
2. **Build Process**: Defined in `.replit` configuration
   - Build: `npm run build`
   - Run: `npm run start`
3. **Port Configuration**: Server listens on port 5000, mapped to port 80 for external access
4. **Environment Variables**:
   - `DATABASE_URL`: Required for database connection
   - `NODE_ENV`: Used to determine development or production mode

## Development Workflows

1. **Adding a new API endpoint**:
   - Add route in `server/routes.ts`
   - Implement handler logic
   - Add validation using Zod schemas
   - Update client API integration

2. **Creating new UI components**:
   - Add to `client/src/components/ui`
   - Follow existing patterns for consistency
   - Import into pages as needed

3. **Database Schema Changes**:
   - Update schema in `shared/schema.ts`
   - Run `npm run db:push` to apply changes
   - Update related server code

4. **Adding new pages**:
   - Create component in `client/src/pages`
   - Add route in `client/src/App.tsx`
   - Link to it from navigation components