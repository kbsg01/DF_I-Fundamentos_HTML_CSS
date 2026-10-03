import { expect, test } from "@playwright/test";

test("activates a fictional profile without credentials and resets on reload", async ({ page }) => {
	await page.goto("/");
	await page.getByRole("button", { name: "Activar acceso de demostracion" }).click();
	await expect(page.locator(".demo-access [role=status]")).toContainText(
		/perfil ficticio activo/i,
	);
	await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);

	const doomCard = page.locator(".product-card").filter({ hasText: "DOOM Eternal" });
	await doomCard.getByRole("button", { name: "Agregar al carrito" }).click();
	await page.getByRole("button", { name: "Cerrar acceso de demostracion" }).click();
	await expect(page.getByRole("button", { name: "Activar acceso de demostracion" })).toBeVisible();

	await page.reload();
	await expect(page.getByRole("button", { name: "Activar acceso de demostracion" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Abrir carrito, 1 productos" })).toBeVisible();
});