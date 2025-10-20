import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaseadorDashboard from '../components/Dashboard/PaseadorDashboard';
import { BrowserRouter } from 'react-router-dom';

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
    localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Paseador' }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renderiza el dashboard del paseador', () => {
    renderWithRouter(<PaseadorDashboard />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  test('muestra opciones de navegación del paseador', () => {
    renderWithRouter(<PaseadorDashboard />);
    expect(screen.getByText(/paseos disponibles/i)).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<PaseadorDashboard />)).not.toThrow();
  });
});

