const MAX_CART_QUANTITY = 99;
const FALLBACK_COVER = "/product-placeholder.svg";

function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}

function normalizeStringList(value) {
	if (!Array.isArray(value)) return [];
	return value.filter(isNonEmptyString).map((item) => item.trim());
}

function normalizeReleased(value) {
	if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return null;
	}
	return value;
}

function normalizeRating(value) {
	return Number.isFinite(value) && value >= 0 && value <= 5 ? value : null;
}

function normalizeDemoProduct(product, index) {
	if (!product || typeof product !== "object" || Array.isArray(product)) {
		throw new TypeError(`El producto ${index + 1} no es un objeto valido.`);
	}
	if (!isNonEmptyString(product.id) || !isNonEmptyString(product.name)) {
		throw new TypeError(`El producto ${index + 1} requiere un id y nombre estables.`);
	}
	if (!isNonEmptyString(product.category)) {
		throw new TypeError(`El producto ${product.id} requiere una categoria.`);
	}
	if (
		!Number.isSafeInteger(product.regularPrice) ||
		!Number.isSafeInteger(product.salePrice) ||
		product.regularPrice < 0 ||
		product.salePrice < 0 ||
		product.salePrice > product.regularPrice
	) {
		throw new TypeError(`El producto ${product.id} tiene precios CLP invalidos.`);
	}

	return {
		...product,
		id: product.id.trim(),
		name: product.name.trim(),
		category: product.category.trim(),
		description: typeof product.description === "string" ? product.description : "",
		cover: isNonEmptyString(product.cover) ? product.cover : FALLBACK_COVER,
		genres: normalizeStringList(product.genres),
		platforms: normalizeStringList(product.platforms),
		released: normalizeReleased(product.released),
		rating: normalizeRating(product.rating),
	};
}

export function normalizeDemoCatalog(catalog) {
	if (!Array.isArray(catalog)) {
		throw new TypeError("El catalogo de demostracion debe ser una lista.");
	}
	return catalog.map(normalizeDemoProduct);
}

export function canAddDemoOffer(product, quantity = 1) {
	if (
		!product ||
		!Number.isSafeInteger(quantity) ||
		quantity < 1 ||
		quantity > MAX_CART_QUANTITY ||
		product.status !== "active" ||
		product.currency !== "CLP" ||
		!isNonEmptyString(product.edition) ||
		!isNonEmptyString(product.activationPlatform) ||
		!isNonEmptyString(product.activationRegion) ||
		!Number.isSafeInteger(product.regularPrice) ||
		!Number.isSafeInteger(product.salePrice) ||
		product.regularPrice <= 0 ||
		product.salePrice <= 0 ||
		product.salePrice > product.regularPrice ||
		!Number.isSafeInteger(product.availableUnits) ||
		product.availableUnits < quantity
	) {
		return false;
	}
	return true;
}