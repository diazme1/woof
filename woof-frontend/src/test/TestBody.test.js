import { render, screen } from '@testing-library/react'
import Body from '../components/Body/Body'


describe('Body component', () => {

    test('El texto del body se encuentra en el documento', () => {
        render(<Body />);
        const article = screen.getByText(/Somos un equipo de amantes de los animales/i);
        expect(article).toBeInTheDocument();
    });

    test('Renderiza el objetivo del equipo', () => {
        render(<Body />);
        expect(screen.getByText(/comodidad para el dueño/i)).toBeInTheDocument();
    });

    test('Renderiza el Swiper', () => {
        render(<Body />);
        expect(screen.getByTestId('mock-swiper')).toBeInTheDocument();
    });

    test('Renderiza 9 imágenes de perritos', () => {
        render(<Body />);
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(9);
    });

    test('Todas las imágenes tienen texto alternativo', () => {
        render(<Body />);
        const images = screen.getAllByRole('img');
        images.forEach(img => {
            expect(img).toHaveAttribute('alt');
            expect(img.getAttribute('alt')).not.toBe('');
        });
    });

    test('La primera imagen tiene alt correcto', () => {
        render(<Body />);
        expect(screen.getByAltText('Perrito 3')).toBeInTheDocument();
    });

    test('Cada imagen tiene la clase slideImage', () => {
        render(<Body />);
        const images = screen.getAllByRole('img');
        images.forEach(img => {
            expect(img).toHaveClass('slideImage');
        });
    });

    test('El texto principal tiene la clase fadeIn', () => {
        render(<Body />);
        const div = screen.getByText(/Somos un equipo/i).parentElement;
        expect(div).toHaveClass('fadeIn');
    });

    test('El contenedor principal es un <main>', () => {
        const { container } = render(<Body />);
        const main = container.querySelector('main');
        expect(main).toBeInTheDocument();
    });

});