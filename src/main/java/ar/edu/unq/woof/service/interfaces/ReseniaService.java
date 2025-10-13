package ar.edu.unq.woof.service.interfaces;

import ar.edu.unq.woof.modelo.Resenia;

import java.util.List;

public interface ReseniaService {

    Resenia saveResenia(Resenia resenia);
    Resenia getReseniaById(Long idResenia);
    List<Resenia> getAllReseniasByPaseadorId(Long idPaseador);
    List<Long> getAllIdPaseosConResenia();
}
