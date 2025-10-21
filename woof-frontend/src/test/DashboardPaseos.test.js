import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPaseos from '../components/Paseos/DashboardPaseos';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DashboardPaseos Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Paseador' }));
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    localStorage.clear();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renderiza el dashboard de paseos', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(screen.getByText(/solicitudes de paseos disponibles/i)).toBeInTheDocument();
    });
  });

  test('muestra estado de carga inicialmente', () => {
    axios.get.mockImplementation(() => new Promise(() => {}));

    renderWithRouter(<DashboardPaseos />);

    expect(screen.getByText(/cargando solicitudes/i)).toBeInTheDocument();
  });

  test('muestra mensaje cuando no hay solicitudes disponibles', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(screen.getByText(/no hay solicitudes disponibles en este momento/i)).toBeInTheDocument();
    });
  });

  test('muestra error cuando falla la carga de solicitudes', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(screen.getByText(/error al cargar las solicitudes/i)).toBeInTheDocument();
    });
  });

  test('muestra lista de solicitudes correctamente', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: 'Perro muy activo'
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(screen.getByText(/quilmes/i)).toBeInTheDocument();
      expect(screen.getByText(/firulais/i)).toBeInTheDocument();
      expect(screen.getByText(/labrador/i)).toBeInTheDocument();
      expect(screen.getByText(/grande/i)).toBeInTheDocument();
    });
  });

  test('muestra información completa de la solicitud', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'BERNAL',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Max',
        raza: 'Golden Retriever',
        tamanoPerro: 'MEDIANO',
        detalles: 'Es muy juguetón'
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(screen.getByText(/zona:/i)).toBeInTheDocument();
      expect(screen.getByText(/bernal/i)).toBeInTheDocument();
      expect(screen.getByText(/horario:/i)).toBeInTheDocument();
      expect(screen.getByText(/perro:/i)).toBeInTheDocument();
      expect(screen.getByText(/max/i)).toBeInTheDocument();
      expect(screen.getByText(/tamaño:/i)).toBeInTheDocument();
      expect(screen.getByText(/mediano/i)).toBeInTheDocument();
    });
  });

  test('aplica mapeo correcto de zonas', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'FLORENCIO_VARELA',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Luna',
        raza: 'Beagle',
        tamanoPerro: 'PEQUENO',
        detalles: null
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(screen.getByText(/florencio varela/i)).toBeInTheDocument();
      expect(screen.getByText(/pequeño/i)).toBeInTheDocument();
    });
  });

  test('muestra botón aceptar para cada solicitud', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: null
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(screen.getByText(/aceptar/i)).toBeInTheDocument();
    });
  });

  test('muestra botón más info cuando hay detalles', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: 'Perro muy activo, le gusta correr'
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(screen.getByText(/más info\./i)).toBeInTheDocument();
    });
  });

  test('no muestra botón más info cuando no hay detalles', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: null
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(screen.queryByText(/más info\./i)).not.toBeInTheDocument();
    });
  });

  test('no muestra botón más info cuando detalles está vacío', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: '   '
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(screen.queryByText(/más info\./i)).not.toBeInTheDocument();
    });
  });

  test('abre modal de detalles al hacer click en más info', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: 'Perro muy activo, le gusta correr en espacios abiertos'
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      const masInfoButton = screen.getByText(/más info\./i);
      fireEvent.click(masInfoButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/detalles del paseo/i)).toBeInTheDocument();
      expect(screen.getByText(/perro muy activo, le gusta correr en espacios abiertos/i)).toBeInTheDocument();
    });
  });

  test('cierra modal de detalles al hacer click en cerrar', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: 'Perro muy activo'
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      const masInfoButton = screen.getByText(/más info\./i);
      fireEvent.click(masInfoButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/detalles del paseo/i)).toBeInTheDocument();
    });

    const cerrarButtons = screen.getAllByText(/cerrar/i);
    const cerrarModalDetalles = cerrarButtons.find(btn =>
      btn.closest('[role="dialog"]')?.textContent.includes('Detalles del paseo')
    );
    fireEvent.click(cerrarModalDetalles);

    await waitFor(() => {
      expect(screen.queryByText(/detalles del paseo/i)).not.toBeInTheDocument();
    });
  });

  test('cierra modal de detalles al hacer click en overlay', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: 'Perro muy activo'
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      const masInfoButton = screen.getByText(/más info\./i);
      fireEvent.click(masInfoButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/detalles del paseo/i)).toBeInTheDocument();
    });

    const overlays = screen.getAllByRole('presentation');
    const detallesOverlay = overlays.find(overlay =>
      overlay.querySelector('[role="dialog"]')?.textContent.includes('Detalles del paseo')
    );
    fireEvent.click(detallesOverlay);

    await waitFor(() => {
      expect(screen.queryByText(/detalles del paseo/i)).not.toBeInTheDocument();
    });
  });

  test('cierra modal de detalles con tecla Escape', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: 'Perro muy activo'
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      const masInfoButton = screen.getByText(/más info\./i);
      fireEvent.click(masInfoButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/detalles del paseo/i)).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByText(/detalles del paseo/i)).not.toBeInTheDocument();
    });
  });

  test('acepta solicitud correctamente', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: null
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });
    axios.put.mockResolvedValue({ data: { message: 'Solicitud aceptada' } });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(screen.getByText(/firulais/i)).toBeInTheDocument();
    });

    const aceptarButton = screen.getByText(/aceptar/i);
    fireEvent.click(aceptarButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('http://localhost:8080/paseo/1/paseador/1');
    });
  });

  test('muestra modal de éxito después de aceptar solicitud', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: null
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });
    axios.put.mockResolvedValue({ data: {} });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      const aceptarButton = screen.getByText(/aceptar/i);
      fireEvent.click(aceptarButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/solicitud aceptada con éxito/i)).toBeInTheDocument();
    });
  });

  test('elimina solicitud de la lista después de aceptar', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: null
      },
      {
        id: 2,
        zona: 'BERNAL',
        horario: '2025-12-20T15:00:00',
        nombrePerro: 'Max',
        raza: 'Beagle',
        tamanoPerro: 'PEQUENO',
        detalles: null
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });
    axios.put.mockResolvedValue({ data: {} });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(screen.getByText(/firulais/i)).toBeInTheDocument();
      expect(screen.getByText(/max/i)).toBeInTheDocument();
    });

    const aceptarButtons = screen.getAllByText(/aceptar/i);
    fireEvent.click(aceptarButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText(/firulais/i)).not.toBeInTheDocument();
      expect(screen.getByText(/max/i)).toBeInTheDocument();
    });
  });

  test('navega a solicitudes al cerrar modal de éxito', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: null
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });
    axios.put.mockResolvedValue({ data: {} });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      const aceptarButton = screen.getByText(/aceptar/i);
      fireEvent.click(aceptarButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/solicitud aceptada con éxito/i)).toBeInTheDocument();
    });

    const cerrarButtons = screen.getAllByText(/cerrar/i);
    fireEvent.click(cerrarButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/solicitudes');
  });

  test('maneja error al aceptar solicitud', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: null
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });
    axios.put.mockRejectedValue(new Error('Network Error'));

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      const aceptarButton = screen.getByText(/aceptar/i);
      fireEvent.click(aceptarButton);
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Hubo un error al aceptar la solicitud.');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('hace polling cada 10 segundos', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    // Avanzar 10 segundos
    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  test('limpia el intervalo al desmontar el componente', async () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    axios.get.mockResolvedValue({ data: [] });

    const { unmount } = renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      expect(screen.getByText(/solicitudes de paseos disponibles/i)).toBeInTheDocument();
    });

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });

  test('formatea fecha correctamente', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        detalles: null
      }
    ];

    axios.get.mockResolvedValue({ data: mockSolicitudes });

    renderWithRouter(<DashboardPaseos />);

    await waitFor(() => {
      // Verifica que se muestre algún formato de fecha/hora
      expect(screen.getByText(/horario:/i)).toBeInTheDocument();
      const horarioElement = screen.getByText(/horario:/i).parentElement;
      expect(horarioElement.textContent).toMatch(/\d{2}\/\d{2}\/\d{4}/); // Formato DD/MM/YYYY
    });
  });

  test('renderiza sin errores', () => {
    axios.get.mockResolvedValue({ data: [] });
    expect(() => renderWithRouter(<DashboardPaseos />)).not.toThrow();
  });
});
