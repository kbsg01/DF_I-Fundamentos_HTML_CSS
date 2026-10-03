export function DemoAccess({ isActive, onActivate, onClose }) {
	if (!isActive) {
		return (
			<button
				type="button"
				className="button button--secondary btn"
				aria-pressed="false"
				onClick={onActivate}>
				Activar acceso de demostracion
			</button>
		);
	}

	return (
		<div className="demo-access">
			<p role="status">Perfil ficticio activo: Visitante de demostracion. No es una cuenta real.</p>
			<button
				type="button"
				className="button button--secondary btn"
				aria-pressed="true"
				onClick={onClose}>
				Cerrar acceso de demostracion
			</button>
		</div>
	);
}