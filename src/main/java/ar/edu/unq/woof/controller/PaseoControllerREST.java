package ar.edu.unq.woof.controller;

import ar.edu.unq.woof.controller.dto.user.SolicitudPaseoDTO;
import ar.edu.unq.woof.controller.dto.user.SolicitudPaseoRequestDTO;
import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.service.interfaces.SolicitudPaseoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/paseo")
public class PaseoControllerREST {

    private final SolicitudPaseoService solicitudService;

    public PaseoControllerREST(SolicitudPaseoService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @PostMapping
    public ResponseEntity<SolicitudPaseoDTO> saveSolicitudPaseo(@RequestBody SolicitudPaseoRequestDTO request) {
        SolicitudPaseo newSolicitud = request.aModelo();
        solicitudService.savePaseo(newSolicitud);
        return  ResponseEntity.status(HttpStatus.CREATED).body(SolicitudPaseoDTO.desdeModelo(newSolicitud));

    }

}
