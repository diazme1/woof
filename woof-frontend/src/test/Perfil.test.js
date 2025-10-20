import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Perfil from '../components/Perfil/Perfil';

jest.mock('axios');

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({ paramUserId: "1" }),
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Perfil Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Mock de localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'user') {
        return JSON.stringify({ id: 1, nombre: "Test User", alias: "testuser" });
      }
      return null;
    });
    Storage.prototype.setItem = jest.fn();

    // Mock base de axios
    axios.get.mockImplementation((url) => {
        if (url.includes("/paseo/solicitudes/")) return Promise.resolve({ data: 5 });
        if (url.includes("/user/1/antiguedad")) return Promise.resolve({ data: "1 año" });
        if (url.includes("/user/1")) return Promise.resolve({
            data: {
                id: 1,
                nombre: "Test User",
                biografia: "Hola soy un paseador!",
                alias: "usuario1",
                telefono: "1234567890",
                direccion: "Calle Falsa 123",
                fotoPerfilUrl: null
            }
        });
        if (url.includes("/resenia/paseador/")) return Promise.resolve({ data: [] });
        if (url.includes("/resenia/cliente/")) return Promise.resolve({
          data: { nombre: "Cliente Test", email: "cliente@test.com" }
        });
        return Promise.resolve({ data: null });
    });

    axios.put.mockResolvedValue({ data: { id: 1, nombre: "Updated Name" } });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    localStorage.clear();
  });

  describe('Renderizado básico', () => {
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

    test('muestra "Cargando..." mientras se obtienen los datos', () => {
      renderWithRouter(<Perfil />);
      expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    });
  });

  describe('Carga de datos del usuario', () => {
    test('carga los datos del usuario desde la API', async () => {
      renderWithRouter(<Perfil />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user/1'));
      });
    });

    test('muestra la biografía del usuario', async () => {
      renderWithRouter(<Perfil />);
      expect(await screen.findByText(/hola soy un paseador/i)).toBeInTheDocument();
    });

    test('muestra el teléfono del usuario', async () => {
      renderWithRouter(<Perfil />);
      expect(await screen.findByText(/1234567890/i)).toBeInTheDocument();
    });

    test('muestra la dirección del usuario', async () => {
      renderWithRouter(<Perfil />);
      expect(await screen.findByText(/calle falsa 123/i)).toBeInTheDocument();
    });
  });

  describe('Estadísticas del usuario', () => {
    test('carga y muestra la cantidad de paseos', async () => {
      renderWithRouter(<Perfil />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/paseo/solicitudes/1'));
      });

      expect(await screen.findByText('5')).toBeInTheDocument();
    });

    test('carga y muestra la antigüedad', async () => {
      renderWithRouter(<Perfil />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user/1/antiguedad'));
      });

      expect(await screen.findByText(/1 año/i)).toBeInTheDocument();
    });

    test('maneja errores al cargar paseos', async () => {
      axios.get.mockImplementation((url) => {
        if (url.includes('/paseo/solicitudes/')) return Promise.reject(new Error('Error'));
        if (url.includes('/user/1/antiguedad')) return Promise.resolve({ data: "1 año" });
        if (url.includes('/user/1')) return Promise.resolve({
          data: { id: 1, nombre: "Test User", biografia: "Bio", alias: "test" }
        });
        if (url.includes('/resenia/paseador/')) return Promise.resolve({ data: [] });
        return Promise.resolve({ data: null });
      });

      renderWithRouter(<Perfil />);

      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });

    test('maneja errores al cargar antigüedad', async () => {
      axios.get.mockImplementation((url) => {
        if (url.includes('/paseo/solicitudes/')) return Promise.resolve({ data: 5 });
        if (url.includes('/user/1/antiguedad')) return Promise.reject(new Error('Error'));
        if (url.includes('/user/1')) return Promise.resolve({
          data: { id: 1, nombre: "Test User", biografia: "Bio", alias: "test" }
        });
        if (url.includes('/resenia/paseador/')) return Promise.resolve({ data: [] });
        return Promise.resolve({ data: null });
      });

      renderWithRouter(<Perfil />);

      await waitFor(() => {
        expect(screen.getByText(/0 días y 0 meses/i)).toBeInTheDocument();
      });
    });
  });

  describe('Reseñas', () => {
    test('muestra mensaje cuando no hay reseñas', async () => {
      renderWithRouter(<Perfil />);
      expect(await screen.findByText(/este paseador aún no posee reseñas/i)).toBeInTheDocument();
    });

    test('carga y muestra reseñas con información del cliente', async () => {
      axios.get.mockImplementation((url) => {
        if (url.includes('/paseo/solicitudes/')) return Promise.resolve({ data: 5 });
        if (url.includes('/user/1/antiguedad')) return Promise.resolve({ data: "1 año" });
        if (url.includes('/user/1')) return Promise.resolve({
          data: { id: 1, nombre: "Test User", biografia: "Bio", alias: "test" }
        });
        if (url.includes('/resenia/paseador/1')) return Promise.resolve({
          data: [
            { id: 1, idCliente: 2, puntuacion: 5, descripcion: "Excelente servicio!" }
          ]
        });
        if (url.includes('/resenia/cliente/2')) return Promise.resolve({
          data: { nombre: "Juan Pérez", email: "juan@test.com" }
        });
        return Promise.resolve({ data: null });
      });

      renderWithRouter(<Perfil />);

      expect(await screen.findByText(/excelente servicio/i)).toBeInTheDocument();
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument();
      expect(screen.getByText(/juan@test.com/i)).toBeInTheDocument();
      expect(screen.getByText(/5 ⭐/i)).toBeInTheDocument();
    });

    test('maneja errores al cargar reseñas', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      axios.get.mockImplementation((url) => {
        if (url.includes('/paseo/solicitudes/')) return Promise.resolve({ data: 5 });
        if (url.includes('/user/1/antiguedad')) return Promise.resolve({ data: "1 año" });
        if (url.includes('/user/1')) return Promise.resolve({
          data: { id: 1, nombre: "Test User", biografia: "Bio", alias: "test" }
        });
        if (url.includes('/resenia/paseador/')) return Promise.reject(new Error('Error al cargar'));
        return Promise.resolve({ data: null });
      });

      renderWithRouter(<Perfil />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error al obtener reseñas:', expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Modo de edición - Perfil propio', () => {
    test('muestra el botón "Editar perfil" en el perfil propio', async () => {
      renderWithRouter(<Perfil />);
      expect(await screen.findByText(/editar perfil/i)).toBeInTheDocument();
    });

    test('entra en modo de edición al hacer click en "Editar perfil"', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      expect(screen.getByPlaceholderText(/nombre completo/i)).toBeInTheDocument();
      expect(screen.getByText(/guardar/i)).toBeInTheDocument();
      expect(screen.getByText(/cancelar/i)).toBeInTheDocument();
    });

    test('muestra todos los campos de edición en modo edición', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      expect(screen.getByPlaceholderText(/nombre completo/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/contales sobre vos/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/\+54911/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/calle 123/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/mi.alias.banco/i)).toBeInTheDocument();
    });

    test('cancela el modo de edición', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const cancelButton = screen.getByText(/cancelar/i);
      await user.click(cancelButton);

      expect(screen.queryByPlaceholderText(/nombre completo/i)).not.toBeInTheDocument();
      expect(await screen.findByText(/editar perfil/i)).toBeInTheDocument();
    });

    test('permite cambiar el nombre', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const nombreInput = screen.getByPlaceholderText(/nombre completo/i);
      await user.clear(nombreInput);
      await user.type(nombreInput, 'Nuevo Nombre');

      expect(nombreInput).toHaveValue('Nuevo Nombre');
    });

    test('permite cambiar la biografía', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const bioTextarea = screen.getByPlaceholderText(/contales sobre vos/i);
      await user.clear(bioTextarea);
      await user.type(bioTextarea, 'Nueva biografía');

      expect(bioTextarea).toHaveValue('Nueva biografía');
    });

    test('permite cambiar el teléfono', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const telefonoInput = screen.getByPlaceholderText(/\+54911/i);
      await user.clear(telefonoInput);
      await user.type(telefonoInput, '+5491155667788');

      expect(telefonoInput).toHaveValue('+5491155667788');
    });

    test('permite cambiar la dirección', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const direccionInput = screen.getByPlaceholderText(/calle 123/i);
      await user.clear(direccionInput);
      await user.type(direccionInput, 'Avenida Siempreviva 742');

      expect(direccionInput).toHaveValue('Avenida Siempreviva 742');
    });

    test('permite cambiar el alias', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const aliasInput = screen.getByPlaceholderText(/mi.alias.banco/i);
      await user.clear(aliasInput);
      await user.type(aliasInput, 'nuevo.alias');

      expect(aliasInput).toHaveValue('nuevo.alias');
    });
  });

  describe('Validaciones del formulario', () => {
    test('muestra error cuando el nombre está vacío', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const nombreInput = screen.getByPlaceholderText(/nombre completo/i);
      await user.clear(nombreInput);

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      expect(await screen.findByText(/nombre completo obligatorio/i)).toBeInTheDocument();
    });

    test('muestra error cuando el alias es inválido (muy corto)', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const aliasInput = screen.getByPlaceholderText(/mi.alias.banco/i);
      await user.clear(aliasInput);
      await user.type(aliasInput, 'abc');

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      expect(await screen.findByText(/alias inválido/i)).toBeInTheDocument();
    });

    test('muestra error cuando el alias es inválido (caracteres especiales)', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const aliasInput = screen.getByPlaceholderText(/mi.alias.banco/i);
      await user.clear(aliasInput);
      await user.type(aliasInput, 'alias@invalido');

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      expect(await screen.findByText(/alias inválido/i)).toBeInTheDocument();
    });

    test('muestra error cuando el teléfono es inválido', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const telefonoInput = screen.getByPlaceholderText(/\+54911/i);
      await user.clear(telefonoInput);
      await user.type(telefonoInput, '123');

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      expect(await screen.findByText(/teléfono inválido/i)).toBeInTheDocument();
    });

    test('muestra error cuando la dirección es muy larga', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const direccionInput = screen.getByPlaceholderText(/calle 123/i);
      await user.clear(direccionInput);
      await user.type(direccionInput, 'a'.repeat(256));

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      expect(await screen.findByText(/dirección demasiado larga/i)).toBeInTheDocument();
    });

    test('muestra error cuando la biografía es muy larga', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const bioTextarea = screen.getByPlaceholderText(/contales sobre vos/i);
      await user.clear(bioTextarea);
      await user.type(bioTextarea, 'a'.repeat(501));

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      expect(await screen.findByText(/biografía demasiado larga/i)).toBeInTheDocument();
    });
  });

  describe('Guardado de cambios', () => {
    test('guarda los cambios correctamente', async () => {
      const user = userEvent.setup({ delay: null });
      axios.put.mockResolvedValue({
        data: { id: 1, nombre: "Nuevo Nombre", alias: "nuevo.alias" }
      });

      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const nombreInput = screen.getByPlaceholderText(/nombre completo/i);
      await user.clear(nombreInput);
      await user.type(nombreInput, 'Nuevo Nombre');

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          expect.stringContaining('/user/1'),
          expect.objectContaining({ nombre: 'Nuevo Nombre' })
        );
      });
    });

    test('no hace petición si no hay cambios', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      await waitFor(() => {
        expect(axios.put).not.toHaveBeenCalled();
      });
    });

    test('actualiza localStorage después de guardar', async () => {
      const user = userEvent.setup({ delay: null });
      axios.put.mockResolvedValue({
        data: { id: 1, nombre: "Nuevo Nombre", alias: "nuevo.alias" }
      });

      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const nombreInput = screen.getByPlaceholderText(/nombre completo/i);
      await user.clear(nombreInput);
      await user.type(nombreInput, 'Nuevo Nombre');

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('user', expect.any(String));
      });
    });

    test('muestra toast de éxito después de guardar', async () => {
      const user = userEvent.setup({ delay: null });
      axios.put.mockResolvedValue({
        data: { id: 1, nombre: "Nuevo Nombre" }
      });

      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const nombreInput = screen.getByPlaceholderText(/nombre completo/i);
      await user.clear(nombreInput);
      await user.type(nombreInput, 'Nuevo Nombre');

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      expect(await screen.findByText(/datos modificados con éxito/i)).toBeInTheDocument();
    });

    test('cierra el toast automáticamente después de 2.5 segundos', async () => {
      const user = userEvent.setup({ delay: null });
      axios.put.mockResolvedValue({
        data: { id: 1, nombre: "Nuevo Nombre" }
      });

      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const nombreInput = screen.getByPlaceholderText(/nombre completo/i);
      await user.clear(nombreInput);
      await user.type(nombreInput, 'Nuevo Nombre');

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      expect(await screen.findByText(/datos modificados con éxito/i)).toBeInTheDocument();

      jest.advanceTimersByTime(2500);

      await waitFor(() => {
        expect(screen.queryByText(/datos modificados con éxito/i)).not.toBeInTheDocument();
      });
    });

    test('permite cerrar el toast manualmente', async () => {
      const user = userEvent.setup({ delay: null });
      axios.put.mockResolvedValue({
        data: { id: 1, nombre: "Nuevo Nombre" }
      });

      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const nombreInput = screen.getByPlaceholderText(/nombre completo/i);
      await user.clear(nombreInput);
      await user.type(nombreInput, 'Nuevo Nombre');

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      const toast = await screen.findByText(/datos modificados con éxito/i);
      expect(toast).toBeInTheDocument();

      const closeButton = screen.getByLabelText(/cerrar notificación/i);
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText(/datos modificados con éxito/i)).not.toBeInTheDocument();
      });
    });

    test('maneja errores al guardar', async () => {
      const user = userEvent.setup({ delay: null });
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

      axios.put.mockRejectedValue(new Error('Error del servidor'));

      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const nombreInput = screen.getByPlaceholderText(/nombre completo/i);
      await user.clear(nombreInput);
      await user.type(nombreInput, 'Nuevo Nombre');

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('No se pudo guardar. Intentá nuevamente.');
      });

      alertSpy.mockRestore();
    });

    test('maneja errores de validación del servidor', async () => {
      const user = userEvent.setup({ delay: null });

      axios.put.mockRejectedValue({
        response: {
          data: {
            errors: { nombre: 'Nombre ya existe' }
          }
        }
      });

      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const nombreInput = screen.getByPlaceholderText(/nombre completo/i);
      await user.clear(nombreInput);
      await user.type(nombreInput, 'Nuevo Nombre');

      const saveButton = screen.getByText(/guardar/i);
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/nombre ya existe/i)).toBeInTheDocument();
      });
    });
  });

  describe('Subida de foto de perfil', () => {
    test('muestra botón para cambiar foto en modo edición', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      expect(screen.getByText(/cambiar foto/i)).toBeInTheDocument();
    });
  });

  describe('Función toImageSrc', () => {
    test('convierte rutas de Windows correctamente', async () => {
      axios.get.mockImplementation((url) => {
        if (url.includes('/user/1')) return Promise.resolve({
          data: {
            id: 1,
            nombre: "Test User",
            fotoPerfilUrl: "C:\\uploads\\foto.jpg"
          }
        });
        if (url.includes('/paseo/solicitudes/')) return Promise.resolve({ data: 5 });
        if (url.includes('/user/1/antiguedad')) return Promise.resolve({ data: "1 año" });
        if (url.includes('/resenia/paseador/')) return Promise.resolve({ data: [] });
        return Promise.resolve({ data: null });
      });

      renderWithRouter(<Perfil />);

      await waitFor(() => {
        const img = screen.getByAltText('avatar');
        expect(img.src).toContain('/user/1/foto-perfil');
      });
    });

    test('convierte rutas absolutas correctamente', async () => {
      axios.get.mockImplementation((url) => {
        if (url.includes('/user/1')) return Promise.resolve({
          data: {
            id: 1,
            nombre: "Test User",
            fotoPerfilUrl: "/uploads/foto.jpg"
          }
        });
        if (url.includes('/paseo/solicitudes/')) return Promise.resolve({ data: 5 });
        if (url.includes('/user/1/antiguedad')) return Promise.resolve({ data: "1 año" });
        if (url.includes('/resenia/paseador/')) return Promise.resolve({ data: [] });
        return Promise.resolve({ data: null });
      });

      renderWithRouter(<Perfil />);

      await waitFor(() => {
        const img = screen.getByAltText('avatar');
        expect(img.src).toContain('http://localhost:8080/uploads/foto.jpg');
      });
    });
  });

  describe('beforeunload listener', () => {
    test('agrega listener de beforeunload cuando hay cambios sin guardar', async () => {
      const user = userEvent.setup({ delay: null });
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      renderWithRouter(<Perfil />);

      const editButton = await screen.findByText(/editar perfil/i);
      await user.click(editButton);

      const nombreInput = screen.getByPlaceholderText(/nombre completo/i);
      await user.type(nombreInput, 'x');

      await waitFor(() => {
        expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
      });

      addEventListenerSpy.mockRestore();
    });
  });

  describe('Intervalo de actualización de reseñas', () => {
    test('actualiza reseñas cada 10 segundos', async () => {
      renderWithRouter(<Perfil />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/resenia/paseador/1'));
      });

      const initialCallCount = axios.get.mock.calls.filter(
        call => call[0].includes('/resenia/paseador/1')
      ).length;

      jest.advanceTimersByTime(10000);

      await waitFor(() => {
        const newCallCount = axios.get.mock.calls.filter(
          call => call[0].includes('/resenia/paseador/1')
        ).length;
        expect(newCallCount).toBeGreaterThan(initialCallCount);
      });
    });
  });
});

