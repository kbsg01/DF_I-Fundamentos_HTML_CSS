import { expect, test } from "@playwright/test";

async function startCheckout(page) {
	await page.goto("/");
	const doomCard = page.locator(".product-card").filter({ hasText: "DOOM Eternal" });
	await doomCard.getByRole("button", { name: "Agregar al carrito" }).click();
	await page.getByRole("button", { name: "Abrir carrito, 1 productos" }).click();
	await page
		.getByRole("dialog", { name: "Carrito de compras" })
		.getByRole("button", { name: "Ir a pagar" })
		.click();
}

test("shows an approved fictional receipt and clears only the submitted cart", async ({ page }) => {
	await startCheckout(page);
	await expect(page.getByRole("heading", { name: "Finalizar compra" })).toBeVisible();
	await expect(page.getByText(/simulacion educativa/i)).toBeVisible();
	await expect(page.locator('input:not([type="search"]), textarea')).toHaveCount(0);
	await expect(page.getByRole("combobox")).toHaveCount(1);
	await expect(page.getByText("Total").last()).toBeVisible();

	await page.getByRole("combobox", { name: "Resultado simulado" }).selectOption("approved");
	await page.getByRole("button", { name: "Simular compra" }).click();
	await expect(page.getByRole("heading", { name: "Aprobado (simulado)" })).toBeVisible();
	await expect(page.getByText(/no se realizo ningun pago ni se creo una compra real/i)).toBeVisible();
	await expect(page.getByText(/^Comprobante ficticio: DEMO-/)).toBeVisible();
	await expect(page.getByRole("button", { name: "Simular compra" })).toHaveCount(0);

	await page.getByRole("button", { name: "Volver a la tienda" }).click();
	await expect(page.getByRole("button", { name: "Abrir carrito, 0 productos" })).toBeVisible();
});

test("retains the cart for rejected, cancelled, and pending fictional outcomes", async ({ page }) => {
	for (const [outcome, label] of [
		["rejected", "Rechazado (simulado)"],
		["cancelled", "Cancelado (simulado)"],
		["pending", "Pendiente (simulado)"],
	]) {
		await page.goto("/");
		await page.evaluate(() => localStorage.clear());
		await page.reload();
		await startCheckout(page);
		await page.getByRole("combobox", { name: "Resultado simulado" }).selectOption(outcome);
		await page.getByRole("button", { name: "Simular compra" }).click();
		await expect(page.getByRole("heading", { name: label })).toBeVisible();
		await page.getByRole("button", { name: "Volver a la tienda" }).click();
		await expect(page.getByRole("button", { name: "Abrir carrito, 1 productos" })).toBeVisible();
	}
});