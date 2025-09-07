package ar.edu.unq.woof.service.interfaces;

import ar.edu.unq.woof.modelo.Usuario;

import java.util.Optional;

public interface PaseadorService {

    public void savePaseador(Usuario usuario);
    public Optional<Usuario> getPaseador(Long idPaseador);
}
