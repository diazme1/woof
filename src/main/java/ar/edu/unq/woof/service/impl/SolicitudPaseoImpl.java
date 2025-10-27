package ar.edu.unq.woof.service.impl;

import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.modelo.enums.EstadoDePago;
import ar.edu.unq.woof.modelo.enums.EstadoSolicitud;
import ar.edu.unq.woof.modelo.exceptions.FranjaHorariaExcedida;
import ar.edu.unq.woof.modelo.exceptions.HorarioIncorrecto;
import ar.edu.unq.woof.modelo.exceptions.SolicitudNoEncontrada;
import ar.edu.unq.woof.modelo.exceptions.SolicitudaNoPagadaAceptada;
import ar.edu.unq.woof.persistence.PrecioDAO;
import ar.edu.unq.woof.persistence.SolicitudPaseoDAO;
import ar.edu.unq.woof.service.interfaces.SolicitudPaseoService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SolicitudPaseoImpl implements SolicitudPaseoService {

    private final SolicitudPaseoDAO paseoDAO;
    private final PrecioDAO precioDAO;

    public SolicitudPaseoImpl(SolicitudPaseoDAO userDAO, PrecioDAO precioDAO) { this.paseoDAO = userDAO;
        this.precioDAO = precioDAO;
    }

    @Override
    public SolicitudPaseo savePaseo(SolicitudPaseo paseo){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime max = now.plusHours(7);
        LocalTime cutoff = LocalTime.of(23, 0);

        LocalDateTime horario = paseo.getHorario();

        if (horario.isBefore(now) || horario.isAfter(max)) {
            throw new HorarioIncorrecto();
        }

        if (!horario.toLocalTime().isBefore(cutoff)) { // hasta 20.59
            throw new FranjaHorariaExcedida();
        }

        return paseoDAO.save(paseo);
    }

    @Override
    public Optional<SolicitudPaseo> getSolicitud(Long idPaseo) {
        return paseoDAO.findById(idPaseo);
    }

    @Override
    public List<SolicitudPaseo> getAllPendientes(){
        return paseoDAO.findAllEstado(EstadoSolicitud.PENDIENTE);
    }

    @Override
    public int contarLosPaseosDePaseador(Long idPaseador) {
        return paseoDAO.getPaseosPaseador(idPaseador).stream().filter(p -> p.getEstadoDeSolicitud().equals(EstadoSolicitud.FINALIZADA)).toList().size();
    }

    @Override
    public void finalizarSolicitud(Long id) {
        SolicitudPaseo solicitud = paseoDAO.recuperarSolicitudPaseo(id).orElseThrow(SolicitudNoEncontrada::new);
        if (solicitud.getEstadoDePago().equals(EstadoDePago.PAGO) && solicitud.getEstadoDeSolicitud().equals(EstadoSolicitud.ACEPTADA)) {
            solicitud.setEstadoDeSolicitud(EstadoSolicitud.FINALIZADA);
            paseoDAO.save(solicitud);
        } else {
            throw new SolicitudaNoPagadaAceptada();
        }
    }

    @Override
    public void guardarComprobante(Long id, MultipartFile comprobante) throws IOException {
        SolicitudPaseo solicitud = paseoDAO.findById(id)
                                            .orElseThrow(SolicitudNoEncontrada::new);

        if (!solicitud.getEstadoDePago().equals(EstadoDePago.PENDIENTE_DE_PAGO) ||
                !solicitud.getEstadoDeSolicitud().equals(EstadoSolicitud.ACEPTADA)) {
            throw new RuntimeException("La solicitud está pagada o no está en estado ACEPTADA");
        }

        // Crear carpeta de destino
        String projectDir = System.getProperty("user.dir");
        String baseUploadDir = projectDir + File.separator + "src" + File.separator + "main" + File.separator + "uploads";
        String uploadDir = baseUploadDir + File.separator + "solicitud_" + solicitud.getId();

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Guardar comprobante
        String comprobantePath = uploadDir + File.separator + "comprobante_" + comprobante.getOriginalFilename();
        comprobante.transferTo(new File(comprobantePath));

        // Actualizar solicitud
        solicitud.setComprobanteDePago(comprobantePath);
        solicitud.setEstadoDePago(EstadoDePago.PAGO);

        paseoDAO.save(solicitud);
    }

    @Override
    public void aceptarSolicitudPaseo(Long idPaseo, Long idPaseador) {
        SolicitudPaseo solicitud = paseoDAO.recuperarSolicitudPaseo(idPaseo).orElseThrow(SolicitudNoEncontrada::new);
        if (solicitud.getEstadoDeSolicitud().equals(EstadoSolicitud.PENDIENTE)) {
            solicitud.setEstadoDeSolicitud(EstadoSolicitud.ACEPTADA);
            solicitud.setIdPaseador(idPaseador);
            paseoDAO.save(solicitud);
        }
    }

    @Override
    public void cancelarSolicitudPaseo(Long idPaseo) {
        SolicitudPaseo solicitud = paseoDAO.recuperarSolicitudPaseo(idPaseo).orElseThrow(SolicitudNoEncontrada::new);
        if (!(solicitud.getEstadoDeSolicitud().equals(EstadoSolicitud.PENDIENTE) ||
                solicitud.getEstadoDeSolicitud().equals(EstadoSolicitud.ACEPTADA))) {
            throw new RuntimeException("La solicitud no se puede cancelar en este estado");
        }
        solicitud.setEstadoDeSolicitud(EstadoSolicitud.CANCELADA);
        paseoDAO.save(solicitud);
    }

    @Override
    public List<SolicitudPaseo> getSolicitudesDeCliente(Long idCliente) {
        return paseoDAO.findByIdCliente(idCliente);
    }

    // utilizados para que el paseador pueda visualizar todos sus paseos (con filtros o no)
    @Override
    public List<SolicitudPaseo> obtenerPaseosAceptados(Long idPaseador) {
        return paseoDAO.findPaseosPorPaseadorEnEstado(idPaseador, EstadoSolicitud.ACEPTADA);
    }

    @Override
    public List<SolicitudPaseo> obtenerPaseosHistoricos(Long idPaseador) {
        return paseoDAO.findPaseosPorPaseadorEnEstado(idPaseador, EstadoSolicitud.FINALIZADA);
    }

    @Override
    public List<SolicitudPaseo> obtenerPaseosPaseador(Long id) {
        return paseoDAO.findByIdPaseador(id);
    }

    @Override
    public Float getPrecioPaseos(){
        return precioDAO.findById(1L).get().getPrecio();
    }

    @Override
    public File getComprobante(Long id) {
        SolicitudPaseo solicitud = paseoDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        if (solicitud.getComprobanteDePago() == null) {
            throw new RuntimeException("No hay comprobante cargado para esta solicitud");
        }

        return new File(solicitud.getComprobanteDePago());
    }
}
