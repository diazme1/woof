package ar.edu.unq.woof.controller;

import ar.edu.unq.woof.modelo.exceptions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

public class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    void handleCorreoDuplicadoPaseadorException() {
        CorreoDuplicadoPaseadorException exception = new CorreoDuplicadoPaseadorException("test@mail.com");

        ResponseEntity<?> response = exceptionHandler.handleNombreDeUbicacionDuplicadoException(exception);

        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertNotNull(errorResponse);
        assertEquals(HttpStatus.BAD_REQUEST.value(), errorResponse.getResponse_code());
        assertTrue(errorResponse.getDescription().contains("test@mail.com"));
    }

    @Test
    void handleHorarioIncorrecto() {
        HorarioIncorrecto exception = new HorarioIncorrecto();

        ResponseEntity<?> response = exceptionHandler.handleHorarioIncorrecto(exception);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertNotNull(errorResponse);
        assertEquals(HttpStatus.BAD_REQUEST.value(), errorResponse.getResponse_code());
        assertEquals("El horario debe estar dentro de las próximas 12 horas.", errorResponse.getDescription());
    }

    @Test
    void handleFranjaHorariaExcedida() {
        FranjaHorariaExcedida exception = new FranjaHorariaExcedida();

        ResponseEntity<?> response = exceptionHandler.handleFranjaHorariaExcedida(exception);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertNotNull(errorResponse);
        assertEquals(HttpStatus.BAD_REQUEST.value(), errorResponse.getResponse_code());
        assertEquals("El horario debe ser antes de las 21:00.", errorResponse.getDescription());
    }

    @Test
    void handleSolicitudNoEncontrada() {
        SolicitudNoEncontrada exception = new SolicitudNoEncontrada();

        ResponseEntity<?> response = exceptionHandler.handleSolicitudNoEncontrada(exception);

        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertNotNull(errorResponse);
        assertEquals(HttpStatus.NOT_FOUND.value(), errorResponse.getResponse_code());
        assertEquals("La solicitud no fue encontrada", errorResponse.getDescription());
    }

    @Test
    void handleSolicitudNoPendiente() {
        SolicitudNoPendiente exception = new SolicitudNoPendiente();

        ResponseEntity<?> response = exceptionHandler.handleSolicitudNoPendiente(exception);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertNotNull(errorResponse);
        assertEquals(HttpStatus.BAD_REQUEST.value(), errorResponse.getResponse_code());
        assertEquals("La solicitud no se encuentra pendiente", errorResponse.getDescription());
    }

    @Test
    void handleSolicitudaNoPagadaAceptada() {
        SolicitudaNoPagadaAceptada exception = new SolicitudaNoPagadaAceptada();

        ResponseEntity<?> response = exceptionHandler.handleSolicitudaNoPagadaAceptada(exception);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertNotNull(errorResponse);
        assertEquals(HttpStatus.BAD_REQUEST.value(), errorResponse.getResponse_code());
        assertEquals("Solicitud no pagada", errorResponse.getDescription());
    }

    @Test
    void handlePuntajeInvalido() {
        PuntajeInvalidoException exception = new PuntajeInvalidoException();

        ResponseEntity<?> response = exceptionHandler.handlePuntajeInvalido(exception);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertNotNull(errorResponse);
        assertEquals(HttpStatus.BAD_REQUEST.value(), errorResponse.getResponse_code());
        assertEquals("La puntuación debe estar entre 0 y 5.", errorResponse.getDescription());
    }
}
