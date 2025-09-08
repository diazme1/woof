package ar.edu.unq.woof.controller.dto.paseador;

import ar.edu.unq.woof.modelo.Usuario;

public record PaseadorDTO(
        Long idPaseador,
        String nombre,
        Integer dni,
        String email,
        String telefono,
        String direccion,
        String contrasena
) {

    public static PaseadorDTO desdeModelo(Usuario usuario) {
        return new PaseadorDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getDni(),
                usuario.getEmail(),
                usuario.getTelefono(),
                usuario.getDireccion(),
                usuario.getContrasena()
        );
    }
}
