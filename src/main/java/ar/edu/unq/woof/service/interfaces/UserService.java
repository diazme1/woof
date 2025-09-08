package ar.edu.unq.woof.service.interfaces;

import ar.edu.unq.woof.modelo.Usuario;

import java.util.Optional;

public interface UserService {

    public void saveUser(Usuario user);
    public Optional<Usuario> getUser(Long idUser);
}
