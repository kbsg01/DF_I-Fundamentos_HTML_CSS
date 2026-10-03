/** @format */

import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { canAddDemoOffer } from "../utils/demoProducts";
import { formatCLP } from "../utils/currency";

export function ProductCard({ product, onAdded, onOpenProduct, animationDelay = 0 }) {
	const { items, addProduct } = useCart();
	const [imageSource, setImageSource] = useState(product.cover);
	const canAdd = canAddDemoOffer(product);
	const isInCart = items.some((item) => item.id === product.id);

	function handleAdd() {
		if (!canAdd) return;
		addProduct(product);
		onAdded?.(`${product.name} se agrego al carrito de demostracion.`);
	}

	return (
		<article
			className="product-card card h-100"
			data-product-id={product.id}
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
					aria-label={`Precio de demostracion ${formatCLP(product.salePrice)}`}>
					{product.regularPrice > product.salePrice && (
						<span className="price__regular">{formatCLP(product.regularPrice)}</span>
					)}
					<strong>{formatCLP(product.salePrice)}</strong>
				</div>
				<button
					type="button"
					className="button button--secondary btn"
					aria-label={`Ver detalles de ${product.name}`}
					onClick={() => onOpenProduct?.(product)}>
					Ver detalles
				</button>
				{canAdd ?
					<button
						type="button"
						className="button button--primary btn"
						aria-pressed={isInCart}
						onClick={handleAdd}>
						{isInCart ? "En el carrito" : "Agregar al carrito"}
					</button>
				: <p className="product-card__availability" role="status">Solo informacion; sin oferta disponible.</p>}
			</div>
		</article>
	);
}
