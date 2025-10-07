package ar.edu.unq.woof.modelo;

import ar.edu.unq.woof.modelo.enums.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class SolicitudPaseoTest {

    private SolicitudPaseo solicitudPaseo;
    private LocalDateTime horario;

    @BeforeEach
    void setUp() {
        horario = LocalDateTime.now().plusHours(1);
        solicitudPaseo = new SolicitudPaseo(
                ZonaOperativa.QUILMES,
                horario,
                "Firulais",
                TamanoPerro.MEDIANO,
                "Mestizo",
                1L,
                "Sin observaciones"
        );
    }

    @Test
    void alCrearSolicitudPaseoSeInicializaCorrectamente() {
        assertEquals(ZonaOperativa.QUILMES, solicitudPaseo.getZona());
        assertEquals(horario, solicitudPaseo.getHorario());
        assertEquals("Firulais", solicitudPaseo.getNombrePerro());
        assertEquals(TamanoPerro.MEDIANO, solicitudPaseo.getTamanoPerro());
        assertEquals("Mestizo", solicitudPaseo.getRaza());
        assertEquals(1L, solicitudPaseo.getIdCliente());
        assertEquals(EstadoSolicitud.PENDIENTE, solicitudPaseo.getEstadoDeSolicitud());
        assertEquals(EstadoDePago.PENDIENTE_DE_PAGO, solicitudPaseo.getEstadoDePago());
    }

    @Test
    void alCancelarSolicitudCambiaEstado() {
        solicitudPaseo.setEstadoDeSolicitud(EstadoSolicitud.CANCELADA);
        assertEquals(EstadoSolicitud.CANCELADA, solicitudPaseo.getEstadoDeSolicitud());
    }

    @Test
    void alAceptarSolicitudCambiaEstadoYAsignaPaseador() {
        Long idPaseador = 2L;
        solicitudPaseo.setEstadoDeSolicitud(EstadoSolicitud.ACEPTADA);
        solicitudPaseo.setIdPaseador(idPaseador);

        assertEquals(EstadoSolicitud.ACEPTADA, solicitudPaseo.getEstadoDeSolicitud());
        assertEquals(idPaseador, solicitudPaseo.getIdPaseador());
    }

    @Test
    void alFinalizarSolicitudCambiaEstado() {
        Long idPaseador = 2L;
        solicitudPaseo.setEstadoDeSolicitud(EstadoSolicitud.ACEPTADA);
        solicitudPaseo.setIdPaseador(idPaseador);
        solicitudPaseo.setEstadoDePago(EstadoDePago.PAGO);
        solicitudPaseo.setEstadoDeSolicitud(EstadoSolicitud.FINALIZADA);

        assertEquals(EstadoSolicitud.FINALIZADA, solicitudPaseo.getEstadoDeSolicitud());
    }

    @Test
    void alMarcarComoPagadaCambiaEstadoPago() {
        solicitudPaseo.setEstadoDePago(EstadoDePago.PAGO);
        assertEquals(EstadoDePago.PAGO, solicitudPaseo.getEstadoDePago());
    }

}
