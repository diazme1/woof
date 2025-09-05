package ar.edu.unq.woof.controller.dto.paseador;

import ar.edu.unq.woof.modelo.Paseador;

public record PaseadorRequestDTO(
        String nombre,
        Integer dni,
        String email,
        String telefono,
        String direccion,
        String contrasena
) {

    public Paseador aModelo(){
        return new Paseador(nombre, dni, email, telefono, direccion, contrasena);
    }
}
