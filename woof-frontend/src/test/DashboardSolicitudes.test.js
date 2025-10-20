import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardSolicitudes from '../components/Solicitudes/DashboardSolicitudes';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DashboardSolicitudes Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renderiza el dashboard de solicitudes', () => {
    renderWithRouter(<DashboardSolicitudes />);
    expect(screen.getByText(/mis solicitudes/i)).toBeInTheDocument();
  });

  test('muestra mensaje cuando no hay solicitudes', () => {
    renderWithRouter(<DashboardSolicitudes />);
    expect(screen.getByText(/no hay solicitudes/i)).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<DashboardSolicitudes />)).not.toThrow();
  });
});

