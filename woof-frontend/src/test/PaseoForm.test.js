import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import PaseoForm from '../components/PaseoForm/PaseoForm';

jest.mock('axios');
jest.mock("react-router-dom", () => ({
    ...jest.requireActual('react-router-dom'),
    BrowserRouter: ({ children }) => <div>{children}</div>,
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PaseoForm Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test User' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renderiza el formulario de paseo', () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);
    expect(screen.getByText(/formulario de solicitud de paseo/i)).toBeInTheDocument();
    expect(screen.getByText(/guardar/i)).toBeInTheDocument();
  });

  test('muestra campos del formulario', () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);
    expect(screen.getByLabelText(/zona/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de tu perro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tamaño de tu perro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/horario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/raza de tu perro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/detalles/i)).toBeInTheDocument();
  });

  test('muestra el botón de solicitar', () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<PaseoForm onClose={mockOnClose} />)).not.toThrow();
  });

  test('muestra error cuando el nombre del perro está vacío', async () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const nombreInput = screen.getByLabelText(/nombre de tu perro/i);
    fireEvent.blur(nombreInput);

    await waitFor(() => {
      expect(screen.getByText(/Ingresá el nombre de tu perro/i)).toBeInTheDocument();
    });
  });

  test('muestra error cuando la raza está vacía', async () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const razaInput = screen.getByLabelText(/raza de tu perro/i);
    fireEvent.blur(razaInput);

    await waitFor(() => {
      expect(screen.getByText(/Ingresá la raza de tu perro/i)).toBeInTheDocument();
    });
  });

  test('muestra error cuando la zona no está seleccionada', async () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const zonaSelect = screen.getByLabelText(/zona de paseo/i);
    fireEvent.blur(zonaSelect);

    await waitFor(() => {
      expect(screen.getByText(/Seleccioná una zona/i)).toBeInTheDocument();
    });
  });

  test('acepta zonas válidas (QUILMES, BERNAL, DON_BOSCO, etc.)', async () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const zonaSelect = screen.getByLabelText(/zona de paseo/i);

    // Probar con QUILMES
    fireEvent.change(zonaSelect, { target: { value: 'QUILMES' } });
    fireEvent.blur(zonaSelect);

    await waitFor(() => {
      expect(screen.queryByText(/Zona inválido/i)).not.toBeInTheDocument();
    });
  });

  test('permite ingresar nombre del perro válido', async () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const nombreInput = screen.getByLabelText(/nombre de tu perro/i);
    fireEvent.change(nombreInput, { target: { value: 'Firulais' } });
    fireEvent.blur(nombreInput);

    await waitFor(() => {
      expect(screen.queryByText(/Ingresá el nombre de tu perro/i)).not.toBeInTheDocument();
    });
  });

  test('permite ingresar raza válida', async () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const razaInput = screen.getByLabelText(/raza de tu perro/i);
    fireEvent.change(razaInput, { target: { value: 'Labrador' } });
    fireEvent.blur(razaInput);

    await waitFor(() => {
      expect(screen.queryByText(/Ingresá la raza de tu perro/i)).not.toBeInTheDocument();
    });
  });

  test('muestra error al hacer trim en nombre del perro con solo espacios', async () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const nombreInput = screen.getByLabelText(/nombre de tu perro/i);
    fireEvent.change(nombreInput, { target: { value: '   ' } });
    fireEvent.blur(nombreInput);

    await waitFor(() => {
      expect(screen.getByText(/Ingresá el nombre de tu perro/i)).toBeInTheDocument();
    });
  });

  test('muestra error al hacer trim en raza con solo espacios', async () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const razaInput = screen.getByLabelText(/raza de tu perro/i);
    fireEvent.change(razaInput, { target: { value: '   ' } });
    fireEvent.blur(razaInput);

    await waitFor(() => {
      expect(screen.getByText(/Ingresá la raza de tu perro/i)).toBeInTheDocument();
    });
  });

  test('permite seleccionar tamaño del perro', async () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const tamanoSelect = screen.getByLabelText(/tamaño de tu perro/i);
    fireEvent.change(tamanoSelect, { target: { value: 'MEDIANO' } });

    expect(tamanoSelect.value).toBe('MEDIANO');
  });

  test('permite ingresar detalles opcionales', async () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const detallesTextarea = screen.getByLabelText(/detalles/i);
    fireEvent.change(detallesTextarea, { target: { value: 'Mi perro es muy juguetón' } });

    expect(detallesTextarea.value).toBe('Mi perro es muy juguetón');
  });

  test('muestra contador de caracteres en detalles', () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const detallesTextarea = screen.getByLabelText(/detalles/i);
    fireEvent.change(detallesTextarea, { target: { value: 'Hola' } });

    expect(screen.getByText(/4\/500/i)).toBeInTheDocument();
  });

  test('limita detalles a 500 caracteres', () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const detallesTextarea = screen.getByLabelText(/detalles/i);

    expect(detallesTextarea).toHaveAttribute('maxLength', '500');
  });

  test('permite ingresar horario de paseo', async () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const horarioInput = screen.getByLabelText(/horario de paseo/i);
    fireEvent.change(horarioInput, { target: { value: '14:30' } });

    expect(horarioInput.value).toBe('14:30');
  });

  test('envía formulario con datos válidos', async () => {
    axios.post.mockResolvedValue({ data: { id: 1, mensaje: 'Paseo creado' } });

    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    // Llenar todos los campos requeridos
    fireEvent.change(screen.getByLabelText(/zona de paseo/i), { target: { value: 'QUILMES' } });
    fireEvent.change(screen.getByLabelText(/horario de paseo/i), { target: { value: '14:30' } });
    fireEvent.change(screen.getByLabelText(/nombre de tu perro/i), { target: { value: 'Firulais' } });
    fireEvent.change(screen.getByLabelText(/tamaño de tu perro/i), { target: { value: 'MEDIANO' } });
    fireEvent.change(screen.getByLabelText(/raza de tu perro/i), { target: { value: 'Labrador' } });
    fireEvent.change(screen.getByLabelText(/detalles/i), { target: { value: 'Es muy activo' } });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8080/paseo',
        expect.objectContaining({
          zona: 'QUILMES',
          nombrePerro: 'Firulais',
          tamanoPerro: 'MEDIANO',
          raza: 'Labrador',
          detalles: 'Es muy activo',
          idCliente: 1
        })
      );
    });
  });

  test('no envía formulario si hay errores de validación', async () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
      expect(screen.getByText(/Seleccioná una zona/i)).toBeInTheDocument();
      expect(screen.getByText(/Ingresá el nombre de tu perro/i)).toBeInTheDocument();
      expect(screen.getByText(/Ingresá la raza de tu perro/i)).toBeInTheDocument();
    });
  });

  test('limpia el formulario después de un envío exitoso', async () => {
    axios.post.mockResolvedValue({ data: { id: 1, mensaje: 'Paseo creado' } });

    renderWithRouter(<PaseoForm onClose={mockOnClose} />);

    // Llenar campos
    const zonaSelect = screen.getByLabelText(/zona de paseo/i);
    const nombreInput = screen.getByLabelText(/nombre de tu perro/i);
    const razaInput = screen.getByLabelText(/raza de tu perro/i);

    fireEvent.change(zonaSelect, { target: { value: 'QUILMES' } });
    fireEvent.change(screen.getByLabelText(/horario de paseo/i), { target: { value: '14:30' } });
    fireEvent.change(nombreInput, { target: { value: 'Firulais' } });
    fireEvent.change(screen.getByLabelText(/tamaño de tu perro/i), { target: { value: 'MEDIANO' } });
    fireEvent.change(razaInput, { target: { value: 'Labrador' } });

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(nombreInput.value).toBe('');
      expect(razaInput.value).toBe('');
      expect(zonaSelect.value).toBe('');
    });
  });
});
