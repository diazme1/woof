import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
jest.mock('axios');
jest.mock("react-router-dom", () => ({
    BrowserRouter: ({ children }) => <div>{children}</div>,
}));
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Perfil from '../components/Perfil/Perfil';

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({ paramUserId: "1" }),
}));

beforeEach(() => {
    // mock de localStorage
    Storage.prototype.getItem = jest.fn(() =>
        JSON.stringify({ id: 1, nombre: "Test User" })
    );

    // Respuesta simulada para las llamadas axios
    axios.get.mockImplementation((url) => {
        if (url.includes("/paseo/solicitudes/")) return Promise.resolve({ data: 5 });
        if (url.includes("/user/1/antiguedad")) return Promise.resolve({ data: "1 año" });
        if (url.includes("/user/1")) return Promise.resolve({
            data: {
                nombre: "Test User",
                biografia: "Hola!",
                alias: "usuario1",
                telefono: "1234",
                direccion: "Calle 1",
                fotoPerfilUrl: null
            }
        });
        if (url.includes("/resenia/paseador/")) return Promise.resolve({ data: [] });
        return Promise.resolve({ data: null });
    });
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Perfil Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test User', alias: 'testuser' }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renderiza el componente de perfil', async () => {
    renderWithRouter(<Perfil />);
    expect(await screen.findByText(/biografía/i)).toBeInTheDocument();
    expect(screen.getByText(/contacto/i)).toBeInTheDocument();
    expect(screen.getByText(/estadísticas/i)).toBeInTheDocument();
    expect(screen.getByText(/reseñas y opiniones/i)).toBeInTheDocument();
  });

  test('muestra la información del usuario', async () => {
    renderWithRouter(<Perfil />);
    expect(await screen.findByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByText(/biografía/i)).toBeInTheDocument();
    expect(screen.getByText(/contacto/i)).toBeInTheDocument();
    expect(screen.getByText(/estadísticas/i)).toBeInTheDocument();
    expect(screen.getByText(/reseñas y opiniones/i)).toBeInTheDocument();
  });

  test('muestra el alias del usuario', async () => {
    renderWithRouter(<Perfil />);
    expect(await screen.findByText(/usuario1/i)).toBeInTheDocument();
  });

  test('muestra la sección de reseñas', async () => {
    renderWithRouter(<Perfil />);
    expect(await screen.findByText(/reseñas y opiniones/i)).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => renderWithRouter(<Perfil />)).not.toThrow();
  });
});


