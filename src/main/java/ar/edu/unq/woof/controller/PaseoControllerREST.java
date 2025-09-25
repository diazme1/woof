package ar.edu.unq.woof.controller;

import ar.edu.unq.woof.controller.dto.paseo.SolicitudPaseoDTO;
import ar.edu.unq.woof.controller.dto.paseo.SolicitudPaseoRequestDTO;
import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.service.interfaces.SolicitudPaseoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/solicitudes")
    public List<SolicitudPaseoDTO> findAllSolicitudesPendientes(){
        return solicitudService.getAllPendientes().stream()
                .map(SolicitudPaseoDTO::desdeModelo).toList();
    }

    @GetMapping("/cliente/{id}")
    public List<SolicitudPaseoDTO> getSolicitudesPorCliente(@PathVariable("id") Long id) {
        List<SolicitudPaseo> solicitudes = solicitudService.getSolicitudesDeCliente(id);
        return solicitudes.stream()
                .map(SolicitudPaseoDTO::desdeModelo).toList();
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolicitudPaseoDTO> updateSolicitudPaseo(@PathVariable Long id) {
        solicitudService.aceptarSolicitudPaseo(id);

        SolicitudPaseo solicitud = solicitudService.getSolicitud(id).orElseThrow(() -> new EntityNotFoundException("Solicitud de paseo no encontrada con id " + id));

        return ResponseEntity.ok(SolicitudPaseoDTO.desdeModelo(solicitud));

    }

    @PutMapping("/cancelar/{id}")
    public ResponseEntity<Void> cancelarSolicitud(@PathVariable Long id) {
//      solicitudService.getSolicitud(id).orElseThrow(() -> new EntityNotFoundException("Solicitud de paseo no encontrada con id " + id));

        solicitudService.cancelarSolicitudPaseo(id);

        return ResponseEntity.noContent().build();
    }

}
