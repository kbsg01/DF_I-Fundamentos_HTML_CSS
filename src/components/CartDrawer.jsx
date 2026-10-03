/** @format */

import { useEffect, useRef, useState } from "react";
import { useCart } from "../hooks/useCart";
import { formatCLP } from "../utils/currency";

export function CartDrawer({ isOpen, onClose, onCheckout }) {
	const { items, total, changeQuantity, removeProduct, clearCart } = useCart();
	const [isRendered, setIsRendered] = useState(isOpen);
	const [isVisible, setIsVisible] = useState(false);
	const drawerRef = useRef(null);
	const closeButtonRef = useRef(null);
	const previouslyFocusedRef = useRef(null);
	const wasOpenRef = useRef(false);

	useEffect(() => {
		let timeoutId;
		const presenceFrameId = requestAnimationFrame(() => {
			if (isOpen) {
				if (!wasOpenRef.current) {
					previouslyFocusedRef.current = document.activeElement;
				}
				wasOpenRef.current = true;
				setIsRendered(true);
				return;
			}

			wasOpenRef.current = false;
			setIsVisible(false);
			timeoutId = window.setTimeout(() => {
				setIsRendered(false);
				if (previouslyFocusedRef.current?.isConnected) {
					previouslyFocusedRef.current.focus();
				}
			}, 300);
		});

		return () => {
			cancelAnimationFrame(presenceFrameId);
			if (timeoutId) window.clearTimeout(timeoutId);
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen || !isRendered) return undefined;

		const visibleFrameId = requestAnimationFrame(() => {
			setIsVisible(true);
			closeButtonRef.current?.focus();
		});
		return () => cancelAnimationFrame(visibleFrameId);
	}, [isOpen, isRendered]);

	useEffect(() => {
		if (!isOpen) return undefined;

		function handleKeyDown(event) {
			if (event.key === "Escape") {
				event.preventDefault();
				onClose();
				return;
			}
			if (event.key !== "Tab") return;

			const focusableElements = drawerRef.current?.querySelectorAll(
				'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
			);
			if (!focusableElements?.length) return;

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];
			if (event.shiftKey && document.activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
			} else if (!event.shiftKey && document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isRendered) return null;

	return (
		<div
			className={`drawer-layer${isVisible ? " is-open" : ""}`}
			role="presentation"
			onMouseDown={onClose}>
			<aside
				ref={drawerRef}
				className={`cart-drawer offcanvas offcanvas-end${isVisible ? " show" : ""}`}
				role="dialog"
				aria-modal="true"
				aria-label="Carrito de compras"
				onMouseDown={(event) => event.stopPropagation()}>
				<header className="cart-drawer__header">
					<h2>Tu carrito</h2>
					<button
						type="button"
						className="icon-button"
						ref={closeButtonRef}
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
