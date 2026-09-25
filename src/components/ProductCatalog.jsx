/** @format */

import { ProductCard } from "./ProductCard";

export function ProductCatalog({ products, query, onAdded }) {
	const normalizedQuery = query.trim().toLocaleLowerCase("es");
	const visibleProducts =
		normalizedQuery ?
			products.filter((product) =>
				product.name.toLocaleLowerCase("es").includes(normalizedQuery),
			)
		:	products;

	if (visibleProducts.length === 0) {
		return (
			<p className="empty-state">No encontramos videojuegos para tu busqueda.</p>
		);
	}

	if (normalizedQuery) {
		return (
			<section aria-labelledby="search-results-title">
				<h2 id="search-results-title">
					Resultados para &quot;{query.trim()}&quot;
				</h2>
				<div className="product-grid row g-3">
					{visibleProducts.map((product, index) => (
						<div className="col-12 col-sm-6 col-lg-3" key={product.id}>
							<ProductCard product={product} onAdded={onAdded} animationDelay={index * 60} />
						</div>
					))}
				</div>
			</section>
		);
	}

	const categories = [...new Set(products.map((product) => product.category))];
	return categories.map((category) => (
		<section
			key={category}
			className="catalog-section"
			id={`category-${category.toLowerCase()}`}
			aria-labelledby={`title-${category}`}>
			<h2 id={`title-${category}`}>{category}</h2>
			<div className="product-grid row g-3">
				{products
					.filter((product) => product.category === category)
					.map((product, index) => (
						<div className="col-12 col-sm-6 col-lg-3" key={product.id}>
							<ProductCard product={product} onAdded={onAdded} animationDelay={index * 60} />
						</div>
					))}
			</div>
		</section>
	));
}
