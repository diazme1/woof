package ar.edu.unq.woof.controller.dto.user;

import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.modelo.enums.UserRole;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class UserRequestDTOTest {

    @Test
    void crearUserRequestDTOConTodosLosCampos() {
        UserRequestDTO requestDTO = new UserRequestDTO(
                "Carlos López",
                44556677,
                "carlos@mail.com",
                "1144556677",
                "Calle Falsa 123",
                "password123",
                UserRole.ROLE_CLIENTE,
                "Cliente frecuente",
                "carlosl"
        );

        assertEquals("Carlos López", requestDTO.nombre());
        assertEquals(44556677, requestDTO.dni());
        assertEquals("carlos@mail.com", requestDTO.email());
        assertEquals("1144556677", requestDTO.telefono());
        assertEquals("Calle Falsa 123", requestDTO.direccion());
        assertEquals("password123", requestDTO.contrasena());
        assertEquals(UserRole.ROLE_CLIENTE, requestDTO.rol());
        assertEquals("Cliente frecuente", requestDTO.biografia());
        assertEquals("carlosl", requestDTO.alias());
    }

    @Test
    void aModeloConvierteUserRequestDTOAUsuario() {
        UserRequestDTO requestDTO = new UserRequestDTO(
                "Ana Martínez",
                33445566,
                "ana@mail.com",
                "1155667788",
                "Avenida Principal 789",
                "securepass",
                UserRole.ROLE_PASEADOR,
                "Paseadora profesional",
                "anam"
        );

        Usuario usuario = requestDTO.aModelo();

        assertNotNull(usuario);
        assertEquals("Ana Martínez", usuario.getNombre());
        assertEquals(33445566, usuario.getDni());
        assertEquals("ana@mail.com", usuario.getEmail());
        assertEquals("1155667788", usuario.getTelefono());
        assertEquals("Avenida Principal 789", usuario.getDireccion());
        assertEquals("securepass", usuario.getContrasena());
        assertEquals(UserRole.ROLE_PASEADOR, usuario.getRol());
        assertEquals("Paseadora profesional", usuario.getBiografia());
        assertEquals("anam", usuario.getAlias());
    }

    @Test
    void aModeloConvierteCorrectamentePaseador() {
        UserRequestDTO requestDTO = new UserRequestDTO(
                "Juan Paseador",
                11223344,
                "juan@mail.com",
                "1122334455",
                "Calle 123",
                "pass123",
                UserRole.ROLE_PASEADOR,
                "Experiencia con perros grandes",
                "juanp"
        );

        Usuario usuario = requestDTO.aModelo();

        assertNotNull(usuario);
        assertEquals(UserRole.ROLE_PASEADOR, usuario.getRol());
        assertEquals("Experiencia con perros grandes", usuario.getBiografia());
    }

    @Test
    void aModeloConvierteCorrectamenteCliente() {
        UserRequestDTO requestDTO = new UserRequestDTO(
                "María Cliente",
                22334455,
                "maria@mail.com",
                "1133445566",
                "Avenida 456",
                "password",
                UserRole.ROLE_CLIENTE,
                "Dueña de dos perros",
                "mariac"
        );

        Usuario usuario = requestDTO.aModelo();

        assertNotNull(usuario);
        assertEquals(UserRole.ROLE_CLIENTE, usuario.getRol());
        assertEquals("Dueña de dos perros", usuario.getBiografia());
    }

    @Test
    void dosUserRequestDTOConMismosDatosSonIguales() {
        UserRequestDTO dto1 = new UserRequestDTO(
                "Pedro", 11223344, "pedro@mail.com", "111",
                "Dir", "pass", UserRole.ROLE_CLIENTE, "bio", "pedrop"
        );
        UserRequestDTO dto2 = new UserRequestDTO(
                "Pedro", 11223344, "pedro@mail.com", "111",
                "Dir", "pass", UserRole.ROLE_CLIENTE, "bio", "pedrop"
        );

        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }

    @Test
    void dosUserRequestDTOConDiferentesDatosNoSonIguales() {
        UserRequestDTO dto1 = new UserRequestDTO(
                "Pedro", 11223344, "pedro@mail.com", "111",
                "Dir", "pass", UserRole.ROLE_CLIENTE, "bio", "pedrop"
        );
        UserRequestDTO dto2 = new UserRequestDTO(
                "Juan", 99887766, "juan@mail.com", "222",
                "Otra Dir", "pass2", UserRole.ROLE_PASEADOR, "otra bio", "juanp"
        );

        assertNotEquals(dto1, dto2);
        assertNotEquals(dto1.hashCode(), dto2.hashCode());
    }

    @Test
    void userRequestDTOConCamposNulos() {
        UserRequestDTO requestDTO = new UserRequestDTO(
                "Usuario", 12345678, "user@mail.com", null,
                null, "pass", UserRole.ROLE_CLIENTE, null, null
        );

        assertNotNull(requestDTO);
        assertEquals("Usuario", requestDTO.nombre());
        assertNull(requestDTO.telefono());
        assertNull(requestDTO.direccion());
        assertNull(requestDTO.biografia());
        assertNull(requestDTO.alias());
    }

    @Test
    void userRequestDTOConBiografiaNulaSeConvierteAModelo() {
        UserRequestDTO requestDTO = new UserRequestDTO(
                "Usuario Sin Bio", 87654321, "sinbio@mail.com", "111",
                "Calle", "pass", UserRole.ROLE_PASEADOR, null, "sinbio"
        );

        Usuario usuario = requestDTO.aModelo();

        assertNotNull(usuario);
        assertNull(usuario.getBiografia());
        assertEquals("Usuario Sin Bio", usuario.getNombre());
    }

    @Test
    void userRequestDTOConAliasNuloSeConvierteAModelo() {
        UserRequestDTO requestDTO = new UserRequestDTO(
                "Usuario Sin Alias", 11111111, "sinalias@mail.com", "222",
                "Avenida", "password", UserRole.ROLE_CLIENTE, "Bio", null
        );

        Usuario usuario = requestDTO.aModelo();

        assertNotNull(usuario);
        assertNull(usuario.getAlias());
        assertEquals("Usuario Sin Alias", usuario.getNombre());
        assertEquals("Bio", usuario.getBiografia());
    }

    @Test
    void toStringContieneTodosLosCamposImportantes() {
        UserRequestDTO requestDTO = new UserRequestDTO(
                "Test User", 99999999, "test@mail.com", "555",
                "Test Dir", "testpass", UserRole.ROLE_PASEADOR, "Test Bio", "testuser"
        );

        String toString = requestDTO.toString();

        assertTrue(toString.contains("Test User"));
        assertTrue(toString.contains("test@mail.com"));
        assertTrue(toString.contains("99999999"));
    }

    @Test
    void userRequestDTOConDiferentesRoles() {
        UserRequestDTO dtoCliente = new UserRequestDTO(
                "Cliente", 11111111, "cliente@mail.com", "111",
                "Dir1", "pass1", UserRole.ROLE_CLIENTE, "bio1", "cliente1"
        );

        UserRequestDTO dtoPaseador = new UserRequestDTO(
                "Paseador", 22222222, "paseador@mail.com", "222",
                "Dir2", "pass2", UserRole.ROLE_PASEADOR, "bio2", "paseador1"
        );

        assertEquals(UserRole.ROLE_CLIENTE, dtoCliente.rol());
        assertEquals(UserRole.ROLE_PASEADOR, dtoPaseador.rol());

        Usuario usuarioCliente = dtoCliente.aModelo();
        Usuario usuarioPaseador = dtoPaseador.aModelo();

        assertEquals(UserRole.ROLE_CLIENTE, usuarioCliente.getRol());
        assertEquals(UserRole.ROLE_PASEADOR, usuarioPaseador.getRol());
    }

    @Test
    void userRequestDTOConDNIyEmailUnicos() {
        UserRequestDTO dto1 = new UserRequestDTO(
                "Usuario1", 11111111, "user1@mail.com", "111",
                "Dir", "pass", UserRole.ROLE_CLIENTE, "bio", "user1"
        );

        UserRequestDTO dto2 = new UserRequestDTO(
                "Usuario2", 22222222, "user2@mail.com", "222",
                "Dir", "pass", UserRole.ROLE_CLIENTE, "bio", "user2"
        );

        assertNotEquals(dto1.dni(), dto2.dni());
        assertNotEquals(dto1.email(), dto2.email());
        assertNotEquals(dto1.alias(), dto2.alias());
    }
}

