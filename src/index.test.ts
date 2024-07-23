import { describe, expect, it, vi } from "vitest";
import { type MiddlewareFn, type RequestFetchLike, buildFetch } from "./index";

describe("buildFetch", () => {
	it("is possible to use it without middleware", async () => {
		const fetchFn: RequestFetchLike = vi
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

		const fetchFn: RequestFetchLike = async (request) => {
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
});
