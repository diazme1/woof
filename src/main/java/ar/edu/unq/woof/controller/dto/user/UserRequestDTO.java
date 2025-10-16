package ar.edu.unq.woof.controller.dto.user;

import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.modelo.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRequestDTO(
        String nombre,
        Integer dni,
        String email,
        String telefono,
        String direccion,
        String contrasena,
        UserRole rol,
        String biografia,
        String alias
) {

    public Usuario aModelo(){
        return new Usuario(nombre, dni, email, telefono, direccion, contrasena, rol, alias, biografia);
    }

//    public record UpdateUserRequest(
//            @NotBlank(message = "El nombre es obligatorio")
//            @Size(max = 100, message = "Nombre demasiado largo")
//            String nombre,
//
//            // Incluí apellido si tu entidad lo tiene (aunque no esté en UserDTO)
//            @Size(max = 100, message = "Apellido demasiado largo")
//            String apellido,
//
//            @Pattern(regexp = "^$|^\\+?\\d[\\d\\s-]{6,}$",
//                    message = "Teléfono inválido")
//            String telefono,
//
//            @Size(max = 255, message = "Dirección demasiado larga")
//            String direccion
//
//            // Cuando agregues estos campos al modelo, descomentalos y validalos:
//            // @Size(max = 64) String alias,
//            // @Size(max = 1000) String biografia,
//            // @Size(max = 512) String fotoPerfilUrl
//    ) {}
}
