package ar.edu.unq.woof.modelo.exceptions;

public class SolicitudaNoPagadaAceptada extends RuntimeException {

    @Override
    public String getMessage() {
        return "Solicitud no pagada";
    }
}
