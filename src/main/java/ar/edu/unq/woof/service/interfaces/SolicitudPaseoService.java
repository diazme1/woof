package ar.edu.unq.woof.service.interfaces;

import ar.edu.unq.woof.modelo.SolicitudPaseo;

import java.util.List;
import java.util.Optional;

public interface SolicitudPaseoService {

    SolicitudPaseo savePaseo(SolicitudPaseo solicitudPaseo);
    Optional<SolicitudPaseo> getSolicitud(Long idPaseo);
    void aceptarSolicitudPaseo(Long idPaseo);
    List<SolicitudPaseo> getAllPendientes();
}
