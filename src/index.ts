/** Arguments passed to the fetch function - includes URL/Request and optional RequestInit */
export type FetchArgs = Parameters<typeof fetch>;

/** Promise that resolves to a Response object returned by fetch */
export type FetchResponse = ReturnType<typeof fetch>;

/** A function that behaves like the standard fetch API */
export type FetchLike = (...args: FetchArgs) => FetchResponse;

/**
 * A middleware function that wraps the next function in the chain.
 * Middleware executes in array order (first middleware wraps second, etc.)
 *
 * @param next - The next function in the middleware chain (either another middleware or the fetch function)
 * @returns A function that accepts fetch arguments and returns a fetch response
 *
 * @example
 * ```typescript
 * const loggerMiddleware: MiddlewareFn = (next) => (request) => {
 *   console.log('Making request to:', request.url);
 *   return next(request).then(response => {
 *     console.log('Response status:', response.status);
 *     return response;
 *   });
 * };
 * ```
 */
export type MiddlewareFn = (next: FetchLike) => FetchLike;

/**
 * Configuration options for building a fetch function with middleware support
 */
export type Options = {
	/** Array of middleware functions to apply. Executes in array order (first wraps second, etc.) */
	middlewares?: MiddlewareFn[];
	/** Custom fetch function to use as the base. Defaults to the global fetch */
	fetchFn?: FetchLike;
};

/**
 * Helper function that applies middleware to a fetch function in the correct order.
 * Uses reduceRight to ensure middleware executes in array order (first middleware wraps second, etc.)
 *
 * @param middlewares - Array of middleware functions to apply
 * @returns A function that accepts a fetch function and returns it wrapped with all middleware
 *
 * @internal This is an internal helper function
 */
function middlewareHelper(middlewares: MiddlewareFn[]) {
	return (fetchFunction: FetchLike): FetchLike => {
		return (
			middlewares.reduceRight((acc, curr) => curr(acc), fetchFunction) ||
			fetchFunction
		);
	};
}

/**
 * Builds a fetch function with middleware support.
 *
 * Middleware executes in array order where the first middleware wraps the second middleware,
 * the second wraps the third, and so on. This creates an "onion" pattern where the first
 * middleware gets to run code both before and after all other middleware.
 *
 * @param options - Configuration object for the enhanced fetch function
 * @param options.middlewares - Array of middleware functions to apply. Optional, defaults to empty array.
 * @param options.fetchFn - Custom fetch function to use as the base. Optional, defaults to global fetch.
 * @returns Enhanced fetch function compatible with the standard Fetch API
 *
 * @example Basic usage with logging middleware
 * ```typescript
 * const logger: MiddlewareFn = (next) => (request) => {
 *   console.log('Request:', request.url);
 *   return next(request).then(response => {
 *     console.log('Response:', response.status);
 *     return response;
 *   });
 * };
 *
 * const myFetch = buildFetch({ middlewares: [logger] });
 * const response = await myFetch('https://api.example.com');
 * ```
 *
 * @example Multiple middleware with authentication
 * ```typescript
 * const auth: MiddlewareFn = (next) => (request) => {
 *   const headers = new Headers(request.headers);
 *   headers.set('Authorization', 'Bearer token');
 *   return next(new Request(request, { headers }));
 * };
 *
 * const retry: MiddlewareFn = (next) => async (request) => {
 *   try {
 *     return await next(request);
 *   } catch (error) {
 *     console.log('Retrying request...');
 *     return next(request);
 *   }
 * };
 *
 * const myFetch = buildFetch({
 *   middlewares: [auth, retry] // auth runs first, then retry
 * });
 * ```
 *
 * @example Using with custom fetch function
 * ```typescript
 * const customFetch = (input, init) => fetch(input, { ...init, timeout: 5000 });
 * const myFetch = buildFetch({
 *   middlewares: [logger],
 *   fetchFn: customFetch
 * });
 * ```
 *
 * @since 1.0.0
 */
export function buildFetch(options: Options): FetchLike {
	const middlewares = options.middlewares || [];
	const fetchFn = options.fetchFn || fetch;

	return function fetchWithMiddleware(...args: FetchArgs): FetchResponse {
		return middlewareHelper(middlewares)(fetchFn)(...args);
	};
}
