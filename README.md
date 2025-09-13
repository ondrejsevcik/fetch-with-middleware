# fetch-with-middleware

A lightweight wrapper around the Fetch API that lets you add custom middleware to your HTTP requests. Use the same familiar fetch syntax while adding powerful features like logging, authentication, retries, and more.

- **Ultra lightweight** - only [235B minified + gzipped](https://bundlephobia.com/package/fetch-with-middleware)
- **Zero dependencies** - no extra packages to slow down your app
- **Tree-shakable** - modern bundlers can remove unused code to keep your bundle small
- **Drop-in replacement** - works exactly like the [standard Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), no new syntax to learn
- **TypeScript ready** - includes full type definitions for better development experience
- **ESM-only** - modern ECMAScript module format for better performance and compatibility

## Installation

Use npm to install the package.

```bash
npm install fetch-with-middleware
```

> **Note:** This package is published in ESM format only. Make sure your project supports ESM modules.

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

## Migration from CommonJS

This package only supports ESM imports. If you're migrating from CommonJS, you'll need to:

1. **Update your project to support ESM** by adding `"type": "module"` to your `package.json`
2. **Change require() to import** statements:
   ```ts
   // Before (CommonJS - no longer supported)
   const { buildFetch } = require('fetch-with-middleware');
   
   // After (ESM)
   import { buildFetch } from 'fetch-with-middleware';
   ```
3. **Update file extensions** if needed (`.mjs` or `.js` with `"type": "module"`)

For more information on migrating to ESM, see the [Node.js ESM documentation](https://nodejs.org/api/esm.html).


