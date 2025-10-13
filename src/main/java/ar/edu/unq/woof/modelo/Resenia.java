package ar.edu.unq.woof.modelo;

import ar.edu.unq.woof.modelo.exceptions.PuntajeInvalidoException;
import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Resenia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long idCliente;

    @Column(nullable = false)
    private Long idPaseador;

    @Column(nullable = false)
    private Long idPaseo;

    @Column(nullable = false)
    private Integer puntuacion;

    @Column(nullable = false)
    private String descripcion;

    public Resenia(Long idPaseador, Long idCliente, Long idPaseo, Integer puntuacion, String descripcion) {
        this.idCliente = idCliente;
        this.idPaseador = idPaseador;
        this.idPaseo = idPaseo;
        this.puntuacion = validarPuntuacion(puntuacion);
        this.descripcion = descripcion;
    }

    protected Integer validarPuntuacion(Integer puntuacion) {
        if (puntuacion < 0 || puntuacion > 5) {
            throw new PuntajeInvalidoException();
        }
        return puntuacion;
    }
}
