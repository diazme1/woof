package ar.edu.unq.woof.service.interfaces;

import ar.edu.unq.woof.modelo.Usuario;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public interface UserService {

    void saveUser(Usuario user);
    Optional<Usuario> getUser(Long idUser);
    Usuario findByEmail(String email);
    void validarUsuario(Long idUser, MultipartFile fotoDni, MultipartFile cv) throws IOException;
    void aprobarValidacion(Long idUser);
}
