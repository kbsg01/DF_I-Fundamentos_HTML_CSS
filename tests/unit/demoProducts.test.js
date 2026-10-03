import { describe, expect, it } from "vitest";
import { demoCatalogFixtures } from "../fixtures/storefront";
import {
	canAddDemoOffer,
	normalizeDemoCatalog,
} from "../../src/utils/demoProducts";

describe("normalizeDemoCatalog", () => {
	it("normalizes optional descriptive metadata without mutating the input", () => {
		const product = {
			...demoCatalogFixtures[0],
			genres: undefined,
			platforms: undefined,
			released: undefined,
			rating: undefined,
		};

		const [normalized] = normalizeDemoCatalog([product]);

		expect(normalized).toMatchObject({
			genres: [],
			platforms: [],
			released: null,
			rating: null,
		});
		expect(product.genres).toBeUndefined();
	});

	it("rejects a non-array catalog and entries without stable identity", () => {
		expect(() => normalizeDemoCatalog(null)).toThrow();
		expect(() =>
			normalizeDemoCatalog([{ ...demoCatalogFixtures[0], id: "" }]),
		).toThrow();
	});

	it.each([-1, 1.5, Number.NaN])(
		"rejects invalid CLP prices (%s)",
		(salePrice) => {
			expect(() =>
				normalizeDemoCatalog([
					{ ...demoCatalogFixtures[0], salePrice },
				]),
			).toThrow();
		},
	);

	it("rejects a sale price above the regular price", () => {
		expect(() =>
			normalizeDemoCatalog([
				{ ...demoCatalogFixtures[0], salePrice: 12000 },
			]),
		).toThrow();
	});
});

describe("canAddDemoOffer", () => {
	it("allows only complete active offers within their available quantity", () => {
		expect(canAddDemoOffer(demoCatalogFixtures[0], 2)).toBe(true);
		expect(canAddDemoOffer(demoCatalogFixtures[0], 6)).toBe(false);
	});

	it("rejects incomplete, free, or malformed offers and quantities", () => {
		expect(canAddDemoOffer(demoCatalogFixtures[1], 1)).toBe(false);
		expect(canAddDemoOffer({ ...demoCatalogFixtures[0], status: "incomplete" }, 1)).toBe(false);
		expect(canAddDemoOffer({ ...demoCatalogFixtures[0], salePrice: 0 }, 1)).toBe(false);
		expect(canAddDemoOffer(demoCatalogFixtures[0], 0)).toBe(false);
		expect(canAddDemoOffer(demoCatalogFixtures[0], 1.5)).toBe(false);
	});
});