import { useRef, useState } from "react";
import { useCart } from "../hooks/useCart";
import { createDemoReceipt } from "../services/demoCheckout";
import { formatCLP } from "../utils/currency";

const OUTCOME_LABELS = {
	approved: "Aprobado (simulado)",
	rejected: "Rechazado (simulado)",
	cancelled: "Cancelado (simulado)",
	pending: "Pendiente (simulado)",
};

export function Checkout({ onBack }) {
	const { items, total, changeQuantity } = useCart();
	const [outcome, setOutcome] = useState("approved");
	const [receipt, setReceipt] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");
	const submittedRef = useRef(false);

	function handleSubmit(event) {
		event.preventDefault();
		if (submittedRef.current || receipt || items.length === 0) return;
		if (!event.currentTarget.reportValidity()) return;

		submittedRef.current = true;
		const submittedItems = items.map((item) => ({ ...item }));
		try {
			const nextReceipt = createDemoReceipt(submittedItems, outcome);
			if (nextReceipt.status === "approved") {
				for (const item of submittedItems) {
					changeQuantity(item.id, -item.quantity);
				}
			}
			setErrorMessage("");
			setReceipt(nextReceipt);
		} catch (error) {
			submittedRef.current = false;
			setErrorMessage(error.message);
		}
	}

	if (receipt) {
		return (
			<main className="confirmation container" aria-labelledby="checkout-result-title">
				<p className="demo-notice" role="note">
					Simulacion educativa: este resultado es ficticio.
				</p>
				<h1 id="checkout-result-title">{OUTCOME_LABELS[receipt.status]}</h1>
				<p>Comprobante ficticio: <strong>{receipt.id}</strong></p>
				<p>No se realizo ningun pago ni se creo una compra real.</p>
				<section className="order-summary" aria-labelledby="receipt-summary-title">
					<h2 id="receipt-summary-title">Resumen de demostracion</h2>
					{receipt.lines.map((line) => (
						<p key={line.id}>
							<span>{line.name} x{line.quantity}</span>
							<strong>{formatCLP(line.lineTotal)}</strong>
						</p>
					))}
					<p className="order-summary__total">
						<span>Total CLP</span>
						<strong>{formatCLP(receipt.total)}</strong>
					</p>
				</section>
				<button type="button" className="button button--primary btn" onClick={onBack}>
					Volver a la tienda
				</button>
			</main>
		);
	}

	if (items.length === 0) {
		return (
			<section className="confirmation container">
				<h1>Tu carrito esta vacio</h1>
				<p>Agrega videojuegos para continuar con la demostracion.</p>
				<button type="button" className="button button--primary btn" onClick={onBack}>
					Ver catalogo
				</button>
			</section>
		);
	}

	return (
		<main className="checkout container" aria-labelledby="checkout-title">
			<button type="button" className="text-button" onClick={onBack}>
				Volver a la tienda
			</button>
			<h1 id="checkout-title">Finalizar compra</h1>
			<p className="demo-notice" role="note">
				Simulacion educativa: no se solicitan datos personales ni de pago.
			</p>
			<div className="checkout__grid row g-4">
				<section className="order-summary col-12" aria-labelledby="summary-title">
					<h2 id="summary-title">Resumen de demostracion</h2>
					{items.map((item) => (
						<p key={item.id}>
							<span>{item.name} x{item.quantity}</span>
							<strong>{formatCLP(item.salePrice * item.quantity)}</strong>
						</p>
					))}
					<p className="order-summary__total">
						<span>Total CLP</span>
						<strong>{formatCLP(total)}</strong>
					</p>
				</section>
				<form className="checkout-form col-12" onSubmit={handleSubmit}>
					<label>
						Resultado simulado
						<select
							className="form-select"
							aria-label="Resultado simulado"
							value={outcome}
							onChange={(event) => setOutcome(event.target.value)}
							required>
							<option value="approved">Aprobado (simulado)</option>
							<option value="rejected">Rechazado (simulado)</option>
							<option value="cancelled">Cancelado (simulado)</option>
							<option value="pending">Pendiente (simulado)</option>
						</select>
					</label>
					{errorMessage && <p role="alert">{errorMessage}</p>}
					<button type="submit" className="button button--primary btn">
						Simular compra
					</button>
				</form>
			</div>
		</main>
	);
}
