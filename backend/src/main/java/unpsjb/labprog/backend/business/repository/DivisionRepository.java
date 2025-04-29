package unpsjb.labprog.backend.business.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import unpsjb.labprog.backend.model.Division;

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

}
