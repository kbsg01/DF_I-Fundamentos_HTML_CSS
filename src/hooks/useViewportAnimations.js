/** @format */

import { useEffect } from "react";
import Animate from "animate.js";

export function useViewportAnimations(dependency) {
	useEffect(() => {
		const animator = new Animate({
			target: "[data-animate]",
			animatedClass: "js-animated",
			offset: 0.15,
			remove: false,
			onLoad: true,
			onScroll: true,
		});

		animator.init();
		animator.render();

		return () => animator.kill();
	}, [dependency]);
}
