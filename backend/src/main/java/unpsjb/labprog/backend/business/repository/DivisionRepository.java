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
     * Busca una división por su orientación
     * 
     * @param term Cadena a buscar en la orientación
     * @return Divisiones que coinciden con la búsqueda
     */
    @Query("SELECT e FROM Division e WHERE UPPER(e.orientacion) LIKE ?1")
    List<Division> search(String term);

    /**
     * Busca una división por todos sus campos únicos combinados
     * 
     * @param anio        Año académico
     * @param numDivision Número de división
     * @param orientacion Orientación académica
     * @param turno       Turno de la división
     * @return La división que coincide con todos los criterios o un Optional vacío
     */
    Optional<Division> findByAnioAndNumDivisionAndOrientacionAndTurno(
            Integer anio,
            Integer numDivision,
            String orientacion,
            Turno turno);
}
