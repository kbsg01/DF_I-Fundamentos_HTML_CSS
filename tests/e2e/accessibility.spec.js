import { expect, test } from "@playwright/test";

test("keeps search keyboard-accessible without overflow or motion under reduced motion", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/");
	await expect(page.getByText(/21 videojuegos cargados/i)).toBeVisible();

	const layout = await page.evaluate(() => ({
		viewport: document.documentElement.clientWidth,
		content: document.documentElement.scrollWidth,
		overflow: [...document.querySelectorAll("body *")]
			.map((element) => ({
				tag: element.tagName,
				className: typeof element.className === "string" ? element.className : "",
				text: element.innerText?.slice(0, 60),
				right: element.getBoundingClientRect().right,
			}))
			.filter((element) => element.right > innerWidth + 0.5)
			.sort((a, b) => b.right - a.right)
			.slice(0, 20),
	}));
	expect(layout.content, JSON.stringify(layout.overflow)).toBeLessThanOrEqual(layout.viewport);

	const search = page.getByRole("searchbox", { name: "Buscar videojuego" });
	await expect(search).toBeVisible();
	let searchFocused = false;
	for (let tabCount = 0; tabCount < 16; tabCount += 1) {
		if (await search.evaluate((element) => element === document.activeElement)) {
			searchFocused = true;
			break;
		}
		await page.keyboard.press("Tab");
	}
	expect(searchFocused).toBe(true);
	await page.keyboard.type("Hades");
	await expect(page.locator(".product-card h3").filter({ hasText: "Hades" }).first()).toBeVisible();

	const transitionDuration = await page
		.locator("[data-animate]")
		.first()
		.evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration));
	expect(transitionDuration).toBeLessThanOrEqual(0.001);
});