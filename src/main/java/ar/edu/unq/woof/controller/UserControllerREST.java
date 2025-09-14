package ar.edu.unq.woof.controller;

import ar.edu.unq.woof.controller.dto.user.LoginResponseDTO;
import ar.edu.unq.woof.controller.dto.user.UserDTO;
import ar.edu.unq.woof.controller.dto.user.UserLoginRequestDTO;
import ar.edu.unq.woof.controller.dto.user.UserRequestDTO;
import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.service.interfaces.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequestDTO request){
        Usuario usuario = userService.findByEmail(request.email());
        if(usuario==null || !usuario.getContrasena().equals(request.contrasena())){
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
        String token = UUID.randomUUID().toString();

        return ResponseEntity.ok(new LoginResponseDTO(token, usuario.getNombre(), usuario.getEmail()));

    }

}
