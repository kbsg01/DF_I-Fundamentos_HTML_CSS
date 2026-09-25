function PlaceholderLine({ width = '100%' }) {
  return <span className="placeholder col-12" style={{ width }} aria-hidden="true" />
}

function ProductPlaceholder() {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <article className="product-card card h-100 placeholder-glow" aria-label="Cargando producto">
        <div className="placeholder product-placeholder__image" />
        <div className="product-card__body card-body">
          <PlaceholderLine width="35%" />
          <PlaceholderLine width="75%" />
          <PlaceholderLine width="100%" />
          <PlaceholderLine width="60%" />
          <span className="placeholder button-placeholder" />
        </div>
      </article>
    </div>
  )
}

export function LoadingPage() {
  return (
    <main className="loading-page" aria-busy="true" aria-label="Cargando tienda">
      <section className="masthead masthead--skeleton placeholder-glow">
        <PlaceholderLine width="18%" />
        <PlaceholderLine width="60%" />
        <PlaceholderLine width="42%" />
      </section>
      <section className="carousel-skeleton placeholder-glow" aria-label="Cargando ofertas">
        <PlaceholderLine width="18%" />
        <PlaceholderLine width="52%" />
        <PlaceholderLine width="38%" />
        <span className="placeholder button-placeholder" />
      </section>
      <section className="catalog container-fluid" aria-label="Cargando catalogo">
        <div className="placeholder-glow catalog-skeleton__heading"><PlaceholderLine width="20%" /><PlaceholderLine width="45%" /></div>
        <div className="row g-3">{Array.from({ length: 8 }, (_, index) => <ProductPlaceholder key={index} />)}</div>
      </section>
      <section className="contact-section contact-section--skeleton placeholder-glow" aria-label="Cargando contacto">
        <div><PlaceholderLine width="22%" /><PlaceholderLine width="65%" /><PlaceholderLine width="52%" /></div>
        <div><PlaceholderLine width="75%" /><PlaceholderLine width="55%" /></div>
      </section>
      <footer className="site-footer site-footer--skeleton placeholder-glow" aria-label="Cargando pie de pagina"><PlaceholderLine width="45%" /><PlaceholderLine width="70%" /><PlaceholderLine width="58%" /></footer>
    </main>
  )
}