import { render, screen } from '@testing-library/react'
import Footer from '../components/Footer/Footer'

    test('Renderiza el logo con alt correcto', () => {
        render(<Footer />);
        const logo = screen.getByAltText(/logo/i);
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', '/logo_circular.png');
    });

    test('Muestra el texto de copyright', () => {
        render(<Footer />);
        expect(screen.getByText(/© Global Pro Care Inc./i)).toBeInTheDocument();
    });

    test('Renderiza los links de navegación', () => {
        render(<Footer />);
        expect(screen.getByRole('link', { name: /Contacto/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Política de Privacidad/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Términos y Condiciones/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Woof.com en Otros Países/i })).toBeInTheDocument();
    });

    test('Renderiza 6 íconos de redes sociales', () => {
        render(<Footer />);
        const icons = screen.getAllByRole('link', { hidden: true });
        // Se esperan 10 links: 4 de navegación + 6 de redes
        expect(icons).toHaveLength(10);
    });

    test('El componente se renderiza dentro de <footer>', () => {
        const { container } = render(<Footer />);
        expect(container.querySelector('footer')).toBeInTheDocument();
    });




