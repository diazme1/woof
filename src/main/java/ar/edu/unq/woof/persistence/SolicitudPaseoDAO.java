package ar.edu.unq.woof.persistence;

import ar.edu.unq.woof.modelo.SolicitudPaseo;
import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SolicitudPaseoDAO extends JpaRepository<SolicitudPaseo, Long> {
    @Query("SELECT e FROM SolicitudPaseo e WHERE e.id = :id")
    Optional<SolicitudPaseo> recuperarSolicitudPaseo(@Param("id") Long id);
}
