/** @format */

import { useEffect, useState } from "react";
import { fetchCatalog } from "../services/catalogApi";

const initialState = {
	products: [],
	status: "loading",
	message: "Cargando catalogo de videojuegos...",
};

export function useCatalog() {
	const [catalog, setCatalog] = useState(initialState);
	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		const controller = new AbortController();

		async function loadCatalog() {
			setCatalog(initialState);
			try {
				const products = await fetchCatalog({
					signal: controller.signal,
					onRetry: (attempt) => {
						setCatalog((current) => ({
							...current,
							message: `Reintentando la carga del catalogo (${attempt + 1} de 3)...`,
						}));
					},
				});
				setCatalog({
					products,
					status: "success",
					message: `${products.length} videojuegos cargados correctamente.`,
				});
			} catch (error) {
				if (error.name !== "AbortError") {
					setCatalog({
						products: [],
						status: "error",
						message: "No fue posible cargar el catalogo. Intenta nuevamente.",
					});
				}
			}
		}

		loadCatalog();
		return () => controller.abort();
	}, [reloadKey]);

	return {
		...catalog,
		retry: () => setReloadKey((current) => current + 1),
	};
}
