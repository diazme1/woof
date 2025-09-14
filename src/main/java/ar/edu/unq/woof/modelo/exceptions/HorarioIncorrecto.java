package ar.edu.unq.woof.modelo.exceptions;

public class HorarioIncorrecto extends RuntimeException {
  @Override
  public String getMessage(){
     return "El horario debe estar dentro de las próximas 12 horas.";
    }
}
