package ar.edu.unq.woof.modelo;

import jakarta.persistence.*;
import lombok.*;


@Setter
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Paseador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    public Paseador(String nombre) {
        this.nombre = nombre;
    }
}
