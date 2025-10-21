package ar.edu.unq.woof.controller;

import ar.edu.unq.woof.modelo.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CorreoDuplicadoPaseadorException.class)
    public ResponseEntity<?> handleNombreDeUbicacionDuplicadoException(CorreoDuplicadoPaseadorException e) {
        ErrorResponse errorDetails = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                e.getMessage()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(HorarioIncorrecto.class)
    public ResponseEntity<?> handleHorarioIncorrecto(HorarioIncorrecto e) {
        ErrorResponse errorDetails = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                e.getMessage()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(FranjaHorariaExcedida.class)
    public ResponseEntity<?> handleFranjaHorariaExcedida(FranjaHorariaExcedida e) {
        ErrorResponse errorDetails = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                e.getMessage()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SolicitudNoEncontrada.class)
    public ResponseEntity<?> handleSolicitudNoEncontrada(SolicitudNoEncontrada e) {
        ErrorResponse errorDetails = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                e.getMessage()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(SolicitudNoPendiente.class)
    public ResponseEntity<?> handleSolicitudNoPendiente(SolicitudNoPendiente e) {
        ErrorResponse errorDetails = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                e.getMessage()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SolicitudaNoPagadaAceptada.class)
    public ResponseEntity<?> handleSolicitudaNoPagadaAceptada(SolicitudaNoPagadaAceptada e) {
        ErrorResponse errorDetails = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                e.getMessage()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PuntajeInvalidoException.class)
    public ResponseEntity<?> handlePuntajeInvalido(PuntajeInvalidoException e) {
        ErrorResponse errorDetails = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                e.getMessage()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }
}
