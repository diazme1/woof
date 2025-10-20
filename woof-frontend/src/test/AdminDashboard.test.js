import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import { BrowserRouter } from 'react-router-dom';

// Mock del componente DashboardValidaciones
jest.mock('../components/Validaciones/DashboardValidaciones', () => {
  return function MockDashboardValidaciones() {
    return <div data-testid="dashboard-validaciones">Dashboard Validaciones Mock</div>;
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Renderizado básico', () => {
    test('renderiza el dashboard del admin correctamente', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Admin' }));
      renderWithRouter(<AdminDashboard />);

      expect(screen.getByTestId('dashboard-validaciones')).toBeInTheDocument();
    });

    test('renderiza sin errores', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Admin' }));
      expect(() => renderWithRouter(<AdminDashboard />)).not.toThrow();
    });

    test('renderiza el componente DashboardValidaciones', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Admin' }));
      renderWithRouter(<AdminDashboard />);

      expect(screen.getByTestId('dashboard-validaciones')).toBeInTheDocument();
    });
  });

  describe('Manejo de localStorage', () => {
    test('lee correctamente los datos del usuario desde localStorage', () => {
      const userData = { id: 1, nombre: 'Admin User', email: 'admin@example.com' };
      localStorage.setItem('user', JSON.stringify(userData));

      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');

      renderWithRouter(<AdminDashboard />);

      expect(getItemSpy).toHaveBeenCalledWith('user');

      getItemSpy.mockRestore();
    });

    test('renderiza correctamente cuando el usuario está en localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin Test' }));

      const { container } = renderWithRouter(<AdminDashboard />);

      expect(container.querySelector('main')).toBeInTheDocument();
    });

    test('renderiza correctamente con diferentes datos de admin', () => {
      const userData = {
        id: 5,
        nombre: 'Super Admin',
        email: 'superadmin@example.com',
        rol: 'ROLE_ADMIN'
      };
      localStorage.setItem('user', JSON.stringify(userData));

      renderWithRouter(<AdminDashboard />);

      expect(screen.getByTestId('dashboard-validaciones')).toBeInTheDocument();
    });

    test('maneja localStorage vacío sin errores', () => {
      localStorage.clear();

      expect(() => renderWithRouter(<AdminDashboard />)).not.toThrow();
    });

    test('maneja datos corruptos en localStorage', () => {
      localStorage.setItem('user', 'datos-invalidos-no-json');

      expect(() => renderWithRouter(<AdminDashboard />)).toThrow();
    });
  });

  describe('Estructura del componente', () => {
    test('renderiza un elemento main', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin' }));
      const { container } = renderWithRouter(<AdminDashboard />);

      const mainElement = container.querySelector('main');
      expect(mainElement).toBeInTheDocument();
    });

    test('aplica la clase CSS del dashboard', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin' }));
      const { container } = renderWithRouter(<AdminDashboard />);

      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('dashboard');
    });

    test('contiene una sección', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin' }));
      const { container } = renderWithRouter(<AdminDashboard />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    test('el componente DashboardValidaciones está dentro de la sección', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin' }));
      const { container } = renderWithRouter(<AdminDashboard />);

      const section = container.querySelector('section');
      const validacionesComponent = screen.getByTestId('dashboard-validaciones');

      expect(section).toContainElement(validacionesComponent);
    });

    test('tiene la jerarquía correcta de elementos (main > section)', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin' }));
      const { container } = renderWithRouter(<AdminDashboard />);

      const main = container.querySelector('main');
      const section = container.querySelector('section');

      expect(main).toContainElement(section);
    });
  });

  describe('Renderizado múltiple', () => {
    test('renderiza consistentemente en múltiples montajes', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin' }));

      const { unmount } = renderWithRouter(<AdminDashboard />);
      expect(screen.getByTestId('dashboard-validaciones')).toBeInTheDocument();

      unmount();

      renderWithRouter(<AdminDashboard />);
      expect(screen.getByTestId('dashboard-validaciones')).toBeInTheDocument();
    });

    test('no mantiene estado entre renderizados', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin1' }));

      const { unmount } = renderWithRouter(<AdminDashboard />);
      unmount();

      localStorage.setItem('user', JSON.stringify({ id: 2, nombre: 'Admin2' }));

      renderWithRouter(<AdminDashboard />);
      expect(screen.getByTestId('dashboard-validaciones')).toBeInTheDocument();
    });

    test('cada instancia es independiente', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin' }));

      const { container: container1 } = renderWithRouter(<AdminDashboard />);
      const { container: container2 } = renderWithRouter(<AdminDashboard />);

      expect(container1).not.toBe(container2);
    });
  });

  describe('Accesibilidad', () => {
    test('el componente tiene una estructura semántica correcta', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin' }));
      const { container } = renderWithRouter(<AdminDashboard />);

      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    test('usa elementos HTML5 semánticos apropiados', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin' }));
      const { container } = renderWithRouter(<AdminDashboard />);

      const main = container.querySelector('main');
      expect(main.tagName.toLowerCase()).toBe('main');

      const section = container.querySelector('section');
      expect(section.tagName.toLowerCase()).toBe('section');
    });
  });

  describe('Casos edge', () => {
    test('renderiza con un usuario con id 0', () => {
      localStorage.setItem('user', JSON.stringify({ id: 0, nombre: 'Admin Zero' }));

      expect(() => renderWithRouter(<AdminDashboard />)).not.toThrow();
      expect(screen.getByTestId('dashboard-validaciones')).toBeInTheDocument();
    });

    test('renderiza con un usuario con nombre vacío', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: '' }));

      expect(() => renderWithRouter(<AdminDashboard />)).not.toThrow();
      expect(screen.getByTestId('dashboard-validaciones')).toBeInTheDocument();
    });

    test('renderiza con un usuario con propiedades adicionales', () => {
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        nombre: 'Admin',
        email: 'admin@example.com',
        telefono: '123456789',
        permisos: ['validar', 'aprobar'],
        extraField: 'extra'
      }));

      expect(() => renderWithRouter(<AdminDashboard />)).not.toThrow();
      expect(screen.getByTestId('dashboard-validaciones')).toBeInTheDocument();
    });

    test('renderiza con un objeto de usuario vacío', () => {
      localStorage.setItem('user', JSON.stringify({}));

      expect(() => renderWithRouter(<AdminDashboard />)).not.toThrow();
      expect(screen.getByTestId('dashboard-validaciones')).toBeInTheDocument();
    });

    test('renderiza con usuario null en localStorage', () => {
      localStorage.setItem('user', JSON.stringify(null));

      expect(() => renderWithRouter(<AdminDashboard />)).not.toThrow();
    });

    test('renderiza con diferentes tipos de IDs', () => {
      // ID como string
      localStorage.setItem('user', JSON.stringify({ id: '123', nombre: 'Admin' }));
      expect(() => renderWithRouter(<AdminDashboard />)).not.toThrow();

      // ID negativo
      localStorage.clear();
      localStorage.setItem('user', JSON.stringify({ id: -1, nombre: 'Admin' }));
      expect(() => renderWithRouter(<AdminDashboard />)).not.toThrow();
    });
  });

  describe('Integración con DashboardValidaciones', () => {
    test('renderiza el componente hijo correctamente', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin' }));
      renderWithRouter(<AdminDashboard />);

      const validacionesComponent = screen.getByTestId('dashboard-validaciones');
      expect(validacionesComponent).toBeInTheDocument();
      expect(validacionesComponent).toHaveTextContent('Dashboard Validaciones Mock');
    });

    test('el componente hijo se monta correctamente', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin' }));
      const { container } = renderWithRouter(<AdminDashboard />);

      const section = container.querySelector('section');
      expect(section.children.length).toBeGreaterThan(0);
    });
  });

  describe('Snapshot testing', () => {
    test('coincide con el snapshot', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Admin Test' }));
      const { container } = renderWithRouter(<AdminDashboard />);

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
