package ar.edu.unq.woof.controller.dto.paseo;

import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.modelo.enums.EstadoDePago;
import ar.edu.unq.woof.modelo.enums.EstadoSolicitud;
import ar.edu.unq.woof.modelo.enums.TamanoPerro;
import ar.edu.unq.woof.modelo.enums.ZonaOperativa;

import java.time.LocalDateTime;

public record SolicitudPaseoDTO(
        Long id,
        ZonaOperativa zona,
        LocalDateTime horario,
        String nombrePerro,
        TamanoPerro tamanoPerro,
        String raza,
        EstadoSolicitud estado,
        Long idCliente,
        Long idPaseador,
        EstadoDePago estadoPago
        Long idCliente,
        String detalles
) {
    public static SolicitudPaseoDTO desdeModelo(SolicitudPaseo solicitudPaseo) {
        return new SolicitudPaseoDTO(
                solicitudPaseo.getId(),
                solicitudPaseo.getZona(),
                solicitudPaseo.getHorario(),
                solicitudPaseo.getNombrePerro(),
                solicitudPaseo.getTamanoPerro(),
                solicitudPaseo.getRaza(),
                solicitudPaseo.getEstado(),
                solicitudPaseo.getIdCliente(),
                solicitudPaseo.getDetalles()
                solicitudPaseo.getEstadoDeSolicitud(),
                solicitudPaseo.getIdCliente(),
                solicitudPaseo.getIdPaseador(),
                solicitudPaseo.getEstadoDePago()
        );
    }
}
