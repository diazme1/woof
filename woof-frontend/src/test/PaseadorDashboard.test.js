import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import PaseadorDashboard from '../components/Dashboard/PaseadorDashboard';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PaseadorDashboard Component', () => {

    beforeEach(() => {
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Paseador', rol: 'ROLE_PASEADOR' }));

        // simulamos que axios.get devuelve una promesa resuelta
        axios.get.mockResolvedValue({
            data: { validado: 'NO_ENVIADO', alias: null }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

  test('renderiza el dashboard del paseador con mensaje inicial', async () => {
    renderWithRouter(<PaseadorDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Ahora podés aceptar solicitudes de paseo/i)).toBeInTheDocument();
      expect(screen.getByText(/Esperamos que repartas tu amor a todos los perritos de tus paseos/i)).toBeInTheDocument();
    });
  });

  test('muestra botón de validarse cuando el estado es NO_ENVIADO', async () => {
    renderWithRouter(<PaseadorDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Validarse')).toBeInTheDocument();
    });
  });

  test('muestra formulario de validación al hacer click en Validarse', async () => {
    renderWithRouter(<PaseadorDashboard />);

    await waitFor(() => {
      const botonValidarse = screen.getByText('Validarse');
      fireEvent.click(botonValidarse);
    });

    expect(screen.getByText('Alias (público):')).toBeInTheDocument();
    expect(screen.getByText('Foto DNI:')).toBeInTheDocument();
    expect(screen.getByText('CV (PDF):')).toBeInTheDocument();
    expect(screen.getByText('Guardar archivos')).toBeInTheDocument();
  });

  test('muestra mensaje de pendiente cuando el estado es PENDIENTE', async () => {
    axios.get.mockResolvedValue({
      data: { validado: 'PENDIENTE', alias: 'test_alias' }
    });

    renderWithRouter(<PaseadorDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Tu solicitud de validación está pendiente de revisión/i)).toBeInTheDocument();
      expect(screen.getByText(/test_alias/i)).toBeInTheDocument();
    });
  });

  test('muestra mensaje de aprobado cuando el estado es APROBADO', async () => {
    axios.get.mockResolvedValue({
      data: { validado: 'APROBADO', alias: 'paseador_pro' }
    });

    renderWithRouter(<PaseadorDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Tu validación fue aprobada/i)).toBeInTheDocument();
      expect(screen.getByText(/Ya podés pasear perritos/i)).toBeInTheDocument();
      expect(screen.getByText(/paseador_pro/i)).toBeInTheDocument();
    });
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<PaseadorDashboard />)).not.toThrow();
  });

  test('muestra error cuando el alias está vacío al enviar el formulario', async () => {
    renderWithRouter(<PaseadorDashboard />);

    await waitFor(() => {
      const botonValidarse = screen.getByText('Validarse');
      fireEvent.click(botonValidarse);
    });

    const aliasInput = screen.getByPlaceholderText(/p.ej. paseos_mati/i);
    fireEvent.change(aliasInput, { target: { value: '' } });

    const botonGuardar = screen.getByText('Guardar archivos');
    fireEvent.click(botonGuardar);

    await waitFor(() => {
      expect(screen.getByText(/El alias es obligatorio/i)).toBeInTheDocument();
    });
  });

  test('muestra error cuando el alias tiene menos de 3 caracteres', async () => {
    renderWithRouter(<PaseadorDashboard />);

    await waitFor(() => {
      const botonValidarse = screen.getByText('Validarse');
      fireEvent.click(botonValidarse);
    });

    const aliasInput = screen.getByPlaceholderText(/p.ej. paseos_mati/i);
    fireEvent.change(aliasInput, { target: { value: 'ab' } });

    const botonGuardar = screen.getByText('Guardar archivos');
    fireEvent.click(botonGuardar);

    await waitFor(() => {
      expect(screen.getByText(/Usá 3–20 caracteres/i)).toBeInTheDocument();
    });
  });

  test('muestra error cuando el alias tiene más de 20 caracteres', async () => {
    renderWithRouter(<PaseadorDashboard />);

    await waitFor(() => {
      const botonValidarse = screen.getByText('Validarse');
      fireEvent.click(botonValidarse);
    });

    const aliasInput = screen.getByPlaceholderText(/p.ej. paseos_mati/i);
    fireEvent.change(aliasInput, { target: { value: 'este_alias_es_demasiado_largo_para_ser_valido' } });

    const botonGuardar = screen.getByText('Guardar archivos');
    fireEvent.click(botonGuardar);

    await waitFor(() => {
      expect(screen.getByText(/Usá 3–20 caracteres/i)).toBeInTheDocument();
    });
  });

  test('muestra error cuando el alias contiene espacios', async () => {
    renderWithRouter(<PaseadorDashboard />);

    await waitFor(() => {
      const botonValidarse = screen.getByText('Validarse');
      fireEvent.click(botonValidarse);
    });

    const aliasInput = screen.getByPlaceholderText(/p.ej. paseos_mati/i);
    fireEvent.change(aliasInput, { target: { value: 'alias con espacios' } });

    const botonGuardar = screen.getByText('Guardar archivos');
    fireEvent.click(botonGuardar);

    await waitFor(() => {
      expect(screen.getByText(/Usá 3–20 caracteres.*Sin espacios/i)).toBeInTheDocument();
    });
  });

  test('muestra error cuando el alias contiene caracteres especiales inválidos', async () => {
    renderWithRouter(<PaseadorDashboard />);

    await waitFor(() => {
      const botonValidarse = screen.getByText('Validarse');
      fireEvent.click(botonValidarse);
    });

    const aliasInput = screen.getByPlaceholderText(/p.ej. paseos_mati/i);
    fireEvent.change(aliasInput, { target: { value: 'alias@invalido!' } });

    const botonGuardar = screen.getByText('Guardar archivos');
    fireEvent.click(botonGuardar);

    await waitFor(() => {
      expect(screen.getByText(/Usá 3–20 caracteres/i)).toBeInTheDocument();
    });
  });

  test('acepta alias válido con letras, números y guión bajo', async () => {
    axios.post.mockResolvedValue({
      data: 'Archivos enviados correctamente.'
    });

    renderWithRouter(<PaseadorDashboard />);

    await waitFor(() => {
      const botonValidarse = screen.getByText('Validarse');
      fireEvent.click(botonValidarse);
    });

    const aliasInput = screen.getByPlaceholderText(/p.ej. paseos_mati/i);
    fireEvent.change(aliasInput, { target: { value: 'paseos_mati123' } });

    // crear archivos mock
    const dniFile = new File(['dni'], 'dni.jpg', { type: 'image/jpeg' });
    const cvFile = new File(['cv'], 'cv.pdf', { type: 'application/pdf' });

    // obtener los inputs de archivo directamente
    const fileInputs = screen.getAllByLabelText(/Foto DNI:|CV \(PDF\):/i);
    const dniInput = fileInputs.find(input => input.accept === 'image/*');
    const cvInput = fileInputs.find(input => input.accept === 'application/pdf');

    fireEvent.change(dniInput, { target: { files: [dniFile] } });
    fireEvent.change(cvInput, { target: { files: [cvFile] } });

    const botonGuardar = screen.getByText('Guardar archivos');
    fireEvent.click(botonGuardar);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  test('muestra error cuando falta subir archivos', async () => {
    renderWithRouter(<PaseadorDashboard />);

    await waitFor(() => {
      const botonValidarse = screen.getByText('Validarse');
      fireEvent.click(botonValidarse);
    });

    const aliasInput = screen.getByPlaceholderText(/p.ej. paseos_mati/i);
    fireEvent.change(aliasInput, { target: { value: 'alias_valido' } });

    const botonGuardar = screen.getByText('Guardar archivos');
    fireEvent.click(botonGuardar);

    await waitFor(() => {
      expect(screen.getByText(/Por favor, subí ambos archivos/i)).toBeInTheDocument();
    });
  });
});
