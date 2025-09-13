# fetch-with-middleware

Familiar Fetch API with support for custom middleware.

- Lightweight - only [235B Minified + Gzipped](https://bundlephobia.com/package/fetch-with-middleware)
- Zero dependencies
- **Side-effect free** - optimized for tree-shaking with `"sideEffects": false` in package.json
- [Fetch-compatible API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - No need to learn anything new.
- TypeScript types included

## Installation

Use npm to install the package.

```bash
npm install fetch-with-middleware
```

## Usage

```ts
import { buildFetch, type MiddlewareFn } from 'fetch-with-middleware';

// Custom middleware function that will 
// log to console every request and response.
const logToConsole: MiddlewareFn = (next) => (request) => {
    console.log("Request", request);

    return next(request).then((response) => {
        console.log("Response", response);
        return response;
    });
};

const myFetch = buildFetch({ middlewares: [logToConsole] });
const response = await myFetch("https://localhost:3000");
```

## Bundle Optimization

This library is designed to be side-effect free and includes `"sideEffects": false` in its package.json. This enables optimal tree-shaking in modern bundlers like Webpack, Rollup, and Vite, ensuring that unused exports are eliminated from your final bundle.

The entire library consists of pure functions and type definitions with no global state modifications, making it safe for aggressive optimization by bundlers.

