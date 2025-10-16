import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlobalForm from '../components/Form/Global/GlobalForm';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('GlobalForm Component', () => {
  test('renderiza el formulario global', () => {
    renderWithRouter(<GlobalForm />);
    expect(screen.getByText(/registrarse/i)).toBeInTheDocument();
  });

  test('muestra opciones de rol', () => {
    renderWithRouter(<GlobalForm />);
    expect(screen.getByText(/cliente/i)).toBeInTheDocument();
    expect(screen.getByText(/paseador/i)).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<GlobalForm />)).not.toThrow();
  });
});

