import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

const CATALOG = [
  { id: 1, name: 'Cumbres de Éter', category: 'Aventura', price: 29990, description: 'Aventura de mundo abierto.', image: 'img/a.svg' },
  { id: 2, name: 'Neón Racing', category: 'Carreras', price: 24990, description: 'Carreras arcade veloces.', image: 'img/b.svg' },
  { id: 3, name: 'Selva Perdida', category: 'Aventura', price: 19990, description: 'Explora una selva misteriosa.', image: 'img/c.svg' },
];

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(CATALOG) })));
});
afterEach(() => vi.unstubAllGlobals());

const cards = () => screen.getAllByRole('article');

describe('<App />', () => {
  it('carga y muestra el catálogo desde el JSON', async () => {
    render(<App />);
    expect(screen.getByText(/cargando catálogo/i)).toBeInTheDocument();
    expect(await screen.findAllByRole('article')).toHaveLength(3);
    expect(screen.getByText('3 videojuegos encontrados')).toBeInTheDocument();
  });

  it('muestra un error si la carga falla', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent(/no fue posible cargar/i);
  });

  it('filtra por categoría y actualiza el contador', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByRole('article');

    await user.click(screen.getByRole('button', { name: 'Carreras' }));
    expect(cards()).toHaveLength(1);
    expect(screen.getByText('1 videojuego encontrado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Carreras' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Todas' }));
    expect(cards()).toHaveLength(3);
  });

  it('elimina un videojuego del estado', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByRole('article');

    await user.click(screen.getByRole('button', { name: /eliminar selva perdida/i }));
    expect(cards()).toHaveLength(2);
    expect(screen.queryByText('Selva Perdida')).not.toBeInTheDocument();
  });

  it('vuelve a "Todas" si se elimina la última tarjeta de la categoría activa', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByRole('article');

    await user.click(screen.getByRole('button', { name: 'Carreras' }));
    await user.click(screen.getByRole('button', { name: /eliminar neón racing/i }));
    expect(cards()).toHaveLength(2);
    expect(screen.queryByRole('button', { name: 'Carreras' })).not.toBeInTheDocument();
  });

  it('agrega un videojuego válido y lo muestra primero', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByRole('article');

    await user.type(screen.getByLabelText('Nombre del juego'), 'Juego Nuevo');
    await user.selectOptions(screen.getByLabelText('Categoría'), 'Carreras');
    await user.type(screen.getByLabelText('Precio (CLP)'), '15990');
    await user.type(screen.getByLabelText('Descripción'), 'Descripción de prueba válida.');
    await user.click(screen.getByRole('button', { name: /agregar videojuego/i }));

    expect(cards()).toHaveLength(4);
    expect(within(cards()[0]).getByRole('heading', { name: 'Juego Nuevo' })).toBeInTheDocument();
  });

  it('no agrega un videojuego inválido y muestra errores', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByRole('article');

    await user.click(screen.getByRole('button', { name: /agregar videojuego/i }));
    expect(cards()).toHaveLength(3);
    expect(screen.getByText('El nombre del juego es obligatorio.')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre del juego')).toHaveAttribute('aria-invalid', 'true');
  });

  it('el formulario de contacto muestra errores y luego confirma el envío', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByRole('article');

    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('El correo electrónico es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('El mensaje es obligatorio.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Nombre'), 'Karla Pérez');
    await user.type(screen.getByLabelText('Correo electrónico'), 'karla@correo.cl');
    await user.type(screen.getByLabelText('Mensaje'), 'Hola, necesito ayuda con mi pedido.');
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

    expect(screen.getByText(/mensaje fue validado correctamente/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toHaveValue('');
  });

  it('el menú móvil se abre y cierra con el botón de la barra', async () => {
    const user = userEvent.setup();
    render(<App />);
    const toggler = screen.getByRole('button', { name: /mostrar u ocultar el menú/i });
    expect(toggler).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggler);
    expect(toggler).toHaveAttribute('aria-expanded', 'true');
  });
});
