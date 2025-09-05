package ar.edu.unq.woof.controller.dto.paseador;

import ar.edu.unq.woof.modelo.Paseador;

public record PaseadorDTO(
        Long idPaseador,
        String nombre,
        Integer dni,
        String email,
        String telefono,
        String direccion,
        String contrasena
) {

    public static PaseadorDTO desdeModelo(Paseador paseador) {
        return new PaseadorDTO(
                paseador.getId(),
                paseador.getNombre(),
                paseador.getDni(),
                paseador.getEmail(),
                paseador.getTelefono(),
                paseador.getDireccion(),
                paseador.getContrasena()
        );
    }
}
