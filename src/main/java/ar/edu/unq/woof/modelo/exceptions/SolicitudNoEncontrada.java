package ar.edu.unq.woof.modelo.exceptions;

public class SolicitudNoEncontrada extends RuntimeException {
    @Override
    public String getMessage(){
        return "La solicitud no fue encontrada";
    }
}
