package ar.edu.unq.woof.service.interfaces;

import ar.edu.unq.woof.modelo.SolicitudPaseo;

import java.util.Optional;

public interface SolicitudPaseoService {

    void savePaseo(SolicitudPaseo solicitudPaseo);
    Optional<SolicitudPaseo> getPaseo(Integer idPaseo);
}
