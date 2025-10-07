import { render, screen } from '@testing-library/react';
import Body from '../components/Body/Body';

// Mock de Swiper ya que es un componente externo
jest.mock('swiper/react', () => ({
    Swiper: ({ children }) => <div data-testid="swiper">{children}</div>,
    SwiperSlide: ({ children }) => <div data-testid="swiper-slide">{children}</div>
}));

jest.mock('swiper/modules', () => ({
    Navigation: jest.fn(),
    Pagination: jest.fn()
}));

describe('Body component', () => {
    test('Verifica estructura principal y estilos', () => {
        render(<Body />);
        const main = screen.getByRole('main');

        expect(main).toHaveStyle({
            maxWidth: "1000px",
            margin: "50px auto",
            padding: "0 20px",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.6,
            color: "#333"
        });
    });

    test('Verifica textos de introducción', () => {
        render(<Body />);
        expect(screen.getByText(/Somos un equipo de amantes de los animales/i)).toBeInTheDocument();
        expect(screen.getByText(/¿Nuestro objetivo\? Comodidad para el dueño y felicidad para la mascota/i)).toBeInTheDocument();
    });

    test('Verifica carrusel de imágenes', () => {
        render(<Body />);
        const slides = screen.getAllByTestId('swiper-slide');
        expect(slides).toHaveLength(9);

        const images = screen.getAllByRole('img');
        const expectedImages = [
            'perrito3.jpg',
            'perrito2.jpg',
            'perrito1.jpg',
            'perrito4.jpg',
            'perrito5.jpg',
            'perrito6.jpg',
            'perrito8.jpg',
            'perrito7.jpg',
            'perrito9.jpg'
        ];

        images.slice(0, 9).forEach((img, index) => {
            expect(img).toHaveAttribute('src', `/${expectedImages[index]}`);
            expect(img).toHaveClass('slideImage');
        });
    });

    test('Verifica sección "Cómo funciona"', () => {
        render(<Body />);
        expect(screen.getByText('¿Cómo funciona Woof?')).toBeInTheDocument();

        const steps = [
            '1. Registrate🔑',
            '2. Solicitá un paseo📅',
            '3. Esperá la aceptación⏳',
            '4. A disfrutar el paseo!🐾'
        ];

        steps.forEach(step => {
            expect(screen.getByText(step)).toBeInTheDocument();
        });
    });

    test('Verifica sección "Por qué elegirnos"', () => {
        render(<Body />);
        expect(screen.getByText('¿Por qué elegirnos?')).toBeInTheDocument();
        expect(
            screen.getByText(/Verificación de paseadores y comunicación transparente en cada paseo/i)
        ).toBeInTheDocument();

        const diferenciales = [
            'Seguridad verificada',
            'Calidad del servicio',
            'Transparencia total',
            'Calidad con feedback',
            'Pagos protegidos',
            'Soporte claro 24/7'
        ];

        diferenciales.forEach(diferencial => {
            expect(screen.getByText(new RegExp(diferencial))).toBeInTheDocument();
        });
    });

    test('Verifica imagen de "Por qué elegirnos"', () => {
        render(<Body />);
        const img = screen.getByAltText('Perrito con computadora');
        expect(img).toHaveAttribute('src', '/perritoPorQueElegirnos.png');
        expect(img).toHaveClass('sectionImage');
    });
});
