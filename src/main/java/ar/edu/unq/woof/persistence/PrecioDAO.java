package ar.edu.unq.woof.persistence;

import ar.edu.unq.woof.modelo.Precio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrecioDAO extends JpaRepository<Precio,Long> {
}
