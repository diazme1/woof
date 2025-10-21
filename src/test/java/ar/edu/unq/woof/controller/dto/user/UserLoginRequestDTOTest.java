package ar.edu.unq.woof.controller.dto.user;

import ar.edu.unq.woof.modelo.enums.EstadoValidacion;
import ar.edu.unq.woof.modelo.enums.UserRole;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

public class UserLoginRequestDTOTest {

    @Test
    void crearUserLoginRequestDTOConTodosLosCampos() {
        UserDTO userDTO = new UserDTO(
                1L, "Pedro Gómez", 11223344, "pedro@mail.com", "333",
                "Calle Principal", "dni.jpg", "cv.pdf",
                EstadoValidacion.APROBADO, LocalDate.now(), "Biografía",
                "foto.jpg", "pedrog"
        );

        UserLoginRequestDTO loginRequest = new UserLoginRequestDTO(
                "pedro@mail.com",
                "password123",
                userDTO
        );

        assertEquals("pedro@mail.com", loginRequest.email());
        assertEquals("password123", loginRequest.contrasena());
        assertEquals(userDTO, loginRequest.userDTO());
    }

    @Test
    void crearUserLoginRequestDTOSinUserDTO() {
        UserLoginRequestDTO loginRequest = new UserLoginRequestDTO(
                "usuario@mail.com",
                "securepass",
                null
        );

        assertEquals("usuario@mail.com", loginRequest.email());
        assertEquals("securepass", loginRequest.contrasena());
        assertNull(loginRequest.userDTO());
    }

    @Test
    void dosUserLoginRequestDTOConMismosDatosSonIguales() {
        UserDTO userDTO = new UserDTO(
                1L, "Ana", 55667788, "ana@mail.com", "444",
                "Dir", "dni.jpg", "cv.pdf", EstadoValidacion.PENDIENTE,
                LocalDate.now(), "bio", "foto.jpg", "anac"
        );

        UserLoginRequestDTO dto1 = new UserLoginRequestDTO(
                "ana@mail.com", "pass", userDTO
        );
        UserLoginRequestDTO dto2 = new UserLoginRequestDTO(
                "ana@mail.com", "pass", userDTO
        );

        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }

    @Test
    void userLoginRequestDTOConCamposVacios() {
        UserLoginRequestDTO loginRequest = new UserLoginRequestDTO(
                "", "", null
        );

        assertNotNull(loginRequest);
        assertEquals("", loginRequest.email());
        assertEquals("", loginRequest.contrasena());
        assertNull(loginRequest.userDTO());
    }
}


