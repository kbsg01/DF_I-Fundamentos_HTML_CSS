/** @format */

import { useEffect, useState } from "react";
import { CartContext } from "./cartStore";
import { canAddDemoOffer } from "../utils/demoProducts";

const CART_STORAGE_KEY = "qBrandsCart";

function readStoredCart() {
	try {
		const cart = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY));
		if (!Array.isArray(cart)) return [];
		return cart.filter(
			(item) =>
				item &&
				typeof item.id === "string" &&
				item.id.length > 0 &&
				typeof item.name === "string" &&
				Number.isSafeInteger(item.salePrice) &&
				item.salePrice >= 0 &&
				Number.isSafeInteger(item.quantity) &&
				item.quantity >= 1 &&
				item.quantity <= 99,
		);
	} catch {
		return [];
	}
}

function cartReducer(cart, action) {
	switch (action.type) {
		case "add": {
			if (!canAddDemoOffer(action.product)) return cart;
			const existingItem = cart.find((item) => item.id === action.product.id);
			if (existingItem) {
				const nextQuantity = existingItem.quantity + 1;
				if (!canAddDemoOffer(action.product, nextQuantity)) return cart;
				return cart.map((item) =>
					item.id === action.product.id ?
						{ ...item, ...action.product, quantity: nextQuantity }
					:	item,
				);
			}
			return [...cart, { ...action.product, quantity: 1 }];
		}
		case "changeQuantity": {
			if (!Number.isSafeInteger(action.delta) || action.delta === 0) return cart;
			const item = cart.find((line) => line.id === action.id);
			if (!item) return cart;
			const nextQuantity = item.quantity + action.delta;
			if (nextQuantity <= 0) return cart.filter((line) => line.id !== action.id);
			if (nextQuantity > 99) return cart;
			if (
				Number.isSafeInteger(item.availableUnits) &&
				nextQuantity > item.availableUnits
			) {
				return cart;
			}
			return cart.map((line) =>
				line.id === action.id ? { ...line, quantity: nextQuantity } : line,
			);
		}
		case "remove":
			return cart.filter((item) => item.id !== action.id);
		case "clear":
			return [];
		default:
			return cart;
	}
}

export function CartProvider({ children }) {
	const [items, setItems] = useState(readStoredCart);

	useEffect(() => {
		try {
			window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
		} catch {
			// The in-memory cart remains available when browser storage is blocked.
		}
	}, [items]);

	function dispatch(action) {
		setItems((currentItems) => cartReducer(currentItems, action));
	}

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
