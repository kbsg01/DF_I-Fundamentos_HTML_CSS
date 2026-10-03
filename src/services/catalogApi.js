/** @format */

import { normalizeDemoCatalog } from "../utils/demoProducts";

const CATALOG_URL = `${import.meta.env.BASE_URL}data/products.json`;
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

function wait(milliseconds, signal) {
	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(new DOMException("La solicitud fue cancelada.", "AbortError"));
			return;
		}

		const onAbort = () => {
			window.clearTimeout(timeoutId);
			reject(new DOMException("La solicitud fue cancelada.", "AbortError"));
		};
		const timeoutId = window.setTimeout(() => {
			signal?.removeEventListener("abort", onAbort);
			resolve();
		}, milliseconds);
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}

export async function fetchCatalog({ signal, onRetry, maxAttempts = 3 } = {}) {
	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		try {
			const response = await fetch(CATALOG_URL, { signal });

			if (!response.ok) {
				const error = new Error(
					`No se pudo cargar el catalogo (HTTP ${response.status}).`,
				);
				error.retryable = RETRYABLE_STATUS_CODES.has(response.status);
				throw error;
			}

			let products;
			try {
				products = await response.json();
				return normalizeDemoCatalog(products);
			} catch (error) {
				error.retryable = false;
				throw error;
			}
		} catch (error) {
			if (error.name === "AbortError") throw error;

			const retryable = error.retryable ?? true;
			const canRetry = retryable && attempt < maxAttempts;
			if (!canRetry) throw error;

			const delay = 300 * 2 ** (attempt - 1);
			onRetry?.(attempt, delay);
			await wait(delay, signal);
		}
	}

	throw new Error("No fue posible cargar el catalogo.");
}
