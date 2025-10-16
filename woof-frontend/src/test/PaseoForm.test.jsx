import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaseoForm from '../components/PaseoForm/PaseoForm';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PaseoForm Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test User' }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renderiza el formulario de paseo', () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);
    expect(screen.getByText(/solicitar paseo/i)).toBeInTheDocument();
  });

  test('muestra campos del formulario', () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);
    expect(screen.getByLabelText(/zona/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre del perro/i)).toBeInTheDocument();
  });

  test('muestra el botón de solicitar', () => {
    renderWithRouter(<PaseoForm onClose={mockOnClose} />);
    expect(screen.getByRole('button', { name: /solicitar/i })).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<PaseoForm onClose={mockOnClose} />)).not.toThrow();
  });
});

