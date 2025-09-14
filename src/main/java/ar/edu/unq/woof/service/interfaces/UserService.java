package ar.edu.unq.woof.service.interfaces;

import ar.edu.unq.woof.modelo.Usuario;

import java.util.Optional;

public interface UserService {

    void saveUser(Usuario user);
    Optional<Usuario> getUser(Long idUser);
    Usuario findByEmail(String email);
}
