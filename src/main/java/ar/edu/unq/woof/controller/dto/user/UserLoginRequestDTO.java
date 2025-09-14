package ar.edu.unq.woof.controller.dto.user;

import ar.edu.unq.woof.modelo.Usuario;

public record UserLoginRequestDTO(
        String email,
        String contrasena
    ){

}

