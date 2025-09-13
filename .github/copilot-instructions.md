# fetch-with-middleware

fetch-with-middleware is a TypeScript library that provides a lightweight wrapper around the Fetch API with support for custom middleware. It's a small, focused library (only 235B minified + gzipped) with zero dependencies.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Setup
- **ALWAYS install dependencies first**: `npm install` -- takes ~20 seconds to complete. NEVER CANCEL. Set timeout to 60+ seconds.

### Development Commands
- **Lint code**: `npm run lint` -- runs both Biome and TypeScript checks, takes ~1.5 seconds
- **Fix linting issues**: `npm run lint:fix` -- auto-fixes Biome formatting issues, takes ~0.2 seconds  
- **TypeScript-only check**: `npm run lint:ts` -- runs TypeScript compiler without emit, takes ~1 second
- **Run tests**: `npm test` -- runs Vitest test suite, takes ~2 seconds. NEVER CANCEL.
- **Run tests with coverage**: `npm run coverage` -- generates coverage report, takes ~2 seconds. Note: May fail due to 100% coverage threshold requirements.
- **Build package**: `npm run build` -- builds ESM, CJS, and TypeScript declarations, takes ~2.5 seconds. NEVER CANCEL.
- **Preview build**: `npm run preview` -- starts local server at http://localhost:4173/, starts immediately

### Build Output
- Build produces files in `/dist/` directory:
  - `index.js` - ESM module
  - `index.cjs` - CommonJS module  
  - `index.d.ts` - TypeScript declarations
  - Source maps for all modules

## Validation Requirements

### ALWAYS run these validation steps after making changes:
1. **Format and lint**: `npm run lint:fix && npm run lint` -- ensures code style consistency
2. **Type check**: `npm run lint:ts` -- validates TypeScript types
3. **Test functionality**: `npm test` -- runs full test suite
4. **Build successfully**: `npm run build` -- ensures package builds correctly
5. **Manual validation**: Test the middleware functionality by creating a simple test script

### Manual Validation Scenario
After making changes to the core functionality, ALWAYS test the middleware behavior:

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

### CI/CD Validation
- **ALWAYS run `npm run lint` before committing** - the GitHub Actions CI will fail otherwise
- PR titles must follow conventional commit format (enforced by GitHub Actions)
- The release workflow automatically publishes to npm on main branch merges

## Repository Structure and Navigation

### Key Files and Directories
```
/src/index.ts          -- Main library implementation
/src/index.test.ts     -- Test suite with Vitest
/dist/                 -- Build output (generated)
package.json           -- Dependencies and scripts  
tsconfig.json          -- TypeScript configuration
biome.json            -- Biome linter/formatter config
vite.config.mts       -- Vite build configuration
.github/workflows/    -- CI/CD automation
```

### Important Code Locations
- **Core middleware logic**: `/src/index.ts` lines 11-18 (middlewareHelper function)
- **Main API**: `/src/index.ts` lines 20-27 (buildFetch function)
- **Type definitions**: `/src/index.ts` lines 1-9
- **Test examples**: `/src/index.test.ts` - demonstrates correct middleware usage patterns

## Common Tasks and Troubleshooting

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

## Timing Expectations
- `npm install`: ~20 seconds (first time)
- `npm run lint`: ~1.5 seconds  
- `npm test`: ~2 seconds
- `npm run build`: ~2.5 seconds
- `npm run coverage`: ~2 seconds

**NEVER CANCEL any command before these time limits. Set timeouts to at least 60 seconds for npm install and 30 seconds for other commands.**

## Development Workflow Summary
1. `npm install` (if fresh clone)
2. Make your changes to `/src/index.ts`
3. Add/update tests in `/src/index.test.ts`  
4. `npm run lint:fix && npm run lint`
5. `npm test`
6. `npm run build`
7. Manual validation with test script
8. Commit changes (semantic commit messages required)