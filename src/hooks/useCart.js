/** @format */

import { useContext } from "react";
import { CartContext } from "../context/cartStore";

export function useCart() {
	const context = useContext(CartContext);
	if (!context)
		throw new Error("useCart debe utilizarse dentro de CartProvider.");
	return context;
}
