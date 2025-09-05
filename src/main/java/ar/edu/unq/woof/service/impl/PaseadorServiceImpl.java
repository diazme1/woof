package ar.edu.unq.woof.service.impl;

import ar.edu.unq.woof.modelo.Paseador;
import ar.edu.unq.woof.modelo.exceptions.CorreoDuplicadoPaseadorException;
import ar.edu.unq.woof.persistence.PaseadorDAO;
import ar.edu.unq.woof.service.interfaces.PaseadorService;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@Transactional
public class PaseadorServiceImpl implements PaseadorService {

    private final PaseadorDAO paseadorDAO;

    public PaseadorServiceImpl(PaseadorDAO paseadorDAO) {
        this.paseadorDAO = paseadorDAO;
    }

    @Override
    public void savePaseador(Paseador paseador) {
        try {
            paseadorDAO.save(paseador);
        } catch (DataIntegrityViolationException e) {
            throw new CorreoDuplicadoPaseadorException(paseador.getEmail());
        }
    }

    @Override
    public Optional<Paseador> getPaseador(Long idPaseador) {
        return paseadorDAO.findById(idPaseador);
    }
}
