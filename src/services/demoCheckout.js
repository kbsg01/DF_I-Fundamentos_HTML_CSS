import { canAddDemoOffer } from "../utils/demoProducts";

const VALID_OUTCOMES = new Set(["approved", "rejected", "cancelled", "pending"]);
let receiptSequence = 0;

export function createDemoReceipt(items, outcome) {
	if (!Array.isArray(items) || items.length === 0) {
		throw new TypeError("Agrega una oferta antes de simular una compra.");
	}
	if (!VALID_OUTCOMES.has(outcome)) {
		throw new TypeError("El resultado de demostracion no es valido.");
	}

	const lines = items.map((item) => {
		if (!canAddDemoOffer(item, item.quantity)) {
			throw new TypeError(`La oferta ${item.name ?? "seleccionada"} no esta disponible.`);
		}
		const lineTotal = item.salePrice * item.quantity;
		if (!Number.isSafeInteger(lineTotal)) {
			throw new TypeError("El subtotal de demostracion excede el limite permitido.");
		}
		return {
			id: item.id,
			name: item.name,
			cover: item.cover,
			quantity: item.quantity,
			unitPrice: item.salePrice,
			lineTotal,
		};
	});
	const total = lines.reduce((amount, line) => amount + line.lineTotal, 0);
	if (!Number.isSafeInteger(total)) {
		throw new TypeError("El total de demostracion excede el limite permitido.");
	}

	receiptSequence += 1;
	return {
		id: `DEMO-${Date.now().toString(36)}-${receiptSequence.toString(36)}`,
		status: outcome,
		currency: "CLP",
		lines,
		total,
	};
}