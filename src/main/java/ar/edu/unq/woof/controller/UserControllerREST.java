package ar.edu.unq.woof.controller;

import ar.edu.unq.woof.controller.dto.user.LoginResponseDTO;
import ar.edu.unq.woof.controller.dto.user.UserDTO;
import ar.edu.unq.woof.controller.dto.user.UserLoginRequestDTO;
import ar.edu.unq.woof.controller.dto.user.UserRequestDTO;
import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.service.interfaces.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user")
public class UserControllerREST {

    private final UserService userService;

    public UserControllerREST(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserDTO> savePaseador(@RequestBody UserRequestDTO request){
        Usuario newUsuario = request.aModelo();
        userService.saveUser(newUsuario);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserDTO.desdeModelo(newUsuario));
    }

    @PostMapping("/{id}/validacion")
    public ResponseEntity<String> validarUsuario(
            @PathVariable Long id,
            @RequestParam("fotoDni") MultipartFile fotoDni,
            @RequestParam("cv") MultipartFile cv) throws IOException {

        userService.validarUsuario(id, fotoDni, cv);
        return ResponseEntity.ok("Documentos subidos correctamente. Usuario en proceso de validación.");
    }

    @PutMapping("/{id}/aprobar-validacion")
    public ResponseEntity<String> aprobarValidacion(@PathVariable Long id) {
        userService.aprobarValidacion(id);
        return ResponseEntity.ok("Usuario validado correctamente");
    }

    @PutMapping("/{id}/rechazar-validacion")
    public ResponseEntity<String> rechazarValidacion(@PathVariable Long id) {
        userService.rechazarValidacion(id);
        return ResponseEntity.ok("Usuario rechazado correctamente");
    }

    @GetMapping("/validaciones/pendientes")
    public ResponseEntity<List<UserDTO>> getUsuariosPendientesValidacion() {
        List<Usuario> pendientes = userService.getUsuariosPendientesValidacion();
        List<UserDTO> dtos = pendientes.stream()
                .map(UserDTO::desdeModelo)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}/foto-dni")
    public ResponseEntity<byte[]> getFotoDNI(@PathVariable Long id) throws IOException {
        File file = userService.getFotoDNI(id);

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        byte[] bytes = Files.readAllBytes(file.toPath());
        String mimeType = Files.probeContentType(file.toPath());

        System.out.println(file.toPath());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mimeType))
                .body(bytes);
    }

    @GetMapping("/{id}/cv")
    public ResponseEntity<byte[]> getCV(@PathVariable Long id) throws IOException {
        File file = userService.getCV(id);

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        byte[] bytes = Files.readAllBytes(file.toPath());
        String mimeType = Files.probeContentType(file.toPath());

        System.out.println(file.toPath());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mimeType))
                .body(bytes);
    }

    @GetMapping("/{id}/antiguedad")
    public int getAntiguedad(@PathVariable Long id) {
        return userService.calcularAntiguedad(id);
    }

}
