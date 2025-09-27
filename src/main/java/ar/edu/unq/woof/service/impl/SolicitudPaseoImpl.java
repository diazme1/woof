package ar.edu.unq.woof.service.impl;

import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.modelo.enums.EstadoSolicitud;
import ar.edu.unq.woof.modelo.exceptions.FranjaHorariaExcedida;
import ar.edu.unq.woof.modelo.exceptions.HorarioIncorrecto;
import ar.edu.unq.woof.modelo.exceptions.SolicitudNoEncontrada;
import ar.edu.unq.woof.persistence.SolicitudPaseoDAO;
import ar.edu.unq.woof.service.interfaces.SolicitudPaseoService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SolicitudPaseoImpl implements SolicitudPaseoService {

    private final SolicitudPaseoDAO paseoDAO;

    public SolicitudPaseoImpl(SolicitudPaseoDAO userDAO) { this.paseoDAO = userDAO; }

    @Override
    public SolicitudPaseo savePaseo(SolicitudPaseo paseo){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime max = now.plusHours(12);
        LocalTime cutoff = LocalTime.of(21, 0);

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
    public void cancelarSolicitudPaseo(Long idPaseo) {
        SolicitudPaseo solicitud = paseoDAO.recuperarSolicitudPaseo(idPaseo).orElseThrow(SolicitudNoEncontrada::new);
        if (!(solicitud.getEstado().equals(EstadoSolicitud.PENDIENTE) ||
                solicitud.getEstado().equals(EstadoSolicitud.ACEPTADA))) {
            throw new RuntimeException("La solicitud no se puede cancelar en este estado");
        }
        solicitud.setEstado(EstadoSolicitud.CANCELADA);
        paseoDAO.save(solicitud);
    }

    @Override
    public void aceptarSolicitudPaseo(Long idPaseo) {
        SolicitudPaseo solicitud = paseoDAO.recuperarSolicitudPaseo(idPaseo).orElseThrow(SolicitudNoEncontrada::new);
        if (solicitud.getEstado().equals(EstadoSolicitud.PENDIENTE)) {
            solicitud.setEstado(EstadoSolicitud.ACEPTADA);
            paseoDAO.save(solicitud);
        }
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

}
