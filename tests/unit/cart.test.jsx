import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CartProvider } from "../../src/context/CartContext";
import { useCart } from "../../src/hooks/useCart";
import { demoCatalogFixtures } from "../fixtures/storefront";

function wrapper({ children }) {
	return <CartProvider>{children}</CartProvider>;
}

describe("CartProvider", () => {
	it("keeps line counts, integer totals, and storage in sync", () => {
		const { result } = renderHook(() => useCart(), { wrapper });
		const product = demoCatalogFixtures[0];

		act(() => {
			result.current.addProduct(product);
			result.current.addProduct(product);
		});
		expect(result.current.itemCount).toBe(2);
		expect(result.current.items[0].quantity).toBe(2);
		expect(result.current.total).toBe(16000);

		act(() => result.current.changeQuantity(product.id, 1));
		expect(result.current.total).toBe(24000);
		act(() => result.current.changeQuantity(product.id, -1));
		expect(result.current.itemCount).toBe(2);

		expect(JSON.parse(localStorage.getItem("qBrandsCart"))[0].quantity).toBe(2);

		act(() => result.current.removeProduct(product.id));
		expect(result.current.items).toEqual([]);
		act(() => result.current.addProduct(product));
		act(() => result.current.clearCart());
		expect(result.current.total).toBe(0);
	});

	it("ignores incomplete offers and invalid or unavailable quantities", () => {
		const { result } = renderHook(() => useCart(), { wrapper });
		const product = demoCatalogFixtures[0];

		act(() => {
			result.current.addProduct(demoCatalogFixtures[1]);
			result.current.addProduct(product);
			result.current.changeQuantity(product.id, 1.5);
			for (let index = 0; index < 8; index += 1) {
				result.current.addProduct(product);
			}
		});

		expect(result.current.items).toHaveLength(1);
		expect(result.current.items[0].quantity).toBe(5);
		expect(result.current.total).toBe(40000);
	});

	it("retains a valid legacy qBrandsCart line without new offer metadata", () => {
		localStorage.setItem(
			"qBrandsCart",
			JSON.stringify([
				{ id: "legacy-id", name: "Producto legacy", salePrice: 1234, quantity: 2 },
			]),
		);
		const { result } = renderHook(() => useCart(), { wrapper });

		expect(result.current.itemCount).toBe(2);
		expect(result.current.total).toBe(2468);
	});

	it("recovers from malformed saved JSON", () => {
		localStorage.setItem("qBrandsCart", "{");
		const { result } = renderHook(() => useCart(), { wrapper });

		expect(result.current.items).toEqual([]);
	});

	it("keeps the in-memory cart usable when storage writes fail", () => {
		vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
			throw new Error("Storage unavailable");
		});
		const { result } = renderHook(() => useCart(), { wrapper });

		expect(() => {
			act(() => result.current.addProduct(demoCatalogFixtures[0]));
		}).not.toThrow();
		expect(result.current.itemCount).toBe(1);
	});
});