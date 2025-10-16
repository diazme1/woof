import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReseniaForm from '../components/ReseniaForm/ReseniaForm';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ReseniaForm Component', () => {
  const mockOnClose = jest.fn();
  const mockPaseo = { id: 1, idPaseador: 2 };

  test('renderiza el formulario de reseña', () => {
    renderWithRouter(<ReseniaForm paseo={mockPaseo} onClose={mockOnClose} />);
    expect(screen.getByText(/dejar reseña/i)).toBeInTheDocument();
  });

  test('muestra campo para puntuación', () => {
    renderWithRouter(<ReseniaForm paseo={mockPaseo} onClose={mockOnClose} />);
    expect(screen.getByLabelText(/puntuación/i)).toBeInTheDocument();
  });

  test('muestra campo para comentario', () => {
    renderWithRouter(<ReseniaForm paseo={mockPaseo} onClose={mockOnClose} />);
    expect(screen.getByLabelText(/comentario/i)).toBeInTheDocument();
  });

  test('muestra el botón de enviar', () => {
    renderWithRouter(<ReseniaForm paseo={mockPaseo} onClose={mockOnClose} />);
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<ReseniaForm paseo={mockPaseo} onClose={mockOnClose} />)).not.toThrow();
  });
});

