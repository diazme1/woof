package ar.edu.unq.woof.controller.dto.resenia;

import ar.edu.unq.woof.modelo.Resenia;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ReseniaDTOTest {

    @Test
    void crearReseniaDTOConTodosLosCampos() {
        ReseniaDTO dto = new ReseniaDTO(
                1L,
                10L,
                20L,
                30L,
                "Excelente servicio, muy recomendable",
                5
        );

        assertEquals(1L, dto.id());
        assertEquals(10L, dto.idPaseador());
        assertEquals(20L, dto.idCliente());
        assertEquals(30L, dto.idPaseo());
        assertEquals("Excelente servicio, muy recomendable", dto.descripcion());
        assertEquals(5, dto.puntuacion());
    }

    @Test
    void desdeModeloConvierteReseniaADTO() {
        Resenia resenia = new Resenia(
                15L,
                25L,
                35L,
                4,
                "Buen servicio pero llegó tarde"
        );
        resenia.setId(5L);

        ReseniaDTO dto = ReseniaDTO.desdeModelo(resenia);

        assertEquals(5L, dto.id());
        assertEquals(15L, dto.idPaseador());
        assertEquals(25L, dto.idCliente());
        assertEquals(35L, dto.idPaseo());
        assertEquals("Buen servicio pero llegó tarde", dto.descripcion());
        assertEquals(4, dto.puntuacion());
    }

    @Test
    void desdeModeloConvierteTodasLasPuntuaciones() {
        Resenia resenia0 = new Resenia(10L, 20L, 30L, 0, "Muy malo");
        resenia0.setId(1L);
        ReseniaDTO dto0 = ReseniaDTO.desdeModelo(resenia0);
        assertEquals(0, dto0.puntuacion());

        Resenia resenia1 = new Resenia(10L, 20L, 30L, 1, "Malo");
        resenia1.setId(2L);
        ReseniaDTO dto1 = ReseniaDTO.desdeModelo(resenia1);
        assertEquals(1, dto1.puntuacion());

        Resenia resenia3 = new Resenia(10L, 20L, 30L, 3, "Regular");
        resenia3.setId(3L);
        ReseniaDTO dto3 = ReseniaDTO.desdeModelo(resenia3);
        assertEquals(3, dto3.puntuacion());

        Resenia resenia5 = new Resenia(10L, 20L, 30L, 5, "Excelente");
        resenia5.setId(4L);
        ReseniaDTO dto5 = ReseniaDTO.desdeModelo(resenia5);
        assertEquals(5, dto5.puntuacion());
    }

    @Test
    void dosReseniaDTOConMismosDatosSonIguales() {
        ReseniaDTO dto1 = new ReseniaDTO(
                1L, 10L, 20L, 30L, "Excelente", 5
        );
        ReseniaDTO dto2 = new ReseniaDTO(
                1L, 10L, 20L, 30L, "Excelente", 5
        );

        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }

    @Test
    void dosReseniaDTOConDiferentesDatosNoSonIguales() {
        ReseniaDTO dto1 = new ReseniaDTO(
                1L, 10L, 20L, 30L, "Excelente", 5
        );
        ReseniaDTO dto2 = new ReseniaDTO(
                2L, 10L, 20L, 30L, "Bueno", 4
        );

        assertNotEquals(dto1, dto2);
        assertNotEquals(dto1.hashCode(), dto2.hashCode());
    }

    @Test
    void reseniaDTOConDescripcionNula() {
        ReseniaDTO dto = new ReseniaDTO(
                1L, 10L, 20L, 30L, null, 3
        );

        assertNotNull(dto);
        assertNull(dto.descripcion());
        assertEquals(3, dto.puntuacion());
    }

    @Test
    void reseniaDTOConDescripcionNulaSeConvierteDesdeModelo() {
        Resenia resenia = new Resenia(10L, 20L, 30L, 3, null);
        resenia.setId(1L);

        ReseniaDTO dto = ReseniaDTO.desdeModelo(resenia);

        assertNotNull(dto);
        assertNull(dto.descripcion());
        assertEquals(3, dto.puntuacion());
    }

    @Test
    void reseniaDTOConDiferentesPuntuaciones() {
        ReseniaDTO dto0 = new ReseniaDTO(1L, 10L, 20L, 30L, "Malo", 0);
        ReseniaDTO dto5 = new ReseniaDTO(2L, 10L, 20L, 30L, "Excelente", 5);

        assertEquals(0, dto0.puntuacion());
        assertEquals(5, dto5.puntuacion());
    }

    @Test
    void reseniaDTOConDescripcionVacia() {
        ReseniaDTO dto = new ReseniaDTO(
                1L, 10L, 20L, 30L, "", 3
        );

        assertNotNull(dto);
        assertEquals("", dto.descripcion());
        assertEquals(3, dto.puntuacion());
    }

    @Test
    void reseniaDTOConDescripcionLarga() {
        String descripcionLarga = "Excelente servicio, el paseador llegó puntual, fue muy cuidadoso con mi perro, " +
                "siguió todas las indicaciones que le di, y mi perro volvió feliz y cansado. " +
                "Definitivamente lo volvería a contratar. Muy recomendable para otros dueños.";

        ReseniaDTO dto = new ReseniaDTO(
                1L, 10L, 20L, 30L, descripcionLarga, 5
        );

        assertEquals(descripcionLarga, dto.descripcion());
    }

    @Test
    void reseniaDTOConDiferentesIdsDeClienteYPaseador() {
        ReseniaDTO dto1 = new ReseniaDTO(1L, 100L, 200L, 300L, "Comentario", 4);
        ReseniaDTO dto2 = new ReseniaDTO(2L, 101L, 201L, 301L, "Comentario", 4);

        assertNotEquals(dto1.id(), dto2.id());
        assertNotEquals(dto1.idPaseador(), dto2.idPaseador());
        assertNotEquals(dto1.idCliente(), dto2.idCliente());
        assertNotEquals(dto1.idPaseo(), dto2.idPaseo());
    }

    @Test
    void toStringContieneInformacionCompleta() {
        ReseniaDTO dto = new ReseniaDTO(
                1L, 10L, 20L, 30L, "Test reseña", 5
        );

        String toString = dto.toString();

        assertTrue(toString.contains("1"));
        assertTrue(toString.contains("10"));
        assertTrue(toString.contains("20"));
        assertTrue(toString.contains("30"));
        assertTrue(toString.contains("5"));
    }

    @Test
    void desdeModeloMantieneTodosLosCampos() {
        Resenia resenia = new Resenia(
                100L,  // idPaseador
                200L,  // idCliente
                300L,  // idPaseo
                4,     // puntuacion
                "Servicio profesional y puntual"  // descripcion
        );
        resenia.setId(50L);

        ReseniaDTO dto = ReseniaDTO.desdeModelo(resenia);

        assertEquals(50L, dto.id());
        assertEquals(100L, dto.idPaseador());
        assertEquals(200L, dto.idCliente());
        assertEquals(300L, dto.idPaseo());
        assertEquals(4, dto.puntuacion());
        assertEquals("Servicio profesional y puntual", dto.descripcion());
    }

    @Test
    void reseniaDTOConPuntuacionMinima() {
        ReseniaDTO dto = new ReseniaDTO(1L, 10L, 20L, 30L, "Pésimo servicio", 0);

        assertEquals(0, dto.puntuacion());
        assertNotNull(dto.descripcion());
    }

    @Test
    void reseniaDTOConPuntuacionMaxima() {
        ReseniaDTO dto = new ReseniaDTO(1L, 10L, 20L, 30L, "Servicio perfecto", 5);

        assertEquals(5, dto.puntuacion());
        assertNotNull(dto.descripcion());
    }
}

