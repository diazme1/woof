package ar.edu.unq.woof.service.impl;

import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.modelo.exceptions.FranjaHorariaExcedida;
import ar.edu.unq.woof.modelo.exceptions.HorarioIncorrecto;
import ar.edu.unq.woof.persistence.SolicitudPaseoDAO;
import ar.edu.unq.woof.service.interfaces.SolicitudPaseoService;
import jakarta.transaction.Transactional;
import org.springframework.data.repository.core.support.FragmentNotImplementedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

@Service
@Transactional
public class SolicitudPaseoImpl implements SolicitudPaseoService {

    private final SolicitudPaseoDAO paseoDAO;

    public SolicitudPaseoImpl(SolicitudPaseoDAO userDAO) { this.paseoDAO = userDAO; }

    @Override
    public void savePaseo(SolicitudPaseo paseo){
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

        paseoDAO.save(paseo);
    }

    @Override
    public Optional<SolicitudPaseo> getPaseo(Integer idPaseo){
        return paseoDAO.findById(idPaseo);
    }
}
