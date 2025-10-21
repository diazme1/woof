package ar.edu.unq.woof.service;

import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.modelo.enums.EstadoValidacion;
import ar.edu.unq.woof.modelo.enums.UserRole;
import ar.edu.unq.woof.modelo.exceptions.CorreoDuplicadoPaseadorException;
import ar.edu.unq.woof.service.interfaces.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = "spring.sql.init.mode=never")
public class UsuarioServiceTest {

    @Autowired
    private UserService userService;

    private Usuario paseador;
    private Usuario cliente;

    @BeforeEach
    void setUp() {
        paseador = new Usuario(
                "Juan Paseador",
                44111222,
                "juan@mail.com",
                "1122334455",
                "Calle 123",
                "password123",
                UserRole.ROLE_PASEADOR,
                "juanp",
                "Experiencia con perros de todos los tamaños"
        );

        cliente = new Usuario(
                "Maria Cliente",
                44333444,
                "maria@mail.com",
                "1133445566",
                "Avenida 456",
                "password456",
                UserRole.ROLE_CLIENTE,
                "mariac",
                "Dueña de dos perros"
        );
    }

    @AfterEach
    void tearDown() {
        userService.deleteAll();
    }

    @Test
    void cuandoSeGuardaUsuarioSeAsignaId() {
        Usuario nuevoPaseador = new Usuario(
                "Juan Paseador",
                44111222,
                "x@mail.com",
                "1122334455",
                "Calle 123",
                "password123",
                UserRole.ROLE_PASEADOR,
                "juanp",
                "Experiencia con perros de todos los tamaños"
        );
        userService.saveUser(nuevoPaseador);
        assertNotNull(nuevoPaseador.getId());
    }

    @Test
    void noSePuedenGuardarDosUsuariosConMismoEmail() {
        Usuario primerUsuario = new Usuario(
                "Juan Paseador",
                44111222,
                "duplicado@mail.com",
                "1122334455",
                "Calle 123",
                "password123",
                UserRole.ROLE_PASEADOR,
                "juanp",
                "Experiencia con perros de todos los tamaños"
        );
        userService.saveUser(primerUsuario);

        Usuario segundoUsuario = new Usuario(
                "Otro Usuario",
                99887766,
                "duplicado@mail.com", // mismo email
                "1133445566",
                "Otra Calle",
                "pass456",
                UserRole.ROLE_CLIENTE,
                "otroc",
                "bio"
        );

        assertThrows(CorreoDuplicadoPaseadorException.class, () -> {
            userService.saveUser(segundoUsuario);
        });
    }

    @Test
    void buscarUsuarioPorIdExistente() {
        Usuario nuevoCliente = new Usuario(
                "Maria Cliente",
                44333444,
                "tilin@mail.com",
                "1133445566",
                "Avenida 456",
                "password456",
                UserRole.ROLE_CLIENTE,
                "mariac",
                "Dueña de dos perros"
        );
        userService.saveUser(nuevoCliente);
        Optional<Usuario> encontrado = userService.getUser(nuevoCliente.getId());

        assertTrue(encontrado.isPresent());
        assertEquals(nuevoCliente.getEmail(), encontrado.get().getEmail());
    }

    @Test
    void buscarUsuarioPorIdNoExistente() {
        Optional<Usuario> noEncontrado = userService.getUser(999L);
        assertTrue(noEncontrado.isEmpty());
    }

    @Test
    void actualizarDatosUsuario() {
        Usuario nuevoPaseador = new Usuario(
                "Juan Paseador",
                44111222,
                "juanupdate@mail.com",
                "1122334455",
                "Calle 123",
                "password123",
                UserRole.ROLE_PASEADOR,
                "juanp",
                "Experiencia con perros de todos los tamaños"
        );
        userService.saveUser(nuevoPaseador);
        nuevoPaseador.setTelefono("1199887766");
        nuevoPaseador.setBiografia("Nueva biografía");

        userService.saveUser(nuevoPaseador);

        assertEquals("1199887766", nuevoPaseador.getTelefono());
        assertEquals("Nueva biografía", nuevoPaseador.getBiografia());
    }

    @Test
    void validarPaseador() {
        userService.saveUser(paseador);
        userService.aprobarValidacion(paseador.getId());

        Usuario validado = userService.getUser(paseador.getId())
                .orElseThrow();

        assertEquals(EstadoValidacion.APROBADO, validado.getEstadoValidacion());
    }

    @Test
    void rechazarPaseador() {
        userService.saveUser(paseador);
        userService.rechazarValidacion(paseador.getId());

        Usuario rechazado = userService.getUser(paseador.getId())
                .orElseThrow();

        assertEquals(EstadoValidacion.RECHAZADO, rechazado.getEstadoValidacion());
    }

    @Test
    void actualizarFotosYDocumentos() {
        userService.saveUser(paseador);
        paseador.setFotoPerfilUrl("foto.jpg");
        paseador.setFotoDni("dni.jpg");
        paseador.setCv("cv.pdf");

        userService.saveUser(paseador);

        assertEquals("foto.jpg", paseador.getFotoPerfilUrl());
        assertEquals("dni.jpg", paseador.getFotoDni());
        assertEquals("cv.pdf", paseador.getCv());
    }
}
