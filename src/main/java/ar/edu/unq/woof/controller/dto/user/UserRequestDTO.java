package ar.edu.unq.woof.controller.dto.paseador;

import ar.edu.unq.woof.modelo.Usuario;

public record PaseadorRequestDTO(
        String nombre,
        Integer dni,
        String email,
        String telefono,
        String direccion,
        String contrasena
) {

    public Usuario aModelo(){
        return new Usuario(nombre, dni, email, telefono, direccion, contrasena);
    }
}
