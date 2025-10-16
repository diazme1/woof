import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Perfil from '../components/Perfil/Perfil';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: () => ({ search: '' }),
}));

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Perfil Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test User', alias: 'testuser' }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renderiza el componente de perfil', () => {
    renderWithRouter(<Perfil />);
    expect(screen.getByText(/perfil/i)).toBeInTheDocument();
  });

  test('muestra la información del usuario', () => {
    renderWithRouter(<Perfil />);
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });

  test('muestra el alias del usuario', () => {
    renderWithRouter(<Perfil />);
    expect(screen.getByText(/@testuser/i)).toBeInTheDocument();
  });

  test('muestra la sección de reseñas', () => {
    renderWithRouter(<Perfil />);
    expect(screen.getByText(/reseñas/i)).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<Perfil />)).not.toThrow();
  });
});


