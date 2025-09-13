export type FetchArgs = Parameters<typeof fetch>;
export type FetchResponse = ReturnType<typeof fetch>;
export type FetchLike = (...args: FetchArgs) => FetchResponse;
export type MiddlewareFn = (next: FetchLike) => FetchLike;

export type Options = {
	readonly middlewares?: readonly MiddlewareFn[];
	readonly fetchFn?: FetchLike;
};

function middlewareHelper(middlewares: readonly MiddlewareFn[]) {
	return (fetchFunction: FetchLike): FetchLike => {
		return (
			middlewares.reduceRight((acc, curr) => curr(acc), fetchFunction) ||
			fetchFunction
		);
	};
}

export function buildFetch(options: Options): FetchLike {
	const middlewares = options.middlewares || [];
	const fetchFn = options.fetchFn || fetch;

	return function fetchWithMiddleware(...args: FetchArgs): FetchResponse {
		return middlewareHelper(middlewares)(fetchFn)(...args);
	};
}
