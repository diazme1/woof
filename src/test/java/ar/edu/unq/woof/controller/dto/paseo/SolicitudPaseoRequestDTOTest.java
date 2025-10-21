package ar.edu.unq.woof.controller.dto.paseo;

import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.modelo.enums.TamanoPerro;
import ar.edu.unq.woof.modelo.enums.ZonaOperativa;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class SolicitudPaseoRequestDTOTest {

    @Test
    void crearSolicitudPaseoRequestDTOConTodosLosCampos() {
        LocalDateTime horario = LocalDateTime.of(2024, 10, 15, 14, 30);
        SolicitudPaseoRequestDTO requestDTO = new SolicitudPaseoRequestDTO(
                ZonaOperativa.QUILMES,
                horario,
                "Bobby",
                TamanoPerro.MEDIANO,
                "Cocker Spaniel",
                10L,
                "Necesita paseo largo"
        );

        assertEquals(ZonaOperativa.QUILMES, requestDTO.zona());
        assertEquals(horario, requestDTO.horario());
        assertEquals("Bobby", requestDTO.nombrePerro());
        assertEquals(TamanoPerro.MEDIANO, requestDTO.tamanoPerro());
        assertEquals("Cocker Spaniel", requestDTO.raza());
        assertEquals(10L, requestDTO.idCliente());
        assertEquals("Necesita paseo largo", requestDTO.detalles());
    }

    @Test
    void aModeloConvierteSolicitudPaseoRequestDTOASolicitudPaseo() {
        LocalDateTime horario = LocalDateTime.of(2024, 10, 16, 10, 0);
        SolicitudPaseoRequestDTO requestDTO = new SolicitudPaseoRequestDTO(
                ZonaOperativa.BERNAL,
                horario,
                "Rocky",
                TamanoPerro.GRANDE,
                "Pastor Alemán",
                15L,
                "Paseo matutino"
        );

        SolicitudPaseo solicitud = requestDTO.aModelo();

        assertNotNull(solicitud);
        assertEquals(ZonaOperativa.BERNAL, solicitud.getZona());
        assertEquals(horario, solicitud.getHorario());
        assertEquals("Rocky", solicitud.getNombrePerro());
        assertEquals(TamanoPerro.GRANDE, solicitud.getTamanoPerro());
        assertEquals("Pastor Alemán", solicitud.getRaza());
        assertEquals(15L, solicitud.getIdCliente());
        assertEquals("Paseo matutino", solicitud.getDetalles());
    }

    @Test
    void dosSolicitudPaseoRequestDTOConMismosDatosSonIguales() {
        LocalDateTime horario = LocalDateTime.of(2024, 10, 15, 14, 30);
        SolicitudPaseoRequestDTO dto1 = new SolicitudPaseoRequestDTO(
                ZonaOperativa.QUILMES, horario, "Max", TamanoPerro.PEQUENO,
                "Chihuahua", 10L, "Detalles"
        );
        SolicitudPaseoRequestDTO dto2 = new SolicitudPaseoRequestDTO(
                ZonaOperativa.QUILMES, horario, "Max", TamanoPerro.PEQUENO,
                "Chihuahua", 10L, "Detalles"
        );

        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }

    @Test
    void solicitudPaseoRequestDTOConDetallesNulos() {
        LocalDateTime horario = LocalDateTime.now().plusHours(2);
        SolicitudPaseoRequestDTO requestDTO = new SolicitudPaseoRequestDTO(
                ZonaOperativa.QUILMES,
                horario,
                "Luna",
                TamanoPerro.MEDIANO,
                "Mestizo",
                5L,
                null
        );

        assertNotNull(requestDTO);
        assertNull(requestDTO.detalles());

        SolicitudPaseo solicitud = requestDTO.aModelo();
        assertNotNull(solicitud);
        assertNull(solicitud.getDetalles());
    }
}