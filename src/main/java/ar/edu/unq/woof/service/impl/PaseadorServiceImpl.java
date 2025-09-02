package ar.edu.unq.woof.service.impl;

import ar.edu.unq.woof.modelo.Paseador;
import ar.edu.unq.woof.persistence.PaseadorDAO;
import ar.edu.unq.woof.service.interfaces.PaseadorService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class PaseadorServiceImpl implements PaseadorService {

    private final PaseadorDAO paseadorDAO;
    public PaseadorServiceImpl(PaseadorDAO paseadorDAO) {
        this.paseadorDAO = paseadorDAO;
    }

    @Override
    public void savePaseador(Paseador paseador) {
        paseadorDAO.save(paseador);
    }
}
