package ar.edu.unq.woof.service;

import ar.edu.unq.woof.modelo.Resenia;
import ar.edu.unq.woof.modelo.exceptions.PuntajeInvalidoException;
import ar.edu.unq.woof.service.interfaces.ReseniaService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ReseniaServiceTest {

    @Autowired
    private ReseniaService reseniaService;

    private Resenia resenia;
    private final Long ID_CLIENTE = 1L;
    private final Long ID_PASEADOR = 2L;
    private final Long ID_PASEO = 3L;

    @BeforeEach
    void setUp() {
        resenia = new Resenia(ID_PASEADOR, ID_CLIENTE, ID_PASEO, 5, "Excelente servicio");
    }

    @Test
    void saveResenia() {
        reseniaService.saveResenia(resenia);

        Resenia reseniaRecuperada = reseniaService.getReseniaById(resenia.getId());

        assertNotNull(reseniaRecuperada);
        assertEquals(ID_CLIENTE, reseniaRecuperada.getIdCliente());
        assertEquals(ID_PASEADOR, reseniaRecuperada.getIdPaseador());
        assertEquals(ID_PASEO, reseniaRecuperada.getIdPaseo());
        assertEquals(5, reseniaRecuperada.getPuntuacion());
        assertEquals("Excelente servicio", reseniaRecuperada.getDescripcion());
    }

    @Test
    void getReseniaInexistente() {
        assertThrows(EntityNotFoundException.class, () ->
            reseniaService.getReseniaById(999L)
        );
    }

    @Test
    void getAllReseniasPaseador() {
        Resenia resenia1 = new Resenia(ID_PASEADOR, 1L, 1L, 5, "Muy bueno");
        Resenia resenia2 = new Resenia(ID_PASEADOR, 2L, 2L, 4, "Buen servicio");
        Resenia resenia3 = new Resenia(ID_PASEADOR, 3L, 3L, 5, "Excelente");

        reseniaService.saveResenia(resenia1);
        reseniaService.saveResenia(resenia2);
        reseniaService.saveResenia(resenia3);

        List<Resenia> resenias = reseniaService.getAllReseniasByPaseadorId(ID_PASEADOR);

        assertNotNull(resenias);
        assertEquals(3, resenias.size());
        assertTrue(resenias.stream().allMatch(r -> r.getIdPaseador().equals(ID_PASEADOR)));
    }

    @Test
    void getAllReseniasPaseadorVacio() {
        List<Resenia> resenias = reseniaService.getAllReseniasByPaseadorId(999L);

        assertNotNull(resenias);
        assertTrue(resenias.isEmpty());
    }

    @Test
    void saveReseniaConPuntakeInvalido() {
        PuntajeInvalidoException exception1 = assertThrows(PuntajeInvalidoException.class, () -> {
            new Resenia(ID_CLIENTE, ID_PASEADOR, ID_PASEO, 6, "Puntaje inválido");
        });

        assertEquals("La puntuación debe estar entre 0 y 5.", exception1.getMessage());

        PuntajeInvalidoException exception2 = assertThrows(PuntajeInvalidoException.class, () -> {
            new Resenia(ID_CLIENTE, ID_PASEADOR, ID_PASEO, -1, "Puntaje inválido");
        });

        assertEquals("La puntuación debe estar entre 0 y 5.", exception2.getMessage());
    }
}
