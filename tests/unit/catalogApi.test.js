import { afterEach, describe, expect, it, vi } from "vitest";
import { demoCatalogFixtures } from "../fixtures/storefront";
import { fetchCatalog } from "../../src/services/catalogApi";

function responseWithJson(body, status = 200) {
	return {
		ok: status >= 200 && status < 300,
		status,
		json: vi.fn().mockResolvedValue(body),
	};
}

afterEach(() => {
	vi.restoreAllMocks();
	vi.useRealTimers();
});

describe("fetchCatalog", () => {
	it("loads the local catalog under Vite's base path", async () => {
		const fetchSpy = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(responseWithJson(demoCatalogFixtures));

		await expect(fetchCatalog()).resolves.toEqual(demoCatalogFixtures);
		expect(fetchSpy).toHaveBeenCalledWith(
			expect.stringMatching(/data\/products\.json$/),
			expect.objectContaining({ signal: undefined }),
		);
	});

	it("rejects a response that is not a catalog list", async () => {
		const fetchSpy = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(responseWithJson({ products: [] }));

		await expect(fetchCatalog()).rejects.toThrow(/catalogo/i);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it("retries a transient service error and returns the local catalog", async () => {
		const fetchSpy = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValueOnce(responseWithJson({}, 503))
			.mockResolvedValueOnce(responseWithJson(demoCatalogFixtures));
		const onRetry = vi.fn();

		await expect(fetchCatalog({ onRetry })).resolves.toEqual(demoCatalogFixtures);
		expect(fetchSpy).toHaveBeenCalledTimes(2);
		expect(onRetry).toHaveBeenCalledWith(1, 300);
	});

	it("propagates cancellation without retrying", async () => {
		const abortError = new DOMException("Aborted", "AbortError");
		const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(abortError);

		await expect(fetchCatalog({ signal: new AbortController().signal })).rejects.toMatchObject({
			name: "AbortError",
		});
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it("does not retry when cancellation happens during retry backoff", async () => {
		const controller = new AbortController();
		const fetchSpy = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(responseWithJson({}, 503));
		const onRetry = vi.fn(() => controller.abort());

		await expect(
			fetchCatalog({ signal: controller.signal, onRetry }),
		).rejects.toMatchObject({ name: "AbortError" });
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});
});