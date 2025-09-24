package ar.edu.unq.woof.persistence;

import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.modelo.enums.EstadoSolicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudPaseoDAO extends JpaRepository<SolicitudPaseo, Long> {
    @Query("SELECT e FROM SolicitudPaseo e WHERE e.id = :id")
    Optional<SolicitudPaseo> recuperarSolicitudPaseo(@Param("id") Long id);

    @Query("SELECT p FROM SolicitudPaseo p WHERE p.estado= :estado")
    List<SolicitudPaseo> findAllEstado(@Param("estado") EstadoSolicitud estado);

    @Query("SELECT p FROM SolicitudPaseo p WHERE p.id= : id")
    Optional<SolicitudPaseo> findSolicitudPaseoById(@Param("id") Long id);

    List<SolicitudPaseo> findByIdCliente(Long idCliente);
}
