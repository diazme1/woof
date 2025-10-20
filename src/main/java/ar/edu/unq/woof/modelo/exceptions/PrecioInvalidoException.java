package ar.edu.unq.woof.modelo.exceptions;

public class PrecioInvalidoException extends RuntimeException {
    @Override
    public String getMessage() {
        return "El precio no puede ser vacío o negativo";
    }
}
