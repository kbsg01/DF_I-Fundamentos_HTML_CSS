import { expect, test } from "@playwright/test";

async function addDoomEternal(page) {
	const card = page.locator(".product-card").filter({ hasText: "DOOM Eternal" });
	await card.getByRole("button", { name: "Agregar al carrito" }).click();
	await expect(card.getByRole("button", { name: "En el carrito" })).toHaveAttribute(
		"aria-pressed",
		"true",
	);
}

async function openCart(page, count) {
	await page.getByRole("button", { name: `Abrir carrito, ${count} productos` }).click();
	return page.getByRole("dialog", { name: "Carrito de compras" });
}

test("updates quantities, totals, and removes a local offer", async ({ page }) => {
	await page.goto("/");
	await addDoomEternal(page);

	const drawer = await openCart(page, 1);
	const line = drawer.locator(".cart-item").filter({ hasText: "DOOM Eternal" });
	await expect(line).toBeVisible();
	await line.getByRole("button", { name: "Sumar una unidad de DOOM Eternal" }).click();
	await expect(drawer.locator(".cart-drawer__footer")).toContainText("$59.980");
	await line.getByRole("button", { name: "Restar una unidad de DOOM Eternal" }).click();
	await expect(drawer.locator(".cart-drawer__footer")).toContainText("$29.990");
	await line.getByRole("button", { name: "Eliminar DOOM Eternal" }).click();
	await expect(drawer.getByText("Tu carrito esta vacio.")).toBeVisible();
	await expect(drawer.getByRole("button", { name: "Ir a pagar" })).toBeDisabled();
});

test("retains valid legacy qBrandsCart data after reload", async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem(
			"qBrandsCart",
			JSON.stringify([
				{
					id: "doom-eternal",
					name: "DOOM Eternal",
					cover: "/product-placeholder.svg",
					salePrice: 29990,
					quantity: 2,
				},
			]),
		);
	});
	await page.goto("/");
	await expect(page.getByRole("button", { name: "Abrir carrito, 2 productos" })).toBeVisible();

	const drawer = await openCart(page, 2);
	await expect(drawer.getByRole("heading", { name: "DOOM Eternal" })).toBeVisible();
	await expect(drawer.locator(".cart-drawer__footer")).toContainText("$59.980");
	await page.reload();
	await expect(page.getByRole("button", { name: "Abrir carrito, 2 productos" })).toBeVisible();
});

test("opens an empty cart when saved JSON is malformed", async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem("qBrandsCart", "{"));
	await page.goto("/");
	const drawer = await openCart(page, 0);
	await expect(drawer.getByText("Tu carrito esta vacio.")).toBeVisible();
	await expect(drawer.getByRole("button", { name: "Ir a pagar" })).toBeDisabled();
});

test("restores focus and closes the drawer with Escape", async ({ page }) => {
	await page.goto("/");
	const trigger = page.getByRole("button", { name: "Abrir carrito, 0 productos" });
	await trigger.click();

	const drawer = page.getByRole("dialog", { name: "Carrito de compras" });
	await expect(drawer).toBeVisible();
	await expect(drawer.getByRole("button", { name: "Cerrar carrito" })).toBeFocused();
	await page.keyboard.press("Escape");
	await expect(drawer).toBeHidden();
	await expect(trigger).toBeFocused();
});