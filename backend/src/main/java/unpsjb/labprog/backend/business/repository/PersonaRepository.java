package unpsjb.labprog.backend.business.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Persona;

/**
 * Repositorio para la gestión de entidades Persona. Proporciona métodos para
 * consultas específicas sobre personas.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Repository
public interface PersonaRepository extends JpaRepository<Persona, Integer> {

    /**
     * Busca una persona por su número de DNI.
     *
     * @param dni DNI de la persona a buscar
     * @return Optional con la persona encontrada, vacío si no existe
     */
    Optional<Persona> findByDni(long dni);

    /**
     * Busca una persona por su número de CUIL.
     *
     * @param cuil CUIL de la persona a buscar
     * @return Optional con la persona encontrada, vacío si no existe
     */
    Optional<Persona> findByCuil(String cuil);

    /**
     * Realiza una búsqueda general por DNI, nombre o apellido. La búsqueda es
     * insensible a mayúsculas y permite coincidencias parciales.
     *
     * @param term Término a buscar en DNI, nombre o apellido
     * @return Lista de personas que coinciden con la búsqueda
     */
    @Query("SELECT e FROM Persona e WHERE "
            + "CAST(e.dni AS string) LIKE CONCAT('%', ?1, '%') OR "
            + "UPPER(e.nombre) LIKE CONCAT('%', UPPER(?1), '%') OR "
            + "UPPER(e.apellido) LIKE CONCAT('%', UPPER(?1), '%')")
    List<Persona> search(String term);
}
