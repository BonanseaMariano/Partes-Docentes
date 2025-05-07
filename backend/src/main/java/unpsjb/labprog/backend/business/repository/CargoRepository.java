package unpsjb.labprog.backend.business.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * Repositorio para la entidad Cargo
 * Proporciona métodos para acceder y manipular los datos de los cargos
 */
@Repository
public interface CargoRepository extends JpaRepository<Cargo, Integer> {
    /**
     * Busca un cargo por cualquiera de sus campos o por los campos de la División
     * asociada
     * 
     * @param term Cadena a buscar en los campos del cargo o de su división asociada
     * @return Cargos que coinciden con la búsqueda
     */
    @Query("SELECT c FROM Cargo c LEFT JOIN c.division d WHERE " +
            "UPPER(c.nombre) LIKE CONCAT('%', UPPER(?1), '%') OR " +
            "CAST(c.cargaHoraria AS string) LIKE ?1 OR " +
            "UPPER(c.tipoDesignacion) LIKE CONCAT('%', UPPER(?1), '%') OR " +
            "(d IS NOT NULL AND (" +
            "CAST(d.anio AS string) LIKE ?1 OR " +
            "CAST(d.numDivision AS string) LIKE ?1 OR " +
            "UPPER(d.orientacion) LIKE CONCAT('%', UPPER(?1), '%') OR " +
            "UPPER(d.turno) LIKE CONCAT('%', UPPER(?1), '%')))")
    List<Cargo> search(String term);

    /**
     * Busca cargos por su nombre y tipo de designación
     * 
     * @param nombre          Nombre del cargo a buscar
     * @param tipoDesignacion Tipo de designación del cargo a buscar
     * @return Lista de cargos que coinciden con el nombre y tipo de designación
     */
    List<Cargo> findByNombreAndTipoDesignacion(String nombre, TipoDesignacion tipoDesignacion);

}
