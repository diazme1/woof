package ar.edu.unq.woof.service;

import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.modelo.enums.*;
import ar.edu.unq.woof.modelo.exceptions.FranjaHorariaExcedida;
import ar.edu.unq.woof.modelo.exceptions.HorarioIncorrecto;
import ar.edu.unq.woof.modelo.exceptions.SolicitudNoEncontrada;
import ar.edu.unq.woof.modelo.exceptions.SolicitudaNoPagadaAceptada;
import ar.edu.unq.woof.service.interfaces.SolicitudPaseoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.TimeZone;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class SolicitudPaseoServiceTest {

    @Autowired
    private SolicitudPaseoService solicitudPaseoService;

    @BeforeEach
    public void setUp() {
        TimeZone.setDefault(TimeZone.getTimeZone("America/Argentina/Buenos_Aires"));
    }

    @Test
    public void cuandoSeCreaSolicitudPaseoSeGuardaCorrectamente() {
        LocalDateTime horario = LocalDateTime.now().plusMinutes(15);
        SolicitudPaseo solicitud = new SolicitudPaseo(
                ZonaOperativa.QUILMES,
                horario,
                "Abdu",
                TamanoPerro.GRANDE,
                "Labrador",
                4L,
                "Toma medicamentos a las 18hs"
        );

        SolicitudPaseo solicitudGuardada = solicitudPaseoService.savePaseo(solicitud);

        assertNotNull(solicitudGuardada.getId());
        assertEquals("Abdu", solicitudGuardada.getNombrePerro());
        assertEquals(EstadoSolicitud.PENDIENTE, solicitudGuardada.getEstadoDeSolicitud());
        assertEquals(EstadoDePago.PENDIENTE_DE_PAGO, solicitudGuardada.getEstadoDePago());
    }

    @Test
    public void cuandoSeCancelaSolicitudPaseoCambiaEstado() {
        LocalDateTime horario = LocalDateTime.now().plusMinutes(15);
        SolicitudPaseo solicitud = new SolicitudPaseo(
                ZonaOperativa.QUILMES,
                horario,
                "Oli",
                TamanoPerro.MEDIANO,
                "Caniche",
                4L,
                "Necesita paseo corto"
        );

        SolicitudPaseo solicitudGuardada = solicitudPaseoService.savePaseo(solicitud);
        solicitudPaseoService.cancelarSolicitudPaseo(solicitudGuardada.getId());

        SolicitudPaseo solicitudCancelada = solicitudPaseoService.getSolicitud(solicitudGuardada.getId())
                .orElseThrow(() -> new RuntimeException("No se encontró la solicitud"));

        assertEquals(EstadoSolicitud.CANCELADA, solicitudCancelada.getEstadoDeSolicitud());
    }

    @Test
    public void cuandoSeAceptaSolicitudPaseoCambiaEstadoYAsignaPaseador() {
        LocalDateTime horario = LocalDateTime.now().plusMinutes(15);
        SolicitudPaseo solicitud = new SolicitudPaseo(
                ZonaOperativa.QUILMES,
                horario,
                "Luna",
                TamanoPerro.PEQUENO,
                "Yorkshire",
                4L,
                "Sin observaciones"
        );

        SolicitudPaseo solicitudGuardada = solicitudPaseoService.savePaseo(solicitud);
        Long idPaseador = 1L;
        solicitudPaseoService.aceptarSolicitudPaseo(solicitudGuardada.getId(), idPaseador);

        SolicitudPaseo solicitudAceptada = solicitudPaseoService.getSolicitud(solicitudGuardada.getId())
                .orElseThrow(() -> new RuntimeException("No se encontró la solicitud"));

        assertEquals(EstadoSolicitud.ACEPTADA, solicitudAceptada.getEstadoDeSolicitud());
        assertEquals(idPaseador, solicitudAceptada.getIdPaseador());
    }

    @Test
    public void obtenerSolicitudesPendientesDevuelveListaCorrecta() {
        // Crear varias solicitudes con diferentes estados
        SolicitudPaseo solicitudPendiente1 = crearSolicitudPaseo("Perro1", EstadoSolicitud.PENDIENTE);
        SolicitudPaseo solicitudPendiente2 = crearSolicitudPaseo("Perro2", EstadoSolicitud.PENDIENTE);
        SolicitudPaseo solicitudAceptada = crearSolicitudPaseo("Perro3", EstadoSolicitud.ACEPTADA);

        List<SolicitudPaseo> solicitudesPendientes = solicitudPaseoService.getAllPendientes();

        assertTrue(solicitudesPendientes.size() >= 2);
        assertTrue(solicitudesPendientes.stream()
                .allMatch(s -> s.getEstadoDeSolicitud() == EstadoSolicitud.PENDIENTE));
    }

    @Test
    public void contarPaseosDePaseadorDevuelveNumeroCorrecto() {
        Long idPaseador = 1L;
        // Crear varias solicitudes para el mismo paseador
        SolicitudPaseo solicitud1 = crearYAceptarSolicitud("Perro1", idPaseador);
        SolicitudPaseo solicitud2 = crearYAceptarSolicitud("Perro2", idPaseador);

        int cantidadPaseos = solicitudPaseoService.contarLosPaseosDePaseador(idPaseador);

        assertTrue(cantidadPaseos >= 2);
    }

    @Test
    public void finalizarSolicitudExitosa() {
        // Crear y aceptar una solicitud
        SolicitudPaseo solicitud = crearSolicitudPaseo("Max", EstadoSolicitud.ACEPTADA);
        solicitud.setEstadoDePago(EstadoDePago.PAGO);
        solicitudPaseoService.savePaseo(solicitud);

        solicitudPaseoService.finalizarSolicitud(solicitud.getId());

        SolicitudPaseo solicitudFinalizada = solicitudPaseoService.getSolicitud(solicitud.getId())
                .orElseThrow(() -> new RuntimeException("No se encontró la solicitud"));
        assertEquals(EstadoSolicitud.FINALIZADA, solicitudFinalizada.getEstadoDeSolicitud());
    }

    @Test
    public void obtenerSolicitudesDeClienteDevuelveListaCorrecta() {
        Long idCliente = 4L;
        // Crear varias solicitudes para el mismo cliente
        SolicitudPaseo solicitud1 = crearSolicitudPaseo("Toby", EstadoSolicitud.PENDIENTE);
        SolicitudPaseo solicitud2 = crearSolicitudPaseo("Luna", EstadoSolicitud.ACEPTADA);

        List<SolicitudPaseo> solicitudesCliente = solicitudPaseoService.getSolicitudesDeCliente(idCliente);

        assertFalse(solicitudesCliente.isEmpty());
        assertTrue(solicitudesCliente.stream()
                .allMatch(s -> s.getIdCliente().equals(idCliente)));
    }

    @Test
    public void obtenerPaseosAceptadosDevuelveListaCorrecta() {
        Long idPaseador = 1L;
        // Crear solicitudes aceptadas para el paseador
        SolicitudPaseo solicitud1 = crearYAceptarSolicitud("Rocky", idPaseador);
        SolicitudPaseo solicitud2 = crearYAceptarSolicitud("Bella", idPaseador);

        List<SolicitudPaseo> paseosAceptados = solicitudPaseoService.obtenerPaseosAceptados(idPaseador);

        assertFalse(paseosAceptados.isEmpty());
        assertTrue(paseosAceptados.stream()
                .allMatch(s -> s.getEstadoDeSolicitud() == EstadoSolicitud.ACEPTADA));
    }

    @Test
    public void obtenerPaseosHistoricosDevuelveListaCorrecta() {
        Long idPaseador = 1L;
        List<SolicitudPaseo> paseosHistoricos = solicitudPaseoService.obtenerPaseosHistoricos(idPaseador);
        // Solo verificamos que no arroje excepción
        assertNotNull(paseosHistoricos);
    }

    // ===== TESTS PARA EXCEPCIONES =====

    @Test
    public void lanzaHorarioIncorrectoSiElHorarioEsEnElPasado() {
        LocalDateTime horarioPasado = LocalDateTime.now().minusHours(1);
        SolicitudPaseo solicitud = new SolicitudPaseo(
                ZonaOperativa.QUILMES,
                horarioPasado,
                "Firulais",
                TamanoPerro.MEDIANO,
                "Mestizo",
                4L,
                "Sin observaciones"
        );

        HorarioIncorrecto exception = assertThrows(HorarioIncorrecto.class, () -> {
            solicitudPaseoService.savePaseo(solicitud);
        });

        assertEquals("El horario debe estar dentro de las próximas 12 horas.", exception.getMessage());
    }

    @Test
    public void lanzaHorarioIncorrectoSiElHorarioEsMayorA12Horas() {
        LocalDateTime horarioFuturo = LocalDateTime.now().plusHours(13);
        SolicitudPaseo solicitud = new SolicitudPaseo(
                ZonaOperativa.QUILMES,
                horarioFuturo,
                "Bobby",
                TamanoPerro.GRANDE,
                "Golden",
                4L,
                "Sin observaciones"
        );

        HorarioIncorrecto exception = assertThrows(HorarioIncorrecto.class, () -> {
            solicitudPaseoService.savePaseo(solicitud);
        });

        assertEquals("El horario debe estar dentro de las próximas 12 horas.", exception.getMessage());
    }

    @Test
    public void lanzaFranjaHorariaExcedidaSiElHorarioEsDespuesDeLas21() {
        // Crear horario después de las 21:00
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime horarioDespuesDe21;

        // Si la hora actual es antes de las 9:00, el horario a las 21:00 estará dentro de las 12 horas
        if (ahora.getHour() < 9) {
            horarioDespuesDe21 = ahora.with(LocalTime.of(21, 0));
        } else {
            // De lo contrario, usar mañana a las 21:00 pero verificar que esté en el rango
            horarioDespuesDe21 = ahora.plusDays(1).with(LocalTime.of(9, 0)).with(LocalTime.of(21, 0));
            // Si está fuera del rango, usar el límite de 12 horas con hora 21:00
            if (horarioDespuesDe21.isAfter(ahora.plusHours(12))) {
                horarioDespuesDe21 = ahora.plusHours(11).with(LocalTime.of(21, 0));
            }
        }

        LocalDateTime horarioFinal = horarioDespuesDe21;
        SolicitudPaseo solicitud = new SolicitudPaseo(
                ZonaOperativa.QUILMES,
                horarioFinal,
                "Rex",
                TamanoPerro.MEDIANO,
                "Pastor",
                4L,
                "Sin observaciones"
        );

        FranjaHorariaExcedida exception = assertThrows(FranjaHorariaExcedida.class, () -> {
            solicitudPaseoService.savePaseo(solicitud);
        });

        assertEquals("El horario debe ser antes de las 21:00.", exception.getMessage());
    }

    @Test
    public void lanzaSolicitudNoEncontradaAlBuscarSolicitudInexistente() {
        Long idInexistente = 999999L;

        SolicitudNoEncontrada exception = assertThrows(SolicitudNoEncontrada.class, () -> {
            solicitudPaseoService.finalizarSolicitud(idInexistente);
        });

        assertEquals("La solicitud no fue encontrada", exception.getMessage());
    }

    @Test
    public void lanzaSolicitudNoEncontradaAlCancelarSolicitudInexistente() {
        Long idInexistente = 888888L;

        SolicitudNoEncontrada exception = assertThrows(SolicitudNoEncontrada.class, () -> {
            solicitudPaseoService.cancelarSolicitudPaseo(idInexistente);
        });

        assertEquals("La solicitud no fue encontrada", exception.getMessage());
    }

    @Test
    public void lanzaSolicitudNoEncontradaAlAceptarSolicitudInexistente() {
        Long idInexistente = 777777L;
        Long idPaseador = 1L;

        SolicitudNoEncontrada exception = assertThrows(SolicitudNoEncontrada.class, () -> {
            solicitudPaseoService.aceptarSolicitudPaseo(idInexistente, idPaseador);
        });

        assertEquals("La solicitud no fue encontrada", exception.getMessage());
    }

    @Test
    public void lanzaSolicitudNoPagadaAceptadaAlFinalizarSolicitudSinPagar() {
        LocalDateTime horario = LocalDateTime.now().plusMinutes(30);
        SolicitudPaseo solicitud = new SolicitudPaseo(
                ZonaOperativa.QUILMES,
                horario,
                "Thor",
                TamanoPerro.GRANDE,
                "Husky",
                4L,
                "Sin observaciones"
        );

        SolicitudPaseo solicitudGuardada = solicitudPaseoService.savePaseo(solicitud);
        solicitudGuardada.setEstadoDeSolicitud(EstadoSolicitud.ACEPTADA);
        // NO se marca como pagada (EstadoDePago.PENDIENTE_DE_PAGO)
        solicitudPaseoService.savePaseo(solicitudGuardada);

        SolicitudaNoPagadaAceptada exception = assertThrows(SolicitudaNoPagadaAceptada.class, () -> {
            solicitudPaseoService.finalizarSolicitud(solicitudGuardada.getId());
        });

        assertEquals("Solicitud no pagada", exception.getMessage());
    }

    @Test
    public void lanzaSolicitudNoPagadaAceptadaAlFinalizarSolicitudPagadaPeroNoAceptada() {
        LocalDateTime horario = LocalDateTime.now().plusMinutes(30);
        SolicitudPaseo solicitud = new SolicitudPaseo(
                ZonaOperativa.QUILMES,
                horario,
                "Loki",
                TamanoPerro.MEDIANO,
                "Beagle",
                4L,
                "Sin observaciones"
        );

        SolicitudPaseo solicitudGuardada = solicitudPaseoService.savePaseo(solicitud);
        solicitudGuardada.setEstadoDePago(EstadoDePago.PAGO);
        // NO se marca como aceptada (sigue en PENDIENTE)
        solicitudPaseoService.savePaseo(solicitudGuardada);

        SolicitudaNoPagadaAceptada exception = assertThrows(SolicitudaNoPagadaAceptada.class, () -> {
            solicitudPaseoService.finalizarSolicitud(solicitudGuardada.getId());
        });

        assertEquals("Solicitud no pagada", exception.getMessage());
    }

    // Métodos auxiliares
    private SolicitudPaseo crearSolicitudPaseo(String nombrePerro, EstadoSolicitud estado) {
        SolicitudPaseo solicitud = new SolicitudPaseo(
                ZonaOperativa.QUILMES,
                LocalDateTime.now().plusMinutes(30),
                nombrePerro,
                TamanoPerro.MEDIANO,
                "Mestizo",
                4L,
                "Sin observaciones"
        );
        solicitud.setEstadoDeSolicitud(estado);
        return solicitudPaseoService.savePaseo(solicitud);
    }

    private SolicitudPaseo crearYAceptarSolicitud(String nombrePerro, Long idPaseador) {
        SolicitudPaseo solicitud = crearSolicitudPaseo(nombrePerro, EstadoSolicitud.PENDIENTE);
        solicitudPaseoService.aceptarSolicitudPaseo(solicitud.getId(), idPaseador);
        return solicitud;
    }

    private SolicitudPaseo crearYFinalizarSolicitud(String nombrePerro, Long idPaseador) {
        SolicitudPaseo solicitud = crearYAceptarSolicitud(nombrePerro, idPaseador);
        solicitud.setEstadoDePago(EstadoDePago.PAGO);
        SolicitudPaseo pagada = solicitudPaseoService.savePaseo(solicitud);
        solicitudPaseoService.finalizarSolicitud(pagada.getId());
        return solicitud;
    }

}

