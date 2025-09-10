package ar.edu.unq.woof.controller;

import ar.edu.unq.woof.controller.dto.user.SolicitudPaseoDTO;
import ar.edu.unq.woof.controller.dto.user.SolicitudPaseoRequestDTO;
import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.service.interfaces.SolicitudPaseoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        SolicitudPaseo saved = solicitudService.savePaseo(newSolicitud);

        return ResponseEntity.status(HttpStatus.CREATED).body(SolicitudPaseoDTO.desdeModelo(saved));
    }


    @PutMapping("/{id}")
    public ResponseEntity<SolicitudPaseoDTO> updateSolicitudPaseo(@PathVariable Long id, @RequestBody SolicitudPaseoRequestDTO request) {
        solicitudService.aceptarSolicitudPaseo(id);

        SolicitudPaseo solicitud = solicitudService.getSolicitud(id).orElseThrow(() -> new EntityNotFoundException("Solicitud de paseo no encontrada con id " + id));

        return ResponseEntity.ok(SolicitudPaseoDTO.desdeModelo(solicitud));

    }

}
