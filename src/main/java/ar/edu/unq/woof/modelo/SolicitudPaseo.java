package ar.edu.unq.woof.modelo;

import ar.edu.unq.woof.modelo.enums.EstadoDePago;
import ar.edu.unq.woof.modelo.enums.EstadoSolicitud;
import ar.edu.unq.woof.modelo.enums.TamanoPerro;
import ar.edu.unq.woof.modelo.enums.ZonaOperativa;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class SolicitudPaseo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private ZonaOperativa zona;

    @Column(nullable = false)
    private LocalDateTime horario;

    @Column(nullable = false)
    private String nombrePerro;

    @Column(nullable = false)
    private TamanoPerro tamanoPerro;

    @Column(nullable = false)
    private String raza;

    @Column(nullable = false)
    private EstadoSolicitud estado = EstadoSolicitud.PENDIENTE;

    @Column (nullable = false)
    private EstadoDePago estadoDePago = EstadoDePago.PENDIENTE_DE_PAGO;

    @Column (nullable = false)
    private Long idCliente;

    @Column
    private Long idPaseador;

    public SolicitudPaseo(ZonaOperativa zona, LocalDateTime horario, String nombrePerro, TamanoPerro tamanoPerro, String raza, Long idCliente) {
        this.zona = zona;
        this.horario = horario;
        this.nombrePerro = nombrePerro;
        this.tamanoPerro = tamanoPerro;
        this.raza = raza;
        this.idCliente = idCliente;
    }

}
