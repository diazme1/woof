package ar.edu.unq.woof.persistence;

import ar.edu.unq.woof.modelo.SolicitudPaseo;
import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudPaseoDAO extends JpaRepository<SolicitudPaseo, Integer> {
}
