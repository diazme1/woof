package ar.edu.unq.woof.modelo.exceptions;

public class PuntajeInvalidoException extends RuntimeException {

    @Override
    public String getMessage() {
        return "La puntuación debe estar entre 0 y 5.";
    }
}
