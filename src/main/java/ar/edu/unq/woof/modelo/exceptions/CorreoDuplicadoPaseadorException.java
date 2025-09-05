package ar.edu.unq.woof.modelo.exceptions;

public class CorreoDuplicadoPaseadorException extends RuntimeException {

    private String email;
    public CorreoDuplicadoPaseadorException(String email) {
        this.email = email;
    }

    @Override
    public String getMessage(){
        return "La dirección de correo" + email + " ya se encuentra registrado." ;
    }
}
