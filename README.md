# fetch-with-middleware

A lightweight wrapper around the Fetch API that lets you add custom middleware to your HTTP requests. Use the same familiar fetch syntax while adding powerful features like logging, authentication, retries, and more.

- **Ultra lightweight** - only [235B minified + gzipped](https://bundlephobia.com/package/fetch-with-middleware)
- **Zero dependencies** - no extra packages to slow down your app
- **Tree-shakable** - modern bundlers can remove unused code to keep your bundle small
- **Drop-in replacement** - works exactly like the [standard Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), no new syntax to learn
- **TypeScript ready** - includes full type definitions for better development experience


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

## Usage Examples

Here are practical examples demonstrating how to use the library with various middleware patterns:

### Console logging / error reporting tool

```ts
const logToConsole: MiddlewareFn = (next) => (request) => {
    console.log("Request", request);

    return next(request).then(async (response) => {
        console.log("Response", response);
        return response;
    });
};

const myFetch = buildFetch({ middlewares: [logToConsole] });
```

### Add authentication token to requests

```ts
const addCustomHeader: MiddlewareFn = (next) => (...args) => {
    const getToken = () => "your-auth-token"; // Replace with your token logic
    
    // Convert args to Request if needed
    const request = args[0] instanceof Request ? args[0] : new Request(args[0], args[1]);
    const token = getToken();
    request.headers.set('Authorization', `Bearer ${token}`);
    
    return next(request);
};

const myFetch = buildFetch({ middlewares: [addCustomHeader] });
```

### Throw error on 4xx or 5xx response

```ts
const errorOnNotOkResponse: MiddlewareFn = (next) => (...args) => {
    return next(...args).then(async (response) => {
        if (!response.ok) {
            throw new Error(`Response status ${response.status}`);
        }
        return response;
    });
};

const myFetch = buildFetch({ middlewares: [errorOnNotOkResponse] });
```

### Refresh token on 401 Unauthorized response

```ts
const refreshTokenOnUnauthorizedResponse: MiddlewareFn = (next) => (...args) => {
    let hasRetried = false;

    return next(...args).then(async (response) => {
        if (response.status === 401 && !hasRetried) {
            hasRetried = true;

            // Replace with your token refresh logic
            await refreshToken();
            
            // Replay the request one more time
            return next(...args);
        }
        return response;
    });
};

const myFetch = buildFetch({ middlewares: [refreshTokenOnUnauthorizedResponse] });
```




