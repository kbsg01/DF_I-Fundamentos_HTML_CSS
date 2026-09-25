/** @format */

import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { formatCLP } from "../utils/currency";

const initialForm = { name: "", email: "", address: "", paymentMethod: "" };

export function Checkout({ onBack }) {
	const { items, total, clearCart } = useCart();
	const [form, setForm] = useState(initialForm);
	const [submitted, setSubmitted] = useState(false);

	function handleSubmit(event) {
		event.preventDefault();
		if (items.length === 0) return;
		setSubmitted(true);
		clearCart();
	}

	if (submitted) {
		return (
			<section className="confirmation container" role="status">
				<h1>Pedido confirmado</h1>
				<p>Gracias por tu compra. Recibiras la confirmacion por correo.</p>
				<button type="button" className="button button--primary btn" onClick={onBack}>
					Volver a la tienda
				</button>
			</section>
		);
	}

	if (items.length === 0) {
		return (
			<section className="confirmation container">
				<h1>Tu carrito esta vacio</h1>
				<p>Agrega videojuegos para continuar con tu compra.</p>
				<button type="button" className="button button--primary btn" onClick={onBack}>
					Ver catalogo
				</button>
			</section>
		);
	}

	return (
		<section className="checkout container" aria-labelledby="checkout-title">
			<button type="button" className="text-button" onClick={onBack}>
				Volver a la tienda
			</button>
			<h1 id="checkout-title">Finalizar compra</h1>
			<div className="checkout__grid row g-4">
				<section className="order-summary col-12" aria-labelledby="summary-title">
					<h2 id="summary-title">Resumen del pedido</h2>
					{items.map((item) => (
						<p key={item.id}>
							<span>
								{item.name} x{item.quantity}
							</span>
							<strong>{formatCLP(item.salePrice * item.quantity)}</strong>
						</p>
					))}
					<p className="order-summary__total">
						<span>Total</span>
						<strong>{formatCLP(total)}</strong>
					</p>
				</section>
				<form className="checkout-form col-12" onSubmit={handleSubmit}>
					<label>
						Nombre completo
						<input
							className="form-control"
							value={form.name}
							onChange={(event) => setForm({ ...form, name: event.target.value })}
							required
						/>
					</label>
					<label>
						Correo electronico
						<input
							className="form-control"
							type="email"
							value={form.email}
							onChange={(event) => setForm({ ...form, email: event.target.value })}
							required
						/>
					</label>
					<label>
						Direccion de entrega
						<input
							className="form-control"
							value={form.address}
							onChange={(event) => setForm({ ...form, address: event.target.value })}
							required
						/>
					</label>
					<label>
						Metodo de pago
						<select
							className="form-select"
							value={form.paymentMethod}
							onChange={(event) =>
								setForm({ ...form, paymentMethod: event.target.value })
							}
							required>
							<option value="">Selecciona una opcion</option>
							<option value="credit">Tarjeta de credito</option>
							<option value="debit">Tarjeta de debito</option>
						</select>
					</label>
					<button type="submit" className="button button--primary btn">
						Confirmar pedido
					</button>
				</form>
			</div>
		</section>
	);
}
