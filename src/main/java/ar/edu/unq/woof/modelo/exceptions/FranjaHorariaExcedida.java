package ar.edu.unq.woof.modelo.exceptions;

public class FranjaHorariaExcedida extends RuntimeException {
    @Override
    public String getMessage(){
        return "El horario debe ser antes de las 21:00.";
    }
}
