package ar.edu.unq.woof.controller.dto.user;

import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.modelo.enums.UserRole;

public record UserRequestDTO(
        String nombre,
        Integer dni,
        String email,
        String telefono,
        String direccion,
        String contrasena,
        UserRole rol
) {

    public Usuario aModelo(){
        return new Usuario(nombre, dni, email, telefono, direccion, contrasena, rol);
    }
}
