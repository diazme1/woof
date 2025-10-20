import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClienteDashboard from '../components/Dashboard/ClienteDashboard';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ClienteDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Renderizado básico', () => {
    test('renderiza el dashboard del cliente correctamente', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      renderWithRouter(<ClienteDashboard />);

      expect(screen.getByText(/ahora podés generar solicitudes de paseo/i)).toBeInTheDocument();
      expect(screen.getByText(/que la tranquilidad te acompañe en cada paseo/i)).toBeInTheDocument();
    });

    test('renderiza sin errores', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      expect(() => renderWithRouter(<ClienteDashboard />)).not.toThrow();
    });

    test('renderiza el mensaje principal completo', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      renderWithRouter(<ClienteDashboard />);

      const paragraph = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'p' &&
               content.includes('Ahora podés generar solicitudes de paseo');
      });

      expect(paragraph).toBeInTheDocument();
    });

    test('muestra el emoji de estrella en el mensaje', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      renderWithRouter(<ClienteDashboard />);

      expect(screen.getByText(/✨/)).toBeInTheDocument();
    });

    test('muestra el emoji de huellas en el mensaje', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      renderWithRouter(<ClienteDashboard />);

      expect(screen.getByText(/🐾/)).toBeInTheDocument();
    });
  });

  describe('Manejo de localStorage', () => {
    test('lee correctamente los datos del usuario desde localStorage', () => {
      const userData = { id: 1, nombre: 'Test Cliente', email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(userData));

      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');

      renderWithRouter(<ClienteDashboard />);

      expect(getItemSpy).toHaveBeenCalledWith('user');

      getItemSpy.mockRestore();
    });

    test('renderiza correctamente cuando el usuario está en localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ id: 5, nombre: 'Juan Pérez' }));

      const { container } = renderWithRouter(<ClienteDashboard />);

      expect(container.querySelector('main')).toBeInTheDocument();
    });

    test('renderiza correctamente con diferentes datos de usuario', () => {
      const userData = {
        id: 10,
        nombre: 'María García',
        email: 'maria@example.com',
        rol: 'ROLE_CLIENTE'
      };
      localStorage.setItem('user', JSON.stringify(userData));

      renderWithRouter(<ClienteDashboard />);

      expect(screen.getByText(/ahora podés generar solicitudes de paseo/i)).toBeInTheDocument();
    });

    test('maneja localStorage vacío sin errores', () => {
      localStorage.clear();

      expect(() => renderWithRouter(<ClienteDashboard />)).not.toThrow();
    });

    test('maneja datos corruptos en localStorage', () => {
      localStorage.setItem('user', 'datos-invalidos-no-json');

      expect(() => renderWithRouter(<ClienteDashboard />)).toThrow();
    });
  });

  describe('Estructura del componente', () => {
    test('renderiza un elemento main', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      const { container } = renderWithRouter(<ClienteDashboard />);

      const mainElement = container.querySelector('main');
      expect(mainElement).toBeInTheDocument();
    });

    test('aplica la clase CSS del dashboard', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      const { container } = renderWithRouter(<ClienteDashboard />);

      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('dashboard');
    });

    test('contiene un párrafo con el mensaje', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      renderWithRouter(<ClienteDashboard />);

      const paragraph = screen.getByText(/ahora podés generar solicitudes de paseo/i);
      expect(paragraph.tagName.toLowerCase()).toBe('p');
    });

    test('el párrafo contiene un salto de línea', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      const { container } = renderWithRouter(<ClienteDashboard />);

      const br = container.querySelector('br');
      expect(br).toBeInTheDocument();
    });
  });

  describe('Contenido del mensaje', () => {
    test('muestra el texto sobre generar solicitudes de paseo', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      renderWithRouter(<ClienteDashboard />);

      expect(screen.getByText(/generar solicitudes de paseo/i)).toBeInTheDocument();
    });

    test('muestra el texto sobre tranquilidad', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      renderWithRouter(<ClienteDashboard />);

      expect(screen.getByText(/que la tranquilidad te acompañe/i)).toBeInTheDocument();
    });

    test('incluye la palabra "paseo" en el mensaje', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      renderWithRouter(<ClienteDashboard />);

      const text = screen.getByText(/paseo/i);
      expect(text).toBeInTheDocument();
    });

    test('el mensaje es amigable y acogedor', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      renderWithRouter(<ClienteDashboard />);

      const welcomeMessage = screen.getByText(/ahora podés/i);
      expect(welcomeMessage).toBeInTheDocument();
    });
  });

  describe('Renderizado múltiple', () => {
    test('renderiza consistentemente en múltiples montajes', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));

      const { unmount } = renderWithRouter(<ClienteDashboard />);
      expect(screen.getByText(/ahora podés generar solicitudes de paseo/i)).toBeInTheDocument();

      unmount();

      renderWithRouter(<ClienteDashboard />);
      expect(screen.getByText(/ahora podés generar solicitudes de paseo/i)).toBeInTheDocument();
    });

    test('no mantiene estado entre renderizados', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Usuario1' }));

      const { unmount } = renderWithRouter(<ClienteDashboard />);
      unmount();

      localStorage.setItem('user', JSON.stringify({ id: 2, nombre: 'Usuario2' }));

      renderWithRouter(<ClienteDashboard />);
      expect(screen.getByText(/ahora podés generar solicitudes de paseo/i)).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    test('el contenido es legible por lectores de pantalla', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      const { container } = renderWithRouter(<ClienteDashboard />);

      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveTextContent('Ahora podés generar solicitudes de paseo');
    });

    test('el componente tiene una estructura semántica correcta', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
      const { container } = renderWithRouter(<ClienteDashboard />);

      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelector('p')).toBeInTheDocument();
    });
  });

  describe('Casos edge', () => {
    test('renderiza con un usuario con id 0', () => {
      localStorage.setItem('user', JSON.stringify({ id: 0, nombre: 'Usuario Zero' }));

      expect(() => renderWithRouter(<ClienteDashboard />)).not.toThrow();
      expect(screen.getByText(/ahora podés generar solicitudes de paseo/i)).toBeInTheDocument();
    });

    test('renderiza con un usuario con nombre vacío', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: '' }));

      expect(() => renderWithRouter(<ClienteDashboard />)).not.toThrow();
      expect(screen.getByText(/ahora podés generar solicitudes de paseo/i)).toBeInTheDocument();
    });

    test('renderiza con un usuario con propiedades adicionales', () => {
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        nombre: 'Test',
        email: 'test@example.com',
        telefono: '123456789',
        direccion: 'Calle 123',
        extraField: 'extra'
      }));

      expect(() => renderWithRouter(<ClienteDashboard />)).not.toThrow();
      expect(screen.getByText(/ahora podés generar solicitudes de paseo/i)).toBeInTheDocument();
    });

    test('renderiza con un objeto de usuario vacío', () => {
      localStorage.setItem('user', JSON.stringify({}));

      expect(() => renderWithRouter(<ClienteDashboard />)).not.toThrow();
      expect(screen.getByText(/ahora podés generar solicitudes de paseo/i)).toBeInTheDocument();
    });
  });
});
