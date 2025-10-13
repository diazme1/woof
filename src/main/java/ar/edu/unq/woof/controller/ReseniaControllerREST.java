package ar.edu.unq.woof.controller;

import ar.edu.unq.woof.controller.dto.paseo.SolicitudPaseoDTO;
import ar.edu.unq.woof.controller.dto.resenia.ReseniaDTO;
import ar.edu.unq.woof.controller.dto.resenia.ReseniaRequestDTO;
import ar.edu.unq.woof.modelo.Resenia;
import ar.edu.unq.woof.service.interfaces.ReseniaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/resenia")
public class ReseniaControllerREST {

    private final ReseniaService reseniaService;

    public ReseniaControllerREST(ReseniaService reseniaService) {
        this.reseniaService = reseniaService;
    }

    @PostMapping
    public ResponseEntity<ReseniaDTO> saveResenia(@RequestBody ReseniaRequestDTO request) {
        Resenia newResenia = request.aModelo();
        Resenia savedResenia = reseniaService.saveResenia(newResenia);
        return ResponseEntity.status(HttpStatus.CREATED).body(ReseniaDTO.desdeModelo(savedResenia));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReseniaDTO> getReseniaById(@PathVariable Long id) {
        Resenia resenia = reseniaService.getReseniaById(id);
        return ResponseEntity.ok(ReseniaDTO.desdeModelo(resenia));
    }

    @GetMapping("paseador/{idPaseador}")
    public ResponseEntity<List<ReseniaDTO>> getAllReseniasByPaseadorId(@PathVariable Long idPaseador) {
        List<Resenia> resenias = reseniaService.getAllReseniasByPaseadorId(idPaseador);
        List<ReseniaDTO> reseniaDTOs = resenias.stream()
                .map(ReseniaDTO::desdeModelo)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reseniaDTOs);
    }

    @GetMapping("/resenias-paseos")
    public ResponseEntity<List<Long>> getAllIdPaseosConResenia() {
        List<Long> idPaseos = reseniaService.getAllIdPaseosConResenia();
        return ResponseEntity.ok(idPaseos);
    }
}
