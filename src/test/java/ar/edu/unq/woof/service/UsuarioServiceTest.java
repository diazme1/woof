package ar.edu.unq.woof.service;

import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.modelo.enums.UserRole;
import ar.edu.unq.woof.service.interfaces.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

@SpringBootTest(properties = "spring.sql.init.mode=never")
public class UsuarioServiceTest {

    @Autowired
    private UserService userService;

    @Test
    public void savePaseador() {
        Usuario usuario = new Usuario("Emilia Diaz", 44555666, "x@x.com", "2215559999", "xxxx", "root", UserRole.ROLE_PASEADOR, "paseador.mp", "me llamo paseador y tengo 20 años");

        userService.saveUser(usuario);
    }

}
