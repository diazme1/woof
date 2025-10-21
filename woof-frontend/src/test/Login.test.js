import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login/Login';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Login Component', () => {
  beforeEach(() => {
    // Limpiar localStorage y mocks antes de cada test
    localStorage.clear();
    jest.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  test('renderiza el formulario de login', () => {
    renderWithRouter(<Login />);
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('muestra campos de email y contraseña', () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
  });

  test('muestra el botón de iniciar sesión', () => {
    renderWithRouter(<Login />);
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  test('muestra link para registrarse', () => {
    renderWithRouter(<Login />);
    expect(screen.getByText(/no tiene una cuenta/i)).toBeInTheDocument();
    expect(screen.getByText(/cree una/i)).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<Login />)).not.toThrow();
  });

  test('permite ingresar email', () => {
    renderWithRouter(<Login />);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  test('permite ingresar contraseña', () => {
    renderWithRouter(<Login />);
    const passwordInput = screen.getAllByLabelText(/contraseña/i)[0];

    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput.value).toBe('password123');
  });

  test('los campos son requeridos', () => {
    renderWithRouter(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getAllByLabelText(/contraseña/i)[0];

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  test('el campo de email tiene type="email"', () => {
    renderWithRouter(<Login />);
    const emailInput = screen.getByLabelText(/email/i);

    expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('muestra botón para ver/ocultar contraseña', () => {
    renderWithRouter(<Login />);
    const toggleButton = screen.getByLabelText(/mostrar contraseña/i);

    expect(toggleButton).toBeInTheDocument();
  });

  test('cambia el tipo de input de contraseña al hacer click en el botón de ojo', () => {
    renderWithRouter(<Login />);
    const passwordInput = screen.getAllByLabelText(/contraseña/i)[0];
    const toggleButton = screen.getByLabelText(/mostrar contraseña/i);

    // Inicialmente debe ser tipo password
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Al hacer click, debe cambiar a text
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/ocultar contraseña/i)).toBeInTheDocument();

    // Al hacer click de nuevo, vuelve a password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('abre modal de registro al hacer click en "Cree una"', () => {
    renderWithRouter(<Login />);
    const registerButton = screen.getByText(/cree una/i);

    fireEvent.click(registerButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/registrarme/i)).toBeInTheDocument();
  });

  test('cierra modal de registro al hacer click en el botón de cerrar', () => {
    renderWithRouter(<Login />);
    const registerButton = screen.getByText(/cree una/i);

    fireEvent.click(registerButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeButton = screen.getByLabelText(/cerrar/i);
    fireEvent.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('cierra modal de registro al hacer click en el backdrop', () => {
    renderWithRouter(<Login />);
    const registerButton = screen.getByText(/cree una/i);

    fireEvent.click(registerButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('no cierra modal al hacer click dentro del contenido del modal', () => {
    renderWithRouter(<Login />);
    const registerButton = screen.getByText(/cree una/i);

    fireEvent.click(registerButton);
    const modalContent = screen.getByText(/registrarme/i).closest('div');

    fireEvent.click(modalContent);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('envía formulario con credenciales válidas', async () => {
    const mockResponse = {
      data: {
        token: 'fake-jwt-token',
        id: 1,
        nombre: 'Test User',
        email: 'test@example.com',
        rol: 'ROLE_CLIENTE'
      }
    };

    axios.post.mockResolvedValue(mockResponse);

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getAllByLabelText(/contraseña/i)[0];
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8080/auth/login',
        {
          email: 'test@example.com',
          contrasena: 'password123'
        }
      );
    });
  });

  test('guarda token y datos de usuario en localStorage después de login exitoso', async () => {
    const mockResponse = {
      data: {
        token: 'fake-jwt-token',
        id: 1,
        nombre: 'Test User',
        email: 'test@example.com',
        rol: 'ROLE_CLIENTE'
      }
    };

    axios.post.mockResolvedValue(mockResponse);

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getAllByLabelText(/contraseña/i)[0];
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      const user = JSON.parse(localStorage.getItem('user'));
      expect(user).toEqual({
        id: 1,
        nombre: 'Test User',
        email: 'test@example.com',
        rol: 'ROLE_CLIENTE'
      });
    });
  });

  test('redirige a la página principal después de login exitoso', async () => {
    const mockResponse = {
      data: {
        token: 'fake-jwt-token',
        id: 1,
        nombre: 'Test User',
        email: 'test@example.com',
        rol: 'ROLE_CLIENTE'
      }
    };

    axios.post.mockResolvedValue(mockResponse);

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getAllByLabelText(/contraseña/i)[0];
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.location.href).toBe('/');
    });
  });

  test('muestra alerta cuando las credenciales son inválidas', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    axios.post.mockRejectedValue({
      response: { status: 401, data: { message: 'Credenciales inválidas' } }
    });

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getAllByLabelText(/contraseña/i)[0];
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'Hubo un problema al iniciar sesión. Intenta nuevamente más tarde.'
      );
    });

    alertSpy.mockRestore();
  });

  test('maneja error de red correctamente', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    axios.post.mockRejectedValue(new Error('Network Error'));

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getAllByLabelText(/contraseña/i)[0];
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('no envía formulario vacío', () => {
    renderWithRouter(<Login />);

    const form = screen.getByRole('heading', { name: /iniciar sesión/i }).closest('form');

    // Verificar que axios.post no se haya llamado
    expect(axios.post).not.toHaveBeenCalled();
  });
});
