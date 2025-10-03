package ar.edu.unq.woof.controller.dto.user;

import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.modelo.enums.EstadoValidacion;

import java.time.LocalDate;

public record UserDTO(
        Long idPaseador,
        String nombre,
        Integer dni,
        String email,
        String telefono,
        String direccion,
        String fotoDni,
        String cv,
        EstadoValidacion validado,
        LocalDate fechaRegistro,
        String biografia,
        String fotoPerfilUrl,
        String alias
) {

    public static UserDTO desdeModelo(Usuario usuario) {
        return new UserDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getDni(),
                usuario.getEmail(),
                usuario.getTelefono(),
                usuario.getDireccion(),
                usuario.getFotoDni(),
                usuario.getCv(),
                usuario.getEstadoValidacion(),
                usuario.getFechaRegistro(),
                usuario.getBiografia(),
                usuario.getFotoPerfilUrl(),
                usuario.getAlias()
        );
    }
}
