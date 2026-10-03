import { describe, expect, it } from "vitest";
import { demoCatalogFixtures } from "../fixtures/storefront";
import { createDemoReceipt } from "../../src/services/demoCheckout";

const validLines = [{ ...demoCatalogFixtures[0], quantity: 2 }];

describe("createDemoReceipt", () => {
	it.each(["approved", "rejected", "cancelled", "pending"])(
		"creates a fictional %s summary using integer CLP",
		(outcome) => {
			const receipt = createDemoReceipt(validLines, outcome);

			expect(receipt).toMatchObject({
				status: outcome,
				currency: "CLP",
				total: 16000,
				lines: [
					{
						id: "demo-action-game",
						name: "Juego de accion de demostracion",
						quantity: 2,
					unitPrice: 8000,
					lineTotal: 16000,
					},
				],
			});
			expect(receipt.id).toMatch(/^DEMO-/);
			expect(receipt).not.toHaveProperty("email");
			expect(receipt).not.toHaveProperty("paymentMethod");
		},
	);

	it("rejects an empty cart, incomplete offer, invalid quantity, and unknown result", () => {
		expect(() => createDemoReceipt([], "approved")).toThrow();
		expect(() =>
			createDemoReceipt([{ ...demoCatalogFixtures[1], quantity: 1 }], "approved"),
		).toThrow();
		expect(() =>
			createDemoReceipt([{ ...demoCatalogFixtures[0], quantity: 1.5 }], "approved"),
		).toThrow();
		expect(() => createDemoReceipt(validLines, "unknown")).toThrow();
	});

	it("does not mutate the cart snapshot", () => {
		const originalLine = { ...validLines[0] };
		createDemoReceipt(validLines, "approved");
		expect(validLines[0]).toEqual(originalLine);
	});
});