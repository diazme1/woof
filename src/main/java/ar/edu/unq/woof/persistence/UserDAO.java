package ar.edu.unq.woof.persistence;

import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.modelo.enums.EstadoValidacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDAO extends JpaRepository<Usuario,Long> {

    @Query("SELECT u FROM Usuario u WHERE u.email=:email")
    public Usuario findByEmail(@Param("email") String email);

    @Query("SELECT u FROM Usuario u WHERE u.estadoValidacion = :estado ")
    public List<Usuario> findByEstadoValidacion(@Param("estado") EstadoValidacion estadoValidacion);
}
