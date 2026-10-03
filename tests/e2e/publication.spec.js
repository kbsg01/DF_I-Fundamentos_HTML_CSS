import { expect, test } from "@playwright/test";

test("loads the local catalog and exposes the repository link without business APIs", async ({ page }) => {
	const requests = [];
	const catalogResponses = [];
	const repositoryOrigin = "https://github.com";
	page.on("request", (request) => requests.push(request.url()));
	page.on("response", (response) => {
		if (new URL(response.url()).pathname.endsWith("/data/products.json")) {
			catalogResponses.push(response);
		}
	});
	await page.route("https://cdn.cloudflare.steamstatic.com/**", (route) => route.abort());

	await page.goto("/");
	await expect(page.getByText(/21 videojuegos cargados/i)).toBeVisible();
	await expect.poll(() => catalogResponses.length).toBeGreaterThan(0);
	for (const response of catalogResponses) expect(response.status()).toBe(200);

	const repositoryLink = page.getByRole("link", { name: "Repositorio de GitHub" });
	await expect(repositoryLink).toHaveAttribute(
		"href",
		"https://github.com/kbsg01/DF_I-Fundamentos_HTML_CSS",
	);

	const businessRequests = requests.filter((requestUrl) => {
		const url = new URL(requestUrl);
		return (
			url.origin !== new URL(page.url()).origin &&
			url.origin !== repositoryOrigin &&
			url.hostname !== "cdn.cloudflare.steamstatic.com"
		);
	});
	expect(businessRequests).toEqual([]);
});