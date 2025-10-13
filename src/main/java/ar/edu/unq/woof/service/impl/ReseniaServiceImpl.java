package ar.edu.unq.woof.service.impl;

import ar.edu.unq.woof.modelo.Resenia;
import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.persistence.ReseniaDAO;
import ar.edu.unq.woof.service.interfaces.ReseniaService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ReseniaServiceImpl implements ReseniaService {

    private ReseniaDAO reseniaDAO;

    public ReseniaServiceImpl(ReseniaDAO reseniaDAO) {
        this.reseniaDAO = reseniaDAO;
    }

    @Override
    public Resenia saveResenia(Resenia resenia) {
        return reseniaDAO.save(resenia);
    }

    @Override
    public Resenia getReseniaById(Long idResenia) {
        return reseniaDAO.findById(idResenia).orElseThrow(() -> new EntityNotFoundException("Resenia no encontrada"));
    }

    @Override
    public List<Resenia> getAllReseniasByPaseadorId(Long idPaseador) {
        return reseniaDAO.findByIdPaseador(idPaseador);
    }

    @Override
    public List<Long> getAllIdPaseosConResenia() {
        return reseniaDAO.findAllIdPaseosConResenia();
    }
}
