package ar.edu.unq.woof.controller.dto.user;

import ar.edu.unq.woof.modelo.Usuario;

public record UserRequestDTO(
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
