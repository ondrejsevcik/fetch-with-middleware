# fetch-with-middleware

Familiar Fetch API with support for custom middleware.

- Lightweight
- Zero dependencies
- [Fetch-compatible API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
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

const myFetch = buildFetch({ middleware: [logToConsole] });
const response = await myFetch("https://localhost:3000");
```

