import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardValidaciones from '../components/Validaciones/DashboardValidaciones';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DashboardValidaciones Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renderiza el dashboard de validaciones', () => {
    renderWithRouter(<DashboardValidaciones />);
    expect(screen.getByText(/validaciones pendientes/i)).toBeInTheDocument();
  });

  test('muestra mensaje cuando no hay validaciones pendientes', () => {
    renderWithRouter(<DashboardValidaciones />);
    expect(screen.getByText(/no hay validaciones pendientes/i)).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<DashboardValidaciones />)).not.toThrow();
  });
});

