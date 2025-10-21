import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardValidaciones from '../components/Validaciones/DashboardValidaciones';
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

describe('DashboardValidaciones Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    localStorage.setItem('token', 'fake-token');
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    localStorage.clear();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renderiza el dashboard de validaciones', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/validaciones pendientes de paseadores/i)).toBeInTheDocument();
    });
  });

  test('muestra estado de carga inicialmente', () => {
    axios.get.mockImplementation(() => new Promise(() => {}));

    renderWithRouter(<DashboardValidaciones />);

    expect(screen.getByText(/cargando validaciones/i)).toBeInTheDocument();
  });

  test('muestra mensaje cuando no hay validaciones pendientes', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/no hay validaciones pendientes en este momento/i)).toBeInTheDocument();
    });
  });

  test('muestra error cuando falla la carga de validaciones', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/error al cargar validaciones pendientes/i)).toBeInTheDocument();
    });
  });

  test('muestra lista de usuarios pendientes de validación', async () => {
    const mockUsuarios = [
      {
        idPaseador: 1,
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        dni: '12345678',
        telefono: '1234567890',
        validado: 'PENDIENTE',
        fotoDni: true,
        cv: true
      },
      {
        idPaseador: 2,
        nombre: 'María García',
        email: 'maria@example.com',
        dni: '87654321',
        telefono: '0987654321',
        validado: 'PENDIENTE',
        fotoDni: true,
        cv: true
      }
    ];

    axios.get.mockResolvedValue({ data: mockUsuarios });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument();
      expect(screen.getByText(/maría garcía/i)).toBeInTheDocument();
      expect(screen.getByText(/juan@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/maria@example.com/i)).toBeInTheDocument();
    });
  });

  test('muestra información completa del usuario', async () => {
    const mockUsuario = {
      idPaseador: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      dni: '12345678',
      telefono: '1234567890',
      validado: 'PENDIENTE',
      fotoDni: true,
      cv: true
    };

    axios.get.mockResolvedValue({ data: [mockUsuario] });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/nombre:/i)).toBeInTheDocument();
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument();
      expect(screen.getByText(/email:/i)).toBeInTheDocument();
      expect(screen.getByText(/juan@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/dni:/i)).toBeInTheDocument();
      expect(screen.getAllByText(/12345678/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/teléfono:/i)).toBeInTheDocument();
      expect(screen.getByText(/1234567890/i)).toBeInTheDocument();
      expect(screen.getByText(/estado:/i)).toBeInTheDocument();
    });
  });

  test('muestra botones de aprobar y rechazar para usuarios PENDIENTES', async () => {
    const mockUsuario = {
      idPaseador: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      dni: '12345678',
      telefono: '1234567890',
      validado: 'PENDIENTE',
      fotoDni: true,
      cv: true
    };

    axios.get.mockResolvedValue({ data: [mockUsuario] });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/aprobar/i)).toBeInTheDocument();
      expect(screen.getByText(/rechazar/i)).toBeInTheDocument();
    });
  });

  test('muestra enlaces para ver DNI y CV cuando están disponibles', async () => {
    const mockUsuario = {
      idPaseador: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      dni: '12345678',
      telefono: '1234567890',
      validado: 'PENDIENTE',
      fotoDni: true,
      cv: true
    };

    axios.get.mockResolvedValue({ data: [mockUsuario] });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      const dniLink = screen.getByText(/ver dni/i);
      const cvLink = screen.getByText(/ver cv/i);

      expect(dniLink).toBeInTheDocument();
      expect(dniLink).toHaveAttribute('href', 'http://localhost:8080/user/1/foto-dni');
      expect(dniLink).toHaveAttribute('target', '_blank');

      expect(cvLink).toBeInTheDocument();
      expect(cvLink).toHaveAttribute('href', 'http://localhost:8080/user/1/cv');
      expect(cvLink).toHaveAttribute('target', '_blank');
    });
  });

  test('no muestra enlaces de DNI y CV cuando no están disponibles', async () => {
    const mockUsuario = {
      idPaseador: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      dni: '12345678',
      telefono: '1234567890',
      validado: 'PENDIENTE',
      fotoDni: false,
      cv: false
    };

    axios.get.mockResolvedValue({ data: [mockUsuario] });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.queryByText(/ver dni/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/ver cv/i)).not.toBeInTheDocument();
    });
  });

  test('aprueba validación correctamente', async () => {
    const mockUsuario = {
      idPaseador: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      dni: '12345678',
      telefono: '1234567890',
      validado: 'PENDIENTE',
      fotoDni: true,
      cv: true
    };

    axios.get.mockResolvedValue({ data: [mockUsuario] });
    axios.put.mockResolvedValue({ data: { message: 'Validación aprobada' } });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument();
    });

    const aprobarButton = screen.getByText(/aprobar/i);
    fireEvent.click(aprobarButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:8080/user/1/aprobar-validacion',
        {},
        {
          headers: {
            Authorization: 'Bearer fake-token'
          }
        }
      );
    });
  });

  test('rechaza validación correctamente', async () => {
    const mockUsuario = {
      idPaseador: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      dni: '12345678',
      telefono: '1234567890',
      validado: 'PENDIENTE',
      fotoDni: true,
      cv: true
    };

    axios.get.mockResolvedValue({ data: [mockUsuario] });
    axios.put.mockResolvedValue({ data: { message: 'Validación rechazada' } });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument();
    });

    const rechazarButton = screen.getByText(/rechazar/i);
    fireEvent.click(rechazarButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:8080/user/1/rechazar-validacion',
        {},
        {
          headers: {
            Authorization: 'Bearer fake-token'
          }
        }
      );
    });
  });

  test('elimina usuario de la lista después de aprobar', async () => {
    const mockUsuarios = [
      {
        idPaseador: 1,
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        dni: '12345678',
        telefono: '1234567890',
        validado: 'PENDIENTE',
        fotoDni: true,
        cv: true
      },
      {
        idPaseador: 2,
        nombre: 'María García',
        email: 'maria@example.com',
        dni: '87654321',
        telefono: '0987654321',
        validado: 'PENDIENTE',
        fotoDni: true,
        cv: true
      }
    ];

    axios.get.mockResolvedValue({ data: mockUsuarios });
    axios.put.mockResolvedValue({ data: { message: 'Validación aprobada' } });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument();
      expect(screen.getByText(/maría garcía/i)).toBeInTheDocument();
    });

    const aprobarButtons = screen.getAllByText(/aprobar/i);
    fireEvent.click(aprobarButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText(/juan pérez/i)).not.toBeInTheDocument();
      expect(screen.getByText(/maría garcía/i)).toBeInTheDocument();
    });
  });

  test('muestra modal de éxito después de aprobar validación', async () => {
    const mockUsuario = {
      idPaseador: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      dni: '12345678',
      telefono: '1234567890',
      validado: 'PENDIENTE',
      fotoDni: true,
      cv: true
    };

    axios.get.mockResolvedValue({ data: [mockUsuario] });
    axios.put.mockResolvedValue({ data: { message: 'Validación aprobada' } });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument();
    });

    const aprobarButton = screen.getByText(/aprobar/i);
    fireEvent.click(aprobarButton);

    await waitFor(() => {
      expect(screen.getByText(/validación actualizada con éxito/i)).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('cierra modal de éxito y navega al hacer click en cerrar', async () => {
    const mockUsuario = {
      idPaseador: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      dni: '12345678',
      telefono: '1234567890',
      validado: 'PENDIENTE',
      fotoDni: true,
      cv: true
    };

    axios.get.mockResolvedValue({ data: [mockUsuario] });
    axios.put.mockResolvedValue({ data: { message: 'Validación aprobada' } });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument();
    });

    const aprobarButton = screen.getByText(/aprobar/i);
    fireEvent.click(aprobarButton);

    await waitFor(() => {
      expect(screen.getByText(/validación actualizada con éxito/i)).toBeInTheDocument();
    });

    const cerrarButton = screen.getByText(/cerrar/i);
    fireEvent.click(cerrarButton);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/validaciones');
  });

  test('cierra modal al hacer click en el overlay', async () => {
    const mockUsuario = {
      idPaseador: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      dni: '12345678',
      telefono: '1234567890',
      validado: 'PENDIENTE',
      fotoDni: true,
      cv: true
    };

    axios.get.mockResolvedValue({ data: [mockUsuario] });
    axios.put.mockResolvedValue({ data: { message: 'Validación aprobada' } });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument();
    });

    const aprobarButton = screen.getByText(/aprobar/i);
    fireEvent.click(aprobarButton);

    await waitFor(() => {
      expect(screen.getByText(/validación actualizada con éxito/i)).toBeInTheDocument();
    });

    const overlay = screen.getByRole('presentation');
    fireEvent.click(overlay);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/validaciones');
  });

  test('muestra alerta cuando falla la aprobación', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const mockUsuario = {
      idPaseador: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      dni: '12345678',
      telefono: '1234567890',
      validado: 'PENDIENTE',
      fotoDni: true,
      cv: true
    };

    axios.get.mockResolvedValue({ data: [mockUsuario] });
    axios.put.mockRejectedValue(new Error('Network Error'));

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument();
    });

    const aprobarButton = screen.getByText(/aprobar/i);
    fireEvent.click(aprobarButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Hubo un error al aprobar la validación.');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('muestra alerta cuando falla el rechazo', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const mockUsuario = {
      idPaseador: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      dni: '12345678',
      telefono: '1234567890',
      validado: 'PENDIENTE',
      fotoDni: true,
      cv: true
    };

    axios.get.mockResolvedValue({ data: [mockUsuario] });
    axios.put.mockRejectedValue(new Error('Network Error'));

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument();
    });

    const rechazarButton = screen.getByText(/rechazar/i);
    fireEvent.click(rechazarButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Hubo un error al rechazar la validación.');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('limpia el intervalo al desmontar el componente', async () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    axios.get.mockResolvedValue({ data: [] });

    const { unmount } = renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(screen.getByText(/validaciones pendientes de paseadores/i)).toBeInTheDocument();
    });

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });

  test('hace polling cada 100 segundos', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<DashboardValidaciones />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    // Avanzar 100 segundos
    jest.advanceTimersByTime(100000);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  test('renderiza sin errores', () => {
    axios.get.mockResolvedValue({ data: [] });
    expect(() => renderWithRouter(<DashboardValidaciones />)).not.toThrow();
  });
});
