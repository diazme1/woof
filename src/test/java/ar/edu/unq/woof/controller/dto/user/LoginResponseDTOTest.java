package ar.edu.unq.woof.controller.dto.user;

import ar.edu.unq.woof.modelo.enums.EstadoValidacion;
import ar.edu.unq.woof.modelo.enums.UserRole;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

public class LoginResponseDTOTest {

    @Test
    void crearLoginResponseDTOConTodosLosCampos() {
        UserDTO userDTO = new UserDTO(
                1L, "Juan Pérez", 12345678, "juan@mail.com", "111",
                "Calle", "dni.jpg", "cv.pdf", EstadoValidacion.APROBADO,
                LocalDate.now(), "bio", "foto.jpg", "juanp"
        );

        LoginResponseDTO responseDTO = new LoginResponseDTO(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                userDTO,
                "Juan Pérez",
                "juan@mail.com",
                UserRole.ROLE_PASEADOR,
                1L
        );

        assertEquals("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", responseDTO.token());
        assertEquals(userDTO, responseDTO.user());
        assertEquals("Juan Pérez", responseDTO.nombre());
        assertEquals("juan@mail.com", responseDTO.email());
        assertEquals(UserRole.ROLE_PASEADOR, responseDTO.rol());
        assertEquals(1L, responseDTO.id());
    }

    @Test
    void dosLoginResponseDTOConMismosDatosSonIguales() {
        UserDTO userDTO = new UserDTO(
                1L, "María", 87654321, "maria@mail.com", "222",
                "Avenida", "dni2.jpg", "cv2.pdf", EstadoValidacion.PENDIENTE,
                LocalDate.now(), "bio2", "foto2.jpg", "mariac"
        );

        LoginResponseDTO dto1 = new LoginResponseDTO(
                "token123", userDTO, "María", "maria@mail.com",
                UserRole.ROLE_CLIENTE, 1L
        );
        LoginResponseDTO dto2 = new LoginResponseDTO(
                "token123", userDTO, "María", "maria@mail.com",
                UserRole.ROLE_CLIENTE, 1L
        );

        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }

    @Test
    void loginResponseDTOConTokenVacio() {
        LoginResponseDTO responseDTO = new LoginResponseDTO(
                "", null, "Usuario", "user@mail.com",
                UserRole.ROLE_CLIENTE, 1L
        );

        assertNotNull(responseDTO);
        assertEquals("", responseDTO.token());
        assertNull(responseDTO.user());
    }
}

