/** @format */

const carrusel = document.getElementById("carruselDestacados");
const botonPausa = document.getElementById("btnPausarCarrusel");
const instanciaCarrusel = bootstrap.Carousel.getOrCreateInstance(carrusel);
let pausado = false;
botonPausa.addEventListener("click", () => {
	pausado = !pausado;
	botonPausa.setAttribute("aria-pressed", String(pausado));
	botonPausa.innerHTML =
		pausado ?
			'<i class="bi bi-play-fill" aria-hidden="true"></i><span class="visually-hidden">Reanudar carrusel</span>'
		:	'<i class="bi bi-pause-fill" aria-hidden="true"></i><span class="visually-hidden">Pausar carrusel</span>';
	pausado ? instanciaCarrusel.pause() : instanciaCarrusel.cycle();
});
