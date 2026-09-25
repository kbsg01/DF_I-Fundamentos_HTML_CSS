/** @format */

import { useEffect, useReducer } from "react";
import { CartContext } from "./cartStore";

const CART_STORAGE_KEY = "qBrandsCart";

function readStoredCart() {
	try {
		const cart = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY));
		return Array.isArray(cart) ? cart : [];
	} catch {
		return [];
	}
}

function cartReducer(cart, action) {
	switch (action.type) {
		case "add": {
			const existingItem = cart.find((item) => item.id === action.product.id);
			if (existingItem) {
				return cart.map((item) =>
					item.id === action.product.id ?
						{ ...item, quantity: item.quantity + 1 }
					:	item,
				);
			}
			return [...cart, { ...action.product, quantity: 1 }];
		}
		case "changeQuantity":
			return cart
				.map((item) =>
					item.id === action.id ?
						{ ...item, quantity: item.quantity + action.delta }
					:	item,
				)
				.filter((item) => item.quantity > 0);
		case "remove":
			return cart.filter((item) => item.id !== action.id);
		case "clear":
			return [];
		default:
			return cart;
	}
}

export function CartProvider({ children }) {
	const [items, dispatch] = useReducer(cartReducer, undefined, readStoredCart);

	useEffect(() => {
		window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
	}, [items]);

	const itemCount = items.reduce((total, item) => total + item.quantity, 0);
	const total = items.reduce(
		(amount, item) => amount + item.salePrice * item.quantity,
		0,
	);

	const value = {
		items,
		itemCount,
		total,
		addProduct: (product) => dispatch({ type: "add", product }),
		changeQuantity: (id, delta) =>
			dispatch({ type: "changeQuantity", id, delta }),
		removeProduct: (id) => dispatch({ type: "remove", id }),
		clearCart: () => dispatch({ type: "clear" }),
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
