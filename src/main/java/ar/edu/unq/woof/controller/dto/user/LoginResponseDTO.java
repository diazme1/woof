package ar.edu.unq.woof.controller.dto.user;

import ar.edu.unq.woof.modelo.enums.UserRole;

public record LoginResponseDTO(
        String token,
        String nombre,
        String email
) {
}
