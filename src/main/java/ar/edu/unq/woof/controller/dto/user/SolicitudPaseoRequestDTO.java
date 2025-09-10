package ar.edu.unq.woof.controller.dto.user;

import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.modelo.enums.TamanoPerro;
import ar.edu.unq.woof.modelo.enums.ZonaOperativa;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

public record SolicitudPaseoRequestDTO(
        ZonaOperativa zona,
        LocalDateTime horario,
        String nombrePerro,
        TamanoPerro tamanoPerro,
        String raza
) {
    public SolicitudPaseo aModelo() {
        return new SolicitudPaseo(zona, horario, nombrePerro, tamanoPerro, raza);
    }
}
