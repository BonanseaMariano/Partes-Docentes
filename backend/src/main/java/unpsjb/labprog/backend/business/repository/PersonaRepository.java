package unpsjb.labprog.backend.business.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Persona;

/**
 * Repositorio para la entidad Persona
 * Proporciona métodos para acceder y manipular los datos de las personas
 */
@Repository
public interface PersonaRepository extends JpaRepository<Persona, Long> {

    @Query("SELECT e FROM Persona e WHERE e.cuil = ?1")
    Optional<Persona> findByCuil(String cuil);

}