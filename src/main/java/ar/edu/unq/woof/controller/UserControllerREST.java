package ar.edu.unq.woof.controller;

import ar.edu.unq.woof.controller.dto.user.LoginResponseDTO;
import ar.edu.unq.woof.controller.dto.user.UserDTO;
import ar.edu.unq.woof.controller.dto.user.UserLoginRequestDTO;
import ar.edu.unq.woof.controller.dto.user.UserRequestDTO;
import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.service.interfaces.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

}
