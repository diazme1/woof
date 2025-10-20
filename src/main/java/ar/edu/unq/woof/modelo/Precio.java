package ar.edu.unq.woof.modelo;

import ar.edu.unq.woof.modelo.exceptions.PrecioInvalidoException;
import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@Entity
public class Precio {

    @Id
    private Long id=1L;

    @Column(nullable = false)
    private Float precio;

    public Precio(Float precio) {
        if (precio==null || precio<0){
            throw new PrecioInvalidoException();
        }
        this.precio = precio;
    }
}
