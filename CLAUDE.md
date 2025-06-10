# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev` (uses Turbopack for fast builds)
- **Production build**: `pnpm build`
- **Linting**: `pnpm lint`
- **Generate API client**: `pnpm run generate:api` (regenerates TypeScript client from OpenAPI spec)
- **Preview API documentation**: `pnpm run preview:api` (opens Redocly docs in browser)

## Architecture Overview

This is a **Next.js 15 App Router** project with **TypeScript** and **Tailwind CSS 4**, designed around an **API-first development** approach for a cooking/recipe platform.

### Key Architectural Patterns

**API-First Development**: The project uses OpenAPI specifications (`openapi/openapi.yaml`) to generate type-safe TypeScript client code. The API spec is the source of truth for data contracts between frontend and backend.

**Generated API Client**: Run `pnpm run generate:api` after any changes to `openapi/openapi.yaml`. This regenerates the entire `/src/lib/api/` directory with:
- Type-safe API functions in `apis/DefaultApi.ts`
- TypeScript interfaces in `models/` directory
- Runtime utilities for HTTP requests

**Current API Endpoints**:
- `GET /recipes` - Retrieve all recipes (no filtering/pagination)
- `GET /recipes/{id}` - Retrieve specific recipe by ID

### Core Data Models

**Recipe Schema**: Contains basic info (id, title, description), timing (prepTime, cookTime, servings), content arrays (ingredients, instructions), and metadata (tags, imageUrl, timestamps).

**Ingredient Schema**: Structured with name, amount, unit (all required), plus optional notes.

**Instruction Schema**: Sequential steps with step number, description (both required), plus optional imageUrl and estimatedTime.

### Project Structure Specifics

- **App Router**: All pages in `src/app/` directory
- **Generated Code**: Never manually edit `src/lib/api/` - always regenerate from OpenAPI spec
- **API Spec**: Located at `openapi/openapi.yaml` with Japanese documentation for "Vibe Cooking API"
- **Styling**: Uses Tailwind CSS 4 with CSS custom properties for theming

### Development Workflow

1. **API Changes**: Modify `openapi/openapi.yaml` → run `pnpm run generate:api` → commit both spec and generated code
2. **Preview API Docs**: Use `pnpm run preview:api` to view API documentation during development
3. **Font Optimization**: Project uses Geist font via `next/font` for automatic optimization

### Important Notes

- The project uses **pnpm** as package manager (not npm/yarn)
- Development server includes **Turbopack** for faster builds
- API server runs on `http://localhost:3000/api` (Next.js API routes)
- All generated TypeScript types use **string enums** and **ES6+ features**
- The `.gitignore` excludes `openapi/openapitools.json` and `src/lib/api` (except when committing generated updates)