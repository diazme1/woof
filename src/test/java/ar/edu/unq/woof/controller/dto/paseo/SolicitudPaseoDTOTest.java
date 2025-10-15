package ar.edu.unq.woof.controller.dto.paseo;

import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.modelo.enums.*;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class SolicitudPaseoDTOTest {

    @Test
    void crearSolicitudPaseoDTOConTodosLosCampos() {
        LocalDateTime horario = LocalDateTime.of(2024, 10, 15, 14, 30);
        SolicitudPaseoDTO dto = new SolicitudPaseoDTO(
                1L,
                ZonaOperativa.QUILMES,
                horario,
                "Max",
                TamanoPerro.GRANDE,
                "Golden Retriever",
                EstadoSolicitud.ACEPTADA,
                10L,
                20L,
                EstadoDePago.PAGO,
                "Paseo en el parque"
        );

        assertEquals(1L, dto.id());
        assertEquals(ZonaOperativa.QUILMES, dto.zona());
        assertEquals(horario, dto.horario());
        assertEquals("Max", dto.nombrePerro());
        assertEquals(TamanoPerro.GRANDE, dto.tamanoPerro());
        assertEquals("Golden Retriever", dto.raza());
        assertEquals(EstadoSolicitud.ACEPTADA, dto.estado());
        assertEquals(10L, dto.idCliente());
        assertEquals(20L, dto.idPaseador());
        assertEquals(EstadoDePago.PAGO, dto.estadoPago());
        assertEquals("Paseo en el parque", dto.detalles());
    }

    @Test
    void desdeModeloConvierteSolicitudPaseoADTO() {
        LocalDateTime horario = LocalDateTime.of(2024, 10, 15, 16, 0);
        SolicitudPaseo solicitud = new SolicitudPaseo(
                ZonaOperativa.BERNAL,
                horario,
                "Luna",
                TamanoPerro.MEDIANO,
                "Beagle",
                5L,
                "Necesita correa especial"
        );
        solicitud.setId(3L);
        solicitud.setEstadoDeSolicitud(EstadoSolicitud.PENDIENTE);
        solicitud.setIdPaseador(15L);
        solicitud.setEstadoDePago(EstadoDePago.PENDIENTE_DE_PAGO);

        SolicitudPaseoDTO dto = SolicitudPaseoDTO.desdeModelo(solicitud);

        assertEquals(3L, dto.id());
        assertEquals(ZonaOperativa.BERNAL, dto.zona());
        assertEquals(horario, dto.horario());
        assertEquals("Luna", dto.nombrePerro());
        assertEquals(TamanoPerro.MEDIANO, dto.tamanoPerro());
        assertEquals("Beagle", dto.raza());
        assertEquals(EstadoSolicitud.PENDIENTE, dto.estado());
        assertEquals(5L, dto.idCliente());
        assertEquals(15L, dto.idPaseador());
        assertEquals(EstadoDePago.PENDIENTE_DE_PAGO, dto.estadoPago());
        assertEquals("Necesita correa especial", dto.detalles());
    }

    @Test
    void dosSolicitudPaseoDTOConMismosDatosSonIguales() {
        LocalDateTime horario = LocalDateTime.of(2024, 10, 15, 14, 30);
        SolicitudPaseoDTO dto1 = new SolicitudPaseoDTO(
                1L, ZonaOperativa.QUILMES, horario, "Max", TamanoPerro.GRANDE,
                "Golden", EstadoSolicitud.PENDIENTE, 10L, 20L,
                EstadoDePago.PENDIENTE_DE_PAGO, "Detalles"
        );
        SolicitudPaseoDTO dto2 = new SolicitudPaseoDTO(
                1L, ZonaOperativa.QUILMES, horario, "Max", TamanoPerro.GRANDE,
                "Golden", EstadoSolicitud.PENDIENTE, 10L, 20L,
                EstadoDePago.PENDIENTE_DE_PAGO, "Detalles"
        );

        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }

    @Test
    void solicitudPaseoDTOConCamposNulos() {
        SolicitudPaseoDTO dto = new SolicitudPaseoDTO(
                1L, ZonaOperativa.QUILMES, LocalDateTime.now(), "Rex",
                TamanoPerro.PEQUENO, "Chihuahua", EstadoSolicitud.PENDIENTE,
                10L, null, EstadoDePago.PENDIENTE_DE_PAGO, null
        );

        assertNotNull(dto);
        assertNull(dto.idPaseador());
        assertNull(dto.detalles());
    }
}

