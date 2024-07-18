export type RequestFetchLike = (request: Request) => Promise<Response>;
export type MiddlewareFn = (next: RequestFetchLike) => RequestFetchLike;

export type Options = {
	middlewares?: MiddlewareFn[];
	fetchFn?: RequestFetchLike;
};

function middlewareHelper(middlewares: MiddlewareFn[]) {
	return (fetchFunction: RequestFetchLike): RequestFetchLike => {
		return (
			middlewares.reduceRight((acc, curr) => curr(acc), fetchFunction) ||
			fetchFunction
		);
	};
}

export function buildFetch(options: Options) {
	const middlewares = options.middlewares || [];
	const fetchFn = options.fetchFn || fetch;

	return function fetchWithMiddleware(request: Request): Promise<Response> {
		return middlewareHelper(middlewares)(fetchFn)(request);
	};
}
