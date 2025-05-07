package unpsjb.labprog.backend.business.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import unpsjb.labprog.backend.model.Division;
import unpsjb.labprog.backend.model.enums.Turno;

/**
 * Repositorio para la entidad Division
 * Proporciona métodos para acceder y manipular los datos de las divisiones
 */
public interface DivisionRepository extends JpaRepository<Division, Integer> {

    /**
     * Busca una división por cualquiera de sus campos
     * 
     * @param term Cadena a buscar en los campos de la división
     * @return Divisiones que coinciden con la búsqueda en cualquier parte del texto
     */
    @Query("SELECT e FROM Division e WHERE " +
            "CAST(e.anio AS string) LIKE ?1 OR " +
            "CAST(e.numDivision AS string) LIKE ?1OR " +
            "UPPER(e.orientacion) LIKE CONCAT('%', UPPER(?1), '%') OR " +
            "UPPER(e.turno) LIKE CONCAT('%', UPPER(?1), '%')")
    List<Division> search(String term);

    /**
     * Busca una división por todos sus campos únicos combinados
     * 
     * @param anio        Año académico
     * @param numDivision Número de división
     * @param turno       Turno de la división
     * @return La división que coincide con todos los criterios o un Optional vacío
     */
    Optional<Division> findByAnioAndNumDivisionAndTurno(
            Integer anio,
            Integer numDivision,
            Turno turno);
}
