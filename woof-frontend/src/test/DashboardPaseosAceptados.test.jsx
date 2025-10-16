import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPaseosAceptados from '../components/PaseosAceptados/DashboardPaseosAceptados';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DashboardPaseosAceptados Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renderiza el dashboard de paseos aceptados', () => {
    renderWithRouter(<DashboardPaseosAceptados />);
    expect(screen.getByText(/paseos aceptados/i)).toBeInTheDocument();
  });

  test('muestra mensaje cuando no hay paseos aceptados', () => {
    renderWithRouter(<DashboardPaseosAceptados />);
    expect(screen.getByText(/no hay paseos aceptados/i)).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<DashboardPaseosAceptados />)).not.toThrow();
  });
});

