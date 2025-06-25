# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Cloudflare Workers application that provides a random string/hash generation API service hosted at itty.id. The service generates customizable random strings with various character sets and lengths.

## Core Architecture

- **Router**: Uses `itty-router` AutoRouter with global middleware (CORS, length parsing) and response formatting
- **Middleware**: `withLength` middleware parses length from URL params or query params, defaults to 10
- **Response Handler**: `jsonOrText` automatically returns JSON or text based on Accept header
- **Hash Generation**: Uses `supergeneric` library to generate random strings with configurable character sets

### API Endpoints Structure
All endpoints follow the pattern `/{type}/{length?}` where:
- `type`: Defines character set (alpha, numeric, uppercase, symbols, etc.)
- `length`: Optional parameter (defaults to 10 via middleware)

Key endpoints include:
- `/` - Default alphanumeric hash
- `/alpha/{length}` - Letters only
- `/numeric/{length}` - Numbers only  
- `/uppercase/{length}` - Uppercase letters only
- `/from/{characters}/{length}` - Custom character set

## Development Commands

```bash
# Development server
npm run dev
# or 
npm start

# Deploy to Cloudflare Workers
npm run deploy

# Run tests
npm test

# Generate Cloudflare types
npm run cf-typegen
```

## Testing

- Uses Vitest with `@cloudflare/vitest-pool-workers` for Cloudflare Workers testing
- Test files located in `test/` directory
- Supports both unit and integration style testing

## TypeScript Configuration

- Target: ES2021
- Bundler module resolution with path alias `@/*` → `./src/*`
- Strict type checking enabled
- Tests excluded from main compilation

## Cloudflare Workers Configuration

- Routes: `itty.id/*` and `itty.id`
- Node.js compatibility enabled
- Entry point: `src/index.ts`
- Compatibility date: 2024-12-30