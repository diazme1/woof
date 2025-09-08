package ar.edu.unq.woof.service;

import ar.edu.unq.woof.modelo.Paseador;
import ar.edu.unq.woof.service.interfaces.PaseadorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class PaseadorServiceTest {

    @Autowired
    private PaseadorService paseadorSer;

    @Test
    public void savePaseador() {
        Paseador paseador = new Paseador("Emilia Diaz", 44555666, "x@x.com", "2215559999", "xxxx", "root");
        paseadorSer.savePaseador(paseador);
    }

}
