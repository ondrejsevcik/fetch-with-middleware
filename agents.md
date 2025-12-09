# AI Agent Instructions

This file provides guidance to AI coding assistants (Claude Code, GitHub Copilot, etc.) when working with code in this repository.

## Project Overview

fetch-with-middleware is a lightweight TypeScript library (235B minified + gzipped) that wraps the Fetch API with custom middleware support. It has zero dependencies and is tree-shakable.

## Development Commands

### Essential Commands
- `npm install` - Install dependencies (~20 seconds, NEVER CANCEL, set timeout 60+ seconds)
- `npm run build` - Build ESM, CJS, and TypeScript declarations (~2.5 seconds)
- `npm test` - Run Vitest test suite (~2 seconds)
- `npm run coverage` - Generate coverage report (~2 seconds, may fail if <100% coverage)
- `npm run lint` - Run Biome and TypeScript checks (~1.5 seconds)
- `npm run lint:fix` - Auto-fix Biome formatting issues (~0.2 seconds)
- `npm run lint:ts` - TypeScript-only type checking (~1 second)
- `npm run preview` - Start local server at http://localhost:4173/

### Build Outputs
Build produces files in `/dist/`:
- `index.js` - ESM module
- `index.cjs` - CommonJS module
- `index.d.ts` - TypeScript declarations
- Source maps for all modules

## Architecture

### Core Implementation
The library consists of a single source file with a simple but powerful architecture:

**src/index.ts** - Contains the entire implementation (~28 lines):
- Type definitions (lines 1-9): `FetchLike`, `MiddlewareFn`, `Options`
- `middlewareHelper` function (lines 11-18): Composes middleware using `reduceRight` to create an onion-like execution pattern
- `buildFetch` function (lines 20-27): Main API that creates a fetch function with middleware applied

### Middleware Execution Pattern
Middleware executes in an "onion" pattern:
- First middleware in array executes first on the request path
- Last middleware in array executes first on the response path
- Implementation uses `reduceRight` to wrap each middleware around the next

Example execution order for `[middlewareOne, middlewareTwo]`:
```
middlewareOne before → middlewareTwo before → fetch → middlewareTwo after → middlewareOne after
```

### Type System
- `FetchLike`: Function signature matching native fetch API
- `MiddlewareFn`: Takes `next` function, returns wrapped function
- All types are exported for consumer use

## Key Files and Directories

```
/src/index.ts          -- Main library implementation
/src/index.test.ts     -- Test suite with Vitest
/dist/                 -- Build output (generated)
package.json           -- Dependencies and scripts
tsconfig.json          -- TypeScript configuration
biome.json             -- Biome linter/formatter config
vite.config.mts        -- Vite build configuration
.github/workflows/     -- CI/CD automation
```

## Testing

Tests are located in `src/index.test.ts` and use Vitest with `vi.fn()` for mocking.

Key test patterns:
- Mock fetch using `vi.fn().mockImplementation()`
- Test middleware execution order by tracking calls in an array
- Validate Request/Response handling

### Manual Testing
After making changes to core functionality, test middleware behavior:

```javascript
import { buildFetch } from './dist/index.js';

// Test middleware chaining
const loggerMiddleware = (next) => (request) => {
    console.log('Request:', request.url);
    return next(request).then(response => {
        console.log('Response:', response.status);
        return response;
    });
};

const myFetch = buildFetch({ middlewares: [loggerMiddleware] });
const response = await myFetch('https://example.com');
```

## Validation Workflow

ALWAYS run these steps after making changes:
1. `npm run lint:fix && npm run lint` - Format and validate
2. `npm run lint:ts` - Type check
3. `npm test` - Run tests
4. `npm run build` - Ensure clean build
5. Manual validation with test script (for core changes)

## CI/CD

- **ALWAYS run `npm run lint` before committing** - GitHub Actions CI will fail otherwise
- PR titles must follow Conventional Commits format (enforced by GitHub Actions)
- Release workflow automatically publishes to npm on main branch merges

## Package Configuration

- Module formats: ESM (`.js`), CommonJS (`.cjs`), TypeScript (`.d.ts`)
- Entry points defined in `package.json` exports field
- `sideEffects: false` enables tree-shaking
- Requires Node.js >=18.0.0, npm >=10.0.0

## Development Guidelines

### Adding New Functionality
1. Modify `/src/index.ts` with your changes
2. Add corresponding tests in `/src/index.test.ts`
3. Run validation steps (lint, test, build)
4. Ensure TypeScript types are properly exported

### Debugging Test Failures
- Tests use Vitest with vi.fn() for mocking
- Check middleware execution order in tests - first middleware wraps second middleware
- Validate Request/Response object handling in middleware functions

### Build Issues
- If TypeScript compilation fails, check `tsconfig.json` includes all necessary types
- If build output is missing, ensure Vite configuration in `vite.config.mts` is correct
- Missing dependencies: run `npm install` to restore node_modules

### Performance Considerations
- Library is designed to be lightweight (235B gzipped)
- Middleware functions should be efficient as they wrap every request
- Build time is fast (~2.5s) - avoid changes that significantly increase build time

## Important Timing Expectations

- `npm install`: ~20 seconds (first time)
- `npm run lint`: ~1.5 seconds
- `npm test`: ~2 seconds
- `npm run build`: ~2.5 seconds
- `npm run coverage`: ~2 seconds

**NEVER CANCEL any command before these time limits. Set timeouts to at least 60 seconds for npm install and 30 seconds for other commands.**
