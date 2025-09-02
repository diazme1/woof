package ar.edu.unq.woof.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/hola")
    public String hola() {
        return "Hola Mundo!";
    }

    @GetMapping("/")
    public String home() {
        return "Bienvenido a mi aplicación Woof \uD83D\uDC3E";
    }
}
