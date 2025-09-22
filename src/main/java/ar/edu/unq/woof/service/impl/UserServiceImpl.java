package ar.edu.unq.woof.service.impl;

import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.modelo.enums.EstadoSolicitud;
import ar.edu.unq.woof.modelo.enums.EstadoValidacion;
import ar.edu.unq.woof.modelo.exceptions.CorreoDuplicadoPaseadorException;
import ar.edu.unq.woof.persistence.UserDAO;
import ar.edu.unq.woof.service.interfaces.UserService;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserDAO userDAO;

    public UserServiceImpl(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public void saveUser(Usuario usuario) {
        try {
            userDAO.save(usuario);
        } catch (DataIntegrityViolationException e) {
            throw new CorreoDuplicadoPaseadorException(usuario.getEmail());
        }
    }

    @Override
    public Optional<Usuario> getUser(Long idPaseador) {
        return userDAO.findById(idPaseador);
    }

    @Override
    public Usuario findByEmail(String email){
        return userDAO.findByEmail(email);
    }

    @Override
    public void validarUsuario(Long idUser, MultipartFile fotoDni, MultipartFile cv) throws IOException {
        Usuario usuario = userDAO.findById(idUser)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getRol().name().equals("ROLE_PASEADOR")) {
            throw new RuntimeException("Solo los paseadores pueden validar documentos");
        }

        String projectDir = System.getProperty("user.dir");
        String baseUploadDir = projectDir + File.separator + "src" + File.separator + "main" + File.separator + "uploads";
        String uploadDir = baseUploadDir + File.separator + "user_" + usuario.getId();

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

// Guardar DNI
        String dniPath = uploadDir + File.separator + "dni_" + fotoDni.getOriginalFilename();
        fotoDni.transferTo(new File(dniPath));
        usuario.setFotoDni(dniPath);

// Guardar CV
        String cvPath = uploadDir + File.separator + "cv_" + cv.getOriginalFilename();
        cv.transferTo(new File(cvPath));
        usuario.setCv(cvPath);

        usuario.setEstadoValidacion(EstadoValidacion.PENDIENTE);

        userDAO.save(usuario);
    }


    @Override
    public void aprobarValidacion(Long idUser) {
        Usuario usuario = userDAO.findById(idUser)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setEstadoValidacion(EstadoValidacion.APROBADO);
        userDAO.save(usuario);
    }

    @Override
    public List<Usuario> getUsuariosPendientesValidacion() {
        return userDAO.findByEstadoValidacion(EstadoValidacion.PENDIENTE);
    }

    @Override
    public void rechazarValidacion(Long id){
        Usuario usuario = userDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setEstadoValidacion(EstadoValidacion.RECHAZADO);
        userDAO.save(usuario);
    }

    @Override
    public File getFotoDNI(Long idUser) throws IOException {
        Usuario usuario = userDAO.findById(idUser)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getFotoDni() == null) {
            throw new RuntimeException("El usuario no tiene foto de DNI");
        }

        return new File(usuario.getFotoDni());
    }

    @Override
    public File getCV(Long idUser) throws IOException {
        Usuario usuario = userDAO.findById(idUser)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getCv() == null) {
            throw new RuntimeException("El usuario no tiene curriculum.");
        }

        return new File(usuario.getCv());
    }

}
