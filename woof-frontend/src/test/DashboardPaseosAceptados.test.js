import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPaseosAceptados from '../components/PaseosAceptados/DashboardPaseosAceptados';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DashboardPaseosAceptados Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Paseador' }));
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renderiza el dashboard de paseos aceptados', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      expect(screen.getByText(/mis paseos aceptados/i)).toBeInTheDocument();
    });
  });

  test('muestra tabs de activos e históricos', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      // Usar getAllByText ya que "Activos" puede aparecer múltiples veces
      expect(screen.getAllByText(/activos/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/históricos/i)).toBeInTheDocument();
    });
  });

  test('muestra mensaje cuando no hay paseos activos', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      expect(screen.getByText(/no hay paseos activos/i)).toBeInTheDocument();
    });
  });

  test('muestra error cuando falla la carga de paseos', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValue(new Error('Network Error'));

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      // El componente no muestra el error en el loading state, lo muestra después
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  test('carga paseos activos e históricos correctamente', async () => {
    const mockPaseosActivos = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        estado: 'ACEPTADA',
        estadoPago: 'PAGO',
        idPaseador: 1
      }
    ];

    const mockPaseosHistoricos = [
      {
        id: 2,
        zona: 'BERNAL',
        horario: '2025-11-15T10:00:00',
        nombrePerro: 'Max',
        raza: 'Golden',
        estado: 'FINALIZADA',
        estadoPago: 'PAGO',
        idPaseador: 1
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/actuales/')) {
        return Promise.resolve({ data: mockPaseosActivos });
      }
      if (url.includes('/historicos/')) {
        return Promise.resolve({ data: mockPaseosHistoricos });
      }
      return Promise.resolve({ data: [] });
    });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/paseo/paseador/actuales/1');
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/paseo/paseador/historicos/1');
    });
  });

  test('muestra información completa del paseo activo', async () => {
    const mockPaseos = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        estado: 'ACEPTADA',
        estadoPago: 'PAGO',
        idPaseador: 1
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/actuales/')) {
        return Promise.resolve({ data: mockPaseos });
      }
      if (url.includes('/historicos/')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      expect(screen.getByText(/zona:/i)).toBeInTheDocument();
      expect(screen.getByText(/quilmes/i)).toBeInTheDocument();
      expect(screen.getByText(/fecha y hora:/i)).toBeInTheDocument();
      expect(screen.getByText(/perro:/i)).toBeInTheDocument();
      expect(screen.getByText(/firulais/i)).toBeInTheDocument();
      expect(screen.getByText(/labrador/i)).toBeInTheDocument();
      expect(screen.getByText(/estado de solicitud:/i)).toBeInTheDocument();
      expect(screen.getByText(/aceptada/i)).toBeInTheDocument();
    });
  });

  test('muestra estado de pago pagada', async () => {
    const mockPaseos = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        estado: 'ACEPTADA',
        estadoPago: 'PAGO',
        idPaseador: 1
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/actuales/')) {
        return Promise.resolve({ data: mockPaseos });
      }
      if (url.includes('/historicos/')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      expect(screen.getByText(/estado de pago:/i)).toBeInTheDocument();
      expect(screen.getByText(/pagada/i)).toBeInTheDocument();
    });
  });

  test('muestra estado de pago pendiente', async () => {
    const mockPaseos = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        estado: 'ACEPTADA',
        estadoPago: 'PENDIENTE_DE_PAGO',
        idPaseador: 1
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/actuales/')) {
        return Promise.resolve({ data: mockPaseos });
      }
      if (url.includes('/historicos/')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      expect(screen.getByText(/estado de pago:/i)).toBeInTheDocument();
      expect(screen.getAllByText(/pendiente/i).length).toBeGreaterThan(0);
    });
  });

  test('muestra botón finalizar para paseos pagados en vista activos', async () => {
    const mockPaseos = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        estado: 'ACEPTADA',
        estadoPago: 'PAGO',
        idPaseador: 1
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/actuales/')) {
        return Promise.resolve({ data: mockPaseos });
      }
      if (url.includes('/historicos/')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      expect(screen.getByText(/finalizar paseo/i)).toBeInTheDocument();
    });
  });

  test('no muestra botón finalizar para paseos no pagados', async () => {
    const mockPaseos = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        estado: 'ACEPTADA',
        estadoPago: 'PENDIENTE_DE_PAGO',
        idPaseador: 1
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/actuales/')) {
        return Promise.resolve({ data: mockPaseos });
      }
      if (url.includes('/historicos/')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      expect(screen.queryByText(/finalizar paseo/i)).not.toBeInTheDocument();
    });
  });

  test('cambia entre tabs de activos e históricos', async () => {
    const mockPaseosActivos = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        estado: 'ACEPTADA',
        estadoPago: 'PAGO',
        idPaseador: 1
      }
    ];

    const mockPaseosHistoricos = [
      {
        id: 2,
        zona: 'BERNAL',
        horario: '2025-11-15T10:00:00',
        nombrePerro: 'Max',
        raza: 'Golden',
        estado: 'FINALIZADA',
        estadoPago: 'PAGO',
        idPaseador: 1
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/actuales/')) {
        return Promise.resolve({ data: mockPaseosActivos });
      }
      if (url.includes('/historicos/')) {
        return Promise.resolve({ data: mockPaseosHistoricos });
      }
      return Promise.resolve({ data: [] });
    });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      expect(screen.getByText(/firulais/i)).toBeInTheDocument();
    });

    const historicosTab = screen.getByText(/históricos/i);
    fireEvent.click(historicosTab);

    await waitFor(() => {
      expect(screen.getByText(/max/i)).toBeInTheDocument();
      expect(screen.queryByText(/firulais/i)).not.toBeInTheDocument();
    });
  });

  test('muestra mensaje cuando no hay paseos históricos', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/actuales/')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/historicos/')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      const historicosTab = screen.getByText(/históricos/i);
      fireEvent.click(historicosTab);
    });

    await waitFor(() => {
      expect(screen.getByText(/no hay paseos historicos/i)).toBeInTheDocument();
    });
  });

  test('finaliza paseo correctamente', async () => {
    const mockPaseos = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        estado: 'ACEPTADA',
        estadoPago: 'PAGO',
        idPaseador: 1
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/actuales/')) {
        return Promise.resolve({ data: mockPaseos });
      }
      if (url.includes('/historicos/')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    axios.put.mockResolvedValue({ data: { message: 'Paseo finalizado' } });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      expect(screen.getByText(/finalizar paseo/i)).toBeInTheDocument();
    });

    const finalizarButton = screen.getByText(/finalizar paseo/i);
    fireEvent.click(finalizarButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('http://localhost:8080/paseo/finalizar/1');
    });
  });

  test('muestra modal de éxito después de finalizar paseo', async () => {
    const mockPaseos = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        estado: 'ACEPTADA',
        estadoPago: 'PAGO',
        idPaseador: 1
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/actuales/')) {
        return Promise.resolve({ data: mockPaseos });
      }
      if (url.includes('/historicos/')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    axios.put.mockResolvedValue({ data: {} });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      const finalizarButton = screen.getByText(/finalizar paseo/i);
      fireEvent.click(finalizarButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/paseo finalizado con éxito/i)).toBeInTheDocument();
    });
  });

  test('cierra modal de éxito al hacer click en cerrar', async () => {
    const mockPaseos = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        estado: 'ACEPTADA',
        estadoPago: 'PAGO',
        idPaseador: 1
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/actuales/')) {
        return Promise.resolve({ data: mockPaseos });
      }
      if (url.includes('/historicos/')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    axios.put.mockResolvedValue({ data: {} });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      const finalizarButton = screen.getByText(/finalizar paseo/i);
      fireEvent.click(finalizarButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/paseo finalizado con éxito/i)).toBeInTheDocument();
    });

    const cerrarButton = screen.getByText(/cerrar/i);
    fireEvent.click(cerrarButton);

    expect(screen.queryByText(/paseo finalizado con éxito/i)).not.toBeInTheDocument();
  });

  test('recarga paseos después de finalizar', async () => {
    const mockPaseosInicial = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        estado: 'ACEPTADA',
        estadoPago: 'PAGO',
        idPaseador: 1
      }
    ];

    let callCount = 0;
    axios.get.mockImplementation((url) => {
      if (url.includes('/actuales/')) {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ data: mockPaseosInicial });
        } else {
          return Promise.resolve({ data: [] }); // Después de finalizar, lista vacía
        }
      }
      if (url.includes('/historicos/')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    axios.put.mockResolvedValue({ data: {} });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      expect(screen.getByText(/firulais/i)).toBeInTheDocument();
    });

    const finalizarButton = screen.getByText(/finalizar paseo/i);
    fireEvent.click(finalizarButton);

    await waitFor(() => {
      // Debe haber llamado a axios.get dos veces más (una para actuales y otra para históricos)
      expect(axios.get).toHaveBeenCalledTimes(4); // 2 inicial + 2 después de finalizar
    });
  });

  test('maneja error al finalizar paseo', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const mockPaseos = [
      {
        id: 1,
        zona: 'QUILMES',
        horario: '2025-12-20T14:30:00',
        nombrePerro: 'Firulais',
        raza: 'Labrador',
        estado: 'ACEPTADA',
        estadoPago: 'PAGO',
        idPaseador: 1
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/actuales/')) {
        return Promise.resolve({ data: mockPaseos });
      }
      if (url.includes('/historicos/')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    axios.put.mockRejectedValue({
      response: { data: { message: 'Error al finalizar' } }
    });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      const finalizarButton = screen.getByText(/finalizar paseo/i);
      fireEvent.click(finalizarButton);
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error al finalizar');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('aplica clase activa al tab seleccionado', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<DashboardPaseosAceptados />);

    await waitFor(() => {
      // Obtener todos los elementos con "activos" y filtrar por el que sea botón
      const allActivosElements = screen.getAllByText(/activos/i);
      const activosTab = allActivosElements.find(el => el.tagName === 'BUTTON');
      const historicosTab = screen.getByRole('button', { name: /históricos/i });

      // Inicialmente, "activos" debe tener la clase activa
      expect(activosTab.className).toContain('activeTab');
      expect(historicosTab.className).not.toContain('activeTab');
    });

    const historicosTab = screen.getByRole('button', { name: /históricos/i });
    fireEvent.click(historicosTab);

    await waitFor(() => {
      const allActivosElements = screen.getAllByText(/activos/i);
      const activosTab = allActivosElements.find(el => el.tagName === 'BUTTON');
      const historicosTabUpdated = screen.getByRole('button', { name: /históricos/i });

      // Después del click, "históricos" debe tener la clase activa
      expect(historicosTabUpdated.className).toContain('activeTab');
      expect(activosTab.className).not.toContain('activeTab');
    });
  });

  test('renderiza sin errores', () => {
    axios.get.mockResolvedValue({ data: [] });
    expect(() => renderWithRouter(<DashboardPaseosAceptados />)).not.toThrow();
  });
});
