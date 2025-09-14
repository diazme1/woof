package ar.edu.unq.woof.service;

import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.modelo.enums.EstadoSolicitud;
import ar.edu.unq.woof.modelo.enums.TamanoPerro;
import ar.edu.unq.woof.modelo.enums.ZonaOperativa;
import ar.edu.unq.woof.service.interfaces.SolicitudPaseoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class SolicitudPaseoTest {

    @Autowired
    private SolicitudPaseoService solicitudPaseoService;

    @Test
    public void savSolicitudPaseo() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime horario = now.plusMinutes(15);


        SolicitudPaseo solicitudPaseo = new SolicitudPaseo(ZonaOperativa.QUILMES, horario, "Abdu", TamanoPerro.GRANDE, "Labrador");
        solicitudPaseoService.savePaseo(solicitudPaseo);
    }

}
