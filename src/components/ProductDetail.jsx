import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { canAddDemoOffer } from "../utils/demoProducts";
import { formatCLP } from "../utils/currency";

export function ProductDetail({ product, onBack, onAdded }) {
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
		<main className="product-detail container" aria-labelledby="product-detail-title">
			<button type="button" className="text-button" onClick={onBack}>
				Volver al catalogo
			</button>
			<p className="demo-notice" role="note">
				Simulacion educativa: estos datos y ofertas son ficticios.
			</p>
			<div className="row g-4">
				<div className="col-12 col-lg-5">
					<img
						className="product-detail__image"
						src={imageSource}
						alt={`Portada de ${product.name}`}
						onError={() =>
							setImageSource(`${import.meta.env.BASE_URL}product-placeholder.svg`)
						}
					/>
				</div>
				<div className="col-12 col-lg-7">
					<p className="eyebrow">{product.category}</p>
					<h1 id="product-detail-title">{product.name}</h1>
					<p>{product.description}</p>
					<dl>
						<dt>Genero</dt>
						<dd>{product.genres.length ? product.genres.join(", ") : "No informado"}</dd>
						<dt>Plataformas</dt>
						<dd>{product.platforms.length ? product.platforms.join(", ") : "No informadas"}</dd>
						<dt>Lanzamiento</dt>
						<dd>{product.released ?? "No informado"}</dd>
						<dt>Valoracion</dt>
						<dd>{product.rating ?? "No informada"}</dd>
					</dl>
					{canAdd ?
						<>
							<p>Edicion ficticia: {product.edition}</p>
							<p>Activacion: {product.activationPlatform} ({product.activationRegion})</p>
							<p className="price">
								<strong>{formatCLP(product.salePrice)}</strong>
							</p>
							<button
								type="button"
								className="button button--primary btn"
								aria-pressed={isInCart}
								onClick={handleAdd}>
								{isInCart ? "En el carrito" : "Agregar al carrito"}
							</button>
						</>
					: <p className="empty-state" role="status">No hay una oferta disponible para este juego.</p>}
				</div>
			</div>
		</main>
	);
}