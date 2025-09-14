package ar.edu.unq.woof.controller.dto.user;

import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.modelo.enums.EstadoSolicitud;
import ar.edu.unq.woof.modelo.enums.TamanoPerro;
import ar.edu.unq.woof.modelo.enums.ZonaOperativa;

import java.time.LocalDateTime;

public record SolicitudPaseoDTO(
        ZonaOperativa zona,
        LocalDateTime horario,
        Long solicitudId,
        String nombrePerro,
        TamanoPerro tamanoPerro,
        String raza,
        EstadoSolicitud estado
) {

    public static SolicitudPaseoDTO desdeModelo(SolicitudPaseo solicitudPaseo) {
        return new SolicitudPaseoDTO(
                solicitudPaseo.getZona(),
                solicitudPaseo.getHorario(),
                solicitudPaseo.getId(),
                solicitudPaseo.getNombrePerro(),
                solicitudPaseo.getTamanoPerro(),
                solicitudPaseo.getRaza(),
                solicitudPaseo.getEstado()
        );
    }
}
