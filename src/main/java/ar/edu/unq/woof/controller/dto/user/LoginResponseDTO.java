package ar.edu.unq.woof.controller.dto.user;

public record LoginResponseDTO(
        String token,
        String nombre,
        String email
) {
}
