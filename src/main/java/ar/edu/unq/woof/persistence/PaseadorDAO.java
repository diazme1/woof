package ar.edu.unq.woof.persistence;

import ar.edu.unq.woof.modelo.Paseador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaseadorDAO extends JpaRepository<Paseador,Long> {

}
