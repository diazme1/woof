import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ClientForm from '../components/ClientForm/ClientForm';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('axios');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ClientForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado inicial', () => {
    test('renderiza el formulario de cliente correctamente', () => {
      renderWithRouter(<ClientForm />);
      expect(screen.getByText(/formulario de registro/i)).toBeInTheDocument();
    });

    test('muestra todos los campos del formulario', () => {
      renderWithRouter(<ClientForm />);
      expect(screen.getByLabelText(/nombre completo:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/número de documento:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/teléfono:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/dirección:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/rol:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña:/i)).toBeInTheDocument();
    });

    test('muestra el botón de guardar', () => {
      renderWithRouter(<ClientForm />);
      expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
    });

    test('muestra el botón de mostrar/ocultar contraseña', () => {
      renderWithRouter(<ClientForm />);
      const toggleButton = screen.getByLabelText(/mostrar contraseña/i);
      expect(toggleButton).toBeInTheDocument();
    });

    test('muestra el select de rol con las opciones correctas', () => {
      renderWithRouter(<ClientForm />);
      const selectRol = screen.getByLabelText(/rol:/i);
      expect(selectRol).toBeInTheDocument();
      expect(screen.getByText(/seleccioná una opción/i)).toBeInTheDocument();
      expect(screen.getByText(/paseador/i)).toBeInTheDocument();
      expect(screen.getByText(/cliente/i)).toBeInTheDocument();
    });
  });

  describe('Interacción con campos', () => {
    test('permite ingresar texto en el campo nombre completo', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/nombre completo:/i);
      await user.type(input, 'Juan Pérez');
      expect(input).toHaveValue('Juan Pérez');
    });

    test('permite ingresar números en el campo DNI', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/número de documento:/i);
      await user.type(input, '12345678');
      expect(input).toHaveValue('12345678');
    });

    test('permite ingresar email en el campo email', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/email:/i);
      await user.type(input, 'test@example.com');
      expect(input).toHaveValue('test@example.com');
    });

    test('solo permite números en el campo teléfono', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/teléfono:/i);
      await user.type(input, '1234567890abc');
      expect(input).toHaveValue('1234567890');
    });

    test('permite ingresar dirección', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/dirección:/i);
      await user.type(input, 'Calle Falsa 123');
      expect(input).toHaveValue('Calle Falsa 123');
    });

    test('permite ingresar contraseña', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/contraseña:/i);
      await user.type(input, 'Password123!');
      expect(input).toHaveValue('Password123!');
    });

    test('permite seleccionar un rol', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const select = screen.getByLabelText(/rol:/i);
      await user.selectOptions(select, 'ROLE_CLIENTE');
      expect(select).toHaveValue('ROLE_CLIENTE');
    });
  });

  describe('Funcionalidad de mostrar/ocultar contraseña', () => {
    test('alterna la visibilidad de la contraseña al hacer click', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const passwordInput = screen.getByLabelText(/contraseña:/i);
      const toggleButton = screen.getByLabelText(/mostrar contraseña/i);

      expect(passwordInput).toHaveAttribute('type', 'password');

      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('cambia el aria-label del botón al alternar visibilidad', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const toggleButton = screen.getByLabelText(/mostrar contraseña/i);

      await user.click(toggleButton);
      expect(screen.getByLabelText(/ocultar contraseña/i)).toBeInTheDocument();
    });
  });

  describe('Validaciones del formulario', () => {
    test('muestra error cuando el nombre completo está vacío', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/nombre completo:/i);

      await user.click(input);
      await user.tab();

      expect(await screen.findByText(/ingresá tu nombre completo/i)).toBeInTheDocument();
    });

    test('muestra error cuando el DNI está vacío', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/número de documento:/i);

      await user.click(input);
      await user.tab();

      expect(await screen.findByText(/ingresá tu número de documento/i)).toBeInTheDocument();
    });

    test('muestra error cuando el DNI contiene caracteres no numéricos', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/número de documento:/i);

      await user.type(input, 'abc123');
      await user.tab();

      expect(await screen.findByText(/el dni solo puede contener números/i)).toBeInTheDocument();
    });

    test('muestra error cuando el DNI tiene menos de 7 dígitos', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/número de documento:/i);

      await user.type(input, '123456');
      await user.tab();

      expect(await screen.findByText(/el dni debe tener 7 u 8 dígitos/i)).toBeInTheDocument();
    });

    test('muestra error cuando el DNI tiene más de 8 dígitos', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/número de documento:/i);

      await user.type(input, '123456789');
      await user.tab();

      expect(await screen.findByText(/el dni debe tener 7 u 8 dígitos/i)).toBeInTheDocument();
    });

    test('muestra error cuando el email está vacío', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/email:/i);

      await user.click(input);
      await user.tab();

      expect(await screen.findByText(/ingresá tu email/i)).toBeInTheDocument();
    });

    test('muestra error cuando el email es inválido', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/email:/i);

      await user.type(input, 'email-invalido');
      await user.tab();

      expect(await screen.findByText(/email inválido/i)).toBeInTheDocument();
    });

    test('muestra error cuando el teléfono está vacío', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/teléfono:/i);

      await user.click(input);
      await user.tab();

      expect(await screen.findByText(/ingresá tu teléfono/i)).toBeInTheDocument();
    });

    test('muestra error cuando el teléfono tiene menos de 8 dígitos', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/teléfono:/i);

      await user.type(input, '1234567');
      await user.tab();

      expect(await screen.findByText(/solo dígitos \(8–15\)/i)).toBeInTheDocument();
    });

    test('muestra error cuando el teléfono tiene más de 15 dígitos', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/teléfono:/i);

      await user.type(input, '1234567890123456');
      await user.tab();

      expect(await screen.findByText(/solo dígitos \(8–15\)/i)).toBeInTheDocument();
    });

    test('muestra error cuando la dirección está vacía', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/dirección:/i);

      await user.click(input);
      await user.tab();

      expect(await screen.findByText(/ingresá tu dirección/i)).toBeInTheDocument();
    });

    test('muestra error cuando la contraseña está vacía', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/contraseña:/i);

      await user.click(input);
      await user.tab();

      expect(await screen.findByText(/ingresá una contraseña/i)).toBeInTheDocument();
    });

    test('muestra error cuando la contraseña no cumple los requisitos', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/contraseña:/i);

      await user.type(input, 'password');
      await user.tab();

      expect(await screen.findByText(/la contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument();
    });

    test('muestra error cuando no se selecciona un rol', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const submitButton = screen.getByRole('button', { name: /guardar/i });

      await user.click(submitButton);

      expect(await screen.findByText(/seleccioná un rol/i)).toBeInTheDocument();
    });

    test('acepta un DNI válido de 7 dígitos', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/número de documento:/i);

      await user.type(input, '1234567');
      await user.tab();

      expect(screen.queryByText(/el dni debe tener 7 u 8 dígitos/i)).not.toBeInTheDocument();
    });

    test('acepta un DNI válido de 8 dígitos', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/número de documento:/i);

      await user.type(input, '12345678');
      await user.tab();

      expect(screen.queryByText(/el dni debe tener 7 u 8 dígitos/i)).not.toBeInTheDocument();
    });

    test('acepta un email válido', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/email:/i);

      await user.type(input, 'test@example.com');
      await user.tab();

      expect(screen.queryByText(/email inválido/i)).not.toBeInTheDocument();
    });

    test('acepta una contraseña válida', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const input = screen.getByLabelText(/contraseña:/i);

      await user.type(input, 'Password123!');
      await user.tab();

      expect(screen.queryByText(/la contraseña debe tener al menos 8 caracteres/i)).not.toBeInTheDocument();
    });
  });

  describe('Envío del formulario', () => {
    test('no envía el formulario cuando hay errores de validación', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);
      const submitButton = screen.getByRole('button', { name: /guardar/i });

      await user.click(submitButton);

      expect(axios.post).not.toHaveBeenCalled();
    });

    test('envía el formulario correctamente cuando todos los campos son válidos', async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValue({ data: { id: 1, message: 'Usuario creado' } });

      renderWithRouter(<ClientForm />);

      await user.type(screen.getByLabelText(/nombre completo:/i), 'Juan Pérez');
      await user.type(screen.getByLabelText(/número de documento:/i), '12345678');
      await user.type(screen.getByLabelText(/email:/i), 'juan@example.com');
      await user.type(screen.getByLabelText(/teléfono:/i), '1234567890');
      await user.type(screen.getByLabelText(/dirección:/i), 'Calle Falsa 123');
      await user.selectOptions(screen.getByLabelText(/rol:/i), 'ROLE_CLIENTE');
      await user.type(screen.getByLabelText(/contraseña:/i), 'Password123!');

      await user.click(screen.getByRole('button', { name: /guardar/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:8080/user',
          {
            nombre: 'Juan Pérez',
            dni: '12345678',
            email: 'juan@example.com',
            telefono: '1234567890',
            direccion: 'Calle Falsa 123',
            contrasena: 'Password123!',
            rol: 'ROLE_CLIENTE'
          }
        );
      });
    });

    test('muestra el modal de éxito después de enviar el formulario correctamente', async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValue({ data: { id: 1, message: 'Usuario creado' } });

      renderWithRouter(<ClientForm />);

      await user.type(screen.getByLabelText(/nombre completo:/i), 'Juan Pérez');
      await user.type(screen.getByLabelText(/número de documento:/i), '12345678');
      await user.type(screen.getByLabelText(/email:/i), 'juan@example.com');
      await user.type(screen.getByLabelText(/teléfono:/i), '1234567890');
      await user.type(screen.getByLabelText(/dirección:/i), 'Calle Falsa 123');
      await user.selectOptions(screen.getByLabelText(/rol:/i), 'ROLE_CLIENTE');
      await user.type(screen.getByLabelText(/contraseña:/i), 'Password123!');

      await user.click(screen.getByRole('button', { name: /guardar/i }));

      expect(await screen.findByText(/¡registro realizado con exito!/i)).toBeInTheDocument();
      expect(screen.getByText(/los datos se enviaron correctamente/i)).toBeInTheDocument();
    });

    test('resetea el formulario después del envío exitoso', async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValue({ data: { id: 1, message: 'Usuario creado' } });

      renderWithRouter(<ClientForm />);

      const nombreInput = screen.getByLabelText(/nombre completo:/i);
      const dniInput = screen.getByLabelText(/número de documento:/i);
      const emailInput = screen.getByLabelText(/email:/i);

      await user.type(nombreInput, 'Juan Pérez');
      await user.type(dniInput, '12345678');
      await user.type(emailInput, 'juan@example.com');
      await user.type(screen.getByLabelText(/teléfono:/i), '1234567890');
      await user.type(screen.getByLabelText(/dirección:/i), 'Calle Falsa 123');
      await user.selectOptions(screen.getByLabelText(/rol:/i), 'ROLE_CLIENTE');
      await user.type(screen.getByLabelText(/contraseña:/i), 'Password123!');

      await user.click(screen.getByRole('button', { name: /guardar/i }));

      await waitFor(() => {
        expect(nombreInput).toHaveValue('');
        expect(dniInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
      });
    });

    test('maneja errores del servidor al enviar el formulario', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

      axios.post.mockRejectedValue(new Error('Error del servidor'));

      renderWithRouter(<ClientForm />);

      await user.type(screen.getByLabelText(/nombre completo:/i), 'Juan Pérez');
      await user.type(screen.getByLabelText(/número de documento:/i), '12345678');
      await user.type(screen.getByLabelText(/email:/i), 'juan@example.com');
      await user.type(screen.getByLabelText(/teléfono:/i), '1234567890');
      await user.type(screen.getByLabelText(/dirección:/i), 'Calle Falsa 123');
      await user.selectOptions(screen.getByLabelText(/rol:/i), 'ROLE_CLIENTE');
      await user.type(screen.getByLabelText(/contraseña:/i), 'Password123!');

      await user.click(screen.getByRole('button', { name: /guardar/i }));

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Hubo un problema al registrar el cliente. Intenta nuevamente.');
      });

      consoleSpy.mockRestore();
      alertSpy.mockRestore();
    });
  });

  describe('Modal de éxito', () => {
    test('cierra el modal al hacer click en el botón cerrar', async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValue({ data: { id: 1, message: 'Usuario creado' } });

      renderWithRouter(<ClientForm />);

      await user.type(screen.getByLabelText(/nombre completo:/i), 'Juan Pérez');
      await user.type(screen.getByLabelText(/número de documento:/i), '12345678');
      await user.type(screen.getByLabelText(/email:/i), 'juan@example.com');
      await user.type(screen.getByLabelText(/teléfono:/i), '1234567890');
      await user.type(screen.getByLabelText(/dirección:/i), 'Calle Falsa 123');
      await user.selectOptions(screen.getByLabelText(/rol:/i), 'ROLE_CLIENTE');
      await user.type(screen.getByLabelText(/contraseña:/i), 'Password123!');

      await user.click(screen.getByRole('button', { name: /guardar/i }));

      const modalCloseButton = await screen.findByRole('button', { name: /cerrar/i });
      await user.click(modalCloseButton);

      await waitFor(() => {
        expect(screen.queryByText(/¡registro realizado con exito!/i)).not.toBeInTheDocument();
      });
    });

    test('cierra el modal al hacer click en el overlay', async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValue({ data: { id: 1, message: 'Usuario creado' } });

      renderWithRouter(<ClientForm />);

      await user.type(screen.getByLabelText(/nombre completo:/i), 'Juan Pérez');
      await user.type(screen.getByLabelText(/número de documento:/i), '12345678');
      await user.type(screen.getByLabelText(/email:/i), 'juan@example.com');
      await user.type(screen.getByLabelText(/teléfono:/i), '1234567890');
      await user.type(screen.getByLabelText(/dirección:/i), 'Calle Falsa 123');
      await user.selectOptions(screen.getByLabelText(/rol:/i), 'ROLE_CLIENTE');
      await user.type(screen.getByLabelText(/contraseña:/i), 'Password123!');

      await user.click(screen.getByRole('button', { name: /guardar/i }));

      await screen.findByText(/¡registro realizado con exito!/i);

      const overlay = screen.getByRole('presentation');
      await user.click(overlay);

      await waitFor(() => {
        expect(screen.queryByText(/¡registro realizado con exito!/i)).not.toBeInTheDocument();
      });
    });

    test('cierra el modal al presionar la tecla Escape', async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValue({ data: { id: 1, message: 'Usuario creado' } });

      renderWithRouter(<ClientForm />);

      await user.type(screen.getByLabelText(/nombre completo:/i), 'Juan Pérez');
      await user.type(screen.getByLabelText(/número de documento:/i), '12345678');
      await user.type(screen.getByLabelText(/email:/i), 'juan@example.com');
      await user.type(screen.getByLabelText(/teléfono:/i), '1234567890');
      await user.type(screen.getByLabelText(/dirección:/i), 'Calle Falsa 123');
      await user.selectOptions(screen.getByLabelText(/rol:/i), 'ROLE_CLIENTE');
      await user.type(screen.getByLabelText(/contraseña:/i), 'Password123!');

      await user.click(screen.getByRole('button', { name: /guardar/i }));

      await screen.findByText(/¡registro realizado con exito!/i);

      fireEvent.keyDown(window, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByText(/¡registro realizado con exito!/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Validación en tiempo real', () => {
    test('muestra errores solo después de tocar el campo', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);

      const nombreInput = screen.getByLabelText(/nombre completo:/i);

      expect(screen.queryByText(/ingresá tu nombre completo/i)).not.toBeInTheDocument();

      await user.click(nombreInput);
      await user.tab();

      expect(await screen.findByText(/ingresá tu nombre completo/i)).toBeInTheDocument();
    });

    test('actualiza errores mientras el usuario escribe después de tocar el campo', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ClientForm />);

      const emailInput = screen.getByLabelText(/email:/i);

      await user.type(emailInput, 'invalido');
      await user.tab();

      expect(await screen.findByText(/email inválido/i)).toBeInTheDocument();

      await user.type(emailInput, '@example.com');

      await waitFor(() => {
        expect(screen.queryByText(/email inválido/i)).not.toBeInTheDocument();
      });
    });
  });
});
