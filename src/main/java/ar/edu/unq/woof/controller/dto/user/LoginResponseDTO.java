package ar.edu.unq.woof.controller.dto.user;

import ar.edu.unq.woof.modelo.enums.UserRole;

public record LoginResponseDTO(
        String token,
        UserDTO user,
        String nombre,
        String email,
        UserRole rol,
        Long id
) {}
