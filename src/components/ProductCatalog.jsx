/** @format */

import { useState } from "react";
import { ProductCard } from "./ProductCard";

const PAGE_SIZE = 8;

export function ProductCatalog({ products, query, onAdded, onOpenProduct }) {
	const [genre, setGenre] = useState("");
	const [platform, setPlatform] = useState("");
	const [sortOrder, setSortOrder] = useState("");
	const [pageState, setPageState] = useState({ criteria: "", page: 1 });
	const pageCriteria = `${query}\u0000${genre}\u0000${platform}\u0000${sortOrder}`;
	const page = pageState.criteria === pageCriteria ? pageState.page : 1;
	const setPage = (value) => {
		setPageState({
			criteria: pageCriteria,
			page: typeof value === "function" ? value(page) : value,
		});
	};

	const normalizedQuery = query.trim().toLocaleLowerCase("es");
	const genres = [...new Set(products.flatMap((product) => product.genres))].sort((a, b) =>
		a.localeCompare(b, "es"),
	);
	const platforms = [...new Set(products.flatMap((product) => product.platforms))].sort((a, b) =>
		a.localeCompare(b, "es"),
	);
	const filteredProducts = products
		.filter((product) =>
			!normalizedQuery || product.name.toLocaleLowerCase("es").includes(normalizedQuery),
		)
		.filter((product) => !genre || product.genres.includes(genre))
		.filter((product) => !platform || product.platforms.includes(platform));
	const sortedProducts = [...filteredProducts];
	if (sortOrder === "name-asc") sortedProducts.sort((a, b) => a.name.localeCompare(b.name, "es"));
	if (sortOrder === "name-desc") sortedProducts.sort((a, b) => b.name.localeCompare(a.name, "es"));
	if (sortOrder === "released-asc") {
		sortedProducts.sort((a, b) => (a.released ?? "9999").localeCompare(b.released ?? "9999"));
	}
	if (sortOrder === "released-desc") {
		sortedProducts.sort((a, b) => (b.released ?? "").localeCompare(a.released ?? ""));
	}
	const pageCount = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const pageProducts = sortedProducts.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);
	const hasFilters = Boolean(normalizedQuery || genre || platform || sortOrder);

	function renderProducts(items) {
		return (
			<div className="product-grid row g-3">
				{items.map((product, index) => (
					<div className="col-12 col-sm-6 col-lg-3" key={product.id}>
						<ProductCard
							product={product}
							onAdded={onAdded}
							onOpenProduct={onOpenProduct}
							animationDelay={index * 60}
						/>
					</div>
				))}
			</div>
		);
	}

	if (sortedProducts.length === 0) {
		return (
			<>
				<FilterControls
					genres={genres}
					platforms={platforms}
					genre={genre}
					platform={platform}
					sortOrder={sortOrder}
					setGenre={setGenre}
					setPlatform={setPlatform}
					setSortOrder={setSortOrder}
					setPage={setPage}
				/>
				<p className="empty-state" role="status">
					No encontramos videojuegos para tu busqueda.
				</p>
			</>
		);
	}

	return (
		<>
			<FilterControls
				genres={genres}
				platforms={platforms}
				genre={genre}
				platform={platform}
				sortOrder={sortOrder}
				setGenre={setGenre}
				setPlatform={setPlatform}
				setSortOrder={setSortOrder}
				setPage={setPage}
			/>
			<section aria-labelledby="search-results-title">
				<h2 id="search-results-title">
					{normalizedQuery ? `Resultados para "${query.trim()}"` : "Catalogo de juegos"}
				</h2>
				{!hasFilters && !normalizedQuery ?
					[...new Set(pageProducts.map((product) => product.category))].map((category) => (
						<section
							key={category}
							className="catalog-section"
							id={`category-${category.toLocaleLowerCase("es")}`}
							aria-labelledby={`title-${category}`}>
							<h3 id={`title-${category}`}>{category}</h3>
							{renderProducts(pageProducts.filter((product) => product.category === category))}
						</section>
					))
				: renderProducts(pageProducts)}
			</section>
			<nav className="catalog-pagination" aria-label="Paginacion del catalogo">
				<button
					type="button"
					className="button button--secondary btn"
					disabled={currentPage === 1}
					onClick={() => setPage((value) => Math.max(1, value - 1))}>
					Anterior pagina
				</button>
				<span aria-live="polite">Pagina {currentPage} de {pageCount}</span>
				<button
					type="button"
					className="button button--secondary btn"
					disabled={currentPage === pageCount}
					onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>
					Siguiente pagina
				</button>
			</nav>
		</>
	);
}

function FilterControls({
	genres,
	platforms,
	genre,
	platform,
	sortOrder,
	setGenre,
	setPlatform,
	setSortOrder,
	setPage,
}) {
	function clearFilters() {
		setGenre("");
		setPlatform("");
		setSortOrder("");
		setPage(1);
	}

	return (
		<div className="catalog-filters row g-3" aria-label="Filtros del catalogo">
			<label className="col-12 col-sm-6 col-lg-3">
				Genero
				<select
					className="form-select"
					aria-label="Filtrar por genero"
					value={genre}
					onChange={(event) => {
						setGenre(event.target.value);
						setPage(1);
					}}>
					<option value="">Todos</option>
					{genres.map((value) => <option key={value} value={value}>{value}</option>)}
				</select>
			</label>
			<label className="col-12 col-sm-6 col-lg-3">
				Plataforma
				<select
					className="form-select"
					aria-label="Filtrar por plataforma"
					value={platform}
					onChange={(event) => {
						setPlatform(event.target.value);
						setPage(1);
					}}>
					<option value="">Todas</option>
					{platforms.map((value) => <option key={value} value={value}>{value}</option>)}
				</select>
			</label>
			<label className="col-12 col-sm-6 col-lg-3">
				Ordenar por
				<select
					className="form-select"
					aria-label="Ordenar por"
					value={sortOrder}
					onChange={(event) => {
						setSortOrder(event.target.value);
						setPage(1);
					}}>
					<option value="">Predeterminado</option>
					<option value="name-asc">Nombre ascendente</option>
					<option value="name-desc">Nombre descendente</option>
					<option value="released-asc">Lanzamiento ascendente</option>
					<option value="released-desc">Lanzamiento descendente</option>
				</select>
			</label>
			<div className="col-12 col-sm-6 col-lg-3 d-flex align-items-end">
				<button type="button" className="button button--secondary btn" onClick={clearFilters}>
					Limpiar filtros
				</button>
			</div>
		</div>
	);
}
