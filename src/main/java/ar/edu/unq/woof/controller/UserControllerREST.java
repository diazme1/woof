package ar.edu.unq.woof.controller;

import ar.edu.unq.woof.controller.dto.user.UserDTO;
import ar.edu.unq.woof.controller.dto.user.UserRequestDTO;
import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.service.interfaces.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
