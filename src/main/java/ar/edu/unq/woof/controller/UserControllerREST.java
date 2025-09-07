package ar.edu.unq.woof.controller;

import ar.edu.unq.woof.controller.dto.paseador.PaseadorDTO;
import ar.edu.unq.woof.controller.dto.paseador.PaseadorRequestDTO;
import ar.edu.unq.woof.modelo.Paseador;
import ar.edu.unq.woof.service.interfaces.PaseadorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/paseador")
public class PaseadorControllerREST {

    private final PaseadorService paseadorService;

    public PaseadorControllerREST(PaseadorService paseadorService) {
        this.paseadorService = paseadorService;
    }

    @PostMapping
    public ResponseEntity<PaseadorDTO> savePaseador(@RequestBody PaseadorRequestDTO request){
        Paseador newPaseador = request.aModelo();
        paseadorService.savePaseador(newPaseador);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(PaseadorDTO.desdeModelo(newPaseador));
    }

}
