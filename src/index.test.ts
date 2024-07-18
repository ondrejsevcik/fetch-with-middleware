import { describe, expect, it } from "vitest";
import { hello } from "./index";

describe("hello", () => {
	it("works", () => {
		expect(hello).toEqual("there");
	});
});
