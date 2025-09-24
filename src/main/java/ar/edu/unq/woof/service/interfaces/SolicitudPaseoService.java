package ar.edu.unq.woof.service.interfaces;

import ar.edu.unq.woof.controller.dto.paseo.SolicitudPaseoDTO;
import ar.edu.unq.woof.modelo.SolicitudPaseo;

import java.util.List;
import java.util.Optional;

public interface SolicitudPaseoService {

    SolicitudPaseo savePaseo(SolicitudPaseo solicitudPaseo);
    Optional<SolicitudPaseo> getSolicitud(Long idPaseo);
    void aceptarSolicitudPaseo(Long idPaseo,Long id_paseador);
    List<SolicitudPaseo> getAllPendientes();
    int contarLosPaseosDePaseador(Long idPaseador);
}
