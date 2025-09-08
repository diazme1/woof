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
}
