package ar.edu.unq.woof.controller.dto.resenia;

import ar.edu.unq.woof.modelo.Resenia;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ReseniaRequestDTOTest {

    @Test
    void crearReseniaRequestDTOConTodosLosCampos() {
        ReseniaRequestDTO requestDTO = new ReseniaRequestDTO(
                10L,
                20L,
                30L,
                "Muy buen servicio",
                5
        );

        assertEquals(10L, requestDTO.idPaseador());
        assertEquals(20L, requestDTO.idCliente());
        assertEquals(30L, requestDTO.idPaseo());
        assertEquals("Muy buen servicio", requestDTO.descripcion());
        assertEquals(5, requestDTO.puntuacion());
    }

    @Test
    void aModeloConvierteReseniaRequestDTOAResenia() {
        ReseniaRequestDTO requestDTO = new ReseniaRequestDTO(
                15L,
                25L,
                35L,
                "Buen paseador, puntual",
                4
        );

        Resenia resenia = requestDTO.aModelo();

        assertNotNull(resenia);
        assertEquals(15L, resenia.getIdPaseador());
        assertEquals(25L, resenia.getIdCliente());
        assertEquals(35L, resenia.getIdPaseo());
        assertEquals("Buen paseador, puntual", resenia.getDescripcion());
        assertEquals(4, resenia.getPuntuacion());
    }

    @Test
    void dosReseniaRequestDTOConMismosDatosSonIguales() {
        ReseniaRequestDTO dto1 = new ReseniaRequestDTO(
                10L, 20L, 30L, "Excelente", 5
        );
        ReseniaRequestDTO dto2 = new ReseniaRequestDTO(
                10L, 20L, 30L, "Excelente", 5
        );

        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }

    @Test
    void reseniaRequestDTOConDescripcionNula() {
        ReseniaRequestDTO requestDTO = new ReseniaRequestDTO(
                10L, 20L, 30L, null, 3
        );

        assertNotNull(requestDTO);
        assertNull(requestDTO.descripcion());

        Resenia resenia = requestDTO.aModelo();
        assertNotNull(resenia);
        assertNull(resenia.getDescripcion());
    }

    @Test
    void reseniaRequestDTOConDiferentesPuntuaciones() {
        ReseniaRequestDTO dto1 = new ReseniaRequestDTO(10L, 20L, 30L, "Malo", 1);
        ReseniaRequestDTO dto5 = new ReseniaRequestDTO(10L, 20L, 30L, "Perfecto", 5);

        assertEquals(1, dto1.puntuacion());
        assertEquals(5, dto5.puntuacion());
    }
}

