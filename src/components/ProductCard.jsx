/** @format */

import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { formatCLP } from "../utils/currency";

export function ProductCard({ product, onAdded, animationDelay = 0 }) {
	const { addProduct } = useCart();
	const [imageSource, setImageSource] = useState(product.cover);

	function handleAdd() {
		addProduct(product);
		onAdded(`${product.name} se agrego al carrito.`);
	}

	return (
		<article
			className="product-card card h-100"
			data-animate
			data-animation-classes="animate-rise"
			data-animation-delay={animationDelay}>
			<img
				src={imageSource}
				alt={`Portada de ${product.name}`}
				loading="lazy"
				onError={() =>
					setImageSource(`${import.meta.env.BASE_URL}product-placeholder.svg`)
				}
			/>
			<div className="product-card__body card-body">
				<p className="product-card__category">{product.category}</p>
				<h3>{product.name}</h3>
				<p className="product-card__description">{product.description}</p>
				<div
					className="price"
					aria-label={`Precio oferta ${formatCLP(product.salePrice)}`}>
					{product.regularPrice > product.salePrice && (
						<span className="price__regular">{formatCLP(product.regularPrice)}</span>
					)}
					<strong>{formatCLP(product.salePrice)}</strong>
				</div>
				<button type="button" className="button button--primary btn" onClick={handleAdd}>
					Agregar al carrito
				</button>
			</div>
		</article>
	);
}
