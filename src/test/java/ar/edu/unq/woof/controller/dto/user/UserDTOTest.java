package ar.edu.unq.woof.controller.dto.user;

import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.modelo.enums.EstadoValidacion;
import ar.edu.unq.woof.modelo.enums.UserRole;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

public class UserDTOTest {

    @Test
    void crearUserDTOConTodosLosCampos() {
        UserDTO userDTO = new UserDTO(
                1L,
                "Juan Pérez",
                12345678,
                "juan@mail.com",
                "1122334455",
                "Calle 123",
                "fotoDni.jpg",
                "cv.pdf",
                EstadoValidacion.APROBADO,
                LocalDate.of(2024, 1, 15),
                "Experiencia con perros",
                "foto.jpg",
                "juanp"
        );

        assertEquals(1L, userDTO.idPaseador());
        assertEquals("Juan Pérez", userDTO.nombre());
        assertEquals(12345678, userDTO.dni());
        assertEquals("juan@mail.com", userDTO.email());
        assertEquals("1122334455", userDTO.telefono());
        assertEquals("Calle 123", userDTO.direccion());
        assertEquals("fotoDni.jpg", userDTO.fotoDni());
        assertEquals("cv.pdf", userDTO.cv());
        assertEquals(EstadoValidacion.APROBADO, userDTO.validado());
        assertEquals(LocalDate.of(2024, 1, 15), userDTO.fechaRegistro());
        assertEquals("Experiencia con perros", userDTO.biografia());
        assertEquals("foto.jpg", userDTO.fotoPerfilUrl());
        assertEquals("juanp", userDTO.alias());
    }

    @Test
    void desdeModeloConvierteUsuarioAUserDTO() {
        Usuario usuario = new Usuario(
                "María García",
                87654321,
                "maria@mail.com",
                "1133445566",
                "Avenida 456",
                "password123",
                UserRole.ROLE_PASEADOR,
                "mariac",
                "Amante de los animales"
        );
        usuario.setId(2L);
        usuario.setFotoDni("dni.jpg");
        usuario.setCv("curriculum.pdf");
        usuario.setEstadoValidacion(EstadoValidacion.PENDIENTE);
        usuario.setFotoPerfilUrl("perfil.jpg");

        UserDTO userDTO = UserDTO.desdeModelo(usuario);

        assertEquals(2L, userDTO.idPaseador());
        assertEquals("María García", userDTO.nombre());
        assertEquals(87654321, userDTO.dni());
        assertEquals("maria@mail.com", userDTO.email());
        assertEquals("1133445566", userDTO.telefono());
        assertEquals("Avenida 456", userDTO.direccion());
        assertEquals("dni.jpg", userDTO.fotoDni());
        assertEquals("curriculum.pdf", userDTO.cv());
        assertEquals(EstadoValidacion.PENDIENTE, userDTO.validado());
        assertEquals("Amante de los animales", userDTO.biografia());
        assertEquals("perfil.jpg", userDTO.fotoPerfilUrl());
        assertEquals("mariac", userDTO.alias());
        assertNotNull(userDTO.fechaRegistro());
    }

    @Test
    void dosUserDTOConMismosDatosSonIguales() {
        LocalDate fecha = LocalDate.of(2024, 1, 15);
        UserDTO userDTO1 = new UserDTO(
                1L, "Juan", 12345678, "juan@mail.com", "111",
                "Calle", "dni.jpg", "cv.pdf", EstadoValidacion.APROBADO,
                fecha, "bio", "foto.jpg", "juanp"
        );
        UserDTO userDTO2 = new UserDTO(
                1L, "Juan", 12345678, "juan@mail.com", "111",
                "Calle", "dni.jpg", "cv.pdf", EstadoValidacion.APROBADO,
                fecha, "bio", "foto.jpg", "juanp"
        );

        assertEquals(userDTO1, userDTO2);
        assertEquals(userDTO1.hashCode(), userDTO2.hashCode());
    }

    @Test
    void userDTOConDatosNulosNoLanzaExcepcion() {
        UserDTO userDTO = new UserDTO(
                1L, "Juan", 12345678, "juan@mail.com", null,
                null, null, null, EstadoValidacion.PENDIENTE,
                LocalDate.now(), null, null, "juanp"
        );

        assertNotNull(userDTO);
        assertNull(userDTO.telefono());
        assertNull(userDTO.direccion());
        assertNull(userDTO.biografia());
    }
}

