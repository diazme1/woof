package ar.edu.unq.woof.service.interfaces;

import ar.edu.unq.woof.modelo.Paseador;

import java.util.Optional;

public interface PaseadorService {

    public void savePaseador(Paseador paseador);
    public Optional<Paseador> getPaseador(Long idPaseador);
}
