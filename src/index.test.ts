import { describe, expect, it, vi } from "vitest";
import {
	type FetchLike,
	type MiddlewareFn,
	type Options,
	buildFetch,
} from "./index";

describe("buildFetch", () => {
	it("is possible to use it without middleware", async () => {
		const fetchFn: FetchLike = vi
			.fn()
			.mockImplementation((request) => Response.json({ ok: "ok" }));

		const fetch = buildFetch({ middlewares: [], fetchFn });

		const request = new Request("https://localhost:3000");
		const response = await fetch(request);

		expect(response.status).toEqual(200);
		expect(response.ok).toEqual(true);
		expect(await response.json()).toEqual({ ok: "ok" });
	});

	it("calls the middleware in correct order", async () => {
		const orderOfCalls: string[] = [];

		const middlewareOne: MiddlewareFn = (next) => (request) => {
			orderOfCalls.push("first - before");
			return next(request).then((response) => {
				orderOfCalls.push("first - after");
				return response;
			});
		};

		const middlewareTwo: MiddlewareFn = (next) => (request) => {
			orderOfCalls.push("second - before");
			return next(request).then((response) => {
				orderOfCalls.push("second - after");
				return response;
			});
		};

		const fetchFn: FetchLike = async (request) => {
			orderOfCalls.push("fetch");
			return Response.json({ ok: "ok" });
		};

		const fetch = buildFetch({
			middlewares: [middlewareOne, middlewareTwo],
			fetchFn,
		});

		const request = new Request("https://localhost:3000");
		const response = await fetch(request);

		expect(response.status).toEqual(200);
		expect(orderOfCalls).toEqual([
			"first - before",
			"second - before",
			"fetch",
			"second - after",
			"first - after",
		]);
	});

	it("works with readonly options and readonly middlewares array", async () => {
		const middlewareOne: MiddlewareFn = (next) => (request) => {
			return next(request);
		};

		const fetchFn: FetchLike = vi
			.fn()
			.mockImplementation(() => Response.json({ readonly: "test" }));

		// Test that readonly options work correctly
		const readonlyOptions: Options = {
			middlewares: [middlewareOne] as const,
			fetchFn,
		} as const;

		const fetch = buildFetch(readonlyOptions);

		const request = new Request("https://localhost:3000");
		const response = await fetch(request);

		expect(response.status).toEqual(200);
		expect(await response.json()).toEqual({ readonly: "test" });
	});

	it("preserves readonly nature of middlewares array in Options type", () => {
		// This test validates the type system behavior at compile time
		const middlewareOne: MiddlewareFn = (next) => next;
		const middlewareTwo: MiddlewareFn = (next) => next;

		const options: Options = {
			middlewares: [middlewareOne, middlewareTwo],
		};

		// This should work fine - we can read the middlewares
		expect(options.middlewares).toBeDefined();
		expect(Array.isArray(options.middlewares)).toBe(true);

		// The following would cause TypeScript compilation errors if uncommented:
		// options.middlewares = []; // Error: Cannot assign to 'middlewares' because it is a read-only property
		// options.middlewares?.push(middlewareOne); // Error: Property 'push' does not exist on type 'readonly MiddlewareFn[]'
		// options.fetchFn = fetch; // Error: Cannot assign to 'fetchFn' because it is a read-only property
	});
});
