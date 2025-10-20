package ar.edu.unq.woof.service.impl;

import ar.edu.unq.woof.controller.dto.user.UserRequestDTO;
import ar.edu.unq.woof.modelo.Precio;
import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.modelo.enums.EstadoValidacion;
import ar.edu.unq.woof.modelo.exceptions.CorreoDuplicadoPaseadorException;
import ar.edu.unq.woof.persistence.PrecioDAO;
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
    private final PrecioDAO precioDAO;

    public UserServiceImpl(UserDAO userDAO, PrecioDAO precioDAO) {
        this.userDAO = userDAO;
        this.precioDAO = precioDAO;
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
    public Usuario findByEmail(String email) {
        return userDAO.findByEmail(email);
    }

    @Override
    public void validarUsuario(Long idUser, MultipartFile fotoDni, MultipartFile cv, String alias) throws IOException {
        Usuario usuario = userDAO.findById(idUser)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getRol().name().equals("ROLE_PASEADOR")) {
            throw new RuntimeException("Solo los paseadores pueden validar documentos");
        }


        if (alias == null || alias.isBlank()) {
            throw new RuntimeException("El alias es obligatorio");
        }
        usuario.setAlias(alias);

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
    public void rechazarValidacion(Long id) {
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

        u.setNombre(req.nombre().trim());


        if (req.telefono() != null) {
            u.setTelefono(req.telefono().trim());
        }
        if (req.direccion() != null) u.setDireccion(req.direccion().trim());
        if (req.biografia() != null) u.setBiografia(req.biografia().trim());
        if (req.alias() != null) u.setAlias(req.alias().trim());


        return userDAO.save(u);
    }

    @Override
    public String actualizarFotoPerfil(Long idUser, MultipartFile file) throws IOException {
        Usuario usuario = userDAO.findById(idUser)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Archivo vacío");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new RuntimeException("El archivo debe ser una imagen");
        }

        String projectDir = System.getProperty("user.dir");
        String baseUploadDir = projectDir + File.separator + "src" + File.separator + "main" + File.separator + "uploads";
        String uploadDir = baseUploadDir + File.separator + "user_" + idUser;
        new File(uploadDir).mkdirs();


        String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "foto";
        String safeName = original.replaceAll("[\\s]+", "_").replaceAll("[^A-Za-z0-9._-]", "");
        String ext = safeName.contains(".") ? safeName.substring(safeName.lastIndexOf('.')) : ".jpg";
        String filename = "perfil_" + System.currentTimeMillis() + ext;

        File destino = new File(uploadDir + File.separator + filename);
        file.transferTo(destino);

        // borrar la anterior si la guardabas en disco
        if (usuario.getFotoPerfilUrl() != null && usuario.getFotoPerfilUrl().startsWith("file:")) {
            try {
                new File(usuario.getFotoPerfilUrl().substring("file:".length())).delete();
            } catch (Exception ignored) {
            }
        }

        // Guardamos la ruta física o lógica; acá guardo física con prefijo "file:" para poder borrarla luego
        usuario.setFotoPerfilUrl(destino.getAbsolutePath());
        userDAO.save(usuario);

        // URL pública para el front (endpoint GET)
        String publicUrl = "/user/" + idUser + "/foto-perfil";
        return publicUrl;
    }

    @Override
    public File getFotoPerfil(Long idUser) {
        Usuario usuario = userDAO.findById(idUser)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        String stored = usuario.getFotoPerfilUrl();
        if (stored == null) return null;


        return new File(stored);
    }

    @Override
    public void actualizarPrecio(Float nuevoPrecio) {
        Precio precio = precioDAO.findById(1L)
                .orElseGet(() -> {
                    Precio p = new Precio();
                    p.setPrecio(nuevoPrecio);
                    return p;
                });
        precio.setPrecio(nuevoPrecio);
        precioDAO.save(precio);
    }

    @Override
    public void deleteAll() {
        userDAO.deleteAll();
    }
}




