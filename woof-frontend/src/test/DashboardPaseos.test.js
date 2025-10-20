import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPaseos from '../components/Paseos/DashboardPaseos';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DashboardPaseos Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renderiza el dashboard de paseos', () => {
    renderWithRouter(<DashboardPaseos />);
    expect(screen.getByText(/paseos disponibles/i)).toBeInTheDocument();
  });

  test('muestra mensaje cuando no hay paseos', () => {
    renderWithRouter(<DashboardPaseos />);
    expect(screen.getByText(/no hay paseos disponibles/i)).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<DashboardPaseos />)).not.toThrow();
  });
});

