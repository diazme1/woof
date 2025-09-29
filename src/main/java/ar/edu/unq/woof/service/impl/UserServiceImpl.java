package ar.edu.unq.woof.service.impl;

import ar.edu.unq.woof.controller.dto.user.UserDTO;
import ar.edu.unq.woof.controller.dto.user.UserRequestDTO;
import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.modelo.enums.EstadoValidacion;
import ar.edu.unq.woof.modelo.exceptions.CorreoDuplicadoPaseadorException;
import ar.edu.unq.woof.persistence.UserDAO;
import ar.edu.unq.woof.service.interfaces.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.Period;
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
    public Optional<Usuario> getUser(Long id) {
        return userDAO.findById(id);
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

    @Override
    public String calcularAntiguedad(Long idUsuario) {
        Usuario u = userDAO.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        Period periodo = Period.between(u.getFechaRegistro(), LocalDate.now());

        return String.format("%d días y %d meses",
                periodo.getDays(), periodo.getMonths());
    }

    @Override
    public Usuario updatePerfil(Long id, UserRequestDTO req) {
        Usuario u = userDAO.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));


        if (req.nombre() == null || req.nombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }

        // Seteos (solo si vienen valores no nulos en el request)
        u.setNombre(req.nombre().trim());


        if (req.telefono() != null) {
            u.setTelefono(req.telefono().trim());
        }
        if (req.direccion() != null) u.setDireccion(req.direccion().trim());
        if (req.biografia() != null) u.setBiografia(req.biografia().trim());


        return userDAO.save(u);
    }
//    @Override
//    public String actualizarFotoPerfil(Long id, MultipartFile file) throws IOException {
//        Usuario u = userDAO.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));
//
//        if (file == null || file.isEmpty()) {
//            throw new IllegalArgumentException("Archivo de imagen requerido");
//        }
//        if (file.getSize() > 5_000_000L) {
//            throw new IllegalArgumentException("La imagen no puede superar 5MB");
//        }
//
//        // Guardado simple en disco local (mismo patrón que usás para DNI/CV)
//        Path dir = Paths.get("uploads", "avatars", String.valueOf(id));
//        Files.createDirectories(dir);
//
//        String safeName = file.getOriginalFilename() == null ? "avatar.jpg" : file.getOriginalFilename();
//        String filename = "avatar_" + System.currentTimeMillis() + "_" + safeName;
//        Path dest = dir.resolve(filename);
//
//        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
//
//        // URL pública (ajustá según cómo sirvas estáticos)
//        String publicUrl = "/static/avatars/" + id + "/" + filename;
//
//        u.setFotoPerfilUrl(publicUrl);
//        userDAO.save(u);
//
//        return publicUrl;
//    }
}




