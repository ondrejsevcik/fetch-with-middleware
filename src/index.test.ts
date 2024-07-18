import { describe, expect, it, vi } from "vitest";
import { type MiddlewareFn, type RequestFetchLike, buildFetch } from "./index";

describe("buildFetch", () => {
	it("is possible to create instance", async () => {
		const middlewareFn: MiddlewareFn = vi.fn();
		const fetchFn: RequestFetchLike = vi
			.fn()
			.mockImplementation((request) => Response.json({ ok: "ok" }));

		const fetch = buildFetch({ middlewares: [middlewareFn], fetchFn });

		const request = new Request("https://localhost:3000");
		const response = await fetch(request);

		expect(response.status).toEqual(200);
	});
});
