package ar.edu.unq.woof.modelo.exceptions;

public class SolicitudNoPendiente extends RuntimeException {
    @Override
    public String getMessage(){
        return "La solicitud no se encuentra pendiente";
    }
}
