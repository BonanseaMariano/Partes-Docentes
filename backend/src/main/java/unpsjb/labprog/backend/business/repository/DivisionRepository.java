package unpsjb.labprog.backend.business.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import unpsjb.labprog.backend.model.Division;
import unpsjb.labprog.backend.model.enums.Turno;

/**
 * Repositorio para la gestión de entidades Division. Proporciona métodos para
 * consultas específicas sobre divisiones.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public interface DivisionRepository extends JpaRepository<Division, Integer> {

    /**
     * Realiza una búsqueda general por año, número de división, orientación o
     * turno. La búsqueda es insensible a mayúsculas y permite coincidencias
     * parciales.
     *
     * @param term Término a buscar en cualquier campo de la división
     * @return Lista de divisiones que coinciden con la búsqueda
     */
    @Query("SELECT e FROM Division e WHERE "
            + "CAST(e.anio AS string) LIKE ?1 OR "
            + "CAST(e.numDivision AS string) LIKE ?1 OR "
            + "UPPER(e.orientacion) LIKE CONCAT('%', UPPER(?1), '%') OR "
            + "UPPER(e.turno) LIKE CONCAT('%', UPPER(?1), '%')")
    List<Division> search(String term);

    /**
     * Busca una división específica por sus campos únicos. Útil para verificar
     * la existencia de una división con características específicas.
     *
     * @param anio Año académico
     * @param numDivision Número de división
     * @param turno Turno de la división
     * @return Optional con la división encontrada, vacío si no existe
     */
    Optional<Division> findByAnioAndNumDivisionAndTurno(
            Integer anio,
            Integer numDivision,
            Turno turno);
}
