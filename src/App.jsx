/** @format */

import { useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { Checkout } from "./components/Checkout";
import { FeaturedCarousel } from "./components/FeaturedCarousel";
import { LoadingPage } from "./components/LoadingPage";
import { ProductCatalog } from "./components/ProductCatalog";
import { useCart } from "./hooks/useCart";
import { useCatalog } from "./hooks/useCatalog";
import { useViewportAnimations } from "./hooks/useViewportAnimations";
import "./App.css";

function CatalogContent({ status, message, products, query, retry, onAdded }) {
	if (status === "loading") {
		return (
			<div className="loading-state" role="status">
				<span className="spinner" aria-hidden="true" />
				{message}
			</div>
		);
	}
	if (status === "error") {
		return (
			<div className="error-state" role="alert">
				<p>{message}</p>
				<button type="button" className="button button--primary btn" onClick={retry}>
					Reintentar
				</button>
			</div>
		);
	}
	return <ProductCatalog products={products} query={query} onAdded={onAdded} />;
}

function Store() {
	const { itemCount } = useCart();
	const { products, status, message, retry } = useCatalog();
	const [query, setQuery] = useState("");
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isCheckout, setIsCheckout] = useState(false);
	const [announcement, setAnnouncement] = useState("");
	const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

	useViewportAnimations(status);

	function openCheckout() {
		setIsCartOpen(false);
		setIsCheckout(true);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	function returnToCatalog() {
		setIsCheckout(false);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	function handleCategoryClick() {
		setIsCategoriesOpen(false);
	}

	if (isCheckout) return <Checkout onBack={returnToCatalog} />;

	return (
		<>
			<header className="site-header navbar">
				<a className="brand" href="#top" aria-label="Q Brands, inicio">
					Q<span>BRANDS</span>
				</a>
				<nav className="main-navigation" aria-label="Navegacion principal">
					<div className="categories-menu">
						<button
							type="button"
							className="categories-trigger"
							aria-expanded={isCategoriesOpen}
							aria-controls="categories-list"
							onClick={() => setIsCategoriesOpen((current) => !current)}>
							Categorias <span aria-hidden="true">+</span>
						</button>
						{isCategoriesOpen && (
							<div id="categories-list" className="categories-list">
								<a href="#category-accion" onClick={handleCategoryClick}>
									Accion
								</a>
								<a href="#category-aventura" onClick={handleCategoryClick}>
									Aventura
								</a>
								<a href="#category-deportes" onClick={handleCategoryClick}>
									Deportes
								</a>
							</div>
						)}
					</div>
					<a href="#contact">Contacto</a>
				</nav>
				<form
					className="header-search"
					role="search"
					onSubmit={(event) => event.preventDefault()}>
					<label>
						<span className="visually-hidden">Buscar videojuego</span>
						<input
							className="form-control"
							type="search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Buscar juego"
						/>
					</label>
				</form>
				<button
					type="button"
					className="cart-button btn"
					onClick={() => setIsCartOpen(true)}
					aria-label={`Abrir carrito, ${itemCount} productos`}>
					Carrito <span>{itemCount}</span>
				</button>
			</header>
			{status === "loading" ? <LoadingPage /> : <main id="top">
				<section
					className="masthead"
					aria-labelledby="page-title"
					data-animate
					data-animation-classes="animate-fade">
					<p className="eyebrow">Juega a tu manera</p>
					<h1 id="page-title">Tu proxima aventura empieza aqui.</h1>
					<p>
						Descubre grandes videojuegos, ofertas reales y un carrito que guarda tu
						seleccion.
					</p>
				</section>
				{status === "success" && (
					<FeaturedCarousel products={products} onAdded={setAnnouncement} />
				)}
				<section
					className="catalog container-fluid"
					aria-labelledby="catalog-title"
					data-animate
					data-animation-classes="animate-rise">
					<div className="catalog__header">
						<div>
							<p className="eyebrow">Catalogo</p>
							<h2 id="catalog-title">Videojuegos destacados</h2>
						</div>
					</div>
					<p className="catalog-status" aria-live="polite">
						{status === "success" ? message : ""}
					</p>
					<CatalogContent
						status={status}
						message={message}
						products={products}
						query={query}
						retry={retry}
						onAdded={setAnnouncement}
					/>
				</section>
				<section
					id="contact"
					className="contact-section"
					aria-labelledby="contact-title"
					data-animate
					data-animation-classes="animate-rise">
					<div>
						<p className="eyebrow">Contacto</p>
						<h2 id="contact-title">Necesitas una recomendacion?</h2>
						<p>Escribenos y te ayudamos a encontrar tu proximo juego.</p>
					</div>
					<div className="contact-links">
						<a href="mailto:hola@qbrands.cl">hola@qbrands.cl</a>
						<a href="tel:+56221234567">+56 2 2123 4567</a>
						<span>Santiago, Chile</span>
					</div>
				</section>
			</main>}
			{status !== "loading" && <footer
				className="site-footer"
				data-animate
				data-animation-classes="animate-fade">
				<a className="brand" href="#top">
					Q<span>BRANDS</span>
				</a>
				<p>Videojuegos seleccionados para tu proxima partida.</p>
				<div>
					<a href="#top">Tienda</a>
					<a href="#contact">Contacto</a>
					<a href="mailto:hola@qbrands.cl">Soporte</a>
				</div>
				<small>2026 Q Brands. Todos los derechos reservados.</small>
			</footer>}
			<p className="visually-hidden" aria-live="polite">
				{announcement}
			</p>
			<CartDrawer
				isOpen={isCartOpen}
				onClose={() => setIsCartOpen(false)}
				onCheckout={openCheckout}
			/>
		</>
	);
}

export default Store;
