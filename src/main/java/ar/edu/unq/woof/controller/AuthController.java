package ar.edu.unq.woof.controller;

import ar.edu.unq.woof.controller.dto.user.LoginResponseDTO;
import ar.edu.unq.woof.controller.dto.user.UserLoginRequestDTO;
import ar.edu.unq.woof.modelo.JwtUtil;
import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.modelo.enums.UserRole;
import ar.edu.unq.woof.service.interfaces.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequestDTO request) {
        Usuario usuario = userService.findByEmail(request.email());
        if (usuario == null || !usuario.getContrasena().equals(request.contrasena())) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
        String token = jwtUtil.generarToken(usuario.getId(), usuario.getEmail());
        return ResponseEntity.ok(new LoginResponseDTO(token, usuario.getNombre(), usuario.getEmail(), usuario.getRol()));
    }


}
