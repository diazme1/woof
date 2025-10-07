//package ar.edu.unq.woof.service;
//
//import ar.edu.unq.woof.modelo.Usuario;
//import ar.edu.unq.woof.modelo.enums.EstadoValidacion;
//import ar.edu.unq.woof.modelo.enums.UserRole;
//import ar.edu.unq.woof.service.interfaces.UserService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.dao.DataIntegrityViolationException;
//
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest(properties = "spring.sql.init.mode=never")
//public class UsuarioServiceTest {
//
//    @Autowired
//    private UserService userService;
//
//    private Usuario paseador;
//    private Usuario cliente;
//
//    @BeforeEach
//    void setUp() {
//        paseador = new Usuario(
//                "Juan Paseador",
//                44111222,
//                "juan@mail.com",
//                "1122334455",
//                "Calle 123",
//                "password123",
//                UserRole.ROLE_PASEADOR,
//                "juanp",
//                "Experiencia con perros de todos los tamaños"
//        );
//
//        cliente = new Usuario(
//                "Maria Cliente",
//                44333444,
//                "maria@mail.com",
//                "1133445566",
//                "Avenida 456",
//                "password456",
//                UserRole.ROLE_CLIENTE,
//                "mariac",
//                "Dueña de dos perros"
//        );
//    }
//
//    @Test
//    void cuandoSeGuardaUsuarioSeAsignaId() {
//        paseador = new Usuario(
//                "Juan Paseador",
//                44111222,
//                "x@mail.com",
//                "1122334455",
//                "Calle 123",
//                "password123",
//                UserRole.ROLE_PASEADOR,
//                "juanp",
//                "Experiencia con perros de todos los tamaños"
//        );
//        userService.saveUser(paseador);
//        assertNotNull(paseador.getId());
//    }
//
//    @Test
//    void noSePuedenGuardarDosUsuariosConMismoDni() {
//        paseador = new Usuario(
//                "Juan Paseador",
//                44111222,
//                "pop@mail.com",
//                "1122334455",
//                "Calle 123",
//                "password123",
//                UserRole.ROLE_PASEADOR,
//                "juanp",
//                "Experiencia con perros de todos los tamaños"
//        );
//        userService.saveUser(paseador);
//        Usuario otroPaseador = new Usuario(
//                "Otro",
//                paseador.getDni(), // mismo DNI
//                "otro@mail.com",
//                "1122334455",
//                "Otra Calle",
//                "pass123",
//                UserRole.ROLE_PASEADOR,
//                "otrop",
//                "bio"
//        );
//
//        assertThrows(DataIntegrityViolationException.class, () -> {
//            userService.saveUser(otroPaseador);
//        });
//    }
//
//    @Test
//    void buscarUsuarioPorIdExistente() {
//        cliente = new Usuario(
//                "Maria Cliente",
//                44333444,
//                "tilin@mail.com",
//                "1133445566",
//                "Avenida 456",
//                "password456",
//                UserRole.ROLE_CLIENTE,
//                "mariac",
//                "Dueña de dos perros"
//        );
//        userService.saveUser(cliente);
//        Optional<Usuario> encontrado = userService.getUser(cliente.getId());
//
//        assertTrue(encontrado.isPresent());
//        assertEquals(cliente.getEmail(), encontrado.get().getEmail());
//    }
//
//    @Test
//    void buscarUsuarioPorIdNoExistente() {
//        Optional<Usuario> noEncontrado = userService.getUser(999L);
//        assertTrue(noEncontrado.isEmpty());
//    }
//
//    @Test
//    void actualizarDatosUsuario() {
//        paseador = new Usuario(
//                "Juan Paseador",
//                44111222,
//                "juan@mail.com",
//                "1122334455",
//                "Calle 123",
//                "password123",
//                UserRole.ROLE_PASEADOR,
//                "juanp",
//                "Experiencia con perros de todos los tamaños"
//        );
//        userService.saveUser(paseador);
//        paseador.setTelefono("1199887766");
//        paseador.setBiografia("Nueva biografía");
//
//        userService.saveUser(paseador);
//
//        assertEquals("1199887766", paseador.getTelefono());
//        assertEquals("Nueva biografía", paseador.getBiografia());
//    }
//
//    @Test
//    void validarPaseador() {
//        userService.saveUser(paseador);
//        userService.aprobarValidacion(paseador.getId());
//
//        Usuario validado = userService.getUser(paseador.getId())
//                .orElseThrow();
//
//        assertEquals(EstadoValidacion.APROBADO, validado.getEstadoValidacion());
//    }
//
//    @Test
//    void rechazarPaseador() {
//        userService.saveUser(paseador);
//        userService.rechazarValidacion(paseador.getId());
//
//        Usuario rechazado = userService.getUser(paseador.getId())
//                .orElseThrow();
//
//        assertEquals(EstadoValidacion.RECHAZADO, rechazado.getEstadoValidacion());
//    }
//
//    @Test
//    void actualizarFotosYDocumentos() {
//        userService.saveUser(paseador);
//        paseador.setFotoPerfilUrl("foto.jpg");
//        paseador.setFotoDni("dni.jpg");
//        paseador.setCv("cv.pdf");
//
//        userService.saveUser(paseador);
//
//        assertEquals("foto.jpg", paseador.getFotoPerfilUrl());
//        assertEquals("dni.jpg", paseador.getFotoDni());
//        assertEquals("cv.pdf", paseador.getCv());
//    }
//}
