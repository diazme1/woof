import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/Header/Header';
import { BrowserRouter } from 'react-router-dom';

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: () => ({ pathname: '/' }),
}));

// Mock de axios
jest.mock('axios');

const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header Component', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('renderiza el header correctamente', () => {
        renderWithRouter(<Header />);
        expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    });

    test('muestra el logo', () => {
        renderWithRouter(<Header />);
        const logo = screen.getByAltText(/logo/i);
        expect(logo).toBeInTheDocument();
    });

    test('muestra links de navegación cuando no está logueado', () => {
        renderWithRouter(<Header />);
        expect(screen.getByText(/inicio/i)).toBeInTheDocument();
    });

    test('renderiza sin errores cuando localStorage está vacío', () => {
        expect(() => renderWithRouter(<Header />)).not.toThrow();
    });
});