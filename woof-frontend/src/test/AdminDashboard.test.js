import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Admin' }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renderiza el dashboard del admin', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  test('muestra opciones de administración', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText(/validaciones/i)).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<AdminDashboard />)).not.toThrow();
  });
});

