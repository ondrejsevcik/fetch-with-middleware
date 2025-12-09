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

## Examples

Here are practical examples showing how to use middleware for common use cases:

### Console logging / error reporting

```ts
import { buildFetch, type MiddlewareFn } from 'fetch-with-middleware';

const logToConsole: MiddlewareFn = (next) => (...args) => {
    console.log("Request", args);

    return next(...args).then(async (response) => {
        console.log("Response", response);
        return response;
    });
};

const myFetch = buildFetch({ middlewares: [logToConsole] });
```

### Add authentication token to requests

```ts
import { buildFetch, type MiddlewareFn } from 'fetch-with-middleware';

const addAuthToken: MiddlewareFn = (next) => (...args) => {
    const token = getToken();

    // Create or modify the Request to include auth header
    const [input, init] = args;
    const headers = new Headers(init?.headers);
    headers.set('Authorization', `Bearer ${token}`);

    return next(input, { ...init, headers });
};

const myFetch = buildFetch({ middlewares: [addAuthToken] });
```

### Throw error on 4xx or 5xx response

```ts
import { buildFetch, type MiddlewareFn } from 'fetch-with-middleware';

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
import { buildFetch, type MiddlewareFn } from 'fetch-with-middleware';

const refreshTokenOnUnauthorized: MiddlewareFn = (next) => {
    let isRefreshing = false;

    return (...args) => {
        return next(...args).then(async (response) => {
            if (response.status === 401 && !isRefreshing) {
                isRefreshing = true;

                try {
                    await refreshToken();
                    // Replay the request one more time
                    return next(...args);
                } finally {
                    isRefreshing = false;
                }
            }
            return response;
        });
    };
};

const myFetch = buildFetch({ middlewares: [refreshTokenOnUnauthorized] });
```

### Retry with delay on first fail

```ts
import { buildFetch, type MiddlewareFn } from 'fetch-with-middleware';

const retry = (delayMs: number): MiddlewareFn => (next) => {
    return (...args) => {
        let hasRetried = false;

        const attemptFetch = (): Promise<Response> => {
            return next(...args).then((response) => {
                if (!response.ok && !hasRetried) {
                    hasRetried = true;
                    // Wait before retrying
                    return new Promise((resolve) => {
                        setTimeout(() => resolve(attemptFetch()), delayMs);
                    });
                }
                return response;
            });
        };

        return attemptFetch();
    };
};

const myFetch = buildFetch({ middlewares: [retry(1000)] });
```


