package ar.edu.unq.woof.service.impl;

import ar.edu.unq.woof.modelo.Usuario;
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
    public void savePaseador(Usuario usuario) {
        try {
            paseadorDAO.save(usuario);
        } catch (DataIntegrityViolationException e) {
            throw new CorreoDuplicadoPaseadorException(usuario.getEmail());
        }
    }

    @Override
    public Optional<Usuario> getPaseador(Long idPaseador) {
        return paseadorDAO.findById(idPaseador);
    }
}
