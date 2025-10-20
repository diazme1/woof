import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
jest.mock('axios');
jest.mock("react-router-dom", () => ({
    BrowserRouter: ({ children }) => <div>{children}</div>,
}));
import { BrowserRouter } from "react-router-dom";
import ReseniaForm from '../components/ReseniaForm/ReseniaForm';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ReseniaForm Component', () => {
  const mockOnClose = jest.fn();
  const mockPaseo = { id: 1, idPaseador: 2 };


  test('renderiza el formulario de reseña', () => {
    renderWithRouter(<ReseniaForm paseo={mockPaseo} onClose={mockOnClose} />);
    expect(screen.getByText(/contanos tu experiencia/i)).toBeInTheDocument();
  });

  test('muestra campo para puntuación', () => {
    renderWithRouter(<ReseniaForm paseo={mockPaseo} onClose={mockOnClose} />);
    expect(screen.getByLabelText(/puntuación/i)).toBeInTheDocument();
  });

  test('muestra campo para comentario', () => {
    renderWithRouter(<ReseniaForm paseo={mockPaseo} onClose={mockOnClose} />);
    expect(screen.getByLabelText(/comentario/i)).toBeInTheDocument();
  });

  test('muestra el botón de guardar', () => {
    renderWithRouter(<ReseniaForm paseo={mockPaseo} onClose={mockOnClose} />);
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<ReseniaForm paseo={mockPaseo} onClose={mockOnClose} />)).not.toThrow();
  });
});

