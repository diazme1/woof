import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardSolicitudes from '../components/Solicitudes/DashboardSolicitudes';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DashboardSolicitudes Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    localStorage.clear();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renderiza el dashboard de solicitudes', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText(/mis solicitudes de paseo/i)).toBeInTheDocument();
    });
  });

  test('muestra estado de carga inicialmente', () => {
    axios.get.mockImplementation(() => new Promise(() => {}));

    renderWithRouter(<DashboardSolicitudes />);

    expect(screen.getByText(/cargando solicitudes/i)).toBeInTheDocument();
  });

  test('muestra mensaje cuando no hay solicitudes', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText(/no tienes solicitudes activas en este momento/i)).toBeInTheDocument();
    });
  });

  test('muestra error cuando falla la carga de solicitudes', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText(/error al cargar las solicitudes/i)).toBeInTheDocument();
    });
  });

  test('muestra lista de solicitudes correctamente', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'PENDIENTE',
        estadoPago: 'PENDIENTE_DE_PAGO',
        idCliente: 1,
        idPaseador: null
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText(/quilmes/i)).toBeInTheDocument();
      expect(screen.getByText(/firulais/i)).toBeInTheDocument();
      expect(screen.getByText(/labrador/i)).toBeInTheDocument();
      expect(screen.getByText(/grande/i)).toBeInTheDocument();
      // Verificar que existe al menos un "Pendiente" en lugar de buscar uno específico
      expect(screen.getAllByText(/pendiente/i).length).toBeGreaterThan(0);
    });
  });

  test('muestra información completa de la solicitud', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'BERNAL',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Max',
        raza: 'Golden Retriever',
        tamanoPerro: 'MEDIANO',
        estado: 'ACEPTADA',
        estadoPago: 'PENDIENTE_DE_PAGO',
        idCliente: 1,
        idPaseador: 2
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/user/2')) {
        return Promise.resolve({ data: { id: 2, nombre: 'Juan Paseador', alias: 'juan_pasea' } });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText(/zona:/i)).toBeInTheDocument();
      expect(screen.getByText(/bernal/i)).toBeInTheDocument();
      expect(screen.getByText(/horario:/i)).toBeInTheDocument();
      expect(screen.getByText(/perro:/i)).toBeInTheDocument();
      expect(screen.getByText(/max/i)).toBeInTheDocument();
      expect(screen.getByText(/tamaño:/i)).toBeInTheDocument();
      expect(screen.getByText(/mediano/i)).toBeInTheDocument();
      expect(screen.getByText(/estado de solicitud:/i)).toBeInTheDocument();
    });
  });

  test('muestra nombre del paseador cuando está asignado', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'ACEPTADA',
        estadoPago: 'PAGO',
        idCliente: 1,
        idPaseador: 2
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/user/2')) {
        return Promise.resolve({ data: { id: 2, nombre: 'Juan Paseador', alias: 'juan_pasea' } });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText(/paseador:/i)).toBeInTheDocument();
      expect(screen.getByText(/juan paseador/i)).toBeInTheDocument();
    });
  });

  test('muestra link al perfil del paseador', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'ACEPTADA',
        estadoPago: 'PAGO',
        idCliente: 1,
        idPaseador: 2
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/user/2')) {
        return Promise.resolve({ data: { id: 2, nombre: 'Juan Paseador', alias: 'juan_pasea' } });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      const link = screen.getByText(/juan paseador/i).closest('a');
      expect(link).toHaveAttribute('href', '/perfil/2');
    });
  });

  test('muestra estado de pago cuando está pagada', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'ACEPTADA',
        estadoPago: 'PAGO',
        idCliente: 1,
        idPaseador: 2
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/user/2')) {
        return Promise.resolve({ data: { id: 2, nombre: 'Juan Paseador' } });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText(/pagada ✅/i)).toBeInTheDocument();
    });
  });

  test('muestra estado de pago pendiente', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'ACEPTADA',
        estadoPago: 'PENDIENTE_DE_PAGO',
        idCliente: 1,
        idPaseador: 2
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/user/2')) {
        return Promise.resolve({ data: { id: 2, nombre: 'Juan Paseador' } });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText(/estado de pago:/i)).toBeInTheDocument();
      expect(screen.getByText(/pendiente/i)).toBeInTheDocument();
    });
  });

  test('muestra botón cancelar para solicitudes cancelables', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Mañana

    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: futureDate.toISOString(),
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'PENDIENTE',
        estadoPago: 'PENDIENTE_DE_PAGO',
        idCliente: 1,
        idPaseador: null
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText(/cancelar/i)).toBeInTheDocument();
    });
  });

  test('no muestra botón cancelar para solicitudes pasadas', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Ayer

    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: pastDate.toISOString(),
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'PENDIENTE',
        estadoPago: 'PENDIENTE_DE_PAGO',
        idCliente: 1,
        idPaseador: null
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.queryByText(/cancelar/i)).not.toBeInTheDocument();
    });
  });

  test('cancela solicitud correctamente', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: futureDate.toISOString(),
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'PENDIENTE',
        estadoPago: 'PENDIENTE_DE_PAGO',
        idCliente: 1,
        idPaseador: null
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: {} });
    });

    axios.put.mockResolvedValue({ data: { message: 'Solicitud cancelada' } });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText(/cancelar/i)).toBeInTheDocument();
    });

    const cancelarButton = screen.getByText(/cancelar/i);
    fireEvent.click(cancelarButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('http://localhost:8080/paseo/solicitudes/1');
    });
  });

  test('muestra modal de éxito después de cancelar', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: futureDate.toISOString(),
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'PENDIENTE',
        estadoPago: 'PENDIENTE_DE_PAGO',
        idCliente: 1,
        idPaseador: null
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: {} });
    });

    axios.put.mockResolvedValue({ data: {} });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      const cancelarButton = screen.getByText(/cancelar/i);
      fireEvent.click(cancelarButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/solicitud cancelada con éxito/i)).toBeInTheDocument();
    });
  });

  test('muestra botón pagar para solicitudes aceptadas sin pagar', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'ACEPTADA',
        estadoPago: 'PENDIENTE_DE_PAGO',
        idCliente: 1,
        idPaseador: 2
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/user/2')) {
        return Promise.resolve({ data: { id: 2, nombre: 'Juan Paseador', alias: 'juan_pasea' } });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText(/pagar/i)).toBeInTheDocument();
    });
  });

  test('abre popup de pago al hacer click en pagar', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'ACEPTADA',
        estadoPago: 'PENDIENTE_DE_PAGO',
        idCliente: 1,
        idPaseador: 2
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/user/2')) {
        return Promise.resolve({ data: { id: 2, nombre: 'Juan Paseador', alias: 'juan_pasea' } });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      const pagarButton = screen.getByText(/pagar/i);
      fireEvent.click(pagarButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/alias del paseador:/i)).toBeInTheDocument();
    });
  });

  test('muestra botón opinar para solicitudes finalizadas sin reseña', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: '2025-11-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'FINALIZADA',
        estadoPago: 'PAGO',
        idCliente: 1,
        idPaseador: 2
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] }); // Sin reseñas
      }
      if (url.includes('/user/2')) {
        return Promise.resolve({ data: { id: 2, nombre: 'Juan Paseador' } });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText(/opinar/i)).toBeInTheDocument();
    });
  });

  test('no muestra botón opinar para solicitudes con reseña', async () => {
    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: '2025-11-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'FINALIZADA',
        estadoPago: 'PAGO',
        idCliente: 1,
        idPaseador: 2
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [1] }); // Ya tiene reseña
      }
      if (url.includes('/user/2')) {
        return Promise.resolve({ data: { id: 2, nombre: 'Juan Paseador' } });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.queryByText(/opinar/i)).not.toBeInTheDocument();
    });
  });

  test('maneja error al cancelar solicitud', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const mockSolicitudes = [
      {
        id: 1,
        solicitudId: 1,
        zona: 'QUILMES',
        horario: futureDate.toISOString(),
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        tamanoPerro: 'GRANDE',
        estado: 'PENDIENTE',
        estadoPago: 'PENDIENTE_DE_PAGO',
        idCliente: 1,
        idPaseador: null
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: mockSolicitudes });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: {} });
    });

    axios.put.mockRejectedValue(new Error('Network Error'));

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      const cancelarButton = screen.getByText(/cancelar/i);
      fireEvent.click(cancelarButton);
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Hubo un error al cancelar la solicitud.');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('hace polling cada 10 segundos', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    const initialCalls = axios.get.mock.calls.length;

    // Avanzar 10 segundos
    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(axios.get.mock.calls.length).toBeGreaterThan(initialCalls);
    });
  });

  test('limpia el intervalo al desmontar el componente', async () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    axios.get.mockImplementation((url) => {
      if (url.includes('/paseo/cliente/')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/resenia/resenias-paseos')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: {} });
    });

    const { unmount } = renderWithRouter(<DashboardSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText(/mis solicitudes de paseo/i)).toBeInTheDocument();
    });

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });

  test('renderiza sin errores', () => {
    axios.get.mockResolvedValue({ data: [] });
    expect(() => renderWithRouter(<DashboardSolicitudes />)).not.toThrow();
  });
});
