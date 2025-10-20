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
    localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente' }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renderiza el dashboard del cliente', () => {
    renderWithRouter(<ClienteDashboard />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  test('muestra opciones de navegación del cliente', () => {
    renderWithRouter(<ClienteDashboard />);
    expect(screen.getByText(/mis solicitudes/i)).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<ClienteDashboard />)).not.toThrow();
  });
});

