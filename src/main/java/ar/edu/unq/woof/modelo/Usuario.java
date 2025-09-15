package ar.edu.unq.woof.modelo;

import ar.edu.unq.woof.modelo.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;


@Setter
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private Integer dni;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String telefono;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false)
    private String contrasena;

    @Column(nullable = false)
    private UserRole rol;

    public Usuario(String nombre, Integer dni, String email, String telefono, String direccion, String contrasena, UserRole rol) {
        this.nombre = nombre;
        this.dni = dni;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
        this.contrasena = contrasena;
        this.rol = rol;
    }
}
