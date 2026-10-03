import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.route("https://cdn.cloudflare.steamstatic.com/**", (route) =>
		route.abort(),
	);
});

test("searches, filters, sorts, and pages through the local catalog", async ({ page }) => {
	await page.goto("/");
	await expect(page.getByRole("heading", { name: "Videojuegos destacados" })).toBeVisible();
	await expect(page.getByText(/21 videojuegos cargados/i)).toBeVisible();

	await page.getByRole("combobox", { name: "Filtrar por genero" }).selectOption("Aventura");
	const cards = page.locator(".product-card");
	await expect(cards.first()).toBeVisible();
	await expect(cards).toHaveCount(7);
	await expect(cards.first().locator(".product-card__category")).toHaveText("Aventura");

	await page.getByRole("button", { name: "Limpiar filtros" }).click();
	await page.getByRole("combobox", { name: "Filtrar por plataforma" }).selectOption("PC");
	await expect(cards).toHaveCount(8);
	await page.getByRole("combobox", { name: "Ordenar por" }).selectOption("name-asc");
	const firstPageNames = await cards.locator("h3").allTextContents();
	await page.getByRole("button", { name: "Siguiente pagina" }).click();
	const nextPageNames = await cards.locator("h3").allTextContents();
	expect(nextPageNames).toHaveLength(8);
	expect(nextPageNames.some((name) => firstPageNames.includes(name))).toBe(false);

	await page.getByRole("button", { name: "Limpiar filtros" }).click();
	await expect(page.getByRole("combobox", { name: "Filtrar por genero" })).toHaveValue("");
});

test("completes ten local game discovery runs within the acceptance limit", async ({ page }) => {
	const titles = [
		"Counter-Strike 2",
		"DOOM Eternal",
		"Grand Theft Auto V",
		"Dota 2",
		"The Witcher 3: Wild Hunt",
		"Hollow Knight",
		"Cyberpunk 2077",
		"Stardew Valley",
		"Rocket League",
		"Forza Horizon 5",
	];
	await page.goto("/");
	await expect(page.getByText(/21 videojuegos cargados/i)).toBeVisible();

	let completedRuns = 0;
	for (const title of titles) {
		const startedAt = Date.now();
		await page.getByRole("searchbox", { name: "Buscar videojuego" }).fill(title);
		await expect(page.locator(".product-card h3").filter({ hasText: title }).first()).toBeVisible();
		await page.getByRole("button", { name: `Ver detalles de ${title}` }).click();
		await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
		expect(Date.now() - startedAt).toBeLessThan(60_000);
		completedRuns += 1;
		await page.getByRole("button", { name: "Volver al catalogo" }).click();
	}

	expect(completedRuns).toBeGreaterThanOrEqual(9);
});

test("opens local game details and blocks a missing offer", async ({ page }) => {
	await page.goto("/");
	const search = page.getByRole("searchbox", { name: "Buscar videojuego" });
	await search.fill("Hollow Knight");

	await page.getByRole("button", { name: "Ver detalles de Hollow Knight" }).click();
	await expect(page.getByRole("heading", { name: "Hollow Knight" })).toBeVisible();
	await expect(page.getByText(/simulacion educativa/i)).toBeVisible();
	await expect(page.getByRole("button", { name: "Agregar al carrito" })).toBeVisible();

	await page.getByRole("button", { name: "Volver al catalogo" }).click();
	await search.fill("Counter-Strike 2");
	await page.getByRole("button", { name: "Ver detalles de Counter-Strike 2" }).click();
	await expect(page.getByText(/no hay una oferta disponible/i)).toBeVisible();
	await expect(page.getByRole("button", { name: "Agregar al carrito" })).toHaveCount(0);
});

test("recovers from a local catalog load failure", async ({ page }) => {
	await page.addInitScript(() => {
		const originalFetch = window.fetch.bind(window);
		window.demoCatalogFailures = 0;
		window.fetch = async (input, init) => {
			const requestUrl = new URL(
				typeof input === "string" ? input : input.url,
				window.location.href,
			);
			if (
				requestUrl.pathname.endsWith("/data/products.json") &&
				window.demoCatalogFailures < 4
			) {
				window.demoCatalogFailures += 1;
				return new Response("Catalog unavailable", { status: 503 });
			}
			return originalFetch(input, init);
		};
	});

	await page.goto("/");
	await expect.poll(() => page.evaluate(() => window.demoCatalogFailures)).toBe(4);
	await expect(page.getByRole("alert")).toContainText(/no fue posible cargar el catalogo/i);
	await page.getByRole("button", { name: "Reintentar" }).click();
	await expect(page.getByText(/21 videojuegos cargados/i)).toBeVisible();
	await expect(page.getByRole("alert")).toHaveCount(0);
	expect(await page.evaluate(() => window.demoCatalogFailures)).toBe(4);
});