package ar.edu.unq.woof.persistence;

import ar.edu.unq.woof.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDAO extends JpaRepository<Usuario,Long> {

}
