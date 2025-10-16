import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientForm from '../components/ClientForm/ClientForm';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ClientForm Component', () => {
  test('renderiza el formulario de cliente', () => {
    renderWithRouter(<ClientForm />);
    expect(screen.getByText(/registrate como cliente/i)).toBeInTheDocument();
  });

  test('muestra campos del formulario de registro', () => {
    renderWithRouter(<ClientForm />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('muestra el botón de registrarse', () => {
    renderWithRouter(<ClientForm />);
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<ClientForm />)).not.toThrow();
  });
});

