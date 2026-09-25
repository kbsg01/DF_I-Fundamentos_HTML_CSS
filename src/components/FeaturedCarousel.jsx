/** @format */

import { useEffect, useRef, useState } from "react";
import Carousel from "bootstrap/js/dist/carousel";
import { useCart } from "../hooks/useCart";
import { formatCLP } from "../utils/currency";

export function FeaturedCarousel({ products, onAdded }) {
	const featuredProducts = products
		.filter((product) => product.salePrice > 0)
		.slice(0, 5);
	const { addProduct } = useCart();
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const carouselElementRef = useRef(null);
	const carouselInstanceRef = useRef(null);

	useEffect(() => {
		const carouselElement = carouselElementRef.current;
		if (featuredProducts.length < 2 || !carouselElement) return undefined;

		const carousel = new Carousel(carouselElement, {
			interval: 5000,
			pause: "hover",
			ride: "carousel",
			wrap: true,
		});
		carouselInstanceRef.current = carousel;
		const handleSlide = (event) => setActiveIndex(event.to);
		carouselElement.addEventListener("slid.bs.carousel", handleSlide);

		return () => {
			carouselElement.removeEventListener("slid.bs.carousel", handleSlide);
			carousel.dispose();
			carouselInstanceRef.current = null;
		};
	}, [featuredProducts.length]);

	useEffect(() => {
		if (!carouselInstanceRef.current) return;
		if (isPaused) carouselInstanceRef.current.pause();
		else carouselInstanceRef.current.cycle();
	}, [isPaused]);

	if (featuredProducts.length === 0) return null;

	const product = featuredProducts[activeIndex % featuredProducts.length];

	function selectSlide(index) {
		setIsPaused(true);
		carouselInstanceRef.current?.to(index);
	}

	function addFeaturedProduct() {
		addProduct(product);
		onAdded(`${product.name} se agrego al carrito.`);
	}

	return (
		<section
			ref={carouselElementRef}
			className="featured-carousel carousel slide"
			aria-label="Ofertas destacadas"
			data-animate
			data-animation-classes="animate-fade">
			<div className="carousel-indicators">
				{featuredProducts.map((featuredProduct, index) => (
					<button
						key={featuredProduct.id}
						type="button"
						className={index === activeIndex ? "active" : undefined}
						onClick={() => selectSlide(index)}
						aria-label={`Mostrar ${featuredProduct.name}`}
						aria-current={index === activeIndex ? "true" : undefined}
					/>
				))}
			</div>
			<div className="carousel-inner">
				{featuredProducts.map((featuredProduct, index) => (
					<div
						className={`carousel-item${index === 0 ? " active" : ""}`}
						key={featuredProduct.id}>
						<div className="featured-carousel__slide">
							<img
								className="featured-carousel__image"
								src={featuredProduct.cover}
								alt={`Portada de ${featuredProduct.name}`}
							/>
							<div className="featured-carousel__overlay">
								<p className="eyebrow">Oferta destacada</p>
								<h2>{featuredProduct.name}</h2>
								<p>{featuredProduct.description}</p>
								<p className="featured-carousel__price">
									<span>{formatCLP(featuredProduct.regularPrice)}</span>{" "}
									{formatCLP(featuredProduct.salePrice)}
								</p>
								<button
									type="button"
									className="button button--accent btn"
									onClick={addFeaturedProduct}>
									Agregar al carrito
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
			{featuredProducts.length > 1 && (
				<>
					<button
						className="carousel-control-prev"
						type="button"
						onClick={() => carouselInstanceRef.current?.prev()}>
						<span className="carousel-control-prev-icon" aria-hidden="true" />
						<span className="visually-hidden">Anterior</span>
					</button>
					<button
						className="carousel-control-next"
						type="button"
						onClick={() => carouselInstanceRef.current?.next()}>
						<span className="carousel-control-next-icon" aria-hidden="true" />
						<span className="visually-hidden">Siguiente</span>
					</button>
				</>
			)}
			<div className="featured-carousel__controls">
				<button
					type="button"
					className="carousel-pause btn"
					onClick={() => setIsPaused((current) => !current)}
					aria-pressed={isPaused}>
					{isPaused ? "Reanudar carrusel" : "Pausar carrusel"}
				</button>
			</div>
		</section>
	);
}
