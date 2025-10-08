package ar.edu.unq.woof.persistence;

import ar.edu.unq.woof.modelo.Resenia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReseniaDAO extends JpaRepository<Resenia, Long> {

    @Query("SELECT r FROM Resenia r WHERE r.idPaseador = :id")
    List<Resenia> findByIdPaseador(@Param("id") Long id);
}
