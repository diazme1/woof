import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/Header/Header';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Mock de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
}));

// Mock de axios
jest.mock('axios');

// Mock de react-icons
jest.mock('react-icons/fa', () => ({
    FaUserCircle: () => <div data-testid="user-icon">UserIcon</div>
}));

const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header Component', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
        delete window.location;
        window.location = { href: '' };

        // Mock por defecto para axios.get (foto de perfil)
        axios.get.mockResolvedValue({
            data: new Blob(['fake-image'], { type: 'image/jpeg' }),
            headers: { 'content-type': 'image/jpeg' }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renderiza el header correctamente', () => {
        renderWithRouter(<Header />);
        expect(screen.getByAltText(/logo de la empresa/i)).toBeInTheDocument();
    });

    test('muestra el logo', () => {
        renderWithRouter(<Header />);
        const logo = screen.getByAltText(/logo de la empresa/i);
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', '/logo.png');
    });

    test('muestra botón de iniciar sesión cuando no está logueado', () => {
        renderWithRouter(<Header />);
        expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
    });

    test('renderiza sin errores cuando localStorage está vacío', () => {
        expect(() => renderWithRouter(<Header />)).not.toThrow();
    });

    test('muestra menú burger', () => {
        renderWithRouter(<Header />);
        const burgerButton = screen.getByLabelText(/abrir menú/i);
        expect(burgerButton).toBeInTheDocument();
    });

    test('abre y cierra el menú al hacer click en el burger', () => {
        renderWithRouter(<Header />);
        const burgerButton = screen.getByLabelText(/abrir menú/i);

        // Verificar que inicialmente aria-expanded es false
        expect(burgerButton).toHaveAttribute('aria-expanded', 'false');

        // Hacer click para abrir
        fireEvent.click(burgerButton);
        expect(burgerButton).toHaveAttribute('aria-expanded', 'true');

        // Hacer click para cerrar
        fireEvent.click(burgerButton);
        expect(burgerButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('muestra links del landing cuando el usuario no tiene rol', () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test', rol: null }));

        renderWithRouter(<Header />);

        expect(screen.getByText(/cómo funciona/i)).toBeInTheDocument();
        expect(screen.getByText(/¿por qué elegirnos\?/i)).toBeInTheDocument();
        expect(screen.getByText(/precios/i)).toBeInTheDocument();
        expect(screen.getByText(/seguridad/i)).toBeInTheDocument();
    });

    test('muestra botón de cerrar sesión cuando está logueado', () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test', rol: 'ROLE_CLIENTE' }));

        renderWithRouter(<Header />);

        expect(screen.getByText(/cerrar sesión/i)).toBeInTheDocument();
    });

    test('cierra sesión y limpia localStorage al hacer click en cerrar sesión', () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test', rol: 'ROLE_CLIENTE' }));

        renderWithRouter(<Header />);

        const logoutButton = screen.getByText(/cerrar sesión/i);
        fireEvent.click(logoutButton);

        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        expect(window.location.href).toBe('/');
    });

    test('muestra opciones de cliente cuando el usuario es ROLE_CLIENTE', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente', rol: 'ROLE_CLIENTE' }));

        renderWithRouter(<Header />);

        await waitFor(() => {
            expect(screen.getByText(/mi historial/i)).toBeInTheDocument();
            expect(screen.getByText(/registrar solicitud/i)).toBeInTheDocument();
        });
    });

    test('muestra opciones de paseador cuando el usuario es ROLE_PASEADOR', async () => {
        axios.get.mockResolvedValue({
            data: { id: 1, nombre: 'Test Paseador', validado: 'APROBADO' }
        });

        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Paseador', rol: 'ROLE_PASEADOR' }));

        renderWithRouter(<Header />);

        await waitFor(() => {
            expect(screen.getByText(/paseos aceptados/i)).toBeInTheDocument();
        });
    });

    test('muestra "Solicitudes activas" solo cuando el paseador está aprobado', async () => {
        axios.get.mockResolvedValue({
            data: { id: 1, nombre: 'Test Paseador', validado: 'APROBADO' }
        });

        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Paseador', rol: 'ROLE_PASEADOR' }));

        renderWithRouter(<Header />);

        await waitFor(() => {
            expect(screen.getByText(/solicitudes activas/i)).toBeInTheDocument();
        });
    });

    test('no muestra "Solicitudes activas" cuando el paseador no está aprobado', async () => {
        axios.get.mockResolvedValue({
            data: { id: 1, nombre: 'Test Paseador', validado: 'PENDIENTE' }
        });

        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Paseador', rol: 'ROLE_PASEADOR' }));

        renderWithRouter(<Header />);

        await waitFor(() => {
            expect(screen.queryByText(/solicitudes activas/i)).not.toBeInTheDocument();
        });
    });

    test('abre modal de registro de paseo al hacer click en "Registrar solicitud"', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente', rol: 'ROLE_CLIENTE' }));

        renderWithRouter(<Header />);

        await waitFor(() => {
            const registrarButton = screen.getByText(/registrar solicitud/i);
            fireEvent.click(registrarButton);
        });

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/registrar solicitud de paseo/i)).toBeInTheDocument();
    });

    test('cierra modal de paseo al hacer click en el botón de cerrar', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente', rol: 'ROLE_CLIENTE' }));

        renderWithRouter(<Header />);

        await waitFor(() => {
            const registrarButton = screen.getByText(/registrar solicitud/i);
            fireEvent.click(registrarButton);
        });

        const closeButton = screen.getByLabelText(/cerrar/i);
        fireEvent.click(closeButton);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('cierra modal de paseo al hacer click en el backdrop', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Cliente', rol: 'ROLE_CLIENTE' }));

        renderWithRouter(<Header />);

        await waitFor(() => {
            const registrarButton = screen.getByText(/registrar solicitud/i);
            fireEvent.click(registrarButton);
        });

        const backdrop = screen.getByRole('dialog');
        fireEvent.click(backdrop);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('navega a la sección "como-funciona" al hacer click', () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test', rol: null }));

        // Mock de getElementById y scrollIntoView
        const mockElement = { scrollIntoView: jest.fn() };
        document.getElementById = jest.fn(() => mockElement);

        renderWithRouter(<Header />);

        const comoFuncionaButton = screen.getByText(/cómo funciona/i);
        fireEvent.click(comoFuncionaButton);

        expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    test('muestra icono de perfil para paseadores', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Paseador', rol: 'ROLE_PASEADOR' }));

        renderWithRouter(<Header />);

        await waitFor(() => {
            expect(screen.getByTestId('user-icon')).toBeInTheDocument();
        });
    });

    test('intenta cargar la foto de perfil del paseador', async () => {
        const mockBlob = new Blob(['fake-image'], { type: 'image/jpeg' });
        axios.get.mockResolvedValue({
            data: mockBlob,
            headers: { 'content-type': 'image/jpeg' }
        });

        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Paseador', rol: 'ROLE_PASEADOR' }));

        renderWithRouter(<Header />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('http://localhost:8080/user/1/foto-perfil'),
                expect.any(Object)
            );
        });
    });

    test('maneja error al cargar foto de perfil', async () => {
        // Mock de console.error para evitar logs en tests
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        axios.get.mockRejectedValueOnce(new Error('Network Error'));

        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Paseador', rol: 'ROLE_PASEADOR' }));

        renderWithRouter(<Header />);

        await waitFor(() => {
            // Debe mostrar el icono de fallback cuando falla la carga
            expect(screen.getByTestId('user-icon')).toBeInTheDocument();
        }, { timeout: 3000 });

        consoleErrorSpy.mockRestore();
    });

    test('escucha evento "user-updated" y actualiza el usuario', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test', rol: 'ROLE_CLIENTE' }));

        renderWithRouter(<Header />);

        // Disparar evento personalizado
        const updatedUser = { id: 1, nombre: 'Test Updated', rol: 'ROLE_CLIENTE' };
        const event = new CustomEvent('user-updated', { detail: { user: updatedUser } });
        window.dispatchEvent(event);

        await waitFor(() => {
            // El componente debería re-renderizar con los datos actualizados
            expect(axios.get).toHaveBeenCalled();
        });
    });

    test('escucha evento "avatar-changed" y recarga la foto', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test Paseador', rol: 'ROLE_PASEADOR' }));

        renderWithRouter(<Header />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        jest.clearAllMocks();

        // Disparar evento de cambio de avatar
        const event = new CustomEvent('avatar-changed', { detail: { userId: 1 } });
        window.dispatchEvent(event);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('http://localhost:8080/user/1/foto-perfil'),
                expect.any(Object)
            );
        });
    });

    test('escucha evento "storage" y actualiza el estado de login', async () => {
        const { rerender } = renderWithRouter(<Header />);

        // Simular cambio en localStorage desde otra pestaña
        localStorage.setItem('token', 'new-token');
        localStorage.setItem('user', JSON.stringify({ id: 2, nombre: 'New User', rol: 'ROLE_CLIENTE' }));

        const storageEvent = new Event('storage');
        window.dispatchEvent(storageEvent);

        // Re-renderizar para aplicar cambios
        rerender(<BrowserRouter><Header /></BrowserRouter>);

        // El componente debería detectar el cambio
        await waitFor(() => {
            expect(screen.getByText(/cerrar sesión/i)).toBeInTheDocument();
        });
    });
});