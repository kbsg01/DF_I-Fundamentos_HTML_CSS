import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DemoAccess } from "../../src/components/DemoAccess";

describe("DemoAccess", () => {
	it("activates and closes a clearly fictional profile without personal fields", () => {
		const onActivate = vi.fn();
		const onClose = vi.fn();
		const { rerender } = render(
			<DemoAccess isActive={false} onActivate={onActivate} onClose={onClose} />,
		);

		fireEvent.click(screen.getByRole("button", { name: "Activar acceso de demostracion" }));
		expect(onActivate).toHaveBeenCalledOnce();
		expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
		expect(screen.queryByLabelText(/correo|contrasena|password/i)).not.toBeInTheDocument();

		rerender(<DemoAccess isActive onActivate={onActivate} onClose={onClose} />);
		expect(screen.getByRole("status")).toHaveTextContent(/perfil ficticio activo/i);
		fireEvent.click(screen.getByRole("button", { name: "Cerrar acceso de demostracion" }));
		expect(onClose).toHaveBeenCalledOnce();
	});
});