/** @format */

import { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import { formatCLP } from "../utils/currency";

export function CartDrawer({ isOpen, onClose, onCheckout }) {
	const { items, total, changeQuantity, removeProduct, clearCart } = useCart();
	const [isRendered, setIsRendered] = useState(isOpen);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		let visibleFrameId;
		let timeoutId;
		const presenceFrameId = requestAnimationFrame(() => {
		if (isOpen) {
				setIsRendered(true);
				visibleFrameId = requestAnimationFrame(() => setIsVisible(true));
				return;
		}

			setIsVisible(false);
			timeoutId = window.setTimeout(() => setIsRendered(false), 300);
		});

		return () => {
			cancelAnimationFrame(presenceFrameId);
			if (visibleFrameId) cancelAnimationFrame(visibleFrameId);
			if (timeoutId) window.clearTimeout(timeoutId);
		};
	}, [isOpen]);

	if (!isRendered) return null;

	return (
		<div
			className={`drawer-layer${isVisible ? " is-open" : ""}`}
			role="presentation"
			onMouseDown={onClose}>
			<aside
				className={`cart-drawer offcanvas offcanvas-end${isVisible ? " show" : ""}`}
				aria-label="Carrito de compras"
				onMouseDown={(event) => event.stopPropagation()}>
				<header className="cart-drawer__header">
					<h2>Tu carrito</h2>
					<button
						type="button"
						className="icon-button"
						onClick={onClose}
						aria-label="Cerrar carrito">
						x
					</button>
				</header>
				<div className="cart-drawer__items">
					{items.length === 0 ?
						<p className="empty-state">Tu carrito esta vacio.</p>
					:	items.map((item) => (
							<article className="cart-item cart-item-enter" key={item.id}>
								<img src={item.cover} alt="" />
								<div>
									<h3>{item.name}</h3>
									<p>{formatCLP(item.salePrice * item.quantity)}</p>
									<div
										className="quantity-controls"
										aria-label={`Cantidad de ${item.name}`}>
										<button
											type="button"
											onClick={() => changeQuantity(item.id, -1)}
											aria-label={`Restar una unidad de ${item.name}`}>
											-
										</button>
										<span>{item.quantity}</span>
										<button
											type="button"
											onClick={() => changeQuantity(item.id, 1)}
											aria-label={`Sumar una unidad de ${item.name}`}>
											+
										</button>
									</div>
								</div>
								<button
									type="button"
									className="text-button"
									onClick={() => removeProduct(item.id)}
									aria-label={`Eliminar ${item.name}`}>
									Eliminar
								</button>
							</article>
						))
					}
				</div>
				<footer className="cart-drawer__footer">
					<p>
						Total <strong>{formatCLP(total)}</strong>
					</p>
					<button
						type="button"
						className="button button--primary btn"
						disabled={items.length === 0}
						onClick={onCheckout}>
						Ir a pagar
					</button>
					<button
						type="button"
						className="button button--secondary btn"
						disabled={items.length === 0}
						onClick={clearCart}>
						Vaciar carrito
					</button>
				</footer>
			</aside>
		</div>
	);
}
